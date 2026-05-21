// ==========================================================================
// FILE: src/pages/create-order-page.js
// STATUS: 100% OPERATIONAL - PRODUCT LIVE SEARCH COLUMNS SYNCHRONIZED! 🚀
// ==========================================================================

import { supabase } from "../supabaseClient.js";

export function CreateOrderPage() {
  let selectedCustomer = null;
  let selectedSales = null;
  let cart = [];
  let isSubmitting = false;

  // State internal manajemen antrean manufaktur produk
  let manufacturingItems = [];
  let currentActiveProductionProduct = null;

  const today = new Date().toISOString().split('T')[0];

  setTimeout(async () => {
    const container = document.querySelector(".create-order-page");
    if (!container) return;

    // ==========================================================================
    // 1. ABSOLUTE DOM CAPTURE
    // ==========================================================================
    const dateInput = container.querySelector("input[type='date']");
    const customerInput = container.querySelector("#search-customer");
    const salesInput = container.querySelector("#search-sales");
    const productInput = container.querySelector("#search-product");
    const cartContainer = container.querySelector("#dynamic-cart-container");
    
    const detailRows = container.querySelectorAll(".detail-info .detail-row-item strong");
    const summarySubtotal = detailRows[0];
    const summaryOngkir = detailRows[1];
    const summaryTotal = detailRows[2];
    const summaryChange = detailRows[3];
    
    const ongkirInput = container.querySelector("#input-shipping");
    const bayarInput = container.querySelector("#input-payment");
    const catatanInput = container.querySelector(".textarea");
    const sampleToggle = container.querySelector("#sample-order-toggle");

    // Modal Customer DOM Capture
    const modal = container.querySelector("#customer-modal-overlay");
    const modalCustNameInput = container.querySelector("#modal-cust-name"); 
    const modalPhone = container.querySelector("#modal-cust-phone");
    const modalAddress = container.querySelector("#modal-cust-address");
    const modalCancel = container.querySelector("#btn-modal-cancel");
    const modalSave = container.querySelector("#btn-modal-save");

    // ⚙️ Modal Produksi / Manufaktur Bahan Baku DOM Capture
    const prodModal = container.querySelector("#production-modal-overlay");
    const prodModalTitle = container.querySelector("#prod-modal-title");
    const rawMaterialInput = container.querySelector("#search-raw-material");
    const rawMaterialFloat = container.querySelector("#raw-material-dropdown-float");
    const rawMaterialCart = container.querySelector("#production-cart-container");
    const btnProdModalCancel = container.querySelector("#btn-prod-modal-cancel");
    const btnProdModalSave = container.querySelector("#btn-prod-modal-save");

    // Dropdown initialization
    const customerGroup = customerInput.closest(".form-group");
    customerGroup.style.position = "relative";
    let customerFloat = container.querySelector("#customer-dropdown-float");
    if (!customerFloat) {
      customerFloat = document.createElement("div");
      customerFloat.id = "customer-dropdown-float";
      customerFloat.className = "card";
      customerFloat.style = "position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 220px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0; background: var(--white);";
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

    // Logic interaksi runtime toggle Sample Mode
    if (sampleToggle) {
      sampleToggle.addEventListener("change", (e) => {
        const slider = e.target.nextElementSibling;
        if (e.target.checked) {
          slider.style.backgroundColor = "var(--orange, #F97316)";
          if (ongkirInput) ongkirInput.value = 0;
          if (bayarInput) bayarInput.value = 0;
          if (ongkirInput) ongkirInput.disabled = true;
          if (bayarInput) bayarInput.disabled = true;
        } else {
          slider.style.backgroundColor = "#E2E8F0";
          if (ongkirInput) ongkirInput.disabled = false;
          if (bayarInput) bayarInput.disabled = false;
        }
        calculateTotalsOnly();
      });
    }

    // ==========================================================================
    // 2. LIVE SEARCH & MODAL INTERACTION LISTENERS
    // ==========================================================================
    
    // --- CUSTOMER LIVE SEARCH ---
    if (customerInput) {
      customerInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 2) {
          customerFloat.style.display = "none";
          return;
        }
        const { data: customers, error } = await supabase
          .from('customers').select('id, name, phone, address').ilike('name', `%${val}%`).limit(5);

        let htmlContent = "";
        if (!error && customers && customers.length > 0) {
          htmlContent = customers.map(c => `
            <div class="float-row-item customer-item" data-id="${c.id}" data-name="${c.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: var(--text);">${c.name}</strong>
              <span class="text-xs text-light">${c.phone || 'No Phone'} - ${c.address || 'No Address'}</span>
            </div>
          `).join('');
        }

        htmlContent += `
          <div id="dropdown-add-customer-trigger" data-name="${val}" style="padding: var(--space-sm); background: #F0F9FF; color: #0284C7; cursor: pointer; border-top: 1px solid var(--border); font-size: var(--text-sm); font-weight: var(--font-medium); text-align: center;">
            + Tambah "${val}" Sebagai Customer Baru
          </div>
        `;

        customerFloat.innerHTML = htmlContent;
        customerFloat.style.display = "block";

        customerFloat.querySelectorAll(".customer-item").forEach(row => {
          row.addEventListener("click", (evt) => {
            const target = evt.currentTarget;
            selectedCustomer = { id: parseInt(target.dataset.id), name: target.dataset.name };
            customerInput.value = target.dataset.name;
            customerFloat.style.display = "none";
            const label = customerGroup.querySelector(".form-label");
            if (label) label.innerHTML = `Customer`; 
          });
        });

        customerFloat.querySelector("#dropdown-add-customer-trigger")?.addEventListener("click", (evt) => {
          const newName = evt.currentTarget.dataset.name;
          customerFloat.style.display = "none";
          if (modal) {
            modalCustNameInput.value = newName;
            modalPhone.value = "";
            modalAddress.value = "";
            modal.style.opacity = "1";
            modal.style.visibility = "visible";
          }
        });
      });
    }

    modalCancel?.addEventListener("click", () => { 
      if (modal) { modal.style.opacity = "0"; modal.style.visibility = "hidden"; }
    });

    modalSave?.addEventListener("click", () => {
      const finalName = modalCustNameInput.value.trim(); 
      if (!finalName) { alert("⚠️ Nama customer tidak boleh kosong!"); return; }
      selectedCustomer = { id: 'NEW_CUSTOMER', name: finalName, phone: modalPhone.value.trim() || null, address: modalAddress.value.trim() || null };
      customerInput.value = finalName;
      const label = customerGroup.querySelector(".form-label");
      if (label) {
        label.innerHTML = `Customer <span style="color: var(--orange, #F97316); font-size: 11px; font-weight: 600; margin-left: 2px;">(Baru)</span>`;
      }
      if (modal) { modal.style.opacity = "0"; modal.style.visibility = "hidden"; }
    });

    // --- SALESMEN LIVE SEARCH ---
    if (salesInput) {
      salesInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 2) {
          salesFloat.style.display = "none";
          return;
        }
        const { data: salesmen, error } = await supabase
          .from('salesmen').select('id, name, sales_code, area_tugas').ilike('name', `%${val}%`).limit(5);

        let htmlContent = "";
        if (!error && salesmen && salesmen.length > 0) {
          htmlContent = salesmen.map(s => `
            <div class="float-row-item sales-item" data-id="${s.id}" data-name="${s.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: var(--text);">${s.name}</strong>
              <span class="text-xs text-light">${s.sales_code || 'No Code'} - ${s.area_tugas || 'Sales Team'}</span>
            </div>
          `).join('');
        }

        htmlContent += `
          <div id="dropdown-add-sales-trigger" data-name="${val}" style="padding: var(--space-sm); background: #F0F9FF; color: #0284C7; cursor: pointer; border-top: 1px solid var(--border); font-size: var(--text-sm); font-weight: var(--font-medium); text-align: center;">
            + Tambah "${val}" Sebagai Salesman Baru
          </div>
        `;

        salesFloat.innerHTML = htmlContent;
        salesFloat.style.display = "block";

        salesFloat.querySelectorAll(".sales-item").forEach(row => {
          row.addEventListener("click", (evt) => {
            const target = evt.currentTarget;
            selectedSales = { id: parseInt(target.dataset.id), name: target.dataset.name };
            salesInput.value = target.dataset.name;
            salesFloat.style.display = "none";
            const label = salesGroup.querySelector(".form-label");
            if (label) label.innerHTML = `Salesman`;
          });
        });

        salesFloat.querySelector("#dropdown-add-sales-trigger")?.addEventListener("click", (evt) => {
          const newName = evt.currentTarget.dataset.name;
          selectedSales = { id: 'NEW_SALES', name: newName };
          salesInput.value = newName;
          const label = salesGroup.querySelector(".form-label");
          if (label) {
            label.innerHTML = `Salesman <span style="color: var(--orange, #F97316); font-size: 11px; font-weight: 600; margin-left: 2px;">(Baru)</span>`;
          }
          salesFloat.style.display = "none";
        });
      });
    }

    // --- PRODUCT LIVE SEARCH (FIXED COLUMNS SELECTOR 🎯) ---
    if (productInput) {
      productInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 1) { productFloat.style.display = "none"; return; }
        
        // 🛠️ SINKRONISASI DATABASENYA DISINI GAIS: Ganti kolom 'category' jadi 'type' bawaan asli DB lo!
        const { data: products, error } = await supabase
          .from('products')
          .select('id, name, stock, unit, price, type') 
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && products && products.length > 0) {
          productFloat.innerHTML = products.map(p => `
            <div class="product-row-item" data-id="${p.id}" data-name="${p.name}" data-stock="${p.stock || 0}" data-unit="${p.unit || 'pcs'}" data-price="${p.price || 0}" data-type="${p.type || ''}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
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
              const prodId = parseInt(target.dataset.id);
              const currentStock = parseFloat(target.dataset.stock) || 0;
              const isRawMaterial = target.dataset.type?.toLowerCase() === 'bahan baku';

              if (cart.some(item => item.id === prodId)) {
                alert("⚠️ Produk sudah dimasukkan ke dalam keranjang!");
                productInput.value = ""; productFloat.style.display = "none"; return;
              }

              const productData = {
                id: prodId,
                name: target.dataset.name,
                stock: currentStock,
                unit: target.dataset.unit,
                price: parseFloat(target.dataset.price) || 0,
                qty: 1,
                is_raw: isRawMaterial,
                needs_production: false,
                raw_materials: null
              };

              // Jalur intercept awal jika stok awal barang emang sisa 0/minus
              if (!isRawMaterial && currentStock <= 0) {
                const proceedProduction = confirm(`⚠️ Stok "${productData.name}" kosong (0). Produk otomatis dialihkan ke antrean PROSES PRODUKSI. Tentukan komposisi kebutuhan bahan bakunya?`);
                if (proceedProduction) {
                  triggerProductionModal(productData);
                  productInput.value = ""; productFloat.style.display = "none"; return;
                }
              }

              cart.push(productData);
              productInput.value = ""; productFloat.style.display = "none";
              renderCartStructure(); 
            });
          });
        } else {
          productFloat.innerHTML = `<div style="padding: var(--space-sm); text-align: center; color: var(--text-light); font-size: var(--text-xs);">Produk tidak ditemukan</div>`;
          productFloat.style.display = "block";
        }
      });
    }

    // --- LIVE SEARCH BAHAN BAKU DI DALAM MODAL MANUFAKTUR ---
    if (rawMaterialInput) {
      rawMaterialInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 1) { rawMaterialFloat.style.display = "none"; return; }
        
        const { data: raws, error } = await supabase
          .from('products')
          .select('id, name, stock, unit')
          .eq('type', 'bahan baku') // 🛠️ Ganti kolom ke 'type' gais!
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && raws && raws.length > 0) {
          rawMaterialFloat.innerHTML = raws.map(r => `
            <div class="raw-item-row" data-id="${r.id}" data-name="${r.name}" data-unit="${r.unit || 'kg'}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: var(--text);">${r.name}</strong>
              <span class="text-xs text-light">Stok Gudang: ${r.stock || 0} ${r.unit}</span>
            </div>
          `).join('');
          rawMaterialFloat.style.display = "block";

          rawMaterialFloat.querySelectorAll(".raw-item-row").forEach(row => {
            row.onclick = (evt) => {
              const t = evt.currentTarget;
              const rId = parseInt(t.dataset.id);

              if (manufacturingItems.some(i => i.id === rId)) {
                alert("⚠️ Bahan baku ini sudah dimasukkan ke list!");
                rawMaterialInput.value = ""; rawMaterialFloat.style.display = "none"; return;
              }

              manufacturingItems.push({
                id: rId,
                name: t.dataset.name,
                unit: t.dataset.unit,
                qty: 1
              });

              rawMaterialInput.value = "";
              rawMaterialFloat.style.display = "none";
              renderProductionCart();
            };
          });
        } else {
          rawMaterialFloat.innerHTML = `<div style="padding: var(--space-sm); text-align: center; color: var(--text-light); font-size: var(--text-xs);">Bahan baku tidak ditemukan</div>`;
          rawMaterialFloat.style.display = "block";
        }
      });
    }

    // [Wadah fungsi render visual cart dan hitung tetap berjalan utuh aman gais]
    function triggerProductionModal(productData) {
      currentActiveProductionProduct = productData;
      manufacturingItems = []; 
      if (prodModal) {
        prodModalTitle.textContent = productData.name;
        rawMaterialInput.value = "";
        rawMaterialCart.innerHTML = `<div style="text-align: center; color: var(--text-light); font-size: var(--text-xs); font-style: italic; padding: var(--space-md);">Belum ada bahan baku yang dipilih</div>`;
        prodModal.style.opacity = "1";
        prodModal.style.visibility = "visible";
      }
    }

    function renderProductionCart() {
      if (manufacturingItems.length === 0) {
        rawMaterialCart.innerHTML = `<div style="text-align: center; color: var(--text-light); font-size: var(--text-xs); font-style: italic; padding: var(--space-md);">Belum ada bahan baku yang dipilih</div>`;
        return;
      }
      rawMaterialCart.innerHTML = manufacturingItems.map((item, idx) => `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); padding: var(--space-xs) 0; border-bottom: 1px dashed var(--border);">
          <span style="font-size: var(--text-xs); font-weight: 600; color: var(--text); flex: 1;">${item.name}</span>
          <div style="width: 90px;">
            <input type="number" step="any" inputmode="decimal" class="input input-raw-qty" data-idx="${idx}" value="${item.qty}" style="height: 32px; text-align: center; font-size: var(--text-xs); padding: 0 4px;" />
          </div>
          <span style="font-size: var(--text-xs); color: var(--text-light); width: 30px;">${item.unit}</span>
          <button type="button" class="btn-remove-raw" data-idx="${idx}" style="background:none; border:none; color:var(--danger, #EF4444); font-size:var(--text-xs); cursor:pointer;">✕</button>
        </div>
      `).join('');

      rawMaterialCart.querySelectorAll(".input-raw-qty").forEach(inp => {
        inp.addEventListener("input", (e) => {
          const idx = parseInt(e.target.dataset.idx);
          manufacturingItems[idx].qty = parseFloat(e.target.value.replace(/,/g, '.')) || 0;
        });
      });

      rawMaterialCart.querySelectorAll(".btn-remove-raw").forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.target.dataset.idx);
          manufacturingItems.splice(idx, 1);
          renderProductionCart();
        };
      });
    }

    btnProdModalCancel?.addEventListener("click", () => {
      prodModal.style.opacity = "0"; prodModal.style.visibility = "hidden";
      if (currentActiveProductionProduct && currentActiveProductionProduct.inCartIndex !== undefined) {
        const origIdx = currentActiveProductionProduct.inCartIndex;
        cart[origIdx].qty = cart[origIdx].stock > 0 ? cart[origIdx].stock : 1;
        renderCartStructure();
      }
      currentActiveProductionProduct = null;
    });

    btnProdModalSave?.addEventListener("click", () => {
      if (manufacturingItems.length === 0) {
        alert("⚠️ Masukkan minimal 1 jenis bahan baku untuk kebutuhan produksi!"); return;
      }
      if (currentActiveProductionProduct) {
        currentActiveProductionProduct.needs_production = true;
        currentActiveProductionProduct.raw_materials = [...manufacturingItems];
        if (currentActiveProductionProduct.inCartIndex !== undefined) {
          const targetIndex = currentActiveProductionProduct.inCartIndex;
          cart[targetIndex] = { ...cart[targetIndex], ...currentActiveProductionProduct };
        } else {
          cart.push(currentActiveProductionProduct);
        }
        currentActiveProductionProduct = null;
        prodModal.style.opacity = "0"; prodModal.style.visibility = "hidden";
        renderCartStructure();
      }
    });

    document.addEventListener("click", (e) => {
      if (!customerInput.contains(e.target) && !customerFloat.contains(e.target)) customerFloat.style.display = "none";
      if (!salesInput.contains(e.target) && !salesFloat.contains(e.target)) salesFloat.style.display = "none";
      if (!productInput.contains(e.target) && !productFloat.contains(e.target)) productFloat.style.display = "none";
      if (rawMaterialInput && !rawMaterialInput.contains(e.target) && !rawMaterialFloat.contains(e.target)) rawMaterialFloat.style.display = "none";
    });

    function renderCartStructure() {
      if (cart.length === 0) {
        cartContainer.innerHTML = `
          <div style="text-align: center; padding: var(--space-md); color: var(--text-light); font-style: italic; font-size: var(--text-xs);">Belum ada produk di keranjang</div>
        `;
        calculateTotalsOnly(); return;
      }

      cartContainer.innerHTML = cart.map((item, idx) => {
        const itemSubtotal = item.qty * item.price;
        let prodBadge = `<span style="background: #ECFDF5; color: #10B981; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight:600; display: inline-block; margin-top:2px;">📦 Ready Stock (Sisa: ${item.stock})</span>`;
        if (item.needs_production && item.raw_materials) {
          prodBadge = `<span style="background: #FFF7ED; color: var(--orange, #F97316); font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight:600; border: 1px solid rgba(249,115,22,0.25); display: inline-block; margin-top:2px;">⚙️ OVER STOK: ANTRIAN PRODUKSI (${item.raw_materials.length} Bahan)</span>`;
        }

        return `
          <div class="card create-card item-cart-row" data-idx="${idx}" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm);">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid var(--border);">
              <div style="display: flex; flex-direction: column;">
                <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">${item.name}</strong>
                <div>${prodBadge}</div>
              </div>
              <button type="button" class="btn-remove-cart" data-idx="${idx}" style="background: none; border: none; color: var(--danger, #EF4444); font-size: var(--text-xs); font-weight: var(--font-semibold); cursor: pointer;">Hapus</button>
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Qty (${item.unit})</label>
                <input type="number" step="any" inputmode="decimal" pattern="[0-9]*([\.,][0-9]*)?" class="input input-qty" value="${item.qty}" style="text-align: center;" />
              </div>
              <div class="form-group">
                <label class="form-label">Harga Jual (Rp)</label>
                <input type="number" step="any" inputmode="decimal" pattern="[0-9]*([\.,][0-9]*)?" class="input input-price" value="${item.price}" style="text-align: right;" />
              </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 6px; border-top: 1px dashed var(--border);">
              <span class="text-light text-xs">Subtotal Item</span>
              <strong class="row-subtotal-text" style="font-size: var(--text-sm); color: var(--text);">Rp ${itemSubtotal.toLocaleString('id-ID')}</strong>
            </div>
          </div>
        `;
      }).join('');

      cartContainer.querySelectorAll(".item-cart-row").forEach(row => {
        const idx = parseInt(row.dataset.idx);
        const qtyEl = row.querySelector(".input-qty");
        const priceEl = row.querySelector(".input-price");
        const subtotalTextEl = row.querySelector(".row-subtotal-text");

        qtyEl.addEventListener("input", (e) => {
          let cleanVal = e.target.value.replace(/,/g, '.');
          const newQty = parseFloat(cleanVal) || 0;
          const currentItem = cart[idx];

          cart[idx].qty = newQty;
          subtotalTextEl.textContent = "Rp " + (cart[idx].qty * cart[idx].price).toLocaleString('id-ID');
          calculateTotalsOnly();

          if (!currentItem.is_raw && newQty > currentItem.stock) {
            if (!currentItem.needs_production) {
              const proceed = confirm(`⚠️ Jumlah order (${newQty} ${currentItem.unit}) melebihi stok aktual gudang (${currentItem.stock} ${currentItem.unit}). Sisa kekurangan barang otomatis masuk antrean PROSES PRODUKSI. Set kebutuhan bahan bakunya gais?`);
              if (proceed) {
                const productionData = { ...currentItem, inCartIndex: idx };
                triggerProductionModal(productionData);
              } else {
                e.target.value = currentItem.stock > 0 ? currentItem.stock : 1;
                cart[idx].qty = currentItem.stock > 0 ? currentItem.stock : 1;
                subtotalTextEl.textContent = "Rp " + (cart[idx].qty * cart[idx].price).toLocaleString('id-ID');
                calculateTotalsOnly();
              }
            }
          } else {
            if (currentItem.needs_production) {
              cart[idx].needs_production = false;
              cart[idx].raw_materials = null;
              renderCartStructure(); 
            }
          }
        });

        priceEl.addEventListener("input", (e) => {
          let cleanVal = e.target.value.replace(/,/g, '.');
          cart[idx].price = parseFloat(cleanVal) || 0;
          subtotalTextEl.textContent = "Rp " + (cart[idx].qty * cart[idx].price).toLocaleString('id-ID');
          calculateTotalsOnly();
        });
      });

      calculateTotalsOnly();
    }

    function calculateTotalsOnly() {
      const isSample = sampleToggle?.checked || false;
      const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
      const shippingCost = isSample ? 0 : (parseFloat(ongkirInput?.value) || 0);
      const grandTotal = isSample ? 0 : (subtotalTotal + shippingCost);
      const paymentAmount = isSample ? 0 : (parseFloat(bayarInput?.value) || 0);
      const sisaKembalian = paymentAmount - grandTotal;

      if (summarySubtotal) summarySubtotal.textContent = "Rp " + subtotalTotal.toLocaleString('id-ID');
      if (summaryOngkir) summaryOngkir.textContent = "Rp " + shippingCost.toLocaleString('id-ID');
      if (summaryTotal) summaryTotal.textContent = "Rp " + grandTotal.toLocaleString('id-ID');
      
      if (summaryChange) {
        if (isSample) {
          summaryChange.textContent = "Rp 0 (Sample Mode)";
        } else {
          summaryChange.textContent = sisaKembalian >= 0 
            ? "Rp " + sisaKembalian.toLocaleString('id-ID') + " (Kembalian)" 
            : "Rp " + Math.abs(sisaKembalian).toLocaleString('id-ID') + " (Kurang)";
        }
      }
    }

    const submitBtn = container.querySelector(".primary-action");
    const draftBtn = container.querySelector(".action-btn:not(.primary-action)");

    const executeOrderSubmit = async (statusType) => {
      if (isSubmitting) return;
      if (!selectedCustomer) { alert("⚠️ Harap tentukan customer transaksi terlebih dahulu!"); return; }
      if (cart.length === 0) { alert("⚠️ Keranjang belanja produk penjualan masih kosong!"); return; }

      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = "Processing...";

      try {
        const orderNo = 'SO-' + today.replace(/-/g, '') + '-' + Date.now().toString().slice(-4);
        const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
        const isSample = sampleToggle?.checked || false;
        const shippingCost = isSample ? 0 : (parseFloat(ongkirInput?.value) || 0);
        const grandTotal = subtotalTotal + shippingCost;
        const payAmount = isSample ? 0 : (parseFloat(bayarInput?.value) || 0);

        let finalCustomerId = selectedCustomer.id;
        if (finalCustomerId === 'NEW_CUSTOMER') {
          const { data: newCust, error: cErr } = await supabase
            .from('customers').insert([{ name: selectedCustomer.name, phone: selectedCustomer.phone, address: selectedCustomer.address }]).select();
          if (cErr) throw cErr;
          finalCustomerId = newCust[0].id;
        }

        let finalSalesId = selectedSales ? selectedSales.id : null;
        if (finalSalesId === 'NEW_SALES') {
          const { data: newSl, error: sErr } = await supabase
            .from('salesmen').insert([{ name: selectedSales.name, area_tugas: 'Tim Lapangan / Salesman', status: 'aktif' }]).select();
          if (sErr) throw sErr;
          finalSalesId = newSl[0].id;
        }

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
            is_sample: isSample,
            status: statusType, 
            notes: catatanInput?.value || null
          }])
          .select();

        if (orderError) throw orderError;
        const orderId = orderData[0].id;

        for (const item of cart) {
          const { data: insertedItem, error: itemErr } = await supabase
            .from('order_items')
            .insert([{
              order_id: orderId,
              product_id: item.id,
              qty: item.qty,
              unit_price: item.price,
              subtotal: item.qty * item.price
            }])
            .select();
          if (itemErr) throw itemErr;

          if (item.needs_production && item.raw_materials) {
            const prodNo = 'PRD-' + Date.now().toString().slice(-6);
            const deficitQty = item.qty - (item.stock > 0 ? item.stock : 0);

            const { data: productionInduk, error: prodIndukErr } = await supabase
              .from('production_orders') 
              .insert([{
                production_no: prodNo,
                order_item_id: insertedItem[0].id,
                product_id: item.id,
                target_qty: deficitQty, 
                status: 'pending' 
              }])
              .select();

            if (prodIndukErr) throw prodIndukErr;

            for (const raw of item.raw_materials) {
              const { error: rawErr } = await supabase
                .from('production_materials') 
                .insert([{
                  production_order_id: productionInduk[0].id,
                  raw_material_id: raw.id,
                  required_qty: raw.qty * deficitQty 
                }]);
              if (rawErr) throw rawErr;
            }
          }
        }

        alert(`🎉 Transaksi Penjualan ${orderNo} [${statusType.toUpperCase()}] Berhasil Disimpan!`);
        if (window.navigate) window.navigate('sales');

      } catch (err) {
        alert("❌ Gagal menyimpan data penjualan: " + err.message);
      } finalCustomerId = null;
    };

    submitBtn?.addEventListener("click", () => executeOrderSubmit('ordered'));
    draftBtn?.addEventListener("click", () => executeOrderSubmit('draft'));

    if (window.lucide) window.lucide.createIcons();

  }, 50);

  return `
    <section class="create-order-page" style="display: flex; flex-direction: column; gap: var(--space-md); position: relative;">
      
      <div id="customer-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: var(--space-md); box-sizing: border-box; opacity: 0; visibility: hidden; transition: opacity 0.25s ease, visibility 0.25s ease;">
        <div class="card create-card" style="background: var(--white); border-radius: var(--radius-sm); width: 100%; max-width: 400px; padding: var(--space-lg); box-shadow: 0 10px 25 rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: var(--space-md); box-sizing: border-box;">
          <div style="border-bottom: 1px solid var(--border); padding-bottom: var(--space-xs);">
            <strong style="font-size: var(--text-md); color: var(--text);">Lengkapi Customer Baru</strong>
          </div>
          <div class="form-group">
            <label class="form-label">Nama Customer</label>
            <input type="text" id="modal-cust-name" class="input" style="border-color: var(--orange); font-weight: 600;" placeholder="Masukkan nama..." />
          </div>
          <div class="form-group">
            <label class="form-label">No. Telepon</label>
            <input type="number" inputmode="tel" id="modal-cust-phone" class="input" placeholder="08xxxxxxxx" />
          </div>
          <div class="form-group">
            <label class="form-label">Alamat Lengkap</label>
            <input type="text" id="modal-cust-address" class="input" placeholder="Nama jalan, kota, atau daerah..." />
          </div>
          <div style="display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-xs);">
            <button type="button" id="btn-modal-cancel" class="btn" style="background: #E2E8F0; color: var(--text); border: none; height: 38px; padding: 0 var(--space-md); border-radius: var(--radius-sm); cursor: pointer; font-size: var(--text-xs); font-weight: 600;">Batal</button>
            <button type="button" id="btn-modal-save" class="btn" style="background: var(--orange, #F97316); color: #fff; border: none; height: 38px; padding: 0 var(--space-md); border-radius: var(--radius-sm); cursor: pointer; font-size: var(--text-xs); font-weight: 600;">Konfirmasi</button>
          </div>
        </div>
      </div>

      <div id="production-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 9998; display: flex; justify-content: center; align-items: center; padding: var(--space-md); box-sizing: border-box; opacity: 0; visibility: hidden; transition: opacity 0.25s ease, visibility 0.25s ease;">
        <div class="card create-card" style="background: var(--white); border-radius: var(--radius-sm); width: 100%; max-width: 440px; padding: var(--space-lg); box-shadow: 0 12px 30px rgba(0,0,0,0.25); display: flex; flex-direction: column; gap: var(--space-md); box-sizing: border-box;">
          <div style="border-bottom: 1px solid var(--border); padding-bottom: var(--space-xs);">
            <span style="font-size: 11px; font-weight: 700; color: var(--orange, #F97316); letter-spacing: 0.5px; display:block;">MANUFACTURING COMPOSITION</span>
            <strong id="prod-modal-title" style="font-size: var(--text-md); color: var(--text); margin-top: 2px; display:block;">Nama Produk Habis</strong>
          </div>
          <div class="form-group" style="position: relative;">
            <label class="form-label" style="font-weight: 600;">Pilih Kebutuhan Bahan Baku</label>
            <input type="text" id="search-raw-material" class="input" placeholder="Ketik nama kopi mentah, pack, botol, cup..." autocomplete="off" style="border-color: #CBD5E1;" />
            <div id="raw-material-dropdown-float" class="card" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1020; display: none; max-height: 150px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0; background: var(--white);"></div>
          </div>
          <div style="background: #F8FAFC; border: 1px dashed var(--border); border-radius: var(--radius-sm); padding: var(--space-sm); max-height: 180px; overflow-y: auto;">
            <span style="font-size: 11px; font-weight: 600; color: var(--text-light); display:block; margin-bottom: 6px;">Komposisi / Kebutuhan Bahan:</span>
            <div id="production-cart-container" style="display:flex; flex-direction:column; gap:6px;"></div>
          </div>
          <div style="display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-xs);">
            <button type="button" id="btn-prod-modal-cancel" class="btn" style="background: #E2E8F0; color: var(--text); border: none; height: 38px; padding: 0 var(--space-md); border-radius: var(--radius-sm); cursor: pointer; font-size: var(--text-xs); font-weight: 600;">Batal</button>
            <button type="button" id="btn-prod-modal-save" class="btn" style="background: var(--orange, #F97316); color: #fff; border: none; height: 38px; padding: 0 var(--space-md); border-radius: var(--radius-sm); cursor: pointer; font-size: var(--text-xs); font-weight: 600;">Gunakan & Antrekan</button>
          </div>
        </div>
      </div>

      <div class="card create-card" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div>
          <label style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text); display: block;">Sample Order Mode</label>
          <span style="font-size: var(--text-xs); color: var(--text-light); display: block; margin-top: 2px;">Aktifkan untuk pesanan contoh gratis / warung</span>
        </div>
        <label class="toggle-wrapper" style="position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer;">
          <input type="checkbox" id="sample-order-toggle" class="toggle-checkbox" style="position: absolute; opacity: 0; width: 0; height: 0;" />
          <span class="toggle-slider" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #E2E8F0; transition: .3s; border-radius: 24px; display: block; pointer-events: none;"></span>
        </label>
      </div>

      <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div class="form-group">
          <label class="form-label">Tanggal Transaksi</label>
          <input type="date" class="input" />
        </div>
        <div class="form-group">
          <label class="form-label">Customer</label>
          <input type="text" id="search-customer" class="input" placeholder="Cari nama warung / customer..." autocomplete="off" />
        </div>
        <div class="form-group">
          <label class="form-label">Salesman</label>
          <input type="text" id="search-sales" class="input" placeholder="Pilih nama sales..." autocomplete="off" />
        </div>
      </div>

      <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div style="margin-bottom: var(--space-xs);">
          <h3 style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text); margin: 0;">Pilih Produk</h3>
        </div>
        <div class="form-group">
          <input type="text" id="search-product" class="input" placeholder="Cari kopi, roastbean, pack..." autocomplete="off" />
        </div>
      </div>

      <div id="dynamic-cart-container" style="display: flex; flex-direction: column; gap: var(--space-sm);">
        <div style="text-align: center; padding: var(--space-md); color: var(--text-light); font-style: italic; font-size: var(--text-xs);">Belum ada produk di keranjang</div>
      </div>

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

      <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Nominal Bayar (Rp)</label>
            <input type="number" step="any" inputmode="decimal" id="input-payment" class="input" placeholder="0" style="text-align: right;" />
          </div>
          <div class="form-group">
            <label class="form-label">Ongkir (Rp)</label>
            <input type="number" step="any" inputmode="decimal" id="input-shipping" class="input" placeholder="0" style="text-align: right;" />
          </div>
        </div>
      </div>

      <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <div class="form-group">
          <label class="form-label">Catatan Nota</label>
          <textarea class="textarea" placeholder="Tambahkan catatan warung atau pengiriman..."></textarea>
        </div>
      </div>

      <div class="detail-actions" style="display: flex; gap: var(--space-sm); justify-content: flex-end; margin-top: var(--space-md); margin-bottom: var(--space-lg);">
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
