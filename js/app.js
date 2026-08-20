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
        const palette = ["#d4af37", "#8a7cff", "#00e5ff", "#62d69b"];
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
            radius: Math.random() * 1.7 + .45,
            speed: Math.random() * .18 + .05,
            drift: (Math.random() - .5) * .12,
            alpha: Math.random() * .45 + .18,
            color: palette[Math.floor(Math.random() * palette.length)]
        });

        const resetParticles = () => {
            particles.length = 0;
            const amount = Math.min(145, Math.max(55, Math.floor((width * height) / 12500)));
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
                <button class="language-button" id="language-toggle" type="button" aria-label="Select language">🌐 <span class="language-current" id="language-current">ES</span> ▾</button>
                <div class="language-menu" id="language-menu">
                    <button type="button" data-language="es">🇪🇸 Español</button>
                    <button type="button" data-language="en">🇺🇸 English</button>
                    <button type="button" data-language="pt">🇧🇷 Português Brasileiro</button>
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

    const supportWidget = document.createElement("aside");
    supportWidget.className = "support-widget";
    supportWidget.setAttribute("aria-label", "Soporte NEKRONEX");
    supportWidget.innerHTML = `
        <section class="support-panel" hidden>
            <div class="support-panel-header">
                <div class="support-avatar">✦</div>
                <div><strong data-support="title">Soporte NEKRONEX</strong><small data-support="response">Normalmente respondemos en 24 horas</small></div>
                <button class="support-close" type="button" aria-label="Cerrar soporte" data-support="close">×</button>
            </div>
            <p class="support-greeting" data-support="greeting">Hola. ¿En qué podemos ayudarte?</p>
            <div class="support-status"><span></span> <span data-support="status">Atención por correo disponible</span></div>
            <a class="support-ticket" data-support="ticket" href="mailto:nekronex.support@gmail.com?subject=Soporte%20NEKRONEX">Abrir nuevo ticket</a>
            <div class="support-links"><a data-support="general" href="mailto:nekronex.official@gmail.com">Contacto general</a><span>·</span><a data-support="privacy" href="${window.location.pathname.includes("/pages/") ? "../legal/" : "pages/legal/"}privacy.html">Privacidad</a></div>
        </section>
        <button class="support-launcher" type="button" aria-expanded="false" aria-label="Abrir soporte" data-support="open"><span>✦</span></button>`;
    document.body.appendChild(supportWidget);

    const supportPanel = supportWidget.querySelector(".support-panel");
    const supportLauncher = supportWidget.querySelector(".support-launcher");
    const toggleSupport = (open) => {
        supportPanel.hidden = !open;
        supportWidget.classList.toggle("is-open", open);
        supportLauncher.setAttribute("aria-expanded", String(open));
    };
    supportLauncher.addEventListener("click", () => toggleSupport(supportPanel.hidden));
    supportWidget.querySelector(".support-close").addEventListener("click", () => toggleSupport(false));

    const supportCopy = {
        es: { title: "Soporte NEKRONEX", response: "Normalmente respondemos en 24 horas", close: "Cerrar soporte", greeting: "Hola. ¿En qué podemos ayudarte?", status: "Atención por correo disponible", ticket: "Abrir nuevo ticket", general: "Contacto general", privacy: "Privacidad", open: "Abrir soporte" },
        en: { title: "NEKRONEX Support", response: "We usually reply within 24 hours", close: "Close support", greeting: "Hello. How can we help you?", status: "Email support available", ticket: "Open a new ticket", general: "General contact", privacy: "Privacy", open: "Open support" },
        pt: { title: "Suporte NEKRONEX", response: "Normalmente respondemos em 24 horas", close: "Fechar suporte", greeting: "Olá. Como podemos ajudar?", status: "Atendimento por e-mail disponível", ticket: "Abrir novo ticket", general: "Contato geral", privacy: "Privacidade", open: "Abrir suporte" }
    };
    const updateSupportCopy = (language) => {
        const copy = supportCopy[language] || supportCopy.es;
        supportWidget.querySelectorAll("[data-support]").forEach((element) => {
            const key = element.getAttribute("data-support");
            if (copy[key]) element.textContent = copy[key];
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
        es: { nav_resources: "Recursos", nav_legal: "Legal", nav_community: "Comunidad", nav_product_overview: "Resumen", nav_quick_start: "Guía rápida", nav_dashboard: "Abrir Dashboard", collaborations_label: "FUTURAS COLABORACIONES", collaborations_title: "Construyamos con quienes comparten la visión.", collaborations_description: "Un espacio para futuros creadores, comunidades de Minecraft y proyectos de seguridad que quieran crear experiencias más seguras en Discord.", collaboration_status: "PRÓXIMAMENTE", collaboration_streamer_title: "Colaboración con streamer", collaboration_streamer_description: "Una futura colaboración para conectar contenido, herramientas de comunidad y una experiencia de Discord cuidada.", collaboration_minecraft_title: "Comunidad de Minecraft", collaboration_minecraft_description: "Una futura colaboración centrada en servidores, comunidades, moderación y seguridad en Discord.", collaboration_details: "Los detalles se anunciarán pronto" },
        en: { nav_resources: "Resources", nav_legal: "Legal", nav_community: "Community", nav_product_overview: "Overview", nav_quick_start: "Quick start", nav_dashboard: "Open Dashboard", collaborations_label: "FUTURE COLLABORATIONS", collaborations_title: "Built with people who share the vision.", collaborations_description: "A dedicated space for future creators, Minecraft communities and security projects that want to build safer Discord experiences together.", collaboration_status: "COMING SOON", collaboration_streamer_title: "Streamer collaboration", collaboration_streamer_description: "A future creator partnership to connect content, community tools and a polished Discord experience.", collaboration_minecraft_title: "Minecraft community", collaboration_minecraft_description: "A future partnership focused on servers, communities, moderation and Discord security.", collaboration_details: "Details will be announced soon" },
        pt: { nav_resources: "Recursos", nav_legal: "Legal", nav_community: "Comunidade", nav_product_overview: "Visão geral", nav_quick_start: "Guia rápido", nav_dashboard: "Abrir Dashboard", collaborations_label: "FUTURAS COLABORAÇÕES", collaborations_title: "Construindo com quem compartilha a visão.", collaborations_description: "Um espaço para futuros criadores, comunidades de Minecraft e projetos de segurança que queiram criar experiências mais seguras no Discord.", collaboration_status: "EM BREVE", collaboration_streamer_title: "Colaboração com streamer", collaboration_streamer_description: "Uma futura parceria para conectar conteúdo, ferramentas da comunidade e uma experiência refinada no Discord.", collaboration_minecraft_title: "Comunidade de Minecraft", collaboration_minecraft_description: "Uma futura parceria focada em servidores, comunidades, moderação e segurança no Discord.", collaboration_details: "Detalhes serão anunciados em breve" }
    };
    Object.keys(interfaceTranslations).forEach((language) => {
        if (typeof translations !== "undefined" && translations[language]) Object.assign(translations[language], interfaceTranslations[language]);
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

            languageCurrent.textContent =
                language === "es" ? "ES" : language === "pt" ? "PT-BR" : "EN";

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

