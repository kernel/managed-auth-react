import { afterEach, describe, expect, test } from "bun:test";
import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import type { ManagedAuthResponse } from "../lib/types";
import {
  useManagedAuthSession,
  type ManagedAuthSessionValue,
} from "./useManagedAuthSession";

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function awaitingInputState(): ManagedAuthResponse {
  return {
    id: "session-id",
    domain: "example.com",
    profile_name: "profile",
    flow_status: "IN_PROGRESS",
    flow_step: "AWAITING_INPUT",
    interaction_id: "interaction-id",
    fields: [
      {
        id: "email-field",
        ref: "email",
        type: "identifier",
        label: "Email",
        reason: "missing",
      },
    ],
    choices: [],
  };
}

function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
} {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

let renderer: ReactTestRenderer | null = null;

afterEach(() => {
  if (renderer) {
    act(() => renderer?.unmount());
    renderer = null;
  }
});

async function renderSession(
  refreshResponse: Promise<Response>,
  onError?: (message: string) => void,
  submitResponse = Promise.resolve(
    response(
      { code: "stale_interaction", message: "Interaction is stale" },
      400,
    ),
  ),
) {
  let retrieveRequests = 0;
  let streamRequests = 0;
  let value: ManagedAuthSessionValue | null = null;
  const sessionRetrieveRequests = new Map<string, number>();

  const fetchImpl = (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url = String(input);
    if (url.endsWith("/exchange")) return response({ jwt: "jwt" });
    if (url.endsWith("/events")) {
      streamRequests++;
      return new Promise<Response>(() => {});
    }
    if (url.endsWith("/submit")) return submitResponse;
    if (init?.method === "GET") {
      retrieveRequests++;
      const sessionId = url.split("/auth/connections/")[1]?.split("/")[0];
      if (!sessionId) throw new Error(`Missing session ID in ${url}`);
      const count = (sessionRetrieveRequests.get(sessionId) ?? 0) + 1;
      sessionRetrieveRequests.set(sessionId, count);
      if (count === 1) return response(awaitingInputState());
      return refreshResponse;
    }
    throw new Error(`Unexpected request: ${init?.method} ${url}`);
  }) as typeof fetch;

  function Harness(props: { sessionId: string; handoffCode: string }) {
    value = useManagedAuthSession({
      sessionId: props.sessionId,
      handoffCode: props.handoffCode,
      autoStart: true,
      fetch: fetchImpl,
      onError: onError ? ({ message }) => onError(message) : undefined,
    });
    return null;
  }

  await act(async () => {
    renderer = create(
      createElement(Harness, {
        sessionId: "session-id",
        handoffCode: "handoff-code",
      }),
    );
    await flushPromises();
  });

  return {
    get value() {
      if (!value) throw new Error("Session hook did not render");
      return value;
    },
    get retrieveRequests() {
      return retrieveRequests;
    },
    get streamRequests() {
      return streamRequests;
    },
    async updateSession(sessionId: string, handoffCode: string) {
      await act(async () => {
        renderer?.update(createElement(Harness, { sessionId, handoffCode }));
        await flushPromises();
      });
    },
  };
}

describe("useManagedAuthSession initialization", () => {
  test("reports initialization until the session is ready", async () => {
    const exchange = deferred<Response>();
    let value: ManagedAuthSessionValue | null = null;

    const fetchImpl = (async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url = String(input);
      if (url.endsWith("/exchange")) return exchange.promise;
      if (init?.method === "GET") return response(awaitingInputState());
      throw new Error(`Unexpected request: ${init?.method} ${url}`);
    }) as typeof fetch;

    function Harness() {
      value = useManagedAuthSession({
        sessionId: "session-id",
        handoffCode: "handoff-code",
        fetch: fetchImpl,
      });
      return null;
    }

    act(() => {
      renderer = create(createElement(Harness));
    });

    expect(value!.uiState).toBe("initializing");

    await act(async () => {
      exchange.resolve(response({ jwt: "jwt" }));
      await flushPromises();
    });

    expect(value!.uiState).toBe("prime");
  });

  test("leaves initialization when the handoff exchange fails", async () => {
    let value: ManagedAuthSessionValue | null = null;
    const fetchImpl = (async (_input: RequestInfo | URL, _init?: RequestInit) =>
      response({ message: "Invalid handoff" }, 401)) as typeof fetch;

    function Harness() {
      value = useManagedAuthSession({
        sessionId: "session-id",
        handoffCode: "handoff-code",
        fetch: fetchImpl,
      });
      return null;
    }

    await act(async () => {
      renderer = create(createElement(Harness));
      await flushPromises();
    });

    expect(value!.uiState).toBe("error");
    expect(value!.initError).toBe("Invalid handoff");
  });
});

describe("useManagedAuthSession stale interaction recovery", () => {
  test("does not reconnect after the session is unmounted", async () => {
    const refresh = deferred<Response>();
    const session = await renderSession(refresh.promise);
    expect(session.streamRequests).toBe(1);

    let submission!: Promise<void>;
    await act(async () => {
      submission = session.value.submitFields({ email: "person@example.com" });
      await flushPromises();
    });
    expect(session.retrieveRequests).toBe(2);

    act(() => renderer?.unmount());
    renderer = null;
    refresh.resolve(response(awaitingInputState()));
    await act(async () => submission);

    expect(session.streamRequests).toBe(1);
  });

  test("clears the submitting state when the session changes", async () => {
    const pendingSubmit = deferred<Response>();
    const session = await renderSession(
      Promise.resolve(response(awaitingInputState())),
      undefined,
      pendingSubmit.promise,
    );

    let submission!: Promise<void>;
    act(() => {
      submission = session.value.submitFields({ email: "person@example.com" });
    });
    expect(session.value.isSubmitting).toBe(true);

    await session.updateSession("next-session-id", "next-handoff-code");
    expect(session.value.isSubmitting).toBe(false);

    pendingSubmit.resolve(response({}, 202));
    await act(async () => submission);
    expect(session.value.isSubmitting).toBe(false);
  });

  test.each([401, 410])(
    "expires the session when the stale refresh returns %i",
    async (status) => {
      const errors: string[] = [];
      const session = await renderSession(
        Promise.resolve(response({ message: "Session expired" }, status)),
        (message) => errors.push(message),
      );

      await act(async () => {
        await session.value.submitFields({ email: "person@example.com" });
      });

      expect(session.value.uiState).toBe("expired");
      expect(session.value.isSubmitting).toBe(false);
      expect(errors).toEqual(["Session expired"]);
      expect(session.streamRequests).toBe(1);
    },
  );
});
