(() => {
  "use strict";

  const LANG_KEY = "nekronex-language-v3";
  const COOKIE_KEY = "nekronex-cookie-consent-v3";
  const langLabels = {
    es: { flag: "es", name: "Español" },
    en: { flag: "en", name: "English" },
    pt: { flag: "pt", name: "Português Brasileiro" },
    de: { flag: "de", name: "Deutsch" },
    fr: { flag: "fr", name: "Français" },
    id: { flag: "id", name: "Indonesia" }
  };
  // Windows doesn't render flag emoji as pictures (it falls back to
  // showing the raw two-letter code, e.g. "ES"), so the flag is a real
  // SVG image instead of relying on emoji font support.
  // Absolute asset paths keep the active language flag working on every clean route.
  const flagPath = (code) => `/assets/flags/${code}.svg`;

  const partnerSupportTemplates = {
    es: { urban: ["Consulta sobre chalecos de Urban Studio", "Consulta sobre vehículos personalizados", "Consulta sobre ropa y accesorios", "Consulta sobre scripts o recursos"], mellis: ["Consulta sobre vehículos de Melli’s Store", "Consulta sobre cadenas y joyería", "Consulta sobre accesorios del catálogo", "Consulta sobre disponibilidad de productos"] },
    en: { urban: ["Urban Studio vest inquiry", "Custom vehicle inquiry", "Clothing and accessory inquiry", "Scripts or resources inquiry"], mellis: ["Melli’s Store vehicle inquiry", "Chains and jewelry inquiry", "Catalog accessories inquiry", "Product availability inquiry"] },
    pt: { urban: ["Consulta sobre coletes da Urban Studio", "Consulta sobre veículos personalizados", "Consulta sobre roupas e acessórios", "Consulta sobre scripts e recursos"], mellis: ["Consulta sobre veículos da Melli’s Store", "Consulta sobre correntes e joias", "Consulta sobre acessórios do catálogo", "Consulta sobre disponibilidade"] },
    de: { urban: ["Anfrage zu Westen von Urban Studio", "Anfrage zu Fahrzeugdesigns", "Anfrage zu Kleidung und Accessoires", "Anfrage zu Skripten und Ressourcen"], mellis: ["Anfrage zu Fahrzeugen von Melli’s Store", "Anfrage zu Ketten und Schmuck", "Anfrage zu Katalog-Accessoires", "Anfrage zur Verfügbarkeit"] },
    fr: { urban: ["Demande sur les gilets Urban Studio", "Demande sur les véhicules personnalisés", "Demande sur les vêtements et accessoires", "Demande sur les scripts et ressources"], mellis: ["Demande sur les véhicules Melli’s Store", "Demande sur les chaînes et bijoux", "Demande sur les accessoires du catalogue", "Demande de disponibilité"] },
    id: { urban: ["Pertanyaan tentang rompi Urban Studio", "Pertanyaan tentang kendaraan kustom", "Pertanyaan tentang pakaian dan aksesori", "Pertanyaan tentang skrip dan sumber daya"], mellis: ["Pertanyaan tentang kendaraan Melli’s Store", "Pertanyaan tentang rantai dan perhiasan", "Pertanyaan tentang aksesori katalog", "Pertanyaan ketersediaan produk"] }
  };
  const uiText = {
    es: { support: "Soporte", response: "Respuesta habitual en 24 horas", category: "Categoría", technical: "Soporte técnico", bug: "Reportar un error", general: "Consulta general", other: "Otro", urban: "Urban Studio", mellis: "Melli’s Store", templates: "Plantillas rápidas", name: "Nombre", email: "Email", subject: "Asunto", message: "Mensaje", back: "Cerrar", send: "Enviar solicitud", sending: "Enviando…", sent: "Solicitud preparada. Se abrirá tu correo para enviarla.", missing: "Completa los campos obligatorios.", placeholderName: "Tu nombre", placeholderEmail: "tu@email.com", placeholderSubject: "Resume brevemente tu problema", placeholderMessage: "Cuéntanos qué ocurre y qué esperabas que ocurriera…", audioOn: "Sonido activado", audioOff: "Sonido desactivado", audio: "Sonido" },
    en: { support: "Support", response: "Typical response within 24 hours", category: "Category", technical: "Technical support", bug: "Report a bug", general: "General inquiry", other: "Other", urban: "Urban Studio", mellis: "Melli’s Store", templates: "Quick templates", name: "Name", email: "Email", subject: "Subject", message: "Message", back: "Close", send: "Send request", sending: "Sending…", sent: "Request prepared. Your email client will open to send it.", missing: "Complete the required fields.", placeholderName: "Your name", placeholderEmail: "you@email.com", placeholderSubject: "Briefly summarize the issue", placeholderMessage: "Tell us what happened and what you expected…", audioOn: "Audio enabled", audioOff: "Audio disabled", audio: "Audio" },
    pt: { support: "Suporte", response: "Resposta habitual em 24 horas", category: "Categoria", technical: "Suporte técnico", bug: "Relatar um erro", general: "Consulta geral", other: "Outro", urban: "Urban Studio", mellis: "Melli’s Store", templates: "Modelos rápidos", name: "Nome", email: "E-mail", subject: "Assunto", message: "Mensagem", back: "Fechar", send: "Enviar solicitação", sending: "Enviando…", sent: "Solicitação preparada. Seu e-mail será aberto para envio.", missing: "Preencha os campos obrigatórios.", placeholderName: "Seu nome", placeholderEmail: "voce@email.com", placeholderSubject: "Resuma brevemente o problema", placeholderMessage: "Conte o que aconteceu e o que esperava…", audioOn: "Áudio ativado", audioOff: "Áudio desativado", audio: "Áudio" },
    de: { support: "Support", response: "Übliche Antwort innerhalb von 24 Stunden", category: "Kategorie", technical: "Technischer Support", bug: "Fehler melden", general: "Allgemeine Anfrage", other: "Andere", urban: "Urban Studio", mellis: "Melli’s Store", templates: "Schnellvorlagen", name: "Name", email: "E-Mail", subject: "Betreff", message: "Nachricht", back: "Schließen", send: "Anfrage senden", sending: "Wird gesendet…", sent: "Anfrage vorbereitet. Dein E-Mail-Programm wird zum Senden geöffnet.", missing: "Fülle die Pflichtfelder aus.", placeholderName: "Dein Name", placeholderEmail: "du@email.com", placeholderSubject: "Problem kurz zusammenfassen", placeholderMessage: "Beschreibe, was passiert ist und was du erwartet hast…", audioOn: "Audio aktiviert", audioOff: "Audio deaktiviert", audio: "Audio" },
    fr: { support: "Support", response: "Réponse habituelle sous 24 heures", category: "Catégorie", technical: "Support technique", bug: "Signaler un bug", general: "Demande générale", other: "Autre", urban: "Urban Studio", mellis: "Melli’s Store", templates: "Modèles rapides", name: "Nom", email: "E-mail", subject: "Objet", message: "Message", back: "Fermer", send: "Envoyer la demande", sending: "Envoi…", sent: "Demande préparée. Votre client e-mail va s’ouvrir pour l’envoyer.", missing: "Complétez les champs obligatoires.", placeholderName: "Votre nom", placeholderEmail: "vous@email.com", placeholderSubject: "Résumez brièvement le problème", placeholderMessage: "Expliquez ce qui se passe et ce que vous attendiez…", audioOn: "Audio activé", audioOff: "Audio désactivé", audio: "Audio" },
    id: { support: "Dukungan", response: "Waktu respons biasanya dalam 24 jam", category: "Kategori", technical: "Dukungan teknis", bug: "Laporkan bug", general: "Pertanyaan umum", other: "Lainnya", urban: "Urban Studio", mellis: "Melli’s Store", templates: "Template cepat", name: "Nama", email: "Email", subject: "Subjek", message: "Pesan", back: "Tutup", send: "Kirim permintaan", sending: "Mengirim…", sent: "Permintaan sudah disiapkan. Aplikasi email akan dibuka untuk mengirimnya.", missing: "Lengkapi kolom wajib.", placeholderName: "Nama Anda", placeholderEmail: "anda@email.com", placeholderSubject: "Ringkas masalahnya", placeholderMessage: "Jelaskan apa yang terjadi dan apa yang Anda harapkan…", audioOn: "Audio aktif", audioOff: "Audio nonaktif", audio: "Audio" }
  };

  const storage = {
    get(key, fallback = null) {
      try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch {}
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch {}
    }
  };

  const templates = {
    es: [
      "Uno de los bots no responde en mi servidor.",
      "No puedo configurar correctamente el Dashboard.",
      "Un comando no funciona como debería.",
      "Necesito ayuda para invitar un bot a mi servidor."
    ],
    en: [
      "One of the bots is not responding in my server.",
      "I cannot configure the Dashboard correctly.",
      "A command is not working as expected.",
      "I need help inviting a bot to my server."
    ],
    pt: [
      "Um dos bots não responde no meu servidor.",
      "Não consigo configurar o Dashboard corretamente.",
      "Um comando não funciona como deveria.",
      "Preciso de ajuda para convidar um bot para meu servidor."
    ],
    de: [
      "Einer der Bots antwortet nicht auf meinem Server.",
      "Ich kann das Dashboard nicht richtig konfigurieren.",
      "Ein Befehl funktioniert nicht wie erwartet.",
      "Ich brauche Hilfe beim Einladen eines Bots auf meinen Server."
    ],
    fr: [
      "L’un des bots ne répond pas sur mon serveur.",
      "Je n’arrive pas à configurer correctement le Dashboard.",
      "Une commande ne fonctionne pas comme prévu.",
      "J’ai besoin d’aide pour inviter un bot sur mon serveur."
    ],
    id: [
      "Salah satu bot tidak merespons di server saya.",
      "Saya tidak bisa mengonfigurasi Dashboard dengan benar.",
      "Sebuah perintah tidak bekerja seperti yang diharapkan.",
      "Saya butuh bantuan mengundang bot ke server saya."
    ]
  };

  let currentLang = localStorage.getItem(LANG_KEY) || localStorage.getItem("nyvex-language") || "es";
  if (!uiText[currentLang] || !(window.translations && window.translations[currentLang])) currentLang = "es";

  function dict() {
    return (window.translations && window.translations[currentLang]) || {};
  }

  function text(key, fallback = "") {
    const value = dict()[key];
    return value !== undefined && value !== null && value !== "" ? value : fallback;
  }

  function getTranslationCatalog() {
    return window.translations || globalThis.translations || {};
  }

  function translatePage(lang) {
    const catalog = getTranslationCatalog();
    if (!catalog[lang]) lang = "es";
    currentLang = lang;
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
    const d = catalog[lang] || catalog.es || {};

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key || d[key] == null) return;
      const value = String(d[key]);
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = value;
      else el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key && d[key] != null) el.setAttribute("placeholder", String(d[key]));
    });

    document.querySelectorAll("[data-current-language]").forEach((el) => {
      const code = langLabels[lang]?.flag || "es";
      el.innerHTML = `<img class="nx-flag-icon" src="${flagPath(code)}" alt="" width="18" height="13">`;
      el.setAttribute("aria-label", langLabels[lang]?.name || "Español");
    });

    document.querySelectorAll("[data-lang-code]").forEach((el) => {
      el.textContent = lang.toUpperCase();
    });

    document.querySelectorAll("[data-language]").forEach((el) => {
      el.setAttribute("aria-current", el.getAttribute("data-language") === lang ? "true" : "false");
    });

    storage.set(LANG_KEY, lang);
    storage.set("nyvex-language", lang);
    window.dispatchEvent(new CustomEvent("nekronex:language", { detail: { lang } }));
    try { renderSupportLanguage(); } catch {}
    try { renderCookieLanguage(); } catch {}
  }
  function setupLanguage() {
    const wraps = [...document.querySelectorAll(".lang")];
    if (!wraps.length) return;

    const closeAll = () => {
      wraps.forEach((wrap) => {
        wrap.classList.remove("open");
        wrap.querySelector("[data-lang-toggle], .lang-btn")?.setAttribute("aria-expanded", "false");
      });
    };

    // Use one document-level capture handler. This survives duplicated component
    // markup and prevents the generic document click handlers from closing the menu
    // in the same event cycle.
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const languageOption = target.closest("[data-language]");
      if (languageOption) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const lang = languageOption.getAttribute("data-language");
        if (lang) {
          translatePage(lang);
          const wrap = languageOption.closest(".lang");
          wrap?.classList.remove("open");
          wrap?.querySelector("[data-lang-toggle], .lang-btn")?.setAttribute("aria-expanded", "false");

        }
        return;
      }

      const toggle = target.closest("[data-lang-toggle], .lang-btn");
      if (toggle) {
        const wrap = toggle.closest(".lang");
        if (!wrap) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const opening = !wrap.classList.contains("open");
        closeAll();
        if (opening) {
          wrap.classList.add("open");
          toggle.setAttribute("aria-expanded", "true");

}
        return;
      }

      if (!target.closest(".lang")) closeAll();
    }, true);

    // Keyboard accessibility.
    wraps.forEach((wrap) => {
      const toggle = wrap.querySelector("[data-lang-toggle], .lang-btn");
      toggle?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle.click();
        }
        if (event.key === "Escape") closeAll();
      });
    });

    window.NekroNexLanguage = {
      get: () => currentLang,
      set: (lang) => translatePage(lang),
      close: closeAll
    };
  }
  function setupNavMenus() {
    const groups = [...document.querySelectorAll(".nav-menu-group")];
    groups.forEach((group) => {
      const trigger = group.querySelector(".nav-menu-trigger");
      if (!trigger) return;
      trigger.setAttribute("aria-expanded", "false");
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = !group.classList.contains("open");
        groups.forEach((g) => { if (g !== group) { g.classList.remove("open"); g.querySelector(".nav-menu-trigger")?.setAttribute("aria-expanded", "false"); } });
        group.classList.toggle("open", open);
        trigger.setAttribute("aria-expanded", String(open));

      });
    });
    document.addEventListener("click", (event) => {
      if (event.target.closest(".nav-menu-group")) return;
      groups.forEach((group) => { group.classList.remove("open"); group.querySelector(".nav-menu-trigger")?.setAttribute("aria-expanded", "false"); });
    });
  }

  function setupMobile() {
    document.querySelectorAll(".mobile-toggle, #mobile-menu-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const menu = document.querySelector(".mobile-menu, #mobile-menu");
        if (!menu) return;
        const open = !menu.classList.contains("open") && !menu.classList.contains("active");
        menu.classList.toggle("open", open);
        menu.classList.toggle("active", open);
        button.setAttribute("aria-expanded", String(open));

      });
    });
    document.querySelectorAll(".mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => { document.querySelector(".mobile-menu")?.classList.remove("open", "active"); document.querySelectorAll(".mobile-toggle, #mobile-menu-button").forEach((button) => button.setAttribute("aria-expanded", "false")); });
    });
  }

  function setupFaq() {
    document.querySelectorAll(".faq-q").forEach((question) => {
      question.setAttribute("aria-expanded", "false");
      question.addEventListener("click", () => {
        const item = question.closest(".faq-item");
        const opening = !item?.classList.contains("open");
        item?.classList.toggle("open", opening);
        question.setAttribute("aria-expanded", String(opening));

      });
    });
  }

  function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const selector = link.getAttribute("href");
        if (!selector || selector === "#") return;
        const target = document.querySelector(selector);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({
          behavior: "auto",
          block: "start"
        });

});
    });
  }

  function createSupportWidget() {
    if (document.querySelector(".nx-support-widget")) return;
    const widget = document.createElement("aside");
    widget.className = "nx-support-widget";
    widget.innerHTML = `
      <div class="nx-support-backdrop" data-support-close></div>
      <section class="nx-support-panel" aria-label="NekroNex Support" aria-hidden="true">
        <div class="nx-support-glow"></div>
        <div class="nx-support-head">
          <div class="nx-support-brand">
            <div class="nx-support-orb">✦</div>
            <div><span class="nx-support-eyebrow">NEKRONEX // SUPPORT</span><strong data-support-ui="support"></strong><small data-support-ui="response"></small></div>
          </div>
          <button class="nx-support-close" type="button" aria-label="Close" data-support-close>×</button>
        </div>
        <div class="nx-support-status"><i></i><span>ONLINE</span><span>•</span><span>SECURE CHANNEL</span></div>
        <form class="nx-support-form" novalidate>
          <div class="nx-support-section-title"><span>01</span><span data-support-ui="category"></span></div>
          <div class="nx-support-categories">
            <button type="button" class="nx-support-category active" data-category="tecnico">🛠️ <span data-support-ui="technical"></span></button>
            <button type="button" class="nx-support-category" data-category="bug">◈ <span data-support-ui="bug"></span></button>
            <button type="button" class="nx-support-category" data-category="general">✦ <span data-support-ui="general"></span></button>
            <button type="button" class="nx-support-category" data-category="otro">＋ <span data-support-ui="other"></span></button>
            <button type="button" class="nx-support-category" data-category="urban">◈ <span data-support-ui="urban"></span></button>
            <button type="button" class="nx-support-category" data-category="mellis">◇ <span data-support-ui="mellis"></span></button>
          </div>
          <input type="hidden" name="category" value="tecnico">
          <div class="nx-support-section-title"><span>02</span><span data-support-ui="templates"></span></div>
          <div class="nx-support-templates"></div>
          <div class="nx-support-fields">
            <label><span data-support-ui="name"></span><input name="name" autocomplete="name" required></label>
            <label><span data-support-ui="email"></span><input type="email" name="email" autocomplete="email" required></label>
            <label class="wide"><span data-support-ui="subject"></span><input name="subject" required></label>
            <label class="wide"><span data-support-ui="message"></span><textarea name="message" rows="5" required></textarea></label>
          </div>
          <p class="nx-support-status-msg" data-support-status hidden></p>
          <div class="nx-support-actions"><button type="button" class="nx-support-secondary" data-support-close></button><button type="submit" class="nx-support-primary"><span data-support-ui="send"></span><span>↗</span></button></div>
        </form>
      </section>
      <button class="nx-support-launcher" type="button" aria-label="Open support" aria-expanded="false"><span class="nx-support-launcher-ring"></span><span class="nx-support-launcher-icon">✦</span><span class="nx-support-launcher-label">SUPPORT</span></button>`;
    document.body.appendChild(widget);

    const panel = widget.querySelector(".nx-support-panel");
    const launcher = widget.querySelector(".nx-support-launcher");
    const form = widget.querySelector(".nx-support-form");
    const status = widget.querySelector("[data-support-status]");
    const categoryInput = form.querySelector('[name="category"]');
    const templatesBox = widget.querySelector(".nx-support-templates");

    function setOpen(open) {
      widget.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", String(!open));
      launcher.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nx-support-open", open);

if (open) {

        form.querySelector('[name="name"]')?.focus();
      }
    }

    launcher.addEventListener("click", () => setOpen(!widget.classList.contains("is-open")));
    widget.querySelectorAll("[data-support-close]").forEach((el) => el.addEventListener("click", () => setOpen(false)));

    widget.querySelectorAll(".nx-support-category").forEach((button) => {
      button.addEventListener("click", () => {
        widget.querySelectorAll(".nx-support-category").forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        categoryInput.value = button.dataset.category || "tecnico";
        const subject = form.querySelector('[name="subject"]');
        if (subject && !subject.value && (categoryInput.value === "urban" || categoryInput.value === "mellis")) {
          const title = categoryInput.value === "urban" ? "Urban Studio" : "Melli’s Store";
          subject.value = `Consulta sobre ${title}`;
        }
        renderSupportLanguage();
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const copy = uiText[currentLang] || uiText.es;
      const data = new FormData(form);
      if (!data.get("name") || !data.get("email") || !data.get("subject") || !data.get("message")) {
        status.hidden = false;
        status.className = "nx-support-status-msg error";
        status.textContent = copy.missing;

return;
      }
      status.hidden = false;
      status.className = "nx-support-status-msg success";
      status.textContent = copy.sent;

      const subject = encodeURIComponent(`[NEKRONEX Support] ${data.get("subject")}`);
      const body = encodeURIComponent(`Nombre: ${data.get("name")}\nEmail: ${data.get("email")}\nCategoría: ${data.get("category")}\n\n${data.get("message")}`);
      window.location.href = `mailto:nekronex.support@gmail.com?subject=${subject}&body=${body}`;
    });

    window.NekroSupport = { open: () => setOpen(true), close: () => setOpen(false) };
    widget._render = renderSupportLanguage;

    function renderSupportLanguage() {
      const copy = uiText[currentLang] || uiText.es;
      widget.querySelectorAll("[data-support-ui]").forEach((el) => {
        const key = el.getAttribute("data-support-ui");
        el.textContent = copy[key] || key;
      });
      widget.querySelectorAll("input, textarea").forEach((el) => {
        const key = el.name === "name" ? "placeholderName" : el.name === "email" ? "placeholderEmail" : el.name === "subject" ? "placeholderSubject" : el.name === "message" ? "placeholderMessage" : "";
        if (key) el.placeholder = copy[key];
      });
      widget.querySelector(".nx-support-secondary").textContent = copy.back;
      templatesBox.innerHTML = "";
      const chosenPartnerTemplates = (partnerSupportTemplates[currentLang] || partnerSupportTemplates.es)[categoryInput.value];
      (chosenPartnerTemplates || templates[currentLang] || templates.es).forEach((value) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "nx-support-template";
        btn.textContent = value;
        btn.addEventListener("click", () => {
          const message = form.querySelector('[name="message"]');
          const subject = form.querySelector('[name="subject"]');
          message.value = value;
          if (!subject.value) subject.value = value;
          message.focus();

        });
        templatesBox.appendChild(btn);
      });
    }

    renderSupportLanguage();
    const partnerParam = new URLSearchParams(window.location.search).get("partner");
    if (partnerParam === "urban" || partnerParam === "mellis") {
      const button = widget.querySelector(`[data-category="${partnerParam}"]`);
      if (button) {
        widget.querySelectorAll(".nx-support-category").forEach((item) => item.classList.toggle("active", item === button));
        categoryInput.value = partnerParam;
        const subject = form.querySelector('[name="subject"]');
        const message = form.querySelector('[name="message"]');
        const title = partnerParam === "urban" ? "Urban Studio" : "Melli’s Store";
        if (subject) subject.value = `Consulta sobre ${title}`;
        if (message) message.value = `Hola, quisiera consultar sobre el catálogo de ${title}.\n\nReferencia o categoría de interés:`;
        renderSupportLanguage();
        setOpen(true);
      }
    }
  }

  function renderCookieLanguage() {
    const banner = document.querySelector(".nx-cookie-banner");
    if (!banner) return;
    const catalog = getTranslationCatalog();
    const d = catalog[currentLang] || catalog.es || {};
    const copy = {
      title: d.cookie_title || "Privacidad y almacenamiento local",
      description: d.cookie_description || "Usamos almacenamiento local para recordar idioma y preferencias.",
      reject: d.cookie_reject || "Rechazar",
      accept: d.cookie_accept || "Aceptar"
    };
    banner.querySelector("[data-i18n='cookie_title']")?.replaceChildren(document.createTextNode(copy.title));
    banner.querySelector("[data-i18n='cookie_description']")?.replaceChildren(document.createTextNode(copy.description));
    banner.querySelector("[data-i18n='cookie_reject']")?.replaceChildren(document.createTextNode(copy.reject));
    banner.querySelector("[data-i18n='cookie_accept']")?.replaceChildren(document.createTextNode(copy.accept));
  }

  function setupCookies() {
    if (storage.get(COOKIE_KEY)) return;
    const banner = document.createElement("aside");
    banner.className = "nx-cookie-banner";
    banner.innerHTML = `<div><span class="nx-cookie-icon">◌</span><div><strong data-i18n="cookie_title">Privacidad y almacenamiento local</strong><p data-i18n="cookie_description">Usamos almacenamiento local para recordar idioma y preferencias.</p></div></div><div><button class="nx-cookie-secondary" data-cookie-reject data-i18n="cookie_reject">Rechazar</button><button class="nx-cookie-primary" data-cookie-accept data-i18n="cookie_accept">Aceptar</button></div>`;
    document.body.appendChild(banner);
    renderCookieLanguage();
    const close = (choice) => { storage.set(COOKIE_KEY, choice); banner.remove(); };
    banner.querySelector("[data-cookie-reject]").addEventListener("click", () => close("necessary"));
    banner.querySelector("[data-cookie-accept]").addEventListener("click", () => close("all"));
  }

  function boot() {
    // Run each essential step in isolation so one failing
    // module (say, the cookie panel or support widget) can never block
    // translatePage() from running — that's what was leaving the
    // language flag and other data-i18n text un-translated.
    const safe = (name, fn) => { try { fn(); } catch (err) { console.error(`[NekroApp] "${name}" failed, continuing:`, err); } };
    safe("language", setupLanguage);
    safe("nav-menus", setupNavMenus);
    safe("mobile", setupMobile);
    safe("faq", setupFaq);
    safe("smooth-anchors", setupSmoothAnchors);
    safe("support-widget", createSupportWidget);
    safe("cookies", setupCookies);
    safe("translate", () => translatePage(currentLang));
    setTimeout(() => safe("translate-retry", () => translatePage(currentLang)), 0);
    window.dispatchEvent(new CustomEvent("nekronex:ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
