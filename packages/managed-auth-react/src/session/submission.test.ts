import { describe, expect, test } from "bun:test";
import type { ManagedAuthResponse } from "../lib/types";
import {
  buildFieldSubmission,
  buildMFASubmission,
  buildSignInSubmission,
  buildSSOSubmission,
} from "./submission";

function managedAuthState(
  overrides: Partial<ManagedAuthResponse> = {},
): ManagedAuthResponse {
  return {
    id: "connection-id",
    domain: "example.com",
    profile_name: "profile",
    flow_status: "IN_PROGRESS",
    flow_step: "AWAITING_INPUT",
    ...overrides,
  };
}

describe("managed auth submissions", () => {
  test("submits fields through the contract that produced the UI", () => {
    const values = { field_email: "user@example.com" };

    expect(
      buildFieldSubmission(managedAuthState({ fields: [] }), values),
    ).toEqual({ field_values: values });
    expect(buildFieldSubmission(managedAuthState(), values)).toEqual({
      fields: values,
    });
  });

  test("submits canonical and legacy SSO choices without mixing contracts", () => {
    expect(
      buildSSOSubmission({
        id: "google",
        provider: "google",
        selector: "button.google",
      }),
    ).toEqual({ selected_choice_id: "google" });
    expect(
      buildSSOSubmission({
        provider: "google",
        selector: "button.google",
      }),
    ).toEqual({ sso_button_selector: "button.google" });
  });

  test("preserves canonical MFA choice IDs instead of submitting normalized types", () => {
    expect(buildMFASubmission("other", "security_key_vendor")).toEqual({
      selected_choice_id: "security_key_vendor",
    });
    expect(buildMFASubmission("sms")).toEqual({ mfa_option_id: "sms" });
  });

  test("submits sign-in choices through the contract that produced them", () => {
    expect(
      buildSignInSubmission(managedAuthState({ choices: [] }), "work-account"),
    ).toEqual({ selected_choice_id: "work-account" });
    expect(buildSignInSubmission(managedAuthState(), "work-account")).toEqual({
      sign_in_option_id: "work-account",
    });
  });
});
