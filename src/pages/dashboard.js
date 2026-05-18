export function DashboardPage() {
  return `
    <section class="dashboard-page">

      <div class="dashboard-top">
        <div>
          <h2 class="dashboard-title">Dashboard</h2>
          <p class="dashboard-subtitle">Manufacturing overview</p>
        </div>

        <div class="dashboard-actions">
          <button class="btn-icon" onclick="window.navigate('akun')">
            <i data-lucide="user"></i>
          </button>
          <button class="btn-icon">
            <i data-lucide="bell"></i>
          </button>
        </div>
      </div>

      <div class="dashboard-hero-card">
        <div class="dashboard-hero-top">
          <div class="hero-icon">
            <i data-lucide="trending-up"></i>
          </div>
          <div>
            <p class="hero-label">Omzet Hari Ini</p>
            <h2 class="hero-value">Rp 12.500.000</h2>
          </div>
        </div>

        <div class="dashboard-hero-stats">
          <div class="hero-stat">
            <strong>18</strong>
            <span>Order</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <strong>5</strong>
            <span>Produksi</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat">
            <strong>2</strong>
            <span>Pending</span>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-title-row">
          <h3>Aksi Cepat</h3>
        </div>
        
        <div class="quick-actions-layout">
          <button class="quick-menu-item" onclick="window.navigate('pembelian')">
            <div class="quick-menu-icon"><i data-lucide="shopping-bag"></i></div>
            <span>Pembelian</span>
          </button>

          <button class="quick-menu-item" onclick="window.navigate('order')">
            <div class="quick-menu-icon"><i data-lucide="shopping-cart"></i></div>
            <span>Penjualan</span>
          </button>

          <button class="quick-menu-item" onclick="window.navigate('produksi')">
            <div class="quick-menu-icon"><i data-lucide="factory"></i></div>
            <span>Produksi</span>
          </button>

          <button class="quick-menu-item" onclick="window.navigate('stok')">
            <div class="quick-menu-icon"><i data-lucide="package"></i></div>
            <span>Stock</span>
          </button>

          <button class="quick-menu-item" onclick="window.navigate('produk')">
            <div class="quick-menu-icon"><i data-lucide="boxes"></i></div>
            <span>Produk</span>
          </button>

          <button class="quick-menu-item" onclick="window.navigate('laporan')">
            <div class="quick-menu-icon"><i data-lucide="bar-chart-3"></i></div>
            <span>Laporan</span>
          </button>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-title-row">
          <h3>Prioritas Hari Ini</h3>
        </div>

        <div class="card dashboard-priority-card">
          <div class="priority-head">
            <div class="priority-icon-box">
              <i data-lucide="triangle-alert"></i>
            </div>
            <div>
              <strong>Stock Menipis</strong>
              <p>2 bahan baku perlu restock segera</p>
            </div>
          </div>

          <div class="priority-stock-list">
            <div class="priority-stock-item">
              <span>RB Robusta Grade A</span>
              <strong>12kg</strong>
            </div>
            <div class="priority-stock-item">
              <span>Jagung</span>
              <strong>8kg</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-title-row">
          <h3>Ringkasan Operasional</h3>
        </div>

        <div class="dashboard-summary-row">
          <div class="summary-inline-item">
            <strong>12</strong>
            <span>Pending Order</span>
          </div>
          <div class="summary-inline-item">
            <strong>5</strong>
            <span>Produksi</span>
          </div>
          <div class="summary-inline-item">
            <strong>3</strong>
            <span>Ready Kirim</span>
          </div>
        </div>
      </div>

    </section>
  `;
}
