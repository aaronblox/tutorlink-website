let currentSlide = 0;
let slideInterval;

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

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initSlider();
    initSearch();
    initRatings();
    initFavorites();
    initAnimations();
    initMobileNav();
    initCursorGlow();
    updateUI();
    loadFavoritesUI();
    updateRatingStarsState();
});

function qs(el) { return document.querySelector(el); }
function qsa(el) { return document.querySelectorAll(el); }

function initHeader() {
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    window.addEventListener("load", updateHeaderHeight);
}

function updateHeaderHeight() {
    const header = qs(".header");
    document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
}

function initSlider() {
    const slider = qs(".hero-slider");
    if (!slider) return;

    slider.addEventListener("mouseenter", stopSlider);
    slider.addEventListener("mouseleave", startSlider);

    updateSlider();
    startSlider();
}

function updateSlider() {
    const slides = qs(".slides");
    const dots = qsa(".dot");
    const total = qsa(".slide").length;

    currentSlide = currentSlide % total;

    slides.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[currentSlide]) dots[currentSlide].classList.add("active");
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
    currentSlide = (currentSlide - 1 + total) % total;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    startSlider();
}

function openTutorPopup(id) {
    const tutor = tutorData[id];
    if (!tutor) return;

    qs("#popup-name").innerText = tutor.name;
    qs("#popup-category").innerText = tutor.category;
    qs("#popup-rating").innerText = tutor.rating;
    qs("#popup-kursart").innerText = tutor.kursart;
    qs("#popup-description").innerText = tutor.description;

    qs("#tutorPopup").style.display = "flex";
    lockBody();
}

function closeTutorPopup() {
    qs("#tutorPopup").style.display = "none";
    unlockBody();
}

function openLogin() { qs("#loginPopup").style.display = "flex"; lockBody(); }
function closeLogin() { qs("#loginPopup").style.display = "none"; unlockBody(); }

function openRegister() { qs("#registerPopup").style.display = "flex"; lockBody(); }
function closeRegister() { qs("#registerPopup").style.display = "none"; unlockBody(); }

function switchToRegister() {
    closeLogin();
    openRegister();
}

function switchToLogin() {
    closeRegister();
    openLogin();
}

function initSearch() {
    const input = document.getElementById("searchInput");
    const suggestionsBox = document.getElementById("suggestions");

    if (!input || !suggestionsBox) return;

    function renderSuggestions(results) {
        suggestionsBox.innerHTML = "";

        if (results.length === 0) {
            suggestionsBox.innerHTML = `<div class="search-item">Keine Treffer gefunden</div>`;
        } else {
            results.forEach(item => {
                const div = document.createElement("div");
                div.className = "search-item";
                div.innerHTML = `🔍 ${item.name} <small>(${item.cat})</small>`;

                div.addEventListener("click", (e) => {
                    e.stopPropagation();

                    item.element.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    input.value = item.name;
                    suggestionsBox.classList.remove("show");
                });

                suggestionsBox.appendChild(div);
            });
        }

        suggestionsBox.classList.add("show");
    }

    input.addEventListener("input", () => {
        const value = input.value.toLowerCase().trim();

        if (value === "") {
            suggestionsBox.classList.remove("show");
            suggestionsBox.innerHTML = "";

            resetAllCards();
            return;
        }

        const cards = document.querySelectorAll(".card");
        let searchResults = [];
        let visibleCount = 0;

        cards.forEach(card => {
            const nameEl = card.querySelector("h3");
            const catEl = card.querySelector(".category-tag");

            if (!nameEl || !catEl) return;

            const name = nameEl.innerText;
            const cat = catEl.innerText;
            const fullText = (name + " " + cat).toLowerCase();

            const isMatch = fullText.includes(value);

            card.style.display = isMatch ? "" : "none";

            if (isMatch) {
                visibleCount++;
                searchResults.push({
                    name: name,
                    cat: cat,
                    element: card
                });
            }
        });

        document.querySelectorAll(".tutor-section").forEach(section => {
            const visible = [...section.querySelectorAll(".card")]
                .some(card => getComputedStyle(card).display !== "none");

            section.style.display = visible ? "block" : "none";
        });

        renderSuggestions(searchResults.slice(0, 6));
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-bar")) {
            suggestionsBox.classList.remove("show");
        }
    });

    suggestionsBox.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    input.addEventListener("focus", () => {
        if (input.value.trim().length > 0) {
            input.dispatchEvent(new Event("input"));
        }
    });
}

function resetAllCards() {
    document.querySelectorAll(".card").forEach(card => {
        card.style.display = "";
    });
    document.querySelectorAll(".tutor-section").forEach(section => {
        section.style.display = "block";
    });
}

function searchTutors() {
    const first = qs(".card:not([style*='display: none'])");
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
}

