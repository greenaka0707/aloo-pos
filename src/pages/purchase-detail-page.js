import { supabase } from "../supabaseClient.js";

export function PurchaseDetailPage() {
  let purchaseId = localStorage.getItem("selected_purchase_id");
  let isProcessing = false;
  let fetchedItems = []; // Menyimpan item pesanan awal untuk modal checking

  setTimeout(async () => {
    const container = document.querySelector(".detail-page");
    if (!container || !purchaseId) return;

    // Capture elemen kontrol aksi tombol bawah bawaan lo
    const actionsArea = container.querySelector(".detail-actions");
    const voidBtn = actionsArea?.querySelector("button:nth-child(1)");
    const editBtn = actionsArea?.querySelector("button:nth-child(2)");
    const terimaBtn = actionsArea?.querySelector(".primary-action");

    // Suntik Modal Cek Fisik ke Root Body biar gak kegencet layout
    let checkingModal = document.getElementById("checking-modal");
    if (!checkingModal) {
      checkingModal = document.createElement("div");
      checkingModal.id = "checking-modal";
      checkingModal.style = "position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 99999; display: none; align-items: center; justify-content: center; padding: var(--space-md); font-family: inherit;";
      document.body.appendChild(checkingModal);
    }

    async function loadPurchaseDetail() {
      try {
        // Fetch data induk PO
        const { data: po, error: poErr } = await supabase
          .from("purchase_orders")
          .select(`
            id, purchase_no, purchase_date, status, total_amount, notes,
            suppliers ( name, phone, address )
          `)
          .eq("id", purchaseId)
          .single();

        if (poErr) throw poErr;

        // Fetch seluruh rincian item anak
        const { data: items, error: itemsErr } = await supabase
          .from("purchase_order_items")
          .select(`id, qty, unit_price, product_id, products ( id, name, stock, unit )`)
          .eq("purchase_order_id", purchaseId);

        if (itemsErr) throw itemsErr;
        fetchedItems = items || [];

        // ==========================================================================
        // 1. UPDATE CARD STATUS & BADGE VISUAL
        // ==========================================================================
        const statusCard = container.querySelector(".detail-status-card");
        if (statusCard) {
          const statusTitle = statusCard.querySelector("h3");
          const statusBadge = statusCard.querySelector(".badge");
          
          if (po.status === "ordered") {
            statusTitle.textContent = "Menunggu Penerimaan";
            statusBadge.className = "badge badge-warning";
            statusBadge.textContent = "Pending";
          } else if (po.status === "received") {
            statusTitle.textContent = "Barang Diterima";
            statusBadge.className = "badge badge-success";
            statusBadge.textContent = "Diterima";
          } else if (po.status === "partial") {
            statusTitle.textContent = "Diterima Sebagian";
            statusBadge.className = "badge badge-info";
            statusBadge.textContent = "Partial";
          } else if (po.status === "void") {
            statusTitle.textContent = "Nota Dibatalkan";
            statusBadge.className = "badge badge-danger";
            statusBadge.textContent = "Void";
          }
        }

        // ==========================================================================
        // 2. RENDERING DATA SUPPLIER
        // ==========================================================================
        const supplierInfo = container.querySelector(".card:nth-child(2) .detail-info");
        if (supplierInfo && po.suppliers) {
          supplierInfo.innerHTML = `
            <div class="info-item"><span>Nama</span><strong>${po.suppliers.name || "-"}</strong></div>
            <div class="info-item"><span>Telepon</span><strong>${po.suppliers.phone || "-"}</strong></div>
            <div class="info-item"><span>Alamat</span><strong>${po.suppliers.address || "-"}</strong></div>
          `;
        }

        // ==========================================================================
        // 3. RENDERING RINCIAN ITEM PEMBELIAN DINAMIS
        // ==========================================================================
        const itemsInfo = container.querySelector(".card:nth-child(3) .detail-info");
        if (itemsInfo) {
          itemsInfo.innerHTML = fetchedItems.map(item => {
            const pName = item.products?.name || "Produk Terhapus";
            const pUnit = item.products?.unit || "kg";
            const subtotalItem = (parseFloat(item.qty) || 0) * (parseFloat(item.unit_price) || 0);
            
            return `
              <div class="detail-row-item">
                <div class="left-content">
                  <strong class="title">${pName}</strong>
                  <span class="subtitle">${item.qty} ${pUnit} × Rp ${(item.unit_price || 0).toLocaleString('id-ID')}</span>
                </div>
                <strong class="right-value">Rp ${subtotalItem.toLocaleString('id-ID')}</strong>
              </div>
            `;
          }).join('');
        }

        // ==========================================================================
        // 4. RENDERING RINGKASAN TOTAL BIAYA
        // ==========================================================================
        const ringkasanInfo = container.querySelector(".card:nth-child(4) .detail-info");
        if (ringkasanInfo) {
          ringkasanInfo.innerHTML = `
            <div class="detail-row-item"><span>Subtotal</span><strong class="text-sm font-semibold">Rp ${(po.total_amount || 0).toLocaleString('id-ID')}</strong></div>
            <div class="detail-row-item"><span>Ongkir</span><strong class="text-sm font-semibold">Rp 0</strong></div>
            <div class="detail-row-item" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: 2px;">
              <span>Total</span>
              <strong class="right-value" style="color: var(--orange); font-size: var(--text-md);">Rp ${(po.total_amount || 0).toLocaleString('id-ID')}</strong>
            </div>
          `;
        }

        // ==========================================================================
        // 5. RENDERING TIMELINE INTERAKTIF
        // ==========================================================================
        const timelineArea = container.querySelector(".timeline");
        if (timelineArea) {
          let dateStr = po.purchase_date;
          if (dateStr) {
            const d = new Date(dateStr);
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
          }

          timelineArea.innerHTML = `
            <div class="timeline-item active"><div class="timeline-dot"></div><div><h4>Purchase Dibuat</h4><p>${dateStr}</p></div></div>
            <div class="timeline-item ${po.status === "ordered" ? "active" : ""}"><div class="timeline-dot"></div><div><h4>Menunggu Barang</h4><p>${po.status === "ordered" ? "Pending supplier" : "Selesai diantarkan"}</p></div></div>
            <div class="timeline-item ${po.status !== "ordered" && po.status !== "void" ? "active" : ""}"><div class="timeline-dot"></div><div><h4>Barang Diterima</h4><p>${po.status === "received" ? "Bahan baku full mendarat" : (po.status === "partial" ? "Diterima Sebagian (Partial)" : "Belum diterima")}</p></div></div>
          `;
        }

        // ==========================================================================
        // 6. ACTION BUTTONS HANDLING
        // ==========================================================================
        if (actionsArea) {
          if (po.status !== "ordered") {
            // Jika sudah dikunci received/partial/void, hilangkan tombol edit & terima
            if (terimaBtn) terimaBtn.style.display = "none";
            if (editBtn) editBtn.style.display = "none";
            if (voidBtn) voidBtn.style.display = "none";
            actionsArea.style.justifyContent = "center";
            actionsArea.innerHTML = `<button class="action-btn" style="flex:1;" onclick="window.navigate('purchase')">Kembali ke List</button>`;
          } else {
            // Masih pending: Kaitkan tombol "Terima Barang" ke Modal Check Fisik!
            if (terimaBtn) {
              terimaBtn.onclick = () => openCheckingModal(po);
            }
            if (voidBtn) {
              voidBtn.onclick = async () => {
                if (!confirm("Void nota purchase ini gais?")) return;
                await supabase.from("purchase_orders").update({ status: "void" }).eq("id", purchaseId);
                loadPurchaseDetail();
              };
            }
          }
        }

        if (window.lucide) window.lucide.createIcons();

      } catch (err) {
        alert("Gagal load rincian gais: " + err.message);
      }
    }

    // ==========================================================================
    // 7. INTERFACES MODAL CEK FISIK GUDANG (ANTI-KEYBOARD MENTAL)
    // ==========================================================================
    function openCheckingModal(po) {
      checkingModal.innerHTML = `
        <div class="card" style="width: 100%; max-width: 420px; background: var(--white); padding: var(--space-lg); border-radius: var(--radius-md); box-shadow: 0 10px 25px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
          <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); margin-bottom: 2px; color: var(--text);">🔍 Cek Fisik Muatan</h3>
          <p class="text-light text-xs" style="margin-bottom: var(--space-md);">Sesuaikan angka Qty sesuai barang turun dari truk</p>
          
          <div id="modal-items-list" style="display: flex; flex-direction: column; gap: var(--space-sm); margin-bottom: var(--space-lg);">
            ${fetchedItems.map((item, idx) => `
              <div style="padding: var(--space-sm); background: #f9f9f9; border: 1px solid var(--border); border-radius: var(--radius-sm);">
                <strong style="font-size: var(--text-xs); color: var(--text); display: block; margin-bottom: var(--space-xs);">${item.products?.name}</strong>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-md);">
                  <span class="text-xs text-light">Nota Pesanan: <strong>${item.qty} ${item.products?.unit || 'kg'}</strong></span>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <input type="number" pattern="[0-9]*" inputmode="numeric" class="input modal-qty-input" data-idx="${idx}" value="${item.qty}" style="width: 90px; height: 32px; padding: 0 6px; font-size: var(--text-sm); text-align: center;" />
                    <span class="text-xs font-semibold" style="color: var(--text);">${item.products?.unit || 'kg'}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: var(--space-md); justify-content: flex-end;">
            <button id="close-modal-btn" style="background: var(--border); border:none; padding: 0 var(--space-md); border-radius: var(--radius-sm); height:38px; cursor:pointer; font-size:var(--text-xs);">Batal</button>
            <button id="submit-checking-btn" style="background: var(--orange); color: white; border:none; padding: 0 var(--space-md); border-radius: var(--radius-sm); height:38px; font-weight:bold; cursor:pointer; font-size:var(--text-xs);">Konfirmasi Masuk Stok</button>
          </div>
        </div>
      `;

      checkingModal.style.display = "flex";

      // Event button close modal
      checkingModal.querySelector("#close-modal-btn").onclick = () => {
        checkingModal.style.display = "none";
      };

      // Event button Submit Cek Fisik Berantai
      const submitCheckBtn = checkingModal.querySelector("#submit-checking-btn");
      submitCheckBtn.onclick = async () => {
        if (isProcessing) return;

        // Capture data inputan real-time dari modal checking
        const qtyInputs = checkingModal.querySelectorAll(".modal-qty-input");
        let itemUpdates = [];
        let isPartialUpdate = false;

        for (let input of qtyInputs) {
          const idx = parseInt(input.dataset.idx);
          const originalQty = parseFloat(fetchedItems[idx].qty);
          const verifiedQty = parseFloat(input.value) || 0;

          if (verifiedQty < 0) {
            alert("⚠️ Qty barang masuk tidak valid!");
            return;
          }

          if (verifiedQty < originalQty) {
            isPartialUpdate = true; // Jika ada 1 barang aja yang kurang, set status jadi Partial
          }

          itemUpdates.push({
            dbItemId: fetchedItems[idx].id,
            productId: fetchedItems[idx].products.id,
            currentStock: parseFloat(fetchedItems[idx].products.stock) || 0,
            verifiedQty: verifiedQty
          });
        }

        if (!confirm("Apakah data cek fisik sudah benar dan siap dimasukkan ke pembukuan gudang?")) return;

        isProcessing = true;
        submitCheckBtn.disabled = true;
        submitCheckBtn.textContent = "Processing stok...";

        try {
          // A. Tentukan status final: partial jika kurang, received jika full pas
          const finalStatus = isPartialUpdate ? "partial" : "received";

          // 1. Update status nota induk di purchase_orders
          const { error: poErr } = await supabase
            .from("purchase_orders")
            .update({ status: finalStatus })
            .eq("id", purchaseId);

          if (poErr) throw poErr;

          // B. Looping eksekusi updates & mutasi resmi per item
          for (let update of itemUpdates) {
            // 2. Update angka qty real hasil cek fisik ke purchase_order_items (biar sinkron)
            await supabase
              .from("purchase_order_items")
              .update({ qty: update.verifiedQty })
              .eq("id", update.dbItemId);

            // 3. Tambahkan ke stok produk riil di gudang lo gais
            const finalStockGudang = update.currentStock + update.verifiedQty;
            await supabase
              .from("products")
              .update({ stock: finalStockGudang })
              .eq("id", update.productId);

            // 4. Catat mutasi masuk riil harian ke stock_mutations
            await supabase
              .from("stock_mutations")
              .insert([{
                product_id: update.productId,
                type: "in",
                qty: update.verifiedQty,
                reference_no: po.purchase_no,
                description: `Bongkar muat terverifikasi (Status: ${finalStatus.toUpperCase()})`
              }]);
          }

          checkingModal.style.display = "none";
          alert(`🎉 Cek fisik selesai! Status nota sekarang: ${finalStatus.toUpperCase()}. Stok gudang terupdate!`);
          loadPurchaseDetail(); // Refresh halaman UI utama

        } catch (err) {
          alert("❌ Gagal memproses cek fisik: " + err.message);
        } finally {
          isProcessing = false;
          submitCheckBtn.disabled = false;
          submitCheckBtn.textContent = "Konfirmasi Masuk Stok";
        }
      };
    }

    // Eksekusi load data awal
    loadPurchaseDetail();

  }, 50);

  return `
    <section class="detail-page">

      <div class="card detail-status-card">
        <div>
          <span class="detail-status-title">Status</span>
          <h3 class="font-bold">Memuat...</h3>
        </div>
        <span class="badge badge-warning">Pending</span>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="building-2"></i></div>
          <h3>Supplier</h3>
        </div>
        <div class="detail-info">
          <p class="text-xs text-light">Memuat info supplier...</p>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="package"></i></div>
          <h3>Item Pembelian</h3>
        </div>
        <div class="detail-info">
          <p class="text-xs text-light">Memuat item barang...</p>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="wallet"></i></div>
          <h3>Ringkasan</h3>
        </div>
        <div class="detail-info" style="gap: var(--space-sm);">
          <p class="text-xs text-light">Memuat hitungan total...</p>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box"><i data-lucide="clock-3"></i></div>
          <h3>Timeline</h3>
        </div>
        <div class="timeline"></div>
      </div>

      <div class="detail-actions">
        <button class="action-btn">Void</button>
        <button class="action-btn">Edit</button>
        <button class="action-btn primary-action">Terima Barang</button>
      </div>

    </section>
  `;
}
