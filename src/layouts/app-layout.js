export function AppLayout(content) {
  return `
    <div class="app-layout">

      <main class="app-content">
        ${content}
      </main>

      <div id="bottom-nav"></div>

    </div>
  `;
}