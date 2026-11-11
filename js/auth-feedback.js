(() => {
  "use strict";

  const LANGUAGES = ["es", "en", "pt", "de", "fr", "id"];
  const MESSAGES = {
    es: {
      eyebrow: "NEKRONEX SOCIAL · VERIFICACIÓN COMPLETADA",
      title: "¡Correo confirmado!",
      body: "Tu dirección de correo se verificó correctamente y tu cuenta NEKRONEX ya está activada.",
      next: "Ya puedes iniciar sesión",
      instructions: "Vuelve a NEKRONEX Launcher, abre Amigos → NEKRONEX → Iniciar sesión y utiliza el correo y la contraseña que elegiste al registrarte.",
      action: "Entendido",
      errorEyebrow: "NEKRONEX SOCIAL · VERIFICACIÓN NO COMPLETADA",
      errorTitle: "No pudimos confirmar el correo",
      errorBody: "Este enlace puede haber caducado o haberse utilizado anteriormente. En algunos casos, la cuenta ya quedó confirmada aunque el navegador muestre este aviso.",
      errorNext: "Comprueba tu cuenta",
      errorInstructions: "Vuelve a NEKRONEX Launcher e intenta iniciar sesión. Si todavía no puedes acceder, utiliza «Reenviar correo de verificación» desde la pantalla de acceso y abre el mensaje más reciente.",
      errorAction: "Volver al Launcher",
      dismiss: "Cerrar aviso"
    },
    en: {
      eyebrow: "NEKRONEX SOCIAL · VERIFICATION COMPLETE",
      title: "Email confirmed!",
      body: "Your email address has been verified and your NEKRONEX account is now active.",
      next: "You can now sign in",
      instructions: "Return to NEKRONEX Launcher, open Friends → NEKRONEX → Sign in, and use the email address and password you chose during registration.",
      action: "Got it",
      errorEyebrow: "NEKRONEX SOCIAL · VERIFICATION INCOMPLETE",
      errorTitle: "We couldn't confirm your email",
      errorBody: "This link may have expired or already been used. In some cases, the account may already be confirmed even when the browser shows this notice.",
      errorNext: "Check your account",
      errorInstructions: "Return to NEKRONEX Launcher and try to sign in. If you still cannot access your account, use “Resend verification email” on the sign-in screen and open the newest message.",
      errorAction: "Return to the Launcher",
      dismiss: "Close notice"
    },
    pt: {
      eyebrow: "NEKRONEX SOCIAL · VERIFICAÇÃO CONCLUÍDA",
      title: "E-mail confirmado!",
      body: "Seu endereço de e-mail foi verificado e sua conta NEKRONEX está ativa.",
      next: "Você já pode entrar",
      instructions: "Volte ao NEKRONEX Launcher, abra Amigos → NEKRONEX → Iniciar sessão e use o e-mail e a senha escolhidos no cadastro.",
      action: "Entendi",
      errorEyebrow: "NEKRONEX SOCIAL · VERIFICAÇÃO INCOMPLETA",
      errorTitle: "Não foi possível confirmar o e-mail",
      errorBody: "Este link pode ter expirado ou já ter sido utilizado. Em alguns casos, a conta já pode estar confirmada mesmo que o navegador mostre este aviso.",
      errorNext: "Verifique sua conta",
      errorInstructions: "Volte ao NEKRONEX Launcher e tente entrar. Se ainda não conseguir acessar, use “Reenviar e-mail de verificação” na tela de acesso e abra a mensagem mais recente.",
      errorAction: "Voltar ao Launcher",
      dismiss: "Fechar aviso"
    },
    de: {
      eyebrow: "NEKRONEX SOCIAL · VERIFIZIERUNG ABGESCHLOSSEN",
      title: "E-Mail bestätigt!",
      body: "Deine E-Mail-Adresse wurde bestätigt und dein NEKRONEX-Konto ist jetzt aktiviert.",
      next: "Du kannst dich jetzt anmelden",
      instructions: "Kehre zu NEKRONEX Launcher zurück, öffne Freunde → NEKRONEX → Anmelden und verwende die E-Mail-Adresse und das Passwort aus deiner Registrierung.",
      action: "Verstanden",
      errorEyebrow: "NEKRONEX SOCIAL · VERIFIZIERUNG NICHT ABGESCHLOSSEN",
      errorTitle: "E-Mail konnte nicht bestätigt werden",
      errorBody: "Dieser Link ist möglicherweise abgelaufen oder wurde bereits verwendet. In manchen Fällen ist das Konto bereits bestätigt, obwohl der Browser diesen Hinweis anzeigt.",
      errorNext: "Konto überprüfen",
      errorInstructions: "Kehre zu NEKRONEX Launcher zurück und versuche, dich anzumelden. Falls der Zugriff weiterhin nicht möglich ist, fordere auf dem Anmeldebildschirm eine neue Bestätigungs-E-Mail an und öffne die neueste Nachricht.",
      errorAction: "Zurück zum Launcher",
      dismiss: "Hinweis schließen"
    },
    fr: {
      eyebrow: "NEKRONEX SOCIAL · VÉRIFICATION TERMINÉE",
      title: "E-mail confirmé !",
      body: "Votre adresse e-mail a été vérifiée et votre compte NEKRONEX est maintenant activé.",
      next: "Vous pouvez maintenant vous connecter",
      instructions: "Retournez dans NEKRONEX Launcher, ouvrez Amis → NEKRONEX → Connexion et utilisez l’adresse e-mail et le mot de passe choisis lors de l’inscription.",
      action: "Compris",
      errorEyebrow: "NEKRONEX SOCIAL · VÉRIFICATION INCOMPLÈTE",
      errorTitle: "Nous n’avons pas pu confirmer l’e-mail",
      errorBody: "Ce lien a peut-être expiré ou a déjà été utilisé. Dans certains cas, le compte peut déjà être confirmé même si le navigateur affiche cet avis.",
      errorNext: "Vérifier votre compte",
      errorInstructions: "Retournez dans NEKRONEX Launcher et essayez de vous connecter. Si l’accès est toujours impossible, utilisez « Renvoyer l’e-mail de vérification » sur l’écran de connexion et ouvrez le message le plus récent.",
      errorAction: "Retourner au Launcher",
      dismiss: "Fermer l’avis"
    },
    id: {
      eyebrow: "NEKRONEX SOCIAL · VERIFIKASI SELESAI",
      title: "Email dikonfirmasi!",
      body: "Alamat email Anda telah diverifikasi dan akun NEKRONEX Anda sekarang aktif.",
      next: "Anda sekarang dapat masuk",
      instructions: "Kembali ke NEKRONEX Launcher, buka Teman → NEKRONEX → Masuk, lalu gunakan email dan kata sandi yang Anda pilih saat mendaftar.",
      action: "Mengerti",
      errorEyebrow: "NEKRONEX SOCIAL · VERIFIKASI BELUM SELESAI",
      errorTitle: "Email tidak dapat dikonfirmasi",
      errorBody: "Tautan ini mungkin sudah kedaluwarsa atau pernah digunakan. Dalam beberapa kasus, akun mungkin sudah dikonfirmasi meskipun browser menampilkan pemberitahuan ini.",
      errorNext: "Periksa akun Anda",
      errorInstructions: "Kembali ke NEKRONEX Launcher dan coba masuk. Jika Anda masih tidak dapat mengakses akun, gunakan “Kirim ulang email verifikasi” di layar masuk dan buka pesan terbaru.",
      errorAction: "Kembali ke Launcher",
      dismiss: "Tutup pemberitahuan"
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

  // Supabase PKCE redirects with ?code= after a successful email verification.
  // This page only confirms the result; it does not exchange or persist that code.
  const hasSuccessfulPkceCallback = Boolean(queryParams.get("code")) &&
    (!signupType || signupType === "signup");
  const isError = Boolean(errorCode || errorDescription);
  const isSuccess = !isError && (hasImplicitSignupSession || hasSuccessfulPkceCallback);

  if (!isError && !isSuccess) return;

  // Remove temporary Auth material from the address bar while preserving
  // unrelated query parameters and the user's original path/hash.
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

  function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  }

  function showFeedback() {
    if (document.querySelector(".nx-auth-feedback")) return;
    const success = isSuccess;
    const overlay = createElement("div", `nx-auth-feedback ${success ? "is-success" : "is-error"}`);
    const card = createElement("section", "nx-auth-feedback-card");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "nx-auth-feedback-title");

    const dismiss = createElement("button", "nx-auth-feedback-dismiss", "×");
    dismiss.type = "button";
    dismiss.setAttribute("data-auth-feedback-close", "true");

    const brand = createElement("div", "nx-auth-feedback-brand");
    brand.appendChild(createElement("span", "nx-auth-feedback-brand-mark", "N"));
    brand.appendChild(createElement("span", "", "NEKRONEX"));

    const icon = createElement("span", "nx-auth-feedback-icon", success ? "✓" : "!");
    icon.setAttribute("aria-hidden", "true");

    const eyebrow = createElement("p", "nx-auth-feedback-eyebrow");
    eyebrow.setAttribute("data-auth-copy", success ? "eyebrow" : "errorEyebrow");
    const heading = createElement("h1", "");
    heading.id = "nx-auth-feedback-title";
    heading.setAttribute("data-auth-copy", success ? "title" : "errorTitle");
    const body = createElement("p", "nx-auth-feedback-body");
    body.setAttribute("data-auth-copy", success ? "body" : "errorBody");

    const next = createElement("div", "nx-auth-feedback-next");
    const nextTitle = createElement("strong", "");
    nextTitle.setAttribute("data-auth-copy", success ? "next" : "errorNext");
    const nextBody = createElement("p", "");
    nextBody.setAttribute("data-auth-copy", success ? "instructions" : "errorInstructions");
    next.appendChild(nextTitle);
    next.appendChild(nextBody);

    const action = createElement("button", "nx-auth-feedback-action");
    action.type = "button";
    action.setAttribute("data-auth-feedback-close", "true");
    action.setAttribute("data-auth-copy", success ? "action" : "errorAction");
    const footer = createElement("p", "nx-auth-feedback-foot", "NEKRONEX SOCIAL");

    [dismiss, brand, icon, eyebrow, heading, body, next, action, footer]
      .forEach((element) => card.appendChild(element));
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    function render(language) {
      const selected = MESSAGES[LANGUAGES.includes(language) ? language : "es"] || MESSAGES.es;
      overlay.querySelectorAll("[data-auth-copy]").forEach((element) => {
        const key = element.getAttribute("data-auth-copy");
        element.textContent = selected[key] || "";
      });
      dismiss.setAttribute("aria-label", selected.dismiss);
    }

    function close() {
      overlay.classList.add("is-closing");
      window.setTimeout(() => overlay.remove(), 180);
    }

    overlay.querySelectorAll("[data-auth-feedback-close]").forEach((button) => {
      button.addEventListener("click", close);
    });
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.contains(overlay)) close();
    });
    window.addEventListener("nekronex:language", (event) => {
      render(event.detail?.lang || getLanguage());
    });
    render(getLanguage());
    action.focus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showFeedback, { once: true });
  } else {
    showFeedback();
  }
})();
