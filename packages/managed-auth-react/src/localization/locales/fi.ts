import type { Localizer } from "../types";

export const fi: Localizer = {
  primeTitle: (site) => `Kirjaudu palveluun ${site}`,
  primeSubtitle: (site) => `Jatka antamalla palvelun ${site} kirjautumistiedot`,
  primeContinueButton: "Jatka",
  primeLoadingButton: "Ladataan...",
  primeLoadingTitle: "Valmistellaan suojattua kirjautumista",
  primeLoadingSubtitle: "Ladataan yhteyden tietoja...",
  securityEncryption: "Kirjautumistietosi salataan päästä päähän",
  securityNoThirdParty:
    "Tietoja ei koskaan jaeta kenellekään eikä millekään LLM:lle",
  legalPrefix: "Jatkamalla hyväksyt Kernelin",
  legalPrivacyPolicy: "tietosuojakäytännön",
  legalTermsOfService: "käyttöehdot",
  legalConjunction: "ja",
  discoveringMessage: "Selvitetään kirjautumisen vaatimuksia...",
  waitingForFormMessage: "Odotetaan kirjautumislomaketta...",
  submittingMessage: "Kirjaudutaan...",
  loadingDiscoverySteps: [
    "Siirrytään kirjautumissivulle...",
    "Analysoidaan lomakkeen rakennetta...",
    "Tunnistetaan pakollisia kenttiä...",
  ],
  loadingAuthSteps: [
    "Syötetään kirjautumistietoja...",
    "Lähetetään kirjautumislomaketta...",
    "Vahvistetaan kirjautumista...",
  ],
  loadingTimeHint: "Tämä voi kestää 15-30 sekuntia...",
  loginTitle: (site) => `Kirjaudu palveluun ${site}`,
  ssoLoginTitle: (provider) => `Kirjaudu palvelulla ${provider}`,
  ssoLoginSubtitle: (site) => `palveluun ${site}`,
  mfaSelectTitle: "Valitse vahvistustapa",
  mfaSelectSubtitle: "Valitse, miten haluat saada vahvistuskoodin",
  signInSelectTitle: "Valitse vaihtoehto",
  signInSelectSubtitle: "Valitse, millä vaihtoehdolla haluat jatkaa",
  accountSelectTitle: "Valitse tili",
  accountSelectSubtitle: "Valitse, millä tilillä haluat jatkaa",
  submitButton: "Jatka",
  submittingButton: "Kirjaudutaan...",
  ssoButtonLabel: (provider) => `Kirjaudu palvelulla ${provider}`,
  orDivider: "tai",
  passwordShow: "Näytä salasana",
  passwordHide: "Piilota salasana",
  fieldRejectedNotice:
    "Tallennettua arvoa ei hyväksytty. Jatka antamalla uusi arvo.",
  credentialSafetyNotice:
    "Kirjautumistietosi salataan ja lähetetään suoraan selaimestasi. Niitä ei koskaan jaeta kenellekään eikä millekään LLM:lle.",
  mfaTypeLabels: {
    sms: "Tekstiviesti",
    call: "Puhelu",
    email: "Sähköposti",
    totp: "Todennussovellus",
    push: "Push-ilmoitus",
    password: "Salasana",
    passkey: "Pääsyavain",
    switch: "Käytä toista tapaa",
    other: "Muu",
  },
  successTitle: "Kirjautuminen onnistui",
  successDescription: (site) => `${site}-tilisi on nyt yhdistetty`,
  successCloseHint: "Voit nyt sulkea tämän ikkunan",
  errorTitle: "Kirjautuminen epäonnistui",
  errorGenericMessage: "Kirjautumisessa tapahtui odottamaton virhe.",
  errorCodeLabel: "Virhekoodi",
  errorShowDetails: "Näytä tiedot",
  errorHideDetails: "Piilota tiedot",
  errorCloseHint: "Voit nyt sulkea tämän ikkunan",
  errorCodeMessages: {
    domain_not_allowed: {
      title: "Verkkotunnus ei ole sallittu",
      description:
        "Kirjautuminen ohjautui verkkotunnukseen, jota ei ole määritetty. Lisää se allowed_domains-asetukseen.",
    },
    login_form_not_found: {
      title: "Kirjautumislomaketta ei löytynyt",
      description:
        "Tältä sivulta ei löytynyt kirjautumislomaketta. Sivuston ulkoasu on voinut muuttua, tai kirjautumisosoite voi olla väärä.",
    },
    credentials_invalid: {
      title: "Virheelliset kirjautumistiedot",
      description: "Sivusto ei hyväksynyt käyttäjänimeä tai salasanaa.",
    },
    totp_required: {
      title: "Todennuskoodi vaaditaan",
      description: "Todennussovelluksen koodi vaaditaan.",
    },
    sms_code_required: {
      title: "Tekstiviestikoodi vaaditaan",
      description: "Tekstiviestillä lähetetty koodi vaaditaan.",
    },
    email_code_required: {
      title: "Sähköpostikoodi vaaditaan",
      description: "Sähköpostilla lähetetty koodi vaaditaan.",
    },
    account_choice_required: {
      title: "Tilin valinta vaaditaan",
      description:
        "Tili tai identiteetti on valittava, ennen kuin kirjautumista voidaan jatkaa.",
    },
    customer_input_required: {
      title: "Lisätietoja vaaditaan",
      description:
        "Lisätietoja tarvitaan, ennen kuin kirjautumista voidaan jatkaa.",
    },
    external_action_required: {
      title: "Ulkoinen toimenpide vaaditaan",
      description:
        "Jatkaminen edellyttää ulkoista toimenpidettä. Tarkista, onko todennussovelluksessasi, sähköpostissasi tai puhelimessasi vahvistuspyyntö.",
    },
    totp_code_rejected: {
      title: "Todennuskoodi hylättiin",
      description:
        "Sivusto hylkäsi todennuskoodin. Kokeile uutta koodia tai yhdistä tili uudelleen, jos luodut koodit epäonnistuvat jatkuvasti uusissakin aikaikkunoissa.",
    },
    bot_detected: {
      title: "Vahvistus vaaditaan",
      description:
        "Sivusto havaitsi automatisoidun käytön ja esti kirjautumisen.",
    },
    captcha_blocked: {
      title: "Vahvistus vaaditaan",
      description: "CAPTCHA esti kirjautumisen.",
    },
    stuck_in_loop: {
      title: "Kirjautumista ei voitu suorittaa loppuun",
      description:
        "Jäimme jumiin yrittäessämme suorittaa kirjautumisen loppuun. Näin voi käydä epätavallisissa kirjautumistavoissa.",
    },
    max_attempts_reached: {
      title: "Kirjautumista ei voitu suorittaa loppuun",
      description:
        "Kirjautumista ei saatu suoritettua loppuun useista yrityksistä huolimatta.",
    },
    website_error: {
      title: "Sivustovirhe",
      description:
        "Sivusto palautti virheen kirjautumisen aikana. Sivustolla voi olla ongelmia.",
    },
    navigation_confused: {
      title: "Kirjautumista ei voitu suorittaa loppuun",
      description:
        "Emme löytäneet oikeaa reittiä tällä sivustolla. Näin käy joskus monimutkaisissa kirjautumistavoissa.",
    },
    browser_error: {
      title: "Selainvirhe",
      description: "Selaimessa tapahtui virhe. Yritä uudelleen.",
    },
    session_expired: {
      title: "Istunto vanhentui",
      description:
        "Kirjautumisistunto on vanhentunut. Aloita kirjautuminen uudelleen.",
    },
  },
  expiredTitle: "Istunto vanhentui",
  expiredDescription:
    "Tämä todennusistunto on vanhentunut. Aloita uusi istunto.",
  externalActionTitle: "Toimenpide vaaditaan",
  externalActionFallbackMessage: "Suorita vahvistus loppuun laitteellasi",
  externalActionWaiting: "Odotetaan vahvistustasi...",
  humanInterventionTitle: "Ihmisen vahvistus vaaditaan",
  humanInterventionMessage: (site) =>
    `Suorita yllä oleva palvelun ${site} tarkistus ja jatka sitten. Jatkamme kirjautumista sen jälkeen.`,
  humanInterventionDone: "Jatka",
  humanInterventionLiveViewTitle: "Kirjautumisselain",
  humanInterventionLiveViewUnavailable:
    "Kirjautumisselain ei ole juuri nyt käytettävissä.",
  humanInterventionLiveViewFailed: "Kirjautumisselaimeen ei saatu yhteyttä.",
  humanInterventionLiveViewGaveUp:
    "Kirjautumisselaimeen ei saatu yhteyttä. Yritä uudelleen lataamalla sivu uudelleen.",
  humanInterventionLiveViewUnsupported:
    "Selaimesi ei pysty näyttämään kirjautumisselainta. Kokeile toista selainta.",
  humanInterventionRetry: "Yritä uudelleen",
  poweredBy: "Palvelun tarjoaa",
};
