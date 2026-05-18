export function ProduksiListPage() {
  return `
    <section class="order-page">

      <!-- HEADER -->

      <div class="page-header">

        <div>

          <h2 class="text-3xl font-bold">
            Produksi
          </h2>

          <p class="text-light text-md page-subtitle">
            Manufacturing production workflow
          </p>

        </div>

      </div>

      <!-- SEARCH -->

      <div class="card search-box">

        <i data-lucide="search"></i>

        <input
          type="text"
          placeholder="Cari produksi..."
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
          Selesai
        </button>

      </div>

      <!-- PRODUKSI LIST -->

      <div class="order-list">

        <!-- ITEM -->

        <div class="card order-card produksi-card">

          <div class="order-top">

            <div>

              <h3 class="font-bold text-xl">
                PRD-001
              </h3>

              <p class="text-light text-sm">
                SO-001
              </p>

            </div>

            <span class="badge badge-info">
              Diproses
            </span>

          </div>

          <div class="order-body">

            <div class="order-product">

              <div class="icon-box">
                <i data-lucide="factory"></i>
              </div>

              <div>

                <strong class="font-bold text-lg">
                  Kopi Giras 1:1
                </strong>

                <p class="text-light text-sm">
                  Produksi 50kg
                </p>

              </div>

            </div>

            <!-- BOM -->

            <div class="produksi-bom">

              <span class="bom-chip">
                RB Robusta Grade A
              </span>

              <span class="bom-chip">
                Jagung
              </span>

            </div>

          </div>

          <div class="order-footer">

            <span class="text-light text-sm">
              15 Mei 2026
            </span>

            <button
              class="btn btn-soft detail-btn"
              onclick="window.navigate('produksi-detail')"
            >
              Detail
            </button>

          </div>

        </div>

      </div>

    </section>
  `;
}