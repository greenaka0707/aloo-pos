export function PurchaseDetailPage() {
  return `
    <section class="detail-page">

      <div class="card detail-status-card">
        <div>
          <span class="detail-status-title">Status</span>
          <h3 class="font-bold">Menunggu Penerimaan</h3>
        </div>
        <span class="badge badge-warning">Pending</span>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="building-2"></i>
          </div>
          <h3>Supplier</h3>
        </div>

        <div class="detail-info">
          <div class="info-item">
            <span>Nama</span>
            <strong>PT Sumber Kopi Nusantara</strong>
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
          <h3>Item Pembelian</h3>
        </div>

        <div class="detail-info">
          <div class="detail-row-item">
            <div class="left-content">
              <strong class="title">RB Robusta Grade A</strong>
              <span class="subtitle">100kg × Rp 45.000</span>
            </div>
            <strong class="right-value">Rp 4.500.000</strong>
          </div>

          <div class="detail-row-item">
            <div class="left-content">
              <strong class="title">Jagung</strong>
              <span class="subtitle">50kg × Rp 8.000</span>
            </div>
            <strong class="right-value">Rp 400.000</strong>
          </div>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="wallet"></i>
          </div>
          <h3>Ringkasan</h3>
        </div>

        <div class="detail-info" style="gap: var(--space-sm);">
          <div class="detail-row-item">
            <span class="text-light text-sm">Subtotal</span>
            <strong class="text-sm font-semibold">Rp 4.900.000</strong>
          </div>

          <div class="detail-row-item">
            <span class="text-light text-sm">Ongkir</span>
            <strong class="text-sm font-semibold">Rp 0</strong>
          </div>

          <div class="detail-row-item" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: 2px;">
            <span class="font-semibold text-sm">Total</span>
            <strong class="right-value" style="color: var(--orange); font-size: var(--text-md);">Rp 4.900.000</strong>
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
              <h4>Purchase Dibuat</h4>
              <p>18 Mei 2026</p>
            </div>
          </div>

          <div class="timeline-item active">
            <div class="timeline-dot"></div>
            <div>
              <h4>Menunggu Barang</h4>
              <p>Pending supplier</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div>
              <h4>Barang Diterima</h4>
              <p>Belum diterima</p>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-actions">
        <button class="action-btn">Void</button>
        <button class="action-btn">Edit</button>
        <button class="action-btn primary-action">Terima Barang</button>
      </div>

    </section>
  `;
}
