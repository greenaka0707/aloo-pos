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

      <!-- QUICK MENU -->

      <div class="dashboard-section">

        <div class="section-title-row">

          <h3>
            Aksi Cepat
          </h3>

        </div>

        <div class="card quick-actions-grid">

          <!-- PEMBELIAN -->

          <button
            class="quick-menu-item"
            onclick="window.navigate('pembelian')"
          >

            <div class="quick-menu-icon">

              <i data-lucide="shopping-bag"></i>

            </div>

            <span>
              Pembelian
            </span>

          </button>

          <!-- PENJUALAN -->

          <button
            class="quick-menu-item"
            onclick="window.navigate('order')"
          >

            <div class="quick-menu-icon">

              <i data-lucide="shopping-cart"></i>

            </div>

            <span>
              Penjualan
            </span>

          </button>

          <!-- PRODUKSI -->

          <button
            class="quick-menu-item"
            onclick="window.navigate('produksi')"
          >

            <div class="quick-menu-icon">

              <i data-lucide="factory"></i>

            </div>

            <span>
              Produksi
            </span>

          </button>

          <!-- STOCK -->

          <button
            class="quick-menu-item"
            onclick="window.navigate('stok')"
          >

            <div class="quick-menu-icon">

              <i data-lucide="package"></i>

            </div>

            <span>
              Stock
            </span>

          </button>

          <!-- PRODUK -->

          <button
            class="quick-menu-item"
            onclick="window.navigate('produk')"
          >

            <div class="quick-menu-icon">

              <i data-lucide="boxes"></i>

            </div>

            <span>
              Produk
            </span>

          </button>

          <!-- LAPORAN -->

          <button
            class="quick-menu-item"
            onclick="window.navigate('laporan')"
          >

            <div class="quick-menu-icon">

              <i data-lucide="bar-chart-3"></i>

            </div>

            <span>
              Laporan
            </span>

          </button>

        </div>

      </div>

      <!-- PRIORITAS -->

      <div class="dashboard-section">

        <div class="section-title-row">

          <h3>
            Prioritas Hari Ini
          </h3>

        </div>

        <div class="card dashboard-priority-card">

          <div class="priority-item">

            <div class="priority-left">

              <div class="priority-icon warning">

                <i data-lucide="triangle-alert"></i>

              </div>

              <div>

                <strong>
                  Stock Menipis
                </strong>

                <p>
                  2 bahan baku perlu restock
                </p>

              </div>

            </div>

          </div>

          <div class="priority-divider"></div>

          <div class="priority-stock-list">

            <div class="priority-stock-item">

              <span>
                RB Robusta Grade A
              </span>

              <strong>
                12kg
              </strong>

            </div>

            <div class="priority-stock-item">

              <span>
                Jagung
              </span>

              <strong>
                8kg
              </strong>

            </div>

          </div>

        </div>

      </div>

      <!-- RINGKASAN -->

      <div class="dashboard-section">

        <div class="section-title-row">

          <h3>
            Ringkasan Operasional
          </h3>

        </div>

        <div class="dashboard-summary-grid">

          <!-- ORDER -->

          <div class="card summary-card">

            <strong>
              12
            </strong>

            <span>
              Pending Order
            </span>

          </div>

          <!-- PRODUKSI -->

          <div class="card summary-card">

            <strong>
              5
            </strong>

            <span>
              Produksi
            </span>

          </div>

          <!-- READY -->

          <div class="card summary-card">

            <strong>
              3
            </strong>

            <span>
              Ready Kirim
            </span>

          </div>

        </div>

      </div>

    </section>
  `;
}