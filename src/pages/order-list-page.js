export function OrderListPage() {
  return `
    <section class="order-page">

      <div class="page-header">
        <div>
          <h2 class="font-bold">
            Sales Order
          </h2>
          <p class="page-subtitle">
            Manufacturing sales workflow
          </p>
        </div>
      </div>

      <div class="card search-box">
        <i data-lucide="search"></i>
        <input
          type="text"
          placeholder="Cari sales order..."
        />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Pending</button>
        <button class="filter-chip">Diproses</button>
        <button class="filter-chip">Ready</button>
        <button class="filter-chip">Dikirim</button>
      </div>

      <div class="order-list">

        <div class="card order-card">
          <div class="order-top">
            <div>
              <h3 class="font-bold">SO-001</h3>
              <p class="text-light text-sm">PT Kopi Nusantara</p>
            </div>
            <span class="badge badge-warning">Pending</span>
          </div>

          <div class="order-summary">
            <div class="order-summary-item">
              <span>Total Item</span>
              <strong>3 Produk</strong>
            </div>
            <div class="order-summary-item">
              <span>Qty</span>
              <strong>50kg</strong>
            </div>
          </div>

          <div class="order-footer">
            <span>15 Mei 2026</span>
            <button
              class="detail-btn" 
              onclick="window.navigate('order-detail')"
            >
              Detail
            </button>
          </div>
        </div>

        <div class="card order-card">
          <div class="order-top">
            <div>
              <h3 class="font-bold">SO-002</h3>
              <p class="text-light text-sm">CV Barokah Kopi</p>
            </div>
            <span class="badge badge-info">Diproses</span>
          </div>

          <div class="order-summary">
            <div class="order-summary-item">
              <span>Total Item</span>
              <strong>2 Produk</strong>
            </div>
            <div class="order-summary-item">
              <span>Qty</span>
              <strong>20kg</strong>
            </div>
          </div>

          <div class="order-footer">
            <span>15 Mei 2026</span>
            <button
              class="detail-btn"
              onclick="window.navigate('order-detail')"
            >
              Detail
            </button>
          </div>
        </div>

      </div>

      <button
        class="fab-btn"
        onclick="window.navigate('create-order')"
      >
        <i data-lucide="plus"></i>
      </button>

    </section>
  `;
}
