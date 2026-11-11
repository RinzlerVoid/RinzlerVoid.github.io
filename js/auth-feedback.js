(() => {
  "use strict";

  const LANGUAGES = ["es", "en", "pt", "de", "fr", "id"];
  const MESSAGES = {
    es: {
      product: "LAUNCHER · SOCIAL",
      secure: "IDENTIDAD NEKRONEX",
      successStatus: "VERIFICACIÓN COMPLETADA",
      errorStatus: "ENLACE NO DISPONIBLE",
      successEyebrow: "NEKRONEX SOCIAL / VERIFICACIÓN DE CORREO",
      successTitle: "Correo confirmado.",
      successBody: "Tu dirección de correo está verificada. Tu cuenta NEKRONEX está lista para usar.",
      successNext: "Tu siguiente paso",
      successInstructions: "Abre NEKRONEX Launcher y entra en Amigos → NEKRONEX → Iniciar sesión con el correo y la contraseña que elegiste al registrarte.",
      successAction: "Volver a NEKRONEX",
      errorEyebrow: "NEKRONEX SOCIAL / ESTADO DEL ENLACE",
      errorTitle: "Este enlace ya no está disponible.",
      errorBody: "El enlace pudo caducar o haberse utilizado anteriormente. Por seguridad, los enlaces de confirmación son de un solo uso.",
      errorNext: "Qué puedes hacer",
      errorInstructions: "Vuelve a NEKRONEX Launcher e intenta iniciar sesión. Si tu cuenta todavía no está verificada, solicita un nuevo correo y abre el mensaje más reciente.",
      errorAction: "Volver a NEKRONEX",
      stepOne: "Correo recibido",
      stepTwoSuccess: "Dirección verificada",
      stepThreeSuccess: "Acceso disponible",
      stepTwoError: "Enlace sin validar",
      stepThreeError: "Revisar cuenta",
      footer: "NEKRONEX SOCIAL · IDENTIDAD Y ACCESO",
      languageLabel: "Idioma"
    },
    en: {
      product: "LAUNCHER · SOCIAL",
      secure: "NEKRONEX IDENTITY",
      successStatus: "VERIFICATION COMPLETE",
      errorStatus: "LINK UNAVAILABLE",
      successEyebrow: "NEKRONEX SOCIAL / EMAIL VERIFICATION",
      successTitle: "Email confirmed.",
      successBody: "Your email address is verified. Your NEKRONEX account is ready to use.",
      successNext: "Your next step",
      successInstructions: "Open NEKRONEX Launcher, go to Friends → NEKRONEX → Sign in, and use the email address and password you chose during registration.",
      successAction: "Return to NEKRONEX",
      errorEyebrow: "NEKRONEX SOCIAL / LINK STATUS",
      errorTitle: "This link is no longer available.",
      errorBody: "The link may have expired or already been used. For your security, confirmation links can only be used once.",
      errorNext: "What you can do",
      errorInstructions: "Return to NEKRONEX Launcher and try to sign in. If your account is not verified yet, request a new email and open the most recent message.",
      errorAction: "Return to NEKRONEX",
      stepOne: "Email received",
      stepTwoSuccess: "Address verified",
      stepThreeSuccess: "Access available",
      stepTwoError: "Link not verified",
      stepThreeError: "Check account",
      footer: "NEKRONEX SOCIAL · IDENTITY AND ACCESS",
      languageLabel: "Language"
    },
    pt: {
      product: "LAUNCHER · SOCIAL",
      secure: "IDENTIDADE NEKRONEX",
      successStatus: "VERIFICAÇÃO CONCLUÍDA",
      errorStatus: "LINK INDISPONÍVEL",
      successEyebrow: "NEKRONEX SOCIAL / VERIFICAÇÃO DE E-MAIL",
      successTitle: "E-mail confirmado.",
      successBody: "Seu endereço de e-mail foi verificado. Sua conta NEKRONEX está pronta para uso.",
      successNext: "Seu próximo passo",
      successInstructions: "Abra o NEKRONEX Launcher, acesse Amigos → NEKRONEX → Iniciar sessão e use o e-mail e a senha escolhidos no cadastro.",
      successAction: "Voltar ao NEKRONEX",
      errorEyebrow: "NEKRONEX SOCIAL / STATUS DO LINK",
      errorTitle: "Este link não está mais disponível.",
      errorBody: "O link pode ter expirado ou já ter sido utilizado. Por segurança, os links de confirmação só podem ser usados uma vez.",
      errorNext: "O que você pode fazer",
      errorInstructions: "Volte ao NEKRONEX Launcher e tente entrar. Se sua conta ainda não estiver verificada, solicite um novo e-mail e abra a mensagem mais recente.",
      errorAction: "Voltar ao NEKRONEX",
      stepOne: "E-mail recebido",
      stepTwoSuccess: "Endereço verificado",
      stepThreeSuccess: "Acesso disponível",
      stepTwoError: "Link não verificado",
      stepThreeError: "Verificar conta",
      footer: "NEKRONEX SOCIAL · IDENTIDADE E ACESSO",
      languageLabel: "Idioma"
    },
    de: {
      product: "LAUNCHER · SOCIAL",
      secure: "NEKRONEX IDENTITÄT",
      successStatus: "VERIFIZIERUNG ABGESCHLOSSEN",
      errorStatus: "LINK NICHT VERFÜGBAR",
      successEyebrow: "NEKRONEX SOCIAL / E-MAIL-VERIFIZIERUNG",
      successTitle: "E-Mail bestätigt.",
      successBody: "Deine E-Mail-Adresse wurde bestätigt. Dein NEKRONEX-Konto ist jetzt einsatzbereit.",
      successNext: "Dein nächster Schritt",
      successInstructions: "Öffne NEKRONEX Launcher und gehe zu Freunde → NEKRONEX → Anmelden. Verwende die E-Mail-Adresse und das Passwort aus deiner Registrierung.",
      successAction: "Zurück zu NEKRONEX",
      errorEyebrow: "NEKRONEX SOCIAL / LINK-STATUS",
      errorTitle: "Dieser Link ist nicht mehr verfügbar.",
      errorBody: "Der Link ist möglicherweise abgelaufen oder wurde bereits verwendet. Bestätigungslinks können aus Sicherheitsgründen nur einmal verwendet werden.",
      errorNext: "Das kannst du tun",
      errorInstructions: "Kehre zu NEKRONEX Launcher zurück und versuche, dich anzumelden. Falls dein Konto noch nicht bestätigt ist, fordere eine neue E-Mail an und öffne die neueste Nachricht.",
      errorAction: "Zurück zu NEKRONEX",
      stepOne: "E-Mail erhalten",
      stepTwoSuccess: "Adresse bestätigt",
      stepThreeSuccess: "Zugriff verfügbar",
      stepTwoError: "Link nicht bestätigt",
      stepThreeError: "Konto prüfen",
      footer: "NEKRONEX SOCIAL · IDENTITÄT UND ZUGRIFF",
      languageLabel: "Sprache"
    },
    fr: {
      product: "LAUNCHER · SOCIAL",
      secure: "IDENTITÉ NEKRONEX",
      successStatus: "VÉRIFICATION TERMINÉE",
      errorStatus: "LIEN INDISPONIBLE",
      successEyebrow: "NEKRONEX SOCIAL / VÉRIFICATION DE L’E-MAIL",
      successTitle: "E-mail confirmé.",
      successBody: "Votre adresse e-mail est vérifiée. Votre compte NEKRONEX est prêt à être utilisé.",
      successNext: "Votre prochaine étape",
      successInstructions: "Ouvrez NEKRONEX Launcher, accédez à Amis → NEKRONEX → Connexion et utilisez l’adresse e-mail et le mot de passe choisis lors de l’inscription.",
      successAction: "Retourner sur NEKRONEX",
      errorEyebrow: "NEKRONEX SOCIAL / ÉTAT DU LIEN",
      errorTitle: "Ce lien n’est plus disponible.",
      errorBody: "Le lien a peut-être expiré ou a déjà été utilisé. Pour votre sécurité, les liens de confirmation ne peuvent être utilisés qu’une seule fois.",
      errorNext: "Que pouvez-vous faire ?",
      errorInstructions: "Retournez dans NEKRONEX Launcher et essayez de vous connecter. Si votre compte n’est pas encore vérifié, demandez un nouvel e-mail et ouvrez le message le plus récent.",
      errorAction: "Retourner sur NEKRONEX",
      stepOne: "E-mail reçu",
      stepTwoSuccess: "Adresse vérifiée",
      stepThreeSuccess: "Accès disponible",
      stepTwoError: "Lien non vérifié",
      stepThreeError: "Vérifier le compte",
      footer: "NEKRONEX SOCIAL · IDENTITÉ ET ACCÈS",
      languageLabel: "Langue"
    },
    id: {
      product: "LAUNCHER · SOCIAL",
      secure: "IDENTITAS NEKRONEX",
      successStatus: "VERIFIKASI SELESAI",
      errorStatus: "TAUTAN TIDAK TERSEDIA",
      successEyebrow: "NEKRONEX SOCIAL / VERIFIKASI EMAIL",
      successTitle: "Email dikonfirmasi.",
      successBody: "Alamat email Anda telah diverifikasi. Akun NEKRONEX Anda siap digunakan.",
      successNext: "Langkah berikutnya",
      successInstructions: "Buka NEKRONEX Launcher, masuk ke Teman → NEKRONEX → Masuk, lalu gunakan email dan kata sandi yang Anda pilih saat mendaftar.",
      successAction: "Kembali ke NEKRONEX",
      errorEyebrow: "NEKRONEX SOCIAL / STATUS TAUTAN",
      errorTitle: "Tautan ini tidak lagi tersedia.",
      errorBody: "Tautan mungkin telah kedaluwarsa atau sudah digunakan. Demi keamanan, tautan konfirmasi hanya dapat digunakan satu kali.",
      errorNext: "Yang dapat Anda lakukan",
      errorInstructions: "Kembali ke NEKRONEX Launcher dan coba masuk. Jika akun Anda belum diverifikasi, minta email baru dan buka pesan terbaru.",
      errorAction: "Kembali ke NEKRONEX",
      stepOne: "Email diterima",
      stepTwoSuccess: "Alamat terverifikasi",
      stepThreeSuccess: "Akses tersedia",
      stepTwoError: "Tautan belum diverifikasi",
      stepThreeError: "Periksa akun",
      footer: "NEKRONEX SOCIAL · IDENTITAS DAN AKSES",
      languageLabel: "Bahasa"
    }
  };

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(window.location.search);
  const readAuthParam = (name) => hashParams.get(name) || queryParams.get(name) || "";
  const errorCode = readAuthParam("error_code") || readAuthParam("error");
  const errorDescription = readAuthParam("error_description");
  const signupType = readAuthParam("type");
  const hasImplicitSignupSession = signupType === "signup" &&
    (Boolean(readAuthParam("access_token")) || readAuthParam("token_type").toLowerCase() === "bearer");
  const hasSuccessfulPkceCallback = Boolean(queryParams.get("code")) &&
    (!signupType || signupType === "signup");
  const isError = Boolean(errorCode || errorDescription);
  const isSuccess = !isError && (hasImplicitSignupSession || hasSuccessfulPkceCallback);

  if (!isError && !isSuccess) return;

  // Remove temporary Auth material from the address bar without persisting tokens or codes.
  const authKeys = [
    "access_token", "refresh_token", "token_type", "expires_in", "expires_at",
    "provider_token", "provider_refresh_token", "code", "type", "error",
    "error_code", "error_description"
  ];
  const hasAuthMaterial = authKeys.some((key) => hashParams.has(key) || queryParams.has(key));
  if (hasAuthMaterial) {
    try {
      const cleanUrl = new URL(window.location.href);
      authKeys.forEach((key) => {
        cleanUrl.searchParams.delete(key);
        hashParams.delete(key);
      });
      cleanUrl.hash = hashParams.toString() ? `#${hashParams.toString()}` : "";
      window.history.replaceState(window.history.state, document.title,
        `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`);
    } catch (error) {
      // No token or authorization code is copied to storage if cleanup fails.
    }
  }

  function getLanguage() {
    try {
      const selected = localStorage.getItem("nekronex-language-v3") ||
        localStorage.getItem("nyvex-language") || "es";
      return LANGUAGES.includes(selected) ? selected : "es";
    } catch (error) {
      return "es";
    }
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function showFeedback() {
    if (document.querySelector(".nx-auth-feedback")) return;
    const success = isSuccess;
    document.body.classList.add("nx-auth-feedback-active");

    const page = el("main", `nx-auth-feedback ${success ? "is-success" : "is-error"}`);
    page.setAttribute("aria-live", "polite");
    page.setAttribute("aria-label", success ? "NEKRONEX email verification complete" : "NEKRONEX email verification link status");

    const shell = el("div", "nx-auth-feedback-shell");
    const header = el("header", "nx-auth-header");
    const brand = el("a", "nx-auth-brand");
    brand.href = "/";
    brand.setAttribute("aria-label", "NEKRONEX home");
    const logo = el("img", "nx-auth-brand-symbol");
    logo.src = "/assets/brand/favicon-48.png";
    logo.alt = "";
    logo.width = 36;
    logo.height = 36;
    const brandText = el("span", "nx-auth-brand-name", "NEKRONEX");
    brand.append(logo, brandText, el("span", "nx-auth-brand-product", "SOCIAL"));

    const headerStatus = el("div", "nx-auth-header-status");
    const statusDot = el("span", "nx-auth-status-dot");
    const statusLabel = el("span", "");
    statusLabel.setAttribute("data-auth-copy", success ? "successStatus" : "errorStatus");
    headerStatus.append(statusDot, statusLabel);
    header.append(brand, headerStatus);

    const content = el("section", "nx-auth-content");
    const copy = el("div", "nx-auth-copy");
    const eyebrow = el("p", "nx-auth-eyebrow");
    eyebrow.setAttribute("data-auth-copy", success ? "successEyebrow" : "errorEyebrow");
    const title = el("h1", "nx-auth-title");
    title.setAttribute("data-auth-copy", success ? "successTitle" : "errorTitle");
    const body = el("p", "nx-auth-description");
    body.setAttribute("data-auth-copy", success ? "successBody" : "errorBody");

    const next = el("div", "nx-auth-next");
    const nextRule = el("span", "nx-auth-next-rule");
    const nextTitle = el("strong", "");
    nextTitle.setAttribute("data-auth-copy", success ? "successNext" : "errorNext");
    const nextText = el("p", "");
    nextText.setAttribute("data-auth-copy", success ? "successInstructions" : "errorInstructions");
    next.append(nextRule, el("div", "nx-auth-next-copy"));
    next.querySelector(".nx-auth-next-copy").append(nextTitle, nextText);

    const action = el("a", "nx-auth-action");
    action.href = "/";
    action.append(el("span", ""), el("span", "nx-auth-action-label"));
    action.querySelector(".nx-auth-action-label").setAttribute("data-auth-copy", success ? "successAction" : "errorAction");
    action.querySelector("span:first-child").textContent = "↗";

    copy.append(eyebrow, title, body, next, action);

    const visual = el("aside", "nx-auth-visual");
    visual.setAttribute("aria-hidden", "true");
    const orbit = el("div", "nx-auth-orbit nx-auth-orbit-outer");
    const orbitInner = el("div", "nx-auth-orbit nx-auth-orbit-inner");
    const emblem = el("div", "nx-auth-emblem");
    const emblemImage = el("img", "nx-auth-emblem-image");
    emblemImage.src = "/assets/brand/icon-192.png";
    emblemImage.alt = "";
    emblemImage.width = 192;
    emblemImage.height = 192;
    emblem.appendChild(emblemImage);
    const visualLabel = el("div", "nx-auth-visual-label");
    visualLabel.append(el("span", "nx-auth-visual-index", success ? "01 / VERIFIED" : "01 / ACTION REQUIRED"));
    visualLabel.append(el("span", "nx-auth-visual-name", "NEKRONEX"));
    visual.append(orbit, orbitInner, emblem, visualLabel);

    content.append(copy, visual);

    const progress = el("section", "nx-auth-progress");
    progress.setAttribute("aria-label", "Verification stages");
    const stages = [
      { index: "01", successKey: "stepOne", errorKey: "stepOne", state: "done" },
      { index: "02", successKey: "stepTwoSuccess", errorKey: "stepTwoError", state: success ? "done" : "error" },
      { index: "03", successKey: "stepThreeSuccess", errorKey: "stepThreeError", state: success ? "done" : "pending" }
    ];
    stages.forEach((stage, index) => {
      if (index) progress.appendChild(el("span", `nx-auth-progress-connector ${success || index === 1 ? "is-complete" : ""}`));
      const item = el("div", `nx-auth-stage is-${stage.state}`);
      item.append(el("span", "nx-auth-stage-index", stage.index));
      item.append(el("span", "nx-auth-stage-indicator", stage.state === "done" ? "✓" : stage.state === "error" ? "!" : "—"));
      const stageText = el("span", "nx-auth-stage-text");
      stageText.setAttribute("data-auth-copy", stage.successKey);
      stageText.dataset.errorCopy = stage.errorKey;
      item.appendChild(stageText);
      progress.appendChild(item);
    });

    const footer = el("footer", "nx-auth-footer");
    const footerBrand = el("span", "nx-auth-footer-brand", "N / NEKRONEX");
    const footerText = el("span", "nx-auth-footer-copy");
    footerText.setAttribute("data-auth-copy", "footer");
    footer.append(footerBrand, footerText);

    shell.append(header, content, progress, footer);
    page.appendChild(shell);
    document.body.appendChild(page);

    function render(language) {
      const selected = MESSAGES[LANGUAGES.includes(language) ? language : "es"] || MESSAGES.es;
      page.querySelectorAll("[data-auth-copy]").forEach((node) => {
        const key = node.getAttribute("data-auth-copy");
        node.textContent = selected[key] || "";
      });
      page.querySelectorAll("[data-error-copy]").forEach((node) => {
        if (!success) node.textContent = selected[node.dataset.errorCopy] || "";
      });
    }

    window.addEventListener("nekronex:language", (event) => {
      render(event.detail?.lang || getLanguage());
    });
    render(getLanguage());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showFeedback, { once: true });
  } else {
    showFeedback();
  }
})();
