import type {
  ManagedAuthResponse,
  ManagedAuthStateEventData,
  MFAType,
} from "./types";

export type { ManagedAuthStateEventData };

export interface ApiClientOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
}

const DEFAULT_BASE_URL = "https://api.onkernel.com";

export class ManagedAuthApiError extends Error {
  public readonly status: number;
  public readonly body: string;
  public readonly fatal: boolean;
  constructor(message: string, status: number, body: string, fatal = false) {
    super(message);
    this.name = "ManagedAuthApiError";
    this.status = status;
    this.body = body;
    this.fatal = fatal;
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
  for (const line of raw.split(/\r\n|\r|\n/)) {
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
      // SSE message separator: blank line. Per spec, line endings can be
      // \n, \r\n, or \r — so the separator can be \n\n, \r\n\r\n, or \r\r.
      const SEPARATOR_RE = /\r\n\r\n|\r\r|\n\n/;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        for (;;) {
          const match = SEPARATOR_RE.exec(buf);
          if (!match) break;
          const raw = buf.slice(0, match.index);
          buf = buf.slice(match.index + match[0].length);
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
            let message = "Stream error";
            try {
              const data = JSON.parse(msg.data) as {
                error?: { code?: string; message?: string };
              };
              if (data.error?.message) message = data.error.message;
            } catch {
              /* fall through with default message */
            }
            handlers.onError(
              new ManagedAuthApiError(message, 500, message, true),
            );
            ac.abort();
            return;
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
