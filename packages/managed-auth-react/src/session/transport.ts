import {
  ManagedAuthApiError,
  retrieveManagedAuth,
  streamManagedAuthEvents,
  type ApiClientOptions,
} from "../lib/api";
import type { ManagedAuthResponse, UIState } from "../lib/types";
import { mergeStateEvent, normalizeManagedAuthState } from "./state";

const DISCOVERY_REFRESH_MS = 15_000;
const RETRY_BASE_MS = 1_000;

interface TransportOptions {
  sessionId: string;
  token: string;
  api: ApiClientOptions;
  initial: ManagedAuthResponse;
  onState: (state: ManagedAuthResponse) => UIState;
  onFailure: (state: "expired" | "error", message: string) => void;
  onReconnecting: (reconnecting: boolean) => void;
}

export function createSessionTransport(options: TransportOptions) {
  let current = options.initial;
  let active = true;
  let started = false;
  let submitting = false;
  let discovering = current.flow_step === "DISCOVERING";
  let revision = 0;
  let mutation = 0;
  let streamGeneration = 0;
  let disconnect: (() => void) | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let request: AbortController | null = null;
  let pending: Promise<void> | null = null;
  let needsSnapshot = false;
  let needsReconnect = false;
  let attempts = 0;

  function clearTimer() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  }

  function closeStream() {
    streamGeneration++;
    disconnect?.();
    disconnect = null;
  }

  function invalidateSnapshot() {
    mutation++;
    request?.abort();
    request = null;
    pending = null;
    needsSnapshot = false;
    clearTimer();
  }

  function stop() {
    active = false;
    invalidateSnapshot();
    closeStream();
  }

  function fail(state: "expired" | "error", message: string) {
    stop();
    options.onReconnecting(false);
    options.onFailure(state, message);
  }

  function apply(next: ManagedAuthResponse) {
    current = normalizeManagedAuthState(next);
    const ui = options.onState(current);
    discovering = ui === "discovering";
    if (ui === "success" || ui === "error" || ui === "expired") stop();
  }

  function schedule() {
    clearTimer();
    if (!active || !started || (pending && !needsReconnect)) return;
    if (!needsReconnect && (submitting || (!needsSnapshot && !discovering))) {
      return;
    }
    const delay =
      needsSnapshot || needsReconnect
        ? Math.min(
            RETRY_BASE_MS * 2 ** Math.max(0, attempts - 1),
            DISCOVERY_REFRESH_MS,
          )
        : DISCOVERY_REFRESH_MS;
    timer = setTimeout(() => {
      timer = null;
      if (needsReconnect) openStream();
      if (!submitting) void reconcile();
    }, delay);
  }

  function openStream() {
    if (!active) return;
    closeStream();
    needsReconnect = false;
    const generation = streamGeneration;
    const isCurrent = () => active && generation === streamGeneration;
    const reconnect = () => {
      closeStream();
      needsReconnect = true;
      attempts = Math.min(attempts + 1, 5);
      options.onReconnecting(true);
      schedule();
    };
    disconnect = streamManagedAuthEvents(
      options.sessionId,
      options.token,
      {
        onState(event) {
          if (!isCurrent()) return;
          revision++;
          options.onReconnecting(false);
          apply(mergeStateEvent(current, event));
          schedule();
        },
        onError(error) {
          if (!isCurrent()) return;
          if (error.status === 401 || error.status === 410) {
            fail("expired", "Session expired");
          } else if (error.fatal) {
            fail("error", error.message);
          } else {
            reconnect();
          }
        },
        onClose() {
          if (isCurrent()) reconnect();
        },
      },
      options.api,
    );
  }

  function reconcile(): Promise<void> {
    if (!active || submitting) return Promise.resolve();
    if (pending) return pending;
    clearTimer();
    const localMutation = mutation;
    const remoteRevision = revision;
    const controller = new AbortController();
    request = controller;
    const isCurrent = () => active && localMutation === mutation;
    const retry = () => {
      // A live event cannot tell us whether the GET was older or newer.
      // Re-read even when that event has already made the form input-ready.
      needsSnapshot = true;
      attempts = Math.min(attempts + 1, 5);
    };
    pending = (async () => {
      try {
        const fresh = await retrieveManagedAuth(
          options.sessionId,
          options.token,
          options.api,
          controller.signal,
        );
        if (!isCurrent()) return;
        if (remoteRevision !== revision) {
          retry();
        } else {
          needsSnapshot = false;
          attempts = 0;
          apply(fresh);
        }
      } catch (error) {
        if (!isCurrent()) return;
        if (remoteRevision !== revision) {
          retry();
        } else if (
          error instanceof ManagedAuthApiError &&
          (error.status === 401 || error.status === 410)
        ) {
          fail("expired", "Session expired");
        } else {
          retry();
        }
      } finally {
        if (isCurrent()) {
          pending = null;
          request = null;
          if (needsReconnect) openStream();
          schedule();
        }
      }
    })();
    return pending;
  }

  return {
    start() {
      if (!active || started) return;
      started = true;
      openStream();
      schedule();
    },
    stop,
    beginSubmission() {
      submitting = true;
      discovering = false;
      invalidateSnapshot();
      schedule();
    },
    endSubmission() {
      submitting = false;
      schedule();
    },
    resync() {
      submitting = false;
      invalidateSnapshot();
      closeStream();
      needsReconnect = true;
      return reconcile();
    },
  };
}
