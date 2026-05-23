"use strict";

/* =========================================
   COOKIE-EINWILLIGUNG (localStorage)
========================================= */

const COOKIE_CONSENT_KEY = "cookieConsent";

function getCookieConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
}

function setCookieConsent(value) {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
}

function acceptAllCookies() {

    setCookieConsent("all");

    hideCookieBanner();

    if (typeof showPopup === "function") {
        showPopup("Cookie-Einstellungen gespeichert. Danke! 🍪", "success");
    }
}

function acceptNecessaryCookies() {

    setCookieConsent("necessary");

    hideCookieBanner();

    if (typeof showPopup === "function") {
        showPopup("Nur notwendige Speicherung aktiviert.", "info");
    }
}

function hideCookieBanner() {

    const banner = document.getElementById("cookieBanner");

    if (banner) {
        banner.classList.remove("show");
    }
}

function showCookieBanner() {

    let banner = document.getElementById("cookieBanner");

    if (!banner) {
        banner = createCookieBanner();
        document.body.appendChild(banner);
    }

    banner.classList.add("show");
}

function createCookieBanner() {

    const banner = document.createElement("div");

    banner.id = "cookieBanner";
    banner.className = "cookie-banner";

    banner.innerHTML = `
        <div class="cookie-banner-inner">
            <div class="cookie-banner-text">
                <h3><i class="fa-solid fa-cookie-bite"></i> Cookies & Speicherung</h3>
                <p>
                    Tutorlink speichert Daten lokal in deinem Browser (localStorage),
                    z. B. für Login, Favoriten und Buchungen. Keine Tracking-Cookies.
                    <a href="datenschutz.html">Mehr in der Datenschutzerklärung</a>
                </p>
            </div>
            <div class="cookie-banner-actions">
                <button type="button" class="btn secondary" onclick="acceptNecessaryCookies()">
                    Nur notwendige
                </button>
                <button type="button" class="btn" onclick="acceptAllCookies()">
                    Alle akzeptieren
                </button>
            </div>
        </div>
    `;

    return banner;
}

function initCookieFooterLink() {

    document.querySelectorAll("footer").forEach(footer => {

        if (footer.querySelector(".cookie-settings-link")) return;

        const link = document.createElement("a");

        link.href = "#";
        link.className = "cookie-settings-link";
        link.innerText = "Cookie-Einstellungen";
        link.addEventListener("click", e => {
            e.preventDefault();
            showCookieBanner();
        });

        const impressum = footer.querySelector('a[href="impressum.html"]');

        if (impressum) {
            impressum.after(link);
        } else {
            footer.insertBefore(link, footer.querySelector("p"));
        }
    });
}

function initCookieConsent() {

    initCookieFooterLink();

    if (!getCookieConsent()) {
        showCookieBanner();
    }
}

document.addEventListener("DOMContentLoaded", () => {

    initCookieConsent();
});
