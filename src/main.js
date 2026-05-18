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