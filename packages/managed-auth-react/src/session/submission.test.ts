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

function canonicalState(
  overrides: Partial<ManagedAuthResponse> = {},
): ManagedAuthResponse {
  return managedAuthState({
    interaction_id: "mai_current",
    fields: [],
    choices: [],
    ...overrides,
  });
}

describe("managed auth submissions", () => {
  test("submits fields through the contract that produced the UI", () => {
    const values = { field_email: "user@example.com" };

    expect(buildFieldSubmission(canonicalState(), values)).toEqual({
      interaction_id: "mai_current",
      field_values: values,
    });
    expect(buildFieldSubmission(managedAuthState(), values)).toEqual({
      fields: values,
    });
  });

  test("submits canonical and legacy SSO choices without mixing contracts", () => {
    const button = {
      id: "google",
      provider: "google",
      selector: "button.google",
    };
    expect(buildSSOSubmission(canonicalState(), button)).toEqual({
      interaction_id: "mai_current",
      selected_choice_id: "google",
    });
    expect(buildSSOSubmission(managedAuthState(), button)).toEqual({
      fields: {},
      sso_button_selector: "button.google",
    });
  });

  test("preserves canonical MFA choice IDs instead of submitting normalized types", () => {
    expect(
      buildMFASubmission(canonicalState(), "other", "security_key_vendor"),
    ).toEqual({
      interaction_id: "mai_current",
      selected_choice_id: "security_key_vendor",
    });
    expect(buildMFASubmission(managedAuthState(), "sms")).toEqual({
      fields: {},
      mfa_option_id: "sms",
    });
  });

  test("submits sign-in choices through the contract that produced them", () => {
    expect(buildSignInSubmission(canonicalState(), "work-account")).toEqual({
      interaction_id: "mai_current",
      selected_choice_id: "work-account",
    });
    expect(buildSignInSubmission(managedAuthState(), "work-account")).toEqual({
      fields: {},
      sign_in_option_id: "work-account",
    });
  });

  test("rejects incomplete canonical state instead of falling back to legacy", () => {
    const state = managedAuthState({ fields: [], choices: [] });
    expect(() => buildFieldSubmission(state, {})).toThrow("interaction_id");
    expect(() =>
      buildSSOSubmission(state, {
        id: "google",
        provider: "google",
        selector: "button.google",
      }),
    ).toThrow("interaction_id");
    expect(() => buildMFASubmission(canonicalState(), "sms")).toThrow(
      "missing an id",
    );
  });
});
