import { supabase } from "../supabaseClient.js";

export function PurchaseDetailPage() {
  let purchaseId = localStorage.getItem("selected_purchase_id");
  let isProcessing = false;

  setTimeout(async () => {
    const container = document.querySelector(".detail-page");
    if (!container || !purchaseId) return;

    // Capture elemen kontrol aksi tombol bawah bawaan lo
    const actionsArea = container.querySelector(".detail-actions");
    const voidBtn = actionsArea?.querySelector("button:nth-child(1)");
    const editBtn = actionsArea?.querySelector("button:nth-child(2)");
    const terimaBtn = actionsArea?.querySelector(".primary-action");

    async function loadPurchaseDetail() {
      try {
        // Fetch detail data induk PO sekalian join data supplier
        const { data: po, error: poErr } = await supabase
          .from("purchase_orders")
          .select(`
            id,
            purchase_no,
            purchase_date,
            status,
            total_amount,
            notes,
            suppliers ( name, phone, address )
          `)
          .eq("id", purchaseId)
          .single();

        if (poErr) throw poErr;

        // Fetch seluruh rincian item anak yang dibeli sekalian ambil info nama & stock produk
        const { data: items, error: itemsErr } = await supabase
          .from("purchase_order_items")
          .select(`
            qty,
            unit_price,
            products ( id, name, stock, unit )
          `)
          .eq("purchase_order_id", purchaseId);

        if (itemsErr) throw itemsErr;

        // ==========================================================================
        // 1. UPDATE CARD STATUS & BADGE VISUAL (SINKRON DATA LAPANGAN)
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
          itemsInfo.innerHTML = items.map(item => {
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
            <div class="detail-row-item">
              <span class="text-light text-sm">Subtotal</span>
              <strong class="text-sm font-semibold">Rp ${(po.total_amount || 0).toLocaleString('id-ID')}</strong>
            </div>
            <div class="detail-row-item">
              <span class="text-light text-sm">Ongkir</span>
              <strong class="text-sm font-semibold">Rp 0</strong>
            </div>
            <div class="detail-row-item" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: 2px;">
              <span class="font-semibold text-sm">Total</span>
              <strong class="right-value" style="color: var(--orange); font-size: var(--text-md);">Rp ${(po.total_amount || 0).toLocaleString('id-ID')}</strong>
            </div>
          `;
        }

        // ==========================================================================
        // 5. RENDERING TIMELINE INTERAKTIF
        // ==========================================================================
        const timelineArea = container.querySelector(".timeline");
        if (timelineArea) {
          let dateStr = po.purchase_date || "";
          if (dateStr) {
            const d = new Date(dateStr);
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
          }

          timelineArea.innerHTML = `
            <div class="timeline-item active">
              <div class="timeline-dot"></div>
              <div>
                <h4>Purchase Dibuat</h4>
                <p>${dateStr}</p>
              </div>
            </div>
            <div class="timeline-item ${po.status === "ordered" ? "active" : ""}">
              <div class="timeline-dot"></div>
              <div>
                <h4>Menunggu Barang</h4>
                <p>${po.status === "ordered" ? "Pending supplier" : "Selesai diantarkan"}</p>
              </div>
            </div>
            <div class="timeline-item ${po.status === "received" ? "active" : ""}">
              <div class="timeline-dot"></div>
              <div>
                <h4>Barang Diterima</h4>
                <p>${po.status === "received" ? "Bahan baku mendarat di gudang" : "Belum diterima"}</p>
              </div>
            </div>
          `;
        }

        // ==========================================================================
        // 6. VISIBILITAS ACTION BUTTONS (SINKRONISASI TOMBOL STATUS)
        // ==========================================================================
        if (actionsArea) {
          if (po.status !== "ordered") {
            // Kalau barang sudah 'received' atau 'void', sembunyikan tombol Terima Barang & Edit
            if (terimaBtn) terimaBtn.style.display = "none";
            if (editBtn) editBtn.style.display = "none";
            if (voidBtn) voidBtn.style.display = "none";
            actionsArea.style.justifyContent = "center";
            actionsArea.innerHTML = `<button class="action-btn" style="flex:1;" onclick="window.navigate('purchase')">Kembali ke List</button>`;
          } else {
            // Jika status masih pending, pasang event klik Terima Barang
            setupTerimaBarangAction(po, items);
            
            if (voidBtn) {
              voidBtn.onclick = async () => {
                if (!confirm("Apakah lo yakin mau membatalkan (Void) transaksi ini?")) return;
                await supabase.from("purchase_orders").update({ status: "void" }).eq("id", purchaseId);
                loadPurchaseDetail();
              };
            }
            if (editBtn) {
              editBtn.onclick = () => alert("Fitur edit pembelian dalam pengembangan gais!");
            }
          }
        }

        if (window.lucide) window.lucide.createIcons();

      } catch (err) {
        alert("Gagal memuat rincian pembelian gais: " + err.message);
      }
    }

    // ==========================================================================
    // 7. SUNTIK LOGIKA TRANS-BERANTAI TERIMA BARANG (TAMBAH STOK & MUTASI)
    // ==========================================================================
    function setupTerimaBarangAction(po, items) {
      if (!terimaBtn) return;

      // Hapus clone listener lama jika ada ganti state harian
      const newTerimaBtn = terimaBtn.cloneNode(true);
      terimaBtn.parentNode.replaceChild(newTerimaBtn, terimaBtn);

      newTerimaBtn.addEventListener("click", async () => {
        if (isProcessing) return;
        if (!confirm(`Konfirmasi bongkar muat fisik! Sah terima nota ${po.purchase_no} dan masukkan ke stok gudang?`)) return;

        isProcessing = true;
        newTerimaBtn.disabled = true;
        newTerimaBtn.textContent = "Processing mutasi...";

        try {
          // A. Ubah status utama di tabel induk purchase_orders menjadi 'received'
          const { error: statusErr } = await supabase
            .from("purchase_orders")
            .update({ status: "received" })
            .eq("id", purchaseId);

          if (statusErr) throw statusErr;

          // B. Looping item detail untuk tambah stok aktual & buat log mutasi 'in'
          for (const item of items) {
            if (!item.products) continue;

            const currentStock = parseFloat(item.products.stock) || 0;
            const incomingQty = parseFloat(item.qty) || 0;
            const finalStock = currentStock + incomingQty;

            // 1. Update nominal angka stok di tabel products resmi bertambah
            const { error: updateStockErr } = await supabase
              .from("products")
              .update({ stock: finalStock })
              .eq("id", item.products.id);

            if (updateStockErr) throw updateStockErr;

            // 2. Buat mutasi riwayat masuk resmi 'type: in' ke tabel stock_mutations
            const { error: mutationErr } = await supabase
              .from("stock_mutations")
              .insert([{
                product_id: item.products.id,
                type: "in",
                qty: incomingQty,
                reference_no: po.purchase_no,
                description: `Bongkar Muat Bahan Baku diterima dari Supplier`
              }]);

            if (mutationErr) throw mutationErr;
          }

          alert(`🎉 Sukses! Nota ${po.purchase_no} Sah Diterima. Stok gudang resmi ditambahkan harian!`);
          loadPurchaseDetail(); // Reload UI biar timeline & badge berubah warna hijau soft

        } catch (err) {
          alert("❌ Gagal memproses penerimaan barang: " + err.message);
        } finally {
          isProcessing = false;
          newTerimaBtn.disabled = false;
          newTerimaBtn.textContent = "Terima Barang";
        }
      });
    }

    // Jalankan load data awal harian
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
          <div class="icon-box">
            <i data-lucide="building-2"></i>
          </div>
          <h3>Supplier</h3>
        </div>

        <div class="detail-info">
          <p class="text-xs text-light">Memuat info supplier...</p>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>
          <h3>Item Pembelian</h3>
        </div>

        <div class="detail-info">
          <p class="text-xs text-light">Memuat item barang...</p>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="wallet"></i>
          </div>
          <h3>Ringkasan</h3>
        </div>

        <div class="detail-info" style="gap: var(--space-sm);">
          <p class="text-xs text-light">Memuat hitungan total...</p>
        </div>
      </div>

      <div class="card detail-card">
        <div class="card-title">
          <div class="icon-box">
            <i data-lucide="clock-3"></i>
          </div>
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
