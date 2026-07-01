import { useCallback, useEffect, useRef, useState } from "react";
import {
  exchangeHandoffCode,
  ManagedAuthApiError,
  retrieveManagedAuth,
  streamManagedAuthEvents,
  submitFieldValues,
  submitCanonicalFieldValues,
  submitMFASelection,
  submitSelectedChoice,
  submitSignInOption,
  submitSSOButton,
  type ApiClientOptions,
  type ManagedAuthStateEventData,
} from "../lib/api";
import type {
  AuthErrorPayload,
  AuthSuccessPayload,
  DiscoveredField,
  ManagedAuthChoice,
  ManagedAuthField,
  ManagedAuthResponse,
  MFAType,
  MFAOption,
  SignInOption,
  SSOButton,
  UIState,
} from "../lib/types";

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 15000;

function deriveUIState(state: ManagedAuthResponse): UIState {
  if (state.flow_status === "FAILED" || state.flow_status === "CANCELED") {
    return "error";
  }
  if (state.flow_status === "EXPIRED") return "expired";
  if (state.flow_status === "SUCCESS") return "success";

  switch (state.flow_step) {
    case "DISCOVERING":
      return "discovering";
    case "AWAITING_INPUT":
      return "awaiting_input";
    case "AWAITING_EXTERNAL_ACTION":
      return "awaiting_external_action";
    case "SUBMITTING":
      return "submitting";
    default:
      return "discovering";
  }
}

function isTerminal(uiState: UIState): boolean {
  return uiState === "success" || uiState === "expired" || uiState === "error";
}

function mergeStateEvent(
  base: ManagedAuthResponse,
  ev: ManagedAuthStateEventData,
): ManagedAuthResponse {
  return {
    ...base,
    flow_status: ev.flow_status,
    flow_step: ev.flow_step,
    flow_type: ev.flow_type ?? base.flow_type ?? null,
    fields: ev.fields ?? base.fields ?? null,
    choices: ev.choices ?? base.choices ?? null,
    discovered_fields: ev.discovered_fields ?? base.discovered_fields ?? null,
    pending_sso_buttons:
      ev.pending_sso_buttons ?? base.pending_sso_buttons ?? null,
    mfa_options: ev.mfa_options ?? base.mfa_options ?? null,
    sign_in_options: ev.sign_in_options ?? base.sign_in_options ?? null,
    external_action_message: ev.external_action_message ?? null,
    website_error: ev.website_error ?? null,
    error_message: ev.error_message ?? null,
    error_code: ev.error_code ?? null,
    post_login_url: ev.post_login_url ?? base.post_login_url ?? null,
    live_view_url: ev.live_view_url ?? base.live_view_url ?? null,
    hosted_url: ev.hosted_url ?? base.hosted_url ?? null,
  };
}

function fieldTypeToDiscoveredType(
  field: ManagedAuthField,
): DiscoveredField["type"] {
  switch (field.type) {
    case "identifier":
      return "email";
    case "totp_code":
      return "totp";
    case "totp_secret":
      return "text";
    default:
      return field.type;
  }
}

function fieldsFromCanonical(
  fields?: ManagedAuthField[] | null,
): DiscoveredField[] | null {
  if (!fields?.length) return null;
  return fields.map((field) => ({
    id: field.id,
    ref: field.ref,
    name: field.id,
    type: fieldTypeToDiscoveredType(field),
    label: field.label || field.ref,
    required: field.required ?? true,
  }));
}

function ssoButtonsFromCanonical(
  choices?: ManagedAuthChoice[] | null,
): SSOButton[] | null {
  if (!choices?.length) return null;
  const buttons = choices
    .filter((choice) => choice.type === "sso_provider")
    .map((choice) => ({
      id: choice.id,
      provider: choice.id,
      selector: choice.observed_selector || choice.id,
      label: choice.label,
    }));
  return buttons.length ? buttons : null;
}

function normalizeMFAChoiceId(id: string): MFAType {
  switch (id.trim().toLowerCase()) {
    case "sms_code":
    case "sms":
      return "sms";
    case "email_code":
    case "email":
      return "email";
    case "totp_code":
    case "totp":
    case "authenticator":
    case "authenticator_app":
      return "totp";
    case "phone_call":
    case "call":
      return "call";
    case "push":
      return "push";
    case "password":
      return "password";
    case "passkey":
      return "passkey";
    case "switch":
      return "switch";
    default:
      return "other";
  }
}

