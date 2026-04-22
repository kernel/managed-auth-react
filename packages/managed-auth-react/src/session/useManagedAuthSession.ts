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
  const stateRef = useRef<ManagedAuthResponse | null>(null);
  const callbackFiredRef = useRef<{ success: boolean; error: boolean }>({
    success: false,
    error: false,
  });

  // Keep a ref of the latest state for onSuccess / onError callbacks.
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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

  // Exchange handoff code on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await exchangeHandoffCode(sessionId, handoffCode, options);
        if (cancelled) return;
        setJwt(token);
        // Fetch initial state + derive UI
        const initial = await retrieveManagedAuth(sessionId, token, options);
        if (cancelled) return;
        setState(initial);
        const derived = deriveUIState(initial);
        if (derived === "success" || derived === "expired" || derived === "error") {
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
        if (cancelled) return;
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
      cancelled = true;
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
