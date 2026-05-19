import { supabase } from "../supabaseClient.js";

export default function StockAdjustmentPage() {
  let selectedProduct = null;
  let isSubmitting = false;

  setTimeout(async () => {
    const container = document.querySelector(".adjustment-page");
    if (!container) return;

    const productInput = container.querySelector("#adj-product-search");
    const productFloat = container.querySelector("#adj-product-floating-list");
    const currentStockInfo = container.querySelector("#adj-current-stock-info");
    
    const adjTypeInput = container.querySelector("#adj-type");
    const adjQtyInput = container.querySelector("#adj-qty");
    const adjNotesInput = container.querySelector("#adj-notes");
    
    const submitBtn = container.querySelector("#btn-submit-adjustment");
    const cancelBtn = container.querySelector("#btn-cancel-adjustment");

    // ==========================================================================
    // 1. LIVE SEARCH PRODUK (BAHAN BAKU / PRODUK JADI)
    // ==========================================================================
    if (productInput && productFloat) {
      productInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 1) {
          productFloat.style.display = "none";
          return;
        }

        const { data: products, error } = await supabase
          .from("products")
          .select("id, name, stock, unit, category")
          .ilike("name", `%${val}%`)
          .limit(5);

        if (!error && products) {
          productFloat.innerHTML = products.map(p => `
            <div class="adj-product-row" data-id="${p.id}" data-name="${p.name}" data-stock="${p.stock || 0}" data-unit="${p.unit || 'kg'}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between;">
              <div>
                <strong style="font-size: var(--text-sm); color: var(--text);">${p.name}</strong>
                <span class="text-xs text-light" style="display: block; text-transform: uppercase;">${p.category || 'UNSET'}</span>
              </div>
              <span class="badge ${p.stock > 0 ? 'badge-success' : 'badge-warning'}" style="font-size: 11px; align-self: center;">
                Stok: ${p.stock || 0} ${p.unit || 'kg'}
              </span>
            </div>
          `).join('');
          productFloat.style.display = "block";

          productFloat.querySelectorAll(".adj-product-row").forEach(row => {
            row.addEventListener("click", (evt) => {
              const target = evt.currentTarget;
              selectedProduct = {
                id: parseInt(target.dataset.id),
                name: target.dataset.name,
                stock: parseFloat(target.dataset.stock),
                unit: target.dataset.unit
              };

              productInput.value = target.dataset.name;
              productFloat.style.display = "none";

              // Tampilkan info stok saat ini gais
              if (currentStockInfo) {
                currentStockInfo.innerHTML = `
                  <div style="display:flex; justify-content:space-between; align-items:center; background: var(--bg); padding: var(--space-sm); border-radius: var(--radius-sm); border: 1px dashed var(--border);">
                    <span class="text-xs text-light">Stok Terbaca di Sistem:</span>
                    <strong style="font-size: var(--text-md); color: var(--text);">${selectedProduct.stock.toFixed(2)} ${selectedProduct.unit}</strong>
                  </div>
                `;
                currentStockInfo.style.display = "block";
              }
            });
          });
        }
      });

      document.addEventListener("click", (e) => {
        if (!productInput.contains(e.target) && !productFloat.contains(e.target)) {
          productFloat.style.display = "none";
        }
      });
    }

    // ==========================================================================
    // 2. SUBMIT EKSEKUSI ADJUSMENT KE SUPABASE
    // ==========================================================================
    if (submitBtn) {
      submitBtn.addEventListener("click", async () => {
        if (isSubmitting) return;

        if (!selectedProduct) {
          alert("⚠️ Harap cari dan pilih produk yang mau disesuaikan stoknya gais!");
          return;
        }

        const type = adjTypeInput.value; // 'tambah' atau 'kurang'
        const inputQty = parseFloat(adjQtyInput.value) || 0;
        const notes = adjNotesInput.value.trim();

        if (inputQty <= 0) {
          alert("⚠️ Kuantitas penyesuaian wajib berupa angka positif gais!");
          return;
        }

        if (!notes) {
          alert("⚠️ Alasan penyesuaian (catatan) wajib diisi buat audit gudang!");
          return;
        }

        // Pengaman kalau stok dikurangi melebihi sisa stok sistem gais
        if (type === "kurang" && inputQty > selectedProduct.stock) {
          alert(`⚠️ STOK MINUS!\nJumlah pengurangan (${inputQty} ${selectedProduct.unit}) tidak boleh melebihi stok fisik berjalan (${selectedProduct.stock} ${selectedProduct.unit})!`);
          return;
        }

        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";

        try {
          // Hitung kalkulasi akhir stok baru gais
          const currentStock = selectedProduct.stock;
          const newStock = type === "tambah" ? currentStock + inputQty : currentStock - inputQty;
          
          const mutationType = type === "tambah" ? "in" : "out";
          const referenceNo = 'ADJ-' + Date.now().toString().slice(-6).toUpperCase();

          // A. Update angka stok di tabel products
          const { error: prodErr } = await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", selectedProduct.id);

          if (prodErr) throw prodErr;

          // B. Catat mutasi arus barang ke tabel stock_mutations
          const { error: mutationErr } = await supabase
            .from("stock_mutations")
            .insert([{
              product_id: selectedProduct.id,
              type: mutationType,
              qty: inputQty,
              reference_no: referenceNo,
              description: `🛠️ ADJUSMENT STOK GUDANG: ${notes} (Stok asal ${currentStock} -> ${newStock} ${selectedProduct.unit})`
            }]);

          if (mutationErr) throw mutationErr;

          alert(`🎉 Sukses melakukan penyesuaian stok produk ${selectedProduct.name}!`);
          if (window.navigate) window.navigate('stok');

        } catch (err) {
          alert("❌ Gagal memproses penyesuaian stok: " + err.message);
        } finally {
          isSubmitting = false;
          submitBtn.disabled = false;
          submitBtn.textContent = "Simpan Penyesuaian";
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        if (window.navigate) window.navigate('stok');
      });
    }

  }, 50);

  return `
    <section class="adjustment-page" style="padding-bottom: 60px;">

      <div class="card create-card" style="margin-top: var(--space-sm); border: 1px solid var(--border);">
        
        <div class="form-group" style="position: relative; margin-bottom: var(--space-md);">
          <label class="form-label">Cari Produk / Bahan Baku</label>
          <input type="text" id="adj-product-search" class="input" placeholder="Ketik nama produk yang mau dihitung fisik..." autocomplete="off" />
          <div id="adj-product-floating-list" class="card" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1020; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0;"></div>
        </div>

        <div id="adj-current-stock-info" style="display: none; margin-bottom: var(--space-md);"></div>

        <div class="form-group" style="margin-bottom: var(--space-md);">
          <label class="form-label">Jenis Penyesuaian</label>
          <select id="adj-type" class="input" style="background-color: var(--white); cursor:pointer;">
            <option value="tambah">➕ Tambah Stok (Barang Masuk / Bonus / Selisih Lebih)</option>
            <option value="kurang">➖ Kurangi Stok (Barang Rusak / Menyusut / Tumpah / Selisih Kurang)</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: var(--space-md);">
          <label class="form-label">Jumlah Berat Selisih Fisik (Kuantitas Desimal Masuk Gais)</label>
          <input type="number" step="0.01" id="adj-qty" class="input" pattern="[0-9]*" placeholder="0.00" />
        </div>

        <div class="form-group">
          <label class="form-label">Alasan / Catatan Audit Penyesuaian</label>
          <textarea id="adj-notes" class="textarea" placeholder="Contoh: Hasil opname gudang mingguan, biji kopi menyusut, dsb..." style="height: 80px;"></textarea>
        </div>

      </div>

      <div class="detail-actions" style="margin-top: var(--space-xl); display: flex; gap: var(--space-md); padding: 0 var(--space-xs);">
        <button id="btn-cancel-adjustment" class="action-btn" style="flex: 1; height: 48px; border-radius: var(--radius-md); font-weight: bold; cursor: pointer; border: 1px solid var(--border); background: #f9f9f9;">Batal</button>
        <button id="btn-submit-adjustment" class="action-btn primary-action" style="flex: 1; height: 48px; background: var(--orange); color: white; border: none; border-radius: var(--radius-md); font-weight: bold; cursor: pointer;">Simpan Penyesuaian</button>
      </div>

    </section>
  `;
}