function initRatings() {
    qsa(".stars").forEach(box => {
        const stars = box.querySelectorAll("i");
        const card = box.closest(".card") || box.closest(".tutor-card");
        const tutorName = card ? 
            (card.querySelector("h3")?.innerText || 
             card.querySelector(".name")?.innerText || 
             card.querySelector("h2")?.innerText) : "Unbekannt";

        if (currentUser && currentUser.ratings && currentUser.ratings[tutorName]) {
            const savedValue = currentUser.ratings[tutorName];
            stars.forEach(star => {
                star.classList.toggle("active", parseInt(star.dataset.value) <= savedValue);
            });
        }

        stars.forEach(star => {
            star.addEventListener("click", (e) => {
                e.stopPropagation();

                if (!currentUser) {
                    requireLogin();
                    return;
                }

                const clickedValue = parseInt(star.dataset.value);
                const currentRating = currentUser.ratings ? currentUser.ratings[tutorName] : null;

                if (currentRating === clickedValue) {
                    delete currentUser.ratings[tutorName];
                    stars.forEach(s => s.classList.remove("active"));
                } else {
                    if (!currentUser.ratings) currentUser.ratings = {};
                    currentUser.ratings[tutorName] = clickedValue;

                    stars.forEach(s => {
                        s.classList.toggle("active", parseInt(s.dataset.value) <= clickedValue);
                    });
                }

                saveUser();
            });
        });
    });
}

function initFavorites() {
    qsa(".favorite i").forEach((icon, index) => {
        if (localStorage.getItem("fav_" + index) === "true") {
            icon.classList.add("active", "fa-solid");
            icon.classList.remove("fa-regular");
        }

        icon.addEventListener("click", (e) => {
            e.stopPropagation();

            icon.classList.toggle("active");

            if (icon.classList.contains("active")) {
                icon.classList.add("fa-solid");
                icon.classList.remove("fa-regular");
                localStorage.setItem("fav_" + index, "true");
            } else {
                icon.classList.add("fa-regular");
                icon.classList.remove("fa-solid");
                localStorage.setItem("fav_" + index, "false");
            }
        });
    });
}

function initAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    });

    qsa(".card,.category,.tutor-section").forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll(".trust-item,.step-box,.review-card,.final-cta")
        .forEach(el => observer.observe(el));
}

function initMobileNav() {
    const nav = qs("#mobileNav");

    window.toggleMenu = function () {
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

function initCursorGlow() {
    if (window.matchMedia("(hover:none)").matches) return;

    const glow = qs(".cursor-glow");
    if (!glow) return;

    document.addEventListener("mousemove", (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    });
}

document.querySelectorAll(".bottom-nav a").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".bottom-nav a")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
    });
});

let startX = 0;
let endX = 0;

const slider = document.querySelector(".hero-slider");

if (slider) {
    slider.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        endX = startX;
    });

    slider.addEventListener("touchmove", e => {
        endX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", () => {
        let diff = startX - endX;

        if (diff > 50) {
            nextSlide();
        }

        if (diff < -50) {
            prevSlide();
        }
    });
}

function lockBody() {
    document.body.style.overflow = "hidden";
}

function unlockBody() {
    document.body.style.overflow = "";
}

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function registerUser() {
    const name = qs("#regName").value.trim();
    const email = qs("#regEmail").value.trim().toLowerCase();
    const pass = qs("#regPass").value.trim();

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
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registrierung erfolgreich.");
    closeRegister();
    openLogin();
}

function loginUser() {
    const email = qs("#loginEmail").value.trim().toLowerCase();
    const pass = qs("#loginPass").value.trim();

    const found = users.find(u => u.email === email && u.pass === pass);

    if (!found) {
        alert("Login fehlgeschlagen.");
        return;
    }

    currentUser = found;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    updateUI();
    updateRatingStarsState();
    loadFavoritesUI();

    closeLogin();
    alert("Willkommen " + currentUser.name);
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem("currentUser");

    updateUI();
    updateRatingStarsState();
    closeDashboard();
    loadFavoritesUI();

    alert("Erfolgreich ausgeloggt.");
}

function updateUI() {
    const area = qs("#authArea");

    if (!area) return;

    if (!currentUser) {
        area.innerHTML = `
            <button class="login" onclick="openLogin()">Anmelden</button>
            <button class="register" onclick="openRegister()">Registrieren</button>
        `;
    } else {
        area.innerHTML = `
            <button class="login" onclick="openDashboard()">Dashboard</button>
            <button class="register" onclick="logoutUser()">Logout</button>
        `;
    }
    updateRatingStarsState();
}

function requireLogin() {
    alert("Bitte zuerst anmelden oder registrieren.");
    openLogin();
}

function initFavorites() {
    qsa(".favorite i").forEach(icon => {

        const card = icon.closest(".card");
        const name = card.querySelector("h3").innerText;

        icon.addEventListener("click", e => {
            e.stopPropagation();

            if (!currentUser) {
                requireLogin();
                return;
            }

            let favs = currentUser.favorites;

            if (favs.includes(name)) {
                favs = favs.filter(f => f !== name);
            } else {
                favs.push(name);
            }

            currentUser.favorites = favs;
            saveUser();

            loadFavoritesUI();
        });
    });

    loadFavoritesUI();
}

