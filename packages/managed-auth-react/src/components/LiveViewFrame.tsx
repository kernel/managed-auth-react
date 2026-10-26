import { useEffect, useMemo, useRef, useState } from "react";
import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { Button } from "./primitives/Button";

// The live view's connect bounds sum to 48s; the watchdog has to outlast them.
const LIVE_VIEW_START_TIMEOUT_MS = 60_000;
// Reloads after a silent stall before telling the person.
const LIVE_VIEW_AUTO_RELOADS = 2;

type Failure = "retryable" | "gave_up" | "unsupported";

interface LiveViewMessage {
  type?: unknown;
  reason?: unknown;
  iceConnectionState?: unknown;
}

// A network-path failure can clear on a retry; a property of the viewer's
// browser repeats on every reload.
function connectFailure(message: LiveViewMessage): Failure {
  if (message.reason === "transport") return "retryable";
  if (
    message.reason === "peer" &&
    (message.iceConnectionState === "failed" ||
      message.iceConnectionState === "closed")
  ) {
    return "retryable";
  }
  return message.reason === "unsupported" ? "unsupported" : "gave_up";
}

function liveViewOrigin(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

interface LiveViewFrameProps {
  url?: string | null;
  /** How long to wait for video before reloading; overridable for tests. */
  startTimeoutMs?: number;
}

/**
 * Embeds a browser's live view and recovers from a viewer that never starts,
 * following the live view's postMessage protocol.
 */
export function LiveViewFrame({
  url,
  startTimeoutMs = LIVE_VIEW_START_TIMEOUT_MS,
}: LiveViewFrameProps) {
  const slot = useSlot();
  const l = useLocalization();
  const origin = useMemo(() => liveViewOrigin(url), [url]);
  const [attempt, setAttempt] = useState(0);
  const [failure, setFailure] = useState<Failure | null>(null);
  const autoReloads = useRef(0);
  const retried = useRef(false);

  useEffect(() => {
    if (!origin || failure) return;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    const arm = () => {
      clearTimeout(watchdog);
      watchdog = setTimeout(() => {
        if (autoReloads.current < LIVE_VIEW_AUTO_RELOADS) {
          autoReloads.current++;
          setAttempt((n) => n + 1);
        } else {
          setFailure("gave_up");
        }
      }, startTimeoutMs);
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      const message = (event.data ?? {}) as LiveViewMessage;
      if (message.type === "KERNEL_PLAYING") clearTimeout(watchdog);
      else if (message.type === "KERNEL_PAUSED") arm();
      else if (
        message.type === "KERNEL_CONNECTION_FAILED" ||
        message.type === "KERNEL_CONNECTION_TIMEOUT"
      ) {
        clearTimeout(watchdog);
        const next = connectFailure(message);
        setFailure(next === "retryable" && retried.current ? "gave_up" : next);
      }
    };
    window.addEventListener("message", onMessage);
    arm();
    return () => {
      clearTimeout(watchdog);
      window.removeEventListener("message", onMessage);
    };
  }, [origin, attempt, failure, startTimeoutMs]);

  const retry = () => {
    retried.current = true;
    setFailure(null);
    setAttempt((n) => n + 1);
  };

  return (
    <div
      {...slot("humanInterventionLiveView", "kma-human-intervention__frame")}
    >
      {origin ? (
        <iframe
          key={`${url}-${attempt}`}
          src={url ?? undefined}
          title={l.humanInterventionLiveViewTitle}
          className="kma-human-intervention__iframe"
          allow="autoplay; clipboard-read; clipboard-write"
        />
      ) : (
        <p className="kma-human-intervention__notice">
          {l.humanInterventionLiveViewUnavailable}
        </p>
      )}
      {failure && (
        <div className="kma-human-intervention__overlay" role="alert">
          <p className="kma-human-intervention__notice">
            {failure === "retryable"
              ? l.humanInterventionLiveViewFailed
              : failure === "unsupported"
                ? l.humanInterventionLiveViewUnsupported
                : l.humanInterventionLiveViewGaveUp}
          </p>
          {failure === "retryable" && (
            <Button variant="secondary" onClick={retry}>
              {l.humanInterventionRetry}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
