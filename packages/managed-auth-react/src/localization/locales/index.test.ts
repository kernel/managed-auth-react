import { describe, expect, test } from "bun:test";
import { LOCALIZATIONS, matchLocale } from ".";

describe("matchLocale", () => {
  test("returns the first preference with a built-in localization", () => {
    expect(matchLocale(["sv-SE", "en-US"])).toBe("sv");
    expect(matchLocale(["en-GB", "de"])).toBe("en");
  });

  test("skips preferences without a built-in localization", () => {
    expect(matchLocale(["ja-JP", "pt-BR", "de-AT"])).toBe("de");
  });

  test("matches regardless of case, separator, and whitespace", () => {
    expect(matchLocale([" FR_ca "])).toBe("fr");
  });

  test("maps generic Norwegian to Bokmål", () => {
    expect(matchLocale(["no"])).toBe("nb");
    expect(matchLocale(["nb-NO"])).toBe("nb");
  });

  test("returns undefined when nothing matches", () => {
    expect(matchLocale([])).toBeUndefined();
    expect(matchLocale(["*", "ja"])).toBeUndefined();
    expect(matchLocale(["constructor", "toString"])).toBeUndefined();
  });
});

describe("LOCALIZATIONS", () => {
  test("every localization interpolates the site and provider names", () => {
    for (const [locale, l] of Object.entries(LOCALIZATIONS)) {
      const rendered = [
        l.primeTitle("Zalando"),
        l.primeSubtitle("Zalando"),
        l.loginTitle("Zalando"),
        l.ssoLoginSubtitle("Zalando"),
        l.successDescription("Zalando"),
        l.humanInterventionMessage("Zalando"),
        l.ssoLoginTitle("Zalando"),
        l.ssoButtonLabel("Zalando"),
      ];
      for (const text of rendered) {
        expect(text, locale).toContain("Zalando");
      }
    }
  });
});
