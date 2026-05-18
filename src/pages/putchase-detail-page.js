export function PurchaseDetailPage() {
  return `
    <section class="detail-page">

      <!-- HEADER -->

      <div class="detail-header">

        <button
          class="btn-icon"
          onclick="window.navigate('pembelian')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div class="detail-header-text">

          <h2 class="text-3xl font-bold">
            PO-001
          </h2>

          <p class="text-light text-md">
            Purchase Detail
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
            Menunggu Penerimaan
          </h3>

        </div>

        <span class="badge badge-warning">
          Pending
        </span>

      </div>

      <!-- SUPPLIER -->

      <div class="card detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="building-2"></i>
          </div>

          <h3 class="text-xl font-bold">
            Supplier
          </h3>

        </div>

        <div class="detail-info">

          <div class="info-item">

            <span class="text-light text-sm">
              Nama
            </span>

            <strong class="text-lg font-bold">
              PT Sumber Kopi Nusantara
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

      <!-- ITEM -->

      <div class="card detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>

          <h3 class="text-xl font-bold">
            Item Pembelian
          </h3>

        </div>

        <div class="bom-list">

          <!-- ITEM -->

          <div class="bom-item">

            <div>

              <strong class="text-base font-bold">
                RB Robusta Grade A
              </strong>

              <p class="text-light text-sm">
                100kg × Rp 45.000
              </p>

            </div>

            <strong class="text-base font-bold">
              Rp 4.500.000
            </strong>

          </div>

          <!-- ITEM -->

          <div class="bom-item">

            <div>

              <strong class="text-base font-bold">
                Jagung
              </strong>

              <p class="text-light text-sm">
                50kg × Rp 8.000
              </p>

            </div>

            <strong class="text-base font-bold">
              Rp 400.000
            </strong>

          </div>

        </div>

      </div>

      <!-- SUMMARY -->

      <div class="card detail-card">

        <div class="card-title">

          <div class="icon-box">
            <i data-lucide="wallet"></i>
          </div>

          <h3 class="text-xl font-bold">
            Ringkasan
          </h3>

        </div>

        <div class="summary-row">

          <span class="text-light text-sm">
            Subtotal
          </span>

          <strong>
            Rp 4.900.000
          </strong>

        </div>

        <div class="summary-row">

          <span class="text-light text-sm">
            Ongkir
          </span>

          <strong>
            Rp 0
          </strong>

        </div>

        <div class="summary-row total-row">

          <span class="font-semibold">
            Total
          </span>

          <strong class="text-lg font-bold">
            Rp 4.900.000
          </strong>

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
                Purchase Dibuat
              </strong>

              <p class="text-light text-sm">
                18 Mei 2026
              </p>

            </div>

          </div>

          <div class="timeline-item active">

            <div class="timeline-dot"></div>

            <div>

              <strong class="font-bold">
                Menunggu Barang
              </strong>

              <p class="text-light text-sm">
                Pending supplier
              </p>

            </div>

          </div>

          <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div>

              <strong class="font-bold">
                Barang Diterima
              </strong>

              <p class="text-light text-sm">
                Belum diterima
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
          Terima Barang
        </button>

      </div>

    </section>
  `;
}