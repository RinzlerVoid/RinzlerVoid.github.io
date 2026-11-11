(() => {
  "use strict";
  // This site only explains the confirmation result. It never adopts or stores
  // the temporary Supabase session returned by the email verification link.
  const languages = ["es", "en", "pt", "de", "fr", "id"];
  const messages = {
    es: { eyebrow:"NEKRONEX SOCIAL · VERIFICACIÓN COMPLETADA", title:"¡Correo confirmado!", body:"Tu dirección de correo se verificó correctamente y tu cuenta NEKRONEX ya está activada.", next:"Ya puedes iniciar sesión", instructions:"Vuelve a NEKRONEX Launcher, abre Amigos → NEKRONEX → Iniciar sesión y utiliza el correo y la contraseña que elegiste al registrarte.", action:"Entendido, volver al Launcher", errorEyebrow:"NEKRONEX SOCIAL · VERIFICACIÓN NO COMPLETADA", errorTitle:"No pudimos confirmar el correo", errorBody:"Este enlace puede haber caducado o haberse utilizado anteriormente. En algunos casos, la cuenta ya quedó confirmada aunque el navegador muestre este aviso.", errorNext:"Comprueba tu cuenta", errorInstructions:"Vuelve a NEKRONEX Launcher e intenta iniciar sesión. Si todavía no puedes acceder, utiliza «Reenviar correo de verificación» desde la pantalla de acceso y abre el mensaje más reciente.", errorAction:"Volver al Launcher", dismiss:"Cerrar aviso" },
    en: { eyebrow:"NEKRONEX SOCIAL · VERIFICATION COMPLETE", title:"Email confirmed!", body:"Your email address has been verified and your NEKRONEX account is now active.", next:"You can now sign in", instructions:"Return to NEKRONEX Launcher, open Friends → NEKRONEX → Sign in, and use the email address and password you chose during registration.", action:"Got it, return to the Launcher", errorEyebrow:"NEKRONEX SOCIAL · VERIFICATION INCOMPLETE", errorTitle:"We couldn't confirm your email", errorBody:"This link may have expired or already been used. In some cases, the account may already be confirmed even when the browser shows this notice.", errorNext:"Check your account", errorInstructions:"Return to NEKRONEX Launcher and try to sign in. If you still cannot access your account, use “Resend verification email” on the sign-in screen and open the newest message.", errorAction:"Return to the Launcher", dismiss:"Close notice" },
    pt: { eyebrow:"NEKRONEX SOCIAL · VERIFICAÇÃO CONCLUÍDA", title:"E-mail confirmado!", body:"Seu endereço de e-mail foi verificado e sua conta NEKRONEX está ativa.", next:"Você já pode entrar", instructions:"Volte ao NEKRONEX Launcher, abra Amigos → NEKRONEX → Iniciar sessão e use o e-mail e a senha escolhidos no cadastro.", action:"Entendi, voltar ao Launcher", errorEyebrow:"NEKRONEX SOCIAL · VERIFICAÇÃO INCOMPLETA", errorTitle:"Não foi possível confirmar o e-mail", errorBody:"Este link pode ter expirado ou já ter sido utilizado. Em alguns casos, a conta já pode estar confirmada mesmo que o navegador mostre este aviso.", errorNext:"Verifique sua conta", errorInstructions:"Volte ao NEKRONEX Launcher e tente entrar. Se ainda não conseguir acessar, use “Reenviar e-mail de verificação” na tela de acesso e abra a mensagem mais recente.", errorAction:"Voltar ao Launcher", dismiss:"Fechar aviso" },
    de: { eyebrow:"NEKRONEX SOCIAL · VERIFIZIERUNG ABGESCHLOSSEN", title:"E-Mail bestätigt!", body:"Deine E-Mail-Adresse wurde bestätigt und dein NEKRONEX-Konto ist jetzt aktiviert.", next:"Du kannst dich jetzt anmelden", instructions:"Kehre zu NEKRONEX Launcher zurück, öffne Freunde → NEKRONEX → Anmelden und verwende die E-Mail-Adresse und das Passwort aus deiner Registrierung.", action:"Verstanden, zurück zum Launcher", errorEyebrow:"NEKRONEX SOCIAL · VERIFIZIERUNG NICHT ABGESCHLOSSEN", errorTitle:"E-Mail konnte nicht bestätigt werden", errorBody:"Dieser Link ist möglicherweise abgelaufen oder wurde bereits verwendet. In manchen Fällen ist das Konto bereits bestätigt, obwohl der Browser diesen Hinweis anzeigt.", errorNext:"Konto überprüfen", errorInstructions:"Kehre zu NEKRONEX Launcher zurück und versuche, dich anzumelden. Falls der Zugriff weiterhin nicht möglich ist, fordere auf dem Anmeldebildschirm eine neue Bestätigungs-E-Mail an und öffne die neueste Nachricht.", errorAction:"Zurück zum Launcher", dismiss:"Hinweis schließen" },
    fr: { eyebrow:"NEKRONEX SOCIAL · VÉRIFICATION TERMINÉE", title:"E-mail confirmé !", body:"Votre adresse e-mail a été vérifiée et votre compte NEKRONEX est maintenant activé.", next:"Vous pouvez maintenant vous connecter", instructions:"Retournez dans NEKRONEX Launcher, ouvrez Amis → NEKRONEX → Connexion et utilisez l’adresse e-mail et le mot de passe choisis lors de l’inscription.", action:"Compris, retourner au Launcher", errorEyebrow:"NEKRONEX SOCIAL · VÉRIFICATION INCOMPLÈTE", errorTitle:"Nous n’avons pas pu confirmer l’e-mail", errorBody:"Ce lien a peut-être expiré ou a déjà été utilisé. Dans certains cas, le compte peut déjà être confirmé même si le navigateur affiche cet avis.", errorNext:"Vérifier votre compte", errorInstructions:"Retournez dans NEKRONEX Launcher et essayez de vous connecter. Si l’accès est toujours impossible, utilisez « Renvoyer l’e-mail de vérification » sur l’écran de connexion et ouvrez le message le plus récent.", errorAction:"Retourner au Launcher", dismiss:"Fermer l’avis" },
    id: { eyebrow:"NEKRONEX SOCIAL · VERIFIKASI SELESAI", title:"Email dikonfirmasi!", body:"Alamat email Anda telah diverifikasi dan akun NEKRONEX Anda sekarang aktif.", next:"Anda sekarang dapat masuk", instructions:"Kembali ke NEKRONEX Launcher, buka Teman → NEKRONEX → Masuk, lalu gunakan email dan kata sandi yang Anda pilih saat mendaftar.", action:"Mengerti, kembali ke Launcher", errorEyebrow:"NEKRONEX SOCIAL · VERIFIKASI BELUM SELESAI", errorTitle:"Email tidak dapat dikonfirmasi", errorBody:"Tautan ini mungkin sudah kedaluwarsa atau pernah digunakan. Dalam beberapa kasus, akun mungkin sudah dikonfirmasi meskipun browser menampilkan pemberitahuan ini.", errorNext:"Periksa akun Anda", errorInstructions:"Kembali ke NEKRONEX Launcher dan coba masuk. Jika Anda masih tidak dapat mengakses akun, gunakan “Kirim ulang email verifikasi” di layar masuk dan buka pesan terbaru.", errorAction:"Kembali ke Launcher", dismiss:"Tutup pemberitahuan" }
  };
  const readParams = () => ({ hash:new URLSearchParams(window.location.hash.replace(/^#/, "")), query:new URLSearchParams(window.location.search) });
  const params = readParams();
  const getParam = (key) => params.hash.get(key) || params.query.get(key) || "";
  const errorCode = getParam("error_code") || getParam("error");
  const signupType = getParam("type");
  const success = !errorCode && signupType === "signup" && (Boolean(getParam("access_token")) || getParam("token_type").toLowerCase() === "bearer");
  const failed = Boolean(errorCode);
  if (!success && !failed) return;

  // Tokens are discarded, not used to create a web login session.
  const sensitive = ["access_token","refresh_token","token_type","expires_in","error","error_code","error_description","type","provider_token","provider_refresh_token","code"];
  if (sensitive.some((key) => params.hash.has(key) || params.query.has(key))) {
    try { window.history.replaceState(window.history.state, document.title, window.location.pathname); } catch { /* fail closed: never copy credentials into storage */ }
  }

  const getLanguage = () => {
    try {
      const value = localStorage.getItem("nekronex-language-v3") || localStorage.getItem("nyvex-language") || "es";
      return languages.includes(value) ? value : "es";
    } catch { return "es"; }
  };
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function mount() {
    if (document.querySelector(".nx-auth-feedback")) return;
    const overlay = make("div", `nx-auth-feedback ${success ? "is-success" : "is-error"}`);
    const card = make("section", "nx-auth-feedback-card");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "nx-auth-feedback-title");
    const dismiss = make("button", "nx-auth-feedback-dismiss", "×");
    dismiss.type = "button";
    dismiss.dataset.authClose = "true";
    const brand = make("div", "nx-auth-feedback-brand");
    brand.append(make("span", "nx-auth-feedback-brand-mark", "N"), make("span", "", "NEKRONEX"));
    const icon = make("span", "nx-auth-feedback-icon", success ? "✓" : "!");
    icon.setAttribute("aria-hidden", "true");
    const eyebrow = make("p", "nx-auth-feedback-eyebrow");
    eyebrow.dataset.authCopy = success ? "eyebrow" : "errorEyebrow";
    const title = make("h1", "");
    title.id = "nx-auth-feedback-title";
    title.dataset.authCopy = success ? "title" : "errorTitle";
    const body = make("p", "nx-auth-feedback-body");
    body.dataset.authCopy = success ? "body" : "errorBody";
    const next = make("div", "nx-auth-feedback-next");
    const nextTitle = make("strong", "");
    nextTitle.dataset.authCopy = success ? "next" : "errorNext";
    const nextBody = make("p", "");
    nextBody.dataset.authCopy = success ? "instructions" : "errorInstructions";
    next.append(nextTitle, nextBody);
    const action = make("button", "nx-auth-feedback-action");
    action.type = "button";
    action.dataset.authCopy = success ? "action" : "errorAction";
    action.dataset.authClose = "true";
    card.append(dismiss, brand, icon, eyebrow, title, body, next, action, make("p", "nx-auth-feedback-foot", "NEKRONEX SOCIAL"));
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    function render(lang) {
      const selected = messages[languages.includes(lang) ? lang : "es"] || messages.es;
      overlay.querySelectorAll("[data-auth-copy]").forEach((node) => { node.textContent = selected[node.dataset.authCopy] || ""; });
      dismiss.setAttribute("aria-label", selected.dismiss);
    }
    function close() { overlay.classList.add("is-closing"); window.setTimeout(() => overlay.remove(), 180); }
    overlay.querySelectorAll("[data-auth-close]").forEach((button) => button.addEventListener("click", close));
    overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && document.body.contains(overlay)) close(); });
    window.addEventListener("nekronex:language", (event) => render(event.detail?.lang || getLanguage()));
    render(getLanguage());
    action.focus();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once:true });
  else mount();
})();
