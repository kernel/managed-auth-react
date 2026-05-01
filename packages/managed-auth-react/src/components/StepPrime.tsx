import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import {
  extractDomainName,
  extractPrimaryDomainLabel,
} from "../lib/profile-name";
import type { AppearanceLayout } from "../appearance/types";
import { Button } from "./primitives/Button";
import { SiteIcon } from "./SiteIcon";
import { LockIcon, ShieldIcon } from "./icons";

interface StepPrimeProps {
  targetDomain: string;
  onContinue: () => void;
  isLoading?: boolean;
  layout?: AppearanceLayout;
}

export function StepPrime({
  targetDomain,
  onContinue,
  isLoading = false,
  layout,
}: StepPrimeProps) {
  const slot = useSlot();
  const l = useLocalization();

  const siteName = extractDomainName(targetDomain);
  const primaryLabel = extractPrimaryDomainLabel(siteName);
  const displayName =
    primaryLabel.charAt(0).toUpperCase() + primaryLabel.slice(1);

  const showSecurityCard = layout?.showSecurityCard !== false;
  const showLegalText = layout?.showLegalText !== false;

  return (
    <div className="kma-step">
      <div className="kma-step__icon-wrap">
        <SiteIcon siteName={siteName} />
      </div>

      <div className="kma-step__header">
        <h1 {...slot("title", "kma-title")}>{l.primeTitle(displayName)}</h1>
        <p {...slot("subtitle", "kma-subtitle")}>{l.primeSubtitle(siteName)}</p>
      </div>

      {showSecurityCard && (
        <div {...slot("securityCard", "kma-security-card")}>
          <div {...slot("securityRow", "kma-security-row")}>
            <LockIcon {...slot("securityIcon", "kma-security-icon")} />
            <p {...slot("securityText", "kma-security-text")}>
              {l.securityEncryption}
            </p>
          </div>
          <div {...slot("securityRow", "kma-security-row")}>
            <ShieldIcon {...slot("securityIcon", "kma-security-icon")} />
            <p {...slot("securityText", "kma-security-text")}>
              {l.securityNoThirdParty}
            </p>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        onClick={onContinue}
        disabled={isLoading}
        className="kma-button--full"
      >
        {isLoading ? l.primeLoadingButton : l.primeContinueButton}
      </Button>

      {showLegalText && (
        <p {...slot("legalText", "kma-legal")}>
          {l.legalPrefix}{" "}
          <a
            {...slot("legalLink", "kma-legal__link")}
            href="https://kernel.sh/docs/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            {l.legalPrivacyPolicy}
          </a>{" "}
          {l.legalConjunction}{" "}
          <a
            {...slot("legalLink", "kma-legal__link")}
            href="https://kernel.sh/docs/tos"
            target="_blank"
            rel="noopener noreferrer"
          >
            {l.legalTermsOfService}
          </a>
          .
        </p>
      )}
    </div>
  );
}