function updateRatingStarsState() {
    qsa(".stars").forEach(box => {
        const stars = box.querySelectorAll("i");
        const card = box.closest(".card") || box.closest(".tutor-card");
        const tutorName = card ? 
            (card.querySelector("h3")?.innerText || 
             card.querySelector(".name")?.innerText || 
             card.querySelector("h2")?.innerText) : null;

        if (!currentUser) {
            stars.forEach(star => {
                star.classList.remove("active");
                star.style.opacity = "0.4";
                star.style.cursor = "not-allowed";
                star.style.pointerEvents = "none";
            });
        } else {
            const savedValue = tutorName && currentUser.ratings ? currentUser.ratings[tutorName] : null;

            stars.forEach(star => {
                star.style.opacity = "1";
                star.style.cursor = "pointer";
                star.style.pointerEvents = "auto";
                star.classList.toggle("active", savedValue && parseInt(star.dataset.value) <= savedValue);
            });
        }
    });
}

function getTutorNameFromCard(star) {
    const card = star.closest(".card") || star.closest(".tutor-card");
    if (!card) return null;
    
    return card.querySelector("h3")?.innerText || 
           card.querySelector(".name")?.innerText || 
           card.querySelector("h2")?.innerText;
}

function loadFavoritesUI() {
    qsa(".favorite i").forEach(icon => {

        const card = icon.closest(".card");
        const name = card.querySelector("h3").innerText;

        icon.classList.remove("fa-solid", "fa-regular", "active");

        if (currentUser && currentUser.favorites.includes(name)) {
            icon.classList.add("fa-solid", "active");
        } else {
            icon.classList.add("fa-regular");
        }
    });
}

function openDashboard() {

    if (!currentUser) {
        requireLogin();
        return;
    }

    qs("#dashboardPopup").style.display = "flex";
    lockBody();

    qs("#dashName").innerText = currentUser.name;
    qs("#dashMail").innerText = currentUser.email;

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

            qsa(".tab").forEach(t => t.classList.remove("active"));
            qsa(".tab-content").forEach(c => c.classList.remove("active"));

            tab.classList.add("active");
            qs("#tab-" + tab.dataset.tab).classList.add("active");
        };
    });
}

function renderDashboard() {

    renderFavorites();
    renderRatings();
    renderBookings();
}

function renderFavorites() {

    const container = qs("#tab-favorites");

    if (!currentUser.favorites.length) {
        container.innerHTML = "<p class='empty'>Keine Favoriten gespeichert</p>";
        return;
    }

    const cards = [...document.querySelectorAll(".card")];

    const html = currentUser.favorites.map(name => {

        const card = cards.find(c =>
            c.querySelector("h3").innerText === name
        );

        if (!card) return "";

        const img = card.querySelector("img").src;
        const category = card.querySelector(".category-tag").innerText;

        return `
            <div class="fav-card" onclick="scrollToTutor('${name}')">
                <img src="${img}">
                <div>
                    <h4>${name}</h4>
                    <p>${category}</p>
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = html;
}

function renderRatings() {

    const container = qs("#tab-ratings");

    if (!currentUser.ratings || !Object.keys(currentUser.ratings).length) {
        container.innerHTML = "<p class='empty'>Keine Bewertungen</p>";
        return;
    }

    container.innerHTML = Object.entries(currentUser.ratings)
        .map(([name, val]) => `
            <div class="dash-line">
                <span>${name}</span>
                <strong>${val} ⭐</strong>
            </div>
        `).join("");
}

function renderBookings() {

    const container = qs("#tab-bookings");

    if (!currentUser.bookings.length) {
        container.innerHTML = "<p class='empty'>Keine Buchungen</p>";
        return;
    }

    container.innerHTML = currentUser.bookings
        .map(b => `<div class="dash-line">${b}</div>`)
        .join("");
}

function scrollToTutor(name) {

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        if (card.querySelector("h3").innerText === name) {
            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });

    closeDashboard();
}

function bookTutor(name) {

    if (!currentUser) {
        requireLogin();
        return;
    }

    currentUser.bookings.push(
        "Session bei " + name + " angefragt"
    );

    saveUser();

    alert("Buchung gespeichert.");
}

function openTutorPopup(id) {

    const tutor = tutorData[id];
    if (!tutor) return;

    qs("#popup-name").innerText = tutor.name;
    qs("#popup-category").innerText = tutor.category;
    qs("#popup-rating").innerText = tutor.rating;
    qs("#popup-kursart").innerText = tutor.kursart;
    qs("#popup-description").innerText = tutor.description;

    qs("#tutorPopup .btn").onclick = () => {
        bookTutor(tutor.name);
    };

    qs("#tutorPopup").style.display = "flex";
    lockBody();
}

function saveUser() {

    users = users.map(u =>
        u.email === currentUser.email ? currentUser : u
    );

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

document.querySelectorAll(".category-list a").forEach(link => {

    link.addEventListener("click", function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));
        const offset = document.querySelector(".header").offsetHeight + 70;

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