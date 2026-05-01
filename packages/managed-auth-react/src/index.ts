export { KernelManagedAuth } from "./KernelManagedAuth";
export type { KernelManagedAuthProps } from "./KernelManagedAuth";

export type {
  Appearance,
  AppearanceElements,
  AppearanceElementKey,
  AppearanceVariables,
  AppearanceLayout,
  ColorScheme,
  ElementValue,
  ElementStyle,
  ElementStylePseudoKey,
  KernelLogoColor,
} from "./appearance/types";

export type { Localization, Localizer } from "./localization";
export { DEFAULT_LOCALIZATION, LocalizationProvider } from "./localization";
export { AppearanceProvider } from "./appearance/context";

/**
 * Headless step components. Use these directly when you need to compose the
 * managed-auth UI yourself (e.g. driving state from a custom controller, a
 * Storybook/test harness, or a non-standard flow). For typical usage prefer
 * the all-in-one `<KernelManagedAuth />`.
 */
export { Shell } from "./components/Shell";
export { StepPrime } from "./components/StepPrime";
export { StepSuccess } from "./components/StepSuccess";
export { StepError } from "./components/StepError";
export { StepExpired } from "./components/StepExpired";
export { LoadingState } from "./components/LoadingState";
export { ExternalActionWaiting } from "./components/ExternalActionWaiting";
export { UnifiedAuthForm } from "./components/UnifiedAuthForm";

export type {
  AuthSuccessPayload,
  AuthErrorPayload,
  MFAType,
  DiscoveredField,
  SSOButton,
  MFAOption,
  SignInOption,
  FlowStatus,
  FlowStep,
  ManagedAuthResponse,
  UIState,
} from "./lib/types";

export { ManagedAuthApiError } from "./lib/api";
