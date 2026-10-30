import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { LocalizationProvider } from "../localization/context";
import { DEFAULT_LOCALIZATION } from "../localization/defaults";
import { LOCALIZATIONS } from "../localization/locales";
import type { Localization } from "../localization/types";
import { errorDisplayForCode, StepError } from "./StepError";

describe("errorDisplayForCode", () => {
  test("renders typed challenge outcomes with context-neutral copy", () => {
    const cases = [
      ["totp_required", "Authenticator code required"],
      ["sms_code_required", "SMS code required"],
      ["email_code_required", "Email code required"],
      ["account_choice_required", "Account selection required"],
      ["customer_input_required", "Additional input required"],
      ["external_action_required", "External action required"],
    ];

    for (const [code, title] of cases) {
      const display = errorDisplayForCode(DEFAULT_LOCALIZATION, code);
      expect(display?.title).toBe(title);
      expect(display?.description?.toLowerCase()).not.toContain("reauth");
    }
  });

  test("does not infer TOTP secret availability", () => {
    expect(
      errorDisplayForCode(DEFAULT_LOCALIZATION, "totp_required")?.description,
    ).toBe("An authenticator code is required.");
  });

  test("uses customer-facing copy for additional input", () => {
    expect(
      errorDisplayForCode(DEFAULT_LOCALIZATION, "customer_input_required")
        ?.description,
    ).toBe("Additional information is required before login can continue.");
  });

  test("distinguishes a rejected authenticator code from invalid credentials", () => {
    const display = errorDisplayForCode(
      DEFAULT_LOCALIZATION,
      "totp_code_rejected",
    );
    const invalidCredentials = errorDisplayForCode(
      DEFAULT_LOCALIZATION,
      "credentials_invalid",
    );

    expect(display?.title).toBe("Authenticator code rejected");
    expect(display?.description).toContain("Try a fresh code");
    expect(invalidCredentials).toBeTruthy();
    expect(display).not.toEqual(invalidCredentials);
  });
});

describe("StepError description", () => {
  const timeout =
    "A CAPTCHA blocked the login. A person was asked to complete it but didn't finish in time. Please try again.";

  function paragraphs(
    errorMessage?: string,
    errorCode = "captcha_blocked",
    localization?: Localization,
  ) {
    const hadWindow = "window" in globalThis;
    if (!hadWindow) {
      Object.assign(globalThis, {
        window: { addEventListener() {}, removeEventListener() {} },
        document: { readyState: "loading" },
      });
    }
    let renderer!: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        createElement(LocalizationProvider, {
          localization,
          children: createElement(StepError, {
            targetDomain: "example.com",
            errorCode,
            errorMessage,
          }),
        }),
      );
    });
    const texts = renderer.root
      .findAll((node) => node.type === "p" || node.type === "h1")
      .map((node) => node.children.join(""));
    const buttonCount = renderer.root.findAll(
      (node) => node.type === "button",
    ).length;
    act(() => renderer.unmount());
    if (!hadWindow) {
      delete (globalThis as { window?: unknown }).window;
      delete (globalThis as { document?: unknown }).document;
    }
    return { texts, buttonCount };
  }

  test("shows how a captcha_blocked flow ended instead of a fixed description", () => {
    const { texts, buttonCount } = paragraphs(timeout);
    expect(texts).toContain(timeout);
    expect(buttonCount).toBe(0);
  });

  test("falls back to the captcha description when the server sends no message", () => {
    const { texts } = paragraphs();
    expect(texts).toContain("A CAPTCHA blocked the login.");
  });

  test("uses the localization's copy for a known error code", () => {
    const { texts } = paragraphs(
      undefined,
      "credentials_invalid",
      LOCALIZATIONS.de,
    );
    expect(texts).toContain("Ungültige Zugangsdaten");
    expect(texts).toContain(
      "Die Website hat den Benutzernamen oder das Passwort nicht akzeptiert.",
    );
  });

  test("keeps default copy for error codes a partial localization omits", () => {
    const { texts } = paragraphs(undefined, "website_error", {
      errorCodeMessages: {
        credentials_invalid: { title: "Custom", description: "Custom" },
      },
    });
    expect(texts).toContain("Website error");
  });

  test("falls back to the generic message for an unknown error code", () => {
    const { texts } = paragraphs(undefined, "toString");
    expect(texts).toContain(DEFAULT_LOCALIZATION.errorTitle);
    expect(texts).toContain(DEFAULT_LOCALIZATION.errorGenericMessage);
  });
});
