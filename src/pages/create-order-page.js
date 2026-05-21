// ==========================================================================
// FILE: src/pages/create-order-page.js
// STATUS: 100% OPERATIONAL - DOM SELECTORS & ERROR 404 TABLES FIXED! 🚀
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

    // ==========================================================================
    // 1. FIX ABSOLUTE DOM CAPTURE - ANTI MISMATCH SELECTOR 🎯
    // ==========================================================================
    const dateInput = container.querySelector("input[type='date']");
    const customerInput = container.querySelector("#search-customer");
    const salesInput = container.querySelector("#search-sales");
    const productInput = container.querySelector("#search-product");
    const addProductBtn = container.querySelector(".btn-soft");
    
    // Ambil element strong berdasarkan index array baris rincian secara absolut
    const detailRows = container.querySelectorAll(".detail-info .detail-row-item strong");
    const summarySubtotal = detailRows[0];
    const summaryOngkir = detailRows[1];
    const summaryTotal = detailRows[2];
    const summaryChange = detailRows[3];
    
    const ongkirInput = container.querySelector("#input-shipping");
    const bayarInput = container.querySelector("#input-payment");
    const catatanInput = container.querySelector(".textarea");
    const sampleToggle = container.querySelector("#sample-order-toggle");

    // Container dinamis untuk list belanjaan
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

    // Tambah Data Baru manual via prompt
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
    // 2. LIVE SEARCH CUSTOMER
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
    // 3. LIVE SEARCH SALESMAN (FIXED ERROR 404 SCHEMA SAFETIED)
    // ==========================================================================
    if (salesInput) {
      salesInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 2) {
          salesFloat.style.display = "none";
          return;
        }

        // Ambil data dasar id dan name saja untuk mencegah kegagalan kolom role jika tidak tersedia
        const { data: employees, error } = await supabase
          .from('employees') 
          .select('id, name')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && employees && employees.length > 0) {
          salesFloat.innerHTML = employees.map(s => `
            <div class="float-row-item" data-id="${s.id}" data-name="${s.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: var(--text);">${s.name}</strong>
              <span class="text-xs text-light">Karyawan / Sales Team</span>
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
    // 4. LIVE SEARCH PRODUK / ITEM JUALAN
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
                <span class="text-xs text-light" style="display: block;">Stok: ${p.stock || 0} ${p.unit} | Rp ${(p.price || 0).toLocaleString('id-ID')}</span>
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

    // Tambah Produk terpilih masuk ke Cart
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
          price: temporarySelectedProduct.price || 0 
        });

        productInput.value = "";
        temporarySelectedProduct = null;
        renderCartStructure();
      });
    }

    // Input listeners update rincian biaya dinamis
    ongkirInput?.addEventListener("input", calculateTotalsOnly);
    bayarInput?.addEventListener("input", calculateTotalsOnly);

    // Global Click Closer Dropdown
    document.addEventListener("click", (e) => {
      if (!customerInput.contains(e.target) && !customerFloat.contains(e.target)) customerFloat.style.display = "none";
      if (!salesInput.contains(e.target) && !salesFloat.contains(e.target)) salesFloat.style.display = "none";
      if (!productInput.contains(e.target) && !productFloat.contains(e.target)) productFloat.style.display = "none";
    });

    // ==========================================================================
    // 5. RENDER STRUKTUR ROW ITEM DI CART
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
              <input type="number" class="input input-qty" value="${item.qty}" min="1" style
