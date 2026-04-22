import { createContext, useContext, useMemo, type ReactNode } from "react";
import clsx from "clsx";
import type {
  Appearance,
  AppearanceElementKey,
  AppearanceElements,
  ElementValue,
} from "./types";

interface AppearanceContextValue {
  elements: AppearanceElements;
}

const AppearanceContext = createContext<AppearanceContextValue>({ elements: {} });

interface AppearanceProviderProps {
  appearance?: Appearance;
  children: ReactNode;
}

export function AppearanceProvider({ appearance, children }: AppearanceProviderProps) {
  const value = useMemo<AppearanceContextValue>(
    () => ({ elements: appearance?.elements ?? {} }),
    [appearance?.elements],
  );
  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

function normalizeElement(value: ElementValue | undefined): {
  className?: string;
  style?: React.CSSProperties;
} {
  if (value === undefined || value === null) return {};
  if (typeof value === "string") return { className: value };
  if ("className" in value || "style" in value) {
    return {
      className: (value as { className?: string }).className,
      style: (value as { style?: React.CSSProperties }).style,
    };
  }
  // Bare CSSProperties object
  return { style: value as React.CSSProperties };
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
    return {
      className: clsx(internalClassName, className) || "",
      style,
      "data-kma-element": key,
    };
  };
}
