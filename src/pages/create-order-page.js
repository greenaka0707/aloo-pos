export function CreateOrderPage() {
  return `
    <section class="create-order-page">

      <div class="detail-header">
        
        <button
          class="btn-back"
          onclick="window.navigate('order')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div class="detail-header-text">
          <h2>Create Order</h2>
          <p>Sales order manufacturing</p>
        </div>

      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Tanggal</label>
          <input type="date" class="input" />
        </div>

        <div class="form-group">
          <label class="form-label">Customer</label>
          <input type="text" class="input" placeholder="Cari customer..." />
        </div>
      </div>

      <div class="card create-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
          <div>
            <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text);">
              Produk
            </h3>
            <p class="text-light text-xs" style="margin-top: 1px;">Tambahkan item penjualan</p>
          </div>

          <button class="btn-soft" style="height: 32px; padding: 0 var(--space-md); border-radius: var(--radius-sm); font-size: var(--text-xs); display: flex; align-items: center; gap: var(--space-xs); border: none; font-weight: var(--font-semibold); color: var(--orange); background: var(--orange-soft);">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
            Tambah
          </button>
        </div>

        <div class="form-group">
          <input type="text" class="input" placeholder="Cari produk..." />
        </div>
      </div>

      <div class="card create-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--border);">
          <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
            Kopi Giras 1:1
          </strong>
          <button style="background: none; border: none; color: var(--danger); font-size: var(--text-xs); font-weight: var(--font-semibold); padding: var(--space-xs);">
            Hapus
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md);">
          <div class="form-group">
            <label class="form-label">Qty</label>
            <input type="text" inputmode="numeric" class="input" value="50" />
          </div>

          <div class="form-group">
            <label class="form-label">Harga</label>
            <input type="text" inputmode="numeric" class="input" value="25000" />
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px dashed var(--border);">
          <span class="text-light text-xs">Subtotal</span>
          <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">Rp 1.250.000</strong>
        </div>
      </div>

      <div class="card create-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
          <div>
            <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text);">
              Produksi Dibutuhkan
            </h3>
            <p class="text-light text-xs" style="margin-top: 1px;">Auto manufacturing analysis</p>
          </div>
          <span class="badge badge-warning">Diproses</span>
        </div>

        <div style="display: flex; align-items: center; gap: var(--space-sm); background: var(--warning-soft); color: #D97706; padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-md);">
          <i data-lucide="factory" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
          <p style="font-size: var(--text-xs); font-weight: var(--font-medium); line-height: 1.4; margin: 0;">
            Stock produk tidak mencukupi dan perlu produksi
          </p>
        </div>

        <div class="detail-info" style="gap: var(--space-sm);">
          <div class="detail-row-item" style="padding: 2px 0;">
            <span class="text-light text-sm">RB Robusta Grade A</span>
            <strong class="right-value" style="font-size: var(--text-sm);">25kg</strong>
          </div>

          <div class="detail-row-item" style="padding: 2px 0;">
            <span class="text-light text-sm">Jagung</span>
            <strong class="right-value" style="font-size: var(--text-sm);">25kg</strong>
          </div>
        </div>
      </div>

      <div class="card create-card">
        <div class="detail-info" style="gap: var(--space-sm);">
          <div class="detail-row-item" style="padding: 2px 0;">
            <span class="text-light text-sm">Subtotal</span>
            <strong style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 1.250.000</strong>
          </div>

          <div class="detail-row-item" style="padding: 2px 0;">
            <span class="text-light text-sm">Bayar</span>
            <strong style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 0</strong>
          </div>

          <div class="detail-row-item" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: 4px;">
            <span class="font-semibold text-sm">Sisa</span>
            <strong class="right-value" style="color: var(--orange); font-size: var(--text-md);">Rp 1.250.000</strong>
          </div>
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Bayar</label>
          <input type="text" inputmode="numeric" class="input" placeholder="0" />
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Catatan</label>
          <textarea class="textarea" placeholder="Tambahkan catatan..."></textarea>
        </div>
      </div>

      <div class="detail-actions">
        <button class="action-btn">
          Draft
        </button>
        <button class="action-btn primary-action">
          Submit
        </button>
      </div>

    </section>
  `;
}
