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
  type Appearance,
  type DiscoveredField,
  type Localization,
  type MFAOption,
  type SignInOption,
  type SSOButton,
} from "@onkernel/managed-auth-react";
import "@onkernel/managed-auth-react/styles.css";

const TARGET_DOMAIN = "kernel.sh";

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

const mockSSOButtons: SSOButton[] = [
  { provider: "google", label: "Continue with Google", selector: "" },
  { provider: "github", label: "Continue with GitHub", selector: "" },
];

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

type Step =
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

const allSteps: Step[] = [
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

function renderStep(step: Step) {
  switch (step) {
    case "prime":
      return <StepPrime targetDomain={TARGET_DOMAIN} onContinue={() => {}} />;
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
          onSubmitFields={() => {}}
          onSSOClick={() => {}}
          onMFASelect={() => {}}
          onSignInOptionSelect={() => {}}
        />
      );
    case "awaiting_input_sso_mfa":
      return (
        <UnifiedAuthForm
          ssoButtons={mockSSOButtons}
          mfaOptions={mockMFAOptions}
          targetDomain={TARGET_DOMAIN}
          onSubmitFields={() => {}}
          onSSOClick={() => {}}
          onMFASelect={() => {}}
          onSignInOptionSelect={() => {}}
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
          onSubmitFields={() => {}}
          onSSOClick={() => {}}
          onMFASelect={() => {}}
          onSignInOptionSelect={() => {}}
        />
      );
    case "awaiting_input_mfa":
      return (
        <UnifiedAuthForm
          mfaOptions={mockMFAOptions}
          targetDomain={TARGET_DOMAIN}
          onSubmitFields={() => {}}
          onSSOClick={() => {}}
          onMFASelect={() => {}}
          onSignInOptionSelect={() => {}}
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
}

interface VariantSpec {
  id: string;
  title: string;
  description: string;
  appearance?: Appearance;
  localization?: Localization;
  /** Source snippet shown beside the preview. */
  code: string;
}

const variants: VariantSpec[] = [
  {
    id: "default",
    title: "1. Default — no overrides",
    description:
      "Ships out of the box. The package picks sensible light/dark tokens that follow the user's color scheme. Use this when you have no design system to integrate against.",
    code: `<KernelManagedAuth sessionId={...} handoffCode={...} />`,
  },

  // Inspired by public brand work — illustrative customization examples,
  // not an endorsement, not a partnership. None of these ship a logo or
  // wordmark from the brand they're inspired by; only Kernel's own
  // wordmark renders (per `appearance.layout.kernelLogoColor`).

  {
    id: "linear",
    title: "2. Linear — polished dark indigo",
    description:
      "Dark, low-saturation surface; signature indigo CTA; subtle border highlight on the card; Inter at standard weights. Demonstrates a dark theme without losing the Kernel wordmark — `kernelLogoColor: 'white'` keeps the footer brand-correct.",
    appearance: {
      theme: "dark",
      variables: {
        colorBackground: "#08090a",
        colorCard: "#0e1014",
        colorCardForeground: "#f7f8f8",
        colorForeground: "#f7f8f8",
        colorMuted: "#1a1c20",
        colorMutedForeground: "#8a8f98",
        colorBorder: "rgba(255, 255, 255, 0.08)",
        colorInput: "rgba(255, 255, 255, 0.04)",
        colorInputForeground: "#f7f8f8",
        colorPrimary: "#5e6ad2",
        colorPrimaryForeground: "#ffffff",
        colorRing: "#5e6ad2",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        borderRadius: "8px",
      },
      elements: {
        card: {
          style: {
            border: "1px solid rgba(255, 255, 255, 0.08)",
            // Subtle 1px highlight at the top edge — Linear's signature.
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 1px 2px rgba(0, 0, 0, 0.2)",
          },
        },
        title: {
          style: { letterSpacing: "-0.02em", fontWeight: 500 },
        },
        buttonPrimary: {
          style: {
            ":hover": { background: "#6e79e0", opacity: 1 },
          },
        },
      },
      layout: { kernelLogoColor: "white" },
    },
    code: `appearance={{
  theme: "dark",
  variables: {
    colorBackground: "#08090a",
    colorCard:       "#0e1014",
    colorPrimary:    "#5e6ad2",  // signature indigo
    fontFamily:      "'Inter', sans-serif",
    borderRadius:    "8px",
  },
  elements: {
    card: { style: { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" } },
    title: { style: { letterSpacing: "-0.02em", fontWeight: 500 } },
  },
  layout: { kernelLogoColor: "white" },
}}`,
  },

  {
    id: "vercel",
    title: "3. Vercel — pure monochrome",
    description:
      "Black and white, no chroma anywhere; Geist Sans; white-on-black primary CTA (with black text — Vercel's signature inversion). Demonstrates that the Powered-by row works on pure black via the white wordmark variant.",
    appearance: {
      theme: "dark",
      variables: {
        colorBackground: "#000000",
        colorCard: "#000000",
        colorCardForeground: "#ffffff",
        colorForeground: "#ffffff",
        colorMuted: "#171717",
        colorMutedForeground: "#a1a1a1",
        colorBorder: "#262626",
        colorInput: "#0a0a0a",
        colorInputForeground: "#ffffff",
        // White CTA + black text — Vercel's signature inversion.
        colorPrimary: "#ffffff",
        colorPrimaryForeground: "#000000",
        colorRing: "#ffffff",
        fontFamily: "'Geist', 'Inter', ui-sans-serif, system-ui, sans-serif",
        fontWeightNormal: 400,
        fontWeightMedium: 500,
        fontWeightSemibold: 600,
        borderRadius: "8px",
      },
      elements: {
        card: {
          style: {
            border: "1px solid #262626",
            boxShadow: "none",
          },
        },
        title: { style: { letterSpacing: "-0.04em", fontWeight: 600 } },
        buttonPrimary: {
          style: {
            ":hover": { background: "#e5e5e5", opacity: 1 },
          },
        },
        ssoButton: {
          style: {
            background: "#0a0a0a",
            border: "1px solid #262626",
            ":hover": { background: "#171717", opacity: 1 },
          },
        },
      },
      layout: { kernelLogoColor: "white" },
    },
    code: `appearance={{
  theme: "dark",
  variables: {
    colorBackground:        "#000",
    colorPrimary:           "#fff",  // signature inversion:
    colorPrimaryForeground: "#000",  // white bg, black text
    fontFamily: "'Geist', sans-serif",
    borderRadius: "8px",
  },
  layout: { kernelLogoColor: "white" },
}}`,
  },

  {
    id: "stripe",
    title: "4. Stripe — soft blue-gray + purple CTA",
    description:
      "Light blue-tinted background, white card with a soft elevation, signature `#635bff` purple primary. Demonstrates an opinionated light theme with a non-default radius and a custom shadow on the card.",
    appearance: {
      theme: "light",
      variables: {
        colorBackground: "#f6f9fc",
        colorCard: "#ffffff",
        colorCardForeground: "#0a2540",
        colorForeground: "#425466",
        colorMuted: "#f1f5f9",
        colorMutedForeground: "#697386",
        colorBorder: "#e3e8ee",
        colorInput: "#ffffff",
        colorInputForeground: "#0a2540",
        colorPrimary: "#635bff",
        colorPrimaryForeground: "#ffffff",
        colorRing: "#635bff",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        borderRadius: "6px",
      },
      elements: {
        card: {
          style: {
            // Stripe's signature card lift — soft, slightly blue-tinted.
            boxShadow:
              "0 7px 14px 0 rgba(60, 66, 87, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06)",
            border: "none",
          },
        },
        title: {
          style: {
            color: "#0a2540",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          },
        },
        input: {
          style: {
            border: "1px solid #e3e8ee",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
            ":focus-visible": {
              borderColor: "#635bff",
              boxShadow: "0 0 0 3px rgba(99, 91, 255, 0.15)",
              outline: "none",
            },
          },
        },
        buttonPrimary: {
          style: {
            boxShadow:
              "0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(99, 91, 255, 0.25)",
            ":hover": { background: "#7066ff", opacity: 1 },
          },
        },
      },
      layout: { kernelLogoColor: "black" },
    },
    code: `appearance={{
  theme: "light",
  variables: {
    colorBackground: "#f6f9fc",  // soft blue-gray
    colorCard:       "#fff",
    colorPrimary:    "#635bff",  // signature purple
    borderRadius:    "6px",
  },
  elements: {
    card:  { style: { boxShadow: "0 7px 14px rgba(60,66,87,0.08)" } },
    input: { style: { ":focus-visible": { boxShadow: "0 0 0 3px rgba(99,91,255,0.15)" } } },
  },
}}`,
  },

  {
    id: "notion",
    title: "5. Notion — warm minimal",
    description:
      "Off-white surfaces, warm dark ink, blue CTA, very tight radius. Demonstrates restraint — almost no shadow, hairline borders, and the input rests on the same surface as the card without visual weight.",
    appearance: {
      theme: "light",
      variables: {
        colorBackground: "#ffffff",
        colorCard: "#ffffff",
        colorCardForeground: "#37352f",
        colorForeground: "#37352f",
        colorMuted: "#f7f6f3",
        colorMutedForeground: "#9b9a97",
        colorBorder: "rgba(55, 53, 47, 0.16)",
        colorInput: "rgba(242, 241, 238, 0.6)",
        colorInputForeground: "#37352f",
        colorPrimary: "#2383e2",
        colorPrimaryForeground: "#ffffff",
        colorRing: "#2383e2",
        fontFamily:
          "'Inter', ui-sans-serif, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        borderRadius: "4px",
      },
      elements: {
        card: {
          style: {
            border: "1px solid rgba(55, 53, 47, 0.09)",
            boxShadow: "none",
          },
        },
        title: {
          style: {
            color: "#37352f",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          },
        },
        input: {
          style: {
            border: "1px solid rgba(55, 53, 47, 0.16)",
            boxShadow: "rgba(15, 15, 15, 0.05) 0px 1px 2px inset",
          },
        },
        buttonPrimary: {
          style: {
            ":hover": { background: "#1a73d3", opacity: 1 },
          },
        },
      },
      layout: { kernelLogoColor: "black" },
    },
    code: `appearance={{
  theme: "light",
  variables: {
    colorForeground: "#37352f",   // warm dark ink
    colorPrimary:    "#2383e2",   // notion blue
    colorBorder:     "rgba(55,53,47,0.16)",
    borderRadius:    "4px",
  },
  elements: {
    card:  { style: { boxShadow: "none" } },
    input: { style: { boxShadow: "rgba(15,15,15,0.05) 0 1px 2px inset" } },
  },
}}`,
  },

  {
    id: "anthropic",
    title: "6. Anthropic — cream + serif headline + clay CTA",
    description:
      "Editorial light theme: warm cream background, serif title, clay-orange CTA. Demonstrates per-slot `fontFamily` swaps — body stays sans, but the `title` slot picks up Source Serif for an editorial feel without forking the package.",
    appearance: {
      theme: "light",
      variables: {
        colorBackground: "#f0eee5",
        colorCard: "#faf9f5",
        colorCardForeground: "#191919",
        colorForeground: "#1f1e1c",
        colorMuted: "#e8e6dd",
        colorMutedForeground: "#5f5e5b",
        colorBorder: "rgba(31, 30, 28, 0.12)",
        colorInput: "#ffffff",
        colorInputForeground: "#1f1e1c",
        colorPrimary: "#cc785c",
        colorPrimaryForeground: "#ffffff",
        colorRing: "#cc785c",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        borderRadius: "4px",
      },
      elements: {
        card: {
          style: {
            border: "1px solid rgba(31, 30, 28, 0.1)",
            boxShadow: "0 1px 2px rgba(31, 30, 28, 0.04)",
          },
        },
        // The pivot — only the title gets the serif. Body stays in Inter.
        title: {
          style: {
            fontFamily: "'Source Serif 4', 'Source Serif Pro', Georgia, serif",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "#191919",
          },
        },
        buttonPrimary: {
          style: {
            ":hover": { background: "#b86c52", opacity: 1 },
          },
        },
      },
      layout: { kernelLogoColor: "black" },
    },
    code: `appearance={{
  theme: "light",
  variables: {
    colorBackground: "#f0eee5",  // warm cream
    colorPrimary:    "#cc785c",  // clay
    fontFamily:      "'Inter', sans-serif",
  },
  elements: {
    // Only the title gets the serif — body stays in Inter.
    title: {
      style: {
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontWeight: 500,
      },
    },
  },
}}`,
  },

  {
    id: "supabase",
    title: "7. Supabase — dark + mint green",
    description:
      "Dark surfaces with the signature `#3ecf8e` mint as both ring and CTA. Tight letter-spacing on the title, larger radius on inputs. Demonstrates a different green character than the kernel-brand variant — this one is a brighter mint, not the olive Kernel green.",
    appearance: {
      theme: "dark",
      variables: {
        colorBackground: "#171717",
        colorCard: "#1c1c1c",
        colorCardForeground: "#ededed",
        colorForeground: "#ededed",
        colorMuted: "#262626",
        colorMutedForeground: "#a1a1aa",
        colorBorder: "#2e2e2e",
        colorInput: "#202020",
        colorInputForeground: "#ededed",
        colorPrimary: "#3ecf8e",
        colorPrimaryForeground: "#0e1116",
        colorRing: "#3ecf8e",
        colorSuccess: "#3ecf8e",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        borderRadius: "8px",
      },
      elements: {
        card: {
          style: {
            border: "1px solid #2e2e2e",
            boxShadow: "0 1px 0 rgba(255, 255, 255, 0.04) inset",
          },
        },
        title: {
          style: { letterSpacing: "-0.02em", fontWeight: 600 },
        },
        buttonPrimary: {
          style: {
            fontWeight: 500,
            ":hover": { background: "#34b87a", opacity: 1 },
          },
        },
      },
      layout: { kernelLogoColor: "white" },
    },
    code: `appearance={{
  theme: "dark",
  variables: {
    colorBackground:        "#171717",
    colorPrimary:           "#3ecf8e",  // mint green
    colorPrimaryForeground: "#0e1116",  // black text on mint
    borderRadius: "8px",
  },
  layout: { kernelLogoColor: "white" },
}}`,
  },

  {
    id: "kernel-brand",
    title: "8. Kernel brand — matches kernel-mcp-server",
    description:
      "Mirrors the kernel-mcp-server /select-org page: zero radius, kernel-green primary CTA on charcoal text (per BRAND.md), green Kernel wordmark in the footer, Inter at weight 250, lowercase everything, 0.5px borders, and hover = underline only (no bg or opacity change). Shows how to bend a fully token-driven component to an opinionated brand without forking it.",
    appearance: {
      theme: "light",
      variables: {
        colorBackground: "#f2f0e7",
        colorCard: "#f2f0e7",
        colorCardForeground: "#1c2024",
        colorForeground: "#1c2024",
        colorMuted: "#e1dccf",
        colorMutedForeground: "#60646c",
        colorBorder: "#1c2024",
        colorInput: "transparent",
        colorInputForeground: "#1c2024",
        colorPrimary: "#81b300",
        colorPrimaryForeground: "#1c2024",
        colorRing: "#81b300",
        colorSuccess: "#81b300",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        fontWeightNormal: 250,
        fontWeightMedium: 350,
        fontWeightSemibold: 400,
        borderRadius: "0",
        borderRadiusSm: "0",
        borderRadiusLg: "0",
      },
      elements: {
        card: {
          style: {
            textTransform: "lowercase",
            letterSpacing: "0.3px",
            fontWeight: 250,
            background: "#f2f0e7",
            border: "0.5px solid #e1dccf",
            boxShadow: "none",
          },
        },
        title: {
          style: {
            fontWeight: 250,
            letterSpacing: "0.3px",
            color: "#1c2024",
          },
        },
        subtitle: {
          style: {
            fontWeight: 250,
            letterSpacing: "0.3px",
            color: "#60646c",
          },
        },
        label: {
          style: {
            fontWeight: 350,
            letterSpacing: "0.3px",
            color: "#1c2024",
          },
        },
        input: {
          style: {
            textTransform: "none",
            background: "transparent",
            border: "0.5px solid #1c2024",
            borderRadius: 0,
            fontWeight: 250,
            letterSpacing: 0,
            "::placeholder": { color: "#60646c", opacity: 1 },
            ":focus-visible": {
              outline: "0.5px solid #81b300",
              outlineOffset: "1px",
            },
          },
        },
        buttonPrimary: {
          style: {
            fontWeight: 250,
            letterSpacing: "0.3px",
            textTransform: "lowercase",
            borderRadius: 0,
            ":hover": {
              background: "#81b300",
              color: "#1c2024",
              opacity: 1,
              textDecoration: "underline",
              textDecorationThickness: "0.5px",
              textUnderlineOffset: "2px",
            },
          },
        },
        // One slot covers SSO + MFA + sign-in option hovers — they all
        // route through the Button primitive which composes
        // `button` → `buttonSecondary` → slot-specific (e.g. `ssoButton`).
        buttonSecondary: {
          style: {
            ":hover": {
              background: "#f2f0e7",
              color: "#1c2024",
              opacity: 1,
              textDecoration: "underline",
              textDecorationThickness: "0.5px",
              textUnderlineOffset: "2px",
            },
          },
        },
        ssoButton: {
          style: {
            background: "#f2f0e7",
            color: "#1c2024",
            border: "0.5px solid #1c2024",
            borderRadius: 0,
            textTransform: "lowercase",
            fontWeight: 250,
          },
        },
        mfaOption: { style: { borderRadius: 0 } },
        signInOption: { style: { borderRadius: 0 } },
        poweredBy: { style: { color: "#60646c" } },
        poweredByLink: {
          style: {
            color: "#81b300",
            ":hover": {
              opacity: 1,
              textDecoration: "underline",
              textDecorationThickness: "0.5px",
              textUnderlineOffset: "2px",
            },
          },
        },
      },
      layout: {
        poweredByKernel: true,
        kernelLogoColor: "green",
      },
    },
    localization: {
      loginTitle: (site) => `sign in to ${site.toLowerCase()}`,
      submitButton: "continue",
      submittingButton: "signing in...",
      ssoButtonLabel: (provider) => `continue with ${provider.toLowerCase()}`,
      orDivider: "or",
      credentialSafetyNotice:
        "credentials are encrypted client-side. never shared with kernel or any llm.",
    },
    code: `appearance={{
  theme: "light",
  variables: {
    colorBackground:        "#f2f0e7",
    colorCard:              "#f2f0e7",
    colorPrimary:           "#81b300",  // kernel-green CTA
    colorPrimaryForeground: "#1c2024",  // BRAND.md: charcoal text on green
    colorRing:    "#81b300",
    fontFamily:       "'Inter', sans-serif",
    fontWeightNormal: 250,
    borderRadius:   "0",                // sharp corners everywhere
    borderRadiusSm: "0",
    borderRadiusLg: "0",
  },
  elements: {
    card: { style: { textTransform: "lowercase", letterSpacing: "0.3px" } },
    // Pseudo-state keys nest inside \`style\` (Stripe-Elements pattern).
    // The package compiles them to a scoped class at runtime.
    buttonPrimary: {
      style: {
        textTransform: "lowercase",
        ":hover": {
          textDecoration: "underline",
          textDecorationThickness: "0.5px",
        },
      },
    },
    input: {
      style: {
        textTransform: "none",
        border: "0.5px solid #1c2024",
        "::placeholder":  { color: "#60646c", opacity: 1 },
        ":focus-visible": { outline: "0.5px solid #81b300" },
      },
    },
  },
  layout: {
    poweredByKernel:  true,    // false hides the footer entirely
    kernelLogoColor: "green",  // 'auto' | 'green' | 'black' | 'white'
  },
}}`,
  },
];

export function Appearances() {
  const [step, setStep] = useState<Step>("awaiting_input");

  return (
    <div style={{ padding: 32, maxWidth: 1280, margin: "0 auto" }}>
      {/* Hoisted by React 19. Pulls Inter (most variants), Geist (Vercel),
          and Source Serif 4 (Anthropic title slot). Each face only ships if
          a variant actually references it via `fontFamily`. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;350;400;500;600&family=Geist:wght@400;500;600&family=Source+Serif+4:wght@400;500;600&display=swap"
      />
      <Header />
      <ApiOverview />
      <StepPicker step={step} onChange={setStep} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: 24,
        }}
      >
        {variants.map((v) => (
          <Variant key={v.id} spec={v} step={step} />
        ))}
      </div>
    </div>
  );
}

/**
 * Sticks just below the page header. Drives every variant card in lockstep,
 * so you can flip to "expired" or "success" once and audit how every single
 * brand handles it.
 */
function StepPicker({
  step,
  onChange,
}: {
  step: Step;
  onChange: (s: Step) => void;
}) {
  return (
    <div
      style={{
        position: "sticky",
        // Park just under the demo's top nav bar so we don't slide under it.
        top: "var(--demo-nav-height)",
        zIndex: 10,
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
        padding: "12px 0",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <label
        htmlFor="appearances-step"
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--foreground)",
        }}
      >
        Render step in every variant:
      </label>
      <select
        id="appearances-step"
        value={step}
        onChange={(e) => onChange(e.target.value as Step)}
        style={{
          fontSize: 13,
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "6px 10px",
          minWidth: 240,
        }}
      >
        {allSteps.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
        Use this to confirm every step renders correctly under every appearance.
      </span>
    </div>
  );
}

function Header() {
  return (
    <header style={{ marginBottom: 28 }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          margin: "0 0 8px",
          color: "var(--foreground)",
        }}
      >
        Customizing <code>@onkernel/managed-auth-react</code>
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--muted-foreground)",
          margin: 0,
          maxWidth: 760,
          lineHeight: 1.5,
        }}
      >
        The component takes one optional <code>appearance</code> prop with four
        layers, plus an <code>localization</code> prop for strings. Compose any
        combination of the layers below — they all merge with the
        package&rsquo;s defaults.
      </p>
      <p
        style={{
          fontSize: 12,
          color: "var(--muted-foreground)",
          margin: "12px 0 0",
          maxWidth: 760,
          lineHeight: 1.5,
          fontStyle: "italic",
        }}
      >
        Variants below are inspired by public brand work from well-known
        startups — illustrative customization only, not endorsements or
        partnerships. Only Kernel&rsquo;s own wordmark renders in any variant
        (color picked via <code>appearance.layout.kernelLogoColor</code>).
      </p>
    </header>
  );
}

function ApiOverview() {
  return (
    <section
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 32,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20,
      }}
    >
      <ApiPanel
        layer="appearance.variables"
        body="Design tokens emitted as CSS custom properties on the root. Recolor / re-radius / re-font the entire flow in one place."
        examples={[
          "colorPrimary",
          "colorBackground",
          "colorBorder",
          "borderRadius",
          "fontFamily",
          "fontSize",
        ]}
      />
      <ApiPanel
        layer="appearance.elements"
        body={
          "Per-slot overrides. Each value can be a className string, a style object, or { className, style }. Style objects accept nested pseudo-state keys (:hover, :focus, :focus-visible, :active, :disabled, ::placeholder) — compiled to a scoped class at runtime."
        }
        examples={[
          "card",
          "title",
          "input  (with ::placeholder, :focus-visible)",
          "buttonPrimary  (with :hover, :disabled)",
          "ssoButton",
          "poweredBy / poweredByLogo",
        ]}
      />
      <ApiPanel
        layer="appearance.layout"
        body="Structural toggles — show / hide whole sections without touching CSS. Some keys are typed enums (e.g. `kernelLogoColor`) restricted to brand-sanctioned values; the corresponding `elements` slot remains as an explicit escape hatch."
        examples={[
          "poweredByKernel: boolean",
          "kernelLogoColor: 'auto' | 'green' | 'black' | 'white'",
          "showLegalText",
          "showSecurityCard",
          "socialButtonsPlacement: 'top' | 'bottom'",
          "skipPrimeStep",
        ]}
      />
      <ApiPanel
        layer="appearance.theme"
        body={`'light' | 'dark' | 'auto' (default 'auto'). 'auto' follows the user's prefers-color-scheme.`}
        examples={["theme: 'dark'"]}
      />
      <ApiPanel
        layer="localization"
        body="Replace any user-visible string. Function values receive interpolation args (siteName, provider). Anything you omit falls back to English."
        examples={[
          "primeTitle: (site) => `…`",
          "submitButton",
          "credentialSafetyNotice",
          "errorTitle",
          "mfaTypeLabels.sms",
        ]}
      />
    </section>
  );
}

