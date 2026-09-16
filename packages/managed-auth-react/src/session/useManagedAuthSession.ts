import { useCallback, useEffect, useRef, useState } from "react";
import {
  exchangeHandoffCode,
  ManagedAuthApiError,
  retrieveManagedAuth,
  submitManagedAuth,
  type ApiClientOptions,
} from "../lib/api";
import type {
  AuthErrorPayload,
  AuthSuccessPayload,
  ManagedAuthResponse,
  MFAType,
  SSOButton,
  UIState,
} from "../lib/types";
import { normalizeManagedAuthState } from "./state";
import { createSessionTransport } from "./transport";
import {
  buildFieldSubmission,
  buildMFASubmission,
  buildSignInSubmission,
  buildSSOSubmission,
} from "./submission";

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
  isInitializing: boolean;
  isSubmitting: boolean;
  isReconnecting: boolean;
  submitError: string | null;
  initError: string | null;
  startFlow: () => void;
  submitFields: (credentials: Record<string, string>) => Promise<void>;
  submitSSO: (button: SSOButton) => Promise<void>;
  submitMFA: (mfaType: MFAType, choiceId?: string) => Promise<void>;
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
  const [uiState, setUIState] = useState<UIState>(
    autoStart ? "discovering" : "prime",
  );
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  const stateRef = useRef<ManagedAuthResponse | null>(null);
  const transportRef = useRef<ReturnType<typeof createSessionTransport> | null>(
    null,
  );
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
    transportRef.current?.stop();
  }, []);

  const applyState = useCallback(
    (next: ManagedAuthResponse): UIState => {
      stateRef.current = next;
      setState(next);
      const nextUI = deriveUIState(next);
      setUIState(nextUI);

      if (nextUI === "success") {
        setIsReconnecting(false);
        fireSuccessOnce({
          profileName: next.profile_name,
          domain: next.domain,
        });
        disconnectStream();
      } else if (nextUI === "error" || nextUI === "expired") {
        setIsReconnecting(false);
        fireErrorOnce({
          code: next.error_code ?? undefined,
          message:
            next.error_message ||
            next.website_error ||
            (nextUI === "expired" ? "Session expired" : "Login failed"),
        });
        disconnectStream();
      }

      return nextUI;
    },
    [disconnectStream, fireErrorOnce, fireSuccessOnce],
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

    callbackFiredRef.current = { success: false, error: false };
    stateRef.current = null;
    setJwt(null);
    setState(null);
    setUIState(autoStart ? "discovering" : "prime");
    setIsInitializing(true);
    setIsSubmitting(false);
    setIsReconnecting(false);
    setSubmitError(null);
    setInitError(null);

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
        setIsInitializing(false);
        transportRef.current = createSessionTransport({
          sessionId,
          token,
          api: options,
          initial,
          onState: (next) => {
            setSubmitError(null);
            return applyState(next);
          },
          onFailure: (ui, message) => {
            setUIState(ui);
            fireErrorOnce({ message });
          },
          onReconnecting: setIsReconnecting,
        });
        const derived = applyState(initial);
        if (!isTerminal(derived)) {
          if (autoStart) {
            transportRef.current.start();
          } else {
            setUIState("prime");
          }
        }
      } catch (err) {
        if (exchangeRef.current !== ref || !ref.active) return;
        const message =
          err instanceof Error ? err.message : "Failed to start session";
        setIsInitializing(false);
        setInitError(message);
        setUIState("error");
        fireErrorOnce({ message });
      }
    })();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, handoffCode]);

  const startFlow = useCallback(() => {
    if (!jwt) return;
    // The prime step can outlive discovery: the session may already be
    // awaiting input by the time the user clicks through. Derive from the
    // state we hold instead of assuming discovery is still running, or a
    // ready form is replaced by a spinner with no event left to clear it.
    const current = stateRef.current;
    setUIState(current ? deriveUIState(current) : "discovering");
    transportRef.current?.start();
  }, [jwt]);

  const submit = useCallback(
    async (fn: () => Promise<void>, onFail: string) => {
      if (!jwt) return;
      const generation = generationRef.current;
      const isActive = () =>
        generation === generationRef.current &&
        exchangeRef.current?.active === true;

      const transport = transportRef.current;
      transport?.beginSubmission();
      setIsSubmitting(true);
      setSubmitError(null);
      setUIState("submitting");
      try {
        await fn();
      } catch (err) {
        if (!isActive()) return;
        const msg = err instanceof Error ? err.message : onFail;
        if (
          err instanceof ManagedAuthApiError &&
          err.code === "stale_interaction"
        ) {
          await transport?.resync();
          if (!isActive()) return;
          setSubmitError(msg);
          setUIState((current) =>
            current === "submitting" && stateRef.current
              ? deriveUIState(stateRef.current)
              : current,
          );
          return;
        }
        setSubmitError(msg);
        setUIState((current) =>
          isTerminal(current) ? current : "awaiting_input",
        );
      } finally {
        if (isActive()) {
          transport?.endSubmission();
          setIsSubmitting(false);
        }
      }
    },
    [jwt],
  );

  const submitFields = useCallback(
    async (credentials: Record<string, string>) => {
      if (!jwt) return;
      return submit(
        () =>
          submitManagedAuth(
            sessionId,
            jwt,
            buildFieldSubmission(stateRef.current, credentials),
            options,
          ),
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
          submitManagedAuth(
            sessionId,
            jwt,
            buildSSOSubmission(stateRef.current, button),
            options,
          ),
        "Failed to initiate SSO login",
      );
    },
    [jwt, sessionId, submit, options],
  );

  const submitMFA = useCallback(
    async (mfaType: MFAType, choiceId?: string) => {
      if (!jwt) return;
      return submit(
        () =>
          submitManagedAuth(
            sessionId,
            jwt,
            buildMFASubmission(stateRef.current, mfaType, choiceId),
            options,
          ),
        "Failed to select verification method",
      );
    },
    [jwt, sessionId, submit, options],
  );

  const submitSignIn = useCallback(
    async (optionId: string) => {
      if (!jwt) return;
      return submit(
        () =>
          submitManagedAuth(
            sessionId,
            jwt,
            buildSignInSubmission(stateRef.current, optionId),
            options,
          ),
        "Failed to select option",
      );
    },
    [jwt, sessionId, submit, options],
  );

  return {
    state,
    uiState,
    isInitializing,
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
