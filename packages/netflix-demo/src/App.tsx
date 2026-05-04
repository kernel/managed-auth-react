import { useMemo, useState } from "react";
import {
  AppearanceProvider,
  ExternalActionWaiting,
  KernelManagedAuth,
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
import { netflixAppearance, netflixLocalization } from "./netflixAppearance";

const TARGET_DOMAIN = "netflix.com";

type Step =
  | "prime"
  | "discovering"
  | "awaiting_input"
  | "awaiting_input_sso"
  | "awaiting_input_mfa"
  | "awaiting_external_action"
  | "submitting"
  | "success"
  | "expired"
  | "error";

const allSteps: { id: Step; label: string }[] = [
  { id: "prime", label: "Prime / consent" },
  { id: "discovering", label: "Discovering" },
  { id: "awaiting_input", label: "Awaiting input" },
  { id: "awaiting_input_sso", label: "+ SSO" },
  { id: "awaiting_input_mfa", label: "MFA select" },
  { id: "awaiting_external_action", label: "External action" },
  { id: "submitting", label: "Submitting" },
  { id: "success", label: "Success" },
  { id: "expired", label: "Expired" },
  { id: "error", label: "Error" },
];

const mockFields: DiscoveredField[] = [
  {
    name: "email",
    label: "Email or phone number",
    type: "email",
    required: true,
    placeholder: "Email or phone number",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Password",
  },
];

const mockSSO: SSOButton[] = [
  { provider: "google", label: "Continue with Google", selector: "" },
  { provider: "facebook", label: "Continue with Facebook", selector: "" },
];

const mockMFA: MFAOption[] = [
  { type: "sms", target: "•••• 8421" },
  { type: "email", target: "n••••@netflix.com" },
  { type: "totp", description: "Use your authenticator app" },
];

const mockSignInOptions: SignInOption[] = [
  { id: "personal", label: "Personal", description: "you@example.com" },
  { id: "kids", label: "Kids", description: "Profile for younger viewers" },
];

function renderStep(step: Step) {
  switch (step) {
    case "prime":
      return <StepPrime targetDomain={TARGET_DOMAIN} onContinue={() => {}} />;
    case "discovering":
      return (
        <LoadingState
          message="Loading sign-in options..."
          variant="discovering"
        />
      );
    case "awaiting_input":
      return (
        <UnifiedAuthForm
          fields={mockFields}
          targetDomain={TARGET_DOMAIN}
          onSubmitFields={() => {}}
          onSSOClick={() => {}}
          onMFASelect={() => {}}
          onSignInOptionSelect={() => {}}
        />
      );
    case "awaiting_input_sso":
      return (
        <UnifiedAuthForm
          fields={mockFields}
          ssoButtons={mockSSO}
          targetDomain={TARGET_DOMAIN}
          onSubmitFields={() => {}}
          onSSOClick={() => {}}
          onMFASelect={() => {}}
          onSignInOptionSelect={() => {}}
        />
      );
    case "awaiting_input_mfa":
      return (
        <UnifiedAuthForm
          mfaOptions={mockMFA}
          signInOptions={mockSignInOptions}
          targetDomain={TARGET_DOMAIN}
          onSubmitFields={() => {}}
          onSSOClick={() => {}}
          onMFASelect={() => {}}
          onSignInOptionSelect={() => {}}
        />
      );
    case "awaiting_external_action":
      return (
        <ExternalActionWaiting message="Check your phone for a sign-in notification" />
      );
    case "submitting":
      return (
        <LoadingState message="Signing you in..." variant="authenticating" />
      );
    case "success":
      return <StepSuccess targetDomain={TARGET_DOMAIN} />;
    case "expired":
      return <StepExpired />;
    case "error":
      return (
        <StepError
          targetDomain={TARGET_DOMAIN}
          errorCode="invalid_credentials"
          errorMessage="The email or password you entered doesn't match our records. Please try again."
        />
      );
  }
}

interface LiveCredentials {
  sessionId: string;
  handoffCode: string;
}

function readLiveCredentialsFromUrl(): LiveCredentials | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session") ?? params.get("sessionId");
  const handoffCode = params.get("code") ?? params.get("handoffCode");
  if (!sessionId || !handoffCode) return null;
  return { sessionId, handoffCode };
}

export function App() {
  const live = useMemo(readLiveCredentialsFromUrl, []);
  const [step, setStep] = useState<Step>("prime");

  return (
    <div style={pageStyles.page}>
      <BackdropPoster />
      <Header />
      <Hero>
        <AuthCard live={live} step={step} />
      </Hero>
      {!live && <StatePicker step={step} onChange={setStep} />}
      <DemoFooter live={live} />
    </div>
  );
}

function AuthCard({
  live,
  step,
}: {
  live: LiveCredentials | null;
  step: Step;
}) {
  if (live) {
    return (
      <KernelManagedAuth
        sessionId={live.sessionId}
        handoffCode={live.handoffCode}
        appearance={netflixAppearance}
        localization={netflixLocalization}
        onSuccess={({ profileName, domain }) => {
          // eslint-disable-next-line no-console
          console.log("[netflix-demo] success", { profileName, domain });
        }}
        onError={({ code, message }) => {
          // eslint-disable-next-line no-console
          console.error("[netflix-demo] error", code, message);
        }}
      />
    );
  }

  return (
    <AppearanceProvider appearance={netflixAppearance}>
      <LocalizationProvider localization={netflixLocalization}>
        <Shell appearance={netflixAppearance}>{renderStep(step)}</Shell>
      </LocalizationProvider>
    </AppearanceProvider>
  );
}

