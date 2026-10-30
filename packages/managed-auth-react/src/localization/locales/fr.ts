import type { Localizer } from "../types";

export const fr: Localizer = {
  primeTitle: (site) => `Se connecter à ${site}`,
  primeSubtitle: (site) => `Saisissez vos identifiants ${site} pour continuer`,
  primeContinueButton: "Continuer",
  primeLoadingButton: "Chargement...",
  primeLoadingTitle: "Préparation de la connexion sécurisée",
  primeLoadingSubtitle: "Chargement des détails de connexion...",
  securityEncryption: "Vos identifiants sont chiffrés de bout en bout",
  securityNoThirdParty: "Jamais partagés avec qui que ce soit ni avec un LLM",
  legalPrefix: "En continuant, vous acceptez la",
  legalPrivacyPolicy: "Politique de confidentialité",
  legalTermsOfService: "Conditions d’utilisation de Kernel",
  legalConjunction: "et les",
  discoveringMessage: "Analyse des exigences de connexion...",
  waitingForFormMessage: "En attente du formulaire de connexion...",
  submittingMessage: "Connexion en cours...",
  loadingDiscoverySteps: [
    "Accès à la page de connexion...",
    "Analyse de la structure du formulaire...",
    "Identification des champs requis...",
  ],
  loadingAuthSteps: [
    "Saisie des identifiants...",
    "Envoi du formulaire de connexion...",
    "Vérification de l’authentification...",
  ],
  loadingTimeHint: "Cela peut prendre 15 à 30 secondes...",
  loginTitle: (site) => `Se connecter à ${site}`,
  ssoLoginTitle: (provider) => `Se connecter avec ${provider}`,
  ssoLoginSubtitle: (site) => `pour ${site}`,
  mfaSelectTitle: "Choisissez une méthode de vérification",
  mfaSelectSubtitle: "Choisissez comment recevoir votre code de vérification",
  signInSelectTitle: "Choisissez une option",
  signInSelectSubtitle: "Choisissez l’option avec laquelle continuer",
  accountSelectTitle: "Choisissez un compte",
  accountSelectSubtitle: "Choisissez le compte avec lequel continuer",
  submitButton: "Continuer",
  submittingButton: "Connexion en cours...",
  ssoButtonLabel: (provider) => `Se connecter avec ${provider}`,
  orDivider: "ou",
  passwordShow: "Afficher le mot de passe",
  passwordHide: "Masquer le mot de passe",
  fieldRejectedNotice:
    "La valeur enregistrée a été refusée. Saisissez-en une nouvelle pour continuer.",
  credentialSafetyNotice:
    "Vos identifiants sont chiffrés et envoyés directement depuis votre navigateur. Ils ne sont jamais partagés avec qui que ce soit ni avec un LLM.",
  mfaTypeLabels: {
    sms: "SMS",
    call: "Appel téléphonique",
    email: "E-mail",
    totp: "Application d’authentification",
    push: "Notification push",
    password: "Mot de passe",
    passkey: "Clé d’accès",
    switch: "Utiliser une autre méthode",
    other: "Autre",
  },
  successTitle: "Connexion réussie",
  successDescription: (site) => `Votre compte ${site} est maintenant connecté`,
  successCloseHint: "Vous pouvez maintenant fermer cette fenêtre",
  errorTitle: "Échec de la connexion",
  errorGenericMessage:
    "Un problème inattendu est survenu lors de votre connexion.",
  errorCodeLabel: "Code d’erreur",
  errorShowDetails: "Afficher les détails",
  errorHideDetails: "Masquer les détails",
  errorCloseHint: "Vous pouvez maintenant fermer cette fenêtre",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Domaine non autorisé",
      description:
        "La connexion a redirigé vers un domaine non configuré. Ajoutez-le au paramètre allowed_domains.",
    },
    login_form_not_found: {
      title: "Formulaire de connexion introuvable",
      description:
        "Aucun formulaire de connexion n’a été trouvé sur cette page. Le site a peut-être changé de mise en page, ou l’URL de connexion est peut-être incorrecte.",
    },
    credentials_invalid: {
      title: "Identifiants invalides",
      description:
        "Le site n’a pas accepté le nom d’utilisateur ou le mot de passe.",
    },
    totp_required: {
      title: "Code d’authentification requis",
      description: "Un code d’application d’authentification est requis.",
    },
    sms_code_required: {
      title: "Code SMS requis",
      description: "Un code envoyé par SMS est requis.",
    },
    email_code_required: {
      title: "Code e-mail requis",
      description: "Un code envoyé par e-mail est requis.",
    },
    account_choice_required: {
      title: "Sélection du compte requise",
      description:
        "Un compte ou une identité doit être sélectionné avant de poursuivre la connexion.",
    },
    customer_input_required: {
      title: "Informations supplémentaires requises",
      description:
        "Des informations supplémentaires sont nécessaires avant de poursuivre la connexion.",
    },
    external_action_required: {
      title: "Action externe requise",
      description:
        "Une action externe est nécessaire pour continuer. Vérifiez votre application d’authentification, vos e-mails ou votre téléphone pour une demande de vérification.",
    },
    totp_code_rejected: {
      title: "Code d’authentification refusé",
      description:
        "Le site a refusé le code d’authentification. Essayez un nouveau code, ou reconnectez le compte si les codes générés continuent d’échouer sur plusieurs périodes.",
    },
    bot_detected: {
      title: "Vérification requise",
      description:
        "Ce site a détecté un accès automatisé et a bloqué la connexion.",
    },
    captcha_blocked: {
      title: "Vérification requise",
      description: "Un CAPTCHA a bloqué la connexion.",
    },
    stuck_in_loop: {
      title: "La connexion n’a pas pu aboutir",
      description:
        "Nous sommes restés bloqués en essayant de finaliser la connexion. Cela peut arriver avec des processus de connexion inhabituels.",
    },
    max_attempts_reached: {
      title: "La connexion n’a pas pu aboutir",
      description:
        "Nous n’avons pas pu finaliser la connexion après plusieurs tentatives.",
    },
    website_error: {
      title: "Erreur du site",
      description:
        "Le site a renvoyé une erreur pendant la connexion. Il rencontre peut-être des problèmes.",
    },
    navigation_confused: {
      title: "La connexion n’a pas pu aboutir",
      description:
        "Nous n’avons pas réussi à naviguer sur ce site. Cela arrive parfois avec des processus de connexion complexes.",
    },
    browser_error: {
      title: "Erreur du navigateur",
      description:
        "Un problème est survenu avec le navigateur. Veuillez réessayer.",
    },
    session_expired: {
      title: "Session expirée",
      description:
        "La session de connexion a expiré. Veuillez recommencer la connexion.",
    },
  },
  expiredTitle: "Session expirée",
  expiredDescription:
    "Cette session d’authentification a expiré. Veuillez démarrer une nouvelle session.",
  externalActionTitle: "Action requise",
  externalActionFallbackMessage: "Terminez la vérification sur votre appareil",
  externalActionWaiting: "En attente de votre confirmation...",
  humanInterventionTitle: "Vérification humaine requise",
  humanInterventionMessage: (site) =>
    `Effectuez la vérification de ${site} ci-dessus, puis continuez. Nous reprendrons ensuite votre connexion.`,
  humanInterventionDone: "Continuer",
  humanInterventionLiveViewTitle: "Navigateur de connexion",
  humanInterventionLiveViewUnavailable:
    "Le navigateur de connexion n’est pas disponible pour le moment.",
  humanInterventionLiveViewFailed:
    "Impossible de se connecter au navigateur de connexion.",
  humanInterventionLiveViewGaveUp:
    "Impossible de se connecter au navigateur de connexion. Rechargez cette page pour réessayer.",
  humanInterventionLiveViewUnsupported:
    "Votre navigateur ne peut pas afficher le navigateur de connexion. Essayez un autre navigateur.",
  humanInterventionRetry: "Réessayer",
  poweredBy: "Propulsé par",
};
