import type {
  DiscoveredField,
  ManagedAuthChoice,
  ManagedAuthField,
  ManagedAuthResponse,
  ManagedAuthStateEventData,
  MFAOption,
  MFAType,
  SignInOption,
  SSOButton,
} from "../lib/types";

export function mergeStateEvent(
  base: ManagedAuthResponse,
  event: ManagedAuthStateEventData,
): ManagedAuthResponse {
  return {
    ...base,
    flow_status: event.flow_status,
    flow_step: event.flow_step,
    flow_type: event.flow_type ?? base.flow_type ?? null,
    interaction_id: event.interaction_id ?? null,
    fields: event.fields ?? null,
    choices: event.choices ?? null,
    discovered_fields: event.discovered_fields ?? null,
    pending_sso_buttons: event.pending_sso_buttons ?? null,
    mfa_options: event.mfa_options ?? null,
    sign_in_options: event.sign_in_options ?? null,
    external_action_message: event.external_action_message ?? null,
    website_error: event.website_error ?? null,
    error_message: event.error_message ?? null,
    error_code: event.error_code ?? null,
    post_login_url: event.post_login_url ?? base.post_login_url ?? null,
    live_view_url: event.live_view_url ?? base.live_view_url ?? null,
    hosted_url: event.hosted_url ?? base.hosted_url ?? null,
  };
}

function fieldTypeToDiscoveredType(
  field: ManagedAuthField,
): DiscoveredField["type"] {
  switch (field.type) {
    case "identifier": {
      const ref = field.ref.toLowerCase();
      if (ref.includes("email")) return "email";
      if (ref.includes("phone") || ref.includes("tel")) return "tel";
      return "text";
    }
    case "totp_code":
      return "totp";
    case "totp_secret":
      return "text";
    default:
      return field.type;
  }
}

function fieldsFromCanonical(
  fields: ManagedAuthField[],
): DiscoveredField[] | null {
  if (!fields.length) return null;
  return fields.map((field) => ({
    id: field.id,
    ref: field.ref,
    name: field.id,
    type: fieldTypeToDiscoveredType(field),
    label: field.label || field.ref,
    required: field.required ?? true,
    hint: field.hint,
  }));
}

function ssoButtonsFromCanonical(
  choices: ManagedAuthChoice[],
): SSOButton[] | null {
  const buttons = choices
    .filter((choice) => choice.type === "sso_provider")
    .map((choice) => ({
      id: choice.id,
      provider: choice.id,
      selector: choice.observed_selector || choice.id,
      label: choice.label,
    }));
  return buttons.length ? buttons : null;
}

function normalizeMFAChoiceId(id: string): MFAType {
  switch (id.trim().toLowerCase()) {
    case "sms_code":
    case "sms":
      return "sms";
    case "email_code":
    case "email":
      return "email";
    case "totp_code":
    case "totp":
    case "authenticator":
    case "authenticator_app":
      return "totp";
    case "phone_call":
    case "call":
      return "call";
    case "push":
      return "push";
    case "password":
      return "password";
    case "passkey":
      return "passkey";
    case "switch":
      return "switch";
    default:
      return "other";
  }
}

function mfaTargetKey(type: MFAType, label: string | undefined) {
  return `${type}\u0000${label ?? ""}`;
}

function legacyMFATargets(options: MFAOption[] | null | undefined) {
  const targets = new Map<string, Array<string | undefined>>();
  for (const option of options ?? []) {
    const key = mfaTargetKey(option.type, option.label);
    const existing = targets.get(key) ?? [];
    existing.push(option.target);
    targets.set(key, existing);
  }
  return targets;
}

function mfaOptionsFromCanonical(
  choices: ManagedAuthChoice[],
  legacyOptions: MFAOption[] | null | undefined,
): MFAOption[] | null {
  const targets = legacyMFATargets(legacyOptions);
  const options = choices
    .filter((choice) => choice.type === "mfa_method")
    .map((choice) => {
      const type = choice.mfa_type ?? normalizeMFAChoiceId(choice.id);
      const target =
        choice.masked_destination ??
        targets.get(mfaTargetKey(type, choice.label))?.shift();
      return {
        id: choice.id,
        type,
        label: choice.display_text ?? choice.label,
        target,
        description: choice.context ?? choice.description ?? undefined,
      };
    });
  return options.length ? options : null;
}

function signInOptionsFromCanonical(
  choices: ManagedAuthChoice[],
): SignInOption[] | null {
  const options = choices
    .filter(
      (choice) =>
        choice.type !== "sso_provider" && choice.type !== "mfa_method",
    )
    .map((choice) => ({
      id: choice.id,
      type: choice.type,
      label: choice.display_text ?? choice.label,
      description: choice.context ?? choice.description ?? null,
    }));
  return options.length ? options : null;
}

export function normalizeManagedAuthState(
  state: ManagedAuthResponse,
): ManagedAuthResponse {
  const hasCanonicalFields = state.fields != null;
  const hasCanonicalChoices = state.choices != null;

  return {
    ...state,
    discovered_fields: hasCanonicalFields
      ? fieldsFromCanonical(state.fields ?? [])
      : state.discovered_fields,
    pending_sso_buttons: hasCanonicalChoices
      ? ssoButtonsFromCanonical(state.choices ?? [])
      : state.pending_sso_buttons,
    mfa_options: hasCanonicalChoices
      ? mfaOptionsFromCanonical(state.choices ?? [], state.mfa_options)
      : state.mfa_options,
    sign_in_options: hasCanonicalChoices
      ? signInOptionsFromCanonical(state.choices ?? [])
      : state.sign_in_options,
  };
}
