document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       NEKRONEX • AMBIENT PARTICLES
       ======================================== */

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion && !document.querySelector(".particle-layer")) {
        const canvas = document.createElement("canvas");
        canvas.className = "particle-layer";
        canvas.setAttribute("aria-hidden", "true");
        document.body.prepend(canvas);

        const context = canvas.getContext("2d");
        const particles = [];
        const palette = ["#d4af37", "#8a7cff", "#00e5ff", "#f5f5f5", "#e67cf0"];
        let width = 0;
        let height = 0;
        let animationFrame;

        const resize = () => {
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const createParticle = () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.9 + .55,
            speed: Math.random() * .24 + .07,
            drift: (Math.random() - .5) * .12,
            alpha: Math.random() * .5 + .25,
            color: palette[Math.floor(Math.random() * palette.length)]
        });

        const resetParticles = () => {
            particles.length = 0;
            const amount = Math.min(220, Math.max(80, Math.floor((width * height) / 9000)));
            for (let index = 0; index < amount; index += 1) particles.push(createParticle());
        };

        const draw = () => {
            context.clearRect(0, 0, width, height);
            particles.forEach((particle) => {
                particle.y -= particle.speed;
                particle.x += particle.drift;
                if (particle.y < -8) particle.y = height + 8;
                if (particle.x < -8) particle.x = width + 8;
                if (particle.x > width + 8) particle.x = -8;
                context.globalAlpha = particle.alpha;
                context.fillStyle = particle.color;
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
            });

            // Conexiones muy sutiles para aportar profundidad sin competir con el contenido.
            context.lineWidth = 0.55;
            for (let first = 0; first < particles.length; first += 1) {
                for (let second = first + 1; second < particles.length; second += 1) {
                    const a = particles[first];
                    const b = particles[second];
                    const distance = Math.hypot(a.x - b.x, a.y - b.y);
                    if (distance > 118) continue;
                    context.globalAlpha = (1 - distance / 118) * 0.13;
                    context.strokeStyle = a.color;
                    context.beginPath();
                    context.moveTo(a.x, a.y);
                    context.lineTo(b.x, b.y);
                    context.stroke();
                }
            }
            context.globalAlpha = 1;
            animationFrame = requestAnimationFrame(draw);
        };

        resize();
        resetParticles();
        window.addEventListener("resize", () => { resize(); resetParticles(); }, { passive: true });
        window.addEventListener("pagehide", () => cancelAnimationFrame(animationFrame), { once: true });
        draw();
    }

    /* En páginas de producto también ofrecemos el selector trilingüe. */
    if (!document.querySelector(".language-selector")) {
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            const selector = document.createElement("div");
            selector.className = "language-selector";
            selector.innerHTML = `
                <button class="language-button" id="language-toggle" type="button" aria-label="Select language">🌐 <span class="language-current" id="language-current"><span class="flag flag-es" aria-hidden="true"></span></span> ▾</button>
                <div class="language-menu" id="language-menu">
                    <button type="button" data-language="es"><span class="flag flag-es" aria-hidden="true"></span> Español</button>
                    <button type="button" data-language="en"><span class="flag flag-us" aria-hidden="true"></span> English</button>
                    <button type="button" data-language="pt"><span class="flag flag-br" aria-hidden="true"></span> Português Brasileiro</button>
                    <button type="button" data-language="de"><span class="flag flag-de" aria-hidden="true"></span> Deutsch</button>
                    <button type="button" data-language="fr"><span class="flag flag-fr" aria-hidden="true"></span> Français</button>
                </div>`;
            navbar.appendChild(selector);
        }
    }

    /* Chimes sutiles estilo interfaz gaming. Se generan localmente con Web Audio;
       no hay archivos externos ni reproducción automática. */
    let chimeContext;
    let lastChime = 0;
    const playChime = (kind = "hover") => {
        const now = performance.now();
        if (now - lastChime < 180) return;
        lastChime = now;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        chimeContext ||= new AudioContext();
        if (chimeContext.state === "suspended") chimeContext.resume();
        const start = chimeContext.currentTime;
        const notes = kind === "click"
            ? [196.00, 392.00, 523.25, 659.25, 783.99]
            : [261.63, 523.25, 659.25, 880.00];
        notes.forEach((frequency, index) => {
            const oscillator = chimeContext.createOscillator();
            const gain = chimeContext.createGain();
            const filter = chimeContext.createBiquadFilter();
            oscillator.type = index === 0 ? "triangle" : "sine";
            oscillator.frequency.setValueAtTime(frequency, start + index * 0.045);
            oscillator.detune.setValueAtTime(kind === "click" ? index * 3 : index * 2, start + index * 0.045);
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(kind === "click" ? 2600 : 1900, start + index * 0.045);
            gain.gain.setValueAtTime(0.0001, start + index * 0.055);
            gain.gain.exponentialRampToValueAtTime(kind === "click" ? 0.022 : 0.016, start + index * 0.055 + 0.018);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.055 + (kind === "click" ? 0.30 : 0.22));
            oscillator.connect(filter).connect(gain).connect(chimeContext.destination);
            oscillator.start(start + index * 0.055);
            oscillator.stop(start + index * 0.055 + (kind === "click" ? 0.32 : 0.24));
        });
    };
    document.querySelectorAll(".product-card, .future-card, .button, .product-link").forEach((element) => {
        element.addEventListener("mouseenter", () => playChime("hover"), { passive: true });
        element.addEventListener("click", () => playChime("click"), { passive: true });
    });

    /* ========================================
       NEKRONEX • COOKIE CONSENT
       ======================================== */

    const cookieConsentKey = "nekronex-cookie-consent-v1";
    const cookieChoice = localStorage.getItem(cookieConsentKey);
    if (!cookieChoice) {
        const legalPrefix = window.location.pathname.includes("/pages/") ? "../legal/" : "pages/legal/";
        const banner = document.createElement("aside");
        banner.className = "cookie-banner";
        banner.setAttribute("aria-label", "Cookie consent");
        banner.innerHTML = `
            <div class="cookie-mark">◌</div>
            <div class="cookie-copy">
                <h2 data-i18n="cookie_title">Cookies y privacidad</h2>
                <p data-i18n="cookie_description">Usamos cookies necesarias para el funcionamiento y almacenamiento local para recordar tu idioma. Las opciones adicionales solo se activan con tu permiso.</p>
                <div class="cookie-options" hidden>
                    <label><input type="checkbox" checked disabled> <span data-i18n="cookie_necessary">Necesarias para el funcionamiento</span></label>
                    <label><input class="cookie-optional" type="checkbox"> <span data-i18n="cookie_optional">Opcionales para mejoras y medición</span></label>
                </div>
                <div class="cookie-links"><a href="${legalPrefix}privacy.html">Política de privacidad</a><span>·</span><a href="${legalPrefix}terms.html">Términos de servicio</a></div>
            </div>
            <div class="cookie-actions">
                <button class="cookie-settings" type="button" data-i18n="cookie_settings">Configurar preferencias</button>
                <button class="cookie-reject" type="button" data-i18n="cookie_reject">Rechazar opcionales</button>
                <button class="cookie-accept" type="button" data-i18n="cookie_accept">Aceptar todas</button>
            </div>`;
        document.body.appendChild(banner);
        const close = (choice) => { localStorage.setItem(cookieConsentKey, choice); banner.classList.add("cookie-dismissed"); setTimeout(() => banner.remove(), 280); };
        banner.querySelector(".cookie-settings").addEventListener("click", () => { banner.querySelector(".cookie-options").hidden = !banner.querySelector(".cookie-options").hidden; });
        banner.querySelector(".cookie-reject").addEventListener("click", () => close("necessary"));
        banner.querySelector(".cookie-accept").addEventListener("click", () => close("all"));
    }

    /* ========================================
       NEKRONEX • SUPPORT WIDGET
       ======================================== */

    const SUPPORT_EMAIL = "nekronex.support@gmail.com";

    const supportWidget = document.createElement("aside");
    supportWidget.className = "support-widget";
    supportWidget.setAttribute("aria-label", "Soporte NEKRONEX");
    supportWidget.innerHTML = `
        <section class="support-panel" hidden>
            <div class="support-panel-header">
                <div class="support-avatar">✦</div>
                <div><strong data-support="title">Soporte NEKRONEX</strong><small data-support="response">Tiempo de respuesta: en 24 horas</small></div>
                <button class="support-close" type="button" aria-label="Cerrar soporte" data-support="close">×</button>
            </div>

            <form class="support-form" novalidate>
                <label class="support-field">
                    <span data-support="category_label">Categoría</span>
                    <select name="category" class="support-select">
                        <option value="tecnico" data-support="cat_technical">Soporte técnico</option>
                        <option value="bug" data-support="cat_bug">Reportar un error</option>
                        <option value="general" data-support="cat_general">Consulta general</option>
                        <option value="otro" data-support="cat_other">Otro</option>
                    </select>
                </label>

                <div class="support-templates">
                    <span class="support-templates-label" data-support="templates_label">Plantillas rápidas</span>
                    <div class="support-template-list">
                        <button type="button" class="support-template" data-support="tpl_1" data-template-target="tpl_1">Uno de los bots no responde en mi servidor.</button>
                        <button type="button" class="support-template" data-support="tpl_2" data-template-target="tpl_2">No puedo configurar correctamente el Dashboard.</button>
                        <button type="button" class="support-template" data-support="tpl_3" data-template-target="tpl_3">Un comando no funciona como debería.</button>
                        <button type="button" class="support-template" data-support="tpl_4" data-template-target="tpl_4">Necesito ayuda para invitar un bot a mi servidor.</button>
                    </div>
                </div>

                <label class="support-field">
                    <span data-support="name_label">Nombre</span>
                    <input type="text" name="name" autocomplete="name" required data-support-placeholder="name_placeholder" placeholder="Tu nombre">
                </label>

                <label class="support-field">
                    <span data-support="email_label">Email</span>
                    <input type="email" name="email" autocomplete="email" required data-support-placeholder="email_placeholder" placeholder="tu@email.com">
                </label>

                <label class="support-field">
                    <span data-support="subject_label">Asunto</span>
                    <input type="text" name="subject" required data-support-placeholder="subject_placeholder" placeholder="Describe brevemente tu problema">
                </label>

                <label class="support-field">
                    <span data-support="message_label">Mensaje</span>
                    <textarea name="message" rows="4" required data-support-placeholder="message_placeholder" placeholder="Describe tu problema con detalle..."></textarea>
                </label>

                <p class="support-form-status" data-support-status hidden></p>

                <div class="support-form-actions">
                    <button type="button" class="support-btn support-btn-secondary" data-support="back">Volver</button>
                    <button type="submit" class="support-btn support-btn-primary" data-support="send">Enviar</button>
                </div>
            </form>
        </section>
        <button class="support-launcher" type="button" aria-expanded="false" aria-label="Abrir soporte" data-support="open"><span>✦</span></button>`;
    document.body.appendChild(supportWidget);

    const supportPanel = supportWidget.querySelector(".support-panel");
    const supportLauncher = supportWidget.querySelector(".support-launcher");
    const supportForm = supportWidget.querySelector(".support-form");
    const supportStatusEl = supportWidget.querySelector("[data-support-status]");

    const resetSupportForm = () => {
        supportForm.reset();
        supportStatusEl.hidden = true;
        supportStatusEl.textContent = "";
        supportStatusEl.classList.remove("is-error", "is-success");
    };

    const toggleSupport = (open) => {
        supportPanel.hidden = !open;
        supportWidget.classList.toggle("is-open", open);
        supportLauncher.setAttribute("aria-expanded", String(open));
        if (open) supportForm.querySelector('[name="name"]')?.focus();
    };
    supportLauncher.addEventListener("click", () => toggleSupport(supportPanel.hidden));
    supportWidget.querySelector(".support-close").addEventListener("click", () => toggleSupport(false));
    supportWidget.querySelector('[data-support="back"]').addEventListener("click", () => toggleSupport(false));

    supportWidget.querySelectorAll(".support-template").forEach((button) => {
        button.addEventListener("click", () => {
            const messageField = supportForm.querySelector('[name="message"]');
            const subjectField = supportForm.querySelector('[name="subject"]');
            messageField.value = button.textContent.trim();
            if (!subjectField.value) subjectField.value = button.textContent.trim();
            messageField.focus();
        });
    });

    let currentSupportLanguage = "es";
    supportForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const copy = supportCopy[currentSupportLanguage] || supportCopy.es;
        const submitButton = supportForm.querySelector('[data-support="send"]');
        const data = new FormData(supportForm);
        const category = data.get("category");
        const categoryLabel = supportForm.querySelector(`option[value="${category}"]`)?.textContent || category;

        submitButton.disabled = true;
        submitButton.textContent = copy.sending;
        supportStatusEl.hidden = true;
        supportStatusEl.classList.remove("is-error", "is-success");

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${SUPPORT_EMAIL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    _subject: `[NEKRONEX Soporte] ${data.get("subject")}`,
                    Categoría: categoryLabel,
                    Nombre: data.get("name"),
                    Email: data.get("email"),
                    Asunto: data.get("subject"),
                    Mensaje: data.get("message")
                })
            });
            if (!response.ok) throw new Error("request-failed");
            supportStatusEl.textContent = copy.sent_success;
            supportStatusEl.classList.add("is-success");
            supportStatusEl.hidden = false;
            supportForm.reset();
        } catch (error) {
            supportStatusEl.textContent = copy.sent_error;
            supportStatusEl.classList.add("is-error");
            supportStatusEl.hidden = false;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = copy.send;
        }
    });

    const supportCopy = {
        es: { title: "Soporte NEKRONEX", response: "Tiempo de respuesta: en 24 horas", close: "Cerrar soporte", open: "Abrir soporte",
            category_label: "Categoría", cat_technical: "Soporte técnico", cat_bug: "Reportar un error", cat_general: "Consulta general", cat_other: "Otro",
            templates_label: "Plantillas rápidas",
            tpl_1: "Uno de los bots no responde en mi servidor.", tpl_2: "No puedo configurar correctamente el Dashboard.", tpl_3: "Un comando no funciona como debería.", tpl_4: "Necesito ayuda para invitar un bot a mi servidor.",
            name_label: "Nombre", name_placeholder: "Tu nombre",
            email_label: "Email", email_placeholder: "tu@email.com",
            subject_label: "Asunto", subject_placeholder: "Describe brevemente tu problema",
            message_label: "Mensaje", message_placeholder: "Describe tu problema con detalle...",
            back: "Volver", send: "Enviar", sending: "Enviando...",
            sent_success: "Mensaje enviado. Te responderemos por correo.", sent_error: "No se pudo enviar. Escríbenos a nekronex.support@gmail.com" },
        en: { title: "NEKRONEX Support", response: "Response time: within 24 hours", close: "Close support", open: "Open support",
            category_label: "Category", cat_technical: "Technical support", cat_bug: "Report a bug", cat_general: "General inquiry", cat_other: "Other",
            templates_label: "Quick templates",
            tpl_1: "One of the bots isn't responding on my server.", tpl_2: "I can't properly configure the Dashboard.", tpl_3: "A command isn't working as it should.", tpl_4: "I need help inviting a bot to my server.",
            name_label: "Name", name_placeholder: "Your name",
            email_label: "Email", email_placeholder: "you@email.com",
            subject_label: "Subject", subject_placeholder: "Briefly describe your issue",
            message_label: "Message", message_placeholder: "Describe your issue in detail...",
            back: "Back", send: "Send", sending: "Sending...",
            sent_success: "Message sent. We'll reply by email.", sent_error: "Couldn't send it. Email us at nekronex.support@gmail.com" },
        pt: { title: "Suporte NEKRONEX", response: "Tempo de resposta: em 24 horas", close: "Fechar suporte", open: "Abrir suporte",
            category_label: "Categoria", cat_technical: "Suporte técnico", cat_bug: "Reportar um erro", cat_general: "Consulta geral", cat_other: "Outro",
            templates_label: "Modelos rápidos",
            tpl_1: "Um dos bots não está respondendo no meu servidor.", tpl_2: "Não consigo configurar corretamente o Dashboard.", tpl_3: "Um comando não está funcionando como deveria.", tpl_4: "Preciso de ajuda para convidar um bot para o meu servidor.",
            name_label: "Nome", name_placeholder: "Seu nome",
            email_label: "Email", email_placeholder: "voce@email.com",
            subject_label: "Assunto", subject_placeholder: "Descreva brevemente seu problema",
            message_label: "Mensagem", message_placeholder: "Descreva seu problema em detalhes...",
            back: "Voltar", send: "Enviar", sending: "Enviando...",
            sent_success: "Mensagem enviada. Responderemos por e-mail.", sent_error: "Não foi possível enviar. Escreva para nekronex.support@gmail.com" },
        de: { title: "NEKRONEX Support", response: "Antwortzeit: innerhalb von 24 Stunden", close: "Support schließen", open: "Support öffnen",
            category_label: "Kategorie", cat_technical: "Technischer Support", cat_bug: "Fehler melden", cat_general: "Allgemeine Anfrage", cat_other: "Sonstiges",
            templates_label: "Schnellvorlagen",
            tpl_1: "Einer der Bots reagiert auf meinem Server nicht.", tpl_2: "Ich kann das Dashboard nicht richtig konfigurieren.", tpl_3: "Ein Befehl funktioniert nicht wie erwartet.", tpl_4: "Ich brauche Hilfe, um einen Bot zu meinem Server einzuladen.",
            name_label: "Name", name_placeholder: "Dein Name",
            email_label: "E-Mail", email_placeholder: "du@email.com",
            subject_label: "Betreff", subject_placeholder: "Beschreibe dein Problem kurz",
            message_label: "Nachricht", message_placeholder: "Beschreibe dein Problem im Detail...",
            back: "Zurück", send: "Senden", sending: "Wird gesendet...",
            sent_success: "Nachricht gesendet. Wir antworten per E-Mail.", sent_error: "Senden fehlgeschlagen. Schreib uns an nekronex.support@gmail.com" },
        fr: { title: "Support NEKRONEX", response: "Délai de réponse : sous 24 heures", close: "Fermer le support", open: "Ouvrir le support",
            category_label: "Catégorie", cat_technical: "Support technique", cat_bug: "Signaler un bug", cat_general: "Demande générale", cat_other: "Autre",
            templates_label: "Modèles rapides",
            tpl_1: "Un des bots ne répond pas sur mon serveur.", tpl_2: "Je n'arrive pas à configurer le Dashboard correctement.", tpl_3: "Une commande ne fonctionne pas comme prévu.", tpl_4: "J'ai besoin d'aide pour inviter un bot sur mon serveur.",
            name_label: "Nom", name_placeholder: "Votre nom",
            email_label: "Email", email_placeholder: "vous@email.com",
            subject_label: "Sujet", subject_placeholder: "Décrivez brièvement votre problème",
            message_label: "Message", message_placeholder: "Décrivez votre problème en détail...",
            back: "Retour", send: "Envoyer", sending: "Envoi en cours...",
            sent_success: "Message envoyé. Nous répondrons par email.", sent_error: "Échec de l'envoi. Écrivez-nous à nekronex.support@gmail.com" }
    };
    const updateSupportCopy = (language) => {
        currentSupportLanguage = supportCopy[language] ? language : "es";
        const copy = supportCopy[currentSupportLanguage];
        supportWidget.querySelectorAll("[data-support]").forEach((element) => {
            const key = element.getAttribute("data-support");
            if (copy[key]) element.textContent = copy[key];
        });
        supportWidget.querySelectorAll("[data-support-placeholder]").forEach((element) => {
            const key = element.getAttribute("data-support-placeholder");
            if (copy[key]) element.setAttribute("placeholder", copy[key]);
        });
        supportWidget.querySelector(".support-panel")?.setAttribute("aria-label", copy.title);
        supportWidget.querySelector(".support-close")?.setAttribute("aria-label", copy.close);
        supportWidget.querySelector(".support-launcher")?.setAttribute("aria-label", copy.open);
    };

    /* ========================================
       NYVEX • LANGUAGE SYSTEM
       ======================================== */

    const languageSelector =
        document.querySelector(".language-selector");

    const interfaceTranslations = {
        es: { nav_resources: "Recursos", nav_legal: "Legal", nav_community: "Comunidad", nav_product_overview: "Resumen", nav_quick_start: "Guía rápida", nav_dashboard: "Abrir Dashboard", collaborations_label: "FUTURAS COLABORACIONES", collaborations_title: "Construyamos con quienes comparten la visión.", collaborations_description: "Un espacio para futuros creadores, comunidades de Minecraft y proyectos de seguridad que quieran crear experiencias más seguras en Discord.", collaboration_status: "PRÓXIMAMENTE", collaboration_streamer_title: "Colaboración con streamer", collaboration_streamer_description: "Una futura colaboración para conectar contenido, herramientas de comunidad y una experiencia de Discord cuidada.", collaboration_minecraft_title: "Comunidad de Minecraft", collaboration_minecraft_description: "Una futura colaboración centrada en servidores, comunidades, moderación y seguridad en Discord.", collaboration_details: "Los detalles se anunciarán pronto", dashboard_control_label: "CONTROL CENTRAL", dashboard_features_title: "Todo tu ecosistema, en un solo panel.", dashboard_feature_config_title: "⚙️ Configuración", dashboard_feature_security_title: "🛡️ Seguridad", dashboard_feature_stats_title: "📊 Estadísticas", dashboard_feature_config: "Selecciona tu servidor y configura cada bot según sus necesidades.", dashboard_feature_security: "Administra roles, canales, logs y protecciones desde un flujo centralizado.", dashboard_feature_stats: "Consulta el estado y la actividad de tus herramientas de NekroNex.", dashboard_bot_config_label: "CONFIGURACIÓN POR BOT", dashboard_bot_config_title: "Elige qué necesita cada sistema.", dashboard_bot_welcome: "Canal de bienvenida, despedida, logs y rol automático.", dashboard_bot_music: "Canal de música, rol DJ, límite de cola y volumen predeterminado.", dashboard_bot_guard: "Canal de logs, idioma, Anti-Raid, Anti-Nuke y administradores de confianza.", dashboard_bot_tickets: "Categoría de tickets, rol de staff y canal de transcripts." },
        en: { nav_resources: "Resources", nav_legal: "Legal", nav_community: "Community", nav_product_overview: "Overview", nav_quick_start: "Quick start", nav_dashboard: "Open Dashboard", collaborations_label: "FUTURE COLLABORATIONS", collaborations_title: "Built with people who share the vision.", collaborations_description: "A dedicated space for future creators, Minecraft communities and security projects that want to build safer Discord experiences together.", collaboration_status: "COMING SOON", collaboration_streamer_title: "Streamer collaboration", collaboration_streamer_description: "A future creator partnership to connect content, community tools and a polished Discord experience.", collaboration_minecraft_title: "Minecraft community", collaboration_minecraft_description: "A future partnership focused on servers, communities, moderation and Discord security.", collaboration_details: "Details will be announced soon", dashboard_control_label: "CENTRAL CONTROL", dashboard_features_title: "Your entire ecosystem, in one panel.", dashboard_feature_config_title: "⚙️ Configuration", dashboard_feature_security_title: "🛡️ Security", dashboard_feature_stats_title: "📊 Statistics", dashboard_feature_config: "Select your server and configure each bot for its needs.", dashboard_feature_security: "Manage roles, channels, logs and protections from one centralized flow.", dashboard_feature_stats: "Check the status and activity of your NekroNex tools.", dashboard_bot_config_label: "BOT CONFIGURATION", dashboard_bot_config_title: "Choose what each system needs.", dashboard_bot_welcome: "Welcome, goodbye, logs and automatic role channels.", dashboard_bot_music: "Music channel, DJ role, queue limit and default volume.", dashboard_bot_guard: "Log channel, language, Anti-Raid, Anti-Nuke and trusted administrators.", dashboard_bot_tickets: "Ticket category, staff role and transcript channel." },
        pt: { nav_resources: "Recursos", nav_legal: "Legal", nav_community: "Comunidade", nav_product_overview: "Visão geral", nav_quick_start: "Guia rápido", nav_dashboard: "Abrir Dashboard", collaborations_label: "FUTURAS COLABORAÇÕES", collaborations_title: "Construindo com quem compartilha a visão.", collaborations_description: "Um espaço para futuros criadores, comunidades de Minecraft e projetos de segurança que queiram criar experiências mais seguras no Discord.", collaboration_status: "EM BREVE", collaboration_streamer_title: "Colaboração com streamer", collaboration_streamer_description: "Uma futura parceria para conectar conteúdo, ferramentas da comunidade e uma experiência refinada no Discord.", collaboration_minecraft_title: "Comunidade de Minecraft", collaboration_minecraft_description: "Uma futura parceria focada em servidores, comunidades, moderação e segurança no Discord.", collaboration_details: "Detalhes serão anunciados em breve", dashboard_control_label: "CONTROLE CENTRAL", dashboard_features_title: "Todo o seu ecossistema em um só painel.", dashboard_feature_config_title: "⚙️ Configuração", dashboard_feature_security_title: "🛡️ Segurança", dashboard_feature_stats_title: "📊 Estatísticas", dashboard_feature_config: "Selecione seu servidor e configure cada bot conforme suas necessidades.", dashboard_feature_security: "Administre cargos, canais, logs e proteções em um fluxo centralizado.", dashboard_feature_stats: "Consulte o estado e a atividade das ferramentas NekroNex.", dashboard_bot_config_label: "CONFIGURAÇÃO POR BOT", dashboard_bot_config_title: "Escolha o que cada sistema precisa.", dashboard_bot_welcome: "Canais de boas-vindas, despedidas, logs e cargo automático.", dashboard_bot_music: "Canal de música, cargo DJ, limite da fila e volume padrão.", dashboard_bot_guard: "Canal de logs, idioma, Anti-Raid, Anti-Nuke e administradores confiáveis.", dashboard_bot_tickets: "Categoria de tickets, cargo da equipe e canal de transcripts." },
        de: { nav_resources: "Ressourcen", nav_legal: "Rechtliches", nav_community: "Community", nav_product_overview: "Übersicht", nav_quick_start: "Schnellstart", nav_dashboard: "Dashboard öffnen", collaborations_label: "ZUKÜNFTIGE KOLLABORATIONEN", collaborations_title: "Gemeinsam mit Menschen, die dieselbe Vision teilen.", collaborations_description: "Ein Bereich für zukünftige Creator, Minecraft-Communities und Sicherheitsprojekte, die gemeinsam sichere Discord-Erlebnisse entwickeln möchten.", collaboration_status: "DEMNÄCHST", collaboration_streamer_title: "Streamer-Kollaboration", collaboration_streamer_description: "Eine zukünftige Partnerschaft für Inhalte, Community-Werkzeuge und ein hochwertiges Discord-Erlebnis.", collaboration_minecraft_title: "Minecraft-Community", collaboration_minecraft_description: "Eine zukünftige Partnerschaft für Server, Communities, Moderation und Discord-Sicherheit.", collaboration_details: "Details werden bald bekannt gegeben" },
        fr: { nav_resources: "Ressources", nav_legal: "Mentions légales", nav_community: "Communauté", nav_product_overview: "Aperçu", nav_quick_start: "Démarrage rapide", nav_dashboard: "Ouvrir le Dashboard", collaborations_label: "COLLABORATIONS FUTURES", collaborations_title: "Construire avec celles et ceux qui partagent la vision.", collaborations_description: "Un espace pour les futurs créateurs, communautés Minecraft et projets de sécurité souhaitant construire des expériences Discord plus sûres ensemble.", collaboration_status: "BIENTÔT DISPONIBLE", collaboration_streamer_title: "Collaboration avec un streamer", collaboration_streamer_description: "Un futur partenariat pour réunir contenu, outils communautaires et expérience Discord soignée.", collaboration_minecraft_title: "Communauté Minecraft", collaboration_minecraft_description: "Un futur partenariat autour des serveurs, des communautés, de la modération et de la sécurité Discord.", collaboration_details: "Les détails seront annoncés bientôt" }
    };
    Object.keys(interfaceTranslations).forEach((language) => {
        if (typeof translations !== "undefined" && translations[language]) Object.assign(translations[language], interfaceTranslations[language]);
    });

    const dashboardInterfaceTranslations = {
        de: { dashboard_control_label: "ZENTRALE STEUERUNG", dashboard_features_title: "Dein gesamtes Ökosystem in einem Panel.", dashboard_feature_config_title: "⚙️ Einrichtung", dashboard_feature_security_title: "🛡️ Sicherheit", dashboard_feature_stats_title: "📊 Statistiken", dashboard_feature_config: "Wähle deinen Server und konfiguriere jeden Bot passend zu seinen Aufgaben.", dashboard_feature_security: "Verwalte Rollen, Kanäle, Logs und Schutzfunktionen zentral.", dashboard_feature_stats: "Prüfe den Status und die Aktivität deiner NekroNex-Werkzeuge.", dashboard_bot_config_label: "BOT-KONFIGURATION", dashboard_bot_config_title: "Wähle, was jedes System benötigt.", dashboard_bot_welcome: "Willkommens- und Abschiedskanal, Logs und automatische Rolle.", dashboard_bot_music: "Musikkanal, DJ-Rolle, Warteschlangenlimit und Standardlautstärke.", dashboard_bot_guard: "Log-Kanal, Sprache, Anti-Raid, Anti-Nuke und vertrauenswürdige Administratoren.", dashboard_bot_tickets: "Ticket-Kategorie, Support-Rolle und Transkript-Kanal." },
        fr: { dashboard_control_label: "CONTRÔLE CENTRAL", dashboard_features_title: "Tout votre écosystème dans un seul panneau.", dashboard_feature_config_title: "⚙️ Configuration", dashboard_feature_security_title: "🛡️ Sécurité", dashboard_feature_stats_title: "📊 Statistiques", dashboard_feature_config: "Sélectionnez votre serveur et configurez chaque bot selon ses besoins.", dashboard_feature_security: "Gérez les rôles, les salons, les logs et les protections depuis un espace centralisé.", dashboard_feature_stats: "Consultez l’état et l’activité de vos outils NekroNex.", dashboard_bot_config_label: "CONFIGURATION DES BOTS", dashboard_bot_config_title: "Choisissez les besoins de chaque système.", dashboard_bot_welcome: "Salon de bienvenue, de départ, logs et rôle automatique.", dashboard_bot_music: "Salon musical, rôle DJ, limite de file d’attente et volume par défaut.", dashboard_bot_guard: "Salon de logs, langue, Anti-Raid, Anti-Nuke et administrateurs de confiance.", dashboard_bot_tickets: "Catégorie de tickets, rôle du staff et salon des transcriptions." }
    };
    Object.keys(dashboardInterfaceTranslations).forEach((language) => {
        if (typeof translations !== "undefined" && translations[language]) Object.assign(translations[language], dashboardInterfaceTranslations[language]);
    });

    const catalogInterfaceTranslations = {
        de: { products_label: "UNSERE PRODUKTE", products_title: "Werkzeuge für deine Community.", products_description: "Ein wachsendes Ökosystem leistungsstarker Discord-Werkzeuge, die perfekt zusammenspielen.", available: "VERFÜGBAR", music_description: "Eine vollständige Musikerfahrung für Discord. Spiele Songs, verwalte Warteschlangen, erstelle Playlists und steuere alles bequem.", welcome_description: "Automatisiere Begrüßungen und Abschiede für einen besseren ersten Eindruck deiner Community.", guard_description: "Sicherheits- und Moderationswerkzeuge für sicherere Discord-Communities.", tickets_description: "Professioneller Support und Ticketverwaltung für Discord-Communities.", dashboard_description: "Ein zentraler Ort für dein gesamtes NYVEX-Ökosystem.", explore_music: "NEXORA entdecken →", explore_welcome: "NYVEX Welcome entdecken →", explore_guard: "KRYVEX entdecken →", explore_ticket: "VELTRIX entdecken →", explore_dashboard: "Dashboard öffnen →" },
        fr: { products_label: "NOS PRODUITS", products_title: "Des outils créés pour votre communauté.", products_description: "Un écosystème grandissant d’outils Discord puissants, conçus pour fonctionner ensemble.", available: "DISPONIBLE", music_description: "Une expérience musicale complète pour Discord. Écoutez des morceaux, gérez les files, créez des playlists et gardez le contrôle simplement.", welcome_description: "Automatisez les arrivées et les départs pour offrir une meilleure première impression à votre communauté.", guard_description: "Des outils de sécurité et de modération pour des communautés Discord plus sûres.", tickets_description: "Un support professionnel et une gestion des tickets pour les communautés Discord.", dashboard_description: "Un espace unique pour gérer tout votre écosystème NYVEX.", explore_music: "Découvrir NEXORA →", explore_welcome: "Découvrir NYVEX Welcome →", explore_guard: "Découvrir KRYVEX →", explore_ticket: "Découvrir VELTRIX →", explore_dashboard: "Ouvrir le Dashboard →" }
    };
    Object.keys(catalogInterfaceTranslations).forEach((language) => {
        if (typeof translations !== "undefined" && translations[language]) Object.assign(translations[language], catalogInterfaceTranslations[language]);
    });
    const documentationLabelTranslations = { es: "Abrir documentación", en: "Open documentation", pt: "Abrir documentação", de: "Dokumentation öffnen", fr: "Ouvrir la documentation" };
    Object.keys(documentationLabelTranslations).forEach((language) => {
        if (typeof translations !== "undefined" && translations[language]) translations[language].open_documentation = documentationLabelTranslations[language];
    });
    const collaborationPlatformTranslations = {
        es: { collaboration_twitch_title: "Colaboración con streamer de Twitch", collaboration_twitch_description: "Una futura colaboración con creadores de Twitch para conectar contenido, herramientas de comunidad y una experiencia de Discord cuidada." },
        en: { collaboration_twitch_title: "Twitch streamer collaboration", collaboration_twitch_description: "A future partnership with Twitch creators to connect content, community tools and a polished Discord experience." },
        pt: { collaboration_twitch_title: "Colaboração com streamer da Twitch", collaboration_twitch_description: "Uma futura parceria com criadores da Twitch para conectar conteúdo, ferramentas da comunidade e uma experiência refinada no Discord." },
        de: { collaboration_twitch_title: "Zusammenarbeit mit Twitch-Streamern", collaboration_twitch_description: "Eine zukünftige Partnerschaft mit Twitch-Creatorn für Inhalte, Community-Werkzeuge und ein hochwertiges Discord-Erlebnis." },
        fr: { collaboration_twitch_title: "Collaboration avec un streamer Twitch", collaboration_twitch_description: "Un futur partenariat avec des créateurs Twitch pour réunir contenu, outils communautaires et expérience Discord soignée." }
    };
    Object.keys(collaborationPlatformTranslations).forEach((language) => {
        if (typeof translations !== "undefined" && translations[language]) Object.assign(translations[language], collaborationPlatformTranslations[language]);
    });

    /* Textos estructurales que también aparecen en páginas antiguas. Se
       centralizan aquí para que ninguna vista pueda quedar parcialmente en
       inglés al cambiar el idioma. */
    const missingInterfaceTranslations = {
        es: { platform_label: "EL ENFOQUE NEKRONEX", platform_title: "Todo conectado, sin ruido.", platform_description: "Una capa de control clara para comunidades que quieren más orden, control y menos fricción.", platform_card_01_title: "Un ecosistema", platform_card_01_description: "Bienvenida, música, seguridad, tickets y alertas multimedia diseñados como una sola familia.", platform_card_02_title: "Configuración clara", platform_card_02_description: "Elige tu servidor y configura la experiencia desde un panel visual en tu idioma.", platform_card_03_title: "Listo para crecer", platform_card_03_description: "Empieza con lo esencial y añade sistemas NYVEX a medida que tu comunidad evoluciona.", workflow_label: "CÓMO FUNCIONA", workflow_title: "Del primer clic a una mejor comunidad.", workflow_description: "Conecta tu cuenta de Discord, elige un servidor y deja que el ecosistema te guíe durante la configuración.", workflow_step_01: "Conecta tu cuenta", workflow_step_02: "Selecciona un servidor", workflow_step_03: "Elige los sistemas que necesitas", workflow_step_04: "Configura y lanza" },
        en: { platform_label: "THE NEKRONEX APPROACH", platform_title: "Everything connected, without the noise.", platform_description: "A focused control layer for communities that want more clarity, more control and less friction.", platform_card_01_title: "One ecosystem", platform_card_01_description: "Welcome, music, security, tickets and media alerts designed to feel like one family.", platform_card_02_title: "Clear configuration", platform_card_02_description: "Choose your server and configure the experience from a visual panel that speaks your language.", platform_card_03_title: "Ready to grow", platform_card_03_description: "Start small and add more NYVEX systems as your community evolves.", workflow_label: "HOW IT WORKS", workflow_title: "From first click to a better community.", workflow_description: "Connect your Discord account, choose a server and let the ecosystem guide the setup.", workflow_step_01: "Connect your account", workflow_step_02: "Select a server", workflow_step_03: "Choose the systems you need", workflow_step_04: "Configure and launch" },
        pt: { platform_label: "A ABORDAGEM NEKRONEX", platform_title: "Tudo conectado, sem ruído.", platform_description: "Uma camada de controle clara para comunidades que querem mais organização, controle e menos atrito.", platform_card_01_title: "Um ecossistema", platform_card_01_description: "Boas-vindas, música, segurança, tickets e alertas de mídia pensados como uma só família.", platform_card_02_title: "Configuração clara", platform_card_02_description: "Escolha seu servidor e configure a experiência em um painel visual no seu idioma.", platform_card_03_title: "Pronto para crescer", platform_card_03_description: "Comece pelo essencial e adicione sistemas NYVEX conforme sua comunidade evolui.", workflow_label: "COMO FUNCIONA", workflow_title: "Do primeiro clique a uma comunidade melhor.", workflow_description: "Conecte sua conta do Discord, escolha um servidor e deixe o ecossistema orientar a configuração.", workflow_step_01: "Conecte sua conta", workflow_step_02: "Selecione um servidor", workflow_step_03: "Escolha os sistemas necessários", workflow_step_04: "Configure e lance" },
        de: { platform_label: "DER NEKRONEX-ANSATZ", platform_title: "Alles verbunden, ohne unnötigen Lärm.", platform_description: "Eine klare Kontrollebene für Communities, die mehr Übersicht, Kontrolle und weniger Reibung wünschen.", platform_card_01_title: "Ein Ökosystem", platform_card_01_description: "Willkommen, Musik, Sicherheit, Tickets und Medienalarme als zusammengehörige Werkzeuge.", platform_card_02_title: "Klare Einrichtung", platform_card_02_description: "Wähle deinen Server und konfiguriere alles über ein visuelles Panel in deiner Sprache.", platform_card_03_title: "Bereit zum Wachsen", platform_card_03_description: "Starte mit dem Wesentlichen und füge weitere NYVEX-Systeme hinzu, wenn deine Community wächst.", workflow_label: "SO FUNKTIONIERT ES", workflow_title: "Vom ersten Klick zur besseren Community.", workflow_description: "Verbinde dein Discord-Konto, wähle einen Server und lass dich durch die Einrichtung führen.", workflow_step_01: "Konto verbinden", workflow_step_02: "Server auswählen", workflow_step_03: "Benötigte Systeme auswählen", workflow_step_04: "Konfigurieren und starten" },
        fr: { platform_label: "L’APPROCHE NEKRONEX", platform_title: "Tout connecté, sans bruit.", platform_description: "Une couche de contrôle claire pour les communautés qui veulent plus de clarté, de contrôle et moins de friction.", platform_card_01_title: "Un écosystème", platform_card_01_description: "Accueil, musique, sécurité, tickets et alertes média conçus comme une seule famille.", platform_card_02_title: "Configuration claire", platform_card_02_description: "Choisissez votre serveur et configurez l’expérience depuis un panneau visuel dans votre langue.", platform_card_03_title: "Prêt à évoluer", platform_card_03_description: "Commencez simplement et ajoutez des systèmes NYVEX au fil de la croissance de votre communauté.", workflow_label: "COMMENT ÇA MARCHE", workflow_title: "Du premier clic à une meilleure communauté.", workflow_description: "Connectez votre compte Discord, choisissez un serveur et laissez l’écosystème vous guider.", workflow_step_01: "Connecter votre compte", workflow_step_02: "Sélectionner un serveur", workflow_step_03: "Choisir les systèmes nécessaires", workflow_step_04: "Configurer et lancer" }
    };
    Object.keys(missingInterfaceTranslations).forEach((language) => {
        if (typeof translations !== "undefined" && translations[language]) Object.assign(translations[language], missingInterfaceTranslations[language]);
    });

    const languageToggle =
        document.getElementById("language-toggle");

    const languageMenu =
        document.getElementById("language-menu");

    const languageCurrent =
        document.getElementById("language-current");

    const savedLanguage =
        localStorage.getItem("nyvex-language") || "es";


    let currentLanguage = savedLanguage;


    /* ========================================
       TRANSLATE PAGE
       ======================================== */

    function translatePage(language) {

        if (
            typeof translations === "undefined" ||
            !translations[language]
        ) {
            language = "es";
        }


        currentLanguage = language;
        updateSupportCopy(language);


        document.documentElement.lang =
            language === "pt" ? "pt-BR" : language;


        const elements =
            document.querySelectorAll("[data-i18n]");


        elements.forEach((element) => {

            const key =
                element.getAttribute("data-i18n");


            if (
                !translations[language][key]
            ) {
                return;
            }


            const value =
                translations[language][key];


            if (
                element.hasAttribute("data-i18n-html")
            ) {

                element.innerHTML = value;

            } else {

                element.textContent = value;

            }

        });


        /* ========================================
           UPDATE LANGUAGE INDICATOR
           ======================================== */

        if (languageCurrent) {

            const flags = { es: "flag-es", en: "flag-us", pt: "flag-br", de: "flag-de", fr: "flag-fr" };
            languageCurrent.innerHTML = `<span class="flag ${flags[language] || flags.es}" aria-hidden="true"></span>`;

        }


        /* ========================================
           SAVE LANGUAGE
           ======================================== */

        localStorage.setItem(
            "nyvex-language",
            language
        );

    }


    /* ========================================
       OPEN / CLOSE LANGUAGE MENU
       ======================================== */

    if (
        languageToggle &&
        languageSelector
    ) {

        languageToggle.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                languageSelector.classList.toggle(
                    "open"
                );

            }
        );


        document.addEventListener(
            "click",
            () => {

                languageSelector.classList.remove(
                    "open"
                );

            }
        );


        languageMenu?.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );

    }


    /* ========================================
       LANGUAGE OPTIONS
       ======================================== */

    document
        .querySelectorAll("[data-language]")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const language =
                        button.getAttribute(
                            "data-language"
                        );


                    translatePage(language);


                    if (languageSelector) {

                        languageSelector.classList.remove(
                            "open"
                        );

                    }

                }
            );

        });


    /* ========================================
       INITIAL LANGUAGE
       ======================================== */

    translatePage(savedLanguage);

    /* ========================================
       CLICK-TOGGLE NAVIGATION
       ======================================== */

    const navGroups = [...document.querySelectorAll(".nav-menu-group")];
    const closeNavGroups = (except = null) => navGroups.forEach((group) => {
        if (group !== except) {
            group.classList.remove("open");
            group.querySelector(".nav-menu-trigger")?.setAttribute("aria-expanded", "false");
        }
    });
    navGroups.forEach((group) => {
        const trigger = group.querySelector(".nav-menu-trigger");
        trigger?.addEventListener("click", (event) => {
            event.stopPropagation();
            const open = group.classList.toggle("open");
            closeNavGroups(open ? group : null);
            trigger.setAttribute("aria-expanded", String(open));
        });
    });
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".nav-menu-group")) closeNavGroups();
    });


    /* ========================================
       SMOOTH SCROLL
       ======================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* ========================================
       MOBILE MENU
       ======================================== */

    const mobileMenuButton =
        document.getElementById(
            "mobile-menu-button"
        );


    const mobileMenu =
        document.getElementById(
            "mobile-menu"
        );


    if (
        mobileMenuButton &&
        mobileMenu
    ) {

        mobileMenuButton.addEventListener(
            "click",
            () => {
                const isOpen = mobileMenu.classList.toggle("active");
                mobileMenuButton.setAttribute("aria-expanded", String(isOpen));

            }
        );

    }


    /* ========================================
       CLOSE MOBILE MENU
       ======================================== */

    if (mobileMenu) {

        mobileMenu
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu.classList.remove(
                            "active"
                        );
                        mobileMenuButton?.setAttribute("aria-expanded", "false");

                    }
                );

            });

    }

});
