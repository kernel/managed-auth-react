import { useCallback, useEffect, useRef, useState } from "react";
import {
  exchangeHandoffCode,
  ManagedAuthApiError,
  retrieveManagedAuth,
  submitFieldValues,
  submitMFASelection,
  submitSignInOption,
  submitSSOButton,
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

const POLL_INTERVAL_MS = 2000;
const POST_SUBMIT_DELAY_MS = 2000;

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
 * handoff code exchange, polling, submissions, UI-state derivation.
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

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackFiredRef = useRef<{ success: boolean; error: boolean }>({
    success: false,
    error: false,
  });
  // Tracks the in-flight (or completed) bootstrap exchange so the second
  // mount of a React 18+ Strict Mode mount → cleanup → mount cycle can
  // adopt the result of the first mount's exchange instead of refiring it
  // with a now-consumed handoff code. Keyed by ``{ key }`` (not the raw
  // string) so the *identity* of the object identifies a single exchange:
  // a real prop change replaces the object, naturally invalidating the
  // previous async's setState calls via the staleness check below.
  const exchangeRef = useRef<{ key: string } | null>(null);

  const stopPolling = useCallback(() => {
    if (pollDelayRef.current) {
      clearTimeout(pollDelayRef.current);
      pollDelayRef.current = null;
    }
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollOnce = useCallback(
    async (tokenOverride?: string) => {
      const token = tokenOverride ?? jwt;
      if (!token) return;
      try {
        const newState = await retrieveManagedAuth(sessionId, token, options);
        setState(newState);
        setSubmitError(null);

        const nextUI = deriveUIState(newState);
        setUIState(nextUI);

        if (nextUI === "success") {
          if (!callbackFiredRef.current.success) {
            callbackFiredRef.current.success = true;
            onSuccess?.({
              profileName: newState.profile_name,
              domain: newState.domain,
            });
          }
          stopPolling();
        } else if (nextUI === "error" || nextUI === "expired") {
          if (!callbackFiredRef.current.error) {
            callbackFiredRef.current.error = true;
            onError?.({
              code: newState.error_code ?? undefined,
              message:
                newState.error_message ||
                newState.website_error ||
                (nextUI === "expired" ? "Session expired" : "Login failed"),
            });
          }
          stopPolling();
        }
      } catch (err) {
        const apiErr = err as ManagedAuthApiError;
        if (apiErr?.status === 401 || apiErr?.status === 410) {
          stopPolling();
          setUIState("expired");
          if (!callbackFiredRef.current.error) {
            callbackFiredRef.current.error = true;
            onError?.({ message: "Session expired" });
          }
        }
      }
    },
    [jwt, onError, onSuccess, options, sessionId, stopPolling],
  );

  const startPolling = useCallback(
    (immediate = true, delayMs = 0, tokenOverride?: string) => {
      if (pollRef.current) return;
      const begin = () => {
        if (pollRef.current) return;
        pollRef.current = setInterval(() => {
          void pollOnce(tokenOverride);
        }, POLL_INTERVAL_MS);
        if (immediate) void pollOnce(tokenOverride);
      };
      if (delayMs > 0) {
        pollDelayRef.current = setTimeout(begin, delayMs);
      } else {
        begin();
      }
    },
    [pollOnce],
  );

  useEffect(() => {
    // Strict-Mode-safe one-shot init. Under React 18+ Strict Mode in dev,
    // effects run mount → cleanup → mount. The handoff code is one-shot
    // server-side, so the original code refired ``exchangeHandoffCode``
    // on the second mount and landed in the error state.
    //
    // A closure-local ``cancelled`` flag doesn't work as a guard either:
    // the cleanup would flip it to true and the first mount's in-flight
    // exchange would skip its own ``setJwt`` on resolve, leaving the
    // component silently stuck with jwt === null (Cursor #10 review).
    //
    // Instead, store an object on a ref. The second mount sees the same
    // ``key`` and short-circuits without touching the ref — so the first
    // mount's async resolves, the ref-identity check passes, and the JWT
    // is committed. A real (sessionId, handoffCode) change replaces the
    // ref with a new object; the previous async's staleness check then
    // fails by identity and its setState calls are dropped cleanly.
    const exchangeKey = `${sessionId}::${handoffCode}`;
    if (exchangeRef.current?.key === exchangeKey) return;
    const ref = { key: exchangeKey };
    exchangeRef.current = ref;

    (async () => {
      try {
        const token = await exchangeHandoffCode(
          sessionId,
          handoffCode,
          options,
        );
        if (exchangeRef.current !== ref) return;
        setJwt(token);
        const initial = await retrieveManagedAuth(sessionId, token, options);
        if (exchangeRef.current !== ref) return;
        setState(initial);
        const derived = deriveUIState(initial);
        if (
          derived === "success" ||
          derived === "expired" ||
          derived === "error"
        ) {
          setUIState(derived);
          if (derived === "success" && !callbackFiredRef.current.success) {
            callbackFiredRef.current.success = true;
            onSuccess?.({
              profileName: initial.profile_name,
              domain: initial.domain,
            });
          } else if (
            (derived === "error" || derived === "expired") &&
            !callbackFiredRef.current.error
          ) {
            callbackFiredRef.current.error = true;
            onError?.({
              code: initial.error_code ?? undefined,
              message:
                initial.error_message ||
                initial.website_error ||
                (derived === "expired" ? "Session expired" : "Login failed"),
            });
          }
        } else if (autoStart) {
          setUIState("discovering");
          startPolling(true, 0, token);
        } else {
          setUIState("prime");
        }
      } catch (err) {
        if (exchangeRef.current !== ref) return;
        const message =
          err instanceof Error ? err.message : "Failed to start session";
        setInitError(message);
        setUIState("error");
        if (!callbackFiredRef.current.error) {
          callbackFiredRef.current.error = true;
          onError?.({ message });
        }
      }
    })();
    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, handoffCode]);

  const startFlow = useCallback(() => {
    if (!jwt) return;
    setUIState("discovering");
    startPolling(true, 0);
  }, [jwt, startPolling]);

  const submit = useCallback(
    async (fn: () => Promise<void>, onFail: string) => {
      if (!jwt) return;
      setIsSubmitting(true);
      setSubmitError(null);
      setUIState("submitting");
      stopPolling();
      try {
        await fn();
        startPolling(false, POST_SUBMIT_DELAY_MS);
      } catch (err) {
        const msg = err instanceof Error ? err.message : onFail;
        setSubmitError(msg);
        setUIState((current) =>
          current === "success" || current === "expired" || current === "error"
            ? current
            : "awaiting_input",
        );
        startPolling();
      } finally {
        setIsSubmitting(false);
      }
    },
    [jwt, startPolling, stopPolling],
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
