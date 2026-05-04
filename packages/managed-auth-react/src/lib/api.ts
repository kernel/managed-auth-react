import type {
  DiscoveredField,
  FlowStatus,
  FlowStep,
  ManagedAuthResponse,
  MFAOption,
  MFAType,
  SSOButton,
  SignInOption,
} from "./types";

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

export interface ManagedAuthStateEventData {
  event: "managed_auth_state";
  timestamp: string;
  flow_status: FlowStatus;
  flow_step: FlowStep;
  flow_type?: "LOGIN" | "REAUTH";
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

export interface ManagedAuthStreamHandlers {
  onState: (event: ManagedAuthStateEventData) => void;
  onError: (err: ManagedAuthApiError) => void;
  onClose: () => void;
}

interface ParsedSSEMessage {
  event?: string;
  data: string;
}

function parseSSEMessage(raw: string): ParsedSSEMessage | null {
  if (!raw.trim()) return null;
  let event: string | undefined;
  const dataLines: string[] = [];
  for (const line of raw.split("\n")) {
    if (!line || line.startsWith(":")) continue;
    const colonIdx = line.indexOf(":");
    const field = colonIdx === -1 ? line : line.slice(0, colonIdx);
    let value = colonIdx === -1 ? "" : line.slice(colonIdx + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "event") event = value;
    else if (field === "data") dataLines.push(value);
  }
  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join("\n") };
}

export function streamManagedAuthEvents(
  id: string,
  jwt: string,
  handlers: ManagedAuthStreamHandlers,
  options?: ApiClientOptions,
): () => void {
  const ac = new AbortController();
  void (async () => {
    try {
      const f = getFetch(options);
      const res = await f(
        `${getBaseUrl(options)}/auth/connections/${id}/events`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "text/event-stream",
          },
          signal: ac.signal,
        },
      );
      if (!res.ok) {
        const msg = await parseError(res);
        handlers.onError(new ManagedAuthApiError(msg, res.status, msg));
        return;
      }
      if (!res.body) {
        handlers.onError(
          new ManagedAuthApiError("SSE response has no body", 500, ""),
        );
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let sepIdx: number;
        while ((sepIdx = buf.indexOf("\n\n")) !== -1) {
          const raw = buf.slice(0, sepIdx);
          buf = buf.slice(sepIdx + 2);
          const msg = parseSSEMessage(raw);
          if (!msg) continue;
          if (msg.event === "managed_auth_state") {
            try {
              handlers.onState(
                JSON.parse(msg.data) as ManagedAuthStateEventData,
              );
            } catch {
              /* ignore malformed payload */
            }
          } else if (msg.event === "error") {
            try {
              const data = JSON.parse(msg.data) as {
                error?: { code?: string; message?: string };
              };
              const message = data.error?.message ?? "Stream error";
              handlers.onError(new ManagedAuthApiError(message, 500, message));
            } catch {
              /* ignore malformed payload */
            }
          }
        }
      }
      handlers.onClose();
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Stream failed";
      handlers.onError(new ManagedAuthApiError(message, 0, message));
    }
  })();
  return () => ac.abort();
}
