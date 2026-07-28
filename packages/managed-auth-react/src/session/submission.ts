import type { ManagedAuthSubmitBody } from "../lib/api";
import type { ManagedAuthResponse, MFAType, SSOButton } from "../lib/types";

export function buildFieldSubmission(
  state: ManagedAuthResponse | null,
  values: Record<string, string>,
): ManagedAuthSubmitBody {
  return state?.fields != null ? { field_values: values } : { fields: values };
}

export function buildSSOSubmission(button: SSOButton): ManagedAuthSubmitBody {
  return button.id
    ? { selected_choice_id: button.id }
    : { sso_button_selector: button.selector };
}

export function buildMFASubmission(
  type: MFAType,
  choiceId?: string,
): ManagedAuthSubmitBody {
  return choiceId ? { selected_choice_id: choiceId } : { mfa_option_id: type };
}

export function buildSignInSubmission(
  state: ManagedAuthResponse | null,
  optionId: string,
): ManagedAuthSubmitBody {
  return state?.choices != null
    ? { selected_choice_id: optionId }
    : { sign_in_option_id: optionId };
}
