import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { ClockIcon } from "./icons";

export function StepExpired() {
  const slot = useSlot();
  const l = useLocalization();

  return (
    <div {...slot("expiredCard", "kma-step kma-step--center")}>
      <div className="kma-step__icon-wrap">
        <div className="kma-circle-icon kma-circle-icon--muted">
          <ClockIcon />
        </div>
      </div>
      <div className="kma-step__header">
        <h1 {...slot("expiredTitle", "kma-title")}>{l.expiredTitle}</h1>
        <p {...slot("expiredDescription", "kma-subtitle")}>{l.expiredDescription}</p>
      </div>
    </div>
  );
}
