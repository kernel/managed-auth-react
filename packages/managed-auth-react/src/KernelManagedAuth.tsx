import { useMemo } from "react";
import { AppearanceProvider } from "./appearance/context";
import { LocalizationProvider } from "./localization/context";
import { useManagedAuthSession } from "./session/useManagedAuthSession";
import { Shell } from "./components/Shell";
import { StepPrime } from "./components/StepPrime";
import { UnifiedAuthForm } from "./components/UnifiedAuthForm";
import { StepSuccess } from "./components/StepSuccess";
import { StepError } from "./components/StepError";
import { StepExpired } from "./components/StepExpired";
import { LoadingState } from "./components/LoadingState";
import { ExternalActionWaiting } from "./components/ExternalActionWaiting";
import { useLocalization } from "./localization/context";
import type { Appearance } from "./appearance/types";
import type { Localization } from "./localization/types";
import type {
  AuthErrorPayload,
  AuthSuccessPayload,
} from "./lib/types";
import type { ApiClientOptions } from "./lib/api";

export interface KernelManagedAuthProps extends ApiClientOptions {
  /** The managed auth connection session ID. */
  sessionId: string;
  /** Single-use handoff code from the backend, exchanged for a JWT. */
  handoffCode: string;
  /** Per-element styling and design tokens. */
  appearance?: Appearance;
  /** Strings / translations. Any omitted key falls back to English. */
  localization?: Localization;
  /** Fires when the session reaches `SUCCESS` state. */
  onSuccess?: (payload: AuthSuccessPayload) => void;
  /** Fires when the session reaches `FAILED`, `CANCELED`, or `EXPIRED`. */
  onError?: (payload: AuthErrorPayload) => void;
}

export function KernelManagedAuth(props: KernelManagedAuthProps) {
  const { appearance, localization, ...sessionProps } = props;
  const skipPrime = appearance?.layout?.skipPrimeStep ?? false;

  return (
    <AppearanceProvider appearance={appearance}>
      <LocalizationProvider localization={localization}>
        <Shell appearance={appearance}>
          <KernelManagedAuthInner
            autoStart={skipPrime}
            appearance={appearance}
            {...sessionProps}
          />
        </Shell>
      </LocalizationProvider>
    </AppearanceProvider>
  );
}

function KernelManagedAuthInner({
  sessionId,
  handoffCode,
  onSuccess,
  onError,
  autoStart,
  appearance,
  baseUrl,
  fetch: fetchOverride,
}: KernelManagedAuthProps & { autoStart: boolean }) {
  const l = useLocalization();
  const session = useManagedAuthSession({
    sessionId,
    handoffCode,
    onSuccess,
    onError,
    autoStart,
    baseUrl,
    fetch: fetchOverride,
  });

  const {
    state,
    uiState,
    submitError,
    initError,
    isSubmitting,
    startFlow,
    submitFields,
    submitSSO,
    submitMFA,
    submitSignIn,
  } = session;

  const targetDomain = useMemo(() => state?.domain ?? "", [state?.domain]);

  if (uiState === "prime") {
    return (
      <StepPrime
        targetDomain={targetDomain}
        onContinue={startFlow}
        isLoading={isSubmitting}
        layout={appearance?.layout}
      />
    );
  }

  if (uiState === "discovering") {
    return <LoadingState message={l.discoveringMessage} />;
  }

  if (uiState === "submitting") {
    return <LoadingState message={l.submittingMessage} />;
  }

  if (uiState === "awaiting_external_action") {
    return <ExternalActionWaiting message={state?.external_action_message ?? undefined} />;
  }

  if (uiState === "success") {
    return <StepSuccess targetDomain={targetDomain} />;
  }

  if (uiState === "expired") {
    return <StepExpired />;
  }

  if (uiState === "error") {
    return (
      <StepError
        targetDomain={targetDomain}
        errorMessage={
          initError ||
          state?.error_message ||
          state?.website_error ||
          undefined
        }
        errorCode={state?.error_code ?? undefined}
      />
    );
  }

  if (uiState === "awaiting_input" && state) {
    return (
      <UnifiedAuthForm
        targetDomain={targetDomain}
        ssoProvider={state.sso_provider}
        fields={state.discovered_fields ?? []}
        ssoButtons={state.pending_sso_buttons ?? []}
        mfaOptions={state.mfa_options ?? []}
        signInOptions={state.sign_in_options ?? []}
        onSubmitFields={submitFields}
        onSSOClick={submitSSO}
        onMFASelect={submitMFA}
        onSignInOptionSelect={submitSignIn}
        isLoading={isSubmitting}
        errorMessage={submitError ?? undefined}
        layout={appearance?.layout}
      />
    );
  }

  // Fallback — should never hit in practice.
  return <LoadingState message={l.waitingForFormMessage} />;
}
