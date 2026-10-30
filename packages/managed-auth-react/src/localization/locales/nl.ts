import type { Localizer } from "../types";

export const nl: Localizer = {
  primeTitle: (site) => `Inloggen bij ${site}`,
  primeSubtitle: (site) =>
    `Voer je inloggegevens voor ${site} in om verder te gaan`,
  primeContinueButton: "Doorgaan",
  primeLoadingButton: "Laden...",
  primeLoadingTitle: "Veilig inloggen voorbereiden",
  primeLoadingSubtitle: "Verbindingsgegevens laden...",
  securityEncryption: "Je inloggegevens zijn end-to-end versleuteld",
  securityNoThirdParty: "Nooit gedeeld met iemand of met een LLM",
  legalPrefix: "Door verder te gaan, ga je akkoord met het",
  legalPrivacyPolicy: "Privacybeleid",
  legalTermsOfService: "Servicevoorwaarden van Kernel",
  legalConjunction: "en de",
  discoveringMessage: "Inlogvereisten bepalen...",
  waitingForFormMessage: "Wachten op inlogformulier...",
  submittingMessage: "Inloggen...",
  loadingDiscoverySteps: [
    "Naar de inlogpagina gaan...",
    "Formulierstructuur analyseren...",
    "Verplichte velden bepalen...",
  ],
  loadingAuthSteps: [
    "Inloggegevens invoeren...",
    "Inlogformulier verzenden...",
    "Authenticatie controleren...",
  ],
  loadingTimeHint: "Dit kan 15-30 seconden duren...",
  loginTitle: (site) => `Inloggen bij ${site}`,
  ssoLoginTitle: (provider) => `Inloggen met ${provider}`,
  ssoLoginSubtitle: (site) => `voor ${site}`,
  mfaSelectTitle: "Kies een verificatiemethode",
  mfaSelectSubtitle: "Kies hoe je je verificatiecode wilt ontvangen",
  signInSelectTitle: "Kies een optie",
  signInSelectSubtitle: "Kies met welke optie je verder wilt gaan",
  accountSelectTitle: "Kies een account",
  accountSelectSubtitle: "Kies met welk account je verder wilt gaan",
  submitButton: "Doorgaan",
  submittingButton: "Inloggen...",
  ssoButtonLabel: (provider) => `Inloggen met ${provider}`,
  orDivider: "of",
  passwordShow: "Wachtwoord tonen",
  passwordHide: "Wachtwoord verbergen",
  fieldRejectedNotice:
    "De opgeslagen waarde is geweigerd. Voer een nieuwe in om verder te gaan.",
  credentialSafetyNotice:
    "Je inloggegevens worden versleuteld en rechtstreeks vanuit je browser verzonden. Ze worden nooit gedeeld met iemand of met een LLM.",
  mfaTypeLabels: {
    sms: "Sms",
    call: "Telefoongesprek",
    email: "E-mail",
    totp: "Authenticator-app",
    push: "Pushmelding",
    password: "Wachtwoord",
    passkey: "Passkey",
    switch: "Andere methode gebruiken",
    other: "Overig",
  },
  successTitle: "Ingelogd",
  successDescription: (site) => `Je ${site}-account is nu gekoppeld`,
  successCloseHint: "Je kunt dit venster nu sluiten",
  errorTitle: "Inloggen mislukt",
  errorGenericMessage:
    "Er is een onverwacht probleem opgetreden bij het inloggen.",
  errorCodeLabel: "Foutcode",
  errorShowDetails: "Details tonen",
  errorHideDetails: "Details verbergen",
  errorCloseHint: "Je kunt dit venster nu sluiten",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Domein niet toegestaan",
      description:
        "Het inloggen is doorgestuurd naar een domein dat niet is geconfigureerd. Voeg het toe aan de instelling allowed_domains.",
    },
    login_form_not_found: {
      title: "Inlogformulier niet gevonden",
      description:
        "We konden geen inlogformulier vinden op deze pagina. Mogelijk is de indeling van de website gewijzigd of klopt de inlog-URL niet.",
    },
    credentials_invalid: {
      title: "Ongeldige inloggegevens",
      description:
        "De website heeft de gebruikersnaam of het wachtwoord niet geaccepteerd.",
    },
    totp_required: {
      title: "Authenticatorcode vereist",
      description: "Er is een code uit een authenticator-app vereist.",
    },
    sms_code_required: {
      title: "Sms-code vereist",
      description: "Er is een code vereist die per sms is verzonden.",
    },
    email_code_required: {
      title: "E-mailcode vereist",
      description: "Er is een code vereist die per e-mail is verzonden.",
    },
    account_choice_required: {
      title: "Accountkeuze vereist",
      description:
        "Er moet een account of identiteit worden gekozen voordat het inloggen verder kan gaan.",
    },
    customer_input_required: {
      title: "Aanvullende gegevens vereist",
      description:
        "Er zijn aanvullende gegevens nodig voordat het inloggen verder kan gaan.",
    },
    external_action_required: {
      title: "Externe actie vereist",
      description:
        "Er is een externe actie nodig om verder te gaan. Controleer je authenticator-app, e-mail of telefoon op een verificatieverzoek.",
    },
    totp_code_rejected: {
      title: "Authenticatorcode geweigerd",
      description:
        "De website heeft de authenticatorcode geweigerd. Probeer een nieuwe code, of koppel het account opnieuw als gegenereerde codes ook in nieuwe tijdvensters blijven mislukken.",
    },
    bot_detected: {
      title: "Verificatie vereist",
      description:
        "Deze website heeft geautomatiseerde toegang gedetecteerd en het inloggen geblokkeerd.",
    },
    captcha_blocked: {
      title: "Verificatie vereist",
      description: "Een CAPTCHA heeft het inloggen geblokkeerd.",
    },
    stuck_in_loop: {
      title: "Inloggen kon niet worden voltooid",
      description:
        "We liepen vast bij het voltooien van het inloggen. Dit kan gebeuren bij ongebruikelijke inlogprocessen.",
    },
    max_attempts_reached: {
      title: "Inloggen kon niet worden voltooid",
      description:
        "Het is ons na meerdere pogingen niet gelukt om in te loggen.",
    },
    website_error: {
      title: "Websitefout",
      description:
        "De website gaf een fout tijdens het inloggen. Mogelijk heeft de website problemen.",
    },
    navigation_confused: {
      title: "Inloggen kon niet worden voltooid",
      description:
        "We konden onze weg niet vinden op deze website. Dit gebeurt soms bij complexe inlogprocessen.",
    },
    browser_error: {
      title: "Browserfout",
      description:
        "Er is een probleem met de browser opgetreden. Probeer het opnieuw.",
    },
    session_expired: {
      title: "Sessie verlopen",
      description: "De inlogsessie is verlopen. Begin opnieuw met inloggen.",
    },
  },
  expiredTitle: "Sessie verlopen",
  expiredDescription:
    "Deze verificatiesessie is verlopen. Start een nieuwe sessie.",
  externalActionTitle: "Actie vereist",
  externalActionFallbackMessage: "Voltooi de verificatie op je apparaat",
  externalActionWaiting: "Wachten op je bevestiging...",
  humanInterventionTitle: "Menselijke verificatie vereist",
  humanInterventionMessage: (site) =>
    `Voltooi de controle van ${site} hierboven en ga daarna verder. Daarna gaan we verder met inloggen.`,
  humanInterventionDone: "Doorgaan",
  humanInterventionLiveViewTitle: "Inlogbrowser",
  humanInterventionLiveViewUnavailable:
    "De inlogbrowser is op dit moment niet beschikbaar.",
  humanInterventionLiveViewFailed:
    "Kan geen verbinding maken met de inlogbrowser.",
  humanInterventionLiveViewGaveUp:
    "Kan geen verbinding maken met de inlogbrowser. Laad deze pagina opnieuw om het nog eens te proberen.",
  humanInterventionLiveViewUnsupported:
    "Je browser kan de inlogbrowser niet weergeven. Probeer een andere browser.",
  humanInterventionRetry: "Opnieuw proberen",
  poweredBy: "Mogelijk gemaakt door",
};