function ApiPanel({
  layer,
  body,
  examples,
}: {
  layer: string;
  body: string;
  examples: string[];
}) {
  return (
    <div>
      <code
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--foreground)",
          background: "var(--muted)",
          padding: "2px 6px",
          borderRadius: 4,
        }}
      >
        {layer}
      </code>
      <p
        style={{
          fontSize: 13,
          color: "var(--muted-foreground)",
          lineHeight: 1.5,
          margin: "8px 0 8px",
        }}
      >
        {body}
      </p>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {examples.map((e) => (
          <li
            key={e}
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              color: "var(--muted-foreground)",
            }}
          >
            <span style={{ opacity: 0.5 }}>·</span> {e}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Variant({ spec, step }: { spec: VariantSpec; step: Step }) {
  // Each preview lives in its own AppearanceProvider/LocalizationProvider
  // so the slot overrides don't bleed into siblings. We override the `root`
  // slot to remove the package's default `min-height: 100vh` + page padding,
  // since we're embedding the Shell inside a grid card.
  const previewAppearance: Appearance = {
    ...spec.appearance,
    elements: {
      ...spec.appearance?.elements,
      root: {
        style: {
          minHeight: 0,
          padding: 0,
          background: "transparent",
          display: "block",
        },
      },
      shell: {
        style: {
          maxWidth: "100%",
          gap: 16,
        },
      },
    },
  };

  return (
    <article
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <header>
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--foreground)",
          }}
        >
          {spec.title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--muted-foreground)",
            lineHeight: 1.5,
          }}
        >
          {spec.description}
        </p>
      </header>

      <pre
        style={{
          margin: 0,
          background: "var(--muted)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "10px 12px",
          fontFamily: "ui-monospace, monospace",
          fontSize: 11,
          lineHeight: 1.5,
          color: "var(--foreground)",
          overflowX: "auto",
        }}
      >
        {spec.code}
      </pre>

      <div
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 16,
        }}
      >
        <AppearanceProvider appearance={previewAppearance}>
          <LocalizationProvider localization={spec.localization}>
            <Shell appearance={previewAppearance}>{renderStep(step)}</Shell>
          </LocalizationProvider>
        </AppearanceProvider>
      </div>
    </article>
  );
}
