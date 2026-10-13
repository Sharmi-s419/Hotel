/**
 * HOTEL LARA INTERNATIONAL — SUCHINDRAM, TAMIL NADU
 * Core Application Controller, Booking Engine & Admin Management
 */

// 1. Initial Room Inventory Database (Clearly marked editable placeholders)
const DEFAULT_ROOMS = [
  {
    id: "deluxe-ac-room",
    name: "Standard Deluxe AC Room",
    type: "Deluxe",
    tagline: "Ideal for couples, solo pilgrims & spiritual travellers",
    occupancy: "2 Adults (Max 1 Child)",
    bed: "1 Queen Bed",
    size: "240 sq.ft (approx.)",
    image: "assets/images/hotel-room-demo.jpg",
    demoPriceINR: 1850,
    isAvailable: true,
    description: "Well-appointed, air-conditioned room featuring comfortable bedding, peaceful natural light, modern ensuite bathroom, and silent ceiling fan. Meticulously cleaned daily.",
    facilities: [
      "Split Air Conditioning",
      "High-Speed Wi-Fi",
      "Attached Bathroom with 24/7 Hot Water",
      "Daily Housekeeping",
      "Generator Power Backup",
      "Electric Kettle & Tea Setup"
    ]
  },
  {
    id: "executive-family-suite",
    name: "Executive Family Suite",
    type: "Family Suite",
    tagline: "Spacious comfort designed for multi-generational family pilgrimages",
    occupancy: "4 Adults (Max 2 Children)",
    bed: "2 Queen Beds or 1 King + Twin",
    size: "380 sq.ft (approx.)",
    image: "assets/images/hero-suite.jpg",
    demoPriceINR: 2950,
    isAvailable: true,
    description: "Generously proportioned family sanctuary with ample luggage space, twin wardrobe, seating lounge, and dedicated vanity area. Perfect for visiting Thanumalayan Temple and ISKCON.",
    facilities: [
      "Dual Air Conditioning",
      "High-Speed Wi-Fi",
      "Spacious Ensuite Bathroom",
      "Seating Coffee Table & Chairs",
      "24/7 Hot Water Supply",
      "Elevator / Lift Access",
      "Free Parking for Tourist Vans & Cars"
    ]
  },
  {
    id: "temple-view-premium",
    name: "Temple View Premium Room",
    type: "Premium",
    tagline: "Serene room with balcony view towards Suchindram town greenery",
    occupancy: "2 Adults + 1 Extra Bed on request",
    bed: "1 King Bed",
    size: "280 sq.ft (approx.)",
    image: "assets/images/hotel-room-demo.jpg",
    demoPriceINR: 2400,
    isAvailable: true,
    description: "Premium room positioned on upper floors featuring a private sit-out balcony. Soak in the spiritual morning breeze and quiet evening ambience of Suchindram.",
    facilities: [
      "Split Air Conditioning",
      "Private Sit-out Balcony",
      "High-Speed Wi-Fi",
      "Smart Flat Screen TV",
      "Spotless Bathroom & Toiletries",
      "24/7 Front Desk Assistance",
      "Temple Darshan Travel Guidance"
    ]
  }
];

// 2. Initial Demo Gallery Assets
const GALLERY_ITEMS = [
  { category: "exterior", title: "Hotel Exterior & Driveway (Demo Preview)", img: "assets/images/hotel-exterior-demo.jpg" },
  { category: "rooms", title: "Standard Deluxe AC Room (Demo Preview)", img: "assets/images/hotel-room-demo.jpg" },
  { category: "interiors", title: "Spotless Modern Bathroom (Demo Preview)", img: "assets/images/hotel-bathroom-demo.jpg" },
  { category: "reception", title: "Front Desk & Welcoming Lobby (Demo Preview)", img: "assets/images/hotel-lobby-demo.jpg" },
  { category: "attractions", title: "Thanumalayan Temple (~1 km from Hotel)", img: "assets/images/thanumalayan-temple.jpg" },
  { category: "attractions", title: "ISKCON Spiritual Centre (~50 m from Hotel)", img: "assets/images/iskcon-suchindram.jpg" },
];

