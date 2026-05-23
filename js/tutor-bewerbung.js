"use strict";

/* =========================================
   TUTOR BEWERBUNG (tutor-werden.html)
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initTutorApplyForm();
});

function initTutorApplyForm() {

    const form = document.getElementById("tutorApplyForm");

    if (!form) return;

    updateTutorApplyHint();

    if (currentUser) {
        const nameInput = document.getElementById("applyName");
        const mailInput = document.getElementById("applyEmail");

        if (nameInput) nameInput.value = currentUser.name;
        if (mailInput) mailInput.value = currentUser.email;
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        submitTutorApplication();
    });
}

function submitTutorApplication() {

    const name =
        document.getElementById("applyName").value.trim();

    const email =
        document.getElementById("applyEmail").value
            .trim()
            .toLowerCase();

    const category =
        document.getElementById("applyCategory").value;

    const experience =
        document.getElementById("applyExperience").value.trim();

    const kursart =
        document.getElementById("applyKursart").value;

    const price =
        document.getElementById("applyPrice").value.trim();

    const description =
        document.getElementById("applyDescription").value.trim();

    if (!name || !email || !category || !experience || !kursart || !price || !description) {

        showPopup("Bitte fülle alle Pflichtfelder aus.", "error");

        return;
    }

    if (description.length < 40) {

        showPopup("Die Beschreibung sollte mindestens 40 Zeichen haben.", "error");

        return;
    }

    let applications =
        JSON.parse(localStorage.getItem("tutorApplications")) || [];

    const alreadyApplied = applications.some(
        a => a.email === email && a.status !== "abgelehnt"
    );

    if (alreadyApplied) {

        showPopup("Für diese E-Mail liegt bereits eine Bewerbung vor.", "warning");

        return;
    }

    const application = {
        id: Date.now(),
        name,
        email,
        category,
        experience,
        kursart,
        price: parseInt(price, 10),
        description,
        status: "eingegangen",
        date: new Date().toLocaleDateString("de-DE"),
        userId: currentUser ? currentUser.id : null
    };

    applications.push(application);

    localStorage.setItem(
        "tutorApplications",
        JSON.stringify(applications)
    );

    document.getElementById("tutorApplyForm").reset();

    if (currentUser) {
        document.getElementById("applyName").value = currentUser.name;
        document.getElementById("applyEmail").value = currentUser.email;
    }

    showPopup("Bewerbung erfolgreich gesendet! Wir melden uns in Kürze bei dir. 🎉", "success");
}

function updateTutorApplyHint() {

    const hint = document.getElementById("applyFormHint");

    if (!hint) return;

    hint.style.display = currentUser ? "none" : "block";
}

function scrollToBewerbung() {

    const section = document.getElementById("bewerbung");

    if (!section) return;

    const offset =
        (qs(".header")?.offsetHeight || 80) + 30;

    const top =
        section.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

    window.scrollTo({
        top,
        behavior: "smooth"
    });
}
