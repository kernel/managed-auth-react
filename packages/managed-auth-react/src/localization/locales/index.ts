import { DEFAULT_LOCALIZATION } from "../defaults";
import type { Localizer } from "../types";
import { da } from "./da";
import { de } from "./de";
import { es } from "./es";
import { fi } from "./fi";
import { fr } from "./fr";
import { it } from "./it";
import { nb } from "./nb";
import { nl } from "./nl";
import { pl } from "./pl";
import { sv } from "./sv";

/** Built-in localizations, keyed by language subtag. */
export const LOCALIZATIONS = {
  en: DEFAULT_LOCALIZATION,
  da,
  de,
  es,
  fi,
  fr,
  it,
  nb,
  nl,
  pl,
  sv,
} satisfies Record<string, Localizer>;

export type SupportedLocale = keyof typeof LOCALIZATIONS;

/**
 * Returns the first entry in `preferred` (BCP 47 tags, most preferred first)
 * with a built-in localization, matching on the language subtag.
 */
export function matchLocale(
  preferred: readonly string[],
): SupportedLocale | undefined {
  for (const tag of preferred) {
    const language = tag.trim().toLowerCase().split(/[-_]/)[0];
    // Browsers send "no" for Norwegian; Bokmål is its written standard.
    const locale = language === "no" ? "nb" : language;
    if (Object.prototype.hasOwnProperty.call(LOCALIZATIONS, locale)) {
      return locale as SupportedLocale;
    }
  }
  return undefined;
}
