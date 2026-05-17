export function OrderDetailPage() {
  return `
    <section class="detail-page">

      <!-- HEADER -->

      <div class="detail-header">

        <button
          class="btn-icon"
          onclick="window.navigate('order')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div class="detail-header-text">

          <h2 class="text-3xl font-bold">
            SO-001
          </h2>

          <p class="text-light text-md">
            Sales Order Detail
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
            Pending Produksi
          </h3>

        </div>

        <span class="badge badge-warning">
          Pending
        </span>

      </div>

      <!-- CUSTOMER -->

      <div class="card detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="user"></i>
          </div>

          <h3 class="text-xl font-bold">
            Customer
          </h3>

        </div>

        <div class="detail-info">

          <div class="info-item">

            <span class="text-light text-sm">
              Nama
            </span>

            <strong class="text-lg font-bold">
              PT Kopi Nusantara
            </strong>

          </div>

          <div class="info-item">

            <span class="text-light text-sm">
              Telepon
            </span>

            <strong class="text-lg font-bold">
              08123456789
            </strong>

          </div>

          <div class="info-item">

            <span class="text-light text-sm">
              Alamat
            </span>

            <strong class="text-lg font-bold">
              Surabaya
            </strong>

          </div>

        </div>

      </div>

      <!-- PRODUCT -->

      <div class="card detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>

          <h3 class="text-xl font-bold">
            Produk
          </h3>

        </div>

        <div class="product-item">

          <div>

            <strong class="text-xl font-bold">
              Kopi Giras 1:1
            </strong>

            <p class="text-light text-md product-subtitle">
              Qty 50kg
            </p>

          </div>

          <span class="badge badge-primary">
            Manufacturing
          </span>

        </div>

      </div>

      <!-- BOM -->

      <div class="card detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="factory"></i>
          </div>

          <h3 class="text-xl font-bold">
            Kebutuhan Produksi
          </h3>

        </div>

        <div class="bom-list">

          <div class="bom-item">

            <span class="text-light text-md">
              RB Robusta Grade A
            </span>

            <strong class="text-lg font-bold">
              25kg
            </strong>

          </div>

          <div class="bom-item">

            <span class="text-light text-md">
              Jagung
            </span>

            <strong class="text-lg font-bold">
              25kg
            </strong>

          </div>

        </div>

      </div>

      <!-- TIMELINE -->

      <div class="card detail-card">

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
                Order Dibuat
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
                Menunggu Produksi
              </strong>

              <p class="text-light text-sm">
                Pending
              </p>

            </div>

          </div>

          <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div>

              <strong class="font-bold">
                Produksi
              </strong>

              <p class="text-light text-sm">
                Belum dimulai
              </p>

            </div>

          </div>

          <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div>

              <strong class="font-bold">
                Pengiriman
              </strong>

              <p class="text-light text-sm">
                Menunggu
              </p>

            </div>

          </div>

        </div>

      </div>

      <!-- ACTION -->

      <div class="detail-actions">

        <button class="btn btn-secondary action-btn">
          Void
        </button>

        <button class="btn btn-secondary action-btn">
          Edit
        </button>

        <button class="btn btn-primary action-btn primary-action">
          Mulai Produksi
        </button>

      </div>

    </section>
  `;
}