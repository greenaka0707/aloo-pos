export function OrderListPage() {
  return `
    <section class="order-page">

      <!-- HEADER -->

      <div class="page-header">

        <div>

          <h2>
            Sales Order
          </h2>

          <p>
            Manufacturing sales workflow
          </p>

        </div>

        <button class="header-btn">
          <i data-lucide="plus"></i>
        </button>

      </div>

      <!-- SEARCH -->

      <div class="search-box">

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

        <div class="order-card">

          <div class="order-top">

            <div>

              <h3>
                SO-001
              </h3>

              <p>
                PT Kopi Nusantara
              </p>

            </div>

            <span class="status pending">
              Pending
            </span>

          </div>

          <div class="order-body">

            <div class="order-product">

              <i data-lucide="coffee"></i>

              <div>

                <strong>
                  Kopi Giras 1:1
                </strong>

                <p>
                  50kg
                </p>

              </div>

            </div>

          </div>

          <div class="order-footer">

            <span>
              15 Mei 2026
            </span>

            <button
  class="detail-btn"
  onclick="window.navigate('order-detail')"
>
  Detail
</button>

          </div>

        </div>

        <!-- ITEM -->

        <div class="order-card">

          <div class="order-top">

            <div>

              <h3>
                SO-002
              </h3>

              <p>
                CV Barokah Kopi
              </p>

            </div>

            <span class="status processing">
              Diproses
            </span>

          </div>

          <div class="order-body">

            <div class="order-product">

              <i data-lucide="package"></i>

              <div>

                <strong>
                  RB Robusta Grade A
                </strong>

                <p>
                  20kg
                </p>

              </div>

            </div>

          </div>

          <div class="order-footer">

            <span>
              15 Mei 2026
            </span>

            <button class="detail-btn">
              Detail
            </button>

          </div>

        </div>

      </div>

      <!-- FLOAT BUTTON -->

      <button class="fab-btn">

        <i data-lucide="plus"></i>

      </button>

    </section>
  `;
}