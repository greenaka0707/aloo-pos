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

    // Tarik data asli dan realtime dari database Supabase gais
    const allItems = await getSupabaseStock();

    // ==========================================================================
    // ENGINE RENDERER DENGAN STRUKTUR CARD UNIFORM & TOMBOL PANAH
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
            const stockVal = parseFloat(item.stock || 0);
            const minStockVal = parseFloat(item.min_stock || 0);
            const unitStr = item.unit || 'kg';
            
            // Deteksi Kategori & Badge Warna Kalcer
            let categoryText = 'Lainnya';
            let categoryBadge = 'void';
            
            if (item.category === 'roastedbean' || item.category === 'kopi_bubuk') {
              categoryText = 'Barang Jadi';
              categoryBadge = 'diproses'; 
            } else if (item.category === 'greenbean') {
              categoryText = 'Bahan Baku';
              categoryBadge = 'ready';     
            }

            // Breakdown Evaluasi Stok
            const isHabis = stockVal <= 0;
            const isMenipis = stockVal > 0 && stockVal <= minStockVal;

            let statusBadge = 'dikirim';
            let statusText = 'Aman';
            let stockBadgeStyle = 'background: rgba(15,23,42,0.06); color: #0f172a;';

            if (isHabis) {
              statusBadge = 'pending'; // memakai skema warna warning/danger bawaan sistem
              statusText = 'Habis';
              stockBadgeStyle = 'background: rgba(251,191,36,0.12); color: #b45309; font-weight: 700;';
            } else if (isMenipis) {
              statusBadge = 'pending';
              statusText = 'Menipis';
              stockBadgeStyle = 'background: rgba(251,191,36,0.12); color: #b45309; font-weight: 700;';
            }

            return `
              <div class="list-card modern-order-card detail-trigger" data-id="${item.id}" style="cursor: pointer;">
                <div class="order-card-left">
                  
                  <div class="order-main-row">
                    <div class="order-title-group">
                      <span class="modern-status ${categoryBadge}" style="height: 24px;">${categoryText}</span>
                    </div>
                    <span class="modern-status ${statusBadge}">
                      ${statusText}
                    </span>
                  </div>

                  <div style="margin-top: 2px;">
                    <strong style="font-size: 15px; font-weight: 700; color: #0f172a; display: block;">
                      ${item.name}
                    </strong>
                    <p class="text-light text-xs" style="margin: 2px 0 6px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      ${item.description || 'Ready stock untuk operasional.'}
                    </p>
                  </div>

                  <div class="order-bottom-row" style="margin-top: 4px;">
                    <div style="display: flex; gap: 8px; align-items: center;">
                      <span class="modern-status" style="${stockBadgeStyle} height: 26px; padding: 0 10px; font-size: 12px; text-transform: none;">
                        Stok: ${stockVal.toFixed(2)} ${unitStr}
                      </span>
                      <span style="font-size: 11px; font-weight: 600; color: #94a3b8;">
                        Min: ${minStockVal.toFixed(2)} ${unitStr}
                      </span>
                    </div>
                    
                    <button class="order-arrow-btn">
                      <i data-lucide="arrow-up-right"></i>
                    </button>
                  </div>

                </div>
              </div>
            `;
          }).join('');
        }

        if (window.lucide) window.lucide.createIcons();

        // Pasang kembali event click handler navigasi serempak satu kartu penuh
        container.querySelectorAll(".detail-trigger").forEach(card => {
          card.addEventListener("click", (e) => {
            const currentTarget = e.currentTarget;
            const itemId = currentTarget.dataset.id;
            localStorage.setItem("selected_stock_id", itemId);
            if (window.navigate) window.navigate("stock-detail");
          });
        });

        container.classList.remove("page-leave");
        container.classList.add("page-enter");

        requestAnimationFrame(() => {
          setTimeout(() => { container.classList.remove("page-enter"); }, 50);
        });

      }, 150);
    };

    // ==========================================================================
    // EXPORT REALTIME KE PDF GUDANG (BRANDING PT EKSPANSI NUTRISI NUSANTARA)
    // ==========================================================================
    if (downloadBtn) {
      downloadBtn.addEventListener("click", async () => {
        const freshItems = await getSupabaseStock();
        if (freshItems.length === 0) return alert("Belum ada data di database Supabase lo gais!");
        
        const element = document.createElement("div");
        element.style.padding = "20px 15px";
        element.style.width = "750px"; 
        element.style.boxSizing = "border-box";
        element.style.fontFamily = "Arial, sans-serif";
        element.style.color = "#1F2937";
        element.style.backgroundColor = "#FFFFFF";

        let totalVolume = 0;
        let countKritis = 0;
        let countAman = 0;

        const tableRowsHtml = freshItems.map((item, idx) => {
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

        element.innerHTML = `
          <div style="border-bottom: 2px solid #F97316; padding-bottom: 10px; margin-bottom: 15px;">
            <h1 style="margin: 0; font-size: 22px; color: #1E293B; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">PT EKSPANSI NUTRISI NUSANTARA</h1>
            <div style="font-size: 11px; font-weight: 700; color: #F97316; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">Laporan Opname Stok Gudang</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; line-height: 1.4;">
            <tr>
              <td style="color: #6B7280; width: 15%;">Tanggal Cetak:</td>
              <td style="font-weight: 600; color: #111827; width: 35%;">: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td style="color: #6B7280; width: 15%;">Sistem Terkait:</td>
              <td style="font-weight: 600; color: #111827; width: 35%;">: Aloo POS</td>
            </tr>
            <tr>
              <td style="color: #6B7280;">Status Audit:</td>
              <td style="font-weight: 600; color: #111827;" colspan="3">: Terkoneksi Live (Supabase)</td>
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

          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px; margin-bottom: 35px;">
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
              <td style="text-align: center; width: 50%;"></td>
            </tr>
          </table>
        `;

        const opt = {
          margin:       10,
          filename:     `Laporan_Stok_Realtime_ENN.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        window.html2pdf().set(opt).from(element).save();
      });
    }

    // Engine Filter & Pencarian Live
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
        filtered = allItems.filter(item => (parseFloat(item.stock) || 0) <= (parseFloat(item.min_stock) || 0));
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

  /* ==========================================================================
     RETURN CLEAN TEMPLATE (SUDAH DISINKRONKAN DENGAN FORMULA CSS BARU)
     ========================================================================== */
  return `
    <section class="list-page"> 

      <div class="normal-search-row">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" class="stock-search-input" placeholder="Cari stock..." />
        </div>
        
        <button class="download-stock-btn download-sales-btn" title="Download Laporan PDF">
          <i data-lucide="download"></i>
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
