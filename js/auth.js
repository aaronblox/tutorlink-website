"use strict";

/* =========================================
   GLOBAL STATE (AUTH)
========================================= */

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

if (currentUser) {
    currentUser = normalizeUser(currentUser);
}

/* =========================================
   HELPERS
========================================= */

const qs = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);

function normalizeUser(user) {
    user.favorites = user.favorites || [];
    user.ratings = user.ratings || {};
    user.bookings = user.bookings || [];
    user.messages = user.messages || [];
    return user;
}

/* =========================================
   AUTH
========================================= */

function registerUser() {

    const name =
        qs("#regName").value.trim();

    const email =
        qs("#regEmail").value
            .trim()
            .toLowerCase();

    const pass =
        qs("#regPass").value.trim();

    if (!name || !email || !pass) {

        showPopup("Bitte alle Felder ausfüllen.", "error");

        return;
    }

    if (users.find(u => u.email === email)) {

        showPopup("Diese E-Mail existiert bereits.", "error");

        return;
    }

    const user = normalizeUser({
        id: Date.now(),
        name,
        email,
        pass,
        favorites: [],
        ratings: {},
        bookings: [],
        messages: []
    });

    users.push(user);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    showPopup("Registrierung erfolgreich. Melden Sie sich jetzt an!", "success");

    closeRegister();

    setTimeout(openLogin, 1000);
}

function loginUser() {

    const email =
        qs("#loginEmail").value
            .trim()
            .toLowerCase();

    const pass =
        qs("#loginPass").value.trim();

    const found =
        users.find(
            u =>
                u.email === email &&
                u.pass === pass
        );

    if (!found) {

        showPopup("Login fehlgeschlagen. Überprüfen Sie Ihre Anmeldedaten.", "error");

        return;
    }

    currentUser = normalizeUser(found);

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    updateUI();

    loadFavoritesUI();

    updateRatingStarsState();

    updateDashboardPage();

    closeLogin();

    showPopup("Willkommen " + currentUser.name + "! 🎉", "success");
}

function logoutUser() {

    currentUser = null;

    localStorage.removeItem("currentUser");

    updateUI();

    loadFavoritesUI();

    updateRatingStarsState();

    updateDashboardPage();

    showPopup("Erfolgreich ausgeloggt.", "success");
}

function saveUser() {

    users = users.map(u =>

        u.email === currentUser.email
            ? currentUser
            : u
    );

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );
}

function requireLogin() {

    showPopup("Bitte melden Sie sich zuerst an.", "warning");

    setTimeout(openLogin, 500);
}

function goToMeineKurse() {
    window.location.href = "meine-kurse.html";
}

/* =========================================
   UI
========================================= */

function updateUI() {

    const area = qs("#authArea");

    if (!area) return;

    if (!currentUser) {

        area.innerHTML = `
            <button class="login" onclick="openLogin()">
                Anmelden
            </button>

            <button class="register" onclick="openRegister()">
                Registrieren
            </button>
        `;

    } else {

        area.innerHTML = `
            <button class="login" onclick="goToMeineKurse()">
                Meine Kurse
            </button>

            <button class="register" onclick="logoutUser()">
                Logout
            </button>
        `;
    }

    if (typeof updateTutorApplyHint === "function") {
        updateTutorApplyHint();
    }

    if (typeof updateCreatorCodeUI === "function") {
        updateCreatorCodeUI();
    }
}

function bookTutor(tutorName) {
    if (!currentUser) {
        requireLogin();
        return;
    }

    if (currentUser.bookings.some(b =>
        (typeof b === "object" && b.tutorName === tutorName) ||
        (typeof b === "string" && b.includes(tutorName))
    )) {
        showPopup("Du hast bereits eine Session mit " + tutorName + " angefordert.", "warning");
        return;
    }

    const tutorId = getTutorIdByName(tutorName);
    const tutor = tutorId ? tutorData[tutorId] : null;
    const basePrice = tutor ? tutor.price : 0;
    const pricing = calculateDiscountedPrice(basePrice);

    currentUser.bookings.push({
        tutorName: tutorName,
        date: new Date().toLocaleDateString("de-DE"),
        status: "angefordert",
        originalPrice: pricing.original,
        finalPrice: pricing.final,
        discount: pricing.discount,
        creatorCode: pricing.code
    });

    saveUser();
    updateDashboardPage();

    let msg = "Session mit " + tutorName + " angefordert! 🎉";

    if (pricing.discount > 0) {
        msg += ` (${pricing.final}€ statt ${pricing.original}€ mit Code ${pricing.code})`;
    }

    showPopup(msg, "success");
}

/* =========================================
   POPUPS (LOGIN / REGISTER)
========================================= */

function openLogin() {

    const popup = qs("#loginPopup");
    if (!popup) return;

    popup.style.display = "flex";

    lockBody();
}

function closeLogin() {

    const popup = qs("#loginPopup");
    if (!popup) return;

    popup.style.display = "none";

    unlockBody();
}

function openRegister() {

    const popup = qs("#registerPopup");
    if (!popup) return;

    popup.style.display = "flex";

    lockBody();
}

function closeRegister() {

    const popup = qs("#registerPopup");
    if (!popup) return;

    popup.style.display = "none";

    unlockBody();
}

function switchToRegister() {

    closeLogin();

    openRegister();
}

function switchToLogin() {

    closeRegister();

    openLogin();
}

function lockBody() {

    document.body.style.overflow = "hidden";
}

function unlockBody() {

    document.body.style.overflow = "";
}

/* =========================================
   CUSTOM POPUP SYSTEM
========================================= */

function hideModalPopups() {
    ["loginPopup", "registerPopup", "tutorPopup", "messagePopup"].forEach(id => {
        const popup = document.getElementById(id);
        if (popup) popup.style.display = "none";
    });
}

function showPopup(message, type = "info") {
    hideModalPopups();

    const popup = qs(".custom-popup") || createCustomPopup();
    const content = popup.querySelector(".popup-message");

    content.innerText = message;
    popup.className = "custom-popup " + type;
    popup.style.display = "flex";

    lockBody();

    if (type !== "error") {
        setTimeout(() => {
            popup.style.display = "none";
            unlockBody();
        }, 3500);
    }
}

function createCustomPopup() {
    const popup = document.createElement("div");
    popup.className = "custom-popup";
    popup.innerHTML = `
        <div class="popup-container">
            <div class="popup-message"></div>
            <button onclick="closeCustomPopup()" class="popup-close">✕</button>
        </div>
    `;
    document.body.appendChild(popup);
    return popup;
}

function closeCustomPopup() {
    const popup = qs(".custom-popup");
    if (popup) {
        popup.style.display = "none";
        unlockBody();
    }
}
