import type { CSSProperties } from "react";
import type { AppearanceVariables } from "./types";

const VARIABLE_MAP: Record<keyof AppearanceVariables, string> = {
  colorPrimary: "--kma-color-primary",
  colorPrimaryForeground: "--kma-color-primary-foreground",
  colorBackground: "--kma-color-background",
  colorForeground: "--kma-color-foreground",
  colorMuted: "--kma-color-muted",
  colorMutedForeground: "--kma-color-muted-foreground",
  colorCard: "--kma-color-card",
  colorCardForeground: "--kma-color-card-foreground",
  colorBorder: "--kma-color-border",
  colorInput: "--kma-color-input",
  colorInputForeground: "--kma-color-input-foreground",
  colorRing: "--kma-color-ring",
  colorDanger: "--kma-color-danger",
  colorDangerForeground: "--kma-color-danger-foreground",
  colorSuccess: "--kma-color-success",
  colorSuccessForeground: "--kma-color-success-foreground",
  colorWarning: "--kma-color-warning",
  colorWarningForeground: "--kma-color-warning-foreground",
  borderRadius: "--kma-radius",
  borderRadiusSm: "--kma-radius-sm",
  borderRadiusLg: "--kma-radius-lg",
  fontFamily: "--kma-font-family",
  fontSize: "--kma-font-size",
  fontSizeSm: "--kma-font-size-sm",
  fontSizeLg: "--kma-font-size-lg",
  fontWeightNormal: "--kma-font-weight-normal",
  fontWeightMedium: "--kma-font-weight-medium",
  fontWeightSemibold: "--kma-font-weight-semibold",
  spacingUnit: "--kma-spacing-unit",
  shadow: "--kma-shadow",
  transitionDuration: "--kma-transition-duration",
};

/**
 * Convert an `AppearanceVariables` object into a React inline-style object
 * of CSS custom properties. Numeric values gain a `px` suffix.
 */
export function variablesToStyle(vars?: AppearanceVariables): CSSProperties {
  if (!vars) return {};
  const out: Record<string, string> = {};
  for (const key of Object.keys(vars) as (keyof AppearanceVariables)[]) {
    const value = vars[key];
    if (value === undefined || value === null) continue;
    const cssName = VARIABLE_MAP[key];
    if (!cssName) continue;
    out[cssName] = typeof value === "number" ? `${value}px` : String(value);
  }
  return out as CSSProperties;
}
