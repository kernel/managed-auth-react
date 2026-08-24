import { afterEach, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { KernelManagedAuth } from "./KernelManagedAuth";

let renderer: ReactTestRenderer | null = null;

afterEach(() => {
  renderer?.unmount();
  renderer = null;
});

describe("KernelManagedAuth initialization", () => {
  test("disables the consent action while the session initializes", () => {
    const pendingExchange = new Promise<Response>(() => {});
    const fetchImpl = (async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url = String(input);
      if (url.endsWith("/exchange")) return pendingExchange;
      throw new Error(`Unexpected request: ${init?.method} ${url}`);
    }) as typeof fetch;

    act(() => {
      renderer = create(
        createElement(KernelManagedAuth, {
          sessionId: "session-id",
          handoffCode: "handoff-code",
          fetch: fetchImpl,
        }),
      );
    });

    const button = renderer!.root.findByType("button");
    expect(button.props.disabled).toBe(true);
    expect(button.children).toEqual(["Loading..."]);
  });
});