// Global Application State
let appState = {
  rooms: [],
  reservations: [],
  searchCriteria: {
    checkIn: getFutureDate(1),
    checkOut: getFutureDate(3),
    guests: "2 Adults",
    roomsCount: 1,
    nights: 2
  },
  selectedRoom: null,
  activeGalleryFilter: "all"
};

// Date utilities
function getFutureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
}

function formatDatePretty(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatCurrencyINR(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// Toast Notifications
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  loadStoredData();
  setupNavigation();
  setupSearchWidget();
  renderRoomsGrid();
  renderGallery();
  setupContactForm();
});

// Load persistent local data
function loadStoredData() {
  const storedRooms = localStorage.getItem("hli_rooms");
  appState.rooms = storedRooms ? JSON.parse(storedRooms) : DEFAULT_ROOMS;

  const storedBookings = localStorage.getItem("hli_reservations");
  appState.reservations = storedBookings ? JSON.parse(storedBookings) : [
    {
      ref: "HLI-2026-1042",
      guestName: "Sundaramurthy K.",
      roomName: "Standard Deluxe AC Room",
      checkIn: getFutureDate(5),
      checkOut: getFutureDate(7),
      nights: 2,
      totalAmount: 4366,
      status: "Confirmed (Pre-Opening)",
      paymentStatus: "Paid (Simulated Sandbox)"
    }
  ];
}

// Navigation & Mobile Drawer
function setupNavigation() {
  const header = document.querySelector(".main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenuList");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      const isVisible = navMenu.style.display === "flex";
      navMenu.style.display = isVisible ? "none" : "flex";
      if (!isVisible) {
        navMenu.style.flexDirection = "column";
        navMenu.style.position = "absolute";
        navMenu.style.top = "80px";
        navMenu.style.left = "0";
        navMenu.style.width = "100%";
        navMenu.style.background = "#12151b";
        navMenu.style.padding = "1.5rem";
        navMenu.style.borderBottom = "1px solid rgba(197, 160, 89, 0.3)";
      }
    });
  }
}

// Search Widget Controls
function setupSearchWidget() {
  const checkInInput = document.getElementById("searchCheckIn");
  const checkOutInput = document.getElementById("searchCheckOut");
  const guestsSelect = document.getElementById("searchGuests");
  const roomsSelect = document.getElementById("searchRooms");
  const searchBtn = document.getElementById("searchSubmitBtn");

  if (checkInInput) checkInInput.value = appState.searchCriteria.checkIn;
  if (checkOutInput) checkOutInput.value = appState.searchCriteria.checkOut;

  const updateNights = () => {
    const d1 = new Date(checkInInput.value);
    const d2 = new Date(checkOutInput.value);
    if (d2 <= d1) {
      const next = new Date(d1);
      next.setDate(next.getDate() + 1);
      checkOutInput.value = next.toISOString().split("T")[0];
    }
    const diff = Math.abs(new Date(checkOutInput.value) - new Date(checkInInput.value));
    appState.searchCriteria.nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    appState.searchCriteria.checkIn = checkInInput.value;
    appState.searchCriteria.checkOut = checkOutInput.value;
    if (guestsSelect) appState.searchCriteria.guests = guestsSelect.value;
    if (roomsSelect) appState.searchCriteria.roomsCount = Number(roomsSelect.value);
  };

  if (checkInInput && checkOutInput) {
    checkInInput.addEventListener("change", updateNights);
    checkOutInput.addEventListener("change", updateNights);
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      updateNights();
      const roomsSection = document.getElementById("roomsSection");
      if (roomsSection) {
        roomsSection.scrollIntoView({ behavior: "smooth" });
      }
      showToast(`Showing room availability for ${appState.searchCriteria.nights} night(s). All rates are pre-opening demo estimates.`);
    });
  }
}

