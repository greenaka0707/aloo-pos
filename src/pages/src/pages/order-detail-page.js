export function OrderDetailPage() {
  return `
    <section class="detail-page">

      <!-- HEADER -->

      <div class="detail-header">

        <button
          class="back-btn"
          onclick="window.navigate('order')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div class="detail-header-text">

          <h2>
            SO-001
          </h2>

          <p>
            Sales Order Detail
          </p>

        </div>

      </div>

      <!-- STATUS -->

      <div class="detail-status-card">

        <div>

          <span class="detail-status-label">
            Status
          </span>

          <h3>
            Pending Produksi
          </h3>

        </div>

        <span class="status pending">
          Pending
        </span>

      </div>

      <!-- CUSTOMER -->

      <div class="detail-card">

        <div class="card-title">

          <i data-lucide="user"></i>

          <h3>
            Customer
          </h3>

        </div>

        <div class="detail-info">

          <div class="info-item">
            <span>Nama</span>
            <strong>PT Kopi Nusantara</strong>
          </div>

          <div class="info-item">
            <span>Telepon</span>
            <strong>08123456789</strong>
          </div>

          <div class="info-item">
            <span>Alamat</span>
            <strong>Surabaya</strong>
          </div>

        </div>

      </div>

      <!-- PRODUCT -->

      <div class="detail-card">

        <div class="card-title">

          <i data-lucide="package"></i>

          <h3>
            Produk
          </h3>

        </div>

        <div class="product-item">

          <div>

            <strong>
              Kopi Giras 1:1
            </strong>

            <p>
              Qty 50kg
            </p>

          </div>

          <span class="product-badge">
            Manufacturing
          </span>

        </div>

      </div>

      <!-- BOM -->

      <div class="detail-card">

        <div class="card-title">

          <i data-lucide="factory"></i>

          <h3>
            Kebutuhan Produksi
          </h3>

        </div>

        <div class="bom-list">

          <div class="bom-item">

            <span>
              RB Robusta Grade A
            </span>

            <strong>
              25kg
            </strong>

          </div>

          <div class="bom-item">

            <span>
              Jagung
            </span>

            <strong>
              25kg
            </strong>

          </div>

        </div>

      </div>

      <!-- TIMELINE -->

      <div class="detail-card">

        <div class="card-title">

          <i data-lucide="clock-3"></i>

          <h3>
            Timeline
          </h3>

        </div>

        <div class="timeline">

          <div class="timeline-item active">

            <div class="timeline-dot"></div>

            <div>
              <strong>
                Order Dibuat
              </strong>

              <p>
                15 Mei 2026
              </p>
            </div>

          </div>

          <div class="timeline-item active">

            <div class="timeline-dot"></div>

            <div>
              <strong>
                Menunggu Produksi
              </strong>

              <p>
                Pending
              </p>
            </div>

          </div>

          <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div>
              <strong>
                Produksi
              </strong>

              <p>
                Belum dimulai
              </p>
            </div>

          </div>

          <div class="timeline-item">

            <div class="timeline-dot"></div>

            <div>
              <strong>
                Pengiriman
              </strong>

              <p>
                Menunggu
              </p>
            </div>

          </div>

        </div>

      </div>

      <!-- ACTION -->

      <div class="detail-actions">

        <button class="secondary-btn">
          Void
        </button>

        <button class="secondary-btn">
          Edit
        </button>

        <button class="primary-btn">
          Mulai Produksi
        </button>

      </div>

    </section>
  `;
}