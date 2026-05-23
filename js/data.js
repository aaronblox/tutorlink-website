"use strict";

/* =========================================
   TUTOR DATA
========================================= */

const tutorData = {
    fridolin: {
        name: "Fridolin Wumpe",
        category: "Webentwicklung",
        filterCategory: "technik",
        rating: "⭐ 4.5 (95 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Fridolin ist erfahrener Webentwickler mit über 10 Jahren Erfahrung.",
        about: "Mit über 10 Jahren Erfahrung in der Webentwicklung helfe ich dir, moderne und responsive Websites zu erstellen. Mein Fokus liegt auf praktischen, realen Projekten, die du sofort verstehen kannst.",
        price: 45,
        experience: "10 Jahre",
        sessions: 240,
        rating_score: "4.5",
        skills: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "MongoDB", "UI/UX"],
        resume: [
            { period: "2020 - Heute", title: "Senior Webentwickler", company: "Freelancer & Tutor für moderne Webentwicklung" },
            { period: "2017 - 2020", title: "Frontend Developer", company: "Agentur für UI/UX & Webapps" },
            { period: "2014 - 2017", title: "Studium Informatik", company: "Schwerpunkt Webtechnologien" }
        ]
    },

    luna: {
        name: "Luna Attamann",
        category: "Social Media Marketing",
        filterCategory: "kreativ",
        rating: "⭐ 4.8 (120 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Luna ist Expertin für Social Media Marketing.",
        about: "Als zertifizierte Social Media Managerin arbeite ich mit Marken auf Instagram, TikTok und LinkedIn. Ich zeige dir, wie du eine Audience aufbaust und deine Brand authentisch kommunizierst.",
        price: 38,
        experience: "7 Jahre",
        sessions: 285,
        rating_score: "4.8",
        skills: ["Instagram", "TikTok", "LinkedIn", "Content Creation", "Analytics", "Influencer Marketing", "Storytelling"],
        resume: [
            { period: "2022 - Heute", title: "Social Media Strategin", company: "Selbstständig & Tutor" },
            { period: "2019 - 2022", title: "Social Media Manager", company: "Kreativagentur Berlin" },
            { period: "2018 - 2019", title: "Marketing Assistentin", company: "E-Commerce Startup" }
        ]
    },

    leyla: {
        name: "Leyla Mayer",
        category: "Painting & Zeichnen",
        filterCategory: "kreativ",
        rating: "⭐ 4.8 (100 Bewertungen)",
        kursart: "💬 Präsenzkurse",
        description: "Leyla unterrichtet Malerei und Zeichnen.",
        about: "Kunstlehrerin mit 12 Jahren Erfahrung. Ich unterrichte klassische Zeichentechniken, Aquarell, Acryl und moderne Kunstforms. Jeder Schüler lernt in seinem eigenen Tempo.",
        price: 40,
        experience: "12 Jahre",
        sessions: 320,
        rating_score: "4.8",
        skills: ["Bleistiftzeichnung", "Aquarell", "Acryl", "Ölmalerei", "Anatomie", "Perspektive", "Abstrakt"],
        resume: [
            { period: "2018 - Heute", title: "Kunstlehrerin", company: "Eigenes Atelier in Düsseldorf" },
            { period: "2015 - 2018", title: "Kunstlehrerin", company: "Gymnasium Düsseldorf" },
            { period: "2011 - 2015", title: "Kunststudium", company: "Kunstakademie Düsseldorf" }
        ]
    },

    paul: {
        name: "Paul Weber",
        category: "Ernährung & Fitness",
        filterCategory: "sport",
        rating: "⭐ 4.9 (85 Bewertungen)",
        kursart: "💬 Präsenzkurse",
        description: "Paul hilft bei Fitness und Ernährung.",
        about: "Zertifizierter Personal Trainer und Ernährungsberater. Ich erstelle personalisierte Trainingspläne und Ernährungsratschläge, die zu deinen Zielen passen. Gemeinsam erreichen wir deine Fitness-Ziele!",
        price: 50,
        experience: "8 Jahre",
        sessions: 195,
        rating_score: "4.9",
        skills: ["Kraft- & Ausdauertraining", "Ernährungsberatung", "Gewichtsmanagement", "HIIT", "Rehabilitation", "Körperfettmessung"],
        resume: [
            { period: "2020 - Heute", title: "Personal Trainer & Ernährungsberater", company: "Eigenes Studio" },
            { period: "2017 - 2020", title: "Fitnesstrainer", company: "Fitnessstudio Düsseldorf" },
            { period: "2015 - 2017", title: "Sportwissenschaft Studium", company: "Universität Köln" }
        ]
    },

    anna: {
        name: "Anna Müller",
        category: "Deutsch & Grammatik",
        filterCategory: "sprachen",
        rating: "⭐ 4.7 (110 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Anna bietet Nachhilfe in Deutsch.",
        about: "Deutschlehrerin mit Passion für Sprache und Literatur. Ich helfe dir mit Grammatik, Schreiben, Lesen und Präsentation. Unterricht ist spielerisch und motivierend.",
        price: 32,
        experience: "9 Jahre",
        sessions: 350,
        rating_score: "4.7",
        skills: ["Grammatik", "Literatur", "Schriftlich", "Sprechfertigkeit", "Prüfungsvorbereitung", "Daf/Daz"],
        resume: [
            { period: "2019 - Heute", title: "Deutschlehrerin Online", company: "Tutorlink & Eigenpraxis" },
            { period: "2016 - 2019", title: "Deutschlehrerin", company: "Realschule Düsseldorf" },
            { period: "2014 - 2016", title: "Deutsch & Geschichte Studium", company: "Universität Düsseldorf" }
        ]
    },

    julian: {
        name: "Julian Sano",
        category: "Mathematik Nachhilfe",
        filterCategory: "wissenschaft",
        rating: "⭐ 4.6 (90 Bewertungen)",
        kursart: "💬 Online-Kurse",
        description: "Julian erklärt Mathematik verständlich.",
        about: "Mathematiker mit Leidenschaft für Pädagogik. Ich erkläre komplexe Themen einfach und nachvollziehbar. Mit verschiedenen Lernmethoden finden wir deinen optimalen Lernstil.",
        price: 35,
        experience: "6 Jahre",
        sessions: 210,
        rating_score: "4.6",
        skills: ["Algebra", "Geometrie", "Trigonometrie", "Analysis", "Stochastik", "Vorbereitung Abitur"],
        resume: [
            { period: "2021 - Heute", title: "Mathematik Tutor", company: "Online Plattformen & Eigenpraxis" },
            { period: "2018 - 2021", title: "Mathematiklehrer", company: "Gymnasium Köln" },
            { period: "2016 - 2018", title: "Mathematik Studium", company: "Universität Köln" }
        ]
    }
};

