"use strict";

/* =========================================
   NACHRICHTEN (TUTOR & KONTAKT)
========================================= */

function openMessagePopup() {

    if (!currentUser) {

        requireLogin();

        return;
    }

    if (!window.currentTutorId || !window.currentTutorName) {

        showPopup("Tutor konnte nicht geladen werden.", "error");

        return;
    }

    const popup = qs("#messagePopup");

    if (!popup) return;

    const nameEl = qs("#messageTutorName");

    if (nameEl) nameEl.innerText = window.currentTutorName;

    qs("#messageSubject").value = "";
    qs("#messageText").value = "";

    popup.style.display = "flex";

    lockBody();
}

function closeMessagePopup() {

    const popup = qs("#messagePopup");

    if (!popup) return;

    popup.style.display = "none";

    unlockBody();
}

function sendTutorMessage() {

    if (!currentUser) {

        requireLogin();

        return;
    }

    const subject =
        qs("#messageSubject")?.value.trim() || "Nachricht";

    const text =
        qs("#messageText")?.value.trim() || "";

    if (!text) {

        showPopup("Bitte schreibe eine Nachricht.", "warning");

        return;
    }

    if (!window.currentTutorId || !window.currentTutorName) {

        showPopup("Tutor konnte nicht geladen werden.", "error");

        return;
    }

    currentUser.messages.push({
        id: Date.now(),
        type: "tutor",
        tutorId: window.currentTutorId,
        tutorName: window.currentTutorName,
        subject,
        text,
        date: new Date().toLocaleDateString("de-DE"),
        status: "gesendet"
    });

    saveUser();

    closeMessagePopup();

    updateDashboardPage();

    showPopup(
        "Nachricht an " + window.currentTutorName + " wurde gesendet! ✉️",
        "success"
    );
}

function sendSupportMessage(name, email, text) {

    const inquiry = {
        id: Date.now(),
        type: "support",
        name,
        email,
        subject: "Kontaktanfrage",
        text,
        date: new Date().toLocaleDateString("de-DE"),
        status: "gesendet"
    };

    if (currentUser) {

        currentUser.messages.push({
            id: inquiry.id,
            type: "support",
            subject: inquiry.subject,
            text,
            date: inquiry.date,
            status: "gesendet"
        });

        saveUser();
        updateDashboardPage();

    } else {

        let inquiries =
            JSON.parse(localStorage.getItem("supportInquiries")) || [];

        inquiries.push(inquiry);

        localStorage.setItem(
            "supportInquiries",
            JSON.stringify(inquiries)
        );
    }

    return true;
}

function initContactForm() {

    const form = document.getElementById("contactForm");

    if (!form) return;

    if (currentUser) {
        const nameInput = document.getElementById("contactName");
        const mailInput = document.getElementById("contactEmail");

        if (nameInput) nameInput.value = currentUser.name;
        if (mailInput) mailInput.value = currentUser.email;
    }

    form.addEventListener("submit", e => {

        e.preventDefault();

        const name =
            document.getElementById("contactName").value.trim();

        const email =
            document.getElementById("contactEmail").value.trim();

        const text =
            document.getElementById("contactMessage").value.trim();

        if (!name || !email || !text) {

            showPopup("Bitte fülle alle Felder aus.", "error");

            return;
        }

        sendSupportMessage(name, email, text);

        form.reset();

        if (currentUser) {
            document.getElementById("contactName").value = currentUser.name;
            document.getElementById("contactEmail").value = currentUser.email;
        }

        showPopup(
            "Danke für deine Nachricht! Wir melden uns bei dir. 📩",
            "success"
        );
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initContactForm();
});
