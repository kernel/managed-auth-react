// Protocol types for Kernel managed auth.
// Vendored from @onkernel/sdk to keep this package runtime-free.

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
  name: string;
  label: string;
  type: "text" | "email" | "password" | "tel" | "code" | "totp";
  placeholder?: string;
  required?: boolean;
  hint?: string;
  linked_mfa_type?: MFAType;
}

export interface SSOButton {
  provider: string;
  selector: string;
  label?: string;
}

export interface MFAOption {
  type: MFAType;
  label?: string;
  target?: string;
  description?: string;
}

export interface SignInOption {
  id: string;
  label: string;
  description?: string | null;
}

export interface ManagedAuthResponse {
  id: string;
  domain: string;
  profile_name: string;
  flow_status: FlowStatus;
  flow_step: FlowStep;
  discovered_fields?: DiscoveredField[] | null;
  pending_sso_buttons?: SSOButton[] | null;
  mfa_options?: MFAOption[] | null;
  sign_in_options?: SignInOption[] | null;
  sso_provider?: string | null;
  external_action_message?: string | null;
  website_error?: string | null;
  error_message?: string | null;
  error_code?: string | null;
}

export type UIState =
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
