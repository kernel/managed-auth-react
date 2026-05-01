import type { ManagedAuthResponse, MFAType } from "./types";

export interface ApiClientOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
}

const DEFAULT_BASE_URL = "https://api.onkernel.com";

export class ManagedAuthApiError extends Error {
  public readonly status: number;
  public readonly body: string;
  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = "ManagedAuthApiError";
    this.status = status;
    this.body = body;
  }
}

function getFetch(options?: ApiClientOptions): typeof fetch {
  return options?.fetch ?? globalThis.fetch;
}

function getBaseUrl(options?: ApiClientOptions): string {
  return (options?.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
}

async function parseError(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed.message === "string") return parsed.message;
  } catch {
    /* fall through */
  }
  return text || response.statusText;
}

export async function exchangeHandoffCode(
  id: string,
  code: string,
  options?: ApiClientOptions,
): Promise<string> {
  const f = getFetch(options);
  const res = await f(
    `${getBaseUrl(options)}/auth/connections/${id}/exchange`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    },
  );
  if (!res.ok) {
    const msg = await parseError(res);
    throw new ManagedAuthApiError(msg, res.status, msg);
  }
  const data = (await res.json()) as { jwt?: string };
  if (!data.jwt) {
    throw new ManagedAuthApiError(
      "Failed to exchange handoff code: no JWT returned",
      500,
      "",
    );
  }
  return data.jwt;
}

export async function retrieveManagedAuth(
  id: string,
  jwt: string,
  options?: ApiClientOptions,
): Promise<ManagedAuthResponse> {
  const f = getFetch(options);
  const res = await f(`${getBaseUrl(options)}/auth/connections/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) {
    const msg = await parseError(res);
    throw new ManagedAuthApiError(msg, res.status, msg);
  }
  return (await res.json()) as ManagedAuthResponse;
}

interface SubmitBody {
  fields: Record<string, string>;
  sso_button_selector?: string;
  mfa_option_id?: MFAType;
  sign_in_option_id?: string;
}

async function submit(
  id: string,
  jwt: string,
  body: SubmitBody,
  options?: ApiClientOptions,
): Promise<void> {
  const f = getFetch(options);
  const res = await f(`${getBaseUrl(options)}/auth/connections/${id}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await parseError(res);
    throw new ManagedAuthApiError(msg, res.status, msg);
  }
}

export function submitFieldValues(
  id: string,
  jwt: string,
  fields: Record<string, string>,
  options?: ApiClientOptions,
): Promise<void> {
  return submit(id, jwt, { fields }, options);
}

export function submitSSOButton(
  id: string,
  jwt: string,
  selector: string,
  options?: ApiClientOptions,
): Promise<void> {
  return submit(
    id,
    jwt,
    { fields: {}, sso_button_selector: selector },
    options,
  );
}

export function submitMFASelection(
  id: string,
  jwt: string,
  mfaType: MFAType,
  options?: ApiClientOptions,
): Promise<void> {
  return submit(id, jwt, { fields: {}, mfa_option_id: mfaType }, options);
}

export function submitSignInOption(
  id: string,
  jwt: string,
  signInOptionId: string,
  options?: ApiClientOptions,
): Promise<void> {
  return submit(
    id,
    jwt,
    { fields: {}, sign_in_option_id: signInOptionId },
    options,
  );
}
