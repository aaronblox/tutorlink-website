// Globale Variablen für Slider
let currentslide = 0;
let slides;
let dots;
let totalSlides;
let interval;

// Slider aktualisieren
function updateSlider() {
    slides.style.transform = `translateX(-${currentslide * 100}%)`;

    // Dots updaten
    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentslide].classList.add("active");

    // Animation neu triggern
    const buttons = document.querySelector(".hero-content");
    buttons.style.animation = "none";
    buttons.offsetHeight;
    buttons.style.animation = "fadeInUp 0.8s ease";
}

// Zu bestimmtem Slide springen (bei Klick auf Dot)
function goToSlide(index) {
    currentslide = index;
    updateSlider();
    stopSlider();
    startSlider();
}

// Slider starten
function startSlider() {
    clearInterval(interval);
    interval = setInterval(() => {
        currentslide = (currentslide + 1) % totalSlides;
        updateSlider();
    }, 4000);
}

function nextSlide() {
    currentslide = (currentslide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentslide = (currentslide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

// Slider stoppen
function stopSlider() {
    clearInterval(interval);
}

// Tutor Popup Funktionen
const tutorData = {
    fridolin: {
        name: "Fridolin Wumpe",
        category: "Webentwicklung",
        rating: "⭐ 4.5 (95 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Fridolin ist ein erfahrener Webentwickler mit über 10 Jahren Erfahrung. Er bietet Kurse in HTML, CSS, JavaScript und React an. Seine Schüler schätzen seine geduldige Art und seine Fähigkeit, komplexe Themen einfach zu erklären."
    },
    luna: {
        name: "Luna Attamann",
        category: "Social Media Marketing",
        rating: "⭐ 4.8 (120 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Luna ist Experte für Social Media Marketing und hat über 5 Jahre Erfahrung in der Branche. Sie hilft Unternehmen, ihre Online-Präsenz zu stärken und ihre Zielgruppe effektiv zu erreichen."
    },
    leyla: {
        name: "Leyla Mayer",
        category: "Painting & Zeichnen",
        rating: "⭐ 4.8 (100 Bewertungen)",
        kursart: "💬 Präsenzkurse",
        description: "Leyla ist eine talentierte Künstlerin mit einem starken Fokus auf Malerei und Zeichnen. Sie unterrichtet sowohl Einsteiger als auch Fortgeschrittene in verschiedenen Techniken und Stilen."
    },
    paul: {
        name: "Paul Weber",
        category: "Ernährung & Fitness",
        rating: "⭐ 4.9 (85 Bewertungen)",
        kursart: "💬 Präsenzkurse",
        description: "Paul ist ein Experte für Ernährung und Fitness und hat über 10 Jahre Erfahrung in der Beratung von Kunden. Er hilft dabei, gesunde Lebensgewohnheiten zu entwickeln und körperliche Ziele zu erreichen."
    },
    anna: {
        name: "Anna Müller",
        category: "Deutsch & Grammatik",
        rating: "⭐ 4.7 (110 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Anna ist Lehrerin für Deutsch und Grammatik mit über 15 Jahren Erfahrung. Sie bietet individuelle Nachhilfe an und hilft Schülern, ihre Sprachkenntnisse zu verbessern."
    },
    julian: {
        name: "Julian Sano",
        category: "Mathematik Nachhilfe",
        rating: "⭐ 4.6 (90 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Julian ist Mathematiklehrer mit einer Leidenschaft für das Fach. Er bietet Nachhilfe in Mathematik an und hilft Schülern, komplexe mathematische Konzepte zu verstehen."
    }
};

function openTutorPopup(id) {
    const tutor = tutorData[id];

    document.getElementById("popup-name").innerText = tutor.name;
    document.getElementById("popup-category").innerText = tutor.category;
    document.getElementById("popup-rating").innerText = tutor.rating;
    document.getElementById("popup-kursart").innerText = tutor.kursart;
    document.getElementById("popup-description").innerText = tutor.description;

    document.getElementById("tutorPopup").style.display = "flex";
}

function closeTutorPopup() {
    document.getElementById("tutorPopup").style.display = "none";
}

function openLogin() {
    document.getElementById("loginPopup").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginPopup").style.display = "none";
}

function openRegister() {
    document.getElementById("registerPopup").style.display = "flex";
}

function closeRegister() {
    document.getElementById("registerPopup").style.display = "none";
}

// Wechsel zwischen beiden
function switchToRegister() {
    closeLogin();
    openRegister();
}

function switchToLogin() {
    closeRegister();
    openLogin();
}

function searchTutors() {
    const cards = document.querySelectorAll(".card");
    let firstVisible = null;
    
    // Finde die erste Karte, die nicht versteckt ist
    for (let card of cards) {
        if (card.style.display !== "none") {
            firstVisible = card;
            break;
        }
    }
    
    if (firstVisible) {
        firstVisible.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Header-Höhe berechnen und CSS-Variable setzen
    function updateHeaderHeight() {
        const header = document.querySelector(".header");
        const headerHeight = header.offsetHeight + "px";
        document.documentElement.style.setProperty("--header-height", headerHeight);
    }

    // Initial setzen
    updateHeaderHeight();

    // Bei Fenster-Resize aktualisieren
    window.addEventListener("resize", updateHeaderHeight);

    // Initialisiere Slider-Variablen
    slides = document.querySelector(".slides");
    dots = document.querySelectorAll(".dot");
    totalSlides = document.querySelectorAll(".slide").length;

    // Hover Events für Slider
    const slider = document.querySelector(".hero-slider");

        slider.addEventListener("mouseenter", stopSlider);
        slider.addEventListener("mouseleave", startSlider);

    // Start
    updateSlider();
    startSlider();

    // Scroll Animation
    const sections = document.querySelectorAll(".tutor-section");

    const elements = document.querySelectorAll(".card, .category, .tutor-section");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    });

    elements.forEach(e1 => observer.observe(e1));

    // Bewertungssystem
    document.querySelectorAll(".stars").forEach((starContainer, index) => {
        const stars = starContainer.querySelectorAll("i");

        // gespeicherte Bewertung laden
        const savedRating = localStorage.getItem("rating_" + index);

        if (savedRating) {
            stars.forEach(s => {
                if (s.getAttribute("data-value") <= savedRating) {
                    s.classList.add("active");
                }
            });
        }

        stars.forEach(star => {
            star.addEventListener("click", (event) => {
                event.stopPropagation(); // Verhindert, dass der Klick auf die Karte ausgelöst wird

                const value = star.getAttribute("data-value");
            
                // speichern
                localStorage.setItem("rating_" + index, value);
            
                stars.forEach(s => {
                    s.classList.remove("active");
                    if (s.getAttribute("data-value") <= value) {
                        s.classList.add("active");
                    }
                });
            });
        });
    });

    // Favoritenfunktion
    document.querySelectorAll(".favorite i").forEach((icon, index) => {
    
        // Beim Laden prüfen
        if (localStorage.getItem("fav_" + index) === "true") {
            icon.classList.add("active", "fa-solid");
            icon.classList.remove("fa-regular");
        }

        icon.addEventListener("click", (event) => {
            event.stopPropagation(); 

            icon.classList.toggle("active");
            if (icon.classList.contains("active")) {
                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
                localStorage.setItem("fav_" + index, "true");
            } else {
                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");
                localStorage.setItem("fav_" + index, "false");
            }
        });
    });

    // Popup-Overlay schließen
    window.addEventListener("click", (e) => {
        document.querySelectorAll(".popup").forEach(popup => {
            if (e.target === popup) {
                popup.style.display = "none";
            }
        });
    });



    // Scroll zu Cards statt zu Titel
    document.querySelectorAll(".category").forEach(category => {
        category.addEventListener("click", (e) => {
            e.preventDefault();
        
            // ID aus href auslesen
            const href = category.getAttribute("href");
            const section = document.querySelector(href);
        
            if (section) {
                // Zur .card-row innerhalb der Sektion scrollen
                const cardRow = section.querySelector(".card-row");
                if (cardRow) {
                    cardRow.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        });
    });

    // Cursor-Glow-Effekt
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const glow = document.querySelector(".cursor-glow");

    if (window.matchMedia("(hover: none)").matches) return;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        glow.style.left = currentX + "px";
        glow.style.top = currentY + "px";

        requestAnimationFrame(animateGlow);
    }

    animateGlow();

    document.querySelectorAll(".card, .btn").forEach(e1 => {
        e1.addEventListener("mouseenter", () => {
            glow.style.transform = "translate(-50%, -50%) scale(1.5)";
        });

        e1.addEventListener("mouseleave", () => {
            glow.style.transform = "translate(-50%, -50%) scale(1)";
        });
    });

    const searchInput = document.getElementById("searchInput");
    const cards = document.querySelectorAll(".card");

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".tutor-section").forEach(section => {
            const cards = section.querySelectorAll(".card");
            let visibleCards = 0;

            cards.forEach(card => {
                card.dataset.search =
                    card.querySelector("h3").innerText.toLowerCase() + "" + 
                    card.querySelector(".category-tag").innerText.toLowerCase();

                if (card.dataset.search.includes(value)) {
                    card.style.display = "";
                    visibleCards++;
                } else {
                    card.style.display = "none";
                }
            });

            section.style.display = visibleCards > 0 ? "block" : "none";
        });
    });

    // Bilder laden nach JS
    window.addEventListener("load", updateHeaderHeight);

    // Mobile Nav
    function toggleMenu() {
        const nav = document.getElementById("mobileNav");

        nav.classList.toggle("open");
        document.body.classList.toggle("menu-open");
    }
});

// Premium Erweiterung

document.addEventListener("DOMContentLoaded", () => {
    initMobilePremium();
    initCardEntrance();
});

function initMobilePremium() {
    const burger = document.querySelector(".burger");
    const closeBtn = document.querySelector(".close-nav");
    const nav = document.getElementById("mobileNav");

    if (!burger || !nav) return;

    burger.addEventListener("click", () => {
        nav.classList.toggle("open");
        document.body.classList.toggle("menu-open");
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            nav.classList.remove("open");
            document.body.classList.remove("menu-open");
        });
    }
}

function initCardEntrance() {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, i) => {
        card.style.transitionDelay = `$ {i * 80}ms`;
    });
}