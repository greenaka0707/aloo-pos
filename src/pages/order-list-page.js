export function OrderListPage() {
  setTimeout(() => {
    const container = document.querySelector(".data-list");
    const fab = document.querySelector(".fab-btn");
    const appLayout = document.querySelector(".app-layout");

    // ==========================================================================
    // KUNCI FIXED STICKY FAB: Paksa pindahkan FAB ke komponen root .app-layout
    // ==========================================================================
    if (fab && appLayout) {
      fab.style.display = "flex"; // Pastikan tampil jika sempat tersembunyi di halaman detail
      if (fab.parentElement !== appLayout) {
        appLayout.appendChild(fab);
      }
    }

    if (!container) return;

    // Render ulang icon Lucide setelah komponen masuk ke DOM
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, 50);

  return `
    <section class="list-page">

      <div class="card search-box">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Cari sales order..." />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Pending</button>
        <button class="filter-chip">Diproses</button>
        <button class="filter-chip">Ready</button>
        <button class="filter-chip">Dikirim</button>
      </div>

      <div class="data-list">

        <div class="card list-card">
          <div class="list-card-top">
            <div>
              <h3 class="font-bold">SO-001</h3>
              <p class="text-light text-sm">PT Kopi Nusantara</p>
            </div>
            <span class="badge badge-warning">Pending</span>
          </div>

          <div class="list-card-summary">
            <div class="list-card-summary-item">
              <span>Total Item</span>
              <strong>3 Produk</strong>
            </div>
            <div class="list-card-summary-item">
              <span>Qty</span>
              <strong>50kg</strong>
            </div>
          </div>

          <div class="list-card-footer">
            <span>15 Mei 2026</span>
            <button
              class="btn btn-soft detail-btn" 
              onclick="window.navigate('order-detail')"
            >
              Detail
            </button>
          </div>
        </div>

        <div class="card list-card">
          <div class="list-card-top">
            <div>
              <h3 class="font-bold">SO-002</h3>
              <h3 class="font-bold">SO-002</h3>
              <p class="text-light text-sm">CV Barokah Kopi</p>
            </div>
            <span class="badge badge-info">Diproses</span>
          </div>

          <div class="list-card-summary">
            <div class="list-card-summary-item">
              <span>Total Item</span>
              <strong>2 Produk</strong>
            </div>
            <div class="list-card-summary-item">
              <span>Qty</span>
              <strong>20kg</strong>
            </div>
          </div>

          <div class="list-card-footer">
            <span>15 Mei 2026</span>
            <button
              class="btn btn-soft detail-btn"
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