/* =========================================
   CATEGORY MAPPING
========================================= */

const categoryMapping = {
    "technik": ["webentwicklung", "programmierung", "coding", "javascript", "python", "html", "css"],
    "kreativ": ["social media", "marketing", "design", "zeichnen", "painting", "malerei", "grafik"],
    "sport": ["fitness", "ernährung", "sport", "training"],
    "sprachen": ["deutsch", "englisch", "französisch", "spanisch", "grammatik", "sprache", "linguistik"],
    "musik": ["musik", "gitarre", "klavier", "saxophon", "schlagzeug", "gesang"],
    "wissenschaft": ["mathematik", "physik", "chemie", "biologie", "wissenschaft"],
    "kochen": ["kochen", "küche", "backen", "rezept", "kulinarisch"],
    "business": ["business", "marketing", "führung", "unternehmertum", "verkauf"]
};

function getFilterCategory(tutorTag) {
    const normalized = tutorTag.toLowerCase();
    for (const [filterCat, keywords] of Object.entries(categoryMapping)) {
        if (keywords.some(keyword => normalized.includes(keyword))) {
            return filterCat;
        }
    }
    return "";
}

function getTutorIdByName(name) {
    for (const [id, tutor] of Object.entries(tutorData)) {
        if (tutor.name === name) return id;
    }
    return null;
}

/* =========================================
   CREATOR CODES
========================================= */

const creatorCodes = {
    TUTORLINK10: { discount: 10, label: "10% Rabatt" },
    SCHULE2026: { discount: 15, label: "15% Schulrabatt" },
    CREATOR25: { discount: 25, label: "25% Creator-Rabatt" }
};

function getCreatorCodeInfo(code) {
    if (!code) return null;
    return creatorCodes[code.toUpperCase().trim()] || null;
}

/* =========================================
   GLOBALE SUCHE
========================================= */

function searchTutorsFromData(query) {

    const value = query.toLowerCase().trim();

    if (!value) return [];

    const results = [];

    for (const [id, tutor] of Object.entries(tutorData)) {

        const skills = (tutor.skills || []).join(" ");

        const full =
            (tutor.name + " " + tutor.category + " " + skills).toLowerCase();

        if (full.includes(value)) {

            results.push({
                id,
                name: tutor.name,
                cat: tutor.category
            });
        }
    }

    return results;
}
