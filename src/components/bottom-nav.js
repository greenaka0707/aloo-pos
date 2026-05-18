export function BottomNav(active = "dashboard") {
  return `
    <nav class="bottom-nav">

      <!-- DASHBOARD -->

      <button
        class="nav-item ${
          active === "dashboard"
            ? "active"
            : ""
        }"
        onclick="window.navigate('dashboard')"
      >

        <i data-lucide="layout-grid"></i>

        <span>
          Dashboard
        </span>

      </button>

      <!-- ORDER -->

      <button
        class="nav-item ${
          active === "order"
            ? "active"
            : ""
        }"
        onclick="window.navigate('order')"
      >

        <i data-lucide="shopping-cart"></i>

        <span>
          Order
        </span>

      </button>

      <!-- PRODUKSI -->

      <button
        class="nav-item ${
          active === "produksi"
            ? "active"
            : ""
        }"
        onclick="window.navigate('produksi')"
      >

        <i data-lucide="factory"></i>

        <span>
          Produksi
        </span>

      </button>

      <!-- STOK -->

      <button
        class="nav-item ${
          active === "stok"
            ? "active"
            : ""
        }"
        onclick="window.navigate('stok')"
      >

        <i data-lucide="package"></i>

        <span>
          Stok
        </span>

      </button>

    </nav>
  `;
}