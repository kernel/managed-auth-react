import type { CSSProperties } from "react";

/**
 * Per-element override value. Accepts any of:
 *   - a className string              → 'my-button'
 *   - a CSSProperties style object    → { color: 'red' }
 *   - a composite                     → { className: 'x', style: { color: 'red' } }
 */
export type ElementValue =
  | string
  | CSSProperties
  | { className?: string; style?: CSSProperties };

/**
 * Every stylable element in the managed auth flow gets a stable key here.
 * Customers target these keys via the `elements` prop on `Appearance`.
 */
export interface AppearanceElements {
  /** The outermost wrapper — full page container. */
  root?: ElementValue;
  /** The centered, max-width inner wrapper. */
  shell?: ElementValue;
  /** The white card holding the active step. */
  card?: ElementValue;
  /** The "Powered by Kernel" footer below the card. */
  poweredBy?: ElementValue;
  poweredByLink?: ElementValue;
  /** SVG of the Kernel logo inside the powered-by footer. */
  poweredByLogo?: ElementValue;
  /** Icon displayed on the prime (consent) step. */
  siteIcon?: ElementValue;
  /** Step title heading. */
  title?: ElementValue;
  /** Step subtitle text. */
  subtitle?: ElementValue;
  /** Generic paragraph / body copy. */
  description?: ElementValue;
  /** Security-highlight card on the prime step. */
  securityCard?: ElementValue;
  securityRow?: ElementValue;
  securityIcon?: ElementValue;
  securityText?: ElementValue;
  /** Input label above a field. */
  label?: ElementValue;
  /** Input field container (for relative positioning of password toggle). */
  inputWrapper?: ElementValue;
  /** Input element itself. */
  input?: ElementValue;
  /** Small hint text under an input. */
  inputHint?: ElementValue;
  /** Password show/hide toggle button. */
  passwordToggle?: ElementValue;
  /** All buttons — base. */
  button?: ElementValue;
  /** Primary action button (e.g. "Continue", "Log in"). */
  buttonPrimary?: ElementValue;
  /** Secondary / outline button (e.g. SSO, MFA options). */
  buttonSecondary?: ElementValue;
  /** "OR" divider separating sections. */
  divider?: ElementValue;
  dividerLine?: ElementValue;
  dividerText?: ElementValue;
  /** SSO button (e.g. "Log in with Google"). */
  ssoButton?: ElementValue;
  ssoButtonIcon?: ElementValue;
  ssoButtonLabel?: ElementValue;
  /** MFA selection button. */
  mfaOption?: ElementValue;
  mfaOptionIcon?: ElementValue;
  mfaOptionLabel?: ElementValue;
  mfaOptionTarget?: ElementValue;
  mfaOptionDescription?: ElementValue;
  /** Sign-in option button (account / org picker). */
  signInOption?: ElementValue;
  signInOptionLabel?: ElementValue;
  signInOptionDescription?: ElementValue;
  signInOptionChevron?: ElementValue;
  /** Error banner shown at the top of forms. */
  errorBanner?: ElementValue;
  errorBannerText?: ElementValue;
  /** Full-screen error step. */
  errorIcon?: ElementValue;
  errorTitle?: ElementValue;
  errorDescription?: ElementValue;
  errorCode?: ElementValue;
  /** Success screen. */
  successIcon?: ElementValue;
  successTitle?: ElementValue;
  successDescription?: ElementValue;
  /** Expired step. */
  expiredIcon?: ElementValue;
  expiredCard?: ElementValue;
  expiredTitle?: ElementValue;
  expiredDescription?: ElementValue;
  /** Loading indicator. */
  spinner?: ElementValue;
  loadingText?: ElementValue;
  /** External action waiting screen. */
  externalActionIcon?: ElementValue;
  externalActionMessage?: ElementValue;
  /** Form wrapper. */
  form?: ElementValue;
  formField?: ElementValue;
  /** Footer legal / ToS text. */
  legalText?: ElementValue;
  legalLink?: ElementValue;
}

export type AppearanceElementKey = keyof AppearanceElements;

/**
 * Design tokens. Emitted as CSS custom properties on the root element.
 * Any omitted variable falls back to its default in the shipped stylesheet.
 */
export interface AppearanceVariables {
  colorPrimary?: string;
  colorPrimaryForeground?: string;
  colorBackground?: string;
  colorForeground?: string;
  colorMuted?: string;
  colorMutedForeground?: string;
  colorCard?: string;
  colorCardForeground?: string;
  colorBorder?: string;
  colorInput?: string;
  colorInputForeground?: string;
  colorRing?: string;
  colorDanger?: string;
  colorDangerForeground?: string;
  colorSuccess?: string;
  colorSuccessForeground?: string;
  colorWarning?: string;
  colorWarningForeground?: string;
  borderRadius?: string | number;
  borderRadiusSm?: string | number;
  borderRadiusLg?: string | number;
  fontFamily?: string;
  fontSize?: string | number;
  fontSizeSm?: string | number;
  fontSizeLg?: string | number;
  fontWeightNormal?: string | number;
  fontWeightMedium?: string | number;
  fontWeightSemibold?: string | number;
  spacingUnit?: string | number;
  shadow?: string;
  transitionDuration?: string;
}

/**
 * Structural toggles that change layout rather than styling.
 */
export interface AppearanceLayout {
  /**
   * Show the "Powered by Kernel" footer under the card.
   * @default true
   */
  poweredByKernel?: boolean;
  /**
   * Show the legal/ToS text on the consent (prime) step.
   * @default true
   */
  showLegalText?: boolean;
  /**
   * Show the security-highlights card on the consent step.
   * @default true
   */
  showSecurityCard?: boolean;
  /**
   * Placement of SSO/social buttons relative to the email+password form,
   * when both are present.
   * @default 'bottom'
   */
  socialButtonsPlacement?: "top" | "bottom";
  /**
   * When true, the consent (prime) step is skipped and discovery begins
   * immediately.
   * @default false
   */
  skipPrimeStep?: boolean;
}

export type ColorScheme = "light" | "dark" | "auto";

/**
 * Top-level appearance prop. Compose any/all of the layers.
 */
export interface Appearance {
  /** Design tokens → CSS variables. */
  variables?: AppearanceVariables;
  /** Per-element className / style overrides. */
  elements?: AppearanceElements;
  /** Structural layout toggles. */
  layout?: AppearanceLayout;
  /** Color scheme. @default 'auto' */
  theme?: ColorScheme;
}
