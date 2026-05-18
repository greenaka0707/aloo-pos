export function PurchaseListPage() {
  return `
    <section class="purchase-page">

      <!-- HEADER -->

      <div class="page-header">

        <div>

          <h2 class="text-3xl font-bold">
            Pembelian
          </h2>

          <p class="text-light text-md">
            Supplier purchasing workflow
          </p>

        </div>

      </div>

      <!-- SEARCH -->

      <div class="card purchase-search">

        <i data-lucide="search"></i>

        <input
          type="text"
          placeholder="Cari pembelian..."
        />

      </div>

      <!-- FILTER -->

      <div class="purchase-filter">

        <button class="filter-chip active">
          Semua
        </button>

        <button class="filter-chip">
          Pending
        </button>

        <button class="filter-chip">
          Diterima
        </button>

        <button class="filter-chip">
          Partial
        </button>

        <button class="filter-chip">
          Void
        </button>

      </div>

      <!-- PURCHASE LIST -->

      <div class="purchase-list">

        <!-- ITEM -->

        <div class="card purchase-card">

          <div class="purchase-top">

            <div>

              <h3 class="font-bold text-xl">
                PO-001
              </h3>

              <p class="text-light text-sm">
                PT Sumber Kopi Nusantara
              </p>

            </div>

            <span class="badge badge-warning">
              Pending
            </span>

          </div>

          <div class="purchase-body">

            <div class="purchase-product">

              <div class="icon-box">
                <i data-lucide="package"></i>
              </div>

              <div>

                <strong class="font-bold text-lg">
                  RB Robusta Grade A
                </strong>

                <p class="text-light text-sm">
                  100kg
                </p>

              </div>

            </div>

          </div>

          <div class="purchase-footer">

            <div>

              <strong class="purchase-total">
                Rp 4.500.000
              </strong>

              <p class="text-light text-sm">
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

        <!-- ITEM -->

        <div class="card purchase-card">

          <div class="purchase-top">

            <div>

              <h3 class="font-bold text-xl">
                PO-002
              </h3>

              <p class="text-light text-sm">
                CV Bahan Baku Kopi
              </p>

            </div>

            <span class="badge badge-success">
              Diterima
            </span>

          </div>

          <div class="purchase-body">

            <div class="purchase-product">

              <div class="icon-box">
                <i data-lucide="package-check"></i>
              </div>

              <div>

                <strong class="font-bold text-lg">
                  Jagung
                </strong>

                <p class="text-light text-sm">
                  200kg
                </p>

              </div>

            </div>

          </div>

          <div class="purchase-footer">

            <div>

              <strong class="purchase-total">
                Rp 2.000.000
              </strong>

              <p class="text-light text-sm">
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

      <!-- FLOAT BUTTON -->

      <button
        class="fab-btn"
        onclick="window.navigate('create-purchase')"
      >

        <i data-lucide="plus"></i>

      </button>

    </section>
  `;
}