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
    // 💥 UPGRADE ENGINE: EXPORT MURNI KE PDF DENGAN LAYOUT PREMIUM A4 (html2pdf)
    // ==========================================================================
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        if (allItems.length === 0) return alert("Belum ada data untuk didownload gais!");
        
        // Buat DOM container virtual terpisah untuk dokumen cetak A4
        const element = document.createElement("div");
        element.style.padding = "20px 15px";
        element.style.width = "750px"; // Presisi proporsional lebar kertas A4 gais
        element.style.boxSizing = "border-box";
        element.style.fontFamily = "Arial, sans-serif";
        element.style.color = "#1F2937";
        element.style.backgroundColor = "#FFFFFF";

        // Hitung akumulasi kalkulasi footer data realtime
        let totalVolume = 0;
        let countKritis = 0;
        let countAman = 0;

        const tableRowsHtml = allItems.map((item, idx) => {
          const stockVal = parseFloat(item.stock || 0);
          const minStockVal = parseFloat(item.min_stock || 0);
          totalVolume += stockVal;

          const isHabis = stockVal <= 0;
          const isMenipis = stockVal > 0 && stockVal <= minStockVal;

          let badgeColor = "#D1FAE5; color: #065F46;";
          let badgeText = "Aman";

          if (isHabis) {
            badgeColor = "#FEE2E2; color: #991B1B;";
            badgeText = "Minus/Habis";
            countKritis++;
          } else if (isMenipis) {
            badgeColor = "#FEF3C7; color: #92400E;";
            badgeText = "Menipis";
            countKritis++;
          } else {
            countAman++;
          }

          return `
            <tr style="border-bottom: 1px solid #E5E7EB; font-size: 11px;">
              <td style="padding: 8px; text-align: center; font-weight: bold; color: #4B5563;">${idx + 1}</td>
              <td style="padding: 8px; font-weight: bold; color: #111827;">${item.name}</td>
              <td style="padding: 8px; color: #4B5563; text-transform: uppercase; font-size: 10px;">${item.category || 'Lainnya'}</td>
              <td style="padding: 8px; text-align: right; font-weight: bold; color: ${stockVal <= 0 ? '#DC2626' : '#111827'};">
                ${stockVal.toFixed(2)} ${item.unit || 'kg'}
              </td>
              <td style="padding: 8px; text-align: right; color: #6B7280;">${minStockVal.toFixed(2)} ${item.unit || 'kg'}</td>
              <td style="padding: 8px; text-align: center;">
                <span style="display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: bold; border-radius: 4px; background: ${badgeColor}">
                  ${badgeText}
                </span>
              </td>
            </tr>
          `;
        }).join('');

        // Suntik struktur template laporan murni ke DOM virtual gais
        element.innerHTML = `
          <div style="border-bottom: 2px solid #F97316; padding-bottom: 10px; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 24px; color: #1E293B; font-weight: 800; letter-spacing: -0.5px;">PT PRABHASKOE</h1>
            <div style="font-size: 11px; font-weight: 700; color: #F97316; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">Laporan Opname Stok Gudang (Realtime)</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; line-height: 1.4;">
            <tr>
              <td style="color: #6B7280; width: 15%;">Tanggal Cetak:</td>
              <td style="font-weight: 600; color: #111827; width: 35%;">: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td style="color: #6B7280; width: 15%;">Sistem Terkait:</td>
              <td style="font-weight: 600; color: #111827; width: 35%;">: ERP POS Gudang</td>
            </tr>
            <tr>
              <td style="color: #6B7280;">Status Audit:</td>
              <td style="font-weight: 600; color: #111827;">: Sinkronisasi Supabase Selesai</td>
              <td style="color: #6B7280;">Otoritas:</td>
              <td style="font-weight: 600; color: #F97316;">: Owner Terverifikasi</td>
            </tr>
          </table>

          <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; border: 1px solid #E5E7EB;">
            <thead>
              <tr style="background-color: #1E293B; color: #FFFFFF;">
                <th style="padding: 8px; text-align: center; font-weight: bold; width: 40px;">NO</th>
                <th style="padding: 8px; text-align: left; font-weight: bold;">NAMA ITEM / VARIAN KOPI</th>
                <th style="padding: 8px; text-align: left; font-weight: bold; width: 110px;">KATEGORI</th>
                <th style="padding: 8px; text-align: right; font-weight: bold; width: 100px;">STOK FISIK</th>
                <th style="padding: 8px; text-align: right; font-weight: bold; width: 90px;">MIN STOK</th>
                <th style="padding: 8px; text-align: center; font-weight: bold; width: 90px;">STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>

          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px; margin-bottom: 30px;">
            <div style="font-size: 11px; font-weight: bold; color: #1E293B; text-transform: uppercase; margin-bottom: 6px;">Ringkasan Evaluasi Timbangan Gudang</div>
            <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 32%;">
                  <span style="font-size: 9px; color: #64748B; display: block;">Total Volume Stok</span>
                  <strong style="font-size: 13px; color: #0F172A;">${totalVolume.toFixed(2)} kg</strong>
                </td>
                <td style="width: 2%;"></td>
                <td style="padding: 4px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 32%;">
                  <span style="font-size: 9px; color: #64748B; display: block;">Item Kritis/Menipis</span>
                  <strong style="font-size: 13px; color: #DC2626;">${countKritis} Varian</strong>
                </td>
                <td style="width: 2%;"></td>
                <td style="padding: 4px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 32%;">
                  <span style="font-size: 9px; color: #64748B; display: block;">Item Status Aman</span>
                  <strong style="font-size: 13px; color: #166534;">${countAman} Varian</strong>
                </td>
              </tr>
            </table>
          </div>

          <table style="width: 100%; font-size: 11px; margin-top: 15px;">
            <tr>
              <td style="text-align: center; width: 50%;">
                <p style="margin: 0;">Dilaporkan Oleh,</p>
                <br><br><br>
                <strong style="text-decoration: underline; color: #111827;">Staff Lapangan Gudang</strong>
              </td>
              <td style="text-align: center; width: 50%;">
                <p style="margin: 0;">Disetujui Oleh,</p>
                <br><br><br>
                <strong style="text-decoration: underline; color: #111827;">Agus Setiawan (Owner)</strong>
              </td>
            </tr>
          </table>
        `;

        const opt = {
          margin:       10,
          filename:     `Laporan_Opname_Stok_AlooPOS_${new Date().toISOString().split('T')[0]}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Pemicu download murni dokumen PDF gais
        window.html2pdf().set(opt).from(element).save();
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
          title="Download Laporan PDF"
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
