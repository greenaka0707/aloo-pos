import { supabase } from "../supabaseClient.js";

export function CreatePurchasePage() {
  let selectedSupplier = null;
  let cart = [];
  let isSubmitting = false;
  let temporarySelectedProduct = null; // Menyimpan produk yang sedang dipilih di live search

  const today = new Date().toISOString().split('T')[0];

  setTimeout(async () => {
    const container = document.querySelector(".create-page");
    if (!container) return;

    // Capture elemen DOM kontrol utama dari template aseli lo
    const dateInput = container.querySelector("input[type='date']");
    const supplierInput = container.querySelector(".form-group:nth-child(2) input[type='text']");
    const productInput = container.querySelector(".card:nth-child(2) .form-group input[type='text']");
    const addProductBtn = container.querySelector(".btn-soft");
    
    // Ringkasan Biaya & Pembayaran dari DOM lo
    const summarySubtotal = container.querySelector(".detail-info .detail-row-item:nth-child(1) strong");
    const summaryOngkir = container.querySelector(".detail-info .detail-row-item:nth-child(2) strong");
    const summaryTotal = container.querySelector(".detail-info .detail-row-item:nth-child(3) strong");
    const bayarInput = container.querySelector(".card:nth-child(5) .form-group input");
    const catatanInput = container.querySelector(".textarea");

    // Container dinamis untuk menyisipkan list belanjaan
    const subtotalCard = container.querySelector(".detail-info").closest(".create-card");
    
    let cartContainer = container.querySelector("#dynamic-cart-container");
    if (!cartContainer) {
      cartContainer = document.createElement("div");
      cartContainer.id = "dynamic-cart-container";
      subtotalCard.parentNode.insertBefore(cartContainer, subtotalCard);
    }

    // Suntik element list melayang untuk supplier dan produk (Skema anti-mental)
    const supplierGroup = supplierInput.closest(".form-group");
    supplierGroup.style.position = "relative";
    let supplierFloat = document.createElement("div");
    supplierFloat.className = "card";
    supplierFloat.style = "position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0;";
    supplierGroup.appendChild(supplierFloat);

    const productGroup = productInput.closest(".form-group");
    productGroup.style.position = "relative";
    let productFloat = document.createElement("div");
    productFloat.className = "card";
    productFloat.style = "position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0;";
    productGroup.appendChild(productFloat);

    if (dateInput) dateInput.value = today;

    // ==========================================================================
    // 1. LIVE SEARCH SUPPLIER
    // ==========================================================================
    if (supplierInput) {
      supplierInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 2) {
          supplierFloat.style.display = "none";
          return;
        }

        const { data: suppliers, error } = await supabase
          .from('suppliers')
          .select('id, name, address, supplier_code')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && suppliers && suppliers.length > 0) {
          supplierFloat.innerHTML = suppliers.map(s => `
            <div class="float-row-item" data-id="${s.id}" data-name="${s.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: var(--text);">${s.name}</strong>
              <span class="text-xs text-light">${s.supplier_code} - ${s.address || 'No Address'}</span>
            </div>
          `).join('');
          supplierFloat.style.display = "block";

          supplierFloat.querySelectorAll(".float-row-item").forEach(row => {
            row.addEventListener("click", (evt) => {
              const target = evt.currentTarget;
              selectedSupplier = { id: parseInt(target.dataset.id), name: target.dataset.name };
              supplierInput.value = target.dataset.name;
              supplierFloat.style.display = "none";
            });
          });
        }
      });

      document.addEventListener("click", (e) => {
        if (!supplierInput.contains(e.target) && !supplierFloat.contains(e.target)) {
          supplierFloat.style.display = "none";
        }
      });
    }

    // ==========================================================================
    // 2. LIVE SEARCH BAHAN BAKU / PRODUK
    // ==========================================================================
    if (productInput) {
      productInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 1) {
          productFloat.style.display = "none";
          return;
        }

        const { data: products, error } = await supabase
          .from('products')
          .select('id, name, stock, unit, category')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && products && products.length > 0) {
          productFloat.innerHTML = products.map(p => `
            <div class="product-row-item" data-id="${p.id}" data-name="${p.name}" data-stock="${p.stock || 0}" data-unit="${p.unit || 'kg'}" data-category="${p.category || ''}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="font-size: var(--text-sm); color: var(--text);">${p.name}</strong>
                <span class="text-xs text-light" style="display: block;">Stok: ${p.stock || 0} ${p.unit}</span>
              </div>
            </div>
          `).join('');
          productFloat.style.display = "block";

          productFloat.querySelectorAll(".product-row-item").forEach(row => {
            row.addEventListener("click", (evt) => {
              const target = evt.currentTarget;
              temporarySelectedProduct = {
                id: parseInt(target.dataset.id),
                name: target.dataset.name,
                stock: parseFloat(target.dataset.stock),
                unit: target.dataset.unit,
                category: target.dataset.category
              };
              productInput.value = target.dataset.name;
              productFloat.style.display = "none";
            });
          });
        }
      });
    }

    // Fungsi Klik Tombol "Tambah" Bawaan Template Lo
    if (addProductBtn) {
      addProductBtn.addEventListener("click", () => {
        if (!temporarySelectedProduct) {
          alert("⚠️ Pilih bahan baku dari daftar pencarian terlebih dahulu!");
          return;
        }
        
        if (cart.some(item => item.id === temporarySelectedProduct.id)) {
          alert("⚠️ Barang sudah ada di list keranjang!");
          productInput.value = "";
          temporarySelectedProduct = null;
          return;
        }

        cart.push({
          ...temporarySelectedProduct,
          qty: 100, 
          price: 45000 
        });

        productInput.value = "";
        temporarySelectedProduct = null;
        renderCartStructure();
      });
    }

    // ==========================================================================
    // 3. RENDER KARTU BELANJAAN JIPLAK TOTAL DESAIN UI ASLI LO
    // ==========================================================================
    function renderCartStructure() {
      if (cart.length === 0) {
        cartContainer.innerHTML = "";
        calculateTotalsOnly();
        return;
      }

      cartContainer.innerHTML = cart.map((item, idx) => `
        <div class="card create-card item-cart-row" data-idx="${idx}" style="margin-bottom: var(--space-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--border);">
            <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
              ${item.name}
            </strong>
            <button class="btn-remove-cart" data-idx="${idx}" style="background: none; border: none; color: var(--danger); font-size: var(--text-xs); font-weight: var(--font-semibold); padding: var(--space-xs); cursor: pointer;">
              Hapus
            </button>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Qty (${item.unit})</label>
              <input type="number" pattern="[0-9]*" inputmode="numeric" class="input input-qty" value="${item.qty}" />
            </div>

            <div class="form-group">
              <label class="form-label">Harga Beli (Rp)</label>
              <input type="number" pattern="[0-9]*" inputmode="numeric" class="input input-price" value="${item.price}" />
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px dashed var(--border);">
            <span class="text-light text-xs">Subtotal</span>
            <strong class="row-subtotal-text" style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
              Rp ${(item.qty * item.price).toLocaleString('id-ID')}
            </strong>
          </div>
        </div>
      `).join('');

      cartContainer.querySelectorAll(".item-cart-row").forEach(row => {
        const idx = parseInt(row.dataset.idx);
        const qtyEl = row.querySelector(".input-qty");
        const priceEl = row.querySelector(".input-price");
        const subtotalTextEl = row.querySelector(".row-subtotal-text");

        qtyEl.addEventListener("input", (e) => {
          cart[idx].qty = parseFloat(e.target.value) || 0;
          subtotalTextEl.textContent = `Rp ${(cart[idx].qty * cart[idx].price).toLocaleString('id-ID')}`;
          calculateTotalsOnly();
        });

        priceEl.addEventListener("input", (e) => {
          cart[idx].price = parseFloat(e.target.value) || 0;
          subtotalTextEl.textContent = `Rp ${(cart[idx].qty * cart[idx].price).toLocaleString('id-ID')}`;
          calculateTotalsOnly();
        });
      });

      cartContainer.querySelectorAll(".btn-remove-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(e.target.dataset.idx);
          cart.splice(idx, 1);
          renderCartStructure();
        });
      });

      calculateTotalsOnly();
    }

    function calculateTotalsOnly() {
      const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
      
      if (summarySubtotal) summarySubtotal.textContent = `Rp ${subtotalTotal.toLocaleString('id-ID')}`;
      if (summaryTotal) summaryTotal.textContent = `Rp ${subtotalTotal.toLocaleString('id-ID')}`;
    }

    // ==========================================================================
    // 4. SUBMIT KE DATABASE (HANYA DOKUMEN NOTA PENDING, TANPA POTONG STOK/MUTASI)
    // ==========================================================================
    const actionsArea = container.querySelector(".detail-actions");
    if (actionsArea) {
      const submitBtn = actionsArea.querySelector(".primary-action");
      const draftBtn = actionsArea.querySelector(".action-btn:not(.primary-action)");

      if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
          if (isSubmitting) return;

          if (!selectedSupplier) {
            alert("⚠️ Harap tentukan supplier transaksi terlebih dahulu!");
            return;
          }
          if (cart.length === 0) {
            alert("⚠️ Keranjang belanja bahan baku masih kosong!");
            return;
          }

          isSubmitting = true;
          submitBtn.disabled = true;
          submitBtn.textContent = "Processing...";

          try {
            const purchaseNo = 'PO-' + today.replace(/-/g, '') + '-' + Date.now().toString().slice(-4);
            const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
            const payAmount = parseFloat(bayarInput?.value) || 0;

            // A. Insert data ke tabel induk dengan status 'ordered' (Pending)
            const { data: purchaseData, error: purchaseError } = await supabase
              .from('purchase_orders')
              .insert([{
                purchase_no: purchaseNo,
                purchase_date: dateInput?.value || today,
                supplier_id: selectedSupplier.id,
                total_amount: subtotalTotal,
                net_amount: subtotalTotal,
                payment_status: payAmount >= subtotalTotal ? 'lunas' : (payAmount > 0 ? 'sebagian' : 'belum'),
                status: 'ordered', // ✔️ FIXED: Masuk antrean Pending dulu gais!
                notes: catatanInput?.value || null
              }])
              .select();

            if (purchaseError) throw purchaseError;

            const purchaseOrderId = purchaseData[0].id;

            // B. Murni hanya mencatat ke tabel item anak, TANPA update stok & TANPA mutasi masuk
            for (const item of cart) {
              const { error: itemErr } = await supabase
                .from('purchase_order_items')
                .insert([{
                  purchase_order_id: purchaseOrderId,
                  product_id: item.id,
                  qty: item.qty,
                  unit_price: item.price
                }]);
              if (itemErr) throw itemErr;
              
              // 📝 Catatan: Logika penambahan stok aktual gudang dan pencatatan stock_mutations 'in' 
              // resmi dihapus dari sini. Eksekusinya dipindah penuh ke halaman PurchaseDetailPage!
            }

            alert(`🎉 Transaksi Pembelian ${purchaseNo} Berhasil Disimpan ke Antrean Pending!`);
            if (window.navigate) window.navigate('purchase');

          } catch (err) {
            alert("❌ Gagal menyimpan data pembelian: " + err.message);
          } finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = "Simpan";
          }
        });
      }

      if (draftBtn) {
        draftBtn.addEventListener("click", () => {
          if (window.navigate) window.navigate('purchase');
        });
      }
    }

    if (window.lucide) window.lucide.createIcons();

  }, 50);

  return `
    <section class="create-page">

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Tanggal</label>
          <input type="date" class="input" />
        </div>

        <div class="form-group">
          <label class="form-label">Supplier</label>
          <input type="text" class="input" placeholder="Cari supplier..." autocomplete="off" />
        </div>
      </div>

      <div class="card create-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
          <div>
            <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text);">
              Produk
            </h3>
            <p class="text-light text-xs" style="margin-top: 1px;">Tambahkan item pembelian</p>
          </div>

          <button class="btn-soft" style="height: 32px; padding: 0 var(--space-md); border-radius: var(--radius-sm); font-size: var(--text-xs); display: flex; align-items: center; gap: var(--space-xs); border: none; font-weight: var(--font-semibold); color: var(--orange); background: var(--orange-soft);">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
            Tambah
          </button>
        </div>

        <div class="form-group">
          <input type="text" class="input" placeholder="Cari bahan baku..." autocomplete="off" />
        </div>
      </div>

      <div class="card create-card">
        <div class="detail-info" style="gap: var(--space-sm);">
          <div class="detail-row-item" style="padding: 2px 0;">
            <span class="text-light text-sm">Subtotal</span>
            <strong style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 0</strong>
          </div>

          <div class="detail-row-item" style="padding: 2px 0;">
            <span class="text-light text-sm">Ongkir</span>
            <strong style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 0</strong>
          </div>

          <div class="detail-row-item" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: 4px;">
            <span class="font-semibold text-sm">Total</span>
            <strong class="right-value" style="color: var(--orange); font-size: var(--text-md);">Rp 0</strong>
          </div>
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Bayar</label>
          <input type="number" pattern="[0-9]*" inputmode="numeric" class="input" placeholder="0" />
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Catatan</label>
          <textarea class="textarea" placeholder="Tambahkan catatan pembelian..."></textarea>
        </div>
      </div>

      <div class="detail-actions">
        <button class="action-btn">
          Draft
        </button>
        <button class="action-btn primary-action">
          Simpan
        </button>
      </div>

    </section>
  `;
}
