import { describe, expect, test } from "bun:test";
import type {
  ManagedAuthResponse,
  ManagedAuthStateEventData,
} from "../lib/types";
import { mergeStateEvent, normalizeManagedAuthState } from "./state";

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

describe("mergeStateEvent", () => {
  test("clears awaiting-input state omitted from the next snapshot", () => {
    const base = managedAuthState({
      interaction_id: "mai_previous",
      fields: [
        {
          id: "field_email",
          ref: "email",
          type: "identifier",
          label: "Email",
          reason: "missing",
        },
      ],
      choices: [{ id: "google", type: "sso_provider", label: "Google" }],
      discovered_fields: [{ name: "email", label: "Email", type: "email" }],
      pending_sso_buttons: [
        { provider: "google", selector: "button.google", label: "Google" },
      ],
      mfa_options: [{ type: "sms", label: "Text message" }],
      sign_in_options: [{ id: "work", label: "Work account" }],
    });
    const event: ManagedAuthStateEventData = {
      event: "managed_auth_state",
      timestamp: "2026-07-28T00:00:00Z",
      flow_status: "IN_PROGRESS",
      flow_step: "SUBMITTING",
    };

    expect(mergeStateEvent(base, event)).toMatchObject({
      interaction_id: null,
      fields: null,
      choices: null,
      discovered_fields: null,
      pending_sso_buttons: null,
      mfa_options: null,
      sign_in_options: null,
    });
  });

  test("retains the interaction ID from an actionable state event", () => {
    const event: ManagedAuthStateEventData = {
      event: "managed_auth_state",
      timestamp: "2026-07-28T00:00:00Z",
      flow_status: "IN_PROGRESS",
      flow_step: "AWAITING_INPUT",
      interaction_id: "mai_current",
      fields: [],
      choices: [],
    };

    expect(mergeStateEvent(managedAuthState(), event)).toMatchObject({
      interaction_id: "mai_current",
      fields: [],
      choices: [],
    });
  });
});

describe("normalizeManagedAuthState", () => {
  test("uses legacy awaiting-input data when canonical data is absent", () => {
    const legacy = managedAuthState({
      discovered_fields: [{ name: "email", label: "Email", type: "email" }],
      mfa_options: [{ type: "sms", label: "Text message" }],
      sign_in_options: [{ id: "work", label: "Work account" }],
    });

    expect(normalizeManagedAuthState(legacy)).toMatchObject({
      discovered_fields: legacy.discovered_fields,
      mfa_options: legacy.mfa_options,
      sign_in_options: legacy.sign_in_options,
    });
  });

  test("treats canonical fields and choices as authoritative", () => {
    const state = managedAuthState({
      fields: [],
      choices: [
        {
          id: "google",
          type: "sso_provider",
          label: "Continue with Google",
          observed_selector: "button.google",
        },
      ],
      discovered_fields: [
        { name: "stale", label: "Stale field", type: "text" },
      ],
      mfa_options: [{ type: "sms", label: "Stale MFA" }],
      sign_in_options: [{ id: "stale", label: "Stale account" }],
    });

    expect(normalizeManagedAuthState(state)).toMatchObject({
      discovered_fields: null,
      pending_sso_buttons: [
        {
          id: "google",
          provider: "google",
          selector: "button.google",
          label: "Continue with Google",
        },
      ],
      mfa_options: null,
      sign_in_options: null,
    });
  });

  test("preserves canonical MFA identity and the matching legacy destination", () => {
    const state = managedAuthState({
      choices: [
        {
          id: "text-ending-4821",
          type: "mfa_method",
          mfa_type: "sms",
          label: "Text ending in 4821",
          description: "Six-digit code",
          masked_destination: "***-***-4821",
          display_text: "Personal phone",
          context: "Primary number",
        },
        {
          id: "text-ending-9930",
          type: "mfa_method",
          mfa_type: "sms",
          label: "Text ending in 9930",
        },
        {
          id: "security_key_vendor",
          type: "mfa_method",
          label: "Security key",
        },
      ],
      mfa_options: [
        {
          type: "sms",
          label: "Stale first option",
          target: "***-***-0000",
        },
        {
          type: "sms",
          label: "Text ending in 9930",
          target: "***-***-9930",
        },
      ],
    });

    expect(normalizeManagedAuthState(state).mfa_options).toEqual([
      {
        id: "text-ending-4821",
        type: "sms",
        label: "Personal phone",
        target: "***-***-4821",
        description: "Primary number",
      },
      {
        id: "text-ending-9930",
        type: "sms",
        label: "Text ending in 9930",
        target: "***-***-9930",
        description: undefined,
      },
      {
        id: "security_key_vendor",
        type: "other",
        label: "Security key",
        target: undefined,
        description: undefined,
      },
    ]);
  });

  test("projects canonical identifier fields and non-MFA choices into the existing UI model", () => {
    const state = managedAuthState({
      fields: [
        {
          id: "field_username",
          ref: "username",
          type: "identifier",
          label: "Username",
          reason: "missing",
        },
        {
          id: "field_email",
          ref: "email",
          type: "identifier",
          label: "Email",
          reason: "missing",
        },
        {
          id: "field_phone",
          ref: "phone_number",
          type: "identifier",
          label: "Phone",
          reason: "missing",
        },
      ],
      choices: [
        {
          id: "work-account",
          type: "account",
          label: "Work account",
          description: "user@example.com",
          display_text: "Work profile",
          context: "user@example.com",
        },
      ],
    });

    expect(normalizeManagedAuthState(state)).toMatchObject({
      discovered_fields: [
        {
          id: "field_username",
          ref: "username",
          name: "field_username",
          type: "text",
          label: "Username",
          required: true,
        },
        {
          id: "field_email",
          ref: "email",
          name: "field_email",
          type: "email",
          label: "Email",
          required: true,
        },
        {
          id: "field_phone",
          ref: "phone_number",
          name: "field_phone",
          type: "tel",
          label: "Phone",
          required: true,
        },
      ],
      sign_in_options: [
        {
          id: "work-account",
          type: "account",
          label: "Work profile",
          description: "user@example.com",
        },
      ],
    });
  });
});

describe("field reason", () => {
  test("carries the canonical field reason into the rendered field", () => {
    const state = managedAuthState({
      fields: [
        {
          id: "field_password",
          ref: "password",
          type: "password",
          label: "Password",
          reason: "rejected",
        },
      ],
    });

    const derived = normalizeManagedAuthState(state).discovered_fields;
    expect(derived?.[0].reason).toBe("rejected");
  });

  test("projects the exact field shape the form renders", () => {
    const state = managedAuthState({
      fields: [
        {
          id: "field_password",
          ref: "password",
          type: "password",
          label: "Password",
          required: false,
          reason: "missing",
        },
      ],
      discovered_fields: [
        {
          name: "password",
          type: "password",
          label: "Password",
          placeholder: "Enter password",
          hint: "Use the password for this account",
        },
      ],
    });

    expect(normalizeManagedAuthState(state).discovered_fields).toStrictEqual([
      {
        id: "field_password",
        ref: "password",
        name: "field_password",
        type: "password",
        label: "Password",
        placeholder: "Enter password",
        required: false,
        reason: "missing",
        hint: "Use the password for this account",
      },
    ]);
  });
});
