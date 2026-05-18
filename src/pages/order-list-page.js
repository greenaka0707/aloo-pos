import { supabase } from "../supabaseClient.js";

export function OrderListPage() {
  // State lokal untuk filter halaman harian
  let currentTab = "Semua";
  let searchQuery = "";
  let allOrders = [];

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

    // Capture elemen kontrol pencarian dan tab filter
    const searchInput = listPage.querySelector(".search-box input");
    const filterChips = listPage.querySelectorAll(".filter-chip");

    // ==========================================================================
    // 2. CORE ENGINE DATA: FETCH DATA REAL FROM SUPABASE (JOIN TABLE)
    // ==========================================================================
    async function fetchSalesOrders() {
      try {
        container.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-xl);">
            Memuat antrean orderan Supabase...
          </p>
        `;

        // Ambil data order induk sekalian join ke customer dan item detailnya
        const { data: orders, error } = await supabase
          .from("sales_orders")
          .select(`
            id,
            invoice_no,
            order_date,
            status,
            customers ( name ),
            sales_order_items ( qty )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        allOrders = orders || [];
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
      // Jalankan filter berdasarkan tab yang sedang aktif
      let filtered = allOrders;
      if (currentTab !== "Semua") {
        filtered = filtered.filter(o => o.status?.toLowerCase() === currentTab.toLowerCase());
      }

      // Jalankan filter berdasarkan query ketikan pencarian invoice/nama warung
      if (searchQuery) {
        filtered = filtered.filter(o => 
          o.invoice_no?.toLowerCase().includes(searchQuery) || 
          o.customers?.name?.toLowerCase().includes(searchQuery)
        );
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-xl);">
            Tidak ada transaksi sales order yang cocok.
          </p>
        `;
        return;
      }

      // Render baris data kartu ke dalam DOM list
      container.innerHTML = filtered.map(order => {
        // Hitung total jenis produk unik dan akumulasi berat kuantitas (kg)
        const totalItems = order.sales_order_items?.length || 0;
        const totalQty = order.sales_order_items?.reduce((acc, item) => acc + (parseFloat(item.qty) || 0), 0) || 0;

        // Konversi format tanggal bawaan DB ke Bahasa Indonesia harian
        let formattedDate = order.order_date;
        if (order.order_date) {
          const d = new Date(order.order_date);
          const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
          formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        // ==========================================================================
        // FIX UPDATE WARNA STATUS: DIKIRIM JADI HIJAU SUKSES, READY JADI BIRU PRIMER
        // ==========================================================================
        let badgeClass = "badge-warning"; // Default pending / butuh produksi harian
        const currentDbStatus = order.status ? order.status.toLowerCase() : "pending";

        if (currentDbStatus === "diproses") {
          badgeClass = "badge-info"; // Biru info proses
        } else if (currentDbStatus === "ready") {
          badgeClass = "badge-primary"; // Biru tua / cyan siap kirim
        } else if (currentDbStatus === "dikirim") {
          badgeClass = "badge-success"; // Hijau sukses tuntas kelar gais!
        }

        return `
          <div class="card list-card" style="margin-bottom: var(--space-sm);">
            <div class="list-card-top">
              <div>
                <h3 class="font-bold" style="color: var(--text);">${order.invoice_no}</h3>
                <p class="text-light text-sm">${order.customers?.name || "Tanpa Nama Customer"}</p>
              </div>
              <span class="badge ${badgeClass}" style="text-transform: capitalize;">${order.status || 'Pending'}</span>
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
              <span>${formattedDate}</span>
              <button
                class="btn btn-soft detail-btn" 
                style="color: var(--orange); background: var(--orange-soft); border: none;"
                data-id="${order.id}"
              >
                Detail
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Daftarkan event klik detail nota tanpa merusak fungsi router bawaan lo
      container.querySelectorAll(".detail-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const orderId = e.target.dataset.id;
          localStorage.setItem("selected_order_id", orderId);
          if (window.navigate) window.navigate("order-detail");
        });
      });

      if (window.lucide) window.lucide.createIcons();
    }

    // Event Input Kolom Cari Pencarian
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

    // Jalankan eksekusi penarikan data awal
    fetchSalesOrders();

  }, 50);

  return `
    <section class="list-page">

      <div class="card search-box">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Cari nama warung / nomor invoice order..." />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Pending</button>
        <button class="filter-chip">Diproses</button>
        <button class="filter-chip">Ready</button>
        <button class="filter-chip">Dikirim</button>
      </div>

      <div class="data-list"></div>

      <button
        class="fab-btn"
        onclick="window.navigate('create-order')"
      >
        <i data-lucide="plus"></i>
      </button>

    </section>
  `;
}
