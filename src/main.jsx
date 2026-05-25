// ==========================================================================
// FILE: src/main.jsx (CORE REACT INITIALIZER & MOBILE GESTURE INTEGRATED)
// ==========================================================================

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router/index.jsx";
import "./index.css"; // Memastikan Tailwind CSS kamu tetap termuat gais

function AppInitializer() {
  // ==========================================================================
  // 🔄 SYSTEM PULL TO REFRESH (Universal Mobile Gesture Hook)
  // ==========================================================================
  useEffect(() => {
    let touchStart = 0;
    let touchPullDist = 0;
    const REFRESH_THRESHOLD = 80;

    const handleTouchStart = (e) => {
      const content = document.querySelector(".app-content") || document.querySelector("main");
      if (!content) return;

      // Picu gestur hanya jika posisi scroll pembungkus sedang berada di paling atas gais
      if (content.scrollTop === 0) {
        touchStart = e.touches[0].clientY;
      } else {
        touchStart = 0;
      }
    };

    const handleTouchMove = (e) => {
      if (touchStart === 0) return;

      const currentTouch = e.touches[0].clientY;
      touchPullDist = currentTouch - touchStart;

      if (touchPullDist > 0) {
        const resistance = Math.min(touchPullDist * 0.4, REFRESH_THRESHOLD + 15);
        const content = document.querySelector(".app-content") || document.querySelector("main");
        if (content) {
          content.style.transform = `translateY(${resistance}px)`;
          content.style.transition = "none";
        }
      }
    };

    const handleTouchEnd = () => {
      if (touchStart === 0) return;

      const content = document.querySelector(".app-content") || document.querySelector("main");
      if (!content) return;

      content.style.transition = "transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1)";
      content.style.transform = "translateY(0)";

      if (touchPullDist >= REFRESH_THRESHOLD) {
        if (navigator.vibrate) navigator.vibrate(15); // Efek getar halus di HP gais
        console.log("🔄 Pull to Refresh dipicu: Mengisi ulang state aplikasi...");
        window.location.reload(); // Reload halaman aman untuk membersihkan cache database
      }

      touchStart = 0;
      touchPullDist = 0;
    };

    // Daftarkan event listener gestur seluler ke dokumen
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    // Bersihkan event listener jika aplikasi dimuat ulang gais
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return <AppRouter />;
}

// ==========================================================================
// MOUNTING INTO HTML ROOT CONTAINER
// ==========================================================================
const rootElement = document.getElementById("app") || document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppInitializer />
    </React.StrictMode>
  );
}

// ==========================================================================
// 💥 TRIGGER JET ENGINE AUTO-DEPLOY RE-BUILD CLOUDFLARE PAGES VIA MOBILE
// =========================================================================