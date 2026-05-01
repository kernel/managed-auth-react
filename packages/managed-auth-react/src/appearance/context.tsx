import { createContext, useContext, useMemo, type ReactNode } from "react";
import clsx from "clsx";
import type {
  Appearance,
  AppearanceElementKey,
  AppearanceElements,
  ElementStyle,
  ElementValue,
} from "./types";
import { compilePseudoStyle } from "./pseudoStyles";

interface AppearanceContextValue {
  elements: AppearanceElements;
}

const AppearanceContext = createContext<AppearanceContextValue>({
  elements: {},
});

interface AppearanceProviderProps {
  appearance?: Appearance;
  children: ReactNode;
}

export function AppearanceProvider({
  appearance,
  children,
}: AppearanceProviderProps) {
  const value = useMemo<AppearanceContextValue>(
    () => ({ elements: appearance?.elements ?? {} }),
    [appearance?.elements],
  );
  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

function normalizeElement(value: ElementValue | undefined): {
  className?: string;
  style?: ElementStyle;
} {
  if (value === undefined || value === null) return {};
  if (typeof value === "string") return { className: value };
  if ("className" in value || "style" in value) {
    return {
      className: (value as { className?: string }).className,
      style: (value as { style?: ElementStyle }).style,
    };
  }
  // Bare style object (may include pseudo-state nested keys).
  return { style: value as ElementStyle };
}

/**
 * Returns the props to spread on an internal element. Merges the internal
 * default className with the customer's `elements[key]` override.
 *
 * @example
 *   const slot = useSlot();
 *   <button {...slot("buttonPrimary", "kma-button kma-button--primary")}>
 */
export function useSlot() {
  const { elements } = useContext(AppearanceContext);
  return function slot(
    key: AppearanceElementKey,
    internalClassName?: string,
  ): {
    className: string;
    style?: React.CSSProperties;
    "data-kma-element": AppearanceElementKey;
  } {
    const { className, style } = normalizeElement(elements[key]);
    // Split out :hover / :focus / ::placeholder etc. into a generated class.
    // The base CSSProperties (everything not under a pseudo key) still flows
    // through as inline `style` so simple usage stays a single render-time
    // object with no stylesheet round-trip.
    const { base, className: pseudoClassName } = compilePseudoStyle(style);
    return {
      className: clsx(internalClassName, className, pseudoClassName) || "",
      style: base,
      "data-kma-element": key,
    };
  };
}
