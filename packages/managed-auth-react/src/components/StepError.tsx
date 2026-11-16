import { useState } from "react";
import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import type { ErrorCode, Localizer } from "../localization/types";
import { extractDomainName } from "../lib/profile-name";
import { SiteIcon } from "./SiteIcon";
import { ChevronDownIcon, ChevronUpIcon, XCircleIcon } from "./icons";

interface StepErrorProps {
  targetDomain: string;
  errorMessage?: string;
  errorCode?: string;
}

// These codes show the server's error_message when there is one, since it says
// how the flow ended (e.g. a person was asked and didn't finish in time).
const PREFER_SERVER_MESSAGE = new Set<string>(["captcha_blocked"]);

export function errorDisplayForCode(l: Localizer, errorCode?: string) {
  if (
    !errorCode ||
    !Object.prototype.hasOwnProperty.call(l.errorCodeMessages, errorCode)
  ) {
    return undefined;
  }
  return l.errorCodeMessages[errorCode as ErrorCode];
}

function extractErrorText(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.error === "string"
    ) {
      return parsed.error;
    }
  } catch {
    /* not JSON, use as-is */
  }
  return raw;
}

export function StepError({
  targetDomain,
  errorMessage,
  errorCode,
}: StepErrorProps) {
  const slot = useSlot();
  const l = useLocalization();
  const siteName = extractDomainName(targetDomain);
  const [showDetails, setShowDetails] = useState(false);

  const display = errorDisplayForCode(l, errorCode);
  const preferServerMessage =
    errorCode !== undefined && PREFER_SERVER_MESSAGE.has(errorCode);
  const title = display?.title ?? l.errorTitle;
  const rawDetails = errorMessage?.trim()
    ? extractErrorText(errorMessage)
    : undefined;
  const description =
    (preferServerMessage ? rawDetails : undefined) ??
    display?.description ??
    l.errorGenericMessage;
  const hasDetails = rawDetails && rawDetails !== description;

  return (
    <div className="kma-step kma-step--terminal kma-step--center">
      <div className="kma-step__icon-wrap">
        <div className="kma-icon-with-badge">
          <SiteIcon siteName={siteName} tone="muted" />
          <span {...slot("errorIcon", "kma-icon-badge kma-icon-badge--error")}>
            <XCircleIcon />
          </span>
        </div>
      </div>

      <div className="kma-step__header">
        <h1 {...slot("errorTitle", "kma-title")}>{title}</h1>
        <p {...slot("errorDescription", "kma-subtitle")}>{description}</p>
      </div>

      {hasDetails && (
        <div className="kma-error-details">
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="kma-error-details__toggle"
          >
            {showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {showDetails ? l.errorHideDetails : l.errorShowDetails}
          </button>
          {showDetails && (
            <div className="kma-error-details__panel">
              <p className="kma-error-details__text">{rawDetails}</p>
            </div>
          )}
        </div>
      )}

      <p className="kma-loading-hint">{l.errorCloseHint}</p>
    </div>
  );
}
