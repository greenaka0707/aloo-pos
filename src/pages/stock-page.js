export function StockPage() {
  return `
    <section class="stock-page">

      <!-- HEADER -->

      <div class="page-header">

        <div>

          <h2 class="text-3xl font-bold">
            Stock
          </h2>

          <p class="text-light text-md">
            Inventory management
          </p>

        </div>

      </div>

      <!-- SEARCH -->

      <div class="card stock-search">

        <i data-lucide="search"></i>

        <input
          type="text"
          placeholder="Cari stock..."
        />

      </div>

      <!-- FILTER -->

      <div class="stock-filter">

        <button class="filter-chip active">
          Semua
        </button>

        <button class="filter-chip">
          Barang Jadi
        </button>

        <button class="filter-chip">
          Bahan Baku
        </button>

        <button class="filter-chip">
          Menipis
        </button>

      </div>

      <!-- STOCK LIST -->

      <div class="stock-list">

        <!-- ITEM -->

        <div class="card stock-card">

          <div class="stock-top">

            <div>

              <span class="badge badge-primary">
                Barang Jadi
              </span>

            </div>

            <span class="badge badge-success">
              Aman
            </span>

          </div>

          <div class="stock-product">

            <div class="icon-box">
              <i data-lucide="coffee"></i>
            </div>

            <div class="stock-product-info">

              <strong class="stock-product-name">
                Kopi Giras 1:1
              </strong>

              <p class="stock-product-desc">
                Ready stock untuk penjualan
              </p>

              <div class="stock-meta">

                <div class="stock-meta-item">
                  Stock: 120kg
                </div>

                <div class="stock-meta-item">
                  Minimum: 50kg
                </div>

              </div>

            </div>

          </div>

          <div class="stock-footer">

            <span class="text-light text-sm">
              Updated 15 Mei 2026
            </span>

            <button class="btn btn-soft detail-btn">
              Detail
            </button>

          </div>

        </div>

        <!-- ITEM -->

        <div class="card stock-card stock-warning">

          <div class="stock-top">

            <div>

              <span class="badge badge-info">
                Bahan Baku
              </span>

            </div>

            <span class="badge badge-danger">
              Menipis
            </span>

          </div>

          <div class="stock-product">

            <div class="icon-box">
              <i data-lucide="package"></i>
            </div>

            <div class="stock-product-info">

              <strong class="stock-product-name">
                RB Robusta Grade A
              </strong>

              <p class="stock-product-desc">
                Bahan baku roasting
              </p>

              <div class="stock-meta">

                <div class="stock-meta-item">
                  Stock: 12kg
                </div>

                <div class="stock-meta-item">
                  Minimum: 30kg
                </div>

              </div>

            </div>

          </div>

          <div class="stock-footer">

            <span class="text-light text-sm">
              Restock dibutuhkan
            </span>

            <button class="btn btn-soft detail-btn">
              Detail
            </button>

          </div>

        </div>

      </div>

    </section>
  `;
}