import { supabase } from "../supabaseClient.js";

export default function CreateOrderPage() {
  let selectedCustomer = null;
  let selectedSalesman = null;
  let cart = [];
  let bomCart = []; // <--- 🛒 ARRAY KHUSUS MENAMPUNG BAHAN BAKU PILIHAN MANUAL LO GAIS
  let isSubmitting = false;

  const today = new Date().toISOString().split('T')[0];

  setTimeout(async () => {
    const container = document.querySelector(".create-page");
    if (!container) return;

    // Capture elemen DOM kontrol utama
    const dateInput = container.querySelector("#order-date");
    const customerInput = container.querySelector("#customer-search");
    const customerFloat = container.querySelector("#customer-floating-list");
    const quickAddCustBtn = container.querySelector("#quick-add-cust-btn");
    
    const salesmanInput = container.querySelector("#salesman-search");
    const salesmanFloat = container.querySelector("#salesman-floating-list");
    
    const productInput = container.querySelector("#product-search");
    const productFloat = container.querySelector("#product-floating-list");
    const cartContainer = container.querySelector("#cart-items-container");
    const manufacturingCard = container.querySelector("#manufacturing-analysis-card");
    const bomDetails = container.querySelector("#bom-details-list");
    
    // Ringkasan Biaya, Catatan, & Ongkir
    const summarySubtotal = container.querySelector("#summary-subtotal");
    const summaryOngkir = container.querySelector("#summary-ongkir"); 
    const summaryBayar = container.querySelector("#summary-bayar");
    const summarySisa = container.querySelector("#summary-sisa");
    const bayarInput = container.querySelector("#pay-amount");
    const ongkirInput = container.querySelector("#shipping-amount"); 
    const catatanInput = container.querySelector("#order-note");

    // Modal Customer
    const customerModal = container.querySelector("#customer-modal");
    const saveNewCustomerBtn = container.querySelector("#save-new-customer");
    const closeCustomerModalBtn = container.querySelector("#close-customer-modal");
    const newCustName = container.querySelector("#new-cust-name");
    const newCustPhone = container.querySelector("#new-cust-phone");
    const newCustAddress = container.querySelector("#new-cust-address");

    if (dateInput) dateInput.value = today;

    // ==========================================================================
    // 1. LIVE SEARCH SALESMAN
    // ==========================================================================
    if (salesmanInput && salesmanFloat) {
      salesmanInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 1) {
          salesmanFloat.style.display = "none";
          return;
        }

        const { data: salesmen, error } = await supabase
          .from('salesmen')
          .select('id, name, area_tugas')
          .eq('status', 'aktif')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && salesmen) {
          salesmanFloat.innerHTML = salesmen.map(s => `
            <div class="salesman-row-item" data-id="${s.id}" data-name="${s.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
              <strong style="font-size: var(--text-sm); display: block; color: var(--text);">${s.name}</strong>
              <span class="text-xs text-light">${s.area_tugas || 'Semua Area'}</span>
            </div>
          `).join('');
          salesmanFloat.style.display = "block";

          salesmanFloat.querySelectorAll(".salesman-row-item").forEach(row => {
            row.addEventListener("click", (evt) => {
              const target = evt.currentTarget;
              selectedSalesman = parseInt(target.dataset.id);
              salesmanInput.value = target.dataset.name;
              salesmanFloat.style.display = "none";
            });
          });
        }
      });

      document.addEventListener("click", (e) => {
        if (!salesmanInput.contains(e.target) && !salesmanFloat.contains(e.target)) {
          salesmanFloat.style.display = "none";
        }
      });
    }

    // ==========================================================================
    // 2. LIVE SEARCH CUSTOMER + QUICK ADD MINIMALIS
    // ==========================================================================
    if (customerInput && customerFloat && quickAddCustBtn) {
      customerInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 2) {
          customerFloat.style.display = "none";
          quickAddCustBtn.style.display = "none";
          return;
        }

        const { data: customers, error } = await supabase
          .from('customers')
          .select('id, name, address, customer_code')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && customers) {
          if (customers.length === 0) {
            customerFloat.style.display = "none";
            quickAddCustBtn.style.display = "flex";
          } else {
            quickAddCustBtn.style.display = "none";
            customerFloat.innerHTML = customers.map(c => `
              <div class="float-row-item" data-id="${c.id}" data-name="${c.name}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer;">
                <strong style="font-size: var(--text-sm); display: block; color: var(--text);">${c.name}</strong>
                <span class="text-xs text-light">${c.customer_code} - ${c.address || 'No Address'}</span>
              </div>
            `).join('');
            customerFloat.style.display = "block";

            customerFloat.querySelectorAll(".float-row-item").forEach(row => {
              row.addEventListener("click", (evt) => {
                const target = evt.currentTarget;
                selectedCustomer = { id: parseInt(target.dataset.id), name: target.dataset.name };
                customerInput.value = target.dataset.name;
                customerFloat.style.display = "none";
                quickAddCustBtn.style.display = "none";
              });
            });
          }
        }
      });

      quickAddCustBtn.addEventListener("click", () => {
        if (newCustName) newCustName.value = customerInput.value.trim();
        if (customerModal) customerModal.style.display = "flex";
        quickAddCustBtn.style.display = "none";
      });

      document.addEventListener("click", (e) => {
        if (!customerInput.contains(e.target) && !customerFloat.contains(e.target) && !quickAddCustBtn.contains(e.target)) {
          customerFloat.style.display = "none";
        }
      });
    }

    if (saveNewCustomerBtn && customerModal) {
      saveNewCustomerBtn.addEventListener("click", async () => {
        const nameVal = newCustName.value.trim();
        if (!nameVal) return;

        const custCode = 'CUST-' + Date.now().toString().slice(-6);

        const { data, error } = await supabase
          .from('customers')
          .insert([{ customer_code: custCode, name: nameVal, phone: newCustPhone?.value || null, address: newCustAddress?.value || null, type: 'warung', salesman_id: selectedSalesman }])
          .select();

        if (!error && data && data.length > 0) {
          selectedCustomer = { id: data[0].id, name: data[0].name };
          if (customerInput) customerInput.value = data[0].name;
          customerModal.style.display = "none";
          if (newCustPhone) newCustPhone.value = "";
          if (newCustAddress) newCustAddress.value = "";
        } else {
          alert("Gagal mendaftarkan customer baru: " + (error?.message || "Error database"));
        }
      });
    }

    if (closeCustomerModalBtn && customerModal) {
      closeCustomerModalBtn.addEventListener("click", () => {
        customerModal.style.display = "none";
      });
    }

    // ==========================================================================
    // 3. LIVE SEARCH PRODUK JUALAN UTAMA
    // ==========================================================================
    if (productInput && productFloat) {
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

        if (!error && products) {
          productFloat.innerHTML = products.map(p => `
            <div class="product-row-item" data-id="${p.id}" data-name="${p.name}" data-stock="${p.stock || 0}" data-unit="${p.unit || 'kg'}" data-category="${p.category || ''}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="font-size: var(--text-sm); color: var(--text);">${p.name}</strong>
                <span class="text-xs text-light" style="display: block; text-transform: uppercase;">${p.category || 'UNSET'}</span>
              </div>
              <span class="badge ${p.stock > 0 ? 'badge-success' : 'badge-warning'}" style="font-size: 11px;">
                Stok: ${p.stock || 0} ${p.unit || 'kg'}
              </span>
            </div>
          `).join('');
          productFloat.style.display = "block";

          productFloat.querySelectorAll(".product-row-item").forEach(row => {
            row.addEventListener("click", (evt) => {
              const target = evt.currentTarget;
              const pId = parseInt(target.dataset.id);
              
              if (cart.some(item => item.id === pId)) {
                productFloat.style.display = "none";
                productInput.value = "";
                return;
              }

              // 🛠️ FIX UTAMA: Harga awal 25000 lo udah di-wipe bersih murni jadi kosong (0) gais
              cart.push({
                id: pId,
                name: target.dataset.name,
                stock: parseFloat(target.dataset.stock),
                unit: target.dataset.unit,
                category: target.dataset.category,
                qty: "",
                price: "" 
              });

              productFloat.style.display = "none";
              productInput.value = "";
              renderCartStructure(); 
            });
          });
        }
      });
    }

    // ==========================================================================
    // 4. MANIPULASI DOM INPUT INTERAKTIF JUALAN KASIR
    // ==========================================================================
    function renderCartStructure() {
      if (cart.length === 0) {
        cartContainer.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-md); background: var(--white); border-radius: var(--radius-md); margin-bottom: var(--space-md); border: 1px dashed var(--border);">
            Belum ada produk terpilih harian.
          </p>
        `;
        calculateTotalsOnly();
        return;
      }

      cartContainer.innerHTML = cart.map((item, idx) => `
        <div class="card create-card item-cart-row" data-idx="${idx}" style="margin-bottom: var(--space-sm); border: 1px solid var(--border);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-sm); padding-bottom: 4px; border-bottom: 1px solid var(--border);">
            <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">${item.name}</strong>
            <button class="btn-remove-cart" data-idx="${idx}" style="background: none; border: none; color: var(--danger); font-size: var(--text-xs); font-weight: var(--font-semibold); cursor: pointer;">Hapus</button>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Qty (${item.unit})</label>
              <input type="number" step="0.01" inputmode="decimal" class="input input-qty" value="${item.qty}" placeholder="0.00" />
            </div>
            <div class="form-group">
              <label class="form-label">Harga (Rp)</label>
              <input type="number" inputmode="numeric" class="input input-price" value="${item.price}" placeholder="0" />
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-sm); padding-top: 4px; border-top: 1px dashed var(--border);">
            <span class="text-light text-xs">Subtotal</span>
            <strong class="row-subtotal-text" style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
              Rp ${( (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0) ).toLocaleString('id-ID')}
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
          cart[idx].qty = e.target.value !== "" ? parseFloat(e.target.value) : "";
          const validQty = parseFloat(cart[idx].qty) || 0;
          const validPrice = parseFloat(cart[idx].price) || 0;
          subtotalTextEl.textContent = `Rp ${(validQty * validPrice).toLocaleString('id-ID')}`;
          calculateTotalsOnly();
        });

        priceEl.addEventListener("input", (e) => {
          cart[idx].price = e.target.value !== "" ? parseFloat(e.target.value) : "";
          const validQty = parseFloat(cart[idx].qty) || 0;
          const validPrice = parseFloat(cart[idx].price) || 0;
          subtotalTextEl.textContent = `Rp ${(validQty * validPrice).toLocaleString('id-ID')}`;
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
      let needsProduction = false;

      cart.forEach(item => {
        const validQty = parseFloat(item.qty) || 0;
        if (validQty > item.stock) {
          needsProduction = true;
        }
      });

      if (manufacturingCard) manufacturingCard.style.display = needsProduction ? "block" : "none";
      
      if (!needsProduction) {
        bomCart = [];
        renderBomCartStructure();
      }

      const subtotalTotal = cart.reduce((acc, item) => acc + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);
      const ongkirVal = parseFloat(ongkirInput?.value) || 0; 
      const payVal = parseFloat(bayarInput?.value) || 0;
      
      const sisaTotal = (subtotalTotal + ongkirVal) - payVal;

      if (summarySubtotal) summarySubtotal.textContent = `Rp ${subtotalTotal.toLocaleString('id-ID')}`;
      if (summaryOngkir) summaryOngkir.textContent = `Rp ${ongkirVal.toLocaleString('id-ID')}`; 
      if (summaryBayar) summaryBayar.textContent = `Rp ${payVal.toLocaleString('id-ID')}`;
      if (summarySisa) {
        summarySisa.textContent = `Rp ${sisaTotal.toLocaleString('id-ID')}`;
        summarySisa.style.color = sisaTotal > 0 ? "var(--orange)" : "#10B981";
      }
    }

    if (bayarInput) bayarInput.addEventListener("input", calculateTotalsOnly);
    if (ongkirInput) ongkirInput.addEventListener("input", calculateTotalsOnly); 

    // ==========================================================================
    // 5. LIVE SEARCH BAHAN BAKU + INPUT QTY MANUAL
    // ==========================================================================
    const matInput = container.querySelector("#material-search-input");
    const matFloat = container.querySelector("#material-floating-list");

    if (matInput && matFloat) {
      matInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 1) {
          matFloat.style.display = "none";
          return;
        }

        const { data: materials, error } = await supabase
          .from("products")
          .select("id, name, stock, unit")
          .ilike("name", `%${val}%`)
          .limit(5);

        if (!error && materials) {
          matFloat.innerHTML = materials.map(m => `
            <div class="mat-row-item" data-id="${m.id}" data-name="${m.name}" data-unit="${m.unit || 'kg'}" style="padding: var(--space-sm); border-bottom: 1px solid var(--border); cursor: pointer; display:flex; justify-content:space-between;">
              <strong style="font-size: var(--text-sm); color: var(--text);">${m.name}</strong>
              <span class="text-xs text-light">Stok: ${m.stock || 0} ${m.unit || 'kg'}</span>
            </div>
          `).join('');
          matFloat.style.display = "block";

          matFloat.querySelectorAll(".mat-row-item").forEach(row => {
            row.addEventListener("click", (evt) => {
              const target = evt.currentTarget;
              const mId = parseInt(target.dataset.id);

              if (bomCart.some(b => b.id === mId)) {
                matFloat.style.display = "none";
                matInput.value = "";
                return;
              }

              bomCart.push({
                id: mId,
                name: target.dataset.name,
                unit: target.dataset.unit,
                qty_needed: "" // 🛠️ Dikosongkan bersih murni diawal gais
              });

              matFloat.style.display = "none";
              matInput.value = "";
              renderBomCartStructure();
            });
          });
        }
      });

      document.addEventListener("click", (e) => {
        if (!matInput.contains(e.target) && !matFloat.contains(e.target)) {
          matFloat.style.display = "none";
        }
      });
    }

    // RENDER BARIS BARU BAHAN BAKU BERDASARKAN INPUT MANUAL
    function renderBomCartStructure() {
      if (!bomDetails) return;

      if (bomCart.length === 0) {
        bomDetails.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-sm); color: var(--orange);">
            Cari & pilih item bahan baku di atas gais...
          </p>
        `;
        return;
      }

      bomDetails.innerHTML = bomCart.map((b, idx) => `
        <div class="item-bom-row" data-idx="${idx}" style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-md); padding: var(--space-sm) 0; border-bottom: 1px dashed var(--border);">
          <div style="flex: 2;">
            <span class="text-sm font-medium" style="color: var(--text); display:block;">${b.name}</span>
          </div>
          <div style="flex: 1; display: flex; align-items: center; gap: 4px;">
            <input type="number" step="0.01" inputmode="decimal" class="input input-bom-qty" value="${b.qty_needed}" placeholder="0.00" style="text-align: right; width: 80px; padding: 4px 8px; font-size: 13px;" />
            <span class="text-xs text-light">${b.unit}</span>
          </div>
          <button type="button" class="btn-remove-bom" data-idx="${idx}" style="background: none; border: none; color: var(--danger); font-size: 16px; cursor: pointer; padding: 0 4px;">&times;</button>
        </div>
      `).join('');

      bomDetails.querySelectorAll(".item-bom-row").forEach(row => {
        const idx = parseInt(row.dataset.idx);
        const qtyInp = row.querySelector(".input-bom-qty");

        qtyInp.addEventListener("input", (e) => {
          bomCart[idx].qty_needed = e.target.value !== "" ? parseFloat(e.target.value) : "";
        });
      });

      bomDetails.querySelectorAll(".btn-remove-bom").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(e.target.dataset.idx);
          bomCart.splice(idx, 1);
          renderBomCartStructure();
        });
      });
    }

    renderCartStructure();

    // ==========================================================================
    // 6. SUBMIT DATA KE SUPABASE
    // ==========================================================================
    const actionsArea = container.querySelector(".detail-actions");
    if (actionsArea) {
      const submitBtn = actionsArea.querySelector(".primary-action");
      const draftBtn = actionsArea.querySelector(".action-btn:not(.primary-action)");

      if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
          if (isSubmitting) return;

          if (!selectedCustomer) {
            alert("⚠️ Harap pilih atau cari customer warung terlebih dahulu!");
            return;
          }
          if (cart.length === 0) {
            alert("⚠️ Keranjang belanja masih kosong!");
            return;
          }

          // Validasi form kosong harian
          let isFormValid = true;
          cart.forEach(item => {
            if (item.qty === "" || item.price === "") isFormValid = false;
          });
          if (!isFormValid) {
            alert("⚠️ Harap isi Qty dan Harga produk jualan terlebih dahulu gais!");
            return;
          }

          isSubmitting = true;
          submitBtn.disabled = true;
          submitBtn.textContent = "Processing...";

          try {
            const invoiceNo = 'SO-' + today.replace(/-/g, '') + '-' + Date.now().toString().slice(-4);
            const subtotalTotal = cart.reduce((acc, item) => acc + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);
            const shippingCost = parseFloat(ongkirInput?.value) || 0; 
            const payAmount = parseFloat(bayarInput?.value) || 0;
            const orderNoteValue = catatanInput?.value?.trim() || ""; 

            let autoNeedsProduction = false;
            let targetShortageProduct = null;
            let calculatedShortageQty = 0;

            cart.forEach(item => {
              const vQty = parseFloat(item.qty) || 0;
              if (vQty > item.stock) {
                autoNeedsProduction = true;
                if (!targetShortageProduct) {
                  targetShortageProduct = item;
                  calculatedShortageQty = vQty - item.stock;
                }
              }
            });

            if (autoNeedsProduction && bomCart.length === 0) {
              alert("⚠️ Keranjang butuh racikan manufaktur! Silahkan tambahkan & isi kuantitas analisa bahan baku (BOM) terlebih dahulu.");
              isSubmitting = false;
              submitBtn.disabled = false;
              submitBtn.textContent = "Submit";
              return;
            }

            // Validasi input racikan kosong gais
            if (autoNeedsProduction) {
              let isBomValid = true;
              bomCart.forEach(b => { if (b.qty_needed === "") isBomValid = false; });
              if (!isBomValid) {
                alert("⚠️ Harap isi kuantitas berat racikan bahan baku terlebih dahulu!");
                isSubmitting = false;
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit";
                return;
              }
            }

            const finalOrderStatus = autoNeedsProduction ? 'butuh produksi' : 'pending';
            const finalNetAmount = subtotalTotal + shippingCost; 

            const { data: orderData, error: orderError } = await supabase
              .from('sales_orders')
              .insert([{
                invoice_no: invoiceNo,
                order_date: dateInput?.value || today,
                customer_id: selectedCustomer.id,
                salesman_id: selectedSalesman,
                total_amount: subtotalTotal,
                shipping_fee: shippingCost, 
                discount: 0,
                net_amount: finalNetAmount, 
                payment_method: payAmount >= finalNetAmount ? 'QRIS' : 'Cash',
                status: finalOrderStatus,
                notes: orderNoteValue 
              }])
              .select();

            if (orderError) throw orderError;

            const orderItemsPayload = cart.map(item => ({
              sales_order_id: orderData[0].id,
              product_id: item.id,
              qty: parseFloat(item.qty) || 0,
              unit_price: parseFloat(item.price) || 0
            }));

            const { error: itemsError } = await supabase
              .from('sales_order_items')
              .insert(orderItemsPayload);

            if (itemsError) throw itemsError;

            if (autoNeedsProduction && targetShortageProduct) {
              const generatedPrdNo = 'PRD-' + today.replace(/-/g, '') + '-' + Date.now().toString().slice(-4);
              
              const { data: newProdData, error: newProdErr } = await supabase
                .from('productions')
                .insert([{
                  production_no: generatedPrdNo,
                  production_date: dateInput?.value || today,
                  product_id: targetShortageProduct.id,
                  qty_produced: calculatedShortageQty,
                  sales_order_id: orderData[0].id,
                  notes: `Auto-generated dari transaksi penjualan kasir ${invoiceNo}. ${orderNoteValue}`
                }])
                .select();

              if (newProdErr) throw newProdErr;

              if (newProdData && newProdData.length > 0 && bomCart.length > 0) {
                const ingredientsPayload = bomCart.map(b => ({
                  production_id: newProdData[0].id,
                  material_id: b.id, 
                  qty_used: parseFloat(b.qty_needed) || 0 
                }));

                const { error: ingErr } = await supabase
                  .from('production_ingredients')
                  .insert(ingredientsPayload);

                if (ingErr) throw ingErr;
              }
            }

            alert(`🎉 Sales Order ${invoiceNo} Berhasil Disimpan ke Antrean ${finalOrderStatus.toUpperCase()}!`);
            if (window.navigate) window.navigate('order');

          } catch (err) {
            alert("❌ Gagal menyimpan order: " + err.message);
          } finally { 
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
          }
        });
      }

      if (draftBtn) {
        draftBtn.addEventListener("click", () => {
          if (window.navigate) window.navigate('order');
        });
      }
    }

  }, 50);

  return `
    <section class="create-page" style="padding-bottom: 60px;">

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Tanggal</label>
          <input type="date" id="order-date" class="input" />
        </div>

        <div class="form-group" style="position: relative;">
          <label class="form-label">Customer</label>
          <div style="display: flex; gap: var(--space-xs); align-items: center; position: relative;">
            <input type="text" id="customer-search" class="input" style="flex: 1;" placeholder="Ketik nama warung / cari customer..." autocomplete="off" />
            <button id="quick-add-cust-btn" style="display: none; width: 42px; height: 42px; background: var(--orange-soft); border: none; border-radius: var(--radius-sm); align-items: center; justify-content: center; color: var(--orange); font-size: 20px; font-weight: bold; cursor: pointer;">+</button>
          </div>
          <div id="customer-floating-list" class="card" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0;"></div>
        </div>

        <div class="form-group" style="margin-top: var(--space-md); position: relative;">
          <label class="form-label">Salesman Lapangan</label>
          <input type="text" id="salesman-search" class="input" placeholder="Ketik nama tim / cari salesman..." autocomplete="off" />
          <div id="salesman-floating-list" class="card" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0;"></div>
        </div>
      </div>

      <div class="card create-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-sm);">
          <div>
            <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text);">Produk Jualan</h3>
            <p class="text-light text-xs" style="margin-top: 1px;">Ketik nama item di bawah untuk menambahkan</p>
          </div>
        </div>

        <div class="form-group" style="position: relative;">
          <input type="text" id="product-search" class="input" placeholder="Ketik nama kopi / jenis produk..." autocomplete="off" />
          <div id="product-floating-list" class="card" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0;"></div>
        </div>
      </div>

      <div class="stock-dynamic-list" id="cart-items-container"></div>

      <div class="card create-card" id="manufacturing-analysis-card" style="display: none;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-sm);">
          <div>
            <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text);">Produksi Dibutuhkan</h3>
            <p class="text-light text-xs" style="margin-top: 1px;">Ketik nama bahan mentah di bawah untuk meracik</p>
          </div>
          <span class="badge badge-warning">Diproses</span>
        </div>
        
        <div class="form-group" style="position: relative; margin-bottom: var(--space-md);">
          <input type="text" id="material-search-input" class="input" placeholder="Cari Bahan Baku (misal: Robusta, Jagung)..." autocomplete="off" style="border: 1px solid var(--orange);" />
          <div id="material-floating-list" class="card" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1020; display: none; max-height: 150px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0;"></div>
        </div>

        <div style="display: flex; align-items: center; gap: var(--space-sm); background: var(--warning-soft); color: #D97706; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); margin-bottom: var(--space-md);">
          <p style="font-size: 11px; font-weight: var(--font-medium); margin: 0;">Isi kolom Qty di bawah untuk menentukan berat racikan harian gudang.</p>
        </div>

        <div class="detail-info" id="bom-details-list" style="gap: 4px;"></div>
      </div>

      <div class="card create-card">
        <div class="detail-info" style="gap: var(--space-sm);">
          <div class="detail-row-item" style="padding: 2px 0; display:flex; justify-content:space-between;">
            <span class="text-light text-sm">Subtotal</span>
            <strong id="summary-subtotal" style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 0</strong>
          </div>
          <div class="detail-row-item" style="padding: 2px 0; display:flex; justify-content:space-between;">
            <span class="text-light text-sm">Ongkos Kirim</span>
            <strong id="summary-ongkir" style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text-light);">Rp 0</strong>
          </div>
          <div class="detail-row-item" style="padding: 2px 0; display:flex; justify-content:space-between;">
            <span class="text-light text-sm">Bayar</span>
            <strong id="summary-bayar" style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 0</strong>
          </div>
          <div class="detail-row-item" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: 4px; display:flex; justify-content:space-between;">
            <span class="font-semibold text-sm">Sisa Tagihan</span>
            <strong id="summary-sisa" style="color: var(--orange); font-size: var(--text-md); font-weight: var(--font-bold);">Rp 0</strong>
          </div>
        </div>
      </div>

      <div class="card create-card">
        <div class="form-grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
          <div class="form-group">
            <label class="form-label">Nominal Pembayaran (Rp)</label>
            <input type="number" inputmode="numeric" id="pay-amount" class="input" placeholder="0" />
          </div>
          <div class="form-group">
            <label class="form-label">Ongkos Kirim (Rp)</label>
            <input type="number" inputmode="numeric" id="shipping-amount" class="input" placeholder="0" />
          </div>
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Catatan Order</label>
          <textarea id="order-note" class="textarea" placeholder="Tambahkan instruksi pengiriman harian..."></textarea>
        </div>
      </div>

      <div class="detail-actions" style="margin-top: var(--space-xl); display: flex; gap: var(--space-md); padding: 0 var(--space-xs);">
        <button class="action-btn" style="flex: 1; height: 48px; border-radius: var(--radius-md); font-weight: bold; cursor: pointer; border: 1px solid var(--border); background: #f9f9f9;">Kembali</button>
        <button class="action-btn primary-action" style="flex: 1; height: 48px; background: var(--orange); color: white; border: none; border-radius: var(--radius-md); font-weight: bold; cursor: pointer;">Submit</button>
      </div>

      <div id="customer-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 99999; display: none; align-items: center; justify-content: center; padding: 20px;">
        <div class="card" style="width: 100%; max-width: 400px; background: var(--white); padding: var(--space-lg); border-radius: var(--radius-md); box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
          <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); margin-bottom: var(--space-sm); color: var(--text);">Tambah Customer Baru</h3>
          <div class="form-group" style="margin-bottom: var(--space-sm);">
            <label class="form-label">Nama Warung / Toko</label>
            <input type="text" id="new-cust-name" class="input" />
          </div>
          <div class="form-group" style="margin-bottom: var(--space-sm);">
            <label class="form-label">No. Telepon / WA</label>
            <input type="text" id="new-cust-phone" class="input" placeholder="08..." />
          </div>
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label">Alamat Lengkap</label>
            <input type="text" id="new-cust-address" class="input" placeholder="Nama jalan, nomor, area..." />
          </div>
          <div style="display: flex; gap: var(--space-md); justify-content: flex-end;">
            <button id="close-customer-modal" style="background: var(--border); border:none; padding: 0 var(--space-md); border-radius: var(--radius-sm); height:38px; cursor:pointer;">Batal</button>
            <button id="save-new-customer" style="background: var(--orange); color: white; border:none; padding: 0 var(--space-md); border-radius: var(--radius-sm); height:38px; font-weight:bold; cursor:pointer;">Simpan Data</button>
          </div>
        </div>
      </div>

    </section>
  `;
}
