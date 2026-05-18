import { AppLayout } from "./layouts/app-layout.js";

import { renderRoute } from "./router/index.js";

function renderPage(route = "dashboard") {

  document.querySelector("#app").innerHTML =
    AppLayout({
      content: renderRoute(route),
      route
    });

  lucide.createIcons();
}

/* =====================
   GLOBAL NAVIGATE
===================== */

window.navigate = function(route) {

  window.location.hash = route;

  renderPage(route);
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