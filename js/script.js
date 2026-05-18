"use strict";

/* =========================================
   GLOBAL STATE
========================================= */

let currentSlide = 0;
let slideInterval = null;

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

/* =========================================
   HELPERS
========================================= */

const qs = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);

/* =========================================
   TUTOR DATA
========================================= */

const tutorData = {
    fridolin: {
        name: "Fridolin Wumpe",
        category: "Webentwicklung",
        rating: "⭐ 4.5 (95 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Fridolin ist erfahrener Webentwickler mit über 10 Jahren Erfahrung."
    },

    luna: {
        name: "Luna Attamann",
        category: "Social Media Marketing",
        rating: "⭐ 4.8 (120 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Luna ist Expertin für Social Media Marketing."
    },

    leyla: {
        name: "Leyla Mayer",
        category: "Painting & Zeichnen",
        rating: "⭐ 4.8 (100 Bewertungen)",
        kursart: "💬 Präsenzkurse",
        description: "Leyla unterrichtet Malerei und Zeichnen."
    },

    paul: {
        name: "Paul Weber",
        category: "Ernährung & Fitness",
        rating: "⭐ 4.9 (85 Bewertungen)",
        kursart: "💬 Präsenzkurse",
        description: "Paul hilft bei Fitness und Ernährung."
    },

    anna: {
        name: "Anna Müller",
        category: "Deutsch & Grammatik",
        rating: "⭐ 4.7 (110 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Anna bietet Nachhilfe in Deutsch."
    },

    julian: {
        name: "Julian Sano",
        category: "Mathematik Nachhilfe",
        rating: "⭐ 4.6 (90 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Julian erklärt Mathematik verständlich."
    }
};

/* =========================================
   INIT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initHeader();

    initSlider();

    initSearch();

    initRatings();

    initFavorites();

    initAnimations();

    initMobileNav();

    initCursorGlow();

    initBottomNav();

    initCategoryScroll();

    updateUI();

    loadFavoritesUI();

    updateRatingStarsState();
});

/* =========================================
   HEADER
========================================= */

function initHeader() {

    updateHeaderHeight();

    window.addEventListener("resize", updateHeaderHeight);

    window.addEventListener("load", updateHeaderHeight);
}

function updateHeaderHeight() {

    const header = qs(".header");

    if (!header) return;

    document.documentElement.style.setProperty(
        "--header-height",
        header.offsetHeight + "px"
    );
}

/* =========================================
   SLIDER
========================================= */

function initSlider() {

    const slider = qs(".hero-slider");

    if (!slider) return;

    slider.addEventListener("mouseenter", stopSlider);

    slider.addEventListener("mouseleave", startSlider);

    updateSlider();

    startSlider();

    initSliderTouch(slider);
}

function updateSlider() {

    const slides = qs(".slides");

    const dots = qsa(".dot");

    const total = qsa(".slide").length;

    if (!slides || total === 0) return;

    currentSlide = currentSlide % total;

    slides.style.transform =
        `translateX(-${currentSlide * 100}%)`;

    dots.forEach(dot =>
        dot.classList.remove("active")
    );

    if (dots[currentSlide]) {
        dots[currentSlide].classList.add("active");
    }
}

function startSlider() {

    stopSlider();

    slideInterval = setInterval(() => {

        nextSlide();

    }, 4000);
}

function stopSlider() {

    clearInterval(slideInterval);
}

function nextSlide() {

    const total = qsa(".slide").length;

    currentSlide = (currentSlide + 1) % total;

    updateSlider();
}

function prevSlide() {

    const total = qsa(".slide").length;

    currentSlide =
        (currentSlide - 1 + total) % total;

    updateSlider();
}

function goToSlide(index) {

    currentSlide = index;

    updateSlider();

    startSlider();
}

function initSliderTouch(slider) {

    let startX = 0;

    let endX = 0;

    slider.addEventListener("touchstart", e => {

        startX = e.touches[0].clientX;

        endX = startX;
    });

    slider.addEventListener("touchmove", e => {

        endX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", () => {

        const diff = startX - endX;

        if (diff > 50) nextSlide();

        if (diff < -50) prevSlide();
    });
}

/* =========================================
   SEARCH
========================================= */

