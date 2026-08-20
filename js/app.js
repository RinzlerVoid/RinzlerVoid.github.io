document.addEventListener("DOMContentLoaded", () => {

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

    /* Chimes sutiles estilo ópera para tarjetas y botones. Se generan localmente
       con Web Audio; no hay archivos externos ni reproducción automática. */
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
            ? [392.00, 523.25, 659.25, 783.99]
            : [523.25, 659.25, 783.99];
        notes.forEach((frequency, index) => {
            const oscillator = chimeContext.createOscillator();
            const gain = chimeContext.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.0001, start + index * 0.055);
            gain.gain.exponentialRampToValueAtTime(kind === "click" ? 0.028 : 0.022, start + index * 0.055 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.055 + (kind === "click" ? 0.34 : 0.26));
            oscillator.connect(gain).connect(chimeContext.destination);
            oscillator.start(start + index * 0.055);
            oscillator.stop(start + index * 0.055 + (kind === "click" ? 0.36 : 0.28));
        });
    };
    document.querySelectorAll(".product-card, .future-card, .button, .product-link").forEach((element) => {
        element.addEventListener("mouseenter", () => playChime("hover"), { passive: true });
        element.addEventListener("click", () => playChime("click"), { passive: true });
    });

    /* ========================================
       NYVEX • LANGUAGE SYSTEM
       ======================================== */

    const languageSelector =
        document.querySelector(".language-selector");

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

                mobileMenu.classList.toggle(
                    "active"
                );

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

                    }
                );

            });

    }

});
