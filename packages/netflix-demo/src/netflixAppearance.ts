import type { Appearance, Localization } from "@onkernel/managed-auth-react";

/**
 * Netflix-style appearance for `<KernelManagedAuth />`.
 *
 * Pulls from Netflix's public sign-in page: black surface, charcoal card,
 * white type, signature red primary CTA (#e50914), tight 4px radius, and
 * the floating-label input pattern via a thicker dark gray fill.
 *
 * `kernelLogoColor: "white"` keeps the Powered-by row legible on the
 * near-black card.
 */
export const netflixAppearance: Appearance = {
  theme: "dark",
  variables: {
    colorBackground: "transparent",
    colorCard: "rgba(0, 0, 0, 0.75)",
    colorCardForeground: "#ffffff",
    colorForeground: "#ffffff",
    colorMuted: "#2f2f2f",
    colorMutedForeground: "#b3b3b3",
    colorBorder: "rgba(255, 255, 255, 0.08)",
    colorInput: "#333333",
    colorInputForeground: "#ffffff",
    colorPrimary: "#e50914",
    colorPrimaryForeground: "#ffffff",
    colorRing: "#e50914",
    colorSuccess: "#46d369",
    colorSuccessForeground: "#000000",
    colorDanger: "#e87c03",
    colorDangerForeground: "#000000",
    fontFamily:
      "'Inter', 'Netflix Sans', ui-sans-serif, system-ui, sans-serif",
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 700,
    borderRadius: "4px",
    borderRadiusSm: "2px",
    borderRadiusLg: "6px",
  },
  elements: {
    card: {
      style: {
        background: "rgba(0, 0, 0, 0.75)",
        border: "none",
        boxShadow: "none",
      },
    },
    title: {
      style: {
        fontSize: 32,
        fontWeight: 700,
        letterSpacing: "-0.01em",
        marginBottom: 28,
      },
    },
    subtitle: {
      style: { color: "#b3b3b3" },
    },
    description: {
      style: { color: "#b3b3b3" },
    },
    label: {
      style: { color: "#b3b3b3", fontWeight: 500 },
    },
    input: {
      style: {
        background: "#333333",
        border: "none",
        color: "#ffffff",
        height: 50,
        fontSize: 16,
        padding: "16px 20px 0",
        borderRadius: 4,
        "::placeholder": { color: "#8c8c8c", opacity: 1 },
        ":focus-visible": {
          outline: "none",
          background: "#454545",
          boxShadow: "inset 0 -2px 0 #e50914",
        },
        ":hover": { background: "#454545" },
      },
    },
    buttonPrimary: {
      style: {
        background: "#e50914",
        color: "#ffffff",
        fontSize: 16,
        fontWeight: 700,
        height: 48,
        textTransform: "none",
        letterSpacing: "0.01em",
        borderRadius: 4,
        ":hover": {
          background: "#f6121d",
          opacity: 1,
        },
        ":active": { background: "#b1060f" },
        ":disabled": { background: "rgba(229, 9, 20, 0.5)", opacity: 1 },
      },
    },
    buttonSecondary: {
      style: {
        background: "rgba(255, 255, 255, 0.08)",
        color: "#ffffff",
        border: "none",
        ":hover": {
          background: "rgba(255, 255, 255, 0.16)",
          opacity: 1,
        },
      },
    },
    ssoButton: {
      style: {
        background: "rgba(255, 255, 255, 0.08)",
        color: "#ffffff",
        border: "none",
        height: 48,
        fontWeight: 500,
        ":hover": {
          background: "rgba(255, 255, 255, 0.16)",
          opacity: 1,
        },
      },
    },
    mfaOption: {
      style: {
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        ":hover": {
          background: "rgba(255, 255, 255, 0.08)",
          opacity: 1,
        },
      },
    },
    signInOption: {
      style: {
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        ":hover": {
          background: "rgba(255, 255, 255, 0.08)",
          opacity: 1,
        },
      },
    },
    divider: { style: { color: "#808080" } },
    dividerLine: { style: { borderColor: "rgba(255, 255, 255, 0.1)" } },
    dividerText: { style: { color: "#808080", fontSize: 13 } },
    securityCard: {
      style: {
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      },
    },
    securityText: { style: { color: "#b3b3b3", fontSize: 13 } },
    legalText: { style: { color: "#808080", fontSize: 13 } },
    legalLink: { style: { color: "#0071eb" } },
    errorBanner: {
      style: {
        background: "#e87c03",
        color: "#000000",
        borderRadius: 4,
        padding: "10px 20px",
      },
    },
    successIcon: { style: { color: "#46d369" } },
    poweredBy: { style: { color: "#808080" } },
  },
  layout: {
    poweredByKernel: true,
    kernelLogoColor: "white",
    showSecurityCard: true,
  },
};

export const netflixLocalization: Localization = {
  loginTitle: () => "Sign In",
  primeContinueButton: "Sign In",
  submitButton: "Sign In",
  submittingButton: "Signing in…",
  ssoButtonLabel: (provider) => `Continue with ${provider}`,
  orDivider: "OR",
};
