import { supabase } from "../supabaseClient.js";

// 1. Ambil data stok langsung dari tabel products
async function getSupabaseStock() {
  try {
    const { data, error } = await supabase
      .from('products') 
      .select('id, name, category, stock, min_stock, unit, description, updated_at')
      .order('stock', { ascending: true }); // Biar yang kritis/menipis naik ke atas

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Gagal mengambil data stok:", error.message);
    return [];
  }
}

export default function StockPage() {
  setTimeout(async () => {
    const container = document.querySelector(".stock-dynamic-list");
    const chips = document.querySelectorAll(".filter-chip");
    const searchInput = document.querySelector(".stock-search-input");

    if (!container) return;

    // Tarik data utama dari backend
    const allItems = await getSupabaseStock();

    // Helper format tanggal (Misal: 15 Mei 2026)
    const formatDate = (dateString) => {
      if (!dateString) return 'Baru saja';
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // ==========================================================================
    // LOGIC RENDER LIST (ANIMASI SLIDE & DATA DINAMIS)
    // ==========================================================================
    const renderList = (itemsToRender) => {
      container.classList.add("page-leave");

      setTimeout(() => {
        if (itemsToRender.length === 0) {
          container.innerHTML = `
            <div class="card" style="padding: 24px; text-align: center; color: var(--text-light);">
              Tidak ada data stock yang cocok.
            </div>
          `;
        } else {
          container.innerHTML = itemsToRender.map(item => {
            const stockVal = item.stock || 0;
            const minStockVal = item.min_stock || 0;
            const unitStr = item.unit || 'kg';
            
            // 1. Mapping Kategori & Warna Badge Kategori
            let categoryText = 'Lainnya';
            let categoryBadge = 'badge-primary';
            
            if (item.category === 'roastedbean' || item.category === 'kopi_bubuk') {
              categoryText = 'Barang Jadi';
              categoryBadge = 'badge-primary';
            } else if (item.category === 'greenbean') {
              categoryText = 'Bahan Baku';
              categoryBadge = 'badge-info';
            }

            // 2. Logic Status Kelayakan Stok (Aman vs Menipis)
            const isMenipis = stockVal <= minStockVal;
            const statusBadge = isMenipis ? 'badge-danger' : 'badge-success';
            const statusText = isMenipis ? 'Menipis' : 'Aman';
            
            // 3. Styling Card & Icon Berdasarkan Kondisi Stok
            const cardBorderColor = isMenipis ? 'border-color: var(--orange);' : '';
            const iconBoxStyle = isMenipis 
              ? 'background: var(--orange-soft); color: var(--orange);' 
              : 'background: rgba(16, 185, 129, 0.1); color: #10B981;';
            const iconName = item.category === 'greenbean' ? 'package' : 'coffee';

            // 4. Badge Angka Stok Dinamis
            const stockBadgeStyle = isMenipis
              ? 'background: var(--danger-soft); color: var(--danger); font-weight: var(--font-bold);'
              : 'background: var(--bg); color: var(--text);';

            return `
              <div
                class="card list-card" 
                onclick="window.navigate('stock-detail?id=${item.id}')"
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
                      ${item.description || 'Tidak ada keterangan.'}
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
                    : `<span class="text-light text-xs">Updated ${formatDate(item.updated_at)}</span>`
                  }
                  <button
                    class="detail-btn"
                    onclick="event.stopPropagation(); window.navigate('stock-detail?id=${item.id}')"
                  >
                    Detail
                  </button>
                </div>
              </div>
            `;
          }).join('');
        }

        if (window.lucide) window.lucide.createIcons();

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
    // LOGIC FILTER GABUNGAN (SEARCH + CHIPS)
    // ==========================================================================
    const applyFilterAndSearch = () => {
      const activeChip = document.querySelector(".filter-chip.active");
      const filterValue = activeChip ? activeChip.textContent.trim().toLowerCase() : "semua";
      const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";

      let filtered = allItems;

      // 1. Filter Chips Logic
      if (filterValue === "barang jadi") {
        filtered = allItems.filter(item => item.category === "roastedbean" || item.category === "kopi_bubuk");
      } else if (filterValue === "bahan baku") {
        filtered = allItems.filter(item => item.category === "greenbean");
      } else if (filterValue === "menipis") {
        filtered = allItems.filter(item => (item.stock || 0) <= (item.min_stock || 0));
      }

      // 2. Filter Search Logic
      if (searchQuery !== "") {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery));
      }

      renderList(filtered);
    };

    // Jalankan render awal
    renderList(allItems);

    // Event handler klik filter chips
    chips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        chips.forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        applyFilterAndSearch();
      });
    });

    // Event handler ketik live search
    if (searchInput) {
      searchInput.addEventListener("input", applyFilterAndSearch);
    }

  }, 50);

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

      <!-- Container Utama yang Sekarang Diisi Secara Dinamis -->
      <div class="data-list stock-dynamic-list"> 
        <div style="display: flex; justify-content: center; padding: 40px; color: var(--text-light);">
          <p>Memuat data stock dari database...</p>
        </div>
      </div>

    </section>
  `;
}
