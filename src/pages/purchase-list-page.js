export function PurchaseListPage() {
  setTimeout(() => {
    const container = document.querySelector(".data-list");
    const fab = document.querySelector(".fab-btn");
    const appLayout = document.querySelector(".app-layout");

    // ==========================================================================
    // KUNCI FIXED STICKY FAB: Paksa pindahkan FAB ke komponen root .app-layout
    // ==========================================================================
    if (fab && appLayout) {
      fab.style.display = "flex"; // ✔️ Paksa tampilkan jika dari page sebelumnya tersembunyi
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
        <input
          type="text"
          placeholder="Cari pembelian..."
        />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Pending</button>
        <button class="filter-chip">Diterima</button>
        <button class="filter-chip">Partial</button>
        <button class="filter-chip">Void</button>
      </div>

      <div class="data-list">

        <div class="card list-card">
          <div class="list-card-top">
            <div>
              <h3 class="font-bold">PO-001</h3>
              <p class="text-light text-sm">PT Sumber Kopi Nusantara</p>
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
              <strong>100kg</strong>
            </div>
          </div>

          <div class="list-card-footer">
            <div>
              <strong style="color: var(--orange); font-size: var(--text-md); display: block; font-weight: var(--font-bold);">
                Rp 4.500.000
              </strong>
              <p class="text-light text-xs" style="margin-top: 1px;">
                18 Mei 2026
              </p>
            </div>

            <button
              class="btn btn-soft detail-btn"
              onclick="window.navigate('purchase-detail')"
            >
              Detail
            </button>
          </div>
        </div>

        <div class="card list-card">
          <div class="list-card-top">
            <div>
              <h3 class="font-bold">PO-002</h3>
              <p class="text-light text-sm">CV Bahan Baku Kopi</p>
            </div>
            <span class="badge badge-success">Diterima</span>
          </div>

          <div class="list-card-summary">
            <div class="list-card-summary-item">
              <span>Total Item</span>
              <strong>2 Produk</strong>
            </div>
            <div class="list-card-summary-item">
              <span>Qty</span>
              <strong>200kg</strong>
            </div>
          </div>

          <div class="list-card-footer">
            <div>
              <strong style="color: var(--orange); font-size: var(--text-md); display: block; font-weight: var(--font-bold);">
                Rp 2.000.000
              </strong>
              <p class="text-light text-xs" style="margin-top: 1px;">
                17 Mei 2026
              </p>
            </div>

            <button
              class="btn btn-soft detail-btn"
              onclick="window.navigate('purchase-detail')"
            >
              Detail
            </button>
          </div>
        </div>

      </div>

      <button
        class="fab-btn"
        onclick="window.navigate('create-purchase')"
      >
        <i data-lucide="plus"></i>
      </button>

    </section>
  `;
}
