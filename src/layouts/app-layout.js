import { BottomNav } from "../components/bottom-nav";

export function AppLayout(content) {
  return `
    <div class="app-layout">

      <main class="app-content">
        ${content}
      </main>

      ${BottomNav()}

    </div>
  `;
}