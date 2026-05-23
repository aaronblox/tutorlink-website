"use strict";

/* =========================================
   GLOBAL STATE (UI)
========================================= */

let currentSlide = 0;
let slideInterval = null;

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

    initActiveNav();

    updateUI();

    loadFavoritesUI();

    updateRatingStarsState();

    initAdvancedSearch();

    initTutorPage();

    if (document.getElementById("authCheck")) {
        updateDashboardPage();
        initDashboardPageTabs();
    }
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

        handleSearchInput(
            input.value.toLowerCase().trim(),
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

function handleSearchInput(value, suggestionsBox, input) {

    if (!value) {

        resetAllCards();

        suggestionsBox.classList.remove("show");

        suggestionsBox.innerHTML = "";

        return;
    }

    filterCardsOnPage(value);

    toggleSections();

    const results =
        searchTutorsFromData(value).slice(0, 6);

    renderSuggestions(results, suggestionsBox, input);
}

function filterCardsOnPage(value) {

    qsa(".card").forEach(card => {

        const name =
            card.querySelector("h3")?.innerText || "";

        const cat =
            card.querySelector(".category-tag")?.innerText || "";

        const full =
            (name + " " + cat).toLowerCase();

        card.style.display =
            full.includes(value) ? "" : "none";
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

                input.value = item.name;

                box.classList.remove("show");

                if (item.id) {

                    window.location.href =
                        `tutor.html?id=${item.id}`;

                    return;
                }

                if (item.element) {

                    item.element.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                    return;
                }

                window.location.href =
                    `suche.html?q=${encodeURIComponent(item.name)}`;
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

    const input = qs("#searchInput");
    const query = input?.value.trim() || "";

    const first =
        qs(".card:not([style*='display: none'])");

    if (first) {

        first.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }

    if (query) {

        window.location.href =
            `suche.html?q=${encodeURIComponent(query)}`;

        return;
    }

    window.location.href = "suche.html";
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

                updateDashboardPage();
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

            updateDashboardPage();
        });
    });
}

