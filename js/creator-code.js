"use strict";

/* =========================================
   CREATOR CODE SYSTEM
========================================= */

function getActiveCreatorCode() {

    if (!currentUser) return null;

    return currentUser.activeCreatorCode || null;
}

function setActiveCreatorCode(code) {

    if (!currentUser) return;

    currentUser.activeCreatorCode =
        code ? code.toUpperCase().trim() : null;

    saveUser();
}

function calculateDiscountedPrice(basePrice) {

    const code = getActiveCreatorCode();
    const info = getCreatorCodeInfo(code);

    if (!info) {
        return {
            original: basePrice,
            final: basePrice,
            discount: 0,
            code: null
        };
    }

    const final =
        Math.round(basePrice * (1 - info.discount / 100));

    return {
        original: basePrice,
        final,
        discount: info.discount,
        code: code.toUpperCase()
    };
}

function applyCreatorCode(codeInput) {

    if (!currentUser) {

        requireLogin();

        return false;
    }

    const code =
        (typeof codeInput === "string"
            ? codeInput
            : document.getElementById("creatorCodeInput")?.value || ""
        ).trim();

    if (!code) {

        showPopup("Bitte gib einen Creator-Code ein.", "warning");

        return false;
    }

    const info = getCreatorCodeInfo(code);

    if (!info) {

        showPopup("Dieser Creator-Code ist ungültig.", "error");

        return false;
    }

    setActiveCreatorCode(code);

    showPopup(info.label + " aktiviert! 🎉", "success");

    updateTutorPriceDisplay();

    return true;
}

function updateTutorPriceDisplay() {

    const priceEl = document.querySelector(".price-card .price");

    if (!priceEl || !window.currentTutorPrice) return;

    const pricing =
        calculateDiscountedPrice(window.currentTutorPrice);

    if (pricing.discount > 0) {

        priceEl.innerHTML =
            `<s>${pricing.original}€</s> ${pricing.final}€ <span>/ Stunde</span>`;

    } else {

        priceEl.innerHTML =
            `${pricing.original}€ <span>/ Stunde</span>`;
    }

    const hint = document.getElementById("creatorCodeStatus");

    if (hint) {

        hint.style.display = pricing.discount > 0 ? "block" : "none";

        hint.innerText =
            pricing.discount > 0
                ? `${pricing.discount}% Rabatt mit Code ${getActiveCreatorCode()}`
                : "";
    }
}

function updateCreatorCodeUI() {

    const box = document.getElementById("creatorCodeBox");
    const loginHint = document.getElementById("creatorCodeLoginHint");
    const input = document.getElementById("creatorCodeInput");

    if (!box && !loginHint) return;

    if (!currentUser) {

        if (box) box.style.display = "none";
        if (loginHint) loginHint.style.display = "block";
        if (input) input.value = "";

        updateTutorPriceDisplay();

        return;
    }

    if (box) box.style.display = "block";
    if (loginHint) loginHint.style.display = "none";

    if (input && currentUser.activeCreatorCode) {
        input.value = currentUser.activeCreatorCode;
    }

    updateTutorPriceDisplay();
}

function initCreatorCodeUI() {

    const btn = document.getElementById("applyCreatorCode");

    if (!btn || btn.dataset.bound) return;

    btn.dataset.bound = "true";

    btn.addEventListener("click", () => applyCreatorCode());

    updateCreatorCodeUI();
}
