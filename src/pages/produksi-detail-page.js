import { supabase } from "../supabaseClient.js";

export function ProduksiDetailPage() {
  const productionId = localStorage.getItem("selected_production_id");
  let isProcessing = false;

  setTimeout(async () => {
    const container = document.querySelector(".detail-page");
    if (!container || !productionId) return;

    // Capture barisan tombol aksi kontrol operasional bawah
    const actionsArea = container.querySelector(".detail-actions");
    const pauseBtn = actionsArea?.querySelector("button:nth-child(1)");
    const editBtn = actionsArea?.querySelector("button:nth-child(2)");
    const finishBtn = actionsArea?.querySelector(".primary-action");

    async function loadProductionDetail() {
      try {
        // 1. Fetch data induk produksi sekalian join info kopi jadi & status sales ordernya
        const { data: prod, error: prodErr } = await supabase
          .from("productions")
          .select(`
            id,
            production_no,
            production_date,
            qty_produced,
            notes,
            sales_order_id,
            sales_orders ( invoice_no, status ),
            products ( id, name, unit )
          `)
          .eq("id", productionId)
          .single();

        if (prodErr) throw prodErr;

        // 2. Fetch seluruh item bahan baku mentah yang dikonsumsi batch produksi ini
        const { data: ingredients, error: ingErr } = await supabase
          .from("production_ingredients")
          .select(`
            qty_used,
            products ( id, name, stock, unit )
          `)
          .eq("production_id", productionId);

        if (ingErr) throw ingErr;

        const pName = prod.products?.name || "Kopi Olahan";
        const pUnit = prod.products?.unit || "kg";
        const isMto = !!prod.sales_order_id;
        
        // Tentukan nilai string status operasional rill harian lo gais
        let currentStatus = "Selesai";
        if (isMto && prod.sales_orders?.status) {
          const soStatus = prod.sales_orders.status.toLowerCase();
          if (soStatus === "butuh produksi") currentStatus = "Pending";
          else if (soStatus === "proses produksi") currentStatus = "Diproses";
          else if (soStatus === "ready") currentStatus = "Ready";
        } else if (!isMto) {
          currentStatus = "Selesai"; // MTS otomatis berstatus kelar harian
        }

        // ==========================================================================
        // A. UPDATE CARD STATUS & BADGE VISUAL
        // ==========================================================================
        const statusCard = container.querySelector(".detail-status-card");
        if (statusCard) {
          const statusTitle = statusCard.querySelector("h3");
          const statusBadge = statusCard.querySelector(".badge");

          if (currentStatus === "Pending") {
            statusTitle.textContent = "Menunggu Jadwal";
            statusBadge.className = "badge badge-warning";
            statusBadge.textContent = "Pending";
          } else if (currentStatus === "Diproses") {
            statusTitle.textContent = "Produksi Berjalan";
            statusBadge.className = "badge badge-info";
            statusBadge.textContent = "Diproses";
          } else if (currentStatus === "Ready" || currentStatus === "Selesai") {
            statusTitle.textContent = "Roasting Selesai";
            statusBadge.className = "badge badge-success";
            statusBadge.textContent = currentStatus;
          }
        }

        // ==========================================================================
        // B. RENDERING TARGET PRODUK UTAMA
        // ==========================================================================
        const productCard = container.querySelector(".card:nth-child(2)");
        if (productCard) {
          productCard.innerHTML = `
            <div class="card-title">
              <div class="icon-box"><i data-lucide="package"></i></div>
              <h3>Produk Produksi</h3>
            </div>
            <div class="detail-row-item">
              <div class="left-content">
                <strong class="title">${pName}</strong>
                <span class="subtitle">Qty Produksi ${prod.qty_produced} ${pUnit}</span>
              </div>
              <span class="badge ${isMto ? 'badge-primary' : 'badge-success'}">
                ${isMto ? 'Make-to-Order' : 'Manufacturing (MTS)'}
              </span>
            </div>
          `;
        }

        // ==========================================================================
        // C. RENDERING ANALISIS DATA INGREDIENTS (BAHAN MERACIK)
        // ==========================================================================
        const ingredientsCard = container.querySelector(".card:nth-child(3)");
        if (ingredientsCard) {
          let ingHtml = `
            <div class="card-title">
              <div class="icon-box"><i data-lucide="factory"></i></div>
              <h3>Bahan Meracik</h3>
            </div>
            <div class="detail-info">
          `;

          if (!ingredients || ingredients.length === 0) {
            ingHtml += `<p class="text-xs text-light" style="padding:var(--space-xs);">Komposisi bahan belum diinput atau resep kustom.</p>`;
          } else {
            ingHtml += ingredients.map(ing => {
              const matName = ing.products?.name || "Bahan Mentah";
              const matUnit = ing.products?.unit || "kg";
              const currentStock = parseFloat(ing.products?.stock) || 0;
              const needQty = parseFloat(ing.qty_used) || 0;
              
              // Cek kalkulasi lapangan apakah stok di rak saat ini mencukupi target racikan
              const isSafe = currentStock >= needQty;

              return `
                <div class="detail-row-item">
                  <div class="left-content">
                    <strong class="title">${matName}</strong>
                    <span class="subtitle">Need ${needQty} ${matUnit}</span>
                  </div>
                  <div class="detail-row-item" style="gap: var(--space-sm); padding: 0; align-items: center;">
                    <span class="text-light text-xs">Stock ${currentStock} ${matUnit}</span>
                    <span class="badge ${isSafe ? 'badge-success' : 'badge-danger'}">${isSafe ? 'Aman' : 'Kurang'}</span>
                  </div>
                </div>
              `;
            }).join('');
          }

          ingHtml += `</div>`;
          ingredientsCard.innerHTML = ingHtml;
        }

        // ==========================================================================
        // D. PROGRESS PRODUKSI TIMELINE (INTERAKTIF NYALA)
        // ==========================================================================
        const progressCard = container.querySelector(".card:nth-child(4) .timeline");
        if (progressCard) {
          const isDone = currentStatus === "Ready" || currentStatus === "Selesai";
          progressCard.innerHTML = `
            <div class="timeline-item active"><div class="timeline-dot"></div><div><h4>Persiapan Bahan</h4></div></div>
            <div class="timeline-item active"><div class="timeline-dot"></div><div><h4>Roasting</h4></div></div>
            <div class="timeline-item ${isDone ? 'active' : ''}"><div class="timeline-dot"></div><div><h4>Mixing</h4></div></div>
            <div class="timeline-item ${isDone ? 'active' : ''}"><div class="timeline-dot"></div><div><h4>Packing</h4></div></div>
            <div class="timeline-item ${isDone ? 'active' : ''}"><div class="timeline-dot"></div><div><h4>Finished</h4></div></div>
          `;
        }

        // ==========================================================================
        // E. RENDERING STOCK IMPACT REAL-TIME (MUTASI IN & OUT)
        // ==========================================================================
        const stockImpactCard = container.querySelector(".card:nth-child(5) .detail-info");
        if (stockImpactCard) {
          let impactHtml = ingredients.map(ing => {
            const matName = ing.products?.name || "Bahan Baku";
            const matUnit = ing.products?.unit || "kg";
            return `
              <div class="detail-row-item">
                <div class="left-content"><span class="title">${matName}</span></div>
                <strong class="right-value" style="color: var(--danger);">${ing.qty_used > 0 ? '-' : ''}${ing.qty_used} ${matUnit}</strong>
              </div>
            `;
          }).join('');

          // Append efek plus bertambahnya nominal barang kopi jadi matang
          impactHtml += `
            <div class="detail-row-item" style="border-top:1px dashed var(--border); padding-top:var(--space-xs); margin-top:4px;">
              <div class="left-content"><span class="title">${pName}</span></div>
              <strong class="right-value" style="color: #22C55E;">+${prod.qty_produced} ${pUnit}</strong>
            </div>
          `;
          stockImpactCard.innerHTML = impactHtml;
        }

        // ==========================================================================
        // F. RENDERING TIMELINE HISTORICAL DATA
        // ==========================================================================
        const historyTimeline = container.querySelector(".card:nth-child(6) .timeline");
        if (historyTimeline) {
          let dateStr = prod.production_date;
          if (dateStr) {
            const d = new Date(dateStr);
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
          }

          const isKelar = currentStatus === "Ready" || currentStatus === "Selesai";

          historyTimeline.innerHTML = `
            <div class="timeline-item active">
              <div class="timeline-dot"></div>
              <div><h4>Produksi Dibuat</h4><p>${dateStr}</p></div>
            </div>
            <div class="timeline-item active">
              <div class="timeline-dot"></div>
              <div><h4>Produksi Dimulai</h4><p>${isKelar ? 'Selesai Sempurna' : 'Sedang Roasting'}</p></div>
            </div>
            <div class="timeline-item ${isKelar ? 'active' : ''}">
              <div class="timeline-dot"></div>
              <div><h4>Packing</h4><p>${isKelar ? 'Selesai Dikemas' : 'Menunggu'}</p></div>
            </div>
            <div class="timeline-item ${isKelar ? 'active' : ''}">
              <div class="timeline-dot"></div>
              <div><h4>Finished</h4><p>${isKelar ? 'Barang Siap Keliling' : 'Belum selesai'}</p></div>
            </div>
          `;
        }

        // ==========================================================================
        // G. VISIBILITAS ACTION CONTROL BUTTONS
        // ==========================================================================
        if (actionsArea) {
          if (currentStatus === "Ready" || currentStatus === "Selesai") {
            // Jika sudah matang dikemas, kunci tombol & tampilkan tombol kembali murni
            if (finishBtn) finishBtn.style.display = "none";
            if (editBtn) editBtn.style.display = "none";
            if (pauseBtn) pauseBtn.style.display = "none";
            actionsArea.style.justifyContent = "center";
            actionsArea.innerHTML = `<button class="action-btn" style="flex:1;" onclick="window.navigate('produksi-list')">Kembali ke List</button>`;
          } else {
            // Pasang event klik Finish jika statusnya masih berjalan (MTO)
            setupFinishAction(prod);
            if (pauseBtn) pauseBtn.onclick = () => alert("Aktivitas mesin berhasil di-pause sementara gais!");
            if (editBtn) editBtn.onclick = () => alert("Fitur penyesuaian batch resep dalam pengembangan gais!");
          }
        }

        if (window.lucide) window.lucide.createIcons();

      } catch (err) {
        alert("❌ Gagal memuat detail produksi gais: " + err.message);
      }
    }

    // ==========================================================================
    // H. ACTION SUBMIT FINISH: KUNCI NOTA JUALAN JADI 'READY'
    // ==========================================================================
    function setupFinishAction(prod) {
      if (!finishBtn) return;

      const newFinishBtn = finishBtn.cloneNode(true);
      finishBtn.parentNode.replaceChild(newFinishBtn, finishBtn);

      newFinishBtn.addEventListener("click", async () => {
        if (isProcessing) return;
        if (!confirm(`Konfirmasi batch ${prod.production_no}! Sah seluruh proses roasting selesai dan kopi siap dipacking?`)) return;

        isProcessing = true;
        newFinishBtn.disabled = true;
        newFinishBtn.textContent = "Processing...";

        try {
          if (prod.sales_order_id) {
            // Naikkan status sales order penampung di database menjadi 'ready' (Siap bawa keliling)
            const { error: soErr } = await supabase
              .from("sales_orders")
              .update({ status: "ready" })
              .eq("id", prod.sales_order_id);

            if (soErr) throw soErr;
          }

          alert(`🎉 Sukses! Batch ${prod.production_no} dinyatakan matang sempurna gais.`);
          loadProductionDetail(); // Reload UI biar semua baris berubah warna hijau sukses

        } catch (err) {
          alert("❌ Gagal menutup sesi produksi: " + err.message);
        } finally {
          isProcessing = false;
          newFinishBtn.disabled = false;
          newFinishBtn.textContent = "Finish";
        }
      });
    }

    // Eksekusi render data harian
    loadProductionDetail();

  }, 50);

  return `
    <section class="detail-page">

      <div class="card detail-status-card">
        <div>
          <span class="detail-status-title">Status</span>
          <h3 class="font-bold">Memuat...</h3>
        </div>
        <span class="badge badge-info">Diproses</span>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="package"></i></div>
          <h3>Produk Produksi</h3>
        </div>
        <div class="detail-info"><p class="text-xs text-light">Memuat nama item...</p></div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="factory"></i></div>
          <h3>Bahan Meracik</h3>
        </div>
        <div class="detail-info"><p class="text-xs text-light">Menganalisis timbangan bahan baku...</p></div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="activity"></i></div>
          <h3>Progress Produksi</h3>
        </div>
        <div class="timeline"></div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="boxes"></i></div>
          <h3>Stock Impact</h3>
        </div>
        <div class="detail-info"><p class="text-xs text-light">Menghitung dampak mutasi kartu stok...</p></div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="clock-3"></i></div>
          <h3>Timeline</h3>
        </div>
        <div class="timeline"></div>
      </div>

      <div class="detail-actions">
        <button class="action-btn">Pause</button>
        <button class="action-btn">Edit</button>
        <button class="action-btn primary-action">Finish</button>
      </div>

    </section>
  `;
}
