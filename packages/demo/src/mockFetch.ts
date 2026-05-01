import type { ManagedAuthResponse } from "@onkernel/managed-auth-react";

interface MockOptions {
  domain: string;
}

type Phase =
  | "idle"
  | "discovering"
  | "awaiting_credentials"
  | "submitting_credentials"
  | "awaiting_mfa"
  | "submitting_mfa"
  | "success";

/**
 * In-browser mock of the Kernel managed-auth API. Drives the component through
 * a realistic discover -> credentials -> MFA -> success flow without hitting
 * a real backend.
 */
export function createMockFetch({ domain }: MockOptions): typeof fetch {
  const id = "demo-session";
  let phase: Phase = "idle";
  let lastTransitionAt = Date.now();

  const minAdvance = 600;

  function buildState(): ManagedAuthResponse {
    const base = {
      id,
      domain,
      profile_name: `demo@${domain}`,
    };

    switch (phase) {
      case "idle":
      case "discovering":
        return {
          ...base,
          flow_status: "IN_PROGRESS",
          flow_step: "DISCOVERING",
        };
      case "awaiting_credentials":
        return {
          ...base,
          flow_status: "IN_PROGRESS",
          flow_step: "AWAITING_INPUT",
          discovered_fields: [
            {
              name: "username",
              label: "Email or username",
              type: "email",
              placeholder: `you@${domain}`,
              required: true,
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              required: true,
            },
          ],
          pending_sso_buttons: [
            {
              provider: "google",
              selector: "[data-sso=google]",
              label: "Continue with Google",
            },
            {
              provider: "github",
              selector: "[data-sso=github]",
              label: "Continue with GitHub",
            },
          ],
        };
      case "submitting_credentials":
      case "submitting_mfa":
        return {
          ...base,
          flow_status: "IN_PROGRESS",
          flow_step: "SUBMITTING",
        };
      case "awaiting_mfa":
        return {
          ...base,
          flow_status: "IN_PROGRESS",
          flow_step: "AWAITING_INPUT",
          mfa_options: [
            { type: "sms", label: "Text message", target: "•••• 4242" },
            { type: "email", label: "Email", target: `d•••@${domain}` },
            {
              type: "totp",
              label: "Authenticator app",
              description: "6-digit code",
            },
          ],
        };
      case "success":
        return {
          ...base,
          flow_status: "SUCCESS",
          flow_step: "COMPLETED",
        };
    }
  }

  function transition(to: Phase) {
    phase = to;
    lastTransitionAt = Date.now();
  }

  function autoAdvance() {
    const elapsed = Date.now() - lastTransitionAt;
    if (elapsed < minAdvance) return;
    if (phase === "discovering") transition("awaiting_credentials");
    else if (phase === "submitting_credentials") transition("awaiting_mfa");
    else if (phase === "submitting_mfa") transition("success");
  }

  return async function mockFetch(input: RequestInfo | URL): Promise<Response> {
    const url = typeof input === "string" ? input : input.toString();

    // Handoff exchange — kicks off discovery.
    if (url.endsWith("/exchange")) {
      transition("discovering");
      return jsonResponse({ jwt: "demo.jwt.token" });
    }

    // Submit endpoints — start a "submitting" state and then auto-advance.
    if (url.endsWith("/submit")) {
      if (phase === "awaiting_credentials")
        transition("submitting_credentials");
      else if (phase === "awaiting_mfa") transition("submitting_mfa");
      return new Response(null, { status: 204 });
    }

    // Polling GET — the only remaining endpoint we care about.
    autoAdvance();
    return jsonResponse(buildState());
  };
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
