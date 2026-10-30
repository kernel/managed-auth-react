import type { Localizer } from "../types";

export const es: Localizer = {
  primeTitle: (site) => `Inicia sesión en ${site}`,
  primeSubtitle: (site) =>
    `Introduce tus credenciales de ${site} para continuar`,
  primeContinueButton: "Continuar",
  primeLoadingButton: "Cargando...",
  primeLoadingTitle: "Preparando el inicio de sesión seguro",
  primeLoadingSubtitle: "Cargando los detalles de la conexión...",
  securityEncryption: "Tus credenciales están cifradas de extremo a extremo",
  securityNoThirdParty: "Nunca se comparten con nadie ni con ningún LLM",
  legalPrefix: "Al continuar, aceptas la",
  legalPrivacyPolicy: "Política de privacidad",
  legalTermsOfService: "Términos del servicio de Kernel",
  legalConjunction: "y los",
  discoveringMessage: "Detectando los requisitos de inicio de sesión...",
  waitingForFormMessage: "Esperando el formulario de inicio de sesión...",
  submittingMessage: "Iniciando sesión...",
  loadingDiscoverySteps: [
    "Accediendo a la página de inicio de sesión...",
    "Analizando la estructura del formulario...",
    "Identificando los campos obligatorios...",
  ],
  loadingAuthSteps: [
    "Introduciendo las credenciales...",
    "Enviando el formulario de inicio de sesión...",
    "Verificando la autenticación...",
  ],
  loadingTimeHint: "Esto puede tardar entre 15 y 30 segundos...",
  loginTitle: (site) => `Inicia sesión en ${site}`,
  ssoLoginTitle: (provider) => `Inicia sesión con ${provider}`,
  ssoLoginSubtitle: (site) => `para ${site}`,
  mfaSelectTitle: "Elige un método de verificación",
  mfaSelectSubtitle:
    "Selecciona cómo quieres recibir tu código de verificación",
  signInSelectTitle: "Elige una opción",
  signInSelectSubtitle: "Selecciona con qué opción quieres continuar",
  accountSelectTitle: "Elige una cuenta",
  accountSelectSubtitle: "Selecciona con qué cuenta quieres continuar",
  submitButton: "Continuar",
  submittingButton: "Iniciando sesión...",
  ssoButtonLabel: (provider) => `Iniciar sesión con ${provider}`,
  orDivider: "o",
  passwordShow: "Mostrar contraseña",
  passwordHide: "Ocultar contraseña",
  fieldRejectedNotice:
    "Se ha rechazado el valor guardado. Introduce uno nuevo para continuar.",
  credentialSafetyNotice:
    "Tus credenciales se cifran y se envían directamente desde tu navegador. Nunca se comparten con nadie ni con ningún LLM.",
  mfaTypeLabels: {
    sms: "SMS",
    call: "Llamada telefónica",
    email: "Correo electrónico",
    totp: "App de autenticación",
    push: "Notificación push",
    password: "Contraseña",
    passkey: "Llave de acceso",
    switch: "Usar otro método",
    other: "Otro",
  },
  successTitle: "Has iniciado sesión correctamente",
  successDescription: (site) => `Tu cuenta de ${site} ya está conectada`,
  successCloseHint: "Ya puedes cerrar esta ventana",
  errorTitle: "No se ha podido iniciar sesión",
  errorGenericMessage:
    "Se ha producido un problema inesperado al intentar iniciar tu sesión.",
  errorCodeLabel: "Código de error",
  errorShowDetails: "Mostrar detalles",
  errorHideDetails: "Ocultar detalles",
  errorCloseHint: "Ya puedes cerrar esta ventana",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Dominio no permitido",
      description:
        "El inicio de sesión redirigió a un dominio que no está configurado. Añádelo a la opción allowed_domains.",
    },
    login_form_not_found: {
      title: "No se encontró el formulario de inicio de sesión",
      description:
        "No hemos encontrado ningún formulario de inicio de sesión en esta página. Es posible que el sitio web haya cambiado su diseño o que la URL de inicio de sesión no sea correcta.",
    },
    credentials_invalid: {
      title: "Credenciales no válidas",
      description:
        "El sitio web no aceptó el nombre de usuario o la contraseña.",
    },
    totp_required: {
      title: "Se requiere un código de autenticación",
      description: "Se requiere un código de la app de autenticación.",
    },
    sms_code_required: {
      title: "Se requiere un código SMS",
      description: "Se requiere un código enviado por SMS.",
    },
    email_code_required: {
      title: "Se requiere un código por correo",
      description: "Se requiere un código enviado por correo electrónico.",
    },
    account_choice_required: {
      title: "Se requiere seleccionar una cuenta",
      description:
        "Hay que seleccionar una cuenta o identidad para continuar con el inicio de sesión.",
    },
    customer_input_required: {
      title: "Se requiere información adicional",
      description:
        "Se necesita información adicional para continuar con el inicio de sesión.",
    },
    external_action_required: {
      title: "Se requiere una acción externa",
      description:
        "Se necesita una acción externa para continuar. Revisa tu app de autenticación, tu correo o tu teléfono por si tienes una solicitud de verificación.",
    },
    totp_code_rejected: {
      title: "Código de autenticación rechazado",
      description:
        "El sitio web rechazó el código de autenticación. Prueba con un código nuevo o vuelve a conectar la cuenta si los códigos generados siguen fallando en distintos intervalos.",
    },
    bot_detected: {
      title: "Se requiere verificación",
      description:
        "Este sitio web detectó un acceso automatizado y bloqueó el inicio de sesión.",
    },
    captcha_blocked: {
      title: "Se requiere verificación",
      description: "Un CAPTCHA bloqueó el inicio de sesión.",
    },
    stuck_in_loop: {
      title: "No se pudo completar el inicio de sesión",
      description:
        "Nos hemos quedado atascados al intentar completar el inicio de sesión. Puede ocurrir con procesos de inicio de sesión poco habituales.",
    },
    max_attempts_reached: {
      title: "No se pudo completar el inicio de sesión",
      description:
        "No hemos podido completar el inicio de sesión tras varios intentos.",
    },
    website_error: {
      title: "Error del sitio web",
      description:
        "El sitio web devolvió un error durante el inicio de sesión. Puede que esté teniendo problemas.",
    },
    navigation_confused: {
      title: "No se pudo completar el inicio de sesión",
      description:
        "No hemos conseguido navegar correctamente por este sitio web. A veces ocurre con procesos de inicio de sesión complejos.",
    },
    browser_error: {
      title: "Error del navegador",
      description:
        "Se ha producido un problema con el navegador. Inténtalo de nuevo.",
    },
    session_expired: {
      title: "Sesión caducada",
      description:
        "La sesión de inicio de sesión ha caducado. Vuelve a iniciar el proceso.",
    },
  },
  expiredTitle: "Sesión caducada",
  expiredDescription:
    "Esta sesión de autenticación ha caducado. Inicia una nueva sesión.",
  externalActionTitle: "Acción necesaria",
  externalActionFallbackMessage: "Completa la verificación en tu dispositivo",
  externalActionWaiting: "Esperando tu confirmación...",
  humanInterventionTitle: "Se requiere verificación humana",
  humanInterventionMessage: (site) =>
    `Completa la comprobación de ${site} que aparece arriba y luego continúa. Después seguiremos con tu inicio de sesión.`,
  humanInterventionDone: "Continuar",
  humanInterventionLiveViewTitle: "Navegador de inicio de sesión",
  humanInterventionLiveViewUnavailable:
    "El navegador de inicio de sesión no está disponible en este momento.",
  humanInterventionLiveViewFailed:
    "No se ha podido conectar con el navegador de inicio de sesión.",
  humanInterventionLiveViewGaveUp:
    "No se ha podido conectar con el navegador de inicio de sesión. Vuelve a cargar esta página para intentarlo de nuevo.",
  humanInterventionLiveViewUnsupported:
    "Tu navegador no puede mostrar el navegador de inicio de sesión. Prueba con otro navegador.",
  humanInterventionRetry: "Reintentar",
  poweredBy: "Con la tecnología de",
};
