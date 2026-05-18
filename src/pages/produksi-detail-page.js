export function ProduksiDetailPage() {
  return `
    <section class="detail-page">

      <div class="detail-header">
        <button
          class="btn-back"
          onclick="window.navigate('produksi')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div class="detail-header-text">
          <h2>PRD-001</h2>
          <p>Produksi Detail</p>
        </div>
      </div>

      <div class="card detail-status-card">
        <div>
          <span class="detail-status-title">Status</span>
          <h3 class="font-bold">
            Produksi Berjalan
          </h3>
        </div>
        <span class="badge badge-info">
          Diproses
        </span>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>
          <h3>Produk Produksi</h3>
        </div>

        <div class="detail-row-item">
          <div class="left-content">
            <strong class="title">Kopi Giras 1:1</strong>
            <span class="subtitle">Qty Produksi 50kg</span>
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
          <h3>Bahan Produksi</h3>
        </div>

        <div class="detail-info">
          <div class="detail-row-item">
            <div class="left-content">
              <strong class="title">RB Robusta Grade A</strong>
              <span class="subtitle">Need 25kg</span>
            </div>
            <div class="detail-row-item" style="gap: var(--space-sm); padding: 0;">
              <span class="text-light text-xs">Stock 80kg</span>
              <span class="badge badge-success">Aman</span>
            </div>
          </div>

          <div class="detail-row-item">
            <div class="left-content">
              <strong class="title">Jagung</strong>
              <span class="subtitle">Need 25kg</span>
            </div>
            <div class="detail-row-item" style="gap: var(--space-sm); padding: 0;">
              <span class="text-light text-xs">Stock 12kg</span>
              <span class="badge badge-danger">Kurang</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="activity"></i>
          </div>
          <h3>Progress Produksi</h3>
        </div>

        <div class="timeline">
          <div class="timeline-item active">
            <div class="timeline-dot"></div>
            <div>
              <h4>Persiapan Bahan</h4>
            </div>
          </div>

          <div class="timeline-item active">
            <div class="timeline-dot"></div>
            <div>
              <h4>Roasting</h4>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div>
              <h4>Mixing</h4>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div>
              <h4>Packing</h4>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div>
              <h4>Finished</h4>
            </div>
          </div>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="boxes"></i>
          </div>
          <h3>Stock Impact</h3>
        </div>

        <div class="detail-info">
          <div class="detail-row-item">
            <div class="left-content">
              <span class="title">RB Robusta Grade A</span>
            </div>
            <strong class="right-value" style="color: var(--danger);">-25kg</strong>
          </div>

          <div class="detail-row-item">
            <div class="left-content">
              <span class="title">Jagung</span>
            </div>
            <strong class="right-value" style="color: var(--danger);">-25kg</strong>
          </div>

          <div class="detail-row-item">
            <div class="left-content">
              <span class="title">Kopi Giras 1:1</span>
            </div>
            <strong class="right-value" style="color: var(--green);">+50kg</strong>
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
              <h4>Produksi Dibuat</h4>
              <p>15 Mei 2026</p>
            </div>
          </div>

          <div class="timeline-item active">
            <div class="timeline-dot"></div>
            <div>
              <h4>Produksi Dimulai</h4>
              <p>Diproses</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div>
              <h4>Packing</h4>
              <p>Menunggu</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div>
              <h4>Finished</h4>
              <p>Belum selesai</p>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-actions">
        <button class="action-btn">
          Pause
        </button>
        <button class="action-btn">
          Edit
        </button>
        <button class="action-btn primary-action">
          Finish
        </button>
      </div>

    </section>
  `;
}
