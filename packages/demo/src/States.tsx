import { useState } from "react";
import {
  AppearanceProvider,
  ExternalActionWaiting,
  LoadingState,
  LocalizationProvider,
  Shell,
  StepError,
  StepExpired,
  StepPrime,
  StepSuccess,
  UnifiedAuthForm,
  type DiscoveredField,
  type MFAOption,
  type SignInOption,
  type SSOButton,
} from "@onkernel/managed-auth-react";
import "@onkernel/managed-auth-react/styles.css";

const TARGET_DOMAIN = "kernel.sh";

const mockSSOButtons: SSOButton[] = [
  { provider: "google", label: "Continue with Google", selector: "" },
  { provider: "github", label: "Continue with GitHub", selector: "" },
  { provider: "facebook", label: "Continue with Facebook", selector: "" },
];

const mockFields: DiscoveredField[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "you@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Enter your password",
  },
];

// `switch` is deliberately first — UnifiedAuthForm sorts it to the bottom,
// so this proves the sort behavior works.
const mockMFAOptions: MFAOption[] = [
  { type: "switch", description: "Pick a different verification method" },
  { type: "sms", target: "•••• 4242" },
  { type: "totp", description: "Use your authenticator app" },
  { type: "push", target: "iPhone 15 Pro" },
];

const mockSignInOptions: SignInOption[] = [
  { id: "personal", label: "Personal account", description: "you@example.com" },
  {
    id: "work",
    label: "Acme Corp (work)",
    description: "you@acme.com · Admin",
  },
];

// Local superset of the package's UIState — adds explicit multi-section
// screens so we can scrub through every meaningful permutation in one place.
type StateName =
  | "prime"
  | "discovering"
  | "awaiting_input"
  | "awaiting_input_sso_mfa"
  | "awaiting_input_full"
  | "awaiting_input_mfa"
  | "awaiting_external_action"
  | "submitting"
  | "success"
  | "expired"
  | "error";

const allStates: StateName[] = [
  "prime",
  "discovering",
  "awaiting_input",
  "awaiting_input_sso_mfa",
  "awaiting_input_full",
  "awaiting_input_mfa",
  "awaiting_external_action",
  "submitting",
  "success",
  "expired",
  "error",
];

export function States() {
  const [currentState, setCurrentState] = useState<StateName>("awaiting_input");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const renderState = () => {
    switch (currentState) {
      case "prime":
        return (
          <StepPrime
            targetDomain={TARGET_DOMAIN}
            onContinue={() => setCurrentState("discovering")}
          />
        );
      case "discovering":
        return (
          <LoadingState
            message="Discovering login fields..."
            variant="discovering"
          />
        );
      case "awaiting_input":
        return (
          <UnifiedAuthForm
            fields={mockFields}
            ssoButtons={mockSSOButtons}
            targetDomain={TARGET_DOMAIN}
            onSubmitFields={handleSubmit}
            onSSOClick={() => {}}
            onMFASelect={() => {}}
            onSignInOptionSelect={() => {}}
            isLoading={isLoading}
          />
        );
      case "awaiting_input_sso_mfa":
        return (
          <UnifiedAuthForm
            ssoButtons={mockSSOButtons}
            mfaOptions={mockMFAOptions}
            targetDomain={TARGET_DOMAIN}
            onSubmitFields={handleSubmit}
            onSSOClick={() => {}}
            onMFASelect={() => {}}
            onSignInOptionSelect={() => {}}
            isLoading={isLoading}
          />
        );
      case "awaiting_input_full":
        return (
          <UnifiedAuthForm
            fields={mockFields}
            ssoButtons={mockSSOButtons}
            mfaOptions={mockMFAOptions}
            signInOptions={mockSignInOptions}
            targetDomain={TARGET_DOMAIN}
            onSubmitFields={handleSubmit}
            onSSOClick={() => {}}
            onMFASelect={() => {}}
            onSignInOptionSelect={() => {}}
            isLoading={isLoading}
          />
        );
      case "awaiting_input_mfa":
        return (
          <UnifiedAuthForm
            mfaOptions={mockMFAOptions}
            targetDomain={TARGET_DOMAIN}
            onSubmitFields={handleSubmit}
            onSSOClick={() => {}}
            onMFASelect={() => {}}
            onSignInOptionSelect={() => {}}
            isLoading={isLoading}
          />
        );
      case "awaiting_external_action":
        return (
          <ExternalActionWaiting message="Check your phone for a push notification" />
        );
      case "submitting":
        return (
          <LoadingState message="Logging you in..." variant="authenticating" />
        );
      case "success":
        return <StepSuccess targetDomain={TARGET_DOMAIN} />;
      case "expired":
        return <StepExpired />;
      case "error":
        return (
          <StepError
            targetDomain={TARGET_DOMAIN}
            errorCode="domain_not_allowed"
            errorMessage='The login page is on dashboard.onkernel.com, which is not in the allowed domains for kernel.sh. Add "dashboard.onkernel.com" to allowed_domains on the managed auth connection to fix this.'
          />
        );
    }
  };

  return (
    <AppearanceProvider>
      <LocalizationProvider>
        {/* Top-right state picker — anchored absolutely so the auth shell
            below renders against its full viewport without re-flowing. */}
        <div style={pickerStyles.wrapper}>
          <label style={pickerStyles.label} htmlFor="state-picker">
            UI state
          </label>
          <select
            id="state-picker"
            value={currentState}
            onChange={(e) => setCurrentState(e.target.value as StateName)}
            style={pickerStyles.select}
          >
            {allStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <Shell>{renderState()}</Shell>
      </LocalizationProvider>
    </AppearanceProvider>
  );
}

const pickerStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 50,
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: 12,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    minWidth: 220,
  },
  label: {
    display: "block",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--muted-foreground)",
    marginBottom: 6,
    fontWeight: 500,
  },
  select: {
    width: "100%",
    fontSize: 13,
    background: "var(--background)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "6px 8px",
  },
};