function loadFavoritesUI() {

    const icons = qsa(".favorite i");

    if (!icons.length) return;

    icons.forEach(icon => {

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
   TUTOR POPUP
========================================= */

function openTutorPopup(id) {

    const tutor = tutorData[id];

    const popup = qs("#tutorPopup");

    if (!tutor || !popup) return;

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

    popup.style.display = "flex";

    lockBody();
}

function closeTutorPopup() {

    const popup = qs("#tutorPopup");
    if (!popup) return;

    popup.style.display = "none";

    unlockBody();
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

        link.addEventListener("click", function (e) {

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
   NAVIGATION HIGHLIGHTING
========================================= */

function initActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const normalizedPage = currentPage === "" ? "index.html" : currentPage;

    document.querySelectorAll("#mobileNav a").forEach(link => {
        const href = link.getAttribute("href");
        const isActive =
            href === normalizedPage ||
            (normalizedPage === "tutor.html" && href === "suche.html");

        if (isActive) {
            link.classList.add("active-page");
        } else {
            link.classList.remove("active-page");
        }
    });

    const bottomNavMap = {
        "index.html": 0,
        "suche.html": 1,
        "tutor.html": 1,
        "meine-kurse.html": 2,
        "tutor-werden.html": 3
    };

    const bottomNavLinks = document.querySelectorAll(".bottom-nav a");
    const pageIndex = bottomNavMap[normalizedPage];

    bottomNavLinks.forEach((link, idx) => {
        if (idx === pageIndex) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function initAdvancedSearch() {

    const searchPageInput =
        document.querySelector("#searchPageInput");

    const headerSearchInput =
        document.querySelector("#searchInput");

    const category =
        document.querySelector("#categoryFilter");

    const kurs =
        document.querySelector("#kursFilter");

    const rating =
        document.querySelector("#ratingFilter");

    if (!searchPageInput && !headerSearchInput) return;

    const inputs = [searchPageInput, headerSearchInput, category, kurs, rating].filter(el => el);

    inputs.forEach(el => {
        el.addEventListener("input", filterTutors);
        el.addEventListener("change", filterTutors);
    });

    if (headerSearchInput && searchPageInput) {
        const suggestionsBox = document.querySelector("#suggestions");
        if (suggestionsBox) {
            headerSearchInput.addEventListener("input", () => {
                const value = headerSearchInput.value.toLowerCase().trim();

                searchPageInput.value = value;

                if (!value) {
                    suggestionsBox.classList.remove("show");
                    suggestionsBox.innerHTML = "";
                    filterTutors();
                    return;
                }

                const results =
                    searchTutorsFromData(value).slice(0, 6);

                renderSuggestions(results, suggestionsBox, headerSearchInput);
                filterTutors();
            });

            searchPageInput.addEventListener("input", () => {
                headerSearchInput.value = searchPageInput.value;
                filterTutors();
            });

            document.addEventListener("click", e => {
                if (!e.target.closest(".search-bar")) {
                    suggestionsBox.classList.remove("show");
                }
            });
        }
    }

    applySearchQueryFromUrl();

    filterTutors();
}

function applySearchQueryFromUrl() {

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");

    if (!q || !window.location.pathname.includes("suche.html")) return;

    const searchPageInput = document.querySelector("#searchPageInput");
    const headerSearchInput = document.querySelector("#searchInput");

    if (searchPageInput) searchPageInput.value = q;
    if (headerSearchInput) headerSearchInput.value = q;
}

function filterTutors() {

    const searchPageInput = document.querySelector("#searchPageInput");
    const searchInput = document.querySelector("#searchInput");

    const search =
        (searchPageInput?.value || searchInput?.value || "").toLowerCase().trim() || "";

    const categoryFilter =
        document.querySelector("#categoryFilter")
            ?.value.toLowerCase() || "";

    const kurs =
        document.querySelector("#kursFilter")
            ?.value.toLowerCase() || "";

    const rating =
        parseFloat(
            document.querySelector("#ratingFilter")?.value
        ) || 0;

    let visibleCount = 0;

    document.querySelectorAll(".card")
        .forEach(card => {

            const name =
                card.querySelector("h3")
                    ?.innerText.toLowerCase() || "";

            const cat =
                card.querySelector(".category-tag")
                    ?.innerText.toLowerCase() || "";

            const kursart =
                card.querySelector(".kursart")
                    ?.innerText.toLowerCase() || "";

            const ratingText =
                card.querySelector(".rating")
                    ?.innerText || "";

            const cardRating =
                parseFloat(
                    ratingText.match(/\d\.\d/)?.[0]
                ) || 0;

            const matchesSearch =
                !search || (name + " " + cat).includes(search);

            const cardFilterCategory = getFilterCategory(cat);
            const matchesCategory =
                !categoryFilter || cardFilterCategory === categoryFilter;

            const matchesKurs =
                !kurs || kursart.includes(kurs);

            const matchesRating =
                cardRating >= rating;

            const visible =
                matchesSearch &&
                matchesCategory &&
                matchesKurs &&
                matchesRating;

            card.style.display =
                visible ? "" : "none";

            if (visible) visibleCount++;
        });

    const resultsCount = document.querySelector("#resultsCount") || document.querySelector("#resultCount");
    if (resultsCount) {
        resultsCount.innerText =
            `${visibleCount} Tutoren gefunden`;
    }

    toggleSections();
}

function openTutorPage(id) {

    window.location.href = `tutor.html?id=${id}`;
}

function initTutorPage() {

    if (!window.location.pathname
        .includes("tutor.html")) return;

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    const tutor = tutorData[id];

    if (!tutor) return;

    document.querySelector("#tutorName")
        .innerText = tutor.name;

    document.querySelector("#tutorCategory")
        .innerText = tutor.category;

    document.querySelector("#tutorRating")
        .innerText = tutor.rating;

    document.querySelector("#tutorKursart")
        .innerText = tutor.kursart;

    document.querySelector("#tutorDescription")
        .innerText = tutor.description;

    document.querySelector("#tutorImage")
        .src = `images/${id}.jpg`;

    window.currentTutorId = id;
    window.currentTutorName = tutor.name;
    window.currentTutorPrice = tutor.price;

    const messageBtn =
        document.querySelector("#messageBtn");

    if (messageBtn) {
        messageBtn.onclick = () => openMessagePopup();
    }

    const sessionBookBtn =
        document.querySelector("#sessionBookBtn");

    if (sessionBookBtn) {
        sessionBookBtn.onclick = () => bookTutor(tutor.name);
    }

    document.title =
        `${tutor.name} | Tutorlink`;

    const aboutEl = document.querySelector("#tutorAbout");
    if (aboutEl) aboutEl.innerText = tutor.about;

    initCreatorCodeUI();

    const statsEls = document.querySelectorAll(".mini-stats div");
    if (statsEls.length >= 3) {
        statsEls[0].innerHTML = `<strong>${tutor.sessions}+</strong><span>Sessions</span>`;
        statsEls[1].innerHTML = `<strong>${tutor.rating_score}</strong><span>Bewertung</span>`;
        statsEls[2].innerHTML = `<strong>${tutor.experience}</strong><span>Erfahrung</span>`;
    }

    const skillsList = document.querySelector(".skills-list");
    if (skillsList && tutor.skills) {
        skillsList.innerHTML = "";
        tutor.skills.forEach(skill => {
            const span = document.createElement("span");
            span.innerText = skill;
            skillsList.appendChild(span);
        });
    }

    const resumeSection = document.querySelector(".tutor-resume");
    if (resumeSection && tutor.resume) {
        const existingItems = resumeSection.querySelectorAll(".resume-item");
        existingItems.forEach(item => item.remove());

        tutor.resume.forEach(entry => {
            const item = document.createElement("div");
            item.className = "resume-item";
            item.innerHTML = `
                <span>${entry.period}</span>
                <div>
                    <h3>${entry.title}</h3>
                    <p>${entry.company}</p>
                </div>
            `;
            resumeSection.appendChild(item);
        });
    }
}
