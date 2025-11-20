/* Updated script.js
   - toggles enlarge on click for .section-img and .gallery img (click again to shrink)
   - MORE INFO button shows/hides #moreImages and images display 2x2
   - Book Now scrolls to booking form
   - Video autoplay/loop/muted/play
   - Keeps WhatsApp/Email/Instagram behaviors as before
*/

(function () {
  // --- Config ---
  const WA_PHONE = "250794874666";
  const INSTAGRAM_HANDLE = "rukundotourstaxi";
  const COMPANY_EMAIL = "rukundotours.taxi@gmail.com";

  // --- Utility: scroll to and highlight form ---
  function goToForm() {
    const formSection = document.querySelector(".booking-form");
    if (!formSection) return;
    formSection.scrollIntoView({ behavior: "smooth", block: "center" });
    formSection.classList.add("highlight-form");
    setTimeout(() => formSection.classList.remove("highlight-form"), 1600);
  }

// ----- GLOBAL: Track currently enlarged image -----
let currentlyEnlarged = null;
let closeBtn = null;

// Create close button once
function createCloseButton() {
  closeBtn = document.createElement("div");
  closeBtn.className = "close-enlarge-btn";
  closeBtn.innerText = "✕";
  closeBtn.style.display = "none";

  closeBtn.addEventListener("click", () => {
    shrinkCurrentImage();
  });

  document.body.appendChild(closeBtn);
}
createCloseButton();

// Shrink image helper
function shrinkCurrentImage() {
  if (currentlyEnlarged) {
    currentlyEnlarged.classList.remove("enlarged");
    currentlyEnlarged = null;
  }
  closeBtn.style.display = "none";
}

// Toggle enlarge image
function toggleEnlargeImage(img) {

  // If clicking the same enlarged image → shrink
  if (currentlyEnlarged === img) {
    shrinkCurrentImage();
    return;
  }

  // If another image was enlarged → shrink it first
  if (currentlyEnlarged && currentlyEnlarged !== img) {
    shrinkCurrentImage();
  }

  // Enlarge new image
  img.classList.add("enlarged");
  currentlyEnlarged = img;

  // Show close button at correct location
  const rect = img.getBoundingClientRect();
  closeBtn.style.display = "block";
  closeBtn.style.top = rect.top + window.scrollY + 12 + "px";
  closeBtn.style.left = rect.right + window.scrollX - 40 + "px";

  // Reposition close button while scrolling
  window.addEventListener("scroll", () => {
    if (currentlyEnlarged) {
      const r = currentlyEnlarged.getBoundingClientRect();
      closeBtn.style.top = r.top + window.scrollY + 12 + "px";
      closeBtn.style.left = r.right + window.scrollX - 40 + "px";
    }
  });

  // Auto-center enlarged image
  setTimeout(() => img.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
}

// Attach image click events
/* --- UNIVERSAL IMAGE ZOOM (Works for section-img and gallery images) --- */

let currentZoom = null;
let zoomCloseBtn = null;

// Create close button
(function makeZoomButton() {
  zoomCloseBtn = document.createElement("div");
  zoomCloseBtn.className = "zoom-close-btn";
  zoomCloseBtn.innerText = "✕";
  zoomCloseBtn.style.display = "none";
  document.body.appendChild(zoomCloseBtn);

  zoomCloseBtn.addEventListener("click", () => shrinkZoom());
})();

// Shrink helper
function shrinkZoom() {
  if (currentZoom) {
    currentZoom.classList.remove("zoomed");
    currentZoom = null;
  }
  zoomCloseBtn.style.display = "none";
}

// Toggle zoom
function toggleZoom(img) {
  if (currentZoom === img) {
    shrinkZoom();
    return;
  }

  if (currentZoom && currentZoom !== img) shrinkZoom();

  img.classList.add("zoomed");
  currentZoom = img;

  const rect = img.getBoundingClientRect();
  zoomCloseBtn.style.display = "block";
  zoomCloseBtn.style.top = rect.top + window.scrollY + 12 + "px";
  zoomCloseBtn.style.left = rect.right + window.scrollX - 40 + "px";

  window.addEventListener("scroll", () => {
    if (currentZoom) {
      const r = currentZoom.getBoundingClientRect();
      zoomCloseBtn.style.top = r.top + window.scrollY + 12 + "px";
      zoomCloseBtn.style.left = r.right + window.scrollX - 40 + "px";
    }
  });

  img.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Attach zoom to ALL images
function applyZoomHandlers() {
  const imgs = document.querySelectorAll(".section-img, .gallery img");
  imgs.forEach(img => {
    img.addEventListener("click", () => toggleZoom(img));
  });
}

document.addEventListener("DOMContentLoaded", applyZoomHandlers);

/* Optional: support for dynamically added images */
const mo = new MutationObserver(() => applyZoomHandlers());
mo.observe(document.body, { childList: true, subtree: true });


  // --- MORE INFO toggle (show/hide gallery) ---
  const showMoreBtn = document.getElementById("showMoreBtn");
  const moreImages = document.getElementById("moreImages");
  if (showMoreBtn && moreImages) {
    showMoreBtn.addEventListener("click", function () {
      const isVisible = moreImages.style.display === "block";
      moreImages.style.display = isVisible ? "none" : "block";
      showMoreBtn.textContent = isVisible ? "MORE INFO ▼" : "LESS INFO ▲";
      if (!isVisible) {
        // when showing, scroll to gallery
        setTimeout(() => moreImages.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      } else {
        // when hiding, scroll up a bit
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 150);
      }
    });
    // start hidden
    moreImages.style.display = "none";
  }

  // --- Book Now button scroll to form (support multiple IDs) ---
  const bookButtons = document.querySelectorAll("#bookNowMain, #bookNowBtn, .big-book-btn");
  bookButtons.forEach(b => {
    if (!b) return;
    b.addEventListener("click", function (e) {
      e.preventDefault();
      goToForm();
    });
  });

  // --- Video autoplay/loop/muted/playsinline & visual sizing ---
  (function setupVideo() {
    const video = document.querySelector("video.responsive-video");
    if (!video) return;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    // remove controls so it's purely an autoplay animation if you prefer; keep controls if you want user control
    //video.removeAttribute('controls'); // comment/uncomment as you like
    // attempt to play (some browsers require user gesture, but muted autoplay usually works)
    video.play().catch(() => {
      // autoplay failed — keep controls visible
      // no further action required
    });
    // make it visually prominent (wide)
    video.style.width = "100%";
  })();

  // --- WhatsApp booking from form ---
  const taxiForm = document.getElementById("taxiForm");
  if (taxiForm) {
    taxiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // collect fields (if missing, highlight and scroll)
      const name = (document.getElementById("name") || {}).value || "";
      const email = (document.getElementById("email") || {}).value || "";
      const phone = (document.getElementById("phone") || {}).value || "";
      const from = (document.getElementById("from") || {}).value || (document.getElementById("destination") || {}).value || "";
      const to = (document.getElementById("to") || {}).value || "";
      const time = (document.getElementById("time") || {}).value || "";
      const date = (document.getElementById("date") || {}).value || "";

      if (!name) { goToForm(); return; }

      const message =
`🚖 New Taxi Booking Request
Name: ${name}
Email: ${email || "-"}
Phone: ${phone || "-"}
From: ${from || "-"}
To: ${to || "-"}
Time: ${time || "-"}
Date: ${date || "-"}
Please confirm availability.`;

      const u = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(u, "_blank");
      // reset after send
      taxiForm.reset();
    });
  }

  // --- Email button behavior (scroll to form if missing) ---
  const emailBtn = document.getElementById("emailBtn");
  if (emailBtn) {
    emailBtn.addEventListener("click", function () {
      const nameField = document.getElementById("name");
      if (!nameField || !nameField.value) {
        goToForm();
        return;
      }
      const name = nameField.value;
      const email = (document.getElementById("email") || {}).value || "";
      const phone = (document.getElementById("phone") || {}).value || "";
      const from = (document.getElementById("from") || {}).value || "";
      const to = (document.getElementById("to") || {}).value || "";
      const time = (document.getElementById("time") || {}).value || "";
      const date = (document.getElementById("date") || {}).value || "";

      const subject = encodeURIComponent("Taxi Booking Request");
      const body = encodeURIComponent(
        `Taxi Booking Request:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nFrom: ${from}\nTo: ${to}\nTime: ${time}\nDate: ${date}`
      );
      window.location.href = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  // --- Instagram button behavior (scroll to form if missing otherwise open profile & copy text) ---
  const instagramBtn = document.getElementById("instagramBtn");
  if (instagramBtn) {
    instagramBtn.addEventListener("click", function () {
      const nameField = document.getElementById("name");
      if (!nameField || !nameField.value) {
        goToForm();
        return;
      }
      const name = nameField.value;
      const email = (document.getElementById("email") || {}).value || "";
      const phone = (document.getElementById("phone") || {}).value || "";
      const from = (document.getElementById("from") || {}).value || "";
      const to = (document.getElementById("to") || {}).value || "";
      const time = (document.getElementById("time") || {}).value || "";
      const date = (document.getElementById("date") || {}).value || "";

      const message = `Taxi Booking Request:
Name: ${name}
Email: ${email}
Phone: ${phone}
From: ${from}
To: ${to}
Time: ${time}
Date: ${date}`;

      // copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).catch(() => {});
      }
      // open profile
      window.open(`https://www.instagram.com/${INSTAGRAM_HANDLE}/`, "_blank");
      // open DM composer (best-effort)
      setTimeout(() => {
        window.open("https://www.instagram.com/direct/new/", "_blank");
        // notify user to paste
        setTimeout(() => alert("Instagram opened. Your booking details were copied to the clipboard — paste them into a message."), 700);
      }, 600);
    });
  }
  // FIX: Define attachImageToggleHandlers so it exists
function attachImageToggleHandlers() {
  applyZoomHandlers();  // Reuse your existing zoom handler; no code changes
}


  // Re-attach handlers if needed later (public API)
  window._attachImageToggleHandlers = attachImageToggleHandlers;

})();
// VIDEO: Autoplay for 60 seconds then stop
const promoVideo = document.getElementById("promoVideo");

promoVideo.addEventListener("loadeddata", () => {
  promoVideo.play();
});

// Stop after 60 seconds
setTimeout(() => {
  promoVideo.pause();
}, 60000);  // 60,000 ms = 60 seconds
