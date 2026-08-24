import { afterEach, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { KernelManagedAuth } from "./KernelManagedAuth";

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
