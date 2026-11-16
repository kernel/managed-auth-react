import type { Localizer } from "./types";

export const DEFAULT_LOCALIZATION: Localizer = {
  primeTitle: (site) => `Sign in to ${site}`,
  primeSubtitle: (site) => `Enter your ${site} credentials to continue`,
  primeContinueButton: "Continue",
  primeLoadingButton: "Loading...",
  primeLoadingTitle: "Preparing secure sign-in",
  primeLoadingSubtitle: "Loading connection details...",
  securityEncryption: "Your credentials are encrypted end-to-end",
  // Matches the second sentence of `credentialSafetyNotice` so the consent
  // step and the form footer make the same promise verbatim.
  securityNoThirdParty: "Never shared with anyone or any LLM",
  legalPrefix: "By continuing you agree to Kernel's",
  legalPrivacyPolicy: "Privacy Policy",
  legalTermsOfService: "Terms of Service",
  legalConjunction: "and",
  discoveringMessage: "Discovering login requirements...",
  waitingForFormMessage: "Waiting for login form...",
  submittingMessage: "Signing in...",
  loadingDiscoverySteps: [
    "Navigating to login page...",
    "Analyzing form structure...",
    "Identifying required fields...",
  ],
  loadingAuthSteps: [
    "Entering credentials...",
    "Submitting login form...",
    "Verifying authentication...",
  ],
  loadingTimeHint: "This may take 15-30 seconds...",
  loginTitle: (site) => `Sign in to ${site}`,
  ssoLoginTitle: (provider) => `Sign in with ${provider}`,
  ssoLoginSubtitle: (site) => `for ${site}`,
  mfaSelectTitle: "Choose verification method",
  mfaSelectSubtitle: "Select how you'd like to receive your verification code",
  signInSelectTitle: "Choose an option",
  signInSelectSubtitle: "Select which option to continue with",
  accountSelectTitle: "Choose an account",
  accountSelectSubtitle: "Select which account to continue with",
  submitButton: "Continue",
  submittingButton: "Signing in...",
  ssoButtonLabel: (provider) => `Sign in with ${provider}`,
  orDivider: "or",
  passwordShow: "Show password",
  passwordHide: "Hide password",
  fieldRejectedNotice:
    "The saved value was rejected. Enter a new one to continue.",
  credentialSafetyNotice:
    "Your credentials are encrypted and sent directly from your browser. They are never shared with anyone or any LLM.",
  mfaTypeLabels: {
    sms: "Text message",
    call: "Phone call",
    email: "Email",
    totp: "Authenticator app",
    push: "Push notification",
    password: "Password",
    passkey: "Passkey",
    switch: "Use another method",
    other: "Other",
  },
  successTitle: "Successfully signed in",
  successDescription: (site) => `Your ${site} account is now connected`,
  successCloseHint: "You can now close this window",
  errorTitle: "Login failed",
  errorGenericMessage:
    "We encountered an unexpected issue while trying to sign you in.",
  errorCodeLabel: "Error code",
  errorShowDetails: "Show details",
  errorHideDetails: "Hide details",
  errorCloseHint: "You can now close this window",
  errorCodeMessages: {
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
      description: "An authenticator code is required.",
    },
    sms_code_required: {
      title: "SMS code required",
      description: "A code sent by SMS is required.",
    },
    email_code_required: {
      title: "Email code required",
      description: "A code sent by email is required.",
    },
    account_choice_required: {
      title: "Account selection required",
      description:
        "An account or identity must be selected before login can continue.",
    },
    customer_input_required: {
      title: "Additional input required",
      description:
        "Additional information is required before login can continue.",
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
      description: "A CAPTCHA blocked the login.",
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
  },
  expiredTitle: "Session Expired",
  expiredDescription:
    "This authentication session has expired. Please start a new session.",
  externalActionTitle: "Action Required",
  externalActionFallbackMessage: "Complete the verification on your device",
  externalActionWaiting: "Waiting for your confirmation...",
  humanInterventionTitle: "Human verification required",
  humanInterventionMessage: (site) =>
    `Complete the check in ${site} above, then continue. We'll continue signing you in after.`,
  humanInterventionDone: "Continue",
  humanInterventionLiveViewTitle: "Login browser",
  humanInterventionLiveViewUnavailable:
    "The login browser isn't available right now.",
  humanInterventionLiveViewFailed: "Couldn't connect to the login browser.",
  humanInterventionLiveViewGaveUp:
    "Couldn't connect to the login browser. Reload this page to try again.",
  humanInterventionLiveViewUnsupported:
    "Your browser can't show the login browser. Try a different browser.",
  humanInterventionRetry: "Try again",
  poweredBy: "Powered by",
};
