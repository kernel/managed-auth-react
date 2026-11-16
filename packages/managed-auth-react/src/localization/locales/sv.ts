import type { Localizer } from "../types";

export const sv: Localizer = {
  primeTitle: (site) => `Logga in på ${site}`,
  primeSubtitle: (site) =>
    `Ange dina inloggningsuppgifter för ${site} för att fortsätta`,
  primeContinueButton: "Fortsätt",
  primeLoadingButton: "Laddar...",
  primeLoadingTitle: "Förbereder säker inloggning",
  primeLoadingSubtitle: "Laddar anslutningsuppgifter...",
  securityEncryption: "Dina inloggningsuppgifter är end-to-end-krypterade",
  securityNoThirdParty: "Delas aldrig med någon, inte heller med någon LLM",
  legalPrefix: "Genom att fortsätta godkänner du Kernels",
  legalPrivacyPolicy: "integritetspolicy",
  legalTermsOfService: "användarvillkor",
  legalConjunction: "och",
  discoveringMessage: "Tar reda på vad inloggningen kräver...",
  waitingForFormMessage: "Väntar på inloggningsformuläret...",
  submittingMessage: "Loggar in...",
  loadingDiscoverySteps: [
    "Går till inloggningssidan...",
    "Analyserar formulärets struktur...",
    "Identifierar obligatoriska fält...",
  ],
  loadingAuthSteps: [
    "Fyller i inloggningsuppgifter...",
    "Skickar inloggningsformuläret...",
    "Verifierar inloggningen...",
  ],
  loadingTimeHint: "Det kan ta 15-30 sekunder...",
  loginTitle: (site) => `Logga in på ${site}`,
  ssoLoginTitle: (provider) => `Logga in med ${provider}`,
  ssoLoginSubtitle: (site) => `för ${site}`,
  mfaSelectTitle: "Välj verifieringsmetod",
  mfaSelectSubtitle: "Välj hur du vill få din verifieringskod",
  signInSelectTitle: "Välj ett alternativ",
  signInSelectSubtitle: "Välj vilket alternativ du vill fortsätta med",
  accountSelectTitle: "Välj ett konto",
  accountSelectSubtitle: "Välj vilket konto du vill fortsätta med",
  submitButton: "Fortsätt",
  submittingButton: "Loggar in...",
  ssoButtonLabel: (provider) => `Logga in med ${provider}`,
  orDivider: "eller",
  passwordShow: "Visa lösenord",
  passwordHide: "Dölj lösenord",
  fieldRejectedNotice:
    "Det sparade värdet godkändes inte. Ange ett nytt för att fortsätta.",
  credentialSafetyNotice:
    "Dina inloggningsuppgifter krypteras och skickas direkt från din webbläsare. De delas aldrig med någon, inte heller med någon LLM.",
  mfaTypeLabels: {
    sms: "Sms",
    call: "Telefonsamtal",
    email: "E-post",
    totp: "Autentiseringsapp",
    push: "Pushnotis",
    password: "Lösenord",
    passkey: "Lösennyckel",
    switch: "Använd en annan metod",
    other: "Annat",
  },
  successTitle: "Du är inloggad",
  successDescription: (site) => `Ditt ${site}-konto är nu anslutet`,
  successCloseHint: "Du kan stänga det här fönstret nu",
  errorTitle: "Inloggningen misslyckades",
  errorGenericMessage:
    "Ett oväntat problem uppstod när vi försökte logga in dig.",
  errorCodeLabel: "Felkod",
  errorShowDetails: "Visa detaljer",
  errorHideDetails: "Dölj detaljer",
  errorCloseHint: "Du kan stänga det här fönstret nu",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Domänen är inte tillåten",
      description:
        "Inloggningen omdirigerades till en domän som inte är konfigurerad. Lägg till den i inställningen allowed_domains.",
    },
    login_form_not_found: {
      title: "Inloggningsformuläret hittades inte",
      description:
        "Vi hittade inget inloggningsformulär på den här sidan. Webbplatsen kan ha ändrat layout, eller så kan inloggningsadressen vara fel.",
    },
    credentials_invalid: {
      title: "Ogiltiga inloggningsuppgifter",
      description: "Webbplatsen godkände inte användarnamnet eller lösenordet.",
    },
    totp_required: {
      title: "Autentiseringskod krävs",
      description: "En kod från en autentiseringsapp krävs.",
    },
    sms_code_required: {
      title: "Sms-kod krävs",
      description: "En kod som skickats via sms krävs.",
    },
    email_code_required: {
      title: "E-postkod krävs",
      description: "En kod som skickats via e-post krävs.",
    },
    account_choice_required: {
      title: "Kontoval krävs",
      description:
        "Ett konto eller en identitet måste väljas innan inloggningen kan fortsätta.",
    },
    customer_input_required: {
      title: "Mer information krävs",
      description: "Mer information behövs innan inloggningen kan fortsätta.",
    },
    external_action_required: {
      title: "Extern åtgärd krävs",
      description:
        "En extern åtgärd krävs för att fortsätta. Se efter om du har fått en verifieringsbegäran i din autentiseringsapp, e-post eller telefon.",
    },
    totp_code_rejected: {
      title: "Autentiseringskoden godkändes inte",
      description:
        "Webbplatsen godkände inte autentiseringskoden. Prova en ny kod, eller anslut kontot igen om genererade koder fortsätter att misslyckas i nya tidsintervall.",
    },
    bot_detected: {
      title: "Verifiering krävs",
      description:
        "Webbplatsen upptäckte automatiserad åtkomst och blockerade inloggningen.",
    },
    captcha_blocked: {
      title: "Verifiering krävs",
      description: "En CAPTCHA blockerade inloggningen.",
    },
    stuck_in_loop: {
      title: "Inloggningen kunde inte slutföras",
      description:
        "Vi fastnade när vi försökte slutföra inloggningen. Det kan hända med ovanliga inloggningsflöden.",
    },
    max_attempts_reached: {
      title: "Inloggningen kunde inte slutföras",
      description: "Vi lyckades inte slutföra inloggningen efter flera försök.",
    },
    website_error: {
      title: "Fel på webbplatsen",
      description:
        "Webbplatsen returnerade ett fel under inloggningen. Webbplatsen kan ha problem just nu.",
    },
    navigation_confused: {
      title: "Inloggningen kunde inte slutföras",
      description:
        "Vi hittade inte rätt på den här webbplatsen. Det händer ibland med komplexa inloggningsflöden.",
    },
    browser_error: {
      title: "Webbläsarfel",
      description: "Det uppstod ett problem med webbläsaren. Försök igen.",
    },
    session_expired: {
      title: "Sessionen har gått ut",
      description: "Inloggningssessionen har gått ut. Starta en ny inloggning.",
    },
  },
  expiredTitle: "Sessionen har gått ut",
  expiredDescription:
    "Den här inloggningssessionen har gått ut. Starta en ny session.",
  externalActionTitle: "Åtgärd krävs",
  externalActionFallbackMessage: "Slutför verifieringen på din enhet",
  externalActionWaiting: "Väntar på din bekräftelse...",
  humanInterventionTitle: "Mänsklig verifiering krävs",
  humanInterventionMessage: (site) =>
    `Slutför kontrollen på ${site} ovan och fortsätt sedan. Vi fortsätter logga in dig efteråt.`,
  humanInterventionDone: "Fortsätt",
  humanInterventionLiveViewTitle: "Inloggningswebbläsare",
  humanInterventionLiveViewUnavailable:
    "Inloggningswebbläsaren är inte tillgänglig just nu.",
  humanInterventionLiveViewFailed:
    "Det gick inte att ansluta till inloggningswebbläsaren.",
  humanInterventionLiveViewGaveUp:
    "Det gick inte att ansluta till inloggningswebbläsaren. Ladda om sidan för att försöka igen.",
  humanInterventionLiveViewUnsupported:
    "Din webbläsare kan inte visa inloggningswebbläsaren. Prova en annan webbläsare.",
  humanInterventionRetry: "Försök igen",
  poweredBy: "Drivs av",
};
