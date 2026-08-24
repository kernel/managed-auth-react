import { afterEach, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { KernelManagedAuth } from "./KernelManagedAuth";

let renderer: ReactTestRenderer | null = null;

afterEach(() => {
  renderer?.unmount();
  renderer = null;
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function response(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

describe("KernelManagedAuth initialization", () => {
  test("shows a neutral initialization state before consent", async () => {
    const exchange = deferred<Response>();
    const fetchImpl = (async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url = String(input);
      if (url.endsWith("/exchange")) return exchange.promise;
      if (init?.method === "GET") {
        return response({
          domain: "example.com",
          profile_name: "example-profile",
          flow_status: "IN_PROGRESS",
          flow_step: "DISCOVERING",
          flow_type: "LOGIN",
        });
      }
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

    const initializing = JSON.stringify(renderer!.toJSON());
    expect(initializing).toContain("Preparing secure sign-in...");
    expect(initializing).not.toContain("Discovering login requirements...");
    expect(initializing).not.toContain("Continue");
  });
});
