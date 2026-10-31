import type { Localizer } from "../types";

export const de: Localizer = {
  primeTitle: (site) => `Bei ${site} anmelden`,
  primeSubtitle: (site) =>
    `Geben Sie Ihre Zugangsdaten für ${site} ein, um fortzufahren`,
  primeContinueButton: "Weiter",
  primeLoadingButton: "Wird geladen...",
  primeLoadingTitle: "Sichere Anmeldung wird vorbereitet",
  primeLoadingSubtitle: "Verbindungsdetails werden geladen...",
  securityEncryption: "Ihre Zugangsdaten sind Ende-zu-Ende-verschlüsselt",
  securityNoThirdParty: "Niemals an Dritte oder ein LLM weitergegeben",
  legalPrefix: "Indem Sie fortfahren, akzeptieren Sie Kernels",
  legalPrivacyPolicy: "Datenschutzerklärung",
  legalTermsOfService: "Nutzungsbedingungen",
  legalConjunction: "und",
  discoveringMessage: "Anmeldeanforderungen werden ermittelt...",
  waitingForFormMessage: "Warten auf das Anmeldeformular...",
  submittingMessage: "Anmeldung läuft...",
  loadingDiscoverySteps: [
    "Anmeldeseite wird aufgerufen...",
    "Formularaufbau wird analysiert...",
    "Pflichtfelder werden ermittelt...",
  ],
  loadingAuthSteps: [
    "Zugangsdaten werden eingegeben...",
    "Anmeldeformular wird gesendet...",
    "Anmeldung wird überprüft...",
  ],
  loadingTimeHint: "Dies kann 15-30 Sekunden dauern...",
  loginTitle: (site) => `Bei ${site} anmelden`,
  ssoLoginTitle: (provider) => `Mit ${provider} anmelden`,
  ssoLoginSubtitle: (site) => `für ${site}`,
  mfaSelectTitle: "Bestätigungsmethode wählen",
  mfaSelectSubtitle:
    "Wählen Sie, wie Sie Ihren Bestätigungscode erhalten möchten",
  signInSelectTitle: "Option wählen",
  signInSelectSubtitle: "Wählen Sie, mit welcher Option Sie fortfahren möchten",
  accountSelectTitle: "Konto wählen",
  accountSelectSubtitle: "Wählen Sie, mit welchem Konto Sie fortfahren möchten",
  submitButton: "Weiter",
  submittingButton: "Anmeldung läuft...",
  ssoButtonLabel: (provider) => `Mit ${provider} anmelden`,
  orDivider: "oder",
  passwordShow: "Passwort anzeigen",
  passwordHide: "Passwort verbergen",
  fieldRejectedNotice:
    "Der gespeicherte Wert wurde abgelehnt. Geben Sie einen neuen ein, um fortzufahren.",
  credentialSafetyNotice:
    "Ihre Zugangsdaten werden verschlüsselt und direkt von Ihrem Browser gesendet. Sie werden niemals an Dritte oder ein LLM weitergegeben.",
  mfaTypeLabels: {
    sms: "SMS",
    call: "Anruf",
    email: "E-Mail",
    totp: "Authenticator-App",
    push: "Push-Benachrichtigung",
    password: "Passwort",
    passkey: "Passkey",
    switch: "Andere Methode verwenden",
    other: "Andere",
  },
  successTitle: "Erfolgreich angemeldet",
  successDescription: (site) => `Ihr ${site}-Konto ist jetzt verbunden`,
  successCloseHint: "Sie können dieses Fenster jetzt schließen",
  errorTitle: "Anmeldung fehlgeschlagen",
  errorGenericMessage:
    "Bei Ihrer Anmeldung ist ein unerwartetes Problem aufgetreten.",
  errorCodeLabel: "Fehlercode",
  errorShowDetails: "Details anzeigen",
  errorHideDetails: "Details ausblenden",
  errorCloseHint: "Sie können dieses Fenster jetzt schließen",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Domain nicht zulässig",
      description:
        "Der Anmeldevorgang wurde auf eine nicht konfigurierte Domain weitergeleitet. Fügen Sie sie der Einstellung allowed_domains hinzu.",
    },
    login_form_not_found: {
      title: "Anmeldeformular nicht gefunden",
      description:
        "Auf dieser Seite wurde kein Anmeldeformular gefunden. Möglicherweise wurde das Layout der Website geändert oder die Anmelde-URL ist falsch.",
    },
    credentials_invalid: {
      title: "Ungültige Zugangsdaten",
      description:
        "Die Website hat den Benutzernamen oder das Passwort nicht akzeptiert.",
    },
    totp_required: {
      title: "Authenticator-Code erforderlich",
      description: "Ein Authenticator-Code ist erforderlich.",
    },
    sms_code_required: {
      title: "SMS-Code erforderlich",
      description: "Ein per SMS gesendeter Code ist erforderlich.",
    },
    email_code_required: {
      title: "E-Mail-Code erforderlich",
      description: "Ein per E-Mail gesendeter Code ist erforderlich.",
    },
    account_choice_required: {
      title: "Kontoauswahl erforderlich",
      description:
        "Bevor die Anmeldung fortgesetzt werden kann, muss ein Konto oder eine Identität ausgewählt werden.",
    },
    customer_input_required: {
      title: "Weitere Angaben erforderlich",
      description:
        "Bevor die Anmeldung fortgesetzt werden kann, sind weitere Angaben erforderlich.",
    },
    external_action_required: {
      title: "Externe Aktion erforderlich",
      description:
        "Zum Fortfahren ist eine externe Aktion erforderlich. Prüfen Sie Ihre Authenticator-App, Ihre E-Mails oder Ihr Telefon auf eine Bestätigungsanfrage.",
    },
    totp_code_rejected: {
      title: "Authenticator-Code abgelehnt",
      description:
        "Die Website hat den Authenticator-Code abgelehnt. Versuchen Sie es mit einem neuen Code oder verbinden Sie das Konto erneut, wenn generierte Codes auch in neuen Zeitfenstern weiterhin fehlschlagen.",
    },
    bot_detected: {
      title: "Überprüfung erforderlich",
      description:
        "Diese Website hat einen automatisierten Zugriff erkannt und die Anmeldung blockiert.",
    },
    captcha_blocked: {
      title: "Überprüfung erforderlich",
      description: "Ein CAPTCHA hat die Anmeldung blockiert.",
    },
    stuck_in_loop: {
      title: "Anmeldung konnte nicht abgeschlossen werden",
      description:
        "Beim Abschließen der Anmeldung sind wir nicht weitergekommen. Das kann bei ungewöhnlichen Anmeldeabläufen passieren.",
    },
    max_attempts_reached: {
      title: "Anmeldung konnte nicht abgeschlossen werden",
      description:
        "Die Anmeldung konnte auch nach mehreren Versuchen nicht abgeschlossen werden.",
    },
    website_error: {
      title: "Website-Fehler",
      description:
        "Die Website hat während der Anmeldung einen Fehler gemeldet. Möglicherweise hat die Website gerade Probleme.",
    },
    navigation_confused: {
      title: "Anmeldung konnte nicht abgeschlossen werden",
      description:
        "Wir konnten uns auf dieser Website nicht zurechtfinden. Das kommt bei komplexen Anmeldeabläufen manchmal vor.",
    },
    browser_error: {
      title: "Browserfehler",
      description:
        "Es gab ein Problem mit dem Browser. Bitte versuchen Sie es erneut.",
    },
    session_expired: {
      title: "Sitzung abgelaufen",
      description:
        "Die Anmeldesitzung ist abgelaufen. Bitte starten Sie einen neuen Anmeldevorgang.",
    },
  },
  expiredTitle: "Sitzung abgelaufen",
  expiredDescription:
    "Diese Anmeldesitzung ist abgelaufen. Bitte starten Sie eine neue Sitzung.",
  externalActionTitle: "Aktion erforderlich",
  externalActionFallbackMessage:
    "Schließen Sie die Bestätigung auf Ihrem Gerät ab",
  externalActionWaiting: "Warten auf Ihre Bestätigung...",
  humanInterventionTitle: "Menschliche Überprüfung erforderlich",
  humanInterventionMessage: (site) =>
    `Schließen Sie die Prüfung bei ${site} oben ab und fahren Sie dann fort. Anschließend setzen wir Ihre Anmeldung fort.`,
  humanInterventionDone: "Weiter",
  humanInterventionLiveViewTitle: "Anmeldebrowser",
  humanInterventionLiveViewUnavailable:
    "Der Anmeldebrowser ist gerade nicht verfügbar.",
  humanInterventionLiveViewFailed:
    "Verbindung zum Anmeldebrowser fehlgeschlagen.",
  humanInterventionLiveViewGaveUp:
    "Verbindung zum Anmeldebrowser fehlgeschlagen. Laden Sie die Seite neu, um es erneut zu versuchen.",
  humanInterventionLiveViewUnsupported:
    "Ihr Browser kann den Anmeldebrowser nicht anzeigen. Versuchen Sie es mit einem anderen Browser.",
  humanInterventionRetry: "Erneut versuchen",
  poweredBy: "Bereitgestellt von",
};
