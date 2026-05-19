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

    // Capture elemen kontrol pencarian, tab filter, dan tombol cetak baru gais
    const searchInput = listPage.querySelector(".stock-search-input");
    const filterChips = listPage.querySelectorAll(".filter-chip");
    const downloadSalesBtn = listPage.querySelector(".download-sales-btn");

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

        const { data: orders, error } = await supabase
          .from("sales_orders")
          .select(`
            id,
            invoice_no,
            order_date,
            status,
            total_amount,
            net_amount,
            payment_method,
            created_at,
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
      let filtered = allOrders;
      if (currentTab !== "Semua") {
        filtered = filtered.filter(o => o.status?.toLowerCase() === currentTab.toLowerCase());
      }

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

      container.innerHTML = filtered.map(order => {
        const totalItems = order.sales_order_items?.length || 0;
        
        // 🛠️ FIX DESIMAL: parsing float akumulasi total kuantitas orderan gais
        const totalQty = order.sales_order_items?.reduce((acc, item) => acc + (parseFloat(item.qty) || 0), 0) || 0;

        let formattedDate = order.order_date;
        if (order.order_date) {
          const d = new Date(order.order_date);
          const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
          formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        let badgeClass = "badge-warning"; 
        let inlineStyle = ""; 
        const currentDbStatus = order.status ? order.status.toLowerCase() : "pending";

        if (currentDbStatus === "diproses") {
          badgeClass = "badge-info"; 
        } else if (currentDbStatus === "ready") {
          badgeClass = "badge-primary"; 
        } else if (currentDbStatus === "dikirim") {
          badgeClass = "badge-success"; 
        } else if (currentDbStatus === "void") {
          badgeClass = "badge-muted"; 
          inlineStyle = "background: #9CA3AF; color: #FFFFFF;"; 
        }

        return `
          <div class="card list-card" style="margin-bottom: var(--space-sm); ${currentDbStatus === 'void' ? 'opacity: 0.85;' : ''}">
            <div class="list-card-top">
              <div>
                <h3 class="font-bold" style="color: var(--text);">${order.invoice_no}</h3>
                <p class="text-light text-sm">${order.customers?.name || "Tanpa Nama Customer"}</p>
              </div>
              <span class="badge ${badgeClass}" style="text-transform: capitalize; ${inlineStyle}">${order.status || 'Pending'}</span>
            </div>

            <div class="list-card-summary">
              <div class="list-card-summary-item">
                <span>Total Item</span>
                <strong>${totalItems} Produk</strong>
              </div>
              <div class="list-card-summary-item">
                <span>Qty</span>
                <strong>${totalQty.toFixed(2)} kg</strong>
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

      container.querySelectorAll(".detail-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const orderId = e.target.dataset.id;
          localStorage.setItem("selected_order_id", orderId);
          if (window.navigate) window.navigate("order-detail");
        });
      });

      if (window.lucide) window.lucide.createIcons();
    }

    // ==========================================================================
    // 💥 ENGINE BARU: GENERATE PDF PENJUALAN HARIAN ENN (LIVE SUPABASE)
    // ==========================================================================
    if (downloadSalesBtn) {
      downloadSalesBtn.addEventListener("click", async () => {
        // Tarik range awal hari ini murni (Waktu Lokal Indonesia)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isoToday = today.toISOString();

        try {
          // Tarik data paling fresh khusus hari ini gais
          const { data: freshOrders, error } = await supabase
            .from("sales_orders")
            .select(`
              id,
              invoice_no,
              created_at,
              status,
              total_amount,
              net_amount,
              payment_method,
              customers ( name )
            `)
            .gte("created_at", isoToday)
            .neq("status", "void") 
            .order("created_at", { ascending: false });

          if (error) throw error;
          if (!freshOrders || freshOrders.length === 0) {
            return alert("☕ Belum ada transaksi penjualan yang sah masuk hari ini gais!");
          }

          const element = document.createElement("div");
          element.style.padding = "20px 15px";
          element.style.width = "750px"; 
          element.style.boxSizing = "border-box";
          element.style.fontFamily = "Arial, sans-serif";
          element.style.color = "#1F2937";
          element.style.backgroundColor = "#FFFFFF";

          let totalOmzet = 0;
          let totalCash = 0;
          let totalTransfer = 0;
          let totalPiutang = 0;

          const tableRowsHtml = freshOrders.map((o, idx) => {
            const gross = parseFloat(o.total_amount || 0);
            const debt = parseFloat(o.net_amount || 0);
            const paid = gross - debt;
            const method = o.payment_method ? o.payment_method.toUpperCase() : 'CASH';
            const custName = o.customers ? o.customers.name : "Warung Umum";
            const timeStr = new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            totalOmzet += gross;
            totalPiutang += debt;
            if (method === 'CASH') totalCash += paid;
            else totalTransfer += paid;

          return `
            <tr style="border-bottom: 1px solid #E5E7EB; font-size: 11px;">
              <td style="padding: 8px; text-align: center; color: #4B5563;">${idx + 1}</td>
              <td style="padding: 8px; font-weight: bold; color: #111827;">${o.invoice_no}<br><span style="font-size:9px; color:#6B7280; font-weight:normal;">Jam ${timeStr}</span></td>
              <td style="padding: 8px; color: #111827; font-weight:600;">${custName}</td>
              <td style="padding: 8px; text-align: center; font-weight: bold; color: #4B5563;">${method}</td>
              <td style="padding: 8px; text-align: right; font-weight: bold; color: #111827;">Rp ${gross.toLocaleString('id-ID')}</td>
              <td style="padding: 8px; text-align: right; font-weight: bold; color: #DC2626;">Rp ${debt.toLocaleString('id-ID')}</td>
              <td style="padding: 8px; text-align: right; font-weight: bold; color: #166534;">Rp ${paid.toLocaleString('id-ID')}</td>
            </tr>
          `;
        }).join('');

          element.innerHTML = `
            <div style="border-bottom: 2px solid #F97316; padding-bottom: 10px; margin-bottom: 15px;">
              <h1 style="margin: 0; font-size: 22px; color: #1E293B; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">PT EKSPANSI NUTRISI NUSANTARA</h1>
              <div style="font-size: 11px; font-weight: 700; color: #F97316; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">Laporan Penjualan Harian</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; line-height: 1.4;">
              <tr>
                <td style="color: #6B7280; width: 15%;">Tanggal Cetak:</td>
                <td style="font-weight: 600; color: #111827; width: 35%;">: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                <td style="color: #6B7280; width: 15%;">Sistem Terkait:</td>
                <td style="font-weight: 600; color: #111827; width: 35%;">: Aloo POS</td>
              </tr>
              <tr>
                <td style="color: #6B7280;">Status Finansial:</td>
                <td style="font-weight: 600; color: #111827;" colspan="3">: Terkoneksi Live (Supabase)</td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; border: 1px solid #E5E7EB;">
              <thead>
                <tr style="background-color: #1E293B; color: #FFFFFF;">
                  <th style="padding: 8px; text-align: center; font-weight: bold; width: 35px;">NO</th>
                  <th style="padding: 8px; text-align: left; font-weight: bold; width: 110px;">NO INVOICE</th>
                  <th style="padding: 8px; text-align: left; font-weight: bold;">NAMA PELANGGAN</th>
                  <th style="padding: 8px; text-align: center; font-weight: bold; width: 80px;">METODE</th>
                  <th style="padding: 8px; text-align: right; font-weight: bold; width: 100px;">TOTAL NOTA</th>
                  <th style="padding: 8px; text-align: right; font-weight: bold; width: 100px;">PIUTANG</th>
                  <th style="padding: 8px; text-align: right; font-weight: bold; width: 100px;">KAS MASUK</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHtml}
              </tbody>
            </table>

            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px; margin-bottom: 35px;">
              <div style="font-size: 11px; font-weight: bold; color: #1E293B; text-transform: uppercase; margin-bottom: 8px;">Ringkasan Setoran Buku Kas Harian</div>
              <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 23%;">
                    <span style="font-size: 9px; color: #64748B; display: block;">Total Omzet Kotor</span>
                    <strong style="font-size: 11px; color: #0F172A;">Rp ${totalOmzet.toLocaleString('id-ID')}</strong>
                  </td>
                  <td style="width: 2%;"></td>
                  <td style="padding: 6px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 23%;">
                    <span style="font-size: 9px; color: #64748B; display: block;">Total Kas Cash Diterima</span>
                    <strong style="font-size: 11px; color: #166534;">Rp ${totalCash.toLocaleString('id-ID')}</strong>
                  </td>
                  <td style="width: 2%;"></td>
                  <td style="padding: 6px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 23%;">
                    <span style="font-size: 9px; color: #64748B; display: block;">Total Kas Transfer/QRIS</span>
                    <strong style="font-size: 11px; color: #0284C7;">Rp ${totalTransfer.toLocaleString('id-ID')}</strong>
                  </td>
                  <td style="width: 2%;"></td>
                  <td style="padding: 6px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 23%;">
                    <span style="font-size: 9px; color: #64748B; display: block;">Piutang Lapangan Tertahan</span>
                    <strong style="font-size: 11px; color: #DC2626;">Rp ${totalPiutang.toLocaleString('id-ID')}</strong>
                  </td>
                </tr>
              </table>
            </div>

            <table style="width: 100%; font-size: 11px; margin-top: 20px;">
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
            filename:     `Laporan_Penjualan_Harian_ENN_${new Date().toISOString().split('T')[0]}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          window.html2pdf().set(opt).from(element).save();

        } catch (err) {
          alert("❌ Gagal mencetak laporan penjualan: " + err.message);
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderFilteredList();
      });
    }

    filterChips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        filterChips.forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        currentTab = e.target.textContent.trim();
        renderFilteredList();
      });
    });

    fetchSalesOrders();

  }, 50);

  return `
    <section class="list-page">

      <div style="display: flex; gap: var(--space-sm); align-items: center; width: 100%;">
        <div class="card search-box" style="flex: 1; margin: 0;">
          <i data-lucide="search"></i>
          <input type="text" class="stock-search-input" placeholder="Cari nama warung / nomor invoice order..." />
        </div>
        
        <button 
          class="card download-sales-btn" 
          style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg); border: 1px solid rgba(0,0,0,0.05); cursor: pointer; color: var(--text); border-radius: var(--radius-md); padding: 0;"
          title="Download Rekap PDF Harian"
        >
          <i data-lucide="download" style="width: 20px; height: 20px;"></i>
        </button>
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Pending</button>
        <button class="filter-chip">Diproses</button>
        <button class="filter-chip">Ready</button>
        <button class="filter-chip">Dikirim</button>
        <button class="filter-chip">Void</button>
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
