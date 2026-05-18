export function StockPage() {
  return `
    <section class="order-page"> <div class="page-header">
        <div>
          <h2 class="font-bold">
            Stock
          </h2>
          <p class="page-subtitle">
            Inventory management
          </p>
        </div>
      </div>

      <div class="card search-box"> <i data-lucide="search"></i>
        <input
          type="text"
          placeholder="Cari stock..."
        />
      </div>

      <div class="filter-scroll"> <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Barang Jadi</button>
        <button class="filter-chip">Bahan Baku</button>
        <button class="filter-chip">Menipis</button>
      </div>

      <div class="order-list"> <div
          class="card order-card" 
          onclick="window.navigate('stock-detail')"
          style="cursor: pointer;"
        >
          <div class="order-top">
            <div>
              <span class="badge badge-primary">Barang Jadi</span>
            </div>
            <span class="badge badge-success">Aman</span>
          </div>

          <div style="display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-xs) 0;">
            <div class="icon-box" style="width: 42px; height: 42px;">
              <i data-lucide="coffee" style="width: 18px; height: 18px;"></i>
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
              <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
                Kopi Giras 1:1
              </strong>
              <p class="text-light text-xs" style="margin-bottom: 6px;">
                Ready stock untuk penjualan
              </p>
              
              <div style="display: flex; gap: var(--space-md); align-items: center;">
                <span class="badge" style="background: var(--bg); color: var(--text); height: 22px; font-size: var(--text-xs); padding: 0 var(--space-sm);">
                  Stock: 120kg
                </span>
                <span class="text-light text-xs">Min: 50kg</span>
              </div>
            </div>
          </div>

          <div class="order-footer">
            <span class="text-light text-xs">Updated 15 Mei 2026</span>
            <button
              class="detail-btn"
              onclick="event.stopPropagation(); window.navigate('stock-detail')"
            >
              Detail
            </button>
          </div>
        </div>

        <div
          class="card order-card"
          onclick="window.navigate('stock-detail')"
          style="cursor: pointer; border-color: var(--orange);" 
        >
          <div class="order-top">
            <div>
              <span class="badge badge-info">Bahan Baku</span>
            </div>
            <span class="badge badge-danger">Menipis</span>
          </div>

          <div style="display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-xs) 0;">
            <div class="icon-box" style="width: 42px; height: 42px; background: var(--orange-soft); color: var(--orange);">
              <i data-lucide="package" style="width: 18px; height: 18px;"></i>
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
              <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
                RB Robusta Grade A
              </strong>
              <p class="text-light text-xs" style="margin-bottom: 6px;">
                Bahan baku roasting
              </p>
              
              <div style="display: flex; gap: var(--space-md); align-items: center;">
                <span class="badge" style="background: var(--danger-soft); color: var(--danger); height: 22px; font-size: var(--text-xs); padding: 0 var(--space-sm); font-weight: var(--font-bold);">
                  Stock: 12kg
                </span>
                <span class="text-light text-xs">Min: 30kg</span>
              </div>
            </div>
          </div>

          <div class="order-footer">
            <span style="color: var(--danger); font-size: var(--text-xs); font-weight: var(--font-medium);">
              Restock dibutuhkan
            </span>
            <button
              class="detail-btn"
              onclick="event.stopPropagation(); window.navigate('stock-detail')"
            >
              Detail
            </button>
          </div>
        </div>

      </div>

    </section>
  `;
}
