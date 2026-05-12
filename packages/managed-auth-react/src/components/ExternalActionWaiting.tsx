import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import type { MFAOption, MFAType } from "../lib/types";
import { Button } from "./primitives/Button";
import {
  FingerprintIcon,
  KeyIcon,
  MailIcon,
  PhoneIcon,
  RepeatIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
} from "./icons";

function getMFAIcon(type: MFAType) {
  switch (type) {
    case "sms":
      return <SmartphoneIcon />;
    case "call":
      return <PhoneIcon />;
    case "email":
      return <MailIcon />;
    case "totp":
      return <KeyIcon />;
    case "push":
      return <ShieldCheckIcon />;
    case "password":
      return <FingerprintIcon />;
    case "switch":
      return <RepeatIcon />;
    default:
      return <KeyIcon />;
  }
}

interface ExternalActionWaitingProps {
  message?: string | null;
  mfaOptions?: MFAOption[];
  onMFASelect?: (mfaType: MFAType) => void;
  isLoading?: boolean;
}

export function ExternalActionWaiting({
  message,
  mfaOptions = [],
  onMFASelect,
  isLoading,
}: ExternalActionWaitingProps) {
  const slot = useSlot();
  const l = useLocalization();
  const hasMfaOptions = mfaOptions.length > 0 && onMFASelect;

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

      {hasMfaOptions && (
        <div className="kma-external-action__alternatives">
          {mfaOptions.map((option, idx) => (
            <Button
              key={idx}
              variant="secondary"
              slotKey="mfaOption"
              className="kma-option"
              onClick={() => onMFASelect(option.type)}
              disabled={isLoading}
            >
              <span
                {...slot("mfaOptionIcon", "kma-option__icon")}
                aria-hidden="true"
              >
                {getMFAIcon(option.type)}
              </span>
              <div className="kma-option__text">
                <div {...slot("mfaOptionLabel", "kma-option__label")}>
                  {option.label || l.mfaTypeLabels[option.type] || option.type}
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