function mfaOptionsFromCanonical(
  choices?: ManagedAuthChoice[] | null,
): MFAOption[] | null {
  if (!choices?.length) return null;
  const options = choices
    .filter((choice) => choice.type === "mfa_method")
    .map((choice) => ({
      type: normalizeMFAChoiceId(choice.id),
      label: choice.label,
      description: choice.description ?? undefined,
    }));
  return options.length ? options : null;
}

function signInOptionsFromCanonical(
  choices?: ManagedAuthChoice[] | null,
): SignInOption[] | null {
  if (!choices?.length) return null;
  const options = choices
    .filter(
      (choice) =>
        choice.type !== "sso_provider" && choice.type !== "mfa_method",
    )
    .map((choice) => ({
      id: choice.id,
      label: choice.label,
      description:
        choice.description ?? choice.context ?? choice.display_text ?? null,
    }));
  return options.length ? options : null;
}

function normalizeManagedAuthState(
  state: ManagedAuthResponse,
): ManagedAuthResponse {
  return {
    ...state,
    // Prefer the canonical contract when present; legacy fields stay as fallback
    // during the deprecation period.
    discovered_fields:
      fieldsFromCanonical(state.fields) ?? state.discovered_fields,
    pending_sso_buttons:
      ssoButtonsFromCanonical(state.choices) ?? state.pending_sso_buttons,
    mfa_options: mfaOptionsFromCanonical(state.choices) ?? state.mfa_options,
    sign_in_options:
      signInOptionsFromCanonical(state.choices) ?? state.sign_in_options,
  };
}

export interface ManagedAuthSessionOptions extends ApiClientOptions {
  sessionId: string;
  handoffCode: string;
  onSuccess?: (payload: AuthSuccessPayload) => void;
  onError?: (payload: AuthErrorPayload) => void;
  /** Skip the consent step and start discovery immediately. */
  autoStart?: boolean;
}

export interface ManagedAuthSessionValue {
  state: ManagedAuthResponse | null;
  uiState: UIState;
  isSubmitting: boolean;
  isReconnecting: boolean;
  submitError: string | null;
  initError: string | null;
  startFlow: () => void;
  submitFields: (credentials: Record<string, string>) => Promise<void>;
  submitSSO: (button: SSOButton) => Promise<void>;
  submitMFA: (mfaType: MFAType) => Promise<void>;
  submitSignIn: (optionId: string) => Promise<void>;
}

/**
 * Internal hook that owns the full state machine for a managed auth session —
 * handoff code exchange, SSE subscription, submissions, UI-state derivation.
 */
