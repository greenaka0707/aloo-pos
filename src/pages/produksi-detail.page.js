export function ProduksiDetailPage() {
  return `
    <section class="produksi-detail-page">

      <!-- HEADER -->

      <div class="detail-header">

        <button
          class="btn-icon"
          onclick="window.navigate('produksi')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div class="detail-header-text">

          <h2 class="text-3xl font-bold">
            PRD-001
          </h2>

          <p class="text-light text-md">
            Produksi Detail
          </p>

        </div>

      </div>

      <!-- STATUS -->

      <div class="card detail-status-card">

        <div>

          <span class="text-light text-sm">
            Status
          </span>

          <h3 class="text-2xl font-bold detail-status-title">
            Produksi Berjalan
          </h3>

        </div>

        <span class="badge badge-info">
          Diproses
        </span>

      </div>

      <!-- PRODUK -->

      <div class="card produksi-detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>

          <h3 class="text-xl font-bold">
            Produk Produksi
          </h3>

        </div>

        <div class="produksi-product">

          <div>

            <strong class="text-xl font-bold">
              Kopi Giras 1:1
            </strong>

            <p class="text-light text-md">
              Qty Produksi 50kg
            </p>

          </div>

          <span class="badge badge-primary">
            Manufacturing
          </span>

        </div>

      </div>

      <!-- BAHAN -->

      <div class="card produksi-detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="factory"></i>
          </div>

          <h3 class="text-xl font-bold">
            Bahan Produksi
          </h3>

        </div>

        <div class="material-list">

          <!-- ITEM -->

          <div class="material-item">

            <div>

              <strong class="text-lg font-bold">
                RB Robusta Grade A
              </strong>

              <p class="text-light text-sm">
                Need 25kg
              </p>

            </div>

            <div class="material-right">

              <span class="text-light text-sm">
                Stock 80kg
              </span>

              <span class="badge badge-success">
                Aman
              </span>

            </div>

          </div>

          <!-- ITEM -->

          <div class="material-item">

            <div>

              <strong class="text-lg font-bold">
                Jagung
              </strong>

              <p class="text-light text-sm">
                Need 25kg
              </p>

            </div>

            <div class="material-right">

              <span class="text-light text-sm">
                Stock 12kg
              </span>

              <span class="badge badge-danger">
                Kurang
              </span>

            </div>

          </div>

        </div>

      </div>

      <!-- PROGRESS -->

      <div class="card produksi-detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="activity"></i>
          </div>

          <h3 class="text-xl font-bold">
            Progress Produksi
          </h3>

        </div>

        <div class="progress-list">

          <div class="progress-item active">

            <div class="progress-dot"></div>

            <span>
              Persiapan Bahan
            </span>

          </div>

          <div class="progress-item active">

            <div class="progress-dot"></div>

            <span>
              Roasting
            </span>

          </div>

          <div class="progress-item">

            <div class="progress-dot"></div>

            <span>
              Mixing
            </span>

          </div>

          <div class="progress-item">

            <div class="progress-dot"></div>

            <span>
              Packing
            </span>

          </div>

          <div class="progress-item">

            <div class="progress-dot"></div>

            <span>
              Finished
            </span>

          </div>

        </div>

      </div>

      <!-- STOCK IMPACT -->

      <div class="card produksi-detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="boxes"></i>
          </div>

          <h3 class="text-xl font-bold">
            Stock Impact
          </h3>

        </div>

        <div class="impact-list">

          <div class="impact-item minus">

            <span>
              RB Robusta Grade A
            </span>

            <strong>
              -25kg
            </strong>

          </div>

          <div class="impact-item minus">

            <span>
              Jagung
            </span>

            <strong>
              -25kg
            </strong>

          </div>

          <div class="impact-item plus">

            <span>
              Kopi Giras 1:1
            </span>

            <strong>
              +50kg
            </strong>

          </div>

        </div>

      </div>

      <!-- TIMELINE -->

      <div class="card produksi-detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="clock-3"></i>
          </div>

          <h3 class="text-xl font-bold">
            Timeline
          </h3>

        </div>

        <div class="timeline">

          <div class="timeline-item active">

            <div class="timeline-dot"></div>

            <div>

              <strong class="font-bold">
                Produksi Dibuat
              </strong>

              <p class="text-light text-sm">
                15 Mei 2026
              </p>

            </div>

          </div>

          <div class="timeline-item active">

            <div class="timeline-dot"></div>

            <div>

              <strong class="font-bold">
                Produksi Dimulai
              </strong>

              <p class="text-light text-sm">
                Diproses
              </p>

            </div>

          </div>

          <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div>

              <strong class="font-bold">
                Packing
              </strong>

              <p class="text-light text-sm">
                Menunggu
              </p>

            </div>

          </div>

          <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div>

              <strong class="font-bold">
                Finished
              </strong>

              <p class="text-light text-sm">
                Belum selesai
              </p>

            </div>

          </div>

        </div>

      </div>

      <!-- ACTION -->

      <div class="detail-actions">

        <button class="btn btn-secondary action-btn">
          Pause
        </button>

        <button class="btn btn-secondary action-btn">
          Edit
        </button>

        <button class="btn btn-primary action-btn primary-action">
          Finish
        </button>

      </div>

    </section>
  `;
}