import { supabase } from "../supabaseClient.js";

export function OrderDetailPage() {
  const orderId = localStorage.getItem("selected_order_id");
  let orderDataLocal = null;
  let orderItemsLocal = [];
  let dbBomItemsLocal = []; 

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

        // AMBIL BAHAN BAKU YANG TADI DI-INPUT MANUAL PAS CREATE ORDER DARI DATABASE
        dbBomItemsLocal = [];
        const { data: prodData, error: prodErr } = await supabase
          .from("productions")
          .select("id")
          .eq("sales_order_id", orderId)
          .limit(1);

        if (!prodErr && prodData && prodData.length > 0) {
          const { data: ingData, error: ingErr } = await supabase
            .from("production_ingredients")
            .select(`
              qty_used,
              products ( name, unit )
            `)
            .eq("production_id", prodData[0].id);

          if (!ingErr && ingData) {
            dbBomItemsLocal = ingData;
          }
        }

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
      
      const currentDbStatus = orderDataLocal.status ? orderDataLocal.status.toLowerCase() : 'pending';

      if (currentDbStatus === "butuh produksi") { statusText = "Butuh Produksi (MTO)"; badgeClass = "badge-warning"; }
      if (currentDbStatus === "diproses") { statusText = "Sedang Diproses"; badgeClass = "badge-info"; }
      if (currentDbStatus === "ready") { statusText = "Siap Dikirim"; badgeClass = "badge-primary"; } 
      if (currentDbStatus === "dikirim") { statusText = "Selesai Dikirim"; badgeClass = "badge-success"; } 
      if (currentDbStatus === "void") { statusText = "Nota Dibatalkan (Void)"; badgeClass = "badge-danger"; }

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
      if (productCardArea) {
        productCardArea.innerHTML = orderItemsLocal.map(item => {
          const p = item.products || {};
          const isShortage = item.qty > (p.stock || 0);

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

      // 2.4 RENDERING KARTU BOM DINAMIS DARI HASIL INPUT KASIR YANG DISIMPAN DI DATABASE
      if (productionCardArea && bomListArea) {
        if (dbBomItemsLocal && dbBomItemsLocal.length > 0 && currentDbStatus !== "dikirim" && currentDbStatus !== "ready" && currentDbStatus !== "void") {
          productionCardArea.style.display = "block";
          
          bomListArea.innerHTML = dbBomItemsLocal.map(ing => {
            const matName = ing.products?.name || "Bahan Baku";
            const matUnit = ing.products?.unit || "kg";
            const matQty = parseFloat(ing.qty_used || 0);

            return `
              <div class="detail-row-item" style="margin-bottom: 4px;">
                <div class="left-content">
                  <span class="title" style="color: var(--text); font-weight:var(--font-medium);">${matName}</span>
                </div>
                <strong class="right-value" style="font-size: var(--text-sm); color: var(--text);">${matQty.toFixed(1)} ${matUnit}</strong>
              </div>
            `;
          }).join('');
        } else {
          productionCardArea.style.display = "none";
        }
      }

      // 2.5 Render Tracing Visual Progress Timeline Kerja Lapangan
      if (timelineArea) {
        timelineArea.innerHTML = `
          <div class="timeline-item active"><div class="timeline-dot"></div><div><h4>Order Dibuat</h4><p>${orderDataLocal.order_date}</p></div></div>
          <div class="timeline-item ${currentDbStatus !== 'pending' && currentDbStatus !== 'void' ? 'active' : ''}"><div class="timeline-dot"></div><div><h4>Antrean Masuk</h4><p>${currentDbStatus === 'void' ? 'Nota Dibatalkan / Retur' : (currentDbStatus === 'pending' || currentDbStatus === 'butuh produksi' ? 'Menunggu Produksi' : 'Disetujui Admin')}</p></div></div>
          <div class="timeline-item ${currentDbStatus === 'ready' || currentDbStatus === 'dikirim' ? 'active' : ''}"><div class="timeline-dot"></div><div><h4>Proses Produksi</h4><p>${currentDbStatus === 'diproses' ? 'Sedang Digiling/Roasting' : (currentDbStatus === 'ready' || currentDbStatus === 'dikirim' ? 'Selesai Sempurna' : 'Belum Dimulai')}</p></div></div>
          <div class="timeline-item ${currentDbStatus === 'dikirim' ? 'active' : ''}"><div class="timeline-dot"></div><div><h4>Pengiriman</h4><p>${currentDbStatus === 'dikirim' ? 'Barang Dibawa Sales' : 'Menunggu Siap'}</p></div></div>
        `;
      }

      // 2.6 Render Tombol Aksi Lapangan Dinamis Berdasarkan Posisi Status
      renderActionButtonsDOM();
    }

    // ==========================================================================
    // 3. GENERATOR PDF INVOICE A5 (STRUKTUR ENNA & PAYMENT DETAIL)
    // ==========================================================================
        // ==========================================================================
    // 3. GENERATOR PDF INVOICE A5 (FIX REKENING & STRUKTUR LOGO ENNA)
    // ==========================================================================
    function downloadInvoiceA5() {
      if (!orderDataLocal) return;

      const cust = orderDataLocal.customers || {};
      
      const element = document.createElement("div");
      element.style.padding = "20px";
      element.style.width = "540px";  
      element.style.boxSizing = "border-box";
      element.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
      element.style.color = "#1F2937";
      element.style.backgroundColor = "#FFFFFF";

      element.innerHTML = `
        <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
          <tr>
            <td style="vertical-align:top;">
              <h1 style="margin:0; font-size:20px; color:#111827; font-weight:800; line-height:1.1; letter-spacing:-0.5px;">ENNA</h1>
              <div style="font-size:11px; font-weight:700; color:#F97316; margin-top:2px;">PT. Ekspansi Nutrisi Nusantara</div>
              <div style="font-size:9px; color:#6B7280; margin-top:1px;">Pucang Anom Timur IV 26A Surabaya</div>
            </td>
            <td style="text-align:right; vertical-align:top;">
              <h2 style="margin:0; font-size:12px; color:#1F2937; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Sales Invoice</h2>
              <div style="font-size:10px; font-weight:600; color:#4B5563; margin-top:2px;">${orderDataLocal.invoice_no}</div>
            </td>
          </tr>
        </table>

        <div style="border-top:1px solid #E5E7EB; margin-bottom:15px;"></div>

        <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:10px; line-height:1.4;">
          <tr>
            <td style="width:50%; vertical-align:top; padding-right:10px;">
              <span style="color:#9CA3AF; display:block; text-transform:uppercase; font-size:8px; font-weight:700; margin-bottom:4px; letter-spacing:0.3px;">Tujuan Pengiriman:</span>
              <strong style="font-size:11px; color:#111827; display:block; margin-bottom:2px;">${cust.name || "Tanpa Nama"}</strong>
              <span style="display:block; color:#4B5563; max-width:220px; white-space:pre-wrap;">${cust.address || "-"}</span>
              <span style="display:block; color:#4B5563; margin-top:2px;">Telp: ${cust.phone || "-"}</span>
            </td>
            <td style="width:50%; text-align:right; vertical-align:top;">
              <span style="color:#9CA3AF; display:block; text-transform:uppercase; font-size:8px; font-weight:700; margin-bottom:4px; letter-spacing:0.3px;">Detail Nota:</span>
              <table style="border-collapse:collapse; margin-left:auto; font-size:10px;">
                <tr><td style="text-align:right; color:#6B7280; padding:1px 4px;">Tanggal:</td><td style="text-align:left; font-weight:600; padding:1px 4px;">${orderDataLocal.order_date}</td></tr>
                <tr><td style="text-align:right; color:#6B7280; padding:1px 4px;">Salesman:</td><td style="text-align:left; font-weight:600; padding:1px 4px;">${orderDataLocal.salesmen?.name || "-"}</td></tr>
                <tr><td style="text-align:right; color:#6B7280; padding:1px 4px;">Status:</td><td style="text-align:left; font-weight:700; color:#F97316; padding:1px 4px;">${orderDataLocal.status?.toUpperCase()}</td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table style="width:100%; border-collapse:collapse; font-size:10px; margin-bottom:15px;">
          <thead>
            <tr style="background-color:#F9FAFB; border-top:1px solid #E5E7EB; border-bottom:1px solid #E5E7EB;">
              <th style="text-align:left; padding:6px 8px; color:#4B5563; font-weight:700;">Nama Item Produk Kopi</th>
              <th style="text-align:center; padding:6px 8px; color:#4B5563; font-weight:700; width:50px;">Qty</th>
              <th style="text-align:right; padding:6px 8px; color:#4B5563; font-weight:700; width:90px;">Harga</th>
              <th style="text-align:right; padding:6px 8px; color:#4B5563; font-weight:700; width:100px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsLocal.map(item => {
              const p = item.products || {};
              return `
                <tr style="border-bottom:1px solid #F3F4F6;">
                  <td style="padding:8px 8px; font-weight:600; color:#111827;">${p.name || "Item"}</td>
                  <td style="text-align:center; padding:8px 8px; color:#4B5563;">${item.qty} ${p.unit || 'kg'}</td>
                  <td style="text-align:right; padding:8px 8px; color:#4B5563;">Rp ${(item.unit_price || 0).toLocaleString('id-ID')}</td>
                  <td style="text-align:right; padding:8px 8px; font-weight:700; color:#111827;">Rp ${(item.qty * item.unit_price).toLocaleString('id-ID')}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:11px;">
          <tr>
            <td></td>
            <td style="width:220px; text-align:right; padding:4px 8px; border-top:1px solid #E5E7EB;">
              <span style="color:#4B5563; font-weight:600; margin-right:15px;">Total Netto:</span>
              <strong style="color:#111827; font-size:12px;">Rp ${(orderDataLocal.total_amount || 0).toLocaleString('id-ID')}</strong>
            </td>
          </tr>
        </table>

        <div style="background-color:#F9FAFB; border:1px solid #E5E7EB; border-radius:4px; padding:10px; font-size:10px; line-height:1.4;">
          <strong style="color:#111827; font-size:10px; text-transform:uppercase; display:block; margin-bottom:4px; border-bottom:1px dashed #E5E7EB; padding-bottom:3px; letter-spacing:0.3px;">Konfirmasi Pembayaran</strong>
          <span style="color:#4B5563; display:block; margin-bottom:3px;">Silahkan Melakukan Pembayaran Ke:</span>
          <div style="color:#111827; margin-top:2px;">
            <span style="color:#4B5563;">Bank:</span> <strong>MANDIRI</strong><br/>
            <span style="color:#4B5563;">An:</span> <strong>PT. EKSPANSI NUTRISI NUSANTARA</strong><br/>
            <span style="color:#4B5563;">No. Rek:</span> <strong style="font-size:11px; color:#F97316; letter-spacing:0.5px;">1420000699008</strong>
          </div>
          <span style="color:#6B7280; font-style:italic; display:block; margin-top:5px; font-size:9px;">* Mohon konfirmasi jika sudah melakukan pembayaran</span>
        </div>

        <div style="color:#9CA3AF; font-style:italic; font-size:8px; text-align:center; line-height:1.3; margin-top:15px;">
          Dokumen ini sah dikeluarkan oleh sistem ALOO POS sebagai tanda bukti transaksi pemesanan lapangan.
        </div>
      `;

      const opt = {
        margin:       0,
        filename:     `Invoice_${orderDataLocal.invoice_no}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a5', orientation: 'portrait' }
      };

      window.html2pdf().set(opt).from(element).save();
    }


    // ==========================================================================
    // 4. GENERATOR TOMBOL AKSI JALUR OPERASIONAL (WITH ONLY DYNAMIC ICONS)
    // ==========================================================================
    function renderActionButtonsDOM() {
      const currentDbStatus = orderDataLocal.status ? orderDataLocal.status.toLowerCase() : 'pending';
      
      // Cek apakah SEMUA produk di order ini stoknya aman/ready
      const isAllStockReady = orderItemsLocal.every(item => {
        const p = item.products || {};
        return item.qty <= (p.stock || 0);
      });

      let leftButtonsHtml = `
        <button class="action-btn-icon" id="btn-print-invoice" style="background:var(--orange-soft); color:var(--orange); border:none; width:48px; height:48px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-md); padding:0; cursor:pointer;" title="Cetak WA">
          <i data-lucide="printer" style="width:20px; height:20px;"></i>
        </button>
      `;

      if (currentDbStatus === "void") {
        actionsArea.innerHTML = leftButtonsHtml + `
          <button class="action-btn primary-action" style="background:var(--border); color:var(--text-light); border:none; flex:1; height:48px; display:flex; align-items:center; justify-content:center; gap:8px; border-radius:var(--radius-md); font-weight:bold;" disabled>
            <i data-lucide="ban" style="width:18px; height:18px;"></i> ORDER VOIDED
          </button>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      let voidIcon = "trash-2";
      let voidTitle = "Void Order";
      if (currentDbStatus === "dikirim") {
        voidIcon = "refresh-cw";
        voidTitle = "Terima Retur";
      }

      let voidButtonHtml = `
        <button class="action-btn-icon" id="btn-void-order" style="background:var(--danger-soft); color:var(--danger); border:none; width:48px; height:48px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-md); padding:0; cursor:pointer;" title="${voidTitle}">
          <i data-lucide="${voidIcon}" style="width:20px; height:20px;"></i>
        </button>
      `;

      // LOGIKA KONDISIONAL TOMBOL UTAMA BERDASARKAN KESIAPAN STOK
      if (currentDbStatus === "pending" || currentDbStatus === "butuh produksi") {
        if (isAllStockReady) {
          // Jika stok ready semua, lewati tahap produksi, ubah tombol jadi "Siapkan Pengiriman"
          actionsArea.innerHTML = leftButtonsHtml + voidButtonHtml + `
            <button class="action-btn primary-action" id="btn-next-status" data-skip-production="true" style="background:#06B6D4; border:none; color:white; flex:1; height:48px; display:flex; align-items:center; justify-content:center; gap:8px; border-radius:var(--radius-md); font-weight:bold; cursor:pointer;">
              <i data-lucide="check-circle" style="width:18px; height:18px;"></i> Stok Ready, Siapkan Pengiriman
            </button>
          `;
        } else {
          // Jika ada shortage, tetap harus lewat proses giling/roasting
          actionsArea.innerHTML = leftButtonsHtml + voidButtonHtml + `
            <button class="action-btn primary-action" id="btn-next-status" style="background:var(--orange); border:none; color:white; flex:1; height:48px; display:flex; align-items:center; justify-content:center; gap:8px; border-radius:var(--radius-md); font-weight:bold; cursor:pointer;">
              <i data-lucide="play" style="width:18px; height:18px;"></i> Mulai Produksi
            </button>
          `;
        }
      } else if (currentDbStatus === "diproses") {
        actionsArea.innerHTML = leftButtonsHtml + voidButtonHtml + `
          <button class="action-btn primary-action" id="btn-next-status" style="background:var(--border); border:none; color:var(--text-light); flex:1; height:48px; display:flex; align-items:center; justify-content:center; gap:8px; border-radius:var(--radius-md); font-weight:bold;" disabled>
            <i data-lucide="lock" style="width:18px; height:18px;"></i> Produksi Berjalan
          </button>
        `;
      } else if (currentDbStatus === "ready") {
        actionsArea.innerHTML = leftButtonsHtml + voidButtonHtml + `
          <button class="action-btn primary-action" id="btn-next-status" style="background:#06B6D4; border:none; color:white; flex:1; height:48px; display:flex; align-items:center; justify-content:center; gap:8px; border-radius:var(--radius-md); font-weight:bold; cursor:pointer;">
            <i data-lucide="truck" style="width:18px; height:18px;"></i> Kirim Barang
          </button>
        `;
      } else {
        actionsArea.innerHTML = leftButtonsHtml + voidButtonHtml + `
          <button class="action-btn" style="background:var(--border); border:none; color:var(--text-light); flex:1; height:48px; display:flex; align-items:center; justify-content:center; gap:8px; border-radius:var(--radius-md); font-weight:bold;" disabled>
            <i data-lucide="check-square" style="width:18px; height:18px;"></i> Order Closed
          </button>
        `;
      }

      if (window.lucide) window.lucide.createIcons();

      // ==========================================================================
      // ADDEVENTLISTENER INTERAKSI TOMBOL
      // ==========================================================================
      const voidBtn = actionsArea.querySelector("#btn-void-order");
      if (voidBtn) {
        voidBtn.addEventListener("click", async () => {
          const isAlreadyShipped = (currentDbStatus === "dikirim");
          
          let confirmationText = `⚠️ KONFIRMASI VOID NOTA!\n\nApakah lo yakin ingin membatalkan transaksi ${orderDataLocal.invoice_no}?\n\nStatus nota akan diubah menjadi VOID. Stok kopi matang aman tidak mengalami pergerakan gais.`;
          if (isAlreadyShipped) {
            confirmationText = `⚠️ KONFIRMASI SERAH TERIMA RETUR!\n\nApakah lo yakin ingin memproses retur barang dari nota ${orderDataLocal.invoice_no} ke rak gudang?`;
          }

          if (!confirm(confirmationText)) return;

          try {
            voidBtn.disabled = true;
            voidBtn.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:20px; height:20px;"></i>`;
            if (window.lucide) window.lucide.createIcons();

            if (isAlreadyShipped) {
              for (const item of orderItemsLocal) {
                const p = item.products || {};
                const maxQty = parseFloat(item.qty || 0);
                const pName = p.name || "Kopi Matang";

                let inputQty = prompt(
                  `📥 INPUT FISIK RETUR GUDANG\n\nProduk: ${pName}\nKuantitas di Nota Asal: ${maxQty} kg\n\nMasukkan total berat (kg) yang beneran sukses balik masuk rak:`, 
                  maxQty
                );

                if (inputQty === null) {
                  alert("❌ Void retur dibatalkan oleh user.");
                  fetchOrderDetail();
                  return;
                }

                let returnedQty = parseFloat(inputQty);

                if (isNaN(returnedQty) || returnedQty < 0 || returnedQty > maxQty) {
                  alert(`⚠️ INPUT DATA INVALID GAIS!\nJumlah retur produk ${pName} wajib angka positif dan tidak boleh melebihi ${maxQty} kg!`);
                  fetchOrderDetail();
                  return;
                }

                if (returnedQty > 0) {
                  const currentStock = parseFloat(p.stock) || 0;
                  const restoredStock = currentStock + returnedQty;

                  await supabase
                    .from("products")
                    .update({ stock: restoredStock })
                    .eq("id", p.id);

                  await supabase
                    .from("stock_mutations")
                    .insert([{
                      product_id: p.id,
                      type: "in",
                      qty: returnedQty,
                      reference_no: orderDataLocal.invoice_no,
                      description: `🔄 RETUR PRODUK JADI (VOID): Sukses serah terima fisik sebanyak ${returnedQty} kg dari nota ${orderDataLocal.invoice_no}`
                    }]);
                }
              }
            }
            
            const { error: voidErr } = await supabase
              .from("sales_orders")
              .update({ status: "void" })
              .eq("id", orderId);

            if (voidErr) throw voidErr;

            alert(`🎉 Sukses! Status Nota ${orderDataLocal.invoice_no} resmi diubah menjadi VOID.${isAlreadyShipped ? " Kuantitas retur rill berhasil tercatat masuk kembali ke rak gudang!" : " Stok produk aman tidak mengalami pergerakan."}`);
            fetchOrderDetail(); 

          } catch (err) {
            alert("❌ Gagal merubah status void retur: " + err.message);
            fetchOrderDetail();
          }
        });
      }

      const printBtn = actionsArea.querySelector("#btn-print-invoice");
      if (printBtn) printBtn.addEventListener("click", downloadInvoiceA5);

      const nextBtn = actionsArea.querySelector("#btn-next-status");
      if (nextBtn && !nextBtn.disabled) {
        nextBtn.addEventListener("click", async () => {
          let nextStatus = "diproses";
          
          // Modifikasi logic penentuan status berikutnya
          if (currentDbStatus === "pending" || currentDbStatus === "butuh produksi") {
            const shouldSkip = nextBtn.getAttribute("data-skip-production") === "true";
            nextStatus = shouldSkip ? "ready" : "diproses"; 
          }
          if (currentDbStatus === "diproses") nextStatus = "ready";
          if (currentDbStatus === "ready") nextStatus = "dikirim";

          try {
            nextBtn.disabled = true;
            nextBtn.textContent = "Updating...";

            if (nextStatus === "dikirim") {
              for (const item of orderItemsLocal) {
                const p = item.products || {};
                const currentStock = parseFloat(p.stock) || 0;
                const orderQty = parseFloat(item.qty) || 0;
                const newStock = currentStock - orderQty;

                const { error: stockErr } = await supabase
                  .from("products")
                  .update({ stock: newStock })
                  .eq("id", p.id);
                if (stockErr) throw stockErr;

                const { error: mutationErr } = await supabase
                  .from("stock_mutations")
                  .insert([{
                    product_id: p.id,
                    type: "out", 
                    qty: orderQty,
                    reference_no: orderDataLocal.invoice_no,
                    description: `Penjualan Lapangan Berhasil: ${orderDataLocal.invoice_no} (${orderDataLocal.customers?.name || 'Warung'})`
                  }]);
                if (mutationErr) throw mutationErr;
              }
            }

            const { error: updateErr } = await supabase
              .from("sales_orders")
              .update({ status: nextStatus })
              .eq("id", orderId);

            if (updateErr) throw updateErr;

            alert(`🎉 Status Order Resmi Naik Ke Tahap: ${nextStatus.toUpperCase()}! Arus stok kopi matang tercatat.`);
            fetchOrderDetail(); 

          } catch (err) {
            alert("❌ Gagal merubah status operational: " + err.message);
            fetchOrderDetail();
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
        <div class="bom-list" id="detail-bom-list-render" style="margin-top: var(--space-md); display:flex; flex-direction:column; gap:6px;">
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