// Render Rooms Grid
function renderRoomsGrid() {
  const grid = document.getElementById("roomsGrid");
  if (!grid) return;

  grid.innerHTML = appState.rooms.map(room => {
    return `
      <div class="room-card" data-room-id="${room.id}">
        <div class="room-img-wrap">
          <img src="${room.image}" alt="${room.name}" class="room-img" loading="lazy">
          <div class="room-demo-badge">Demo Asset • Subject to Photo Update</div>
          <div class="room-occupancy-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>${room.occupancy}</span>
          </div>
        </div>

        <div class="room-card-body">
          <div style="font-size: 0.6875rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-gold); font-weight: 700; margin-bottom: 0.25rem;">
            ${room.type} • ${room.size}
          </div>
          <h3 class="room-title">${room.name}</h3>
          <p class="room-desc">${room.description}</p>

          <div class="room-facilities-list">
            ${room.facilities.slice(0, 4).map(f => `<span class="facility-pill">${f}</span>`).join("")}
          </div>

          <div class="room-pricing-row">
            <div>
              <span class="price-unit-label">Starting from</span>
              <div class="price-currency-value">${formatCurrencyINR(room.demoPriceINR)} <span style="font-size: 0.8rem; color: var(--color-text-muted); font-family: var(--font-sans); font-weight: normal;">/ night</span></div>
              <span class="price-demo-disclaimer">*Demo Rate • Final Prices TBA</span>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.75rem; color: #68d391; font-weight: 600;">Direct Booking Advantage</span>
            </div>
          </div>

          <div class="room-actions-row">
            <button class="btn-room-details" onclick="openRoomDetailModal('${room.id}')">View Details</button>
            <button class="btn-room-book" onclick="openBookingModal('${room.id}')">Book Room</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Room Detail Modal
window.openRoomDetailModal = function(roomId) {
  const room = appState.rooms.find(r => r.id === roomId);
  if (!room) return;

  const modalBody = document.getElementById("modalBody");
  const modal = document.getElementById("universalModal");
  if (!modalBody || !modal) return;

  modalBody.innerHTML = `
    <div>
      <div style="position: relative; height: 320px; overflow: hidden; border-bottom: 1px solid var(--color-border);">
        <img src="${room.image}" alt="${room.name}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; top: 1rem; left: 1rem;" class="demo-tag">
          Demo Image • Actual Photo Shoot Pending
        </div>
        <div style="position: absolute; bottom: 1.5rem; left: 1.5rem; background: rgba(10, 12, 15, 0.9); padding: 0.6rem 1.25rem; border-radius: var(--radius-xs); border: 1px solid var(--color-gold);">
          <span style="color: var(--color-gold-light); font-size: 0.8125rem; font-weight: 700; text-transform: uppercase;">${room.type} Accommodations</span>
        </div>
      </div>

      <div style="padding: 2.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-family: var(--font-serif); font-size: 2rem; color: #fff; margin-bottom: 0.25rem;">${room.name}</h2>
            <p style="color: var(--color-gold-light); font-size: 0.875rem;">${room.tagline}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--color-gold-light); font-weight: 700;">
              ${formatCurrencyINR(room.demoPriceINR)} <span style="font-size: 0.875rem; color: var(--color-text-muted); font-family: var(--font-sans);">/ night</span>
            </div>
            <span style="font-size: 0.75rem; color: #f6ad55;">*Estimated Demo Price</span>
          </div>
        </div>

        <p style="color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 2rem; font-size: 0.9375rem;">
          ${room.description}
        </p>

        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: #fff; margin-bottom: 1rem;">Confirmed Room Specifications &amp; Amenities</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 2rem;">
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.75rem 1rem; border-radius: var(--radius-xs); font-size: 0.8125rem;">
            <strong style="color: #fff; display: block;">Bed Configuration:</strong>
            <span style="color: var(--color-text-muted);">${room.bed}</span>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.75rem 1rem; border-radius: var(--radius-xs); font-size: 0.8125rem;">
            <strong style="color: #fff; display: block;">Max Occupancy:</strong>
            <span style="color: var(--color-text-muted);">${room.occupancy}</span>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.75rem 1rem; border-radius: var(--radius-xs); font-size: 0.8125rem;">
            <strong style="color: #fff; display: block;">Room Dimensions:</strong>
            <span style="color: var(--color-text-muted);">${room.size}</span>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 0.75rem 1rem; border-radius: var(--radius-xs); font-size: 0.8125rem;">
            <strong style="color: #fff; display: block;">Location:</strong>
            <span style="color: var(--color-text-muted);">Suchindram, Tamil Nadu</span>
          </div>
        </div>

        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: #fff; margin-bottom: 0.75rem;">Verified Inclusions:</h4>
        <ul style="list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 2rem;">
          ${room.facilities.map(f => `
            <li style="font-size: 0.8125rem; color: var(--color-text-secondary); display: flex; align-items: center; gap: 0.5rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c5a059" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${f}</span>
            </li>
          `).join("")}
        </ul>

        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
          <button class="btn-outline-gold" onclick="closeModal()">Close Window</button>
          <button class="btn-gold" onclick="openBookingModal('${room.id}')">Reserve This Room</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("open");
};

// Booking Reservation Flow Modal
window.openBookingModal = function(roomId) {
  const room = appState.rooms.find(r => r.id === roomId) || appState.rooms[0];
  appState.selectedRoom = room;

  const modalBody = document.getElementById("modalBody");
  const modal = document.getElementById("universalModal");
  if (!modalBody || !modal) return;

  renderBookingStep();
  modal.classList.add("open");
};

function renderBookingStep() {
  const room = appState.selectedRoom;
  const nights = appState.searchCriteria.nights;
  const roomsCount = appState.searchCriteria.roomsCount;
  const roomSubtotal = room.demoPriceINR * nights * roomsCount;
  const taxesGST = Math.round(roomSubtotal * 0.12); // 12% standard GST for hospitality under ₹7,500
  const grandTotal = roomSubtotal + taxesGST;

  const modalBody = document.getElementById("modalBody");

  modalBody.innerHTML = `
    <div style="padding: 2.25rem;">
      <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span style="font-size: 0.6875rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-gold); font-weight: 700;">Direct Reservation Desk</span>
          <h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: #fff;">${room.name}</h2>
        </div>
        <div class="demo-tag">
          Pre-Opening Reservation Sandbox
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.35fr 1fr; gap: 2rem;" class="booking-modal-layout">
        <div>
          <!-- Guest Information Form -->
          <form id="bookingGuestForm" onsubmit="handleBookingSubmission(event)">
            <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: #fff; margin-bottom: 1rem;">Guest Details</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
              <div>
                <label style="display: block; font-size: 0.6875rem; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.25rem;">Full Name *</label>
                <input type="text" id="guestFullName" required placeholder="Sri / Smt / Mr / Ms..." style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-xs); padding: 0.65rem 0.8rem; color: #fff; font-size: 0.875rem;">
              </div>
              <div>
                <label style="display: block; font-size: 0.6875rem; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.25rem;">Mobile Phone (WhatsApp) *</label>
                <input type="tel" id="guestPhone" required placeholder="+91 98765 43210" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-xs); padding: 0.65rem 0.8rem; color: #fff; font-size: 0.875rem;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
              <div>
                <label style="display: block; font-size: 0.6875rem; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.25rem;">Email Address *</label>
                <input type="email" id="guestEmail" required placeholder="guest@example.com" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-xs); padding: 0.65rem 0.8rem; color: #fff; font-size: 0.875rem;">
              </div>
              <div>
                <label style="display: block; font-size: 0.6875rem; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.25rem;">City / State of Origin</label>
                <input type="text" id="guestOrigin" placeholder="e.g. Chennai / Bengaluru / Madurai" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-xs); padding: 0.65rem 0.8rem; color: #fff; font-size: 0.875rem;">
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="display: block; font-size: 0.6875rem; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.25rem;">Special Pilgrimage Requests / Preferences</label>
              <textarea id="guestSpecialRequests" rows="2" placeholder="e.g. Ground floor request for senior citizens, early morning temple darshan wake-up, parking assistance..." style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius-xs); padding: 0.65rem 0.8rem; color: #fff; font-size: 0.8125rem;"></textarea>
            </div>

            <!-- Payment Simulation Choice -->
            <div style="margin-bottom: 1.5rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-xs); padding: 1rem;">
              <label style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-gold-light); font-weight: 700; margin-bottom: 0.5rem;">Select Payment Mode (Sandbox Integration)</label>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.8125rem; color: #fff; cursor: pointer;">
                  <input type="radio" name="paymentOption" value="razorpay" checked>
                  <span>Online Payment (Razorpay / UPI / Cards)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.8125rem; color: #fff; cursor: pointer;">
                  <input type="radio" name="paymentOption" value="pay_at_hotel">
                  <span>Pay at Hotel on Arrival</span>
                </label>
              </div>
            </div>

            <button type="submit" class="btn-gold" style="width: 100%; padding: 0.85rem;">
              Confirm Reservation (${formatCurrencyINR(grandTotal)})
            </button>
          </form>
        </div>

        <!-- Breakdown Card -->
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-xs); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 1.25rem; color: #fff; margin-bottom: 1rem;">Stay Breakdown</h4>
            
            <div style="font-size: 0.8125rem; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <span style="color: var(--color-text-muted);">Check-in:</span>
                <span style="color: #fff; font-weight: 600;">${formatDatePretty(appState.searchCriteria.checkIn)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                <span style="color: var(--color-text-muted);">Check-out:</span>
                <span style="color: #fff; font-weight: 600;">${formatDatePretty(appState.searchCriteria.checkOut)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--color-text-muted);">Duration:</span>
                <span style="color: var(--color-gold-light); font-weight: 600;">${nights} Night(s), ${roomsCount} Room(s)</span>
              </div>
            </div>

            <div style="font-size: 0.8125rem; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--color-text-secondary);">Room Charge:</span>
                <span style="color: #fff;">${formatCurrencyINR(roomSubtotal)}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--color-text-muted);">Applicable GST (12%):</span>
                <span style="color: #fff;">${formatCurrencyINR(taxesGST)}</span>
              </div>
            </div>

            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: baseline;">
              <div>
                <span style="display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted);">Total Estimate</span>
                <span style="font-size: 0.6875rem; color: #68d391;">No booking fees</span>
              </div>
              <div style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--color-gold-light); font-weight: 700;">
                ${formatCurrencyINR(grandTotal)}
              </div>
            </div>
          </div>

          <div style="background: rgba(197, 160, 89, 0.08); border: 1px dashed var(--color-gold); border-radius: var(--radius-xs); padding: 0.85rem; margin-top: 1.5rem; font-size: 0.75rem; color: var(--color-gold-light);">
            <div style="font-weight: 700; margin-bottom: 0.2rem;">Location Proximity Advantage:</div>
            <div>• ~50 metres from ISKCON Suchindram</div>
            <div>• ~1 km from Thanumalayan Temple</div>
            <div>• Free cancellation up to 24 hrs prior to check-in</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Booking Submission
window.handleBookingSubmission = function(e) {
  e.preventDefault();

  const name = document.getElementById("guestFullName").value;
  const phone = document.getElementById("guestPhone").value;
  const email = document.getElementById("guestEmail").value;
  const origin = document.getElementById("guestOrigin").value;
  const requests = document.getElementById("guestSpecialRequests").value;
  const paymentMode = document.querySelector("input[name='paymentOption']:checked").value;

  const bookingRef = "HLI-2026-" + Math.floor(1000 + Math.random() * 9000);
  const room = appState.selectedRoom;
  const nights = appState.searchCriteria.nights;
  const grandTotal = (room.demoPriceINR * nights * appState.searchCriteria.roomsCount) * 1.12;

  const newReservation = {
    ref: bookingRef,
    guestName: name,
    phone: phone,
    email: email,
    origin: origin,
    requests: requests,
    roomName: room.name,
    checkIn: appState.searchCriteria.checkIn,
    checkOut: appState.searchCriteria.checkOut,
    nights: nights,
    totalAmount: Math.round(grandTotal),
    status: "Confirmed (Pre-Opening)",
    paymentMode: paymentMode === "razorpay" ? "Online (Simulated)" : "Pay at Hotel",
    createdAt: new Date().toLocaleDateString()
  };

  appState.reservations.unshift(newReservation);
  localStorage.setItem("hli_reservations", JSON.stringify(appState.reservations));

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <div style="padding: 3rem 2rem; text-align: center;">
      <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(56, 161, 105, 0.15); border: 2px solid #38a169; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #38a169;">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <span style="font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-gold); font-weight: 700;">Reservation Acknowledged</span>
      <h2 style="font-family: var(--font-serif); font-size: 2.2rem; color: #fff; margin: 0.5rem 0 1rem;">We Welcome Your Stay in Suchindram</h2>
      <p style="color: var(--color-text-secondary); max-width: 540px; margin: 0 auto 2rem; font-size: 0.9375rem;">
        Your provisional reservation at <strong>Hotel Lara International</strong> has been registered. Reference: <strong>${bookingRef}</strong>.
      </p>

      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 1.5rem; max-width: 500px; margin: 0 auto 2rem; text-align: left;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
          <span style="color: var(--color-text-muted); font-size: 0.8125rem;">Booking Reference:</span>
          <strong style="color: var(--color-gold-light); font-size: 1.05rem;">${bookingRef}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8125rem;">
          <span style="color: var(--color-text-muted);">Primary Guest:</span>
          <span style="color: #fff; font-weight: 600;">${name} (${phone})</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8125rem;">
          <span style="color: var(--color-text-muted);">Room Reserved:</span>
          <span style="color: #fff;">${room.name}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.8125rem;">
          <span style="color: var(--color-text-muted);">Stay Dates:</span>
          <span style="color: #fff;">${formatDatePretty(appState.searchCriteria.checkIn)} – ${formatDatePretty(appState.searchCriteria.checkOut)} (${nights} Nights)</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
          <span style="color: var(--color-text-muted);">Estimated Amount:</span>
          <span style="color: var(--color-gold-light); font-weight: 700;">${formatCurrencyINR(Math.round(grandTotal))}</span>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <button class="btn-outline-gold" onclick="window.print()">Print Booking Voucher</button>
        <button class="btn-gold" onclick="closeModal()">Return to Website</button>
      </div>
    </div>
  `;

  showToast(`Booking ${bookingRef} created successfully!`);
};

// Gallery Renderer
function renderGallery() {
  const container = document.getElementById("galleryGrid");
  if (!container) return;

  const filtered = appState.activeGalleryFilter === "all" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === appState.activeGalleryFilter);

  container.innerHTML = filtered.map(item => `
    <div class="gallery-card" onclick="openLightbox('${item.img}', '${item.title}')">
      <img src="${item.img}" alt="${item.title}" loading="lazy">
      <div class="gallery-card-overlay">
        <span class="gallery-caption">${item.title}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c5a059" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
  `).join("");

  // Setup gallery tab filters
  const tabs = document.querySelectorAll(".gallery-tab-btn");
  tabs.forEach(tab => {
    tab.onclick = () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      appState.activeGalleryFilter = tab.getAttribute("data-category");
      renderGallery();
    };
  });
}

