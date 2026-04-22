import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALIZATION } from "./defaults";
import type { Localization, Localizer } from "./types";

const LocalizationContext = createContext<Localizer>(DEFAULT_LOCALIZATION);

interface LocalizationProviderProps {
  localization?: Localization;
  children: ReactNode;
}

export function LocalizationProvider({
  localization,
  children,
}: LocalizationProviderProps) {
  const merged = useMemo<Localizer>(() => {
    if (!localization) return DEFAULT_LOCALIZATION;
    return {
      ...DEFAULT_LOCALIZATION,
      ...localization,
      mfaTypeLabels: {
        ...DEFAULT_LOCALIZATION.mfaTypeLabels,
        ...(localization.mfaTypeLabels ?? {}),
      },
    };
  }, [localization]);
  return (
    <LocalizationContext.Provider value={merged}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization(): Localizer {
  return useContext(LocalizationContext);
}
