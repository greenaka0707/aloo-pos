export function BottomNav() {
  return `
    <nav class="bottom-nav">

      <button class="nav-item active">

        <i data-lucide="layout-grid"></i>

        <span>
          Dashboard
        </span>

      </button>

      <button class="nav-item">

        <i data-lucide="shopping-cart"></i>

        <span>
          Order
        </span>

      </button>

      <button class="nav-item">

        <i data-lucide="factory"></i>

        <span>
          Produksi
        </span>

      </button>

      <button class="nav-item">

        <i data-lucide="package"></i>

        <span>
          Stok
        </span>

      </button>

      <button class="nav-item">

        <i data-lucide="user"></i>

        <span>
          Akun
        </span>

      </button>

    </nav>
  `;
}