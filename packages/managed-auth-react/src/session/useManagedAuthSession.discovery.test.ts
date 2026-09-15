import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { createElement } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import type { ManagedAuthResponse } from "../lib/types";
import {
  useManagedAuthSession,
  type ManagedAuthSessionValue,
} from "./useManagedAuthSession";

function deferredResponse() {
  let resolve!: (response: Response) => void;
  const promise = new Promise<Response>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

const discovering: ManagedAuthResponse = {
  id: "session-id",
  domain: "example.com",
  profile_name: "profile",
  flow_status: "IN_PROGRESS",
  flow_step: "DISCOVERING",
};
const ready: ManagedAuthResponse = {
  ...discovering,
  flow_step: "AWAITING_INPUT",
  interaction_id: "current-input",
  fields: [
    {
      id: "email",
      ref: "email",
      type: "identifier",
      label: "Email",
      reason: "missing",
    },
  ],
  choices: [],
};

function controlledClock() {
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const timerApi: {
    setTimeout(
      callback: (...args: unknown[]) => void,
      delay?: number,
      ...args: unknown[]
    ): ReturnType<typeof setTimeout>;
  } = globalThis;
  const timers = new Map<
    unknown,
    { due: number; run: () => void; cancel: () => void }
  >();
  let now = 0;
  const setTimer = spyOn(timerApi, "setTimeout").mockImplementation(
    (callback, delay = 0, ...args) => {
      const handle = originalSetTimeout(() => {}, 2_147_483_647);
      timers.set(handle, {
        due: now + delay,
        run: () => callback(...args),
        cancel: () => originalClearTimeout(handle),
      });
      return handle;
    },
  );
  const clearTimer = spyOn(globalThis, "clearTimeout").mockImplementation(
    (handle: unknown) => {
      timers.get(handle)?.cancel();
      timers.delete(handle);
    },
  );
  return {
    async advance(milliseconds: number) {
      const target = now + milliseconds;
      for (;;) {
        const next = [...timers]
          .filter(([, timer]) => timer.due <= target)
          .sort((left, right) => left[1].due - right[1].due)[0];
        if (!next) break;
        now = next[1].due;
        timers.delete(next[0]);
        next[1].cancel();
        await act(async () => {
          next[1].run();
        });
      }
      now = target;
    },
    restore() {
      for (const timer of timers.values()) timer.cancel();
      setTimer.mockRestore();
      clearTimer.mockRestore();
    },
  };
}

let renderer: ReactTestRenderer | null = null;
let clock: ReturnType<typeof controlledClock>;
beforeEach(() => {
  clock = controlledClock();
});
afterEach(() => {
  act(() => renderer?.unmount());
  renderer = null;
  clock.restore();
});

async function renderDiscoverySession(autoStart: boolean) {
  const refresh = deferredResponse();
  const reconnect = deferredResponse();
  const submission = deferredResponse();
  const errors: string[] = [];
  const streams: ReadableStreamDefaultController<Uint8Array>[] = [];
  let value!: ManagedAuthSessionValue;
  let reads = 0;
  const fetchImpl = (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.endsWith("/exchange")) return response({ jwt: "token" });
    if (url.endsWith("/submit")) return submission.promise;
    if (url.endsWith("/events"))
      return new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            streams.push(controller);
          },
        }),
      );
    reads++;
    if (reads === 1) return response(discovering);
    if (reads === 2) return refresh.promise;
    if (reads === 3) return reconnect.promise;
    throw new Error("Unexpected state refresh");
  }) as typeof fetch;
  function Harness() {
    value = useManagedAuthSession({
      sessionId: "session-id",
      handoffCode: "code",
      autoStart,
      fetch: fetchImpl,
      onError: ({ message }) => errors.push(message),
    });
    return null;
  }
  await act(async () => {
    renderer = create(createElement(Harness));
  });
  if (!autoStart) {
    expect(value.uiState).toBe("prime");
    await clock.advance(30_000);
    expect(reads).toBe(1);
    act(() => value.startFlow());
  }
  return {
    get value() {
      return value;
    },
    get reads() {
      return reads;
    },
    errors,
    refresh,
    reconnect,
    submission,
    async closeStream() {
      await act(async () => {
        streams.at(-1)!.close();
      });
    },
    async emit(state: ManagedAuthResponse) {
      await act(async () => {
        streams
          .at(-1)!
          .enqueue(
            new TextEncoder().encode(
              `event: managed_auth_state\ndata: ${JSON.stringify(state)}\n\n`,
            ),
          );
      });
    },
  };
}

for (const autoStart of [true, false]) {
  describe(`discovery recovery with autoStart=${autoStart}`, () => {
    test.each([200, 401, 410, 503])(
      "ignores a superseded reconnect response (%i) and restores the stream",
      async (status) => {
        const session = await renderDiscoverySession(autoStart);
        await clock.advance(15_000);
        await session.closeStream();
        await clock.advance(1_000);
        expect(session.reads).toBe(3);
        await act(async () => {
          session.refresh.resolve(response(ready));
        });
        expect(session.value.uiState).toBe("awaiting_input");
        await act(async () => {
          session.reconnect.resolve(response(discovering, status));
        });
        expect(session.value.uiState).toBe("awaiting_input");
        expect(session.value.state?.interaction_id).toBe("current-input");
        expect(session.errors).toEqual([]);
        await clock.advance(60_000);
        expect(session.reads).toBe(3);
        await session.emit({ ...ready, flow_step: "SUBMITTING" });
        expect(session.value.uiState).toBe("submitting");
        expect(session.value.isReconnecting).toBe(false);
      },
    );

    test("ignores a delayed discovery response after reconnect has restored input", async () => {
      const session = await renderDiscoverySession(autoStart);
      await clock.advance(15_000);
      await session.closeStream();
      await clock.advance(1_000);
      await act(async () => {
        session.reconnect.resolve(response(ready));
      });
      await act(async () => {
        session.refresh.resolve(response(discovering));
      });
      expect(session.value.uiState).toBe("awaiting_input");
      await clock.advance(60_000);
      expect(session.reads).toBe(3);
    });

    test("does not overwrite an active submission with a pending reconnect snapshot", async () => {
      const session = await renderDiscoverySession(autoStart);
      await session.emit(ready);
      await session.closeStream();
      await clock.advance(1_000);
      let pendingSubmission!: Promise<void>;
      act(() => {
        pendingSubmission = session.value.submitFields({
          email: "person@example.com",
        });
      });
      expect(session.value.uiState).toBe("submitting");
      await act(async () => {
        session.refresh.resolve(response(ready));
      });
      expect(session.value.uiState).toBe("submitting");
      expect(session.value.isSubmitting).toBe(true);
      await act(async () => {
        session.submission.resolve(response({}, 202));
        await pendingSubmission;
      });
      await session.emit({ ...ready, flow_status: "SUCCESS" });
      expect(session.value.uiState).toBe("success");
    });

    test("ignores a discovery response superseded by a stream event", async () => {
      const session = await renderDiscoverySession(autoStart);
      await clock.advance(15_000);
      await session.emit(ready);
      await act(async () => {
        session.refresh.resolve(response(discovering));
      });
      expect(session.value.uiState).toBe("awaiting_input");
      await clock.advance(60_000);
      expect(session.reads).toBe(2);
    });

    test("does not restart discovery refresh after unmount", async () => {
      const session = await renderDiscoverySession(autoStart);
      await clock.advance(15_000);
      act(() => renderer?.unmount());
      renderer = null;
      await act(async () => {
        session.refresh.resolve(response(discovering));
      });
      await clock.advance(60_000);
      expect(session.reads).toBe(2);
    });

    test.each([401, 410])(
      "expires on a current reconnect failure (%i)",
      async (status) => {
        const session = await renderDiscoverySession(autoStart);
        await session.closeStream();
        await clock.advance(1_000);
        await act(async () => {
          session.refresh.resolve(
            response({ message: "Session expired" }, status),
          );
        });
        expect(session.value.uiState).toBe("expired");
        expect(session.errors).toEqual(["Session expired"]);
        expect(session.value.isReconnecting).toBe(false);
        await clock.advance(60_000);
        expect(session.reads).toBe(2);
      },
    );

    test("does not replace success with a delayed reconnect error", async () => {
      const session = await renderDiscoverySession(autoStart);
      await clock.advance(15_000);
      await session.closeStream();
      await clock.advance(1_000);
      await act(async () => {
        session.refresh.resolve(response({ ...ready, flow_status: "SUCCESS" }));
      });
      await act(async () => {
        session.reconnect.resolve(
          response({ message: "Session expired" }, 410),
        );
      });
      expect(session.value.uiState).toBe("success");
      expect(session.errors).toEqual([]);
      await clock.advance(60_000);
      expect(session.reads).toBe(3);
    });
  });
}
