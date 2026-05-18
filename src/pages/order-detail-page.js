export function OrderDetailPage() {
  return `
    <section class="detail-page">

      <div class="detail-header">
        <button
          class="btn-back"
          onclick="window.navigate('order')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div class="detail-header-text">
          <h2>SO-001</h2>
          <p>Sales Order Detail</p>
        </div>
      </div>

      <div class="card detail-status-card">
        <div>
          <span class="detail-status-title">Status</span>
          <h3 class="font-bold">
            Pending Produksi
          </h3>
        </div>
        <span class="badge badge-warning">
          Pending
        </span>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="user"></i>
          </div>
          <h3>Customer</h3>
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

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>
          <h3>Produk</h3>
        </div>

        <div class="detail-row-item">
          <div class="left-content">
            <strong class="title">Kopi Giras 1:1</strong>
            <span class="subtitle">Qty 50kg</span>
          </div>
          <span class="badge badge-primary">
            Manufacturing
          </span>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="factory"></i>
          </div>
          <h3>Kebutuhan Produksi</h3>
        </div>

        <div class="bom-list">
          <div class="detail-row-item">
            <div class="left-content">
              <span class="title">RB Robusta Grade A</span>
            </div>
            <strong class="right-value">25kg</strong>
          </div>

          <div class="detail-row-item">
            <div class="left-content">
              <span class="title">Jagung</span>
            </div>
            <strong class="right-value">25kg</strong>
          </div>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="clock-3"></i>
          </div>
          <h3>Timeline</h3>
        </div>

        <div class="timeline">
          <div class="timeline-item active">
            <div class="timeline-dot"></div>
            <div>
              <h4>Order Dibuat</h4>
              <p>15 Mei 2026</p>
            </div>
          </div>

          <div class="timeline-item active">
            <div class="timeline-dot"></div>
            <div>
              <h4>Menunggu Produksi</h4>
              <p>Pending</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div>
              <h4>Produksi</h4>
              <p>Belum dimulai</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div>
              <h4>Pengiriman</h4>
              <p>Menunggu</p>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-actions">
        <button class="action-btn">
          Void
        </button>
        <button class="action-btn">
          Edit
        </button>
        <button class="action-btn primary-action">
          Mulai Produksi
        </button>
      </div>

    </section>
  `;
}
