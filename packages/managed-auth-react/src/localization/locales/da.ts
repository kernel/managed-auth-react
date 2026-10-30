import type { Localizer } from "../types";

export const da: Localizer = {
  primeTitle: (site) => `Log ind på ${site}`,
  primeSubtitle: (site) =>
    `Indtast dine loginoplysninger til ${site} for at fortsætte`,
  primeContinueButton: "Fortsæt",
  primeLoadingButton: "Indlæser...",
  primeLoadingTitle: "Forbereder sikkert login",
  primeLoadingSubtitle: "Indlæser forbindelsesoplysninger...",
  securityEncryption: "Dine loginoplysninger er end-to-end-krypteret",
  securityNoThirdParty: "Deles aldrig med nogen, heller ikke med en LLM",
  legalPrefix: "Ved at fortsætte accepterer du Kernels",
  legalPrivacyPolicy: "privatlivspolitik",
  legalTermsOfService: "servicevilkår",
  legalConjunction: "og",
  discoveringMessage: "Undersøger, hvad login kræver...",
  waitingForFormMessage: "Venter på loginformularen...",
  submittingMessage: "Logger ind...",
  loadingDiscoverySteps: [
    "Går til loginsiden...",
    "Analyserer formularens struktur...",
    "Finder de påkrævede felter...",
  ],
  loadingAuthSteps: [
    "Indtaster loginoplysninger...",
    "Sender loginformularen...",
    "Bekræfter login...",
  ],
  loadingTimeHint: "Det kan tage 15-30 sekunder...",
  loginTitle: (site) => `Log ind på ${site}`,
  ssoLoginTitle: (provider) => `Log ind med ${provider}`,
  ssoLoginSubtitle: (site) => `til ${site}`,
  mfaSelectTitle: "Vælg bekræftelsesmetode",
  mfaSelectSubtitle: "Vælg, hvordan du vil modtage din bekræftelseskode",
  signInSelectTitle: "Vælg en mulighed",
  signInSelectSubtitle: "Vælg, hvilken mulighed du vil fortsætte med",
  accountSelectTitle: "Vælg en konto",
  accountSelectSubtitle: "Vælg, hvilken konto du vil fortsætte med",
  submitButton: "Fortsæt",
  submittingButton: "Logger ind...",
  ssoButtonLabel: (provider) => `Log ind med ${provider}`,
  orDivider: "eller",
  passwordShow: "Vis adgangskode",
  passwordHide: "Skjul adgangskode",
  fieldRejectedNotice:
    "Den gemte værdi blev afvist. Indtast en ny for at fortsætte.",
  credentialSafetyNotice:
    "Dine loginoplysninger krypteres og sendes direkte fra din browser. De deles aldrig med nogen, heller ikke med en LLM.",
  mfaTypeLabels: {
    sms: "Sms",
    call: "Telefonopkald",
    email: "E-mail",
    totp: "Godkendelsesapp",
    push: "Pushnotifikation",
    password: "Adgangskode",
    passkey: "Adgangsnøgle",
    switch: "Brug en anden metode",
    other: "Andet",
  },
  successTitle: "Du er logget ind",
  successDescription: (site) => `Din ${site}-konto er nu forbundet`,
  successCloseHint: "Du kan nu lukke dette vindue",
  errorTitle: "Login mislykkedes",
  errorGenericMessage:
    "Der opstod et uventet problem, da vi forsøgte at logge dig ind.",
  errorCodeLabel: "Fejlkode",
  errorShowDetails: "Vis detaljer",
  errorHideDetails: "Skjul detaljer",
  errorCloseHint: "Du kan nu lukke dette vindue",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Domænet er ikke tilladt",
      description:
        "Login omdirigerede til et domæne, der ikke er konfigureret. Tilføj det til indstillingen allowed_domains.",
    },
    login_form_not_found: {
      title: "Loginformularen blev ikke fundet",
      description:
        "Vi kunne ikke finde en loginformular på denne side. Websitet kan have ændret layout, eller login-adressen kan være forkert.",
    },
    credentials_invalid: {
      title: "Ugyldige loginoplysninger",
      description: "Websitet accepterede ikke brugernavnet eller adgangskoden.",
    },
    totp_required: {
      title: "Godkendelseskode påkrævet",
      description: "Der kræves en kode fra en godkendelsesapp.",
    },
    sms_code_required: {
      title: "Sms-kode påkrævet",
      description: "Der kræves en kode sendt via sms.",
    },
    email_code_required: {
      title: "E-mailkode påkrævet",
      description: "Der kræves en kode sendt via e-mail.",
    },
    account_choice_required: {
      title: "Valg af konto påkrævet",
      description:
        "Der skal vælges en konto eller identitet, før login kan fortsætte.",
    },
    customer_input_required: {
      title: "Flere oplysninger påkrævet",
      description: "Der kræves flere oplysninger, før login kan fortsætte.",
    },
    external_action_required: {
      title: "Ekstern handling påkrævet",
      description:
        "Der kræves en ekstern handling for at fortsætte. Tjek din godkendelsesapp, e-mail eller telefon for en anmodning om bekræftelse.",
    },
    totp_code_rejected: {
      title: "Godkendelseskoden blev afvist",
      description:
        "Websitet afviste godkendelseskoden. Prøv en ny kode, eller forbind kontoen igen, hvis genererede koder bliver ved med at fejle i nye tidsintervaller.",
    },
    bot_detected: {
      title: "Bekræftelse påkrævet",
      description:
        "Websitet registrerede automatiseret adgang og blokerede login.",
    },
    captcha_blocked: {
      title: "Bekræftelse påkrævet",
      description: "En CAPTCHA blokerede login.",
    },
    stuck_in_loop: {
      title: "Login kunne ikke gennemføres",
      description:
        "Vi sad fast, da vi forsøgte at gennemføre login. Det kan ske med usædvanlige loginforløb.",
    },
    max_attempts_reached: {
      title: "Login kunne ikke gennemføres",
      description: "Vi kunne ikke gennemføre login efter flere forsøg.",
    },
    website_error: {
      title: "Fejl på websitet",
      description:
        "Websitet returnerede en fejl under login. Websitet har muligvis problemer.",
    },
    navigation_confused: {
      title: "Login kunne ikke gennemføres",
      description:
        "Vi kunne ikke finde rundt på dette website. Det sker nogle gange med komplekse loginforløb.",
    },
    browser_error: {
      title: "Browserfejl",
      description: "Der opstod et problem med browseren. Prøv igen.",
    },
    session_expired: {
      title: "Sessionen er udløbet",
      description: "Loginsessionen er udløbet. Start et nyt login.",
    },
  },
  expiredTitle: "Sessionen er udløbet",
  expiredDescription:
    "Denne godkendelsessession er udløbet. Start en ny session.",
  externalActionTitle: "Handling påkrævet",
  externalActionFallbackMessage: "Gennemfør bekræftelsen på din enhed",
  externalActionWaiting: "Venter på din bekræftelse...",
  humanInterventionTitle: "Menneskelig bekræftelse påkrævet",
  humanInterventionMessage: (site) =>
    `Gennemfør kontrollen på ${site} ovenfor, og fortsæt derefter. Vi fortsætter med at logge dig ind bagefter.`,
  humanInterventionDone: "Fortsæt",
  humanInterventionLiveViewTitle: "Loginbrowser",
  humanInterventionLiveViewUnavailable:
    "Loginbrowseren er ikke tilgængelig lige nu.",
  humanInterventionLiveViewFailed:
    "Kunne ikke oprette forbindelse til loginbrowseren.",
  humanInterventionLiveViewGaveUp:
    "Kunne ikke oprette forbindelse til loginbrowseren. Genindlæs siden for at prøve igen.",
  humanInterventionLiveViewUnsupported:
    "Din browser kan ikke vise loginbrowseren. Prøv en anden browser.",
  humanInterventionRetry: "Prøv igen",
  poweredBy: "Leveret af",
};
