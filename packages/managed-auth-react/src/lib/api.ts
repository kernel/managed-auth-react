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
  fields?: Record<string, string>;
  field_values?: Record<string, string>;
  selected_choice_id?: string;
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

export function submitCanonicalFieldValues(
  id: string,
  jwt: string,
  fieldValues: Record<string, string>,
  options?: ApiClientOptions,
): Promise<void> {
  return submit(id, jwt, { field_values: fieldValues }, options);
}

export function submitSelectedChoice(
  id: string,
  jwt: string,
  selectedChoiceId: string,
  options?: ApiClientOptions,
): Promise<void> {
  return submit(id, jwt, { selected_choice_id: selectedChoiceId }, options);
}

export function submitSSOButton(
  id: string,
  jwt: string,
  selector: string,
  options?: ApiClientOptions,
): Promise<void> {
  return submit(id, jwt, { sso_button_selector: selector }, options);
}

export function submitMFASelection(
  id: string,
  jwt: string,
  mfaType: MFAType,
  options?: ApiClientOptions,
): Promise<void> {
  return submit(id, jwt, { mfa_option_id: mfaType }, options);
}

export function submitSignInOption(
  id: string,
  jwt: string,
  signInOptionId: string,
  options?: ApiClientOptions,
): Promise<void> {
  return submit(id, jwt, { sign_in_option_id: signInOptionId }, options);
}

/** Callbacks for the SSE event stream. */
export interface ManagedAuthStreamHandlers {
  onState: (data: ManagedAuthStateEventData) => void;
  onError: (error: ManagedAuthApiError) => void;
  /** Fires only on graceful stream end (server closed the connection). Not called after onError. */
  onClose: () => void;
}

/**
 * Opens an SSE connection to `/auth/connections/{id}/events` and dispatches
 * incoming events to the provided handlers. Returns a teardown function that
 * aborts the connection.
 *
 * Uses fetch + ReadableStream instead of EventSource because the endpoint
 * requires an Authorization header.
 */
export function streamManagedAuthEvents(
  id: string,
  jwt: string,
  handlers: ManagedAuthStreamHandlers,
  options?: ApiClientOptions,
): () => void {
  const controller = new AbortController();
  const f = getFetch(options);
  const url = `${getBaseUrl(options)}/auth/connections/${id}/events`;

  (async () => {
    const res = await f(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "text/event-stream",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      const msg = await parseError(res);
      handlers.onError(new ManagedAuthApiError(msg, res.status, msg));
      return;
    }

    if (!res.body) {
      handlers.onError(new ManagedAuthApiError("No response body", 0, ""));
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // Read chunks from the stream and parse SSE frames (delimited by \n\n).
    const SEPARATOR = /\r\n\r\n|\r\r|\n\n/;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      for (;;) {
        const match = SEPARATOR.exec(buffer);
        if (!match) break;
        const raw = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);

        let eventType = "";
        let data = "";
        for (const line of raw.split(/\r\n|\r|\n/)) {
          if (line.startsWith("event: ")) eventType = line.slice(7);
          else if (line.startsWith("data: "))
            data += (data ? "\n" : "") + line.slice(6);
        }

        if (eventType === "managed_auth_state" && data) {
          try {
            const parsed = JSON.parse(data) as ManagedAuthStateEventData;
            handlers.onState(parsed);
          } catch {
            /* malformed JSON — skip */
          }
        } else if (eventType === "error" && data) {
          let message = "Stream error";
          try {
            const parsed = JSON.parse(data) as {
              error?: { message?: string };
            };
            if (parsed.error?.message) message = parsed.error.message;
          } catch {
            /* fall through with default message */
          }
          handlers.onError(new ManagedAuthApiError(message, 0, data, true));
          controller.abort();
          return;
        }
        // sse_heartbeat and unknown event types are silently ignored
      }
    }

    handlers.onClose();
  })().catch((err: unknown) => {
    // AbortError is expected when the caller invokes the teardown function.
    if (err instanceof Error && err.name === "AbortError") return;
    const message = err instanceof Error ? err.message : "Stream failed";
    handlers.onError(new ManagedAuthApiError(message, 0, ""));
  });

  return () => controller.abort();
}
