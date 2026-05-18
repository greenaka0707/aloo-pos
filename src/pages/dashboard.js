export function DashboardPage() {
  return `
    <section class="dashboard-page">

      <!-- HEADER -->

      <div class="dashboard-top">

        <div>

          <h2 class="dashboard-title">
            Dashboard
          </h2>

          <p class="dashboard-subtitle">
            Manufacturing overview
          </p>

        </div>

        <div class="dashboard-actions">

          <button
            class="btn-icon"
            onclick="window.navigate('akun')"
          >
            <i data-lucide="user"></i>
          </button>

          <button class="btn-icon">
            <i data-lucide="bell"></i>
          </button>

        </div>

      </div>

      <!-- SUMMARY -->

      <div class="card balance-card">

        <div class="balance-head">

          <div>

            <p class="text-light text-md">
              Pending Order
            </p>

            <div class="balance-value">
              12
            </div>

            <p class="text-light balance-sub">
              Order menunggu produksi
            </p>

          </div>

          <div class="badge badge-primary">
            +3 Hari Ini
          </div>

        </div>

        <div class="balance-stats">

          <div class="mini-stat">
            <strong>5</strong>
            <span>Produksi</span>
          </div>

          <div class="mini-stat">
            <strong>3</strong>
            <span>Ready</span>
          </div>

          <div class="mini-stat">
            <strong>2</strong>
            <span>Kirim</span>
          </div>

        </div>

      </div>

      <!-- QUICK MENU -->

      <div class="card quick-actions">

        <button
          class="action-item"
          onclick="window.navigate('pembelian')"
        >

          <div class="icon-box">
            <i data-lucide="shopping-bag"></i>
          </div>

          <span>
            Pembelian
          </span>

        </button>

        <button
          class="action-item"
          onclick="window.navigate('order')"
        >

          <div class="icon-box">
            <i data-lucide="shopping-cart"></i>
          </div>

          <span>
            Penjualan
          </span>

        </button>

        <button
          class="action-item"
          onclick="window.navigate('produksi')"
        >

          <div class="icon-box">
            <i data-lucide="factory"></i>
          </div>

          <span>
            Produksi
          </span>

        </button>

        <button
          class="action-item"
          onclick="window.navigate('stok')"
        >

          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>

          <span>
            Stock
          </span>

        </button>

      </div>

      <!-- STOCK ALERT -->

      <div class="card dashboard-alert-card">

        <div class="dashboard-alert-head">

          <div class="icon-box">
            <i data-lucide="triangle-alert"></i>
          </div>

          <div>

            <h3 class="font-bold text-lg">
              Stock Menipis
            </h3>

            <p class="text-light text-sm">
              2 bahan baku perlu restock
            </p>

          </div>

        </div>

        <div class="dashboard-alert-list">

          <div class="dashboard-alert-item">

            <span>
              RB Robusta Grade A
            </span>

            <strong>
              12kg
            </strong>

          </div>

          <div class="dashboard-alert-item">

            <span>
              Jagung
            </span>

            <strong>
              8kg
            </strong>

          </div>

        </div>

      </div>

    </section>
  `;
}