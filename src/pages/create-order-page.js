// ==========================================================================
// FILE: src/pages/create-order-page.js
// STATUS: 100% MATCH MODUL PEMBELIAN DENGAN EVENT-DOM BUFFER SECURED! 🚀
// ==========================================================================

import { supabase } from "../supabaseClient.js";

export function CreateOrderPage() {
  let selectedCustomer = null;
  let selectedSales = null;
  let cart = [];
  let isSubmitting = false;
  let temporarySelectedProduct = null; // Menyimpan produk yang sedang dipilih di live search

  const today = new Date().toISOString().split('T')[0];

  setTimeout(async () => {
    const container = document.querySelector(".create-order-page");
    if (!container) return;

    // Capture elemen DOM kontrol utama
    const dateInput = container.querySelector("input[type='date']");
    const customerInput = container.querySelector("#search-customer");
    const salesInput = container.querySelector("#search-sales");
    const productInput = container.querySelector("#search-product");
    const addProductBtn = container.querySelector(".btn-soft");
    
    // Ringkasan Biaya & Pembayaran dari DOM
    const summarySubtotal = container.querySelector(".detail-info .detail-row-item:nth-child(1) strong");
    const summaryOngkir = container.querySelector(".detail-info .detail-row-item:nth-child(2) strong");
    const summaryTotal = container.querySelector(".detail-info .detail-row-item:nth-child(3) strong");
    const summaryChange = container.querySelector(".detail-info .detail-row-item:nth-child(4) strong");
    
    const ongkirInput = container.querySelector("#input-shipping");
    const bayarInput = container.querySelector("#input-payment");
    const catatanInput = container.querySelector(".textarea");
    const sampleToggle = container.querySelector("#sample-order-toggle");

    // Container dinamis untuk menyisipkan list belanjaan kasir
    const subtotalCard = container.querySelector(".detail-info").closest(".create-card");
    
    let cartContainer = container.querySelector("#dynamic-cart-container");
    if (!cartContainer) {
      cartContainer = document.createElement("div");
      cartContainer.id = "dynamic-cart-container";
      subtotalCard.parentNode.insertBefore(cartContainer, subtotalCard);
    }

    // Amankan dropdown melayang pembungkus hasil cari (Skema anti-mental)
    const customerGroup = customerInput.closest(".form-group");
    customerGroup.style.position = "relative";
    let customerFloat = container.querySelector("#customer-dropdown-float");
    if (!customerFloat) {
      customerFloat = document.createElement("div");
      customerFloat.id = "customer-dropdown-float";
      customerFloat.className = "card";
      customerFloat.style = "position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0; background: var(--white);";
      customerGroup.appendChild(customerFloat);
    }

    const salesGroup = salesInput.closest(".form-group");
    salesGroup.style.position = "relative";
    let salesFloat = container.querySelector("#sales-dropdown-float");
    if (!salesFloat) {
      salesFloat = document.createElement("div");
      salesFloat.id = "sales-dropdown-float";
      salesFloat.className = "card";
      salesFloat.style = "position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 150px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0; background: var(--white);";
      salesGroup.appendChild(salesFloat);
    }

    const productGroup = productInput.closest(".form-group");
    productGroup.style.position = "relative";
    let productFloat = container.querySelector("#product-dropdown-float");
    if (!productFloat) {
      productFloat = document.createElement("div");
      productFloat.id = "product-dropdown-float";
      productFloat.className = "card";
      productFloat.style = "position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0; background: var(--white);";
      productGroup.appendChild(productFloat);
    }

    if (dateInput) dateInput.value = today;

    // Tambah Data Baru jika tidak ketemu di database
    container.querySelector("#btn-add-customer")?.addEventListener("click", () => {
      const name = prompt("Masukkan nama Customer / Warung baru:");
      if (name) {
        selectedCustomer = { id: 'NEW_CUSTOMER', name: name };
        customerInput.value = name + " (Baru)";
      }
    });

    container.querySelector("#btn-add-sales")?.addEventListener("click", () => {
      const name = prompt("Masukkan nama Salesman baru:");
      if (name) {
        selectedSales = { id: 'NEW_SALES', name: name };
        salesInput.value = name + " (Baru)";
      }
    });

    // ==========================================================================
    // 1. LIVE SEARCH CUSTOMER
    // ==========================================================================
    if (customerInput) {
      customerInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 2) {
          customerFloat.style.display = "none";
          return;
        }

        const { data: customers, error } = await supabase
          .from('customers')
          .select('id, name, phone, address')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && customers && customers.length > 0) {
          customerFloat.innerHTML = customers.map(c => `
            <div class="float-row-item" data-id="${c.id}" data-name="${c.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: var(--text);">${c.name}</strong>
              <span class="text-xs text-light">${c.phone || 'No Phone'} - ${c.address || 'No Address'}</span>
            </div>
          `).join('');
          customerFloat.style.display = "block";

          customerFloat.querySelectorAll(".float-row-item").forEach(row => {
            row.addEventListener("click", (evt) => {
              const target = evt.currentTarget;
              selectedCustomer = { id: parseInt(target.dataset.id), name: target.dataset.name };
              customerInput.value = target.dataset.name;
              customerFloat.style.display = "none";
            });
          });
        }
      });
    }

    // ==========================================================================
    // 2. LIVE SEARCH SALESMAN
    // ==========================================================================
    if (salesInput) {
      salesInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 2) {
          salesFloat.style.display = "none";
          return;
        }

        const { data: employees, error } = await supabase
          .from('employees') 
          .select('id, name, role')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && employees && employees.length > 0) {
          salesFloat.innerHTML = employees.map(s => `
            <div class="float-row-item" data-id="${s.id}" data-name="${s.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: var(--text);">${s.name}</strong>
              <span class="text-xs text-light">Role: ${s.role || 'Sales'}</span>
            </div>
          `).join('');
          salesFloat.style.display = "block";

          salesFloat.querySelectorAll(".float-row-item").forEach(row => {
            row.addEventListener("click", (evt) => {
              const target = evt.currentTarget;
              selectedSales = { id: parseInt(target.dataset.id), name: target.dataset.name };
              salesInput.value = target.dataset.name;
              salesFloat.style.display = "none";
            });
          });
        }
      });
    }

    // ==========================================================================
    // 3. LIVE SEARCH PRODUK / ITEM JUALAN
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
          .select('id, name, stock, unit, price')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && products && products.length > 0) {
          productFloat.innerHTML = products.map(p => `
            <div class="product-row-item" data-id="${p.id}" data-name="${p.name}" data-stock="${p.stock || 0}" data-unit="${p.unit || 'pcs'}" data-price="${p.price || 0}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="font-size: var(--text-sm); color: var(--text);">${p.name}</strong>
                <span class="text-xs text-light" style="display: block;">Stok: ${p.stock || 0} ${p.unit} | Normal: Rp ${(p.price || 0).toLocaleString('id-ID')}</span>
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
                price: parseFloat(target.dataset.price) || 0
              };
              productInput.value = target.dataset.name;
              productFloat.style.display = "none";
            });
          });
        }
      });
    }

    // Klik Tambah Produk Masuk Keranjang
    if (addProductBtn) {
      addProductBtn.addEventListener("click", () => {
        if (!temporarySelectedProduct) {
          alert("⚠️ Pilih produk dari daftar pencarian terlebih dahulu!");
          return;
        }
        
        if (cart.some(item => item.id === temporarySelectedProduct.id)) {
          alert("⚠️ Produk sudah dimasukkan ke dalam keranjang!");
          productInput.value = "";
          temporarySelectedProduct = null;
          return;
        }

        cart.push({
          ...temporarySelectedProduct,
          qty: 1, 
          price: temporarySelectedProduct.price || 15000 
        });

        productInput.value = "";
        temporarySelectedProduct = null;
        renderCartStructure();
      });
    }

    // Dynamic Input Listener untuk Otomatisasi Update Summary Total Belanjaan
    ongkirInput?.addEventListener("input", calculateTotalsOnly);
    bayarInput?.addEventListener("input", calculateTotalsOnly);

    // Global Click Closer Dropdown
    document.addEventListener("click", (e) => {
      if (!customerInput.contains(e.target) && !customerFloat.contains(e.target)) customerFloat.style.display = "none";
      if (!salesInput.contains(e.target) && !salesFloat.contains(e.target)) salesFloat.style.display = "none";
      if (!productInput.contains(e.target) && !productFloat.contains(e.target)) productFloat.style.display = "none";
    });

    // ==========================================================================
    // 4. RENDER STRUKTUR ROW KERANJANG KASIR
    // ==========================================================================
    function renderCartStructure() {
      if (cart.length === 0) {
        cartContainer.innerHTML = "";
        calculateTotalsOnly();
        return;
      }

      cartContainer.innerHTML = cart.map((item, idx) => `
        <div class="card create-card item-cart-row" data-idx="${idx}" style="margin-bottom: var(--space-sm); background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-sm); padding-bottom: 4px; border-bottom: 1px solid var(--border);">
            <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
              ${item.name}
            </strong>
            <button type="button" class="btn-remove-cart" data-idx="${idx}" style="background: none; border: none; color: var(--danger, #EF4444); font-size: var(--text-xs); font-weight: var(--font-semibold); cursor: pointer;">
              Hapus
            </button>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Qty (${item.unit})</label>
              <input type="number" class="input input-qty" value="${item.qty}" min="1" style="text-align: center;" />
            </div>

            <div class="form-group">
              <label class="form-label">Harga Jual (Rp)</label>
              <input type="number" class="input input-price" value="${item.price}" min="0" style="text-align: right;" />
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-sm); padding-top: 4px; border-top: 1px dashed var(--border);">
            <span class="text-light text-xs">Subtotal Item</span>
            <strong class="row-subtotal-text" style="font-size: var(--text-sm); color: var(--text);">
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
      const shippingCost = parseFloat(ongkirInput?.value) || 0;
      const grandTotal = subtotalTotal + shippingCost;
      const paymentAmount = parseFloat(bayarInput?.value) || 0;
      const sisaKembalian = paymentAmount - grandTotal;

      if (summarySubtotal) summarySubtotal.textContent = `Rp ${subtotalTotal.toLocaleString('id-ID')}`;
      if (summaryOngkir) summaryOngkir.textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
      if (summaryTotal) summaryTotal.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
      
      if (summaryChange) {
        summaryChange.textContent = sisaKembalian >= 0 
          ? `Rp ${sisaKembalian.toLocaleString('id-ID')} (Kembalian)` 
          : `Rp ${Math.abs(sisaKembalian).toLocaleString('id-ID')} (Kurang)`;
      }
    }

    // ==========================================================================
    // 5. SUBMIT ACTION KE DATABASE (DRAFT & SIMPAN NYONTEK MODUL LU)
    // ==========================================================================
    const submitBtn = container.querySelector(".primary-action");
    const draftBtn = container.querySelector(".action-btn:not(.primary-action)");

    const executeOrderSubmit = async (statusType) => {
      if (isSubmitting) return;

      if (!selectedCustomer) {
        alert("⚠️ Harap tentukan customer transaksi terlebih dahulu!");
        return;
      }
      if (cart.length === 0) {
        alert("⚠️ Keranjang belanja produk penjualan masih kosong!");
        return;
      }

      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Processing...";

      try {
        const orderNo = 'SO-' + today.replace(/-/g, '') + '-' + Date.now().toString().slice(-4);
        const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
        const shippingCost = parseFloat(ongkirInput?.value) || 0;
        const grandTotal = subtotalTotal + shippingCost;
        const payAmount = parseFloat(bayarInput?.value) || 0;

        // Validasi internal skema Custom Baru jika di-create dadakan via prompt
        let finalCustomerId = selectedCustomer.id;
        if (finalCustomerId === 'NEW_CUSTOMER') {
          const { data: newCust, error: cErr } = await supabase
            .from('customers').insert([{ name: selectedCustomer.name }]).select();
          if (cErr) throw cErr;
          finalCustomerId = newCust[0].id;
        }

        let finalSalesId = selectedSales ? selectedSales.id : null;
        if (finalSalesId === 'NEW_SALES') {
          const { data: newSl, error: sErr } = await supabase
            .from('employees').insert([{ name: selectedSales.name, role: 'Sales' }]).select();
          if (sErr) throw sErr;
          finalSalesId = newSl[0].id;
        }

        // A. Insert ke data induk tabel `orders` / `sales_orders`
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([{
            order_no: orderNo,
            order_date: dateInput?.value || today,
            customer_id: finalCustomerId,
            salesman_id: finalSalesId,
            total_amount: subtotalTotal,
            shipping_cost: shippingCost,
            grand_total: grandTotal,
            payment_amount: payAmount,
            is_sample: sampleToggle?.checked || false,
            status: statusType, // 'draft' atau 'ordered'
            notes: catatanInput?.value || null
          }])
          .select();

        if (orderError) throw orderError;

        const orderId = orderData[0].id;

        // B. Murni masukkan ke list data child tabel `order_items`
        for (const item of cart) {
          const { error: itemErr } = await supabase
            .from('order_items')
            .insert([{
              order_id: orderId,
              product_id: item.id,
              qty: item.qty,
              unit_price: item.price,
              subtotal: item.qty * item.price
            }]);
          if (itemErr) throw itemErr;
        }

        alert(`🎉 Transaksi Penjualan ${orderNo} dengan status [${statusType.toUpperCase()}] Berhasil Disimpan!`);
        if (window.navigate) window.navigate('sales');

      } catch (err) {
        alert("❌ Gagal menyimpan data penjualan: " + err.message);
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Simpan";
      }
    };

    submitBtn?.addEventListener("click", () => executeOrderSubmit('ordered'));
    draftBtn?.addEventListener("click", () => executeOrderSubmit('draft'));

    if (window.lucide) window.lucide.createIcons();

  }, 50);

  return `
    <section class="create-order-page">

      <!-- TOGGLE SAMPLE ORDER MODE -->
      <div class="card create-card" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div>
          <label style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text); display: block;">Sample Order Mode</label>
          <span style="font-size: var(--text-xs); color: var(--text-light); display: block; margin-top: 2px;">Aktifkan untuk pesanan contoh gratis / warung</span>
        </div>
        <div class="toggle-wrapper" style="position: relative; display: inline-block; width: 44px; height: 24px;">
          <input type="checkbox" id="sample-order-toggle" class="toggle-checkbox" style="position: absolute; opacity: 0; width: 0; height: 0;" />
          <label for="sample-order-toggle" class="toggle-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #E2E8F0; transition: .3s; border-radius: 24px;"></label>
        </div>
      </div>

      <!-- FORM UTAMA -->
      <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div class="form-group">
          <label class="form-label">Tanggal Transaksi</label>
          <input type="date" class="input" />
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label class="form-label">Customer</label>
            <button type="button" id="btn-add-customer" style="background: none; border: none; color: #3B82F6; font-size: var(--text-xs); font-weight: var(--font-medium); cursor: pointer; padding: 0;">+ Tambah Baru</button>
          </div>
          <input type="text" id="search-customer" class="input" placeholder="Cari nama warung / customer..." autocomplete="off" />
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label class="form-label">Salesman</label>
            <button type="button" id="btn-add-sales" style="background: none; border: none; color: #3B82F6; font-size: var(--text-xs); font-weight: var(--font-medium); cursor: pointer; padding: 0;">+ Tambah Baru</button>
          </div>
          <input type="text" id="search-sales" class="input" placeholder="Pilih nama sales..." autocomplete="off" />
        </div>
      </div>

      <!-- PENCARIAN PRODUK -->
      <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
          <div>
            <h3 style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text); margin: 0;">Pilih Produk</h3>
          </div>
          <button class="btn-soft" style="height: 32px; padding: 0 var(--space-md); border-radius: var(--radius-sm); font-size: var(--text-xs); display: flex; align-items: center; gap: var(--space-xs); border: none; font-weight: var(--font-semibold); color: var(--orange, #F97316); background: rgba(249,115,22,0.1); cursor: pointer;">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
            Tambah ke Cart
          </button>
        </div>

        <div class="form-group">
          <input type="text" id="search-product" class="input" placeholder="Cari kopi, roastbean, pack..." autocomplete="off" />
        </div>
      </div>

      <!-- RINCIAN BIAYA & SUMMARY -->
      <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div class="detail-info" style="display: flex; flex-direction: column; gap: var(--space-xs);">
          <div class="detail-row-item" style="display: flex; justify-content: space-between; padding: 2px 0;">
            <span class="text-light text-sm">Subtotal Produk</span>
            <strong style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 0</strong>
          </div>

          <div class="detail-row-item" style="display: flex; justify-content: space-between; padding: 2px 0;">
            <span class="text-light text-sm">Ongkos Kirim</span>
            <strong style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 0</strong>
          </div>

          <div class="detail-row-item" style="display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: 4px;">
            <span class="font-semibold text-sm" style="font-weight: var(--font-bold);">Grand Total</span>
            <strong style="color: var(--orange, #F97316); font-size: var(--text-md); font-weight: var(--font-bold);">Rp 0</strong>
          </div>

          <div class="detail-row-item" style="display: flex; justify-content: space-between; padding: 2px 0; color: #64748B;">
            <span class="text-light text-xs">Sisa / Kembalian</span>
            <strong style="font-size: var(--text-xs); font-weight: var(--font-medium);">Rp 0</strong>
          </div>
        </div>
      </div>

      <!-- KOLOM INPUT PEMBAYARAN -->
      <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Nominal Bayar (Rp)</label>
            <input type="number" id="input-payment" class="input" placeholder="0" style="text-align: right;" />
          </div>
          <div class="form-group">
            <label class="form-label">Ongkir (Rp)</label>
            <input type="number" id="input-shipping" class="input" placeholder="0" style="text-align: right;" />
          </div>
        </div>
      </div>

      <!-- CATATAN -->
      <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div class="form-group">
          <label class="form-label">Catatan Nota</label>
          <textarea class="textarea" placeholder="Tambahkan catatan warung atau pengiriman..."></textarea>
        </div>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="detail-actions" style="display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-md);">
        <button type="button" class="action-btn" style="background: #64748B; color: #fff; padding: 0 var(--space-lg); height: 40px; border: none; border-radius: var(--radius-sm); font-weight: var(--font-medium); cursor: pointer;">
          Draft
        </button>
        <button type="button" class="action-btn primary-action" style="background: var(--orange, #F97316); color: #fff; padding: 0 var(--space-lg); height: 40px; border: none; border-radius: var(--radius-sm); font-weight: var(--font-medium); cursor: pointer;">
          Simpan
        </button>
      </div>

    </section>
  `;
}