function initSearch() {

    const input = qs("#searchInput");

    const suggestionsBox = qs("#suggestions");

    if (!input || !suggestionsBox) return;

    input.addEventListener("input", () => {

        const value =
            input.value.toLowerCase().trim();

        if (!value) {

            resetAllCards();

            suggestionsBox.classList.remove("show");

            suggestionsBox.innerHTML = "";

            return;
        }

        const cards = qsa(".card");

        let results = [];

        cards.forEach(card => {

            const name =
                card.querySelector("h3")?.innerText || "";

            const cat =
                card.querySelector(".category-tag")?.innerText || "";

            const full =
                (name + " " + cat).toLowerCase();

            const match = full.includes(value);

            card.style.display = match ? "" : "none";

            if (match) {

                results.push({
                    name,
                    cat,
                    element: card
                });
            }
        });

        toggleSections();

        renderSuggestions(
            results.slice(0, 6),
            suggestionsBox,
            input
        );
    });

    document.addEventListener("click", e => {

        if (!e.target.closest(".search-bar")) {

            suggestionsBox.classList.remove("show");
        }
    });
}

function renderSuggestions(results, box, input) {

    box.innerHTML = "";

    if (!results.length) {

        box.innerHTML =
            `<div class="search-item">Keine Treffer gefunden</div>`;

    } else {

        results.forEach(item => {

            const div = document.createElement("div");

            div.className = "search-item";

            div.innerHTML =
                `🔍 ${item.name} <small>(${item.cat})</small>`;

            div.addEventListener("click", e => {

                e.stopPropagation();

                item.element.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                input.value = item.name;

                box.classList.remove("show");
            });

            box.appendChild(div);
        });
    }

    box.classList.add("show");
}

function resetAllCards() {

    qsa(".card").forEach(card => {

        card.style.display = "";
    });

    qsa(".tutor-section").forEach(section => {

        section.style.display = "block";
    });
}

function toggleSections() {

    qsa(".tutor-section").forEach(section => {

        const visible =
            [...section.querySelectorAll(".card")]
            .some(card =>
                getComputedStyle(card).display !== "none"
            );

        section.style.display =
            visible ? "block" : "none";
    });
}

function searchTutors() {

    const first =
        qs(".card:not([style*='display: none'])");

    if (first) {

        first.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

/* =========================================
   RATINGS
========================================= */

function initRatings() {

    qsa(".stars").forEach(box => {

        const stars = box.querySelectorAll("i");

        const tutorName =
            getTutorNameFromCard(box);

        stars.forEach(star => {

            star.addEventListener("click", e => {

                e.stopPropagation();

                if (!currentUser) {

                    requireLogin();

                    return;
                }

                const clickedValue =
                    parseInt(star.dataset.value);

                if (!currentUser.ratings) {
                    currentUser.ratings = {};
                }

                const currentRating =
                    currentUser.ratings[tutorName];

                if (currentRating === clickedValue) {

                    delete currentUser.ratings[tutorName];

                } else {

                    currentUser.ratings[tutorName] =
                        clickedValue;
                }

                saveUser();

                updateRatingStarsState();

                renderRatings();
            });
        });
    });
}

function updateRatingStarsState() {
    qsa(".stars").forEach(box => {
        const stars = box.querySelectorAll("i");
        const tutorName = getTutorNameFromCard(box);
        
        const saved = currentUser?.ratings?.[tutorName];

        stars.forEach(star => {
            const val = parseInt(star.dataset.value);

            star.classList.remove("active");

            if (saved && val <= saved) {
                star.classList.add("active");
            }

            if (!currentUser) {
                star.style.opacity = "0.4";
                star.style.pointerEvents = "none";
            } else {
                star.style.opacity = "1";
                star.style.pointerEvents = "auto";
            }
        });
    });
}

function getTutorNameFromCard(el) {

    const card =
        el.closest(".card");

    if (!card) return null;

    return card.querySelector("h3")?.innerText;
}

/* =========================================
   FAVORITES
========================================= */

function initFavorites() {

    qsa(".favorite i").forEach(icon => {

        icon.addEventListener("click", e => {

            e.stopPropagation();

            if (!currentUser) {

                requireLogin();

                return;
            }

            const card =
                icon.closest(".card");

            const name =
                card.querySelector("h3").innerText;

            let favs =
                currentUser.favorites;

            if (favs.includes(name)) {

                favs =
                    favs.filter(f => f !== name);

            } else {

                favs.push(name);
            }

            currentUser.favorites = favs;

            saveUser();

            loadFavoritesUI();

            renderFavorites();
        });
    });
}

function loadFavoritesUI() {

    qsa(".favorite i").forEach(icon => {

        const card =
            icon.closest(".card");

        const name =
            card.querySelector("h3").innerText;

        icon.classList.remove(
            "fa-solid",
            "fa-regular",
            "active"
        );

        if (
            currentUser &&
            currentUser.favorites.includes(name)
        ) {

            icon.classList.add(
                "fa-solid",
                "active"
            );

        } else {

            icon.classList.add("fa-regular");
        }
    });
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

        alert("Bitte alle Felder ausfüllen.");

        return;
    }

    if (users.find(u => u.email === email)) {

        alert("Diese E-Mail existiert bereits.");

        return;
    }

    const user = {
        id: Date.now(),
        name,
        email,
        pass,
        favorites: [],
        ratings: {},
        bookings: [],
        messages: []
    };

    users.push(user);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Registrierung erfolgreich.");

    closeRegister();

    openLogin();
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

        alert("Login fehlgeschlagen.");

        return;
    }

    currentUser = found;

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    updateUI();

    loadFavoritesUI();

    updateRatingStarsState();

    closeLogin();

    alert("Willkommen " + currentUser.name);
}

