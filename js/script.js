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

    slides.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[currentSlide]) dots[currentSlide].classList.add("active");

    currentSlide = currentSlide % total;
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
}

function closeTutorPopup() {
    qs("#tutorPopup").style.display = "none";
}

function openLogin() { qs("#loginPopup").style.display = "flex"; }
function closeLogin() { qs("#loginPopup").style.display = "none"; }

function openRegister() { qs("#registerPopup").style.display = "flex"; }
function closeRegister() { qs("#registerPopup").style.display = "none"; }

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
            const hasVisibleCards = section.querySelectorAll(".card[style='']").length > 0 ||
                section.querySelectorAll(".card:not([style*='display: none'])").length > 0;
            section.style.display = hasVisibleCards ? "block" : "none";
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
    qsa(".stars").forEach((box, index) => {
        const stars = box.querySelectorAll("i");
        const saved = localStorage.getItem("rating_" + index);

        if (saved) {
            stars.forEach(star => {
                if (star.dataset.value <= saved) {
                    star.classList.add("active");
                }
            });
        }

        stars.forEach(star => {
            star.addEventListener("click", (e) => {
                e.stopPropagation();

                const value = star.dataset.value;
                localStorage.setItem("rating_" + index, value);

                stars.forEach(s => {
                    s.classList.toggle("active", s.dataset.value <= value);
                });
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
}

function initMobileNav() {
    window.toggleMenu = function () {
        qs("#mobileNav").classList.toggle("open");
        document.body.classList.toggle("menu-open");
    };
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