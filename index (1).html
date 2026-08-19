document.addEventListener("DOMContentLoaded", () => {

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
            language;


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
                language === "es"
                    ? "ES"
                    : "EN";

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