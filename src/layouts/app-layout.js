import { BottomNav } from "../components/bottom-nav.js";

export function AppLayout({
  content,
  route
}) {

  return `
    <div class="app-layout">

      <main class="app-content">
        ${content}
      </main>

      ${BottomNav(route)}

    </div>
  `;
}