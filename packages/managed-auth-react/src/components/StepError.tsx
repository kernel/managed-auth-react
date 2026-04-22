import { useState } from "react";
import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { extractDomainName } from "../lib/profile-name";
import { SiteIcon } from "./SiteIcon";
import { ChevronDownIcon, ChevronUpIcon, XCircleIcon } from "./icons";

interface StepErrorProps {
  targetDomain: string;
  errorMessage?: string;
  errorCode?: string;
}

const ERROR_DISPLAY: Record<string, { title: string; description: string }> = {
  domain_not_allowed: {
    title: "Domain not allowed",
    description:
      "The login flow redirected to a domain that isn't configured. Update the allowed_domains setting to include it.",
  },
  login_form_not_found: {
    title: "Login form not found",
    description:
      "We couldn't find a login form on this page. The website may have changed its layout, or the login URL might be incorrect.",
  },
  credentials_invalid: {
    title: "Invalid credentials",
    description: "The username or password was not accepted by the website.",
  },
  bot_detected: {
    title: "Verification required",
    description: "This website detected automated access and blocked the login.",
  },
  captcha_blocked: {
    title: "Verification required",
    description: "A CAPTCHA challenge blocked the login.",
  },
  stuck_in_loop: {
    title: "Login couldn't complete",
    description:
      "We got stuck trying to complete the login. This can happen with unusual login flows.",
  },
  max_attempts_reached: {
    title: "Login couldn't complete",
    description:
      "We weren't able to complete the login after several attempts.",
  },
  website_error: {
    title: "Website error",
    description:
      "The website returned an error during login. The site may be experiencing issues.",
  },
  navigation_confused: {
    title: "Login couldn't complete",
    description:
      "We got confused navigating this website. This sometimes happens with complex login flows.",
  },
  browser_error: {
    title: "Browser error",
    description: "There was an issue with the browser. Please try again.",
  },
  session_expired: {
    title: "Session expired",
    description:
      "The login session has expired. Please start a new login flow.",
  },
};

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

  const display = errorCode ? ERROR_DISPLAY[errorCode] : undefined;
  const title = display?.title ?? l.errorTitle;
  const description = display?.description ?? l.errorGenericMessage;

  const rawDetails = errorMessage?.trim()
    ? extractErrorText(errorMessage)
    : undefined;
  const hasDetails = rawDetails && rawDetails !== description;

  return (
    <div className="kma-step kma-step--center">
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

      {errorCode && (
        <p {...slot("errorCode", "kma-error-code")}>
          {l.errorCodeLabel}: <code>{errorCode}</code>
        </p>
      )}

      <p className="kma-loading-hint">{l.errorCloseHint}</p>
    </div>
  );
}
