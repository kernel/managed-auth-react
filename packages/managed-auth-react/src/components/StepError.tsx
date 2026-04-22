import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { extractDomainName } from "../lib/profile-name";
import { SiteIcon } from "./SiteIcon";
import { XCircleIcon } from "./icons";

interface StepErrorProps {
  targetDomain: string;
  errorMessage?: string;
  errorCode?: string;
}

export function StepError({ targetDomain, errorMessage, errorCode }: StepErrorProps) {
  const slot = useSlot();
  const l = useLocalization();
  const siteName = extractDomainName(targetDomain);

  return (
    <div className="kma-step kma-step--center">
      <div className="kma-step__icon-wrap">
        <div className="kma-icon-with-badge">
          <SiteIcon siteName={siteName} tone="muted" />
          <span
            {...slot("errorIcon", "kma-icon-badge kma-icon-badge--error")}
          >
            <XCircleIcon />
          </span>
        </div>
      </div>

      <div className="kma-step__header">
        <h1 {...slot("errorTitle", "kma-title")}>{l.errorTitle}</h1>
        <p {...slot("errorDescription", "kma-subtitle")}>
          {errorMessage || l.errorGenericMessage}
        </p>
        {errorCode && (
          <p {...slot("errorCode", "kma-error-code")}>
            {l.errorCodeLabel}: <code>{errorCode}</code>
          </p>
        )}
      </div>
    </div>
  );
}
