import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { extractDomainName } from "../lib/profile-name";
import { SiteIcon } from "./SiteIcon";
import { CheckCircleIcon } from "./icons";

interface StepSuccessProps {
  targetDomain: string;
}

export function StepSuccess({ targetDomain }: StepSuccessProps) {
  const slot = useSlot();
  const l = useLocalization();
  const siteName = extractDomainName(targetDomain);

  return (
    <div className="kma-step kma-step--center">
      <div className="kma-step__icon-wrap">
        <div className="kma-icon-with-badge">
          <SiteIcon siteName={siteName} />
          <span
            {...slot("successIcon", "kma-icon-badge kma-icon-badge--success")}
          >
            <CheckCircleIcon />
          </span>
        </div>
      </div>

      <div className="kma-step__header">
        <h1 {...slot("successTitle", "kma-title")}>{l.successTitle}</h1>
        <p {...slot("successDescription", "kma-subtitle")}>
          {l.successDescription(siteName)}
        </p>
      </div>
    </div>
  );
}
