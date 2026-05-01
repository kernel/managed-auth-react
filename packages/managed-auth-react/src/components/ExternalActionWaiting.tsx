import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { FingerprintIcon, KeyIcon, SmartphoneIcon } from "./icons";

interface ExternalActionWaitingProps {
  message?: string | null;
}

export function ExternalActionWaiting({ message }: ExternalActionWaitingProps) {
  const slot = useSlot();
  const l = useLocalization();
  return (
    <div className="kma-step kma-step--center kma-external-action">
      <div className="kma-step__icon-wrap">
        <div className="kma-external-action__cluster">
          <div {...slot("externalActionIcon", "kma-external-action__primary")}>
            <SmartphoneIcon className="kma-external-action__primary-icon" />
          </div>
          <span className="kma-external-action__badge kma-external-action__badge--key">
            <KeyIcon />
          </span>
          <span className="kma-external-action__badge kma-external-action__badge--fp">
            <FingerprintIcon />
          </span>
        </div>
      </div>

      <div className="kma-step__header">
        <h2 className="kma-loading-title">{l.externalActionTitle}</h2>
        <p {...slot("externalActionMessage", "kma-subtitle")}>
          {message || l.externalActionFallbackMessage}
        </p>
      </div>

      <div className="kma-bouncing-dots" aria-hidden="true">
        <span className="kma-bouncing-dot" style={{ animationDelay: "0ms" }} />
        <span
          className="kma-bouncing-dot"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="kma-bouncing-dot"
          style={{ animationDelay: "300ms" }}
        />
      </div>

      <p className="kma-loading-hint">{l.externalActionWaiting}</p>
    </div>
  );
}
