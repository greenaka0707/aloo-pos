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
    // 2. CORE ENGINE DATA: FETCH REAL PRODUCTION DATA (+ CUSTOMER NAME)
    // ==========================================================================
    async function fetchProductions() {
      try {
        container.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-xl);">
            Memuat riwayat aktivitas roasting & blending...
          </p>
        `;

        // ✔️ UPDATE: Ambil customer_name dari relasi sales_orders
        const { data: productions, error } = await supabase
          .from("productions")
          .select(`
            id,
            production_no,
            production_date,
            qty_produced,
            notes,
            sales_order_id,
            sales_orders ( invoice_no, status, customer_name ),
            products ( name, unit )
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
          let soStatus = p.sales_orders?.status?.toLowerCase() || "";
          
          if (currentTab === "Pending") return p.sales_order_id && soStatus === "butuh produksi";
          if (currentTab === "Diproses") return p.sales_order_id && soStatus === "proses produksi";
          if (currentTab === "Ready") return soStatus === "ready";
          if (currentTab === "Selesai") return soStatus === "selesai" || (!p.sales_order_id);
          return false;
        });
      }

      // Filter berdasarkan nomor produksi, nama customer, nama kopi, atau nomor invoice
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.production_no?.toLowerCase().includes(searchQuery) || 
          p.products?.name?.toLowerCase().includes(searchQuery) ||
          p.sales_orders?.customer_name?.toLowerCase().includes(searchQuery) || // ✔️ LIVE SEARCH UNTUK NAMA CUSTOMER
          p.sales_orders?.invoice_no?.toLowerCase().includes(searchQuery)
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

      // ==========================================================================
      // RENDER CARD KARTU - RE-ARRANGE: NAMA CUSTOMER DI ATAS
      // ==========================================================================
      container.innerHTML = filtered.map(p => {
        const pName = p.products?.name || "Produk Tidak Diketahui";
        const pUnit = p.products?.unit || "kg";
        
        // ✔️ Tentukan Identitas Atas: Nama Customer (MTO) atau Produksi Mandiri (MTS)
        const topTitle = p.sales_orders?.customer_name || "Produksi Mandiri (MTS)";
        const refText = p.sales_orders?.invoice_no ? `Ref: ${p.sales_orders.invoice_no}` : `No. Prod: ${p.production_no}`;
        
        // Konversi format tanggal bawaan DB ke Bahasa Indonesia harian
        let formattedDate = p.production_date;
        if (p.production_date) {
          const d = new Date(p.production_date);
          const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
          formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        // Sinkronisasi class badge status visual dengan gaya uniform aplikasi
        let badgeClass = "void";
        let statusText = "Selesai";

        if (p.sales_orders?.status) {
          const soStatus = p.sales_orders.status.toLowerCase();
          if (soStatus === "butuh produksi") { badgeClass = "pending"; statusText = "Pending"; }
          else if (soStatus === "proses produksi") { badgeClass = "diproses"; statusText = "Diproses"; }
          else if (soStatus === "ready") { badgeClass = "ready"; statusText = "Ready"; }
        }

        return `
          <div class="list-card modern-order-card">
            <div class="order-card-left">
              
              <div class="order-main-row">
                <div class="order-title-group">
                  <h3>${topTitle}</h3>
                  <p class="order-ref">${refText}</p>
                </div>
                <span class="modern-status ${badgeClass}">
                  ${statusText}
                </span>
              </div>

              <div style="margin-top: 2px;">
                <strong style="font-size: 14px; font-weight: 700; color: #0f172a; display: block;">
                  ${pName}
                </strong>
                <span style="font-size: 12px; color: #64748b; font-weight: 500;">
                  Produksi ${p.qty_produced} ${pUnit}
                </span>
              </div>

              <div class="order-bottom-row" style="margin-top: 6px;">
                <span style="font-size: 13px; font-weight: 600; color: #64748b;">
                  ${formattedDate}
                </span>
                <button 
                  class="order-arrow-btn detail-btn" 
                  data-id="${p.id}"
                >
                  <i data-lucide="arrow-up-right"></i>
                </button>
              </div>

            </div>
          </div>
        `;
      }).join('');

      // Pasang event klik simpan ID untuk dilempar ke halaman detail produksi
      container.querySelectorAll(".detail-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const currentTarget = e.currentTarget;
          const prodId = currentTarget.dataset.id;
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

      <div class="normal-search-row">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input
            type="text"
            placeholder="Cari customer, nomor produksi atau nama kopi..."
          />
        </div>
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
