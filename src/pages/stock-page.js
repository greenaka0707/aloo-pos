import { supabase } from "../supabaseClient.js";

// ==========================================================================
// 1. FUNGSI AMBIL DATA STOCK DARI SUPABASE (PRODUCTS TABLE)
// ==========================================================================
async function getSupabaseStock() {
  try {
    const { data, error } = await supabase
      .from('products') 
      .select('id, name, category, stock, min_stock, unit, description')
      .order('stock', { ascending: true }); // Mengutamakan stok minus/habis/kritis di atas

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Gagal mengambil data stock dari Supabase:", error.message);
    return [];
  }
}

// ==========================================================================
// 2. CORE COMPONENT: STOCK PAGE (NAMED EXPORT)
// ==========================================================================
export function StockPage() {
  setTimeout(async () => {
    const container = document.querySelector(".stock-dynamic-list");
    const chips = document.querySelectorAll(".filter-chip");
    const searchInput = document.querySelector(".stock-search-input");
    const downloadBtn = document.querySelector(".download-stock-btn");

    if (!container) return;

    // Tarik data asli dari database
    const allItems = await getSupabaseStock();

    // ==========================================================================
    // ENGINE RENDERER DENGAN TRANSISI EMOSI WARNA STATUS (TOTAL OVERHAUL)
    // ==========================================================================
    const renderList = (itemsToRender) => {
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
            
            // A. Deteksi Kategori & Badge Warna Kalcer
            let categoryText = 'Lainnya';
            let categoryBadge = 'badge-primary';
            
            if (item.category === 'roastedbean' || item.category === 'kopi_bubuk') {
              categoryText = 'Barang Jadi';
              categoryBadge = 'badge-primary'; 
            } else if (item.category === 'greenbean') {
              categoryText = 'Bahan Baku';
              categoryBadge = 'badge-info';    
            }

            // B. BREAKDOWN EVALUASI STOK (Mencegah False Alarm Oranye Merata)
            const isHabis = stockVal <= 0;
            const isMenipis = stockVal > 0 && stockVal <= minStockVal;

            let statusBadge = 'badge-success';
            let statusText = 'Aman';
            let cardBorderColor = '';
            let footerText = '<span class="text-light text-xs">Stock terverifikasi aman</span>';
            let stockBadgeStyle = 'background: var(--bg); color: var(--text);';
            let iconBoxStyle = 'background: rgba(16, 185, 129, 0.1); color: #10B981;';
            let iconName = item.category === 'greenbean' ? 'package' : 'coffee';

            if (isHabis) {
              statusBadge = 'badge-danger';
              statusText = 'Habis';
              cardBorderColor = 'border-color: var(--danger);'; // Amuk border merah pekat gais
              stockBadgeStyle = 'background: var(--danger-soft); color: var(--danger); font-weight: var(--font-bold);';
              iconBoxStyle = 'background: var(--danger-soft); color: var(--danger);';
              iconName = 'alert-octagon'; // Ganti ikon darurat gais
              footerText = `<span style="color: var(--danger); font-size: var(--text-xs); font-weight: var(--font-bold);">🚨 Habis total! Segera restock</span>`;
            } else if (isMenipis) {
              statusBadge = 'badge-warning'; // Warna oranye kalem
              statusText = 'Menipis';
              cardBorderColor = 'border-color: var(--orange);';
              stockBadgeStyle = 'background: var(--orange-soft); color: var(--orange); font-weight: var(--font-bold);';
              iconBoxStyle = 'background: var(--orange-soft); color: var(--orange);';
              iconName = 'alert-triangle';
              footerText = `<span style="color: var(--orange); font-size: var(--text-xs); font-weight: var(--font-medium);">Restock dibutuhkan</span>`;
            }

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
                        Stock: ${stockVal} ${unitStr}
                      </span>
                      <span class="text-light text-xs">Min: ${minStockVal} ${unitStr}</span>
                    </div>
                  </div>
                </div>

                <div class="list-card-footer">
                  ${footerText}
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
    // LOGIC DOWNLOAD / EXPORT DATA KE CSV
    // ==========================================================================
    // ==========================================================================
// LOGIC DOWNLOAD / EXPORT DATA KE CSV (FIX EXCEL NUMPUK & DESIMAL)
// ==========================================================================
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    if (allItems.length === 0) return alert("Belum ada data untuk didownload gais!");
    
    // 1. KUNCI UTAMA: Tambahkan 'sep=;' di baris pertama agar Excel otomatis memisah kolom gais
    let csvContent = "data:text/csv;charset=utf-8,sep=;\n";
    
    // Header menggunakan pemisah titik koma (;)
    csvContent += "ID;Nama Barang;Kategori;Stok;Min Stok;Satuan\n";
    
    // 2. Loop baris konten dengan pemisah titik koma (;)
    allItems.forEach(item => {
      const stockVal = item.stock || 0;
      const minStockVal = item.min_stock || 0;

      // Konversi angka desimal ke format lokal (titik jadi koma: 1.5 -> 1,5) agar ramah Excel Indonesia
      const formattedStock = stockVal.toString().replace('.', ',');
      const formattedMinStock = minStockVal.toString().replace('.', ',');

      const row = [
        item.id,
        `"${item.name.replace(/"/g, '""')}"`, // Aman dari bug tanda kutip gais
        item.category,
        formattedStock,
        formattedMinStock,
        item.unit || 'kg'
      ].join(";"); // Gabungkan pakai titik koma
      
      csvContent += row + "\n";
    });

    // 3. Trigger download otomatis lewat DOM anchor virtual
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Stok_AlooPOS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

    // ==========================================================================
    // ENGINE FILTER & PENCARIAN LIVE
    // ==========================================================================
    const applyFilterAndSearch = () => {
      const activeChip = document.querySelector(".filter-chip.active");
      const filterValue = activeChip ? activeChip.textContent.trim().toLowerCase() : "semua";
      const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";

      let filtered = allItems;

      if (filterValue === "barang jadi") {
        filtered = allItems.filter(item => item.category === "roastedbean" || item.category === "kopi_bubuk");
      } else if (filterValue === "bahan baku") {
        filtered = allItems.filter(item => item.category === "greenbean");
      } else if (filterValue === "menipis") {
        // Filter menipis sekarang mencakup yang kritis di bawah batas minimum
        filtered = allItems.filter(item => (item.stock || 0) <= (item.min_stock || 0));
      }

      if (searchQuery !== "") {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery));
      }

      renderList(filtered);
    };

    renderList(allItems);

    chips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        chips.forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        applyFilterAndSearch();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilterAndSearch);
    }

  }, 50);

  // Layout mutakhir: Flex alignment baru untuk kolom search bar + tombol download ikonik
  return `
    <section class="list-page"> 

      <div style="display: flex; gap: var(--space-sm); align-items: center; width: 100%;">
        <div class="card search-box" style="flex: 1; margin: 0;"> 
          <i data-lucide="search"></i>
          <input
            type="text"
            class="stock-search-input"
            placeholder="Cari stock..."
          />
        </div>
        
        <button 
          class="card download-stock-btn" 
          style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg); border: 1px solid rgba(0,0,0,0.05); cursor: pointer; color: var(--text); border-radius: var(--radius-md); padding: 0;"
          title="Download Excel/CSV"
        >
          <i data-lucide="download" style="width: 20px; height: 20px;"></i>
        </button>
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
