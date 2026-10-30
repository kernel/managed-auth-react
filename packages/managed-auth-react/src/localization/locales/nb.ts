import type { Localizer } from "../types";

export const nb: Localizer = {
  primeTitle: (site) => `Logg på ${site}`,
  primeSubtitle: (site) =>
    `Skriv inn påloggingsinformasjonen din for ${site} for å fortsette`,
  primeContinueButton: "Fortsett",
  primeLoadingButton: "Laster inn...",
  primeLoadingTitle: "Forbereder sikker pålogging",
  primeLoadingSubtitle: "Laster inn tilkoblingsdetaljer...",
  securityEncryption: "Påloggingsinformasjonen din er ende-til-ende-kryptert",
  securityNoThirdParty: "Deles aldri med noen, heller ikke med en LLM",
  legalPrefix: "Ved å fortsette godtar du Kernels",
  legalPrivacyPolicy: "personvernerklæring",
  legalTermsOfService: "vilkår for bruk",
  legalConjunction: "og",
  discoveringMessage: "Finner ut hva påloggingen krever...",
  waitingForFormMessage: "Venter på påloggingsskjemaet...",
  submittingMessage: "Logger på...",
  loadingDiscoverySteps: [
    "Går til påloggingssiden...",
    "Analyserer skjemaets struktur...",
    "Finner obligatoriske felt...",
  ],
  loadingAuthSteps: [
    "Fyller inn påloggingsinformasjon...",
    "Sender påloggingsskjemaet...",
    "Bekrefter påloggingen...",
  ],
  loadingTimeHint: "Dette kan ta 15-30 sekunder...",
  loginTitle: (site) => `Logg på ${site}`,
  ssoLoginTitle: (provider) => `Logg på med ${provider}`,
  ssoLoginSubtitle: (site) => `for ${site}`,
  mfaSelectTitle: "Velg bekreftelsesmetode",
  mfaSelectSubtitle: "Velg hvordan du vil motta bekreftelseskoden",
  signInSelectTitle: "Velg et alternativ",
  signInSelectSubtitle: "Velg hvilket alternativ du vil fortsette med",
  accountSelectTitle: "Velg en konto",
  accountSelectSubtitle: "Velg hvilken konto du vil fortsette med",
  submitButton: "Fortsett",
  submittingButton: "Logger på...",
  ssoButtonLabel: (provider) => `Logg på med ${provider}`,
  orDivider: "eller",
  passwordShow: "Vis passord",
  passwordHide: "Skjul passord",
  fieldRejectedNotice:
    "Den lagrede verdien ble avvist. Skriv inn en ny for å fortsette.",
  credentialSafetyNotice:
    "Påloggingsinformasjonen din krypteres og sendes direkte fra nettleseren din. Den deles aldri med noen, heller ikke med en LLM.",
  mfaTypeLabels: {
    sms: "SMS",
    call: "Telefonsamtale",
    email: "E-post",
    totp: "Autentiseringsapp",
    push: "Push-varsel",
    password: "Passord",
    passkey: "Tilgangsnøkkel",
    switch: "Bruk en annen metode",
    other: "Annet",
  },
  successTitle: "Du er logget på",
  successDescription: (site) => `${site}-kontoen din er nå tilkoblet`,
  successCloseHint: "Du kan nå lukke dette vinduet",
  errorTitle: "Påloggingen mislyktes",
  errorGenericMessage:
    "Det oppstod et uventet problem da vi prøvde å logge deg på.",
  errorCodeLabel: "Feilkode",
  errorShowDetails: "Vis detaljer",
  errorHideDetails: "Skjul detaljer",
  errorCloseHint: "Du kan nå lukke dette vinduet",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Domenet er ikke tillatt",
      description:
        "Påloggingen ble videresendt til et domene som ikke er konfigurert. Legg det til i innstillingen allowed_domains.",
    },
    login_form_not_found: {
      title: "Fant ikke påloggingsskjemaet",
      description:
        "Vi fant ikke noe påloggingsskjema på denne siden. Nettstedet kan ha endret oppsett, eller påloggingsadressen kan være feil.",
    },
    credentials_invalid: {
      title: "Ugyldig påloggingsinformasjon",
      description: "Nettstedet godtok ikke brukernavnet eller passordet.",
    },
    totp_required: {
      title: "Autentiseringskode kreves",
      description: "Det kreves en kode fra en autentiseringsapp.",
    },
    sms_code_required: {
      title: "SMS-kode kreves",
      description: "Det kreves en kode sendt på SMS.",
    },
    email_code_required: {
      title: "E-postkode kreves",
      description: "Det kreves en kode sendt på e-post.",
    },
    account_choice_required: {
      title: "Kontovalg kreves",
      description:
        "En konto eller identitet må velges før påloggingen kan fortsette.",
    },
    customer_input_required: {
      title: "Mer informasjon kreves",
      description: "Det trengs mer informasjon før påloggingen kan fortsette.",
    },
    external_action_required: {
      title: "Ekstern handling kreves",
      description:
        "Det kreves en ekstern handling for å fortsette. Sjekk autentiseringsappen, e-posten eller telefonen din for en bekreftelsesforespørsel.",
    },
    totp_code_rejected: {
      title: "Autentiseringskoden ble avvist",
      description:
        "Nettstedet avviste autentiseringskoden. Prøv en ny kode, eller koble til kontoen på nytt hvis genererte koder fortsetter å mislykkes i nye tidsvinduer.",
    },
    bot_detected: {
      title: "Bekreftelse kreves",
      description:
        "Nettstedet oppdaget automatisert tilgang og blokkerte påloggingen.",
    },
    captcha_blocked: {
      title: "Bekreftelse kreves",
      description: "En CAPTCHA blokkerte påloggingen.",
    },
    stuck_in_loop: {
      title: "Påloggingen kunne ikke fullføres",
      description:
        "Vi kom oss ikke videre da vi prøvde å fullføre påloggingen. Dette kan skje med uvanlige påloggingsflyter.",
    },
    max_attempts_reached: {
      title: "Påloggingen kunne ikke fullføres",
      description: "Vi klarte ikke å fullføre påloggingen etter flere forsøk.",
    },
    website_error: {
      title: "Feil på nettstedet",
      description:
        "Nettstedet returnerte en feil under påloggingen. Nettstedet kan ha problemer.",
    },
    navigation_confused: {
      title: "Påloggingen kunne ikke fullføres",
      description:
        "Vi fant ikke frem på dette nettstedet. Det skjer noen ganger med komplekse påloggingsflyter.",
    },
    browser_error: {
      title: "Nettleserfeil",
      description: "Det oppstod et problem med nettleseren. Prøv igjen.",
    },
    session_expired: {
      title: "Økten er utløpt",
      description: "Påloggingsøkten er utløpt. Start en ny pålogging.",
    },
  },
  expiredTitle: "Økten er utløpt",
  expiredDescription: "Denne påloggingsøkten er utløpt. Start en ny økt.",
  externalActionTitle: "Handling kreves",
  externalActionFallbackMessage: "Fullfør bekreftelsen på enheten din",
  externalActionWaiting: "Venter på bekreftelsen din...",
  humanInterventionTitle: "Menneskelig bekreftelse kreves",
  humanInterventionMessage: (site) =>
    `Fullfør kontrollen på ${site} ovenfor, og fortsett deretter. Vi fortsetter påloggingen etterpå.`,
  humanInterventionDone: "Fortsett",
  humanInterventionLiveViewTitle: "Påloggingsnettleser",
  humanInterventionLiveViewUnavailable:
    "Påloggingsnettleseren er ikke tilgjengelig akkurat nå.",
  humanInterventionLiveViewFailed:
    "Kunne ikke koble til påloggingsnettleseren.",
  humanInterventionLiveViewGaveUp:
    "Kunne ikke koble til påloggingsnettleseren. Last inn siden på nytt for å prøve igjen.",
  humanInterventionLiveViewUnsupported:
    "Nettleseren din kan ikke vise påloggingsnettleseren. Prøv en annen nettleser.",
  humanInterventionRetry: "Prøv igjen",
  poweredBy: "Levert av",
};
