import type { ManagedAuthSubmitBody } from "../lib/api";
import type { ManagedAuthResponse, MFAType, SSOButton } from "../lib/types";

function interactionId(state: ManagedAuthResponse | null): string {
  if (!state?.interaction_id) {
    throw new Error("Canonical managed auth state is missing interaction_id");
  }
  return state.interaction_id;
}

function canonicalChoiceId(id: string | undefined): string {
  if (!id) {
    throw new Error("Canonical managed auth choice is missing an id");
  }
  return id;
}

export function buildFieldSubmission(
  state: ManagedAuthResponse | null,
  values: Record<string, string>,
): ManagedAuthSubmitBody {
  return state?.fields != null
    ? { interaction_id: interactionId(state), field_values: values }
    : { fields: values };
}

export function buildSSOSubmission(
  state: ManagedAuthResponse | null,
  button: SSOButton,
): ManagedAuthSubmitBody {
  return state?.choices != null
    ? {
        interaction_id: interactionId(state),
        selected_choice_id: canonicalChoiceId(button.id),
      }
    : { fields: {}, sso_button_selector: button.selector };
}

export function buildMFASubmission(
  state: ManagedAuthResponse | null,
  type: MFAType,
  choiceId?: string,
): ManagedAuthSubmitBody {
  return state?.choices != null
    ? {
        interaction_id: interactionId(state),
        selected_choice_id: canonicalChoiceId(choiceId),
      }
    : { fields: {}, mfa_option_id: type };
}

export function buildSignInSubmission(
  state: ManagedAuthResponse | null,
  optionId: string,
): ManagedAuthSubmitBody {
  return state?.choices != null
    ? {
        interaction_id: interactionId(state),
        selected_choice_id: optionId,
      }
    : { fields: {}, sign_in_option_id: optionId };
}
