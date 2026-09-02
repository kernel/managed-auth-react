import { describe, expect, test } from "bun:test";
import { errorDisplayForCode } from "./StepError";

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
      const display = errorDisplayForCode(code);
      expect(display?.title).toBe(title);
      expect(display?.description.toLowerCase()).not.toContain("reauth");
    }
  });

  test("does not infer TOTP secret availability", () => {
    expect(errorDisplayForCode("totp_required")?.description).toBe(
      "An authenticator code is required.",
    );
  });

  test("uses customer-facing copy for additional input", () => {
    expect(errorDisplayForCode("customer_input_required")?.description).toBe(
      "Additional information is required before login can continue.",
    );
  });

  test("distinguishes a rejected authenticator code from invalid credentials", () => {
    const display = errorDisplayForCode("totp_code_rejected");
    const invalidCredentials = errorDisplayForCode("credentials_invalid");

    expect(display?.title).toBe("Authenticator code rejected");
    expect(display?.description).toContain("Try a fresh code");
    expect(invalidCredentials).toBeTruthy();
    expect(display).not.toEqual(invalidCredentials);
  });
});
