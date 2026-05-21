// ==========================================================================
// FILE: main.js (FULL FIXED ROUTER INTEGRATION)
// ==========================================================================

import { AppLayout } from "./layouts/app-layout.js";
import { renderRoute } from "./router/index.js";

function renderPage(route = "dashboard") {
  // 1. Render layout dasar aplikasi terlebih dahulu gais!
  // Berikan string kosong "" sebagai placeholder awal konten agar layout tidak rusak
  document.querySelector("#app").innerHTML = AppLayout({
    content: "", 
    route
  });

  // 2. Cari target container tempat konten halaman seharusnya berada
  // Biasanya di dalam AppLayout kamu ada elemen dengan class ".app-content" atau semacamnya
  const contentContainer = document.querySelector(".app-content") || document.querySelector("#app");

  // 3. Eksekusi router asli dengan menyuntikkan container yang sudah siap di layar!
  const pageResult = renderRoute(route, contentContainer);

  // 4. Jaring Pengaman: Jika halaman tersebut mengembalikan string HTML (bukan manipulasi DOM langsung)
  if (pageResult && typeof pageResult === "string" && pageResult !== "undefined") {
    contentContainer.innerHTML = pageResult;
  }

  // ==========================================================================
  // EFEK TRANSISI HALAMAN MOBILE
  // ==========================================================================
  const content = document.querySelector(".app-content");
  if (content) {
    content.classList.add("page-enter");
    requestAnimationFrame(() => {
      content.classList.remove("page-enter");
    });
  }

  // Render ulang icon Lucide gais
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

/* =====================
   GLOBAL NAVIGATE
===================== */
window.navigate = function(route) {
  if (window.location.hash === `#${route}`) {
    return;
  }

  const content = document.querySelector(".app-content");
  if (!content) {
    window.location.hash = route;
    return;
  }

  content.classList.add("page-leave");
  setTimeout(() => {
    window.location.hash = route;
  }, 140);
};

/* =====================
   HASH ROUTER
===================== */
window.addEventListener("hashchange", () => {
  const route = window.location.hash.replace("#", "") || "dashboard";
  renderPage(route);
});

/* =====================
   INITIAL
===================== */
const initialRoute = window.location.hash.replace("#", "") || "dashboard";
renderPage(initialRoute);

/* ==========================================================================
   PULL TO REFRESH SYSTEM (Universal Mobile Gesture Update)
   ========================================================================== */
let touchStart = 0;
let touchPullDist = 0;
const REFRESH_THRESHOLD = 80;

document.addEventListener('touchstart', (e) => {
  const content = document.querySelector('.app-content');
  if (!content) return;

  if (content.scrollTop === 0) {
    touchStart = e.touches[0].clientY;
  } else {
    touchStart = 0;
  }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  if (touchStart === 0) return;

  const currentTouch = e.touches[0].clientY;
  touchPullDist = currentTouch - touchStart;

  if (touchPullDist > 0) {
    const resistance = Math.min(touchPullDist * 0.4, REFRESH_THRESHOLD + 15);
    const content = document.querySelector('.app-content');
    if (content) {
      content.style.transform = `translateY(${resistance}px)`;
      content.style.transition = 'none';
    }
  }
}, { passive: true });

document.addEventListener('touchend', () => {
  if (touchStart === 0) return;

  const content = document.querySelector('.app-content');
  if (!content) return;

  content.style.transition = 'transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1)';
  content.style.transform = 'translateY(0)';

  if (touchPullDist >= REFRESH_THRESHOLD) {
    if (navigator.vibrate) navigator.vibrate(15);
    const currentRoute = window.location.hash.replace("#", "") || "dashboard";
    console.log(`🔄 Pull to Refresh dipicu pada route: ${currentRoute}`);
    renderPage(currentRoute);
  }

  touchStart = 0;
  touchPullDist = 0;
});
