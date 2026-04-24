let currentslide = 0;

const slides = document.querySelector(".slides");
const dots = document.querySelectorAll(".dot");
const totalSlides = document.querySelectorAll(".slide").length;

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

// Hover Events für Slider
const slider = document.querySelector(".hero-slider");

slider.addEventListener("mouseenter", stopSlider);
slider.addEventListener("mouseleave", startSlider);

// Start
updateSlider();
startSlider();

// Scroll Animation
const sections = document.querySelectorAll(".tutor-section");

window.addEventListener("scroll", () => {
    sections.forEach(sec => {
        const pos = sec.getBoundingClientRect().top;
        if (pos < window.innerHeight - 100) {
            sec.style.opacity = 1;
            sec.style.transform = "translateY(0)";
        }
    });
});

// Bewertungssystem
document.querySelectorAll(".stars").forEach(starContainer => {
    const stars = starContainer.querySelectorAll("i");

    stars.forEach(star => {
        star.addEventListener("click", (event) => {
            event.stopPropagation(); // Verhindert, dass der Klick auf die Karte ausgelöst wird

            const value = star.getAttribute("data-value");
            
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
document.querySelectorAll(".favorite i").forEach(icon => {
    icon.addEventListener("click", (event) => {
        event.stopPropagation();

        icon.classList.toggle("active");

        if (icon.classList.contains("active")) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        } else {
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        }
    });
});

// Tutor Öffnen
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
    document.getElementById("kursart").innerText = tutor.kursart;
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

window.addEventListener("click", (e) => {
    document.querySelectorAll(".popup").forEach(popup => {
        if (e.target === popup) {
            popup.style.display = "none";
        }
    });
});

// Search Button Alert
document.querySelector(".search-bar button").addEventListener("click", () => {
    alert("Suchfunktion ist derzeit nicht verfügbar.");
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