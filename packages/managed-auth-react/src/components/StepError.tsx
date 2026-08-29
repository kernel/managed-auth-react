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
  totp_required: {
    title: "Authenticator code required",
    description:
      "An authenticator code is required, but no TOTP secret is available for automatic re-authentication.",
  },
  sms_code_required: {
    title: "SMS code required",
    description:
      "A code sent by SMS is required. Complete an interactive login to continue.",
  },
  email_code_required: {
    title: "Email code required",
    description:
      "A code sent by email is required. Complete an interactive login to continue.",
  },
  account_choice_required: {
    title: "Account selection required",
    description:
      "An account or identity must be selected before login can continue.",
  },
  customer_input_required: {
    title: "Additional input required",
    description:
      "Additional customer input is required before login can continue.",
  },
  external_action_required: {
    title: "External action required",
    description:
      "An external action is required to continue. Check your authenticator app, email, or phone for a verification request.",
  },
  totp_code_rejected: {
    title: "Authenticator code rejected",
    description:
      "The website rejected the authenticator code. Try a fresh code, or reconnect the account if generated codes keep failing across new code windows.",
  },
  bot_detected: {
    title: "Verification required",
    description:
      "This website detected automated access and blocked the login.",
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

export function errorDisplayForCode(errorCode?: string) {
  return errorCode ? ERROR_DISPLAY[errorCode] : undefined;
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

  const display = errorDisplayForCode(errorCode);
  const title = display?.title ?? l.errorTitle;
  const description = display?.description ?? l.errorGenericMessage;

  const rawDetails = errorMessage?.trim()
    ? extractErrorText(errorMessage)
    : undefined;
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
