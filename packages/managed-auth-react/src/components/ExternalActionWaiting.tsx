import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { SmartphoneIcon } from "./icons";

interface ExternalActionWaitingProps {
  message?: string | null;
}

export function ExternalActionWaiting({ message }: ExternalActionWaitingProps) {
  const slot = useSlot();
  const l = useLocalization();
  return (
    <div className="kma-step kma-step--center">
      <div className="kma-step__icon-wrap">
        <div
          {...slot("externalActionIcon", "kma-circle-icon kma-circle-icon--primary")}
        >
          <SmartphoneIcon />
        </div>
      </div>
      <p {...slot("externalActionMessage", "kma-subtitle")}>
        {message || l.externalActionFallbackMessage}
      </p>
    </div>
  );
}