window.openLightbox = function(imgSrc, title) {
  const modalBody = document.getElementById("modalBody");
  const modal = document.getElementById("universalModal");
  if (!modalBody || !modal) return;

  modalBody.innerHTML = `
    <div style="text-align: center; padding: 1.5rem;">
      <img src="${imgSrc}" alt="${title}" style="max-height: 75vh; max-width: 100%; margin: 0 auto; border-radius: var(--radius-xs); border: 1px solid var(--color-border);">
      <p style="color: #fff; margin-top: 1rem; font-family: var(--font-serif); font-size: 1.15rem;">${title}</p>
      <div class="demo-tag" style="margin-top: 0.5rem;">Demo Image • Replaceable with Client Photographs</div>
    </div>
  `;
  modal.classList.add("open");
};

// Contact Enquiry Form
function setupContactForm() {
  const form = document.getElementById("contactEnquiryForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("enquiryName").value;
    const phone = document.getElementById("enquiryPhone").value;
    const msg = document.getElementById("enquiryMessage").value;

    showToast(`Thank you, ${name}! Your pre-opening enquiry has been noted. Our team will contact you at ${phone}.`);
    form.reset();
  });
}

// Admin Dashboard Modal
window.openAdminDashboard = function() {
  const modalBody = document.getElementById("modalBody");
  const modal = document.getElementById("universalModal");
  if (!modalBody || !modal) return;

  modalBody.innerHTML = `
    <div style="padding: 2.25rem;">
      <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span style="font-size: 0.6875rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-gold); font-weight: 700;">Hotel Lara International</span>
          <h2 style="font-family: var(--font-serif); font-size: 1.85rem; color: #fff;">Staff Administration Portal</h2>
        </div>
        <div style="font-size: 0.75rem; color: #68d391; background: rgba(56, 161, 105, 0.15); padding: 0.3rem 0.8rem; border-radius: var(--radius-xs); border: 1px solid #38a169;">
          ● Pre-Opening Management Desk
        </div>
      </div>

      <!-- Quick Stats -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 1.25rem; border-radius: var(--radius-xs);">
          <span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Total Rooms Configured</span>
          <h3 style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--color-gold-light);">${appState.rooms.length} Categories</h3>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 1.25rem; border-radius: var(--radius-xs);">
          <span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Pre-Bookings Logged</span>
          <h3 style="font-family: var(--font-serif); font-size: 1.85rem; color: #68d391;">${appState.reservations.length} Bookings</h3>
        </div>
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 1.25rem; border-radius: var(--radius-xs);">
          <span style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase;">Image Assets Status</span>
          <h3 style="font-family: var(--font-serif); font-size: 1.85rem; color: #f6ad55;">6 Demo Photos</h3>
        </div>
      </div>

      <!-- Room Inventory Editor -->
      <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: #fff; margin-bottom: 1rem;">Manage Room Types &amp; Rates</h3>
      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
        ${appState.rooms.map(r => `
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 1rem; border-radius: var(--radius-xs); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <strong style="color: #fff; font-size: 1rem;">${r.name}</strong>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">${r.occupancy} • ${r.bed}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div>
                <label style="font-size: 0.6875rem; color: var(--color-text-muted); display: block;">Price / Night (INR):</label>
                <input type="number" id="priceInput_${r.id}" value="${r.demoPriceINR}" style="width: 100px; background: rgba(255,255,255,0.08); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: 0.35rem 0.5rem; color: #fff; font-weight: 700;">
              </div>
              <button class="btn-gold" style="font-size: 0.75rem; padding: 0.45rem 0.9rem;" onclick="saveRoomPrice('${r.id}')">Save Rate</button>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Reservations Log -->
      <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: #fff; margin-bottom: 1rem;">Recent Pre-Opening Reservations Desk</h3>
      <div style="overflow-x: auto; margin-bottom: 2rem;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem; color: #fff; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--color-text-muted);">
              <th style="padding: 0.5rem;">Ref</th>
              <th style="padding: 0.5rem;">Guest</th>
              <th style="padding: 0.5rem;">Room</th>
              <th style="padding: 0.5rem;">Check In</th>
              <th style="padding: 0.5rem;">Check Out</th>
              <th style="padding: 0.5rem;">Amount</th>
              <th style="padding: 0.5rem;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${appState.reservations.map(res => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 0.5rem; color: var(--color-gold-light); font-weight: 600;">${res.ref}</td>
                <td style="padding: 0.5rem;">${res.guestName}</td>
                <td style="padding: 0.5rem;">${res.roomName}</td>
                <td style="padding: 0.5rem;">${res.checkIn}</td>
                <td style="padding: 0.5rem;">${res.checkOut}</td>
                <td style="padding: 0.5rem;">${formatCurrencyINR(res.totalAmount)}</td>
                <td style="padding: 0.5rem; color: #68d391;">${res.status}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button class="btn-outline-gold" onclick="closeModal()">Close Admin Console</button>
      </div>
    </div>
  `;

  modal.classList.add("open");
};

window.saveRoomPrice = function(roomId) {
  const input = document.getElementById(`priceInput_${roomId}`);
  if (!input) return;

  const newPrice = Number(input.value);
  const room = appState.rooms.find(r => r.id === roomId);
  if (room && newPrice > 0) {
    room.demoPriceINR = newPrice;
    localStorage.setItem("hli_rooms", JSON.stringify(appState.rooms));
    renderRoomsGrid();
    showToast(`Updated ${room.name} rate to ${formatCurrencyINR(newPrice)}`);
  }
};

// Modal helpers
window.closeModal = function() {
  const modal = document.getElementById("universalModal");
  if (modal) {
    modal.classList.remove("open");
  }
};
