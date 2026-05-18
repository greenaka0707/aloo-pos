import { supabase } from "../supabaseClient.js";

export function ProduksiListPage() {
  // State lokal untuk filter halaman harian produksi (MTO & MTS)
  let currentTab = "Semua";
  let searchQuery = "";
  let allProductions = [];

  setTimeout(async () => {
    const container = document.querySelector(".data-list");
    const listPage = document.querySelector(".list-page");
    const fab = document.querySelector(".fab-btn");

    // ==========================================================================
    // KUNCI AMAN: Sembunyikan FAB secara paksa sesuai aturan template lo
    // ==========================================================================
    if (fab) {
      fab.style.display = "none";
    }

    if (!listPage || !container) return;

    // Capture elemen kontrol pencarian dan chip filter dari template asli lo
    const searchInput = listPage.querySelector(".search-box input");
    const filterChips = listPage.querySelectorAll(".filter-chip");

    // ==========================================================================
    // 2. CORE ENGINE DATA: FETCH REAL PRODUCTION DATA (FIXED TO invoice_no)
    // ==========================================================================
    async function fetchProductions() {
      try {
        container.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-xl);">
            Memuat riwayat aktivitas roasting & blending...
          </p>
        `;

        // ✔️ FIXED: Ganti order_no ke invoice_no agar sinkron dengan kolom DB asli lo
        const { data: productions, error } = await supabase
          .from("productions")
          .select(`
            id,
            production_no,
            production_date,
            qty_produced,
            notes,
            sales_order_id,
            sales_orders ( invoice_no, status ),
            products ( name, unit ),
            production_ingredients (
              products ( name )
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        allProductions = productions || [];
        renderFilteredList();

      } catch (err) {
        container.innerHTML = `
          <p class="text-xs" style="text-align: center; padding: var(--space-xl); color: var(--danger);">
            ❌ Gagal memuat data produksi: ${err.message}
          </p>
        `;
      }
    }

    // ==========================================================================
    // 3. LOGIKA FILTER TAB STATUS & LIVE SEARCH (ANTI-KEYBOARD MENTAL)
    // ==========================================================================
    function renderFilteredList() {
      let filtered = allProductions;

      // Filter berdasarkan Tab Chip operasional harian lo
      if (currentTab !== "Semua") {
        filtered = filtered.filter(p => {
          // Jika produksi bersumber dari MTO, kita baca status rill dari sales ordernya
          let soStatus = p.sales_orders?.status?.toLowerCase() || "";
          
          if (currentTab === "Pending") return p.sales_order_id && soStatus === "butuh produksi";
          if (currentTab === "Diproses") return p.sales_order_id && soStatus === "proses produksi";
          if (currentTab === "Ready") return soStatus === "ready";
          if (currentTab === "Selesai") return soStatus === "selesai" || (!p.sales_order_id); // MTS langsung masuk selesai harian
          return false;
        });
      }

      // Filter berdasarkan nomor produksi, nama kopi matang, atau nomor invoice referensi
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.production_no?.toLowerCase().includes(searchQuery) || 
          p.products?.name?.toLowerCase().includes(searchQuery) ||
          p.sales_orders?.invoice_no?.toLowerCase().includes(searchQuery) // ✔️ FIXED: Ganti order_no ke invoice_no
        );
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-xl);">
            Tidak ada riwayat aktivitas produksi yang cocok.
          </p>
        `;
        return;
      }

      // Render baris data kartu ke dalam DOM list jiplak total desain visual lo
      container.innerHTML = filtered.map(p => {
        const pName = p.products?.name || "Produk Tidak Diketahui";
        const pUnit = p.products?.unit || "kg";
        // ✔️ FIXED: Mapping data dari p.sales_orders.invoice_no
        const refText = p.sales_orders?.invoice_no ? `Ref: ${p.sales_orders.invoice_no}` : "Produk Mandiri (MTS)";
        
        // Looper badge kecil-kecil komposisi bahan mentah yang habis dikonsumsi
        const ingredientsBadges = p.production_ingredients?.map(ing => {
          const matName = ing.products?.name || "Bahan Baku";
          return `
            <span class="badge" style="background: var(--bg); color: var(--text-light); font-weight: var(--font-medium); height: 22px; padding: 0 var(--space-sm);">
              ${matName}
            </span>
          `;
        }).join('') || `<span class="text-xs text-light">Tanpa info resep</span>`;

        // Konversi format tanggal bawaan DB ke Bahasa Indonesia harian
        let formattedDate = p.production_date;
        if (p.production_date) {
          const d = new Date(p.production_date);
          const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
          formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        // Tentukan lencana badge status visual penanda siklus produksi lo
        let badgeClass = "badge-success";
        let statusText = "Selesai";

        if (p.sales_orders?.status) {
          const soStatus = p.sales_orders.status.toLowerCase();
          if (soStatus === "butuh produksi") { badgeClass = "badge-warning"; statusText = "Pending"; }
          else if (soStatus === "proses produksi") { badgeClass = "badge-info"; statusText = "Diproses"; }
          else if (soStatus === "ready") { badgeClass = "badge-success"; statusText = "Ready"; }
        }

        return `
          <div class="card list-card" style="margin-bottom: var(--space-sm);">
            <div class="list-card-top">
              <div>
                <h3 class="font-bold">${p.production_no}</h3>
                <p class="text-light text-sm">${refText}</p>
              </div>
              <span class="badge ${badgeClass}">${statusText}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-xs) 0;">
              
              <div style="display: flex; align-items: center; gap: var(--space-md);">
                <div class="icon-box" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; background: var(--bg); border-radius: var(--radius-sm);"> 
                  <i data-lucide="factory" style="width: 16px; height: 16px; color: var(--text-light);"></i>
                </div>
                <div>
                  <strong class="font-semibold" style="font-size: var(--text-sm); display: block; color: var(--text);">
                    ${pName}
                  </strong>
                  <span class="text-light text-xs">Produksi ${p.qty_produced} ${pUnit}</span>
                </div>
              </div>

              <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                ${ingredientsBadges}
              </div>

            </div>

            <div class="list-card-footer">
              <span>${formattedDate}</span>
              <button
                class="btn btn-soft detail-btn"
                data-id="${p.id}"
              >
                Detail
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Pasang event klik simpan ID untuk dilempar ke halaman detail produksi nanti
      container.querySelectorAll(".detail-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const prodId = e.target.dataset.id;
          localStorage.setItem("selected_production_id", prodId);
          if (window.navigate) window.navigate("produksi-detail");
        });
      });

      if (window.lucide) window.lucide.createIcons();
    }

    // Event Input Live Search
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderFilteredList();
      });
    }

    // Event Klik Filter Chip Tab
    filterChips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        filterChips.forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        currentTab = e.target.textContent.trim();
        renderFilteredList();
      });
    });

    // Jalankan tarikan data awal
    fetchProductions();

  }, 50);

  return `
    <section class="list-page"> 

      <div class="card search-box">
        <i data-lucide="search"></i>
        <input
          type="text"
          placeholder="Cari nomor produksi atau nama kopi..."
        />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Pending</button>
        <button class="filter-chip">Diproses</button>
        <button class="filter-chip">Ready</button>
        <button class="filter-chip">Selesai</button>
      </div>

      <div class="data-list"></div>

    </section>
  `;
}
