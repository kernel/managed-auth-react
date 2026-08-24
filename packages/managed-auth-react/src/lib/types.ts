// Protocol types for Kernel managed auth.
// Synchronized with @onkernel/sdk v0.93.0 and vendored to keep this package runtime-free.

export type FlowStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | "CANCELED"
  | "EXPIRED";

export type FlowStep =
  | "DISCOVERING"
  | "AWAITING_INPUT"
  | "AWAITING_EXTERNAL_ACTION"
  | "SUBMITTING"
  | "COMPLETED";

export type MFAType =
  | "sms"
  | "call"
  | "email"
  | "totp"
  | "push"
  | "password"
  | "passkey"
  | "switch"
  | "other";

export interface DiscoveredField {
  id?: string;
  ref?: string;
  name: string;
  label: string;
  type: "text" | "email" | "password" | "tel" | "code" | "totp";
  placeholder?: string;
  required?: boolean;
  reason?: "missing" | "rejected";
  hint?: string;
  linked_mfa_type?: MFAType;
}

export interface SSOButton {
  id?: string;
  provider: string;
  selector: string;
  label?: string;
}

export interface MFAOption {
  id?: string;
  type: MFAType;
  label?: string;
  target?: string;
  description?: string;
}

export interface SignInOption {
  id: string;
  type?: ManagedAuthChoiceType;
  label: string;
  description?: string | null;
}

export interface ManagedAuthField {
  id: string;
  ref: string;
  type:
    | "identifier"
    | "password"
    | "code"
    | "totp_code"
    | "totp_secret"
    | "text";
  label?: string;
  required?: boolean;
  reason: "missing" | "rejected";
  hint?: string;
  observed_selector?: string | null;
}

export type ManagedAuthChoiceType =
  | "mfa_method"
  | "sso_provider"
  | "sign_in_method"
  | "auth_method"
  | "identifier_method"
  | "account"
  | "other";

export interface ManagedAuthChoice {
  id: string;
  type: ManagedAuthChoiceType;
  mfa_type?: MFAType | null;
  label: string;
  description?: string | null;
  masked_destination?: string | null;
  display_text?: string | null;
  context?: string | null;
  observed_selector?: string | null;
}

export interface ManagedAuthStateEventData {
  event: "managed_auth_state";
  timestamp: string;
  flow_status: FlowStatus;
  flow_step: FlowStep;
  flow_type?: "LOGIN" | "REAUTH";
  interaction_id?: string;
  fields?: ManagedAuthField[];
  choices?: ManagedAuthChoice[];
  discovered_fields?: DiscoveredField[];
  mfa_options?: MFAOption[];
  sign_in_options?: SignInOption[];
  pending_sso_buttons?: SSOButton[];
  external_action_message?: string;
  website_error?: string;
  error_message?: string;
  error_code?: string;
  post_login_url?: string;
  live_view_url?: string;
  hosted_url?: string;
}

export interface ManagedAuthResponse {
  id: string;
  domain: string;
  profile_name: string;
  flow_status: FlowStatus;
  flow_step: FlowStep;
  flow_type?: "LOGIN" | "REAUTH" | null;
  interaction_id?: string | null;
  fields?: ManagedAuthField[] | null;
  choices?: ManagedAuthChoice[] | null;
  discovered_fields?: DiscoveredField[] | null;
  pending_sso_buttons?: SSOButton[] | null;
  mfa_options?: MFAOption[] | null;
  sign_in_options?: SignInOption[] | null;
  sso_provider?: string | null;
  external_action_message?: string | null;
  website_error?: string | null;
  error_message?: string | null;
  error_code?: string | null;
  post_login_url?: string | null;
  live_view_url?: string | null;
  hosted_url?: string | null;
}

export type UIState =
  | "initializing"
  | "prime"
  | "discovering"
  | "awaiting_input"
  | "awaiting_external_action"
  | "submitting"
  | "success"
  | "expired"
  | "error";

export interface AuthSuccessPayload {
  profileName: string;
  domain: string;
}

export interface AuthErrorPayload {
  code?: string;
  message: string;
}
