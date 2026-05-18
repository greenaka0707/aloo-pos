export function ProduksiListPage() {
  setTimeout(() => {
    const container = document.querySelector(".data-list");
    
    // ==========================================================================
    // KUNCI AMAN: Sembunyikan FAB secara paksa agar tidak bocor dari page lain
    // ==========================================================================
    const fab = document.querySelector(".fab-btn");
    if (fab) {
      fab.style.display = "none";
    }

    if (!container) return;

    // Render ulang icon Lucide setelah komponen masuk ke DOM
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, 50);

  return `
    <section class="list-page"> 

      <div class="card search-box">
        <i data-lucide="search"></i>
        <input
          type="text"
          placeholder="Cari produksi..."
        />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Pending</button>
        <button class="filter-chip">Diproses</button>
        <button class="filter-chip">Ready</button>
        <button class="filter-chip">Selesai</button>
      </div>

      <div class="data-list">

        <div class="card list-card">
          <div class="list-card-top">
            <div>
              <h3 class="font-bold">PRD-001</h3>
              <p class="text-light text-sm">Ref: SO-001</p>
            </div>
            <span class="badge badge-info">Diproses</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-xs) 0;">
            
            <div style="display: flex; align-items: center; gap: var(--space-md);">
              <div class="icon-box" style="width: 38px; height: 38px;"> 
                <i data-lucide="factory" style="width: 16px; height: 16px;"></i>
              </div>
              <div>
                <strong class="font-semibold" style="font-size: var(--text-sm); display: block; color: var(--text);">
                  Kopi Giras 1:1
                </strong>
                <span class="text-light text-xs">Produksi 50kg</span>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
              <span class="badge" style="background: var(--bg); color: var(--text-light); font-weight: var(--font-medium); height: 22px; padding: 0 var(--space-sm);">
                RB Robusta Grade A
              </span>
              <span class="badge" style="background: var(--bg); color: var(--text-light); font-weight: var(--font-medium); height: 22px; padding: 0 var(--space-sm);">
                Jagung
              </span>
            </div>

          </div>

          <div class="list-card-footer">
            <span>15 Mei 2026</span>
            <button
              class="btn btn-soft detail-btn"
              onclick="window.navigate('produksi-detail')"
            >
              Detail
            </button>
          </div>
        </div>

      </div>

    </section>
  `;
}
