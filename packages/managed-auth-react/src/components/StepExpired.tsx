import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { ClockIcon } from "./icons";

export function StepExpired() {
  const slot = useSlot();
  const l = useLocalization();

  return (
    <div className="kma-step kma-step--center kma-step--expired">
      <div className="kma-step__icon-wrap">
        <div
          {...slot(
            "expiredIcon",
            "kma-circle-icon kma-circle-icon--warning kma-circle-icon--sm",
          )}
        >
          <ClockIcon />
        </div>
      </div>
      <div className="kma-step__header">
        <h1 {...slot("expiredTitle", "kma-title")}>{l.expiredTitle}</h1>
        <p {...slot("expiredDescription", "kma-subtitle")}>
          {l.expiredDescription}
        </p>
      </div>
    </div>
  );
}
