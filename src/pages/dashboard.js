import { supabase } from "../supabaseClient.js";

export function DashboardPage() {
  setTimeout(async () => {
    const container = document.querySelector(".dashboard-page");
    if (!container) return;

    // Capture seluruh elemen angka/list statis berdasarkan CSS barumu gais
    const heroValueEl = container.querySelector(".hero-value");
    const statOrderEl = container.querySelector(".hero-stats-order strong");
    const statProdEl = container.querySelector(".hero-stats-prod strong");
    const statPendingEl = container.querySelector(".hero-stats-pending strong");
    
    const stockMenipisDescEl = container.querySelector(".priority-head p");
    const stockListArea = container.querySelector(".priority-stock-list");
    
    const summaryPendingEl = container.querySelector(".summary-click-pending strong");
    const summaryProdEl = container.querySelector(".summary-click-prod strong");
    const summaryReadyEl = container.querySelector(".summary-click-ready strong");

    async function loadDashboardRealtimeData() {
      try {
        // Ambil range waktu khusus HARI INI (Zona waktu lokal Indonesia gais)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isoToday = today.toISOString();

        // ==========================================================================
        // 1. FETCH DATA UTAMA SALES ORDERS (UNTUK OMZET & STATS)
        // ==========================================================================
        const { data: orders, error: orderErr } = await supabase
          .from("sales_orders")
          .select("status, total_amount")
          .gte("created_at", isoToday);

        if (orderErr) throw orderErr;

        let totalOmzetToday = 0;
        let countTodayOrders = 0;
        let countPendingToday = 0;

        if (orders) {
          orders.forEach(o => {
            const statusLower = o.status ? o.status.toLowerCase() : "pending";
            
            // Omzet hanya dihitung dari nota yang sah (bukan VOID gais!)
            if (statusLower !== "void") {
              totalOmzetToday += parseFloat(o.total_amount || 0);
              countTodayOrders++;
            }
            
            if (statusLower === "pending" || statusLower === "butuh produksi") {
              countPendingToday++;
            }
          });
        }

        // Suntik data ke DOM Hero atas
        if (heroValueEl) heroValueEl.textContent = `Rp ${totalOmzetToday.toLocaleString("id-ID")}`;
        if (statOrderEl) statOrderEl.textContent = countTodayOrders;
        if (statPendingEl) statPendingEl.textContent = countPendingToday;

        // ==========================================================================
        // 2. FETCH DATA UNTUK SUMMARY OPERASIONAL BAWAH (ALL TIME ACTIVE ORDERS)
        // ==========================================================================
        const { data: allActiveOrders } = await supabase
          .from("sales_orders")
          .select("status");

        let totalPendingAllTime = 0;
        let totalDiprosesAllTime = 0;
        let totalReadyAllTime = 0;

        if (allActiveOrders) {
          allActiveOrders.forEach(o => {
            const stat = o.status ? o.status.toLowerCase() : "pending";
            if (stat === "pending" || stat === "butuh produksi") totalPendingAllTime++;
            if (stat === "diproses") totalDiprosesAllTime++;
            if (stat === "ready") totalReadyAllTime++;
          });
        }

        if (summaryPendingEl) summaryPendingEl.textContent = totalPendingAllTime;
        if (summaryProdEl) summaryProdEl.textContent = totalDiprosesAllTime;
        if (summaryReadyEl) summaryReadyEl.textContent = totalReadyAllTime;

        // ==========================================================================
        // 3. FETCH DATA PRODUCTIONS (ANTREAN MESIN ROASTER LIVE)
        // ==========================================================================
        const { data: activeProds } = await supabase
          .from("productions")
          .select("id");
        
        if (statProdEl && activeProds) statProdEl.textContent = activeProds.length;

        // ==========================================================================
        // 4. FETCH DATA LIVE PRODUK MENIPIS (CRITICAL STOCK WARING < 15KG)
        // ==========================================================================
        const { data: lowStockItems } = await supabase
          .from("products")
          .select("name, stock, unit")
          .lt("stock", 15) // Batas limit kritis menipis harian gais
          .order("stock", { ascending: true })
          .limit(3);

        if (lowStockItems && lowStockItems.length > 0) {
          if (stockMenipisDescEl) stockMenipisDescEl.textContent = `${lowStockItems.length} item barang perlu restock segera`;
          
          stockListArea.innerHTML = lowStockItems.map(item => {
            const sQty = parseFloat(item.stock || 0);
            return `
              <div class="priority-stock-item">
                <span>${item.name}</span>
                <strong>${sQty.toFixed(1)} ${item.unit || 'kg'}</strong>
              </div>
            `;
          }).join('');
        } else {
          if (stockMenipisDescEl) stockMenipisDescEl.textContent = "Aman! Semua stok rak gudang mencukupi";
          stockListArea.innerHTML = `
            <div class="priority-stock-item">
              <span style="font-style: italic;">Tidak ada bahan kritis.</span>
              <strong style="color: var(--success);">OK</strong>
            </div>
          `;
        }

        if (window.lucide) window.lucide.createIcons();

      } catch (err) {
        console.error("Gagal sinkronisasi data dasbor gais: ", err.message);
      }
    }

    // Jalankan mesin sinkronisasi dasbor harian
    loadDashboardRealtimeData();

  }, 50);

  /* ==========================================================================
     RETURN TEMPLATE (SINKRON 100% DENGAN CSS ORANGE & PREMIUM CHARCOAL LU)
     ========================================================================== */
  return `
    <section class="dashboard-page">

      <div class="dashboard-hero-card" style="cursor: pointer;" onclick="window.navigate('order')">
        <div class="dashboard-hero-top">
          <div class="hero-icon">
            <i data-lucide="trending-up"></i>
          </div>
          <div>
            <p class="hero-label">Omzet Hari Ini</p>
            <h2 class="hero-value">Rp 0</h2>
          </div>
        </div>

        <div class="dashboard-hero-stats">
          <div class="hero-stat hero-stats-order">
            <strong>0</strong>
            <span>Order</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat hero-stats-prod" onclick="event.stopPropagation(); window.navigate('produksi')">
            <strong>0</strong>
            <span>Produksi</span>
          </div>
          <div class="hero-stat-divider"></div>
          <div class="hero-stat hero-stats-pending">
            <strong>0</strong>
            <span>Pending</span>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-title-row">
          <h3>Aksi Cepat</h3>
        </div>
        
        <div class="quick-actions-layout">
          <div class="quick-menu-item" onclick="window.navigate('pembelian')">
            <div class="quick-menu-icon"><i data-lucide="shopping-bag"></i></div>
            <span>Pembelian</span>
          </div>

          <div class="quick-menu-item" onclick="window.navigate('order')">
            <div class="quick-menu-icon"><i data-lucide="shopping-cart"></i></div>
            <span>Penjualan</span>
          </div>

          <div class="quick-menu-item" onclick="window.navigate('sample-out')">
            <div class="quick-menu-icon">
              <i data-lucide="gift"></i>
            </div>
          
            <span>Sampel</span>
          </div>

          <div class="quick-menu-item" onclick="window.navigate('produksi')">
            <div class="quick-menu-icon"><i data-lucide="factory"></i></div>
            <span>Produksi</span>
          </div>

          <div class="quick-menu-item" onclick="window.navigate('stok')">
            <div class="quick-menu-icon"><i data-lucide="package"></i></div>
            <span>Stock</span>
          </div>

          <div class="quick-menu-item" onclick="window.navigate('penyesuaian-stok')">
            <div class="quick-menu-icon"><i data-lucide="sliders"></i></div>
            <span>Adj Stok</span>
          </div>

          <div class="quick-menu-item" onclick="window.navigate('produk')">
            <div class="quick-menu-icon"><i data-lucide="boxes"></i></div>
            <span>Produk</span>
          </div>

          <div class="quick-menu-item" onclick="window.navigate('piutang')">
            <div class="quick-menu-icon"><i data-lucide="credit-card"></i></div>
            <span>Piutang</span>
          </div>

          <div class="quick-menu-item" onclick="window.navigate('laporan')">
            <div class="quick-menu-icon"><i data-lucide="bar-chart-3"></i></div>
            <span>Laporan</span>
          </div>
        </div>
      </div>

      <div class="dashboard-section" style="cursor: pointer;" onclick="window.navigate('stok')">
        <div class="section-title-row">
          <h3>Prioritas Hari Ini</h3>
        </div>

        <div class="card dashboard-priority-card">
          <div class="priority-head">
            <div class="priority-icon-box">
              <i data-lucide="alert-triangle"></i>
            </div>
            <div>
              <strong>Stock Menipis</strong>
              <p>Memuat analisis timbangan gudang...</p>
            </div>
          </div>

          <div class="priority-stock-list"></div>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-title-row">
          <h3>Ringkasan Operasional</h3>
        </div>

        <div class="dashboard-summary-row">
          <div class="summary-inline-item summary-click-pending" style="cursor:pointer;" onclick="window.navigate('order')">
            <strong>0</strong>
            <span>Pending Order</span>
          </div>
          <div class="summary-inline-item summary-click-prod" style="cursor:pointer;" onclick="window.navigate('produksi')">
            <strong>0</strong>
            <span>Produksi</span>
          </div>
          <div class="summary-inline-item summary-click-ready" style="cursor:pointer;" onclick="window.navigate('order')">
            <strong>0</strong>
            <span>Ready Kirim</span>
          </div>
        </div>
      </div>

    </section>
  `;
}
