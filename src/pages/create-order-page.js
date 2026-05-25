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

    // Capture elemen DOM kontrol utama sesuai struktur template asli
    const dateInput = container.querySelector("input[type='date']");
    const salesInput = container.querySelector(".form-group:nth-child(2) input[type='text']");
    const customerInput = container.querySelector(".form-group:nth-child(3) input[type='text']");
    const productInput = container.querySelector(".card:nth-child(4) .form-group input[type='text']");
    const addProductBtn = container.querySelector(".btn-soft");
    
    // Ringkasan Biaya & Pembayaran dari DOM
    const summarySubtotal = container.querySelector(".detail-info .detail-row-item:nth-child(1) strong");
    const summaryOngkir = container.querySelector(".detail-info .detail-row-item:nth-child(2) strong");
    const summaryTotal = container.querySelector(".detail-info .detail-row-item:nth-child(3) strong");
    const summaryStatus = container.querySelector(".detail-info .detail-row-item:nth-child(4) strong");
    
    const ongkirInput = container.querySelector("#input-shipping");
    const bayarInput = container.querySelector("#input-payment");
    const catatanInput = container.querySelector(".textarea");
    const sampleToggle = container.querySelector("#sample-order-toggle");

    // Container dinamis untuk menyisipkan list belanjaan order
    const subtotalCard = container.querySelector(".detail-info").closest(".create-card");
    
    let cartContainer = container.querySelector("#dynamic-cart-container");
    if (!cartContainer) {
      cartContainer = document.createElement("div");
      cartContainer.id = "dynamic-cart-container";
      subtotalCard.parentNode.insertBefore(cartContainer, subtotalCard);
    }

    // Suntik element list melayang untuk sales, customer, dan produk (Skema anti-mental)
    const salesGroup = salesInput.closest(".form-group");
    salesGroup.style.position = "relative";
    let salesFloat = document.createElement("div");
    salesFloat.className = "card";
    salesFloat.style = "position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0; background: #2a2a2a;";
    salesGroup.appendChild(salesFloat);

    const customerGroup = customerInput.closest(".form-group");
    customerGroup.style.position = "relative";
    let customerFloat = document.createElement("div");
    customerFloat.className = "card";
    customerFloat.style = "position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0; background: #2a2a2a;";
    customerGroup.appendChild(customerFloat);

    const productGroup = productInput.closest(".form-group");
    productGroup.style.position = "relative";
    let productFloat = document.createElement("div");
    productFloat.className = "card";
    productFloat.style = "position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0; background: #2a2a2a;";
    productGroup.appendChild(productFloat);

    if (dateInput) dateInput.value = today;

    // ==========================================================================
    // 1. LIVE SEARCH SALES
    // ==========================================================================
    if (salesInput) {
      salesInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 1) {
          salesFloat.style.display = "none";
          return;
        }

        const { data: sales, error } = await supabase
          .from('sales')
          .select('id, name')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && sales && sales.length > 0) {
          salesFloat.innerHTML = sales.map(s => `
            <div class="sales-row-item" data-id="${s.id}" data-name="${s.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: #fff;">${s.name}</strong>
            </div>
          `).join('');
          salesFloat.style.display = "block";

          salesFloat.querySelectorAll(".sales-row-item").forEach(row => {
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
    // 2. LIVE SEARCH CUSTOMER
    // ==========================================================================
    if (customerInput) {
      customerInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 1) {
          customerFloat.style.display = "none";
          return;
        }

        const { data: customers, error } = await supabase
          .from('customers')
          .select('id, name')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && customers && customers.length > 0) {
          customerFloat.innerHTML = customers.map(c => `
            <div class="customer-row-item" data-id="${c.id}" data-name="${c.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: #fff;">${c.name}</strong>
            </div>
          `).join('');
          customerFloat.style.display = "block";

          customerFloat.querySelectorAll(".customer-row-item").forEach(row => {
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
    // 3. LIVE SEARCH PRODUK MANUFAKTUR
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
          .select('id, name, price, needs_production')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && products && products.length > 0) {
          productFloat.innerHTML = products.map(p => `
            <div class="product-row-item" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-production="${p.needs_production}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="font-size: var(--text-sm); color: #fff;">${p.name}</strong>
                <span class="text-xs" style="display: block; color: #aaa;">${p.needs_production ? '🟡 Butuh Pabrikasi' : '🟢 Ready Stock'}</span>
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
                price: parseFloat(target.dataset.price || 0),
                needs_production: target.dataset.production === "true"
              };
              productInput.value = target.dataset.name;
              productFloat.style.display = "none";
            });
          });
        }
      });
    }

    // Fungsi Klik Tombol "Tambah"
    if (addProductBtn) {
      addProductBtn.addEventListener("click", () => {
        if (!temporarySelectedProduct) {
          alert("⚠️ Pilih produk dari daftar pencarian terlebih dahulu!");
          return;
        }
        
        if (cart.some(item => item.id === temporarySelectedProduct.id)) {
          alert("⚠️ Produk sudah ada di list keranjang!");
          productInput.value = "";
          temporarySelectedProduct = null;
          return;
        }

        cart.push({
          ...temporarySelectedProduct,
          qty: 1
        });

        productInput.value = "";
        temporarySelectedProduct = null;
        renderCartStructure();
      });
    }

    // ==========================================================================
    // 4. RENDER KARTU BELANJAAN JIPLAK TOTAL DESAIN UI ASLI LO
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
              ${item.name} ${item.needs_production ? '<span style="color: #ffc107; font-size: 11px;">(Pabrikasi)</span>' : ''}
            </strong>
            <button class="btn-remove-cart" data-idx="${idx}" style="background: none; border: none; color: var(--danger); font-size: var(--text-xs); font-weight: var(--font-semibold); padding: var(--space-xs); cursor: pointer;">
              Hapus
            </button>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Qty (Pcs)</label>
              <input type="number" pattern="[0-9]*" inputmode="numeric" class="input input-qty" value="${item.qty}" />
            </div>

            <div class="form-group">
              <label class="form-label">Harga Jual (Rp)</label>
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
      const isSample = sampleToggle?.checked || false;
      const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
      const shippingCost = isSample ? 0 : (parseFloat(ongkirInput?.value) || 0);
      const grandTotal = isSample ? 0 : (subtotalTotal + shippingCost);
      const payAmount = isSample ? 0 : (parseFloat(bayarInput?.value) || 0);
      const sisaKembalian = payAmount - grandTotal;

      if (summarySubtotal) summarySubtotal.textContent = `Rp ${subtotalTotal.toLocaleString('id-ID')}`;
      if (summaryOngkir) summaryOngkir.textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
      if (summaryTotal) summaryTotal.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
      
      if (summaryStatus) {
        summaryStatus.textContent = isSample ? "Sample Mode (Free)" : (sisaKembalian >= 0 ? `Kembalian: Rp ${sisaKembalian.toLocaleString('id-ID')}` : `Kurang: Rp ${Math.abs(sisaKembalian).toLocaleString('id-ID')}`);
      }

      const hasActiveProduction = cart.some(item => item.needs_production === true);
      const actionsArea = container.querySelector(".detail-actions");
      if (actionsArea) {
        const submitBtnReal = actionsArea.querySelector(".primary-action");
        if (submitBtnReal) submitBtnReal.textContent = hasActiveProduction ? "Kirim Pabrik & Simpan" : "Simpan Order";
      }
    }

    // Listener input biaya
    ongkirInput?.addEventListener("input", calculateTotalsOnly);
    bayarInput?.addEventListener("input", calculateTotalsOnly);
    sampleToggle?.addEventListener("change", () => {
      const gridBayar = container.querySelector("#shipping-payment-grid");
      if (gridBayar) gridBayar.style.display = sampleToggle.checked ? "none" : "grid";
      calculateTotalsOnly();
    });

    // Auto close live search ketika klik area luar
    document.addEventListener("click", (e) => {
      if (!salesInput.contains(e.target) && !salesFloat.contains(e.target)) salesFloat.style.display = "none";
      if (!customerInput.contains(e.target) && !customerFloat.contains(e.target)) customerFloat.style.display = "none";
      if (!productInput.contains(e.target) && !productFloat.contains(e.target)) productFloat.style.display = "none";
    });

    // ==========================================================================
    // 5. SUBMIT KE DATABASE & JALUR ANTRIAN MANUFAKTUR
    // ==========================================================================
    const actionsArea = container.querySelector(".detail-actions");
    if (actionsArea) {
      const submitBtn = actionsArea.querySelector(".primary-action");
      const draftBtn = actionsArea.querySelector(".action-btn:not(.primary-action)");

      if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
          if (isSubmitting) return;

          if (!selectedCustomer) {
            alert("⚠️ Harap tentukan customer terlebih dahulu!");
            return;
          }
          if (cart.length === 0) {
            alert("⚠️ Keranjang belanja order masih kosong!");
            return;
          }

          isSubmitting = true;
          submitBtn.disabled = true;
          submitBtn.textContent = "Processing...";

          try {
            const isSample = sampleToggle?.checked || false;
            const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
            const shippingCost = isSample ? 0 : (parseFloat(ongkirInput?.value) || 0);
            const grandTotal = isSample ? 0 : (subtotalTotal + shippingCost);
            const hasActiveProduction = cart.some(item => item.needs_production === true);

            // A. Insert ke tabel orders
            const { data: orderData, error: orderError } = await supabase
              .from('orders')
              .insert([{
                customer_id: selectedCustomer.id,
                sales_id: selectedSales ? selectedSales.id : null,
                order_date: dateInput?.value || today,
                subtotal: subtotalTotal,
                shipping_cost: shippingCost,
                grand_total: grandTotal,
                is_sample: isSample,
                status: hasActiveProduction ? "Pending Production" : "Completed",
                notes: catatanInput?.value || null
              }])
              .select();

            if (orderError) throw orderError;
            const orderId = orderData[0].id;

            // B. Insert item ke tabel order_items
            for (const item of cart) {
              const { error: itemErr } = await supabase
                .from('order_items')
                .insert([{
                  order_id: orderId,
                  product_id: item.id,
                  qty: item.qty,
                  price: item.price
                }]);
              if (itemErr) throw itemErr;
            }

            // C. OTOMATISASI JALUR PABRIKASI (MANUFAKTUR)
            if (hasActiveProduction) {
              const productionPayload = cart
                .filter(item => item.needs_production === true)
                .map(item => ({
                  order_id: orderId,
                  product_id: item.id,
                  qty_target: item.qty,
                  status: "Queued"
                }));

              const { error: mfgErr } = await supabase.from('manufacturing_queue').insert(productionPayload);
              if (mfgErr) throw mfgErr;
            }

            alert(`🎉 Transaksi Order Berhasil Disimpan! ${hasActiveProduction ? 'Item otomatis masuk antrean produksi pabrik.' : ''}`);
            if (window.navigate) window.navigate('order');

          } catch (err) {
            alert("❌ Gagal menyimpan data order: " + err.message);
          } finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = "Simpan";
          }
        });
      }

      if (draftBtn) {
        draftBtn.addEventListener("click", () => {
          if (window.navigate) window.navigate('order');
        });
      }
    }

    if (window.lucide) window.lucide.createIcons();

  }, 50);

  return `
    <section class="create-order-page">

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Tanggal Order</label>
          <input type="date" class="input" />
        </div>
        <div class="form-group">
          <label class="form-label">Sales</label>
          <input type="text" class="input" placeholder="Cari nama sales..." autocomplete="off" />
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Customer / Pelanggan</label>
          <input type="text" class="input" placeholder="Cari nama customer..." autocomplete="off" />
        </div>
      </div>

      <div class="card create-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
          <div>
            <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text);">Produk</h3>
            <p class="text-light text-xs" style="margin-top: 1px;">Tambahkan item order produksi</p>
          </div>

          <button class="btn-soft" style="height: 32px; padding: 0 var(--space-md); border-radius: var(--radius-sm); font-size: var(--text-xs); display: flex; align-items: center; gap: var(--space-xs); border: none; font-weight: var(--font-semibold); color: var(--orange); background: var(--orange-soft);">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
            Tambah
          </button>
        </div>

        <div class="form-group">
          <input type="text" class="input" placeholder="Cari nama barang manufaktur..." autocomplete="off" />
        </div>
      </div>

      <div class="card create-card" style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" id="sample-order-toggle" style="cursor:pointer;" />
          <label for="sample-order-toggle" style="font-size: 14px; cursor:pointer;">Jadikan Sample Order (Tanpa Biaya)</label>
        </div>
      </div>

      <div class="card create-card">
        <div class="detail-info" style="gap: var(--space-sm);">
          <div class="detail-row-item" style="padding: 2px 0;">
            <span class="text-light