export function StockDetailPage() {
  return `
    <section class="detail-page">

      <div class="detail-header">
        <button
          class="btn-back"
          onclick="window.navigate('stok')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div class="detail-header-text">
          <h2>RB Robusta Grade A</h2>
          <p>Stock Detail</p>
        </div>
      </div>

      <div class="card detail-status-card">
        <div>
          <span class="detail-status-title">Stock Saat Ini</span>
          <h3 class="font-bold">80kg</h3>
        </div>
        <span class="badge badge-success">
          Aman
        </span>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>
          <h3>Informasi Produk</h3>
        </div>

        <div class="detail-info">
          <div class="info-item">
            <span>Kategori</span>
            <strong>Bahan Baku</strong>
          </div>

          <div class="info-item">
            <span>Supplier</span>
            <strong>CV Nusantara Kopi</strong>
          </div>

          <div class="info-item">
            <span>Minimum Stock</span>
            <strong>30kg</strong>
          </div>

          <div class="info-item">
            <span>Gudang</span>
            <strong>Warehouse A</strong>
          </div>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="arrow-left-right"></i>
          </div>
          <h3>Pergerakan Stock</h3>
        </div>

        <div class="detail-info">
          <div class="detail-row-item">
            <div class="left-content">
              <strong class="title">Pembelian</strong>
              <span class="subtitle">PO-001 • 15 Mei 2026</span>
            </div>
            <strong class="right-value" style="color: var(--green);">+100kg</strong>
          </div>

          <div class="detail-row-item">
            <div class="left-content">
              <strong class="title">Produksi</strong>
              <span class="subtitle">PRD-001 • 15 Mei 2026</span>
            </div>
            <strong class="right-value" style="color: var(--danger);">-25kg</strong>
          </div>

          <div class="detail-row-item">
            <div class="left-content">
              <strong class="title">Adjustment</strong>
              <span class="subtitle">ADM-001 • 14 Mei 2026</span>
            </div>
            <strong class="right-value" style="color: var(--danger);">-5kg</strong>
          </div>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="factory"></i>
          </div>
          <h3>Produksi Terkait</h3>
        </div>

        <div class="detail-info">
          <div class="detail-row-item">
            <div class="left-content">
              <strong class="title">PRD-001</strong>
              <span class="subtitle">Kopi Giras 1:1</span>
            </div>
            <span class="badge badge-info">Diproses</span>
          </div>

          <div class="detail-row-item">
            <div class="left-content">
              <strong class="title">PRD-002</strong>
              <span class="subtitle">Arabica Blend</span>
            </div>
            <span class="badge badge-warning">Pending</span>
          </div>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="chart-column"></i>
          </div>
          <h3>Analytics</h3>
        </div>

        <div class="dashboard-summary-grid" style="grid-template-columns: repeat(2, 1fr); gap: var(--space-md);">
          
          <div class="summary-card" style="border: 1px solid var(--border); border-radius: var(--radius-md);">
            <strong>120kg</strong>
            <span>Stock Masuk</span>
          </div>

          <div class="summary-card" style="border: 1px solid var(--border); border-radius: var(--radius-md);">
            <strong>40kg</strong>
            <span>Stock Keluar</span>
          </div>

          <div class="summary-card" style="border: 1px solid var(--border); border-radius: var(--radius-md);">
            <strong>10kg</strong>
            <span>Avg Usage</span>
          </div>

          <div class="summary-card" style="border: 1px solid var(--border); border-radius: var(--radius-md);">
            <strong style="color: var(--orange);">8 Hari</strong>
            <span>Sisa Hari</span>
          </div>

        </div>
      </div>

      <div class="detail-actions">
        <button class="action-btn">
          Adjustment
        </button>
        <button class="action-btn">
          Transfer
        </button>
        <button class="action-btn primary-action">
          Tambah Stock
        </button>
      </div>

    </section>
  `;
}
