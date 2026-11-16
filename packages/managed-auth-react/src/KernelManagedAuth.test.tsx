import { afterEach, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { KernelManagedAuth } from "./KernelManagedAuth";
import { LOCALIZATIONS } from "./localization/locales";

let renderer: ReactTestRenderer | null = null;

afterEach(() => {
  renderer?.unmount();
  renderer = null;
});

function pendingExchangeFetch(): typeof fetch {
  const pendingExchange = new Promise<Response>(() => {});
  return (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url = String(input);
    if (url.endsWith("/exchange")) return pendingExchange;
    throw new Error(`Unexpected request: ${init?.method} ${url}`);
  }) as typeof fetch;
}

describe("KernelManagedAuth initialization", () => {
  test("disables the consent action while the session initializes", () => {
    act(() => {
      renderer = create(
        createElement(KernelManagedAuth, {
          sessionId: "session-id",
          handoffCode: "handoff-code",
          fetch: pendingExchangeFetch(),
        }),
      );
    });

    const output = JSON.stringify(renderer!.toJSON());
    const button = renderer!.root.findByType("button");
    expect(output).toContain("Preparing secure sign-in");
    expect(output).not.toContain("Sign in to ");
    expect(button.props.disabled).toBe(true);
    expect(button.children).toEqual(["Loading..."]);
  });

  test("does not show consent while a skip-prime session initializes", () => {
    act(() => {
      renderer = create(
        createElement(KernelManagedAuth, {
          sessionId: "session-id",
          handoffCode: "handoff-code",
          fetch: pendingExchangeFetch(),
          appearance: { layout: { skipPrimeStep: true } },
        }),
      );
    });

    const output = JSON.stringify(renderer!.toJSON());
    expect(output).toContain("Discovering login requirements...");
    expect(renderer!.root.findAllByType("button")).toHaveLength(0);
  });
});

describe("KernelManagedAuth human verification", () => {
  const hadWindow = "window" in globalThis;
  // Unmount first: the live view removes its window listener on the way out.
  afterEach(() => {
    act(() => renderer?.unmount());
    renderer = null;
    if (!hadWindow) delete (globalThis as { window?: unknown }).window;
  });

  test("keeps Continue disabled after the submit is accepted, until the flow moves on", async () => {
    if (!hadWindow) {
      Object.assign(globalThis, {
        window: { addEventListener() {}, removeEventListener() {} },
      });
    }
    const json = (body: unknown) =>
      new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
      });
    const fetchImpl = (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/exchange")) return json({ jwt: "jwt" });
      if (url.endsWith("/events")) return new Promise<Response>(() => {});
      if (url.endsWith("/submit")) return json({});
      return json({
        id: "session-id",
        domain: "example.com",
        profile_name: "profile",
        flow_status: "IN_PROGRESS",
        flow_step: "AWAITING_HUMAN_INTERVENTION",
        interaction_id: "mai_captcha",
        live_view_url: "https://live.example.com/browser/live/abc",
        fields: [],
        choices: [
          {
            id: "human_intervention_done",
            type: "human_intervention",
            label: "I've completed the verification",
          },
        ],
      });
    }) as typeof fetch;

    await act(async () => {
      renderer = create(
        createElement(KernelManagedAuth, {
          sessionId: "session-id",
          handoffCode: "handoff-code",
          fetch: fetchImpl,
          appearance: { layout: { skipPrimeStep: true } },
        }),
      );
      for (let i = 0; i < 5; i++) await Promise.resolve();
    });
    const continueButton = () =>
      renderer!.root.findAll(
        (node) => node.type === "button" && node.children.includes("Continue"),
      )[0]!;
    expect(continueButton().props.disabled).toBe(false);

    await act(async () => {
      continueButton().props.onClick();
      for (let i = 0; i < 5; i++) await Promise.resolve();
    });

    expect(continueButton().props.disabled).toBe(true);
  });
});

describe("KernelManagedAuth localization", () => {
  test("renders the step and footer in the given localization", () => {
    act(() => {
      renderer = create(
        createElement(KernelManagedAuth, {
          sessionId: "session-id",
          handoffCode: "handoff-code",
          fetch: pendingExchangeFetch(),
          localization: LOCALIZATIONS.sv,
        }),
      );
    });

    const output = JSON.stringify(renderer!.toJSON());
    expect(output).toContain("Förbereder säker inloggning");
    expect(output).toContain("Drivs av");
    expect(output).not.toContain("Powered by");
  });
});
