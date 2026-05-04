import { useCallback, useEffect, useRef, useState } from "react";
import {
  exchangeHandoffCode,
  retrieveManagedAuth,
  streamManagedAuthEvents,
  submitFieldValues,
  submitMFASelection,
  submitSignInOption,
  submitSSOButton,
  type ApiClientOptions,
  type ManagedAuthStateEventData,
} from "../lib/api";
import type {
  AuthErrorPayload,
  AuthSuccessPayload,
  ManagedAuthResponse,
  MFAType,
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
    discovered_fields: ev.discovered_fields ?? null,
    pending_sso_buttons: ev.pending_sso_buttons ?? null,
    mfa_options: ev.mfa_options ?? null,
    sign_in_options: ev.sign_in_options ?? null,
    external_action_message: ev.external_action_message ?? null,
    website_error: ev.website_error ?? null,
    error_message: ev.error_message ?? null,
    error_code: ev.error_code ?? null,
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  const stateRef = useRef<ManagedAuthResponse | null>(null);
  const disconnectRef = useRef<(() => void) | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const terminalRef = useRef(false);
  const callbackFiredRef = useRef<{ success: boolean; error: boolean }>({
    success: false,
    error: false,
  });

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
      if (terminalRef.current) return;
      if (disconnectRef.current) return;

      const handleStateEvent = (ev: ManagedAuthStateEventData) => {
        reconnectAttemptsRef.current = 0;
        setSubmitError(null);
        const base = stateRef.current;
        if (!base) return;
        const merged = mergeStateEvent(base, ev);
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
        const attempt = reconnectAttemptsRef.current++;
        const delay = Math.min(
          RECONNECT_BASE_MS * Math.pow(2, attempt),
          RECONNECT_MAX_MS,
        );
        reconnectTimerRef.current = setTimeout(() => {
          reconnectTimerRef.current = null;
          connectStream(token);
        }, delay);
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
              setUIState("expired");
              fireErrorOnce({ message: "Session expired" });
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
    let cancelled = false;
    terminalRef.current = false;
    reconnectAttemptsRef.current = 0;
    callbackFiredRef.current = { success: false, error: false };

    (async () => {
      try {
        const token = await exchangeHandoffCode(
          sessionId,
          handoffCode,
          options,
        );
        if (cancelled) return;
        setJwt(token);
        const initial = await retrieveManagedAuth(sessionId, token, options);
        if (cancelled) return;
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
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to start session";
        setInitError(message);
        setUIState("error");
        terminalRef.current = true;
        fireErrorOnce({ message });
      }
    })();
    return () => {
      cancelled = true;
      disconnectStream();
    };
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
      return submit(
        () => submitFieldValues(sessionId, jwt, credentials, options),
        "Failed to submit credentials",
      );
    },
    [jwt, sessionId, submit, options],
  );

  const submitSSO = useCallback(
    async (button: SSOButton) => {
      if (!jwt) return;
      return submit(
        () => submitSSOButton(sessionId, jwt, button.selector, options),
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
    submitError,
    initError,
    startFlow,
    submitFields,
    submitSSO,
    submitMFA,
    submitSignIn,
  };
}
