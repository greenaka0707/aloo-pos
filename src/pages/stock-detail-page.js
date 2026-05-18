export function StockDetailPage() {
  return `
    <section class="stock-detail-page">

      <!-- HEADER -->

      <div class="stock-detail-header">

        <button
          class="btn-icon"
          onclick="window.navigate('stok')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div class="stock-detail-header-text">

          <h2 class="text-3xl font-bold">
            RB Robusta Grade A
          </h2>

          <p class="text-light text-md">
            Stock Detail
          </p>

        </div>

      </div>

      <!-- STATUS -->

      <div class="card stock-status-card">

        <div>

          <span class="text-light text-sm">
            Stock Saat Ini
          </span>

          <h3 class="text-2xl font-bold stock-status-title">
            80kg
          </h3>

        </div>

        <span class="badge badge-success">
          Aman
        </span>

      </div>

      <!-- PRODUCT INFO -->

      <div class="card stock-detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>

          <h3 class="text-xl font-bold">
            Informasi Produk
          </h3>

        </div>

        <div class="stock-info-list">

          <div class="stock-info-item">

            <span class="text-light text-sm">
              Kategori
            </span>

            <strong class="text-lg font-bold">
              Bahan Baku
            </strong>

          </div>

          <div class="stock-info-item">

            <span class="text-light text-sm">
              Supplier
            </span>

            <strong class="text-lg font-bold">
              CV Nusantara Kopi
            </strong>

          </div>

          <div class="stock-info-item">

            <span class="text-light text-sm">
              Minimum Stock
            </span>

            <strong class="text-lg font-bold">
              30kg
            </strong>

          </div>

          <div class="stock-info-item">

            <span class="text-light text-sm">
              Gudang
            </span>

            <strong class="text-lg font-bold">
              Warehouse A
            </strong>

          </div>

        </div>

      </div>

      <!-- STOCK MOVEMENT -->

      <div class="card stock-detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="arrow-left-right"></i>
          </div>

          <h3 class="text-xl font-bold">
            Pergerakan Stock
          </h3>

        </div>

        <div class="movement-list">

          <!-- ITEM -->

          <div class="movement-item">

            <div>

              <strong class="text-base font-bold">
                Pembelian
              </strong>

              <p class="text-light text-sm">
                PO-001 • 15 Mei 2026
              </p>

            </div>

            <strong class="movement-plus">
              +100kg
            </strong>

          </div>

          <!-- ITEM -->

          <div class="movement-item">

            <div>

              <strong class="text-base font-bold">
                Produksi
              </strong>

              <p class="text-light text-sm">
                PRD-001 • 15 Mei 2026
              </p>

            </div>

            <strong class="movement-minus">
              -25kg
            </strong>

          </div>

          <!-- ITEM -->

          <div class="movement-item">

            <div>

              <strong class="text-base font-bold">
                Adjustment
              </strong>

              <p class="text-light text-sm">
                ADM-001 • 14 Mei 2026
              </p>

            </div>

            <strong class="movement-minus">
              -5kg
            </strong>

          </div>

        </div>

      </div>

      <!-- RELATED PRODUCTION -->

      <div class="card stock-detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="factory"></i>
          </div>

          <h3 class="text-xl font-bold">
            Produksi Terkait
          </h3>

        </div>

        <div class="related-production-list">

          <!-- ITEM -->

          <div class="related-production-item">

            <div>

              <strong class="text-base font-bold">
                PRD-001
              </strong>

              <p class="text-light text-sm">
                Kopi Giras 1:1
              </p>

            </div>

            <span class="badge badge-info">
              Diproses
            </span>

          </div>

          <!-- ITEM -->

          <div class="related-production-item">

            <div>

              <strong class="text-base font-bold">
                PRD-002
              </strong>

              <p class="text-light text-sm">
                Arabica Blend
              </p>

            </div>

            <span class="badge badge-warning">
              Pending
            </span>

          </div>

        </div>

      </div>

      <!-- ANALYTICS -->

      <div class="card stock-detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="chart-column"></i>
          </div>

          <h3 class="text-xl font-bold">
            Analytics
          </h3>

        </div>

        <div class="analytics-grid">

          <div class="analytics-card">

            <span class="text-light text-sm">
              Stock Masuk
            </span>

            <strong class="text-xl font-bold">
              120kg
            </strong>

          </div>

          <div class="analytics-card">

            <span class="text-light text-sm">
              Stock Keluar
            </span>

            <strong class="text-xl font-bold">
              40kg
            </strong>

          </div>

          <div class="analytics-card">

            <span class="text-light text-sm">
              Avg Usage
            </span>

            <strong class="text-xl font-bold">
              10kg
            </strong>

          </div>

          <div class="analytics-card">

            <span class="text-light text-sm">
              Sisa Hari
            </span>

            <strong class="text-xl font-bold">
              8 Hari
            </strong>

          </div>

        </div>

      </div>

      <!-- ACTION -->

      <div class="stock-detail-actions">

        <button class="btn btn-secondary action-btn">
          Adjustment
        </button>

        <button class="btn btn-secondary action-btn">
          Transfer
        </button>

        <button class="btn btn-primary action-btn primary-action">
          Tambah Stock
        </button>

      </div>

    </section>
  `;
}