import { supabase } from "../supabaseClient.js";

// ==========================================================================
// 1. FUNGSI AMBIL DATA STOCK DARI SUPABASE (PRODUCTS TABLE)
// ==========================================================================
async function getSupabaseStock() {
  try {
    const { data, error } = await supabase
      .from('products') 
      // ✔️ FIX: updated_at dihapus dari skema select gais biar gak bikin crash database
      .select('id, name, category, stock, min_stock, unit, description')
      .order('stock', { ascending: true }); // Mengutamakan stok kritis/menipis di atas

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Gagal mengambil data stock dari Supabase:", error.message);
    return [];
  }
}

// ==========================================================================
// 2. CORE COMPONENT: STOCK PAGE (NAMED EXPORT - SESUAI ROUTER LO GAIS)
// ==========================================================================
export function StockPage() {
  // Gunakan delay mikro aman agar elemen .stock-dynamic-list sudah bertengger di DOM
  setTimeout(async () => {
    const container = document.querySelector(".stock-dynamic-list");
    const chips = document.querySelectorAll(".filter-chip");
    const searchInput = document.querySelector(".stock-search-input");

    if (!container) return;

    // Tarik data asli dari database
    const allItems = await getSupabaseStock();

    // ==========================================================================
    // ENGINE RENDERER DENGAN ANIMASI SLIDE (100% KONSISTEN)
    // ==========================================================================
    const renderList = (itemsToRender) => {
      // Pemicu awal: beri efek geser keluar ke kiri gais
      container.classList.add("page-leave");

      setTimeout(() => {
        if (itemsToRender.length === 0) {
          container.innerHTML = `
            <div class="card" style="padding: 24px; text-align: center; color: var(--text-light); font-size: var(--text-sm);">
              Tidak ada data stock yang cocok dengan filter.
            </div>
          `;
        } else {
          container.innerHTML = itemsToRender.map(item => {
            const stockVal = item.stock || 0;
            const minStockVal = item.min_stock || 0;
            const unitStr = item.unit || 'kg';
            
            // A. Deteksi Kategori & Custom Badge Warna Lu gais
            let categoryText = 'Lainnya';
            let categoryBadge = 'badge-primary';
            
            if (item.category === 'roastedbean' || item.category === 'kopi_bubuk') {
              categoryText = 'Barang Jadi';
              categoryBadge = 'badge-primary'; // Biru bawaan template lu
            } else if (item.category === 'greenbean') {
              categoryText = 'Bahan Baku';
              categoryBadge = 'badge-info';    // Tosca/Cyan info gais
            }

            // B. Deteksi Status Kelayakan Batas Minimum Stock
            const isMenipis = stockVal <= minStockVal;
            const statusBadge = isMenipis ? 'badge-danger' : 'badge-success';
            const statusText = isMenipis ? 'Menipis' : 'Aman';
            
            // C. Inject Style Dinamis Sesuai Template Desain Lu
            const cardBorderColor = isMenipis ? 'border-color: var(--orange);' : '';
            const iconBoxStyle = isMenipis 
              ? 'background: var(--orange-soft); color: var(--orange);' 
              : 'background: rgba(16, 185, 129, 0.1); color: #10B981;';
            const iconName = item.category === 'greenbean' ? 'package' : 'coffee';

            const stockBadgeStyle = isMenipis
              ? 'background: var(--danger-soft); color: var(--danger); font-weight: var(--font-bold);'
              : 'background: var(--bg); color: var(--text);';

            return `
              <div
                class="card list-card" 
                onclick="window.navigate('stock-detail')"
                style="cursor: pointer; ${cardBorderColor}"
              >
                <div class="list-card-top">
                  <div>
                    <span class="badge ${categoryBadge}">${categoryText}</span>
                  </div>
                  <span class="badge ${statusBadge}">${statusText}</span>
                </div>

                <div style="display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-xs) 0;">
                  <div class="icon-box" style="width: 42px; height: 42px; ${iconBoxStyle}">
                    <i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i>
                  </div>
                  
                  <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
                    <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
                      ${item.name}
                    </strong>
                    <p class="text-light text-xs" style="margin-bottom: 6px;">
                      ${item.description || 'Ready stock untuk operasional.'}
                    </p>
                    
                    <div style="display: flex; gap: var(--space-md); align-items: center;">
                      <span class="badge" style="${stockBadgeStyle} height: 22px; font-size: var(--text-xs); padding: 0 var(--space-sm);">
                        Stock: ${stockVal}${unitStr}
                      </span>
                      <span class="text-light text-xs">Min: ${minStockVal}${unitStr}</span>
                    </div>
                  </div>
                </div>

                <div class="list-card-footer">
                  ${isMenipis 
                    ? `<span style="color: var(--danger); font-size: var(--text-xs); font-weight: var(--font-medium);">Restock dibutuhkan</span>`
                    : `<span class="text-light text-xs">Stock terverifikasi aman</span>`
                  }
                  <button
                    class="detail-btn"
                    onclick="event.stopPropagation(); window.navigate('stock-detail')"
                  >
                    Detail
                  </button>
                </div>
              </div>
            `;
          }).join('');
        }

        // Re-aktivasi icon lucide setelah string HTML nancep di DOM
        if (window.lucide) window.lucide.createIcons();

        // Transisi meluncur masuk gais
        container.classList.remove("page-leave");
        container.classList.add("page-enter");

        requestAnimationFrame(() => {
          setTimeout(() => {
            container.classList.remove("page-enter");
          }, 50);
        });

      }, 150);
    };

    // ==========================================================================
    // MULTI-FILTER CONTROL (GABUNGAN SEARCH + TABS CHIPS)
    // ==========================================================================
    const applyFilterAndSearch = () => {
      const activeChip = document.querySelector(".filter-chip.active");
      const filterValue = activeChip ? activeChip.textContent.trim().toLowerCase() : "semua";
      const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";

      let filtered = allItems;

      // 1. Eksekusi Filter Berdasarkan Kategori / Kondisi Stok
      if (filterValue === "barang jadi") {
        filtered = allItems.filter(item => item.category === "roastedbean" || item.category === "kopi_bubuk");
      } else if (filterValue === "bahan baku") {
        filtered = allItems.filter(item => item.category === "greenbean");
      } else if (filterValue === "menipis") {
        filtered = allItems.filter(item => (item.stock || 0) <= (item.min_stock || 0));
      }

      // 2. Kombinasikan Dengan Keyword Pencarian Live
      if (searchQuery !== "") {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery));
      }

      renderList(filtered);
    };

    // Pemicu Render Pertama
    renderList(allItems);

    // Event Listener untuk Filter Chips (Klik Tab)
    chips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        chips.forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        applyFilterAndSearch();
      });
    });

    // Event Listener untuk Live Search Input (Ketik Otomatis)
    if (searchInput) {
      searchInput.addEventListener("input", applyFilterAndSearch);
    }

  }, 50);

  // Return layout murni sesuai mockup UI idaman lu gais!
  return `
    <section class="list-page"> 

      <div class="card search-box"> 
        <i data-lucide="search"></i>
        <input
          type="text"
          class="stock-search-input"
          placeholder="Cari stock..."
        />
      </div>

      <div class="filter-scroll"> 
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Barang Jadi</button>
        <button class="filter-chip">Bahan Baku</button>
        <button class="filter-chip">Menipis</button>
      </div>

      <div class="data-list stock-dynamic-list"> 
        <div style="display: flex; justify-content: center; padding: 40px; color: var(--text-light);">
          <p>Memuat data stock dari database...</p>
        </div>
      </div>

    </section>
  `;
}
