"use strict";

/* =========================================
   DASHBOARD PAGE (meine-kurse.html)
========================================= */

function updateDashboardPage() {
    const authCheck = document.getElementById("authCheck");
    const dashboardContent = document.getElementById("dashboardContent");

    if (!authCheck || !dashboardContent) return;

    if (!currentUser) {
        authCheck.style.display = "block";
        dashboardContent.style.display = "none";
    } else {
        authCheck.style.display = "none";
        dashboardContent.style.display = "block";
        document.getElementById("dashName").innerText = currentUser.name;
        document.getElementById("dashMail").innerText = currentUser.email;
        renderDashboardPageContent();
    }
}

function renderDashboardPageContent() {
    renderDashboardPageBookings();
    renderDashboardPageFavorites();
    renderDashboardPageRatings();
    renderDashboardPageMessages();
}

function renderDashboardPageMessages() {

    const container = document.getElementById("messagesContent");

    if (!container) return;

    if (!currentUser || !currentUser.messages.length) {

        container.innerHTML =
            "<p class='empty'><i class='fa-solid fa-envelope'></i> Keine Nachrichten gesendet</p>";

        return;
    }

    const sorted = [...currentUser.messages]
        .sort((a, b) => b.id - a.id);

    container.innerHTML = sorted
        .map(msg => {

            if (msg.type === "support") {

                return `
                    <div class="message-card support">
                        <div class="message-info">
                            <span class="message-badge">Support</span>
                            <h4>${msg.subject || "Kontaktanfrage"}</h4>
                            <p class="message-text">${msg.text}</p>
                            <p class="message-date">${msg.date}</p>
                        </div>
                    </div>
                `;
            }

            const tutorId = msg.tutorId || getTutorIdByName(msg.tutorName);
            const img = tutorId ? `images/${tutorId}.jpg` : "";

            return `
                <div class="message-card">
                    ${img ? `<img src="${img}" alt="${msg.tutorName}">` : ""}
                    <div class="message-info">
                        <span class="message-badge tutor">An Tutor</span>
                        <h4>${msg.tutorName}</h4>
                        <p class="message-subject"><strong>${msg.subject || "Nachricht"}</strong></p>
                        <p class="message-text">${msg.text}</p>
                        <p class="message-date">${msg.date}</p>
                    </div>
                    ${tutorId
                        ? `<button class="btn secondary small" onclick="openTutorPage('${tutorId}')">Profil</button>`
                        : ""
                    }
                </div>
            `;
        })
        .join("");
}

function renderDashboardPageBookings() {
    const container = document.getElementById("bookingsContent");

    if (!container) return;
    if (!currentUser || !currentUser.bookings || currentUser.bookings.length === 0) {
        container.innerHTML = "<p class='empty'><i class='fa-solid fa-inbox'></i> Keine Buchungen vorhanden</p>";
        return;
    }

    // Filter out valid booking objects
    const validBookings = currentUser.bookings.filter(booking => booking && typeof booking === "object");
    
    if (validBookings.length === 0) {
        container.innerHTML = "<p class='empty'><i class='fa-solid fa-inbox'></i> Keine Buchungen vorhanden</p>";
        return;
    }

    // Group bookings by tutor name and count them
    const bookingsByTutor = {};
    validBookings.forEach(booking => {
        const tutorName = booking.tutorName || booking.name || "Tutor";
        if (!bookingsByTutor[tutorName]) {
            bookingsByTutor[tutorName] = {
                count: 0,
                booking: booking
            };
        }
        bookingsByTutor[tutorName].count++;
    });

    container.innerHTML = Object.entries(bookingsByTutor)
        .map(([tutorName, data]) => {
            const booking = data.booking;
            const count = data.count;
            const priceInfo =
                booking.finalPrice && booking.discount > 0
                    ? `<p class="booking-price">${booking.finalPrice}€ <small>(${booking.discount}% Rabatt)</small></p>`
                    : booking.finalPrice
                        ? `<p class="booking-price">${booking.finalPrice}€ / Stunde</p>`
                        : "";

            const countBadge = count > 1 ? `<span style="color: #d4af37; font-size: 0.9rem; margin-left: 8px;">(${count}x gebucht)</span>` : "";

            return `
            <div class="booking-card">
                <div class="booking-info">
                    <h4>${tutorName}${countBadge}</h4>
                    <p class="booking-status">✓ Session angefordert</p>
                    ${priceInfo}
                </div>
                <button class="btn secondary small" onclick="showPopup('Kontaktieren Sie ${tutorName} über die Plattform um Details zu besprechen.', 'info')">
                    Details
                </button>
            </div>
        `;
        })
        .join("");
}

function renderDashboardPageFavorites() {
    const container = document.getElementById("favoritesContent");

    if (!container) return;
    if (!currentUser || !currentUser.favorites.length) {
        container.innerHTML = "<p class='empty'><i class='fa-solid fa-heart'></i> Keine Favoriten gespeichert</p>";
        return;
    }

    container.innerHTML = currentUser.favorites
        .map(name => {
            const id = getTutorIdByName(name);
            const tutor = id ? tutorData[id] : null;

            if (!tutor) return "";

            return `
                <div class="favorite-card" onclick="openTutorPage('${id}')">
                    <img src="images/${id}.jpg" alt="${name}">
                    <div class="favorite-info">
                        <h4>${name}</h4>
                        <p>${tutor.category}</p>
                    </div>
                    <i class="fa-solid fa-arrow-right"></i>
                </div>
            `;
        })
        .join("");
}

function renderDashboardPageRatings() {
    const container = document.getElementById("ratingsContent");

    if (!container) return;
    if (!currentUser || !currentUser.ratings || !Object.keys(currentUser.ratings).length) {
        container.innerHTML = "<p class='empty'><i class='fa-solid fa-star'></i> Keine Bewertungen</p>";
        return;
    }

    container.innerHTML = Object.entries(currentUser.ratings)
        .map(([name, val]) => {
            const stars = "⭐".repeat(val) + "☆".repeat(5 - val);
            return `
                <div class="rating-card">
                    <h4>${name}</h4>
                    <div class="stars-display">${stars}</div>
                    <p class="rating-value">${val} von 5 Sternen</p>
                </div>
            `;
        })
        .join("");
}

function initDashboardPageTabs() {
    document.querySelectorAll(".dashboard-page .dashboard-tabs .tab").forEach(tab => {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".dashboard-page .dashboard-tabs .tab").forEach(t =>
                t.classList.remove("active")
            );
            document.querySelectorAll(".dashboard-page .tab-content").forEach(c =>
                c.classList.remove("active")
            );

            this.classList.add("active");
            const tabName = this.dataset.tab;
            document.querySelector(".dashboard-page #tab-" + tabName)?.classList.add("active");
        });
    });
}
