import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { extractDomainName } from "../lib/profile-name";
import { Button } from "./primitives/Button";
import { ErrorBanner } from "./ErrorBanner";
import { LiveViewFrame } from "./LiveViewFrame";

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

      <LiveViewFrame key={liveViewUrl ?? ""} url={liveViewUrl} />

      <p {...slot("humanInterventionMessage", "kma-human-intervention__hint")}>
        {l.humanInterventionMessage(extractDomainName(targetDomain))}
      </p>

      <Button onClick={onDone} disabled={isLoading}>
        {l.humanInterventionDone}
      </Button>
    </div>
  );
}
