import { AppLayout } from "./layouts/app-layout";

import { BottomNav } from "./components/bottom-nav";

import { renderRoute } from "./router";

function renderPage(route = "dashboard") {

  document.querySelector("#app").innerHTML =
    AppLayout(
      renderRoute(route)
    );

  document.querySelector("#bottom-nav").innerHTML =
    BottomNav(route);

  lucide.createIcons();
}

/* =====================
   GLOBAL NAVIGATE
===================== */

window.navigate = function(route) {
  renderPage(route);
};

/* =====================
   INITIAL
===================== */

renderPage();