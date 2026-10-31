import type { Localizer } from "../types";

export const pl: Localizer = {
  primeTitle: (site) => `Zaloguj się do serwisu ${site}`,
  primeSubtitle: (site) =>
    `Podaj dane logowania do serwisu ${site}, aby kontynuować`,
  primeContinueButton: "Dalej",
  primeLoadingButton: "Ładowanie...",
  primeLoadingTitle: "Przygotowywanie bezpiecznego logowania",
  primeLoadingSubtitle: "Ładowanie szczegółów połączenia...",
  securityEncryption: "Twoje dane logowania są szyfrowane metodą end-to-end",
  securityNoThirdParty: "Nigdy nie są nikomu udostępniane, w tym żadnemu LLM",
  legalPrefix: "Kontynuując, akceptujesz dokumenty Kernel:",
  legalPrivacyPolicy: "Politykę prywatności",
  legalTermsOfService: "Warunki korzystania z usługi",
  legalConjunction: "oraz",
  discoveringMessage: "Ustalanie wymagań logowania...",
  waitingForFormMessage: "Oczekiwanie na formularz logowania...",
  submittingMessage: "Logowanie...",
  loadingDiscoverySteps: [
    "Przechodzenie do strony logowania...",
    "Analizowanie struktury formularza...",
    "Rozpoznawanie wymaganych pól...",
  ],
  loadingAuthSteps: [
    "Wpisywanie danych logowania...",
    "Wysyłanie formularza logowania...",
    "Weryfikowanie logowania...",
  ],
  loadingTimeHint: "Może to potrwać 15-30 sekund...",
  loginTitle: (site) => `Zaloguj się do serwisu ${site}`,
  ssoLoginTitle: (provider) => `Zaloguj się przez ${provider}`,
  ssoLoginSubtitle: (site) => `w serwisie ${site}`,
  mfaSelectTitle: "Wybierz metodę weryfikacji",
  mfaSelectSubtitle: "Wybierz, jak chcesz otrzymać kod weryfikacyjny",
  signInSelectTitle: "Wybierz opcję",
  signInSelectSubtitle: "Wybierz opcję, aby kontynuować",
  accountSelectTitle: "Wybierz konto",
  accountSelectSubtitle: "Wybierz konto, aby kontynuować",
  submitButton: "Dalej",
  submittingButton: "Logowanie...",
  ssoButtonLabel: (provider) => `Zaloguj się przez ${provider}`,
  orDivider: "lub",
  passwordShow: "Pokaż hasło",
  passwordHide: "Ukryj hasło",
  fieldRejectedNotice:
    "Zapisana wartość została odrzucona. Wpisz nową, aby kontynuować.",
  credentialSafetyNotice:
    "Twoje dane logowania są szyfrowane i wysyłane bezpośrednio z Twojej przeglądarki. Nigdy nie są nikomu udostępniane, w tym żadnemu LLM.",
  mfaTypeLabels: {
    sms: "SMS",
    call: "Połączenie telefoniczne",
    email: "E-mail",
    totp: "Aplikacja uwierzytelniająca",
    push: "Powiadomienie push",
    password: "Hasło",
    passkey: "Klucz dostępu",
    switch: "Użyj innej metody",
    other: "Inne",
  },
  successTitle: "Zalogowano",
  successDescription: (site) =>
    `Twoje konto w serwisie ${site} jest teraz połączone`,
  successCloseHint: "Możesz już zamknąć to okno",
  errorTitle: "Logowanie nie powiodło się",
  errorGenericMessage: "Podczas logowania wystąpił nieoczekiwany problem.",
  errorCodeLabel: "Kod błędu",
  errorShowDetails: "Pokaż szczegóły",
  errorHideDetails: "Ukryj szczegóły",
  errorCloseHint: "Możesz już zamknąć to okno",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Niedozwolona domena",
      description:
        "Logowanie przekierowało do domeny, która nie jest skonfigurowana. Dodaj ją do ustawienia allowed_domains.",
    },
    login_form_not_found: {
      title: "Nie znaleziono formularza logowania",
      description:
        "Na tej stronie nie znaleźliśmy formularza logowania. Układ strony mógł się zmienić albo adres logowania może być nieprawidłowy.",
    },
    credentials_invalid: {
      title: "Nieprawidłowe dane logowania",
      description: "Strona nie zaakceptowała nazwy użytkownika lub hasła.",
    },
    totp_required: {
      title: "Wymagany kod uwierzytelniający",
      description: "Wymagany jest kod z aplikacji uwierzytelniającej.",
    },
    sms_code_required: {
      title: "Wymagany kod SMS",
      description: "Wymagany jest kod wysłany SMS-em.",
    },
    email_code_required: {
      title: "Wymagany kod z e-maila",
      description: "Wymagany jest kod wysłany e-mailem.",
    },
    account_choice_required: {
      title: "Wymagany wybór konta",
      description:
        "Przed kontynuowaniem logowania trzeba wybrać konto lub tożsamość.",
    },
    customer_input_required: {
      title: "Wymagane dodatkowe informacje",
      description:
        "Przed kontynuowaniem logowania potrzebne są dodatkowe informacje.",
    },
    external_action_required: {
      title: "Wymagane działanie zewnętrzne",
      description:
        "Aby kontynuować, wymagane jest działanie zewnętrzne. Sprawdź, czy w aplikacji uwierzytelniającej, poczcie e-mail lub telefonie czeka prośba o weryfikację.",
    },
    totp_code_rejected: {
      title: "Kod uwierzytelniający odrzucony",
      description:
        "Strona odrzuciła kod uwierzytelniający. Spróbuj nowego kodu albo połącz konto ponownie, jeśli wygenerowane kody wciąż nie działają w kolejnych przedziałach czasu.",
    },
    bot_detected: {
      title: "Wymagana weryfikacja",
      description:
        "Ta strona wykryła automatyczny dostęp i zablokowała logowanie.",
    },
    captcha_blocked: {
      title: "Wymagana weryfikacja",
      description: "Logowanie zostało zablokowane przez CAPTCHA.",
    },
    stuck_in_loop: {
      title: "Nie udało się dokończyć logowania",
      description:
        "Utknęliśmy, próbując dokończyć logowanie. Może się to zdarzyć przy nietypowych procesach logowania.",
    },
    max_attempts_reached: {
      title: "Nie udało się dokończyć logowania",
      description: "Nie udało się dokończyć logowania mimo kilku prób.",
    },
    website_error: {
      title: "Błąd strony",
      description:
        "Strona zwróciła błąd podczas logowania. Mogą na niej występować problemy.",
    },
    navigation_confused: {
      title: "Nie udało się dokończyć logowania",
      description:
        "Nie udało nam się poruszać po tej stronie. Czasem zdarza się to przy złożonych procesach logowania.",
    },
    browser_error: {
      title: "Błąd przeglądarki",
      description: "Wystąpił problem z przeglądarką. Spróbuj ponownie.",
    },
    session_expired: {
      title: "Sesja wygasła",
      description: "Sesja logowania wygasła. Rozpocznij logowanie od nowa.",
    },
  },
  expiredTitle: "Sesja wygasła",
  expiredDescription:
    "Ta sesja uwierzytelniania wygasła. Rozpocznij nową sesję.",
  externalActionTitle: "Wymagane działanie",
  externalActionFallbackMessage: "Dokończ weryfikację na swoim urządzeniu",
  externalActionWaiting: "Oczekiwanie na Twoje potwierdzenie...",
  humanInterventionTitle: "Wymagana weryfikacja przez człowieka",
  humanInterventionMessage: (site) =>
    `Dokończ weryfikację w serwisie ${site} powyżej, a następnie kontynuuj. Potem dokończymy logowanie.`,
  humanInterventionDone: "Dalej",
  humanInterventionLiveViewTitle: "Przeglądarka logowania",
  humanInterventionLiveViewUnavailable:
    "Przeglądarka logowania jest teraz niedostępna.",
  humanInterventionLiveViewFailed:
    "Nie udało się połączyć z przeglądarką logowania.",
  humanInterventionLiveViewGaveUp:
    "Nie udało się połączyć z przeglądarką logowania. Odśwież stronę, aby spróbować ponownie.",
  humanInterventionLiveViewUnsupported:
    "Twoja przeglądarka nie może wyświetlić przeglądarki logowania. Spróbuj użyć innej przeglądarki.",
  humanInterventionRetry: "Spróbuj ponownie",
  poweredBy: "Obsługiwane przez",
};