function BackdropPoster() {
  return (
    <>
      {/* The Netflix-y backdrop: dark base + crimson radial bloom + bottom
          black gradient that fades into the form area. Three layered
          fixed-position divs so the auth card always reads as if it's on a
          movie poster. */}
      <div style={pageStyles.backdropBase} />
      <div style={pageStyles.backdropBloom} />
      <div style={pageStyles.backdropGradient} />
    </>
  );
}

function Header() {
  return (
    <header style={pageStyles.header}>
      <div style={pageStyles.brand}>NETFLIX</div>
      <button type="button" style={pageStyles.langButton}>
        English
      </button>
    </header>
  );
}

function Hero({ children }: { children: React.ReactNode }) {
  return (
    <main style={pageStyles.heroWrap}>
      <div style={pageStyles.cardSlot}>{children}</div>
    </main>
  );
}

function StatePicker({
  step,
  onChange,
}: {
  step: Step;
  onChange: (s: Step) => void;
}) {
  return (
    <aside style={pickerStyles.panel}>
      <div style={pickerStyles.header}>
        <span style={pickerStyles.headerLabel}>Preview state</span>
        <span style={pickerStyles.headerHint}>
          Pass <code style={pickerStyles.code}>?session=…&amp;code=…</code> to
          run the live flow.
        </span>
      </div>
      <div style={pickerStyles.chips}>
        {allSteps.map((s) => {
          const active = s.id === step;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              style={active ? pickerStyles.chipActive : pickerStyles.chip}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function DemoFooter({ live }: { live: LiveCredentials | null }) {
  return (
    <footer style={pageStyles.footer}>
      <div style={pageStyles.footerInner}>
        <div style={pageStyles.footerLine}>
          Demo of{" "}
          <a
            href="https://www.npmjs.com/package/@onkernel/managed-auth-react"
            target="_blank"
            rel="noreferrer"
            style={pageStyles.footerLink}
          >
            @onkernel/managed-auth-react
          </a>
          . Netflix branding is illustrative only — Netflix is not affiliated.
        </div>
        <div style={pageStyles.footerLine}>
          {live ? (
            <>
              Running live flow against session{" "}
              <code style={pageStyles.footerCode}>
                {live.sessionId.slice(0, 8)}…
              </code>
              .
            </>
          ) : (
            <>
              Currently in <strong>preview mode</strong>. Use the state picker
              below to scrub through every UI state.
            </>
          )}
        </div>
      </div>
    </footer>
  );
}

const pageStyles: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    color: "#fff",
    overflowX: "hidden",
    paddingBottom: 80,
  },
  backdropBase: {
    position: "fixed",
    inset: 0,
    background:
      "linear-gradient(180deg, #000 0%, #0a0a0a 40%, #000 100%)",
    zIndex: -3,
  },
  backdropBloom: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(60% 50% at 50% 30%, rgba(229, 9, 20, 0.35) 0%, rgba(229, 9, 20, 0.08) 35%, transparent 70%)",
    zIndex: -2,
  },
  backdropGradient: {
    position: "fixed",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.0) 25%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.85) 100%)",
    zIndex: -1,
    pointerEvents: "none",
  },
  header: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 56px",
    zIndex: 2,
  },
  brand: {
    fontFamily: "'Bebas Neue', 'Inter', sans-serif",
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: "0.04em",
    color: "#e50914",
    textShadow: "0 1px 2px rgba(0,0,0,0.6)",
  },
  langButton: {
    background: "rgba(0, 0, 0, 0.5)",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 2,
    cursor: "pointer",
  },
  heroWrap: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px 24px",
  },
  cardSlot: {
    width: "100%",
    maxWidth: 480,
  },
  footer: {
    position: "relative",
    zIndex: 1,
    marginTop: 40,
    padding: "0 24px",
  },
  footerInner: {
    maxWidth: 720,
    margin: "0 auto",
    fontSize: 12,
    lineHeight: 1.6,
    color: "#808080",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  footerLine: {},
  footerLink: { color: "#b3b3b3", textDecoration: "underline" },
  footerCode: {
    fontFamily: "ui-monospace, monospace",
    fontSize: 11,
    color: "#b3b3b3",
  },
};

const pickerStyles: Record<string, React.CSSProperties> = {
  panel: {
    position: "relative",
    zIndex: 1,
    maxWidth: 720,
    margin: "32px auto 0",
    padding: "16px 20px",
    background: "rgba(0, 0, 0, 0.55)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 6,
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#fff",
  },
  headerHint: { fontSize: 12, color: "#808080" },
  code: {
    fontFamily: "ui-monospace, monospace",
    background: "rgba(255, 255, 255, 0.06)",
    padding: "1px 5px",
    borderRadius: 3,
    color: "#b3b3b3",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    background: "rgba(255, 255, 255, 0.06)",
    color: "#b3b3b3",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 4,
    cursor: "pointer",
  },
  chipActive: {
    background: "#e50914",
    color: "#fff",
    border: "1px solid #e50914",
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 4,
    cursor: "pointer",
  },
};