export function useManagedAuthSession(
  options: ManagedAuthSessionOptions,
): ManagedAuthSessionValue {
  const { sessionId, handoffCode, onSuccess, onError, autoStart } = options;

  const [jwt, setJwt] = useState<string | null>(null);
  const [state, setState] = useState<ManagedAuthResponse | null>(null);
  const [uiState, setUIState] = useState<UIState>("prime");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  const stateRef = useRef<ManagedAuthResponse | null>(null);
  const disconnectRef = useRef<(() => void) | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const terminalRef = useRef(false);
  const generationRef = useRef(0);
  const callbackFiredRef = useRef<{ success: boolean; error: boolean }>({
    success: false,
    error: false,
  });
  // Tracks the in-flight bootstrap exchange. ``key`` identifies which
  // (sessionId, handoffCode) pair it belongs to; ``active`` is false
  // between cleanup and the matching-key remount. See the effect below
  // for the invariants these fields enforce.
  const exchangeRef = useRef<{ key: string; active: boolean } | null>(null);

  const fireSuccessOnce = useCallback(
    (payload: AuthSuccessPayload) => {
      if (callbackFiredRef.current.success) return;
      callbackFiredRef.current.success = true;
      onSuccess?.(payload);
    },
    [onSuccess],
  );

  const fireErrorOnce = useCallback(
    (payload: AuthErrorPayload) => {
      if (callbackFiredRef.current.error) return;
      callbackFiredRef.current.error = true;
      onError?.(payload);
    },
    [onError],
  );

  const disconnectStream = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (disconnectRef.current) {
      disconnectRef.current();
      disconnectRef.current = null;
    }
  }, []);

  const connectStream = useCallback(
    (token: string) => {
      disconnectStream();
      if (terminalRef.current) return;

      const handleStateEvent = (ev: ManagedAuthStateEventData) => {
        reconnectAttemptsRef.current = 0;
        setIsReconnecting(false);
        setSubmitError(null);
        const base = stateRef.current;
        if (!base) return;
        const merged = normalizeManagedAuthState(mergeStateEvent(base, ev));
        stateRef.current = merged;
        setState(merged);
        const nextUI = deriveUIState(merged);
        setUIState(nextUI);
        if (nextUI === "success") {
          terminalRef.current = true;
          fireSuccessOnce({
            profileName: merged.profile_name,
            domain: merged.domain,
          });
          disconnectStream();
        } else if (nextUI === "error" || nextUI === "expired") {
          terminalRef.current = true;
          fireErrorOnce({
            code: merged.error_code ?? undefined,
            message:
              merged.error_message ||
              merged.website_error ||
              (nextUI === "expired" ? "Session expired" : "Login failed"),
          });
          disconnectStream();
        }
      };

      const scheduleReconnect = () => {
        if (terminalRef.current) return;
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
        setIsReconnecting(true);
        const attempt = reconnectAttemptsRef.current++;
        const delay = Math.min(
          RECONNECT_BASE_MS * Math.pow(2, attempt),
          RECONNECT_MAX_MS,
        );
        reconnectTimerRef.current = setTimeout(() => {
          reconnectTimerRef.current = null;
          void resyncAndConnect(token);
        }, delay);
      };

      const resyncAndConnect = async (t: string) => {
        const gen = generationRef.current;
        if (terminalRef.current) return;
        try {
          const fresh = normalizeManagedAuthState(
            await retrieveManagedAuth(sessionId, t, options),
          );
          if (gen !== generationRef.current) return;
          if (terminalRef.current) return;
          stateRef.current = fresh;
          setState(fresh);
          const derived = deriveUIState(fresh);
          setUIState(derived);
          if (isTerminal(derived)) {
            terminalRef.current = true;
            setIsReconnecting(false);
            if (derived === "success") {
              fireSuccessOnce({
                profileName: fresh.profile_name,
                domain: fresh.domain,
              });
            } else {
              fireErrorOnce({
                code: fresh.error_code ?? undefined,
                message:
                  fresh.error_message ||
                  fresh.website_error ||
                  (derived === "expired" ? "Session expired" : "Login failed"),
              });
            }
            return;
          }
          connectStream(t);
        } catch (err) {
          if (gen !== generationRef.current) return;
          const status =
            err instanceof ManagedAuthApiError ? err.status : undefined;
          if (status === 401 || status === 410) {
            terminalRef.current = true;
            setIsReconnecting(false);
            setUIState("expired");
            fireErrorOnce({ message: "Session expired" });
            return;
          }
          scheduleReconnect();
        }
      };

      disconnectRef.current = streamManagedAuthEvents(
        sessionId,
        token,
        {
          onState: handleStateEvent,
          onError: (err) => {
            disconnectRef.current = null;
            if (err.status === 401 || err.status === 410) {
              terminalRef.current = true;
              setIsReconnecting(false);
              setUIState("expired");
              fireErrorOnce({ message: "Session expired" });
              return;
            }
            if (err.fatal) {
              terminalRef.current = true;
              setIsReconnecting(false);
              setUIState("error");
              fireErrorOnce({ message: err.message });
              return;
            }
            scheduleReconnect();
          },
          onClose: () => {
            disconnectRef.current = null;
            if (terminalRef.current) return;
            scheduleReconnect();
          },
        },
        options,
      );
    },
    [disconnectStream, fireErrorOnce, fireSuccessOnce, options, sessionId],
  );

  useEffect(() => {
    // Strict-Mode-safe one-shot init. Under React 18+ Strict Mode in dev,
    // effects run mount → cleanup → mount; the handoff code is one-shot
    // server-side, so a naive remount refires the exchange against an
    // already-consumed code. Three invariants make this safe:
    //
    //   1. Guard the exchange by ref identity, not a closure-local
    //      ``cancelled`` flag — a closure flag set by the synthetic
    //      cleanup would orphan the first mount's in-flight result.
    //   2. Track an ``active`` flag on the ref so the async can
    //      distinguish a real unmount (active stays false) from a
    //      Strict Mode unmount/remount (active flips false → true
    //      synchronously before the async resolves).
    //   3. Always return the cleanup, even on the short-circuit path —
    //      React only keeps the most recent effect's cleanup, so a bare
    //      ``return`` from the second mount would orphan ``disconnectStream``
    //      and leak the connection at real unmount.
    const exchangeKey = `${sessionId}::${handoffCode}`;
    const cleanup = () => {
      if (exchangeRef.current?.key === exchangeKey) {
        exchangeRef.current.active = false;
      }
      generationRef.current++;
      disconnectStream();
    };

    if (exchangeRef.current?.key === exchangeKey) {
      exchangeRef.current.active = true;
      return cleanup;
    }

    terminalRef.current = false;
    reconnectAttemptsRef.current = 0;
    callbackFiredRef.current = { success: false, error: false };

    const ref = { key: exchangeKey, active: true };
    exchangeRef.current = ref;

    (async () => {
      try {
        const token = await exchangeHandoffCode(
          sessionId,
          handoffCode,
          options,
        );
        if (exchangeRef.current !== ref || !ref.active) return;
        setJwt(token);
        const initial = normalizeManagedAuthState(
          await retrieveManagedAuth(sessionId, token, options),
        );
        if (exchangeRef.current !== ref || !ref.active) return;
        stateRef.current = initial;
        setState(initial);
        const derived = deriveUIState(initial);
        if (isTerminal(derived)) {
          terminalRef.current = true;
          setUIState(derived);
          if (derived === "success") {
            fireSuccessOnce({
              profileName: initial.profile_name,
              domain: initial.domain,
            });
          } else {
            fireErrorOnce({
              code: initial.error_code ?? undefined,
              message:
                initial.error_message ||
                initial.website_error ||
                (derived === "expired" ? "Session expired" : "Login failed"),
            });
          }
        } else if (autoStart) {
          setUIState("discovering");
          connectStream(token);
        } else {
          setUIState("prime");
        }
      } catch (err) {
        if (exchangeRef.current !== ref || !ref.active) return;
        const message =
          err instanceof Error ? err.message : "Failed to start session";
        setInitError(message);
        setUIState("error");
        terminalRef.current = true;
        fireErrorOnce({ message });
      }
    })();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, handoffCode]);

  const startFlow = useCallback(() => {
    if (!jwt) return;
    setUIState("discovering");
    connectStream(jwt);
  }, [jwt, connectStream]);

  const submit = useCallback(
    async (fn: () => Promise<void>, onFail: string) => {
      if (!jwt) return;
      setIsSubmitting(true);
      setSubmitError(null);
      setUIState("submitting");
      try {
        await fn();
      } catch (err) {
        const msg = err instanceof Error ? err.message : onFail;
        setSubmitError(msg);
        setUIState((current) =>
          isTerminal(current) ? current : "awaiting_input",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [jwt],
  );

  const submitFields = useCallback(
    async (credentials: Record<string, string>) => {
      if (!jwt) return;
      const hasCanonicalFields = (stateRef.current?.fields?.length ?? 0) > 0;
      return submit(
        () =>
          hasCanonicalFields
            ? submitCanonicalFieldValues(sessionId, jwt, credentials, options)
            : submitFieldValues(sessionId, jwt, credentials, options),
        "Failed to submit credentials",
      );
    },
    [jwt, sessionId, submit, options],
  );

  const submitSSO = useCallback(
    async (button: SSOButton) => {
      if (!jwt) return;
      return submit(
        () =>
          button.id
            ? submitSelectedChoice(sessionId, jwt, button.id, options)
            : submitSSOButton(sessionId, jwt, button.selector, options),
        "Failed to initiate SSO login",
      );
    },
    [jwt, sessionId, submit, options],
  );

  const submitMFA = useCallback(
    async (mfaType: MFAType) => {
      if (!jwt) return;
      return submit(
        () => submitMFASelection(sessionId, jwt, mfaType, options),
        "Failed to select verification method",
      );
    },
    [jwt, sessionId, submit, options],
  );

  const submitSignIn = useCallback(
    async (optionId: string) => {
      if (!jwt) return;
      return submit(
        () => submitSignInOption(sessionId, jwt, optionId, options),
        "Failed to select option",
      );
    },
    [jwt, sessionId, submit, options],
  );

  return {
    state,
    uiState,
    isSubmitting,
    isReconnecting,
    submitError,
    initError,
    startFlow,
    submitFields,
    submitSSO,
    submitMFA,
    submitSignIn,
  };
}
