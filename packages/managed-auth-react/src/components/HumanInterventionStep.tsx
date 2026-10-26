import { useEffect, useMemo, useState } from "react";
import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { Button } from "./primitives/Button";
import { ErrorBanner } from "./ErrorBanner";

// The live view posts one of these when its connection never succeeds.
const LIVE_VIEW_CONNECT_FAILURES = new Set([
  "KERNEL_CONNECTION_TIMEOUT",
  "KERNEL_CONNECTION_FAILED",
]);

function liveViewOrigin(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

interface HumanInterventionStepProps {
  targetDomain: string;
  liveViewUrl?: string | null;
  onDone: () => void;
  isLoading?: boolean;
  errorMessage?: string;
  /** Shown when the site asks for a check again after the person continued. */
  note?: string | null;
}

export function HumanInterventionStep({
  targetDomain,
  liveViewUrl,
  onDone,
  isLoading,
  errorMessage,
  note,
}: HumanInterventionStepProps) {
  const slot = useSlot();
  const l = useLocalization();
  const origin = useMemo(() => liveViewOrigin(liveViewUrl), [liveViewUrl]);
  const [attempt, setAttempt] = useState(0);
  const [connectFailed, setConnectFailed] = useState(false);

  useEffect(() => {
    if (!origin) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      const type = (event.data as { type?: unknown } | null)?.type;
      if (typeof type === "string" && LIVE_VIEW_CONNECT_FAILURES.has(type)) {
        setConnectFailed(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [origin]);

  const retry = () => {
    setConnectFailed(false);
    setAttempt((n) => n + 1);
  };

  return (
    <div className="kma-step kma-human-intervention">
      <div className="kma-step__header kma-human-intervention__header">
        <h1 {...slot("title", "kma-title")}>{l.humanInterventionTitle}</h1>
      </div>

      {note && (
        <p
          {...slot("humanInterventionNote", "kma-human-intervention__note")}
          role="status"
        >
          {note}
        </p>
      )}
      {errorMessage && <ErrorBanner message={errorMessage} />}

      <div
        {...slot("humanInterventionLiveView", "kma-human-intervention__frame")}
      >
        {origin ? (
          <iframe
            key={`${liveViewUrl}-${attempt}`}
            src={liveViewUrl ?? undefined}
            title={l.humanInterventionLiveViewTitle}
            className="kma-human-intervention__iframe"
            allow="clipboard-read; clipboard-write"
          />
        ) : (
          <p className="kma-human-intervention__notice">
            {l.humanInterventionLiveViewUnavailable}
          </p>
        )}
        {connectFailed && (
          <div className="kma-human-intervention__overlay" role="alert">
            <p className="kma-human-intervention__notice">
              {l.humanInterventionLiveViewFailed}
            </p>
            <Button variant="secondary" onClick={retry}>
              {l.humanInterventionRetry}
            </Button>
          </div>
        )}
      </div>

      <p {...slot("humanInterventionMessage", "kma-human-intervention__hint")}>
        {l.humanInterventionMessage(targetDomain)}
      </p>

      <Button onClick={onDone} disabled={isLoading}>
        {l.humanInterventionDone}
      </Button>
    </div>
  );
}
