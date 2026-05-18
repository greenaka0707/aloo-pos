import { AppLayout } from "./layouts/app-layout.js";
import { renderRoute } from "./router/index.js";

function renderPage(route = "dashboard") {

  document.querySelector("#app").innerHTML =
    AppLayout({
      content: renderRoute(route),
      route
    });

  const content =
    document.querySelector(".app-content");

  if (content) {

    content.classList.add("page-enter");

    requestAnimationFrame(() => {
      content.classList.remove("page-enter");
    });
  }

  lucide.createIcons();
}

/* =====================
   GLOBAL NAVIGATE
===================== */

window.navigate = function(route) {

  if (
    window.location.hash === `#${route}`
  ) {
    return;
  }

  const content =
    document.querySelector(".app-content");

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

window.addEventListener(
  "hashchange",
  () => {

    const route =
      window.location.hash.replace("#", "") ||
      "dashboard";

    renderPage(route);
  }
);

/* =====================
   INITIAL
===================== */

const initialRoute =
  window.location.hash.replace("#", "") ||
  "dashboard";

renderPage(initialRoute);


/* ==========================================================================
   PULL TO REFRESH SYSTEM (Universal Mobile Gesture Update)
   ========================================================================== */

let touchStart = 0;
let touchPullDist = 0;
const REFRESH_THRESHOLD = 80; // Jarak tarik jempol (pixel) untuk memicu refresh

document.addEventListener('touchstart', (e) => {
  const content = document.querySelector('.app-content');
  if (!content) return;

  // Hanya mencatat koordinat jika posisi scroll halaman berada di paling atas (scrollTop === 0)
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

  // Jika user menarik ke bawah (bukan scroll ke atas)
  if (touchPullDist > 0) {
    // Memberikan efek karet (rubber-band bounce) agar tarikan melambat secara natural
    const resistance = Math.min(touchPullDist * 0.4, REFRESH_THRESHOLD + 15);
    
    const content = document.querySelector('.app-content');
    if (content) {
      content.style.transform = `translateY(${resistance}px)`;
      content.style.transition = 'none'; // Matikan animasi transisi selama ditarik manual
    }
  }
}, { passive: true });

document.addEventListener('touchend', () => {
  if (touchStart === 0) return;

  const content = document.querySelector('.app-content');
  if (!content) return;

  // Kembalikan posisi layout ke normal dengan animasi membal halus
  content.style.transition = 'transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1)';
  content.style.transform = 'translateY(0)';

  // Jika jarak tarikan jempol melewati batas ambang batas (threshold)
  if (touchPullDist >= REFRESH_THRESHOLD) {
    // Trigger getaran singkat (haptic feedback) di HP biar kerasa native banget
    if (navigator.vibrate) navigator.vibrate(15);

    // Dapatkan rute aktif saat ini dari URL hash
    const currentRoute = window.location.hash.replace("#", "") || "dashboard";
    
    console.log(`🔄 Pull to Refresh dipicu pada route: ${currentRoute}`);
    
    // Panggil ulang fungsi renderPage milik Anda secara instan untuk merefresh data
    renderPage(currentRoute);
  }

  // Reset variabel pelacak
  touchStart = 0;
  touchPullDist = 0;
});
