export function OrderListPage() {
  return `
    <section class="order-page">

      <!-- HEADER -->

      <div class="page-header">

        <div>

          <h2 class="text-3xl font-bold">
            Sales Order
          </h2>

          <p class="text-light text-md page-subtitle">
            Manufacturing sales workflow
          </p>

        </div>

      </div>

      <!-- SEARCH -->

      <div class="card search-box">

        <i data-lucide="search"></i>

        <input
          type="text"
          placeholder="Cari sales order..."
        />

      </div>

      <!-- FILTER -->

      <div class="filter-scroll">

        <button class="filter-chip active">
          Semua
        </button>

        <button class="filter-chip">
          Pending
        </button>

        <button class="filter-chip">
          Diproses
        </button>

        <button class="filter-chip">
          Ready
        </button>

        <button class="filter-chip">
          Dikirim
        </button>

      </div>

      <!-- ORDER LIST -->

      <div class="order-list">

        <!-- ITEM -->

        <div class="card order-card">

          <div class="order-top">

            <div>

              <h3 class="font-bold text-xl">
                SO-001
              </h3>

              <p class="text-light text-sm">
                PT Kopi Nusantara
              </p>

            </div>

            <span class="badge badge-warning">
              Pending
            </span>

          </div>

          <!-- SUMMARY -->

          <div class="order-summary">

            <div class="order-summary-item">

              <span class="text-light text-sm">
                Total Item
              </span>

              <strong>
                3 Produk
              </strong>

            </div>

            <div class="order-summary-item">

              <span class="text-light text-sm">
                Qty
              </span>

              <strong>
                50kg
              </strong>

            </div>

          </div>

          <!-- FOOTER -->

          <div class="order-footer">

            <span class="text-light text-sm">
              15 Mei 2026
            </span>

            <button
              class="btn btn-soft detail-btn"
              onclick="window.navigate('order-detail')"
            >
              Detail
            </button>

          </div>

        </div>

        <!-- ITEM -->

        <div class="card order-card">

          <div class="order-top">

            <div>

              <h3 class="font-bold text-xl">
                SO-002
              </h3>

              <p class="text-light text-sm">
                CV Barokah Kopi
              </p>

            </div>

            <span class="badge badge-info">
              Diproses
            </span>

          </div>

          <!-- SUMMARY -->

          <div class="order-summary">

            <div class="order-summary-item">

              <span class="text-light text-sm">
                Total Item
              </span>

              <strong>
                2 Produk
              </strong>

            </div>

            <div class="order-summary-item">

              <span class="text-light text-sm">
                Qty
              </span>

              <strong>
                20kg
              </strong>

            </div>

          </div>

          <!-- FOOTER -->

          <div class="order-footer">

            <span class="text-light text-sm">
              15 Mei 2026
            </span>

            <button
              class="btn btn-soft detail-btn"
              onclick="window.navigate('order-detail')"
            >
              Detail
            </button>

          </div>

        </div>

      </div>

      <!-- FLOAT BUTTON -->

      <button
        class="fab-btn"
        onclick="window.navigate('create-order')"
      >

        <i data-lucide="plus"></i>

      </button>

    </section>
  `;
}