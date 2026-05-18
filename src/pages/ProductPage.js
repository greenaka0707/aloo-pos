export function ProductPage() {
  return `
    <section class="list-page">

      <div class="card search-box">
        <i data-lucide="search"></i>
        <input 
          type="text" 
          placeholder="Cari produk..." 
        />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Coffee Blend</button>
        <button class="filter-chip">Single Origin</button>
        <button class="filter-chip">RTD Beverages</button>
      </div>

      <div class="data-list">

        <div class="card list-card">
          <div class="list-card-top">
            <div>
              <span class="badge badge-primary">Coffee Blend</span>
            </div>
            <strong class="text-sm font-semibold" style="color: var(--text-light);">SKU: PRD-BLND-01</strong>
          </div>

          <div style="display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-xs) 0;">
            <div class="icon-box" style="width: 44px; height: 44px; background: rgba(214, 90, 49, 0.1); color: var(--orange);">
              <i data-lucide="coffee" style="width: 20px; height: 20px;"></i>
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <h3 class="font-bold" style="font-size: var(--text-md); color: var(--text);">
                Kopi Giras 1:1
              </h3>
              <p class="text-light text-xs">
                Racikan signature robusta dan jagung untuk pasar kalcer harian.
              </p>
              
              <div style="display: flex; align-items: center; gap: var(--space-sm); margin-top: 4px;">
                <span class="badge" style="background: var(--bg); color: var(--text); height: 22px;">
                  Rp 25.000 / kg
                </span>
                <span class="text-light text-xs" style="display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="layers" style="width: 12px; height: 12px;"></i> BOM: 2 Bahan
                </span>
              </div>
            </div>
          </div>

          <div class="list-card-footer" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: var(--space-xs);">
            <span class="text-light text-xs">Active Master</span>
            <div style="display: flex; gap: var(--space-xs);">
              <button class="btn btn-soft" style="padding: var(--space-xs) var(--space-sm); font-size: var(--text-xs);">
                BOM
              </button>
              <button class="btn btn-soft detail-btn">
                Edit
              </button>
            </div>
          </div>
        </div>

        <div class="card list-card">
          <div class="list-card-top">
            <div>
              <span class="badge badge-info">RTD Beverages</span>
            </div>
            <strong class="text-sm font-semibold" style="color: var(--text-light);">SKU: PRD-RTD-02</strong>
          </div>

          <div style="display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-xs) 0;">
            <div class="icon-box" style="width: 44px; height: 44px; background: rgba(59, 130, 246, 0.1); color: #3B82F6;">
              <i data-lucide="cup- soda" style="width: 20px; height: 20px;"></i>
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <h3 class="font-bold" style="font-size: var(--text-md); color: var(--text);">
                Moren Cold Brew (Morning Energy)
              </h3>
              <p class="text-light text-xs">
                Kopi siap minum kemasan pouch botol khusus anak skena.
              </p>
              
              <div style="display: flex; align-items: center; gap: var(--space-sm); margin-top: 4px;">
                <span class="badge" style="background: var(--bg); color: var(--text); height: 22px;">
                  Rp 18.000 / pcs
                </span>
                <span class="text-light text-xs" style="display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="layers" style="width: 12px; height: 12px;"></i> BOM: 3 Bahan
                </span>
              </div>
            </div>
          </div>

          <div class="list-card-footer" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: var(--space-xs);">
            <span class="text-light text-xs">Active Master</span>
            <div style="display: flex; gap: var(--space-xs);">
              <button class="btn btn-soft" style="padding: var(--space-xs) var(--space-sm); font-size: var(--text-xs);">
                BOM
              </button>
              <button class="btn btn-soft detail-btn">
                Edit
              </button>
            </div>
          </div>
        </div>

      </div>

      <button 
        class="fab-btn" 
        onclick="window.navigate('create-product')"
      >
        <i data-lucide="plus"></i>
      </button>

    </section>
  `;
}
