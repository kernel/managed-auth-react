import type { MFAType } from "../lib/types";

/**
 * All user-facing strings in the managed auth flow. Partial — any omitted
 * key falls back to the English default.
 */
export interface Localization {
  /** Consent / prime step. */
  primeTitle?: (siteDisplayName: string) => string;
  primeSubtitle?: (siteName: string) => string;
  primeContinueButton?: string;
  primeLoadingButton?: string;
  securityEncryption?: string;
  securityNoThirdParty?: string;
  legalPrefix?: string;
  legalPrivacyPolicy?: string;
  legalTermsOfService?: string;
  legalConjunction?: string;
  /** Discovery / loading. */
  discoveringMessage?: string;
  waitingForFormMessage?: string;
  submittingMessage?: string;
  /** Unified auth form. */
  loginTitle?: (siteName: string) => string;
  ssoLoginTitle?: (provider: string) => string;
  ssoLoginSubtitle?: (siteName: string) => string;
  mfaSelectTitle?: string;
  mfaSelectSubtitle?: string;
  signInSelectTitle?: string;
  signInSelectSubtitle?: string;
  submitButton?: string;
  submittingButton?: string;
  ssoButtonLabel?: (provider: string) => string;
  orDivider?: string;
  passwordShow?: string;
  passwordHide?: string;
  credentialSafetyNotice?: string;
  /** MFA type labels. */
  mfaTypeLabels?: Partial<Record<MFAType, string>>;
  /** Success step. */
  successTitle?: string;
  successDescription?: (siteName: string) => string;
  /** Error step. */
  errorTitle?: string;
  errorGenericMessage?: string;
  errorCodeLabel?: string;
  /** Expired step. */
  expiredTitle?: string;
  expiredDescription?: string;
  /** External action. */
  externalActionFallbackMessage?: string;
}

export type Localizer = Required<Localization>;
