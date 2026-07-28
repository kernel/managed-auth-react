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
      fields: [
        {
          id: "field_email",
          ref: "email",
          type: "identifier",
          label: "Email",
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
      fields: null,
      choices: null,
      discovered_fields: null,
      pending_sso_buttons: null,
      mfa_options: null,
      sign_in_options: null,
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
          id: "sms_code",
          type: "mfa_method",
          label: "Text me a code",
          description: "Six-digit code",
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
          label: "Text me a code",
          target: "***-***-5678",
        },
      ],
    });

    expect(normalizeManagedAuthState(state).mfa_options).toEqual([
      {
        id: "sms_code",
        type: "sms",
        label: "Text me a code",
        target: "***-***-5678",
        description: "Six-digit code",
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

  test("projects canonical fields and non-MFA choices into the existing UI model", () => {
    const state = managedAuthState({
      fields: [
        {
          id: "field_email",
          ref: "email",
          type: "identifier",
          label: "Email address",
        },
      ],
      choices: [
        {
          id: "work-account",
          type: "account",
          label: "Work account",
          description: "user@example.com",
        },
      ],
    });

    expect(normalizeManagedAuthState(state)).toMatchObject({
      discovered_fields: [
        {
          id: "field_email",
          ref: "email",
          name: "field_email",
          type: "email",
          label: "Email address",
          required: true,
        },
      ],
      sign_in_options: [
        {
          id: "work-account",
          label: "Work account",
          description: "user@example.com",
        },
      ],
    });
  });
});
