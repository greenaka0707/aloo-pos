import { supabase } from "../supabaseClient.js";

export function OrderDetailPage() {
  const orderId = localStorage.getItem("selected_order_id");
  let orderDataLocal = null;
  let orderItemsLocal = [];

  setTimeout(async () => {
    const container = document.querySelector(".detail-page");
    if (!container || !orderId) return;

    // Capture area render komponen dinamis di DOM
    const statusCardArea = container.querySelector(".detail-status-card");
    const customerCardArea = container.querySelector("#detail-customer-card-info");
    const productCardArea = container.querySelector("#detail-product-card-list");
    const productionCardArea = container.querySelector("#detail-production-card-bom");
    const bomListArea = container.querySelector("#detail-bom-list-render");
    const timelineArea = container.querySelector(".timeline");
    const actionsArea = container.querySelector(".detail-actions");

    // ==========================================================================
    // 1. QUERY DATA KOMPLEKS (MULTIPLE JOIN TABLES VIA SUPABASE)
    // ==========================================================================
    async function fetchOrderDetail() {
      try {
        const { data: order, error } = await supabase
          .from("sales_orders")
          .select(`
            id,
            invoice_no,
            order_date,
            status,
            total_amount,
            customers ( name, phone, address ),
            salesmen ( name )
          `)
          .eq("id", orderId)
          .single();

        if (error) throw error;
        orderDataLocal = order;

        // Tarik data item barang belanjaannya
        const { data: items, error: itemsError } = await supabase
          .from("sales_order_items")
          .select(`
            id,
            qty,
            unit_price,
            products ( id, name, stock, unit, category )
          `)
          .eq("sales_order_id", orderId);

        if (itemsError) throw itemsError;
        orderItemsLocal = items || [];

        renderAllDetailDOM();

      } catch (err) {
        container.innerHTML = `<p style="padding:var(--space-xl); text-align:center; color:var(--danger);">❌ Gagal muat detail nota: ${err.message}</p>`;
      }
    }

    // ==========================================================================
    // 2. LOGIKA RENDER UTAMA (STATUS, CUSTOMER, ITEM, & KEUANGAN)
    // ==========================================================================
    function renderAllDetailDOM() {
      if (!orderDataLocal) return;

      // 2.1 Render Kartu Status Utama harian
      let statusText = "Pending Produksi";
      let badgeClass = "badge-warning";
      if (orderDataLocal.status === "diproses") { statusText = "Sedang Diproses"; badgeClass = "badge-info"; }
      if (orderDataLocal.status === "ready") { statusText = "Siap Dikirim"; badgeClass = "badge-success"; }
      if (orderDataLocal.status === "dikirim") { statusText = "Selesai Dikirim"; badgeClass = "badge-primary"; }

      statusCardArea.innerHTML = `
        <div>
          <span class="detail-status-title">Invoice: ${orderDataLocal.invoice_no}</span>
          <h3 class="font-bold" style="color: var(--text);">${statusText}</h3>
        </div>
        <span class="badge ${badgeClass}" style="text-transform:uppercase;">${orderDataLocal.status || 'Pending'}</span>
      `;

      // 2.2 Render Informasi Customer & Salesman Penanggung Jawab
      const cust = orderDataLocal.customers || {};
      if (customerCardArea) {
        customerCardArea.innerHTML = `
          <div class="info-item"><span>Nama Warung</span><strong>${cust.name || "Tanpa Nama"}</strong></div>
          <div class="info-item"><span>Telepon / WA</span><strong>${cust.phone || "-"}</strong></div>
          <div class="info-item"><span>Alamat Kirim</span><strong>${cust.address || "-"}</strong></div>
          <div class="info-item" style="border-top: 1px dashed var(--border); padding-top: 6px; margin-top: 4px;">
            <span>Sales Lapangan</span><strong style="color: var(--orange);">${orderDataLocal.salesmen?.name || "None"}</strong>
          </div>
        `;
      }

      // 2.3 Render Baris Belanjaan Item Produk
      let needsBomAnalysis = false;
      let totalRobustaNeeded = 0;
      let totalJagungNeeded = 0;

      if (productCardArea) {
        productCardArea.innerHTML = orderItemsLocal.map(item => {
          const p = item.products || {};
          const isShortage = item.qty > (p.stock || 0);
          
          if (isShortage) {
            const gap = item.qty - (p.stock || 0);
            if (p.name.toLowerCase().includes("giras") || p.name.toLowerCase().includes("blend")) {
              needsBomAnalysis = true;
              totalRobustaNeeded += (gap * 0.5);
              totalJagungNeeded += (gap * 0.5);
            } else if (p.category === 'kopi_bubuk' || p.category === 'roastedbean') {
              needsBomAnalysis = true;
              totalRobustaNeeded += gap;
            }
          }

          return `
            <div class="detail-row-item" style="border-bottom: 1px solid var(--border); padding-bottom: var(--space-sm); margin-bottom: var(--space-sm);">
              <div class="left-content">
                <strong class="title" style="color:var(--text);">${p.name || "Produk Hilang"}</strong>
                <span class="subtitle">Qty: ${item.qty} ${p.unit || 'kg'} &bull; @Rp ${(item.unit_price || 0).toLocaleString('id-ID')}</span>
              </div>
              <span class="badge ${isShortage ? 'badge-warning' : 'badge-success'}">
                ${isShortage ? 'Butuh Produksi' : 'Stok Ready'}
              </span>
            </div>
          `;
        }).join('') + `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:var(--space-md);">
            <span class="text-sm text-light">Total Pembelian</span>
            <strong style="font-size:var(--text-md); color:var(--text);">Rp ${(orderDataLocal.total_amount || 0).toLocaleString('id-ID')}</strong>
          </div>
        `;
      }

      // 2.4 Render Kartu Kebutuhan Manufaktur Racikan Komposisi (BOM)
      if (productionCardArea && bomListArea) {
        if (needsBomAnalysis && orderDataLocal.status !== "dikirim" && orderDataLocal.status !== "ready") {
          productionCardArea.style.display = "block";
          let bomHtml = "";
          if (totalRobustaNeeded > 0) {
            bomHtml += `
              <div class="detail-row-item"><div class="left-content"><span class="title">RB Robusta Base Material</span></div><strong class="right-value">${totalRobustaNeeded.toFixed(1)}kg</strong></div>
            `;
          }
          if (totalJagungNeeded > 0) {
            bomHtml += `
              <div class="detail-row-item"><div class="left-content"><span class="title">Jagung Campuran</span></div><strong class="right-value">${totalJagungNeeded.toFixed(1)}kg</strong></div>
            `;
          }
          bomListArea.innerHTML = bomHtml;
        } else {
          productionCardArea.style.display = "none";
        }
      }

      // 2.5 Render Tracing Visual Progress Timeline Kerja Lapangan
      const st = orderDataLocal.status;
      if (timelineArea) {
        timelineArea.innerHTML = `
          <div class="timeline-item active"><div class="timeline-dot"></div><div><h4>Order Dibuat</h4><p>${orderDataLocal.order_date}</p></div></div>
          <div class="timeline-item ${st !== 'pending' ? 'active' : ''}"><div class="timeline-dot"></div><div><h4>Antrean Masuk</h4><p>${st === 'pending' ? 'Menunggu Produksi' : 'Disetujui Admin'}</p></div></div>
          <div class="timeline-item ${st === 'ready' || st === 'dikirim' ? 'active' : ''}"><div class="timeline-dot"></div><div><h4>Proses Produksi</h4><p>${st === 'diproses' ? 'Sedang Digiling/Roasting' : (st === 'ready' || st === 'dikirim' ? 'Selesai Sempurna' : 'Belum Dimulai')}</p></div></div>
          <div class="timeline-item ${st === 'dikirim' ? 'active' : ''}"><div class="timeline-dot"></div><div><h4>Pengiriman</h4><p>${st === 'dikirim' ? 'Barang Dibawa Sales' : 'Menunggu Siap'}</p></div></div>
        `;
      }

      // 2.6 Render Tombol Aksi Lapangan Dinamis Berdasarkan Posisi Status
      renderActionButtonsDOM();
    }

    // ==========================================================================
    // 3. FIXED LOGIC CORE: PEMBETULAN STRING MUTASI DAN PEMOTONGAN STOK AKTUAL
    // ==========================================================================
    function renderActionButtonsDOM() {
      const st = orderDataLocal.status;
      
      let leftButtonsHtml = `
        <button class="action-btn" id="btn-back-order" style="background:var(--border); color:var(--text); border:none;">Kembali</button>
      `;

      if (st === "pending") {
        actionsArea.innerHTML = leftButtonsHtml + `<button class="action-btn primary-action" id="btn-next-status" style="background:var(--orange); border:none; color:white;">Mulai Produksi</button>`;
      } else if (st === "diproses") {
        actionsArea.innerHTML = leftButtonsHtml + `<button class="action-btn primary-action" id="btn-next-status" style="background:#14B8A6; border:none; color:white;">Set Siap Kirim</button>`;
      } else if (st === "ready") {
        actionsArea.innerHTML = leftButtonsHtml + `<button class="action-btn primary-action" id="btn-next-status" style="background:#06B6D4; border:none; color:white;">Kirim Barang</button>`;
      } else {
        actionsArea.innerHTML = leftButtonsHtml + `<button class="action-btn" style="background:var(--border); border:none; color:var(--text-light);" disabled>Order Closed</button>`;
      }

      const backBtn = actionsArea.querySelector("#btn-back-order");
      if (backBtn) backBtn.addEventListener("click", () => { if(window.navigate) window.navigate("order"); });

      const nextBtn = actionsArea.querySelector("#btn-next-status");
      if (nextBtn) {
        nextBtn.addEventListener("click", async () => {
          // KUNCI LOGIKA: Menggunakan string murni database huruf kecil standar
          let nextStatus = "diproses";
          if (st === "diproses") nextStatus = "ready";
          if (st === "ready") nextStatus = "dikirim";

          try {
            nextBtn.disabled = true;
            nextBtn.textContent = "Updating...";

            // PROSES MUTASI WAJIB HANYA TERJADI PAS KLIK "KIRIM BARANG" (READY -> DIKIRIM)
            if (nextStatus === "dikirim") {
              for (const item of orderItemsLocal) {
                const p = item.products || {};
                const currentStock = parseFloat(p.stock) || 0;
                const orderQty = parseFloat(item.qty) || 0;
                const newStock = currentStock - orderQty;

                // A. Potong nilai angka stok di tabel master products
                const { error: stockErr } = await supabase
                  .from("products")
                  .update({ stock: newStock })
                  .eq("id", p.id);
                
                if (stockErr) throw stockErr;

                // B. Catat mutasi sejarah barang keluar secara real-time ke tabel stock_mutations
                const { error: mutationErr } = await supabase
                  .from("stock_mutations")
                  .insert([{
                    product_id: p.id,
                    type: "out",
                    qty: orderQty,
                    reference_no: orderDataLocal.invoice_no,
                    description: `Penjualan Lapangan: ${orderDataLocal.invoice_no} (${orderDataLocal.customers?.name || 'Warung'})`
                  }]);
                
                if (mutationErr) throw mutationErr;
              }
            }

            // C. Jalankan pembaruan status nota induk orderan utama di database
            const { error: updateErr } = await supabase
              .from("sales_orders")
              .update({ status: nextStatus })
              .eq("id", orderId);

            if (updateErr) throw updateErr;

            alert(`🎉 Status Order Resmi Naik Ke Tahap: ${nextStatus.toUpperCase()}! Arus stok tercatat.`);
            fetchOrderDetail(); 

          } catch (err) {
            alert("❌ Gagal merubah status operational: " + err.message);
            nextBtn.disabled = false;
            renderActionButtonsDOM();
          }
        });
      }
    }

    fetchOrderDetail();

  }, 50);

  return `
    <section class="detail-page" style="padding-bottom: var(--space-xl);">

      <div class="card detail-status-card">
        <div>
          <span class="detail-status-title">Memuat...</span>
          <h3 class="font-bold">Menghubungkan Database...</h3>
        </div>
        <span class="badge badge-warning">...</span>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="user"></i></div>
          <h3>Customer & Salesman</h3>
        </div>
        <div class="detail-info" id="detail-customer-card-info">
          <p class="text-xs text-light">Memuat profil...</p>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="package"></i></div>
          <h3>Produk Terbeli</h3>
        </div>
        <div id="detail-product-card-list" style="margin-top: var(--space-md);">
          <p class="text-xs text-light">Memuat list item...</p>
        </div>
      </div>

      <div class="card detail-card" id="detail-production-card-bom" style="display: none;">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="factory"></i></div>
          <h3>Kebutuhan Analisis Manufaktur (BOM)</h3>
        </div>
        <div class="bom-list" id="detail-bom-list-render" style="margin-top: var(--space-md);">
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="clock-3"></i></div>
          <h3>Timeline Perjalanan Nota</h3>
        </div>
        <div class="timeline" style="margin-top: var(--space-md);">
        </div>
      </div>

      <div class="detail-actions" style="margin-top: var(--space-xl); display: flex; gap: var(--space-md);">
        <button class="action-btn" style="flex:1;">Memuat...</button>
      </div>

    </section>
  `;
}
