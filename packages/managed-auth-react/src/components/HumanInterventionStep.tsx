import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";

interface HumanInterventionStepProps {
  liveViewUrl?: string | null;
}

export function HumanInterventionStep({
  liveViewUrl,
}: HumanInterventionStepProps) {
  const slot = useSlot();
  const l = useLocalization();

  return (
    <div className="kma-step kma-step--center kma-human-intervention">
      <div className="kma-step__header">
        <h2 className="kma-loading-title">{l.humanInterventionTitle}</h2>
        <p {...slot("humanInterventionMessage", "kma-subtitle")}>
          {l.humanInterventionMessage}
        </p>
      </div>

      {liveViewUrl ? (
        <div className="kma-human-intervention__iframe-wrap">
          <iframe
            src={liveViewUrl}
            title={l.humanInterventionIframeTitle}
            className="kma-human-intervention__iframe"
            allow="clipboard-write"
          />
          <span
            className="kma-human-intervention__live-badge"
            aria-hidden="true"
          >
            <span className="kma-human-intervention__live-dot" />
            Live
          </span>
        </div>
      ) : (
        <div className="kma-bouncing-dots" aria-hidden="true">
          <span
            className="kma-bouncing-dot"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="kma-bouncing-dot"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="kma-bouncing-dot"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      )}

      <p className="kma-loading-hint">{l.humanInterventionWaiting}</p>
    </div>
  );
}
