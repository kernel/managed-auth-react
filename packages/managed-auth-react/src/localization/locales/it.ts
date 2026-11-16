import type { Localizer } from "../types";

export const it: Localizer = {
  primeTitle: (site) => `Accedi a ${site}`,
  primeSubtitle: (site) =>
    `Inserisci le tue credenziali di ${site} per continuare`,
  primeContinueButton: "Continua",
  primeLoadingButton: "Caricamento...",
  primeLoadingTitle: "Preparazione dell'accesso sicuro",
  primeLoadingSubtitle: "Caricamento dei dettagli di connessione...",
  securityEncryption: "Le tue credenziali sono crittografate end-to-end",
  securityNoThirdParty: "Mai condivise con nessuno né con alcun LLM",
  legalPrefix: "Continuando accetti i documenti di Kernel:",
  legalPrivacyPolicy: "Informativa sulla privacy",
  legalTermsOfService: "Termini di servizio",
  legalConjunction: "e",
  discoveringMessage: "Rilevamento dei requisiti di accesso...",
  waitingForFormMessage: "In attesa del modulo di accesso...",
  submittingMessage: "Accesso in corso...",
  loadingDiscoverySteps: [
    "Apertura della pagina di accesso...",
    "Analisi della struttura del modulo...",
    "Individuazione dei campi obbligatori...",
  ],
  loadingAuthSteps: [
    "Inserimento delle credenziali...",
    "Invio del modulo di accesso...",
    "Verifica dell'autenticazione...",
  ],
  loadingTimeHint: "Potrebbero volerci 15-30 secondi...",
  loginTitle: (site) => `Accedi a ${site}`,
  ssoLoginTitle: (provider) => `Accedi con ${provider}`,
  ssoLoginSubtitle: (site) => `per ${site}`,
  mfaSelectTitle: "Scegli un metodo di verifica",
  mfaSelectSubtitle: "Seleziona come vuoi ricevere il codice di verifica",
  signInSelectTitle: "Scegli un'opzione",
  signInSelectSubtitle: "Seleziona l'opzione con cui continuare",
  accountSelectTitle: "Scegli un account",
  accountSelectSubtitle: "Seleziona l'account con cui continuare",
  submitButton: "Continua",
  submittingButton: "Accesso in corso...",
  ssoButtonLabel: (provider) => `Accedi con ${provider}`,
  orDivider: "oppure",
  passwordShow: "Mostra password",
  passwordHide: "Nascondi password",
  fieldRejectedNotice:
    "Il valore salvato è stato rifiutato. Inseriscine uno nuovo per continuare.",
  credentialSafetyNotice:
    "Le tue credenziali sono crittografate e inviate direttamente dal tuo browser. Non vengono mai condivise con nessuno né con alcun LLM.",
  mfaTypeLabels: {
    sms: "SMS",
    call: "Chiamata",
    email: "Email",
    totp: "App di autenticazione",
    push: "Notifica push",
    password: "Password",
    passkey: "Passkey",
    switch: "Usa un altro metodo",
    other: "Altro",
  },
  successTitle: "Accesso effettuato",
  successDescription: (site) => `Il tuo account ${site} è ora collegato`,
  successCloseHint: "Ora puoi chiudere questa finestra",
  errorTitle: "Accesso non riuscito",
  errorGenericMessage:
    "Si è verificato un problema imprevisto durante l'accesso.",
  errorCodeLabel: "Codice errore",
  errorShowDetails: "Mostra dettagli",
  errorHideDetails: "Nascondi dettagli",
  errorCloseHint: "Ora puoi chiudere questa finestra",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Dominio non consentito",
      description:
        "L'accesso ha reindirizzato a un dominio non configurato. Aggiungilo all'impostazione allowed_domains.",
    },
    login_form_not_found: {
      title: "Modulo di accesso non trovato",
      description:
        "Non abbiamo trovato un modulo di accesso in questa pagina. Il sito potrebbe aver cambiato layout, oppure l'URL di accesso potrebbe essere errato.",
    },
    credentials_invalid: {
      title: "Credenziali non valide",
      description: "Il sito non ha accettato il nome utente o la password.",
    },
    totp_required: {
      title: "Codice di autenticazione richiesto",
      description: "È richiesto un codice dell'app di autenticazione.",
    },
    sms_code_required: {
      title: "Codice SMS richiesto",
      description: "È richiesto un codice inviato via SMS.",
    },
    email_code_required: {
      title: "Codice email richiesto",
      description: "È richiesto un codice inviato via email.",
    },
    account_choice_required: {
      title: "Selezione dell'account richiesta",
      description:
        "Per continuare l'accesso è necessario selezionare un account o un'identità.",
    },
    customer_input_required: {
      title: "Informazioni aggiuntive richieste",
      description:
        "Per continuare l'accesso sono necessarie altre informazioni.",
    },
    external_action_required: {
      title: "Azione esterna richiesta",
      description:
        "Per continuare è necessaria un'azione esterna. Controlla l'app di autenticazione, l'email o il telefono per una richiesta di verifica.",
    },
    totp_code_rejected: {
      title: "Codice di autenticazione rifiutato",
      description:
        "Il sito ha rifiutato il codice di autenticazione. Prova con un codice nuovo, oppure ricollega l'account se i codici generati continuano a non funzionare anche in intervalli diversi.",
    },
    bot_detected: {
      title: "Verifica richiesta",
      description:
        "Questo sito ha rilevato un accesso automatizzato e lo ha bloccato.",
    },
    captcha_blocked: {
      title: "Verifica richiesta",
      description: "Un CAPTCHA ha bloccato l'accesso.",
    },
    stuck_in_loop: {
      title: "Impossibile completare l'accesso",
      description:
        "Ci siamo bloccati mentre cercavamo di completare l'accesso. Può succedere con procedure di accesso insolite.",
    },
    max_attempts_reached: {
      title: "Impossibile completare l'accesso",
      description:
        "Non siamo riusciti a completare l'accesso dopo diversi tentativi.",
    },
    website_error: {
      title: "Errore del sito",
      description:
        "Il sito ha restituito un errore durante l'accesso. Potrebbe avere dei problemi.",
    },
    navigation_confused: {
      title: "Impossibile completare l'accesso",
      description:
        "Non siamo riusciti a orientarci in questo sito. A volte succede con procedure di accesso complesse.",
    },
    browser_error: {
      title: "Errore del browser",
      description: "Si è verificato un problema con il browser. Riprova.",
    },
    session_expired: {
      title: "Sessione scaduta",
      description: "La sessione di accesso è scaduta. Ricomincia l'accesso.",
    },
  },
  expiredTitle: "Sessione scaduta",
  expiredDescription:
    "Questa sessione di autenticazione è scaduta. Avvia una nuova sessione.",
  externalActionTitle: "Azione richiesta",
  externalActionFallbackMessage: "Completa la verifica sul tuo dispositivo",
  externalActionWaiting: "In attesa della tua conferma...",
  humanInterventionTitle: "Verifica umana richiesta",
  humanInterventionMessage: (site) =>
    `Completa la verifica di ${site} qui sopra, poi continua. Dopo riprenderemo il tuo accesso.`,
  humanInterventionDone: "Continua",
  humanInterventionLiveViewTitle: "Browser di accesso",
  humanInterventionLiveViewUnavailable:
    "Il browser di accesso non è disponibile al momento.",
  humanInterventionLiveViewFailed:
    "Impossibile connettersi al browser di accesso.",
  humanInterventionLiveViewGaveUp:
    "Impossibile connettersi al browser di accesso. Ricarica la pagina per riprovare.",
  humanInterventionLiveViewUnsupported:
    "Il tuo browser non può mostrare il browser di accesso. Prova con un altro browser.",
  humanInterventionRetry: "Riprova",
  poweredBy: "Con tecnologia",
};