function logoutUser() {

    currentUser = null;

    localStorage.removeItem("currentUser");

    updateUI();

    loadFavoritesUI();

    updateRatingStarsState();

    closeDashboard();

    alert("Erfolgreich ausgeloggt.");
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

    alert("Bitte zuerst anmelden.");

    openLogin();
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
            <button class="login" onclick="openDashboard()">
                Dashboard
            </button>

            <button class="register" onclick="logoutUser()">
                Logout
            </button>
        `;
    }
}

/* =========================================
   DASHBOARD
========================================= */

function openDashboard() {

    if (!currentUser) {

        requireLogin();

        return;
    }

    qs("#dashboardPopup").style.display = "flex";

    lockBody();

    qs("#dashName").innerText =
        currentUser.name;

    qs("#dashMail").innerText =
        currentUser.email;

    initDashboardTabs();

    renderDashboard();
}

function closeDashboard() {

    qs("#dashboardPopup").style.display = "none";

    unlockBody();
}

function initDashboardTabs() {

    qsa(".tab").forEach(tab => {

        tab.onclick = () => {

            qsa(".tab").forEach(t =>
                t.classList.remove("active")
            );

            qsa(".tab-content").forEach(c =>
                c.classList.remove("active")
            );

            tab.classList.add("active");

            qs("#tab-" + tab.dataset.tab)
                .classList.add("active");
        };
    });
}

function renderDashboard() {

    renderFavorites();

    renderRatings();

    renderBookings();
}

function renderFavorites() {

    const container =
        qs("#tab-favorites");

    if (!container) return;

    if (!currentUser.favorites.length) {

        container.innerHTML =
            "<p class='empty'>Keine Favoriten gespeichert</p>";

        return;
    }

    const cards =
        [...qsa(".card")];

    container.innerHTML =
        currentUser.favorites.map(name => {

            const card =
                cards.find(c =>
                    c.querySelector("h3").innerText === name
                );

            if (!card) return "";

            const img =
                card.querySelector("img").src;

            const category =
                card.querySelector(".category-tag").innerText;

            return `
                <div class="fav-card"
                     onclick="scrollToTutor('${name}')">

                    <img src="${img}">

                    <div>
                        <h4>${name}</h4>
                        <p>${category}</p>
                    </div>
                </div>
            `;
        }).join("");
}

function renderRatings() {

    const container =
        qs("#tab-ratings");

    if (!container || !currentUser) return;

    if (
        !currentUser.ratings ||
        !Object.keys(currentUser.ratings).length
    ) {

        container.innerHTML =
            "<p class='empty'>Keine Bewertungen</p>";

        return;
    }

    container.innerHTML =
        Object.entries(currentUser.ratings)
        .map(([name, val]) => `
            <div class="dash-line">
                <span>${name}</span>
                <strong>${val} ⭐</strong>
            </div>
        `).join("");
}

function renderBookings() {

    const container =
        qs("#tab-bookings");

    if (!container || !currentUser) return;

    if (!currentUser.bookings.length) {

        container.innerHTML =
            "<p class='empty'>Keine Buchungen</p>";

        return;
    }

    container.innerHTML =
        currentUser.bookings
        .map(b =>
            `<div class="dash-line">${b}</div>`
        )
        .join("");
}

function scrollToTutor(name) {

    qsa(".card").forEach(card => {

        if (
            card.querySelector("h3").innerText === name
        ) {

            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });

    closeDashboard();
}

/* =========================================
   BOOKINGS
========================================= */

function bookTutor(name) {

    if (!currentUser) {

        requireLogin();

        return;
    }

    currentUser.bookings.push(
        "Session bei " + name + " angefragt"
    );

    saveUser();

    renderBookings();

    alert("Buchung gespeichert.");
}

/* =========================================
   POPUPS
========================================= */

function openTutorPopup(id) {

    const tutor = tutorData[id];

    if (!tutor) return;

    qs("#popup-name").innerText =
        tutor.name;

    qs("#popup-category").innerText =
        tutor.category;

    qs("#popup-rating").innerText =
        tutor.rating;

    qs("#popup-kursart").innerText =
        tutor.kursart;

    qs("#popup-description").innerText =
        tutor.description;

    qs("#tutorPopup .btn").onclick = () => {

        bookTutor(tutor.name);
    };

    qs("#tutorPopup").style.display = "flex";

    lockBody();
}

function closeTutorPopup() {

    qs("#tutorPopup").style.display = "none";

    unlockBody();
}

function openLogin() {

    qs("#loginPopup").style.display = "flex";

    lockBody();
}

function closeLogin() {

    qs("#loginPopup").style.display = "none";

    unlockBody();
}

function openRegister() {

    qs("#registerPopup").style.display = "flex";

    lockBody();
}

function closeRegister() {

    qs("#registerPopup").style.display = "none";

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

/* =========================================
   MOBILE NAV
========================================= */

function initMobileNav() {

    const nav = qs("#mobileNav");

    if (!nav) return;

    window.toggleMenu = () => {

        nav.classList.toggle("open");

        document.body.classList.toggle("menu-open");
    };

    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            document.body.classList.remove("menu-open");
        });
    });
}

/* =========================================
   BOTTOM NAV
========================================= */

function initBottomNav() {

    qsa(".bottom-nav a").forEach(btn => {

        btn.addEventListener("click", () => {

            qsa(".bottom-nav a")
                .forEach(b =>
                    b.classList.remove("active")
                );

            btn.classList.add("active");
        });
    });
}

/* =========================================
   CATEGORY SCROLL
========================================= */

function initCategoryScroll() {

    qsa(".category-list a").forEach(link => {

        link.addEventListener("click", function(e) {

            e.preventDefault();

            const target =
                qs(this.getAttribute("href"));

            if (!target) return;

            const offset =
                qs(".header").offsetHeight + 70;

            const top =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                offset;

            window.scrollTo({
                top,
                behavior: "smooth"
            });
        });
    });
}

/* =========================================
   ANIMATIONS
========================================= */

function initAnimations() {

    const observer =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");
                }
            });
        });

    qsa(`
        .card,
        .category,
        .tutor-section,
        .trust-item,
        .step-box,
        .review-card,
        .final-cta
    `).forEach(el => observer.observe(el));
}

/* =========================================
   CURSOR GLOW
========================================= */

function initCursorGlow() {

    if (
        window.matchMedia("(hover:none)").matches
    ) return;

    const glow = qs(".cursor-glow");

    if (!glow) return;

    document.addEventListener("mousemove", e => {

        glow.style.left =
            e.clientX + "px";

        glow.style.top =
            e.clientY + "px";
    });
}

/* =========================================
   BODY LOCK
========================================= */

function lockBody() {

    document.body.style.overflow = "hidden";
}

function unlockBody() {

    document.body.style.overflow = "";
}

/* =========================================
   NEU
========================================= */

initActiveNav();

function initActiveNav() {

    const currentPage =
        window.location.pathname.split("/").pop();

    document.querySelectorAll("#mobileNav a")
        .forEach(link => {

            const href = link.getAttribute("href");

            if (href === currentPage) {
                link.classList.add("active-page");
            }
        });
}