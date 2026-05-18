import { supabase } from "../supabaseClient.js";

export function PurchaseListPage() {
  // State lokal untuk filter halaman harian
  let currentTab = "Semua";
  let searchQuery = "";
  let allPurchases = [];

  setTimeout(async () => {
    const container = document.querySelector(".data-list");
    const fab = document.querySelector(".fab-btn");
    const appLayout = document.querySelector(".app-layout");
    const listPage = document.querySelector(".list-page");

    // ==========================================================================
    // 1. FIXED STICKY FAB CONTROL
    // ==========================================================================
    if (fab && appLayout) {
      fab.style.display = "flex"; 
      if (fab.parentElement !== appLayout) {
        appLayout.appendChild(fab);
      }
    }

    if (!listPage || !container) return;

    // Capture elemen kontrol pencarian dan tab filter bawaan lo
    const searchInput = listPage.querySelector(".search-box input");
    const filterChips = listPage.querySelectorAll(".filter-chip");

    // ==========================================================================
    // 2. CORE ENGINE DATA: FETCH REAL DATA FROM SUPABASE (MULTI-JOIN)
    // ==========================================================================
    async function fetchPurchaseOrders() {
      try {
        container.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-xl);">
            Memuat antrean nota pembelian Supabase...
          </p>
        `;

        // Ambil data purchase sekalian join ke supplier dan item detailnya
        const { data: purchases, error } = await supabase
          .from("purchase_orders")
          .select(`
            id,
            purchase_no,
            purchase_date,
            status,
            total_amount,
            suppliers ( name ),
            purchase_order_items ( qty )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        allPurchases = purchases || [];
        renderFilteredList();

      } catch (err) {
        container.innerHTML = `
          <p class="text-xs" style="text-align: center; padding: var(--space-xl); color: var(--danger);">
            ❌ Gagal memuat data: ${err.message}
          </p>
        `;
      }
    }

    // ==========================================================================
    // 3. LOGIKA FILTER TAB & LIVE SEARCH (ANTI RE-RENDER INPUT FOCUS)
    // ==========================================================================
    function renderFilteredList() {
      let filtered = allPurchases;

      // Filter berdasarkan Tab Chip operasional harian
      if (currentTab !== "Semua") {
        filtered = filtered.filter(p => {
          let dbStatus = p.status?.toLowerCase();
          if (currentTab === "Pending") return dbStatus === "ordered";
          if (currentTab === "Diterima") return dbStatus === "received";
          if (currentTab === "Void") return dbStatus === "void";
          return false;
        });
      }

      // Filter berdasarkan live search ketikan nomor nota / nama supplier
      if (searchQuery) {
        filtered = filtered.filter(p => 
          p.purchase_no?.toLowerCase().includes(searchQuery) || 
          p.suppliers?.name?.toLowerCase().includes(searchQuery)
        );
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-xl);">
            Tidak ada transaksi purchase order yang cocok.
          </p>
        `;
        return;
      }

      // Render baris data kartu ke dalam DOM list sesuai visual lo
      container.innerHTML = filtered.map(po => {
        const totalItems = po.purchase_order_items?.length || 0;
        const totalQty = po.purchase_order_items?.reduce((acc, item) => acc + (parseFloat(item.qty) || 0), 0) || 0;

        // Konversi format tanggal bawaan DB ke Bahasa Indonesia harian
        let formattedDate = po.purchase_date;
        if (po.purchase_date) {
          const d = new Date(po.purchase_date);
          const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
          formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        // Tentukan lencana badge status visual
        let badgeClass = "badge-warning"; 
        let statusText = "Pending";
        if (po.status === "received") { badgeClass = "badge-success"; statusText = "Diterima"; }
        if (po.status === "void") { badgeClass = "badge-danger"; statusText = "Void"; }

        return `
          <div class="card list-card" style="margin-bottom: var(--space-sm);">
            <div class="list-card-top">
              <div>
                <h3 class="font-bold">${po.purchase_no}</h3>
                <p class="text-light text-sm">${po.suppliers?.name || "Tanpa Nama Supplier"}</p>
              </div>
              <span class="badge ${badgeClass}">${statusText}</span>
            </div>

            <div class="list-card-summary">
              <div class="list-card-summary-item">
                <span>Total Item</span>
                <strong>${totalItems} Produk</strong>
              </div>
              <div class="list-card-summary-item">
                <span>Qty</span>
                <strong>${totalQty} kg</strong>
              </div>
            </div>

            <div class="list-card-footer">
              <div>
                <strong style="color: var(--orange); font-size: var(--text-md); display: block; font-weight: var(--font-bold);">
                  Rp ${(po.total_amount || 0).toLocaleString('id-ID')}
                </strong>
                <p class="text-light text-xs" style="margin-top: 1px;">
                  ${formattedDate}
                </p>
              </div>

              <button
                class="btn btn-soft detail-btn"
                data-id="${po.id}"
              >
                Detail
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Daftarkan event klik detail nota tanpa ngerusak fungsi router bawaan lo
      container.querySelectorAll(".detail-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const purchaseId = e.target.dataset.id;
          localStorage.setItem("selected_purchase_id", purchaseId);
          if (window.navigate) window.navigate("purchase-detail");
        });
      });

      if (window.lucide) window.lucide.createIcons();
    }

    // Event Input Kolom Pencarian
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderFilteredList();
      });
    }

    // Event Klik Filter Chip Tab Kategori harian
    filterChips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        filterChips.forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        currentTab = e.target.textContent.trim();
        renderFilteredList();
      });
    });

    // Jalankan eksekusi data awal
    fetchPurchaseOrders();

  }, 50);

  return `
    <section class="list-page">

      <div class="card search-box">
        <i data-lucide="search"></i>
        <input
          type="text"
          placeholder="Cari nomor PO atau nama supplier..."
        />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Pending</button>
        <button class="filter-chip">Diterima</button>
        <button class="filter-chip">Partial</button>
        <button class="filter-chip">Void</button>
      </div>

      <div class="data-list"></div>

      <button
        class="fab-btn"
        onclick="window.navigate('create-purchase')"
      >
        <i data-lucide="plus"></i>
      </button>

    </section>
  `;
}
