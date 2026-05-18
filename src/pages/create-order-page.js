import { supabase } from "../supabaseClient.js";

export default function CreateOrderPage() {
  // State lokal untuk menampung data transaksi sebelum dikirim ke database
  let selectedCustomer = null;
  let selectedSalesman = null;
  let cart = [];
  let isSubmitting = false;

  // Set nilai default tanggal hari ini pas form dibuka
  const today = new Date().toISOString().split('T')[0];

  setTimeout(async () => {
    const appLayout = document.querySelector(".app-layout");
    const container = document.querySelector(".create-page");
    if (!container) return;

    // Fix Posisi Tombol Aksi: Dorong ke luar container paling bawah biar lengket di layar HP
    const actionsArea = container.querySelector(".detail-actions");
    if (actionsArea && appLayout && actionsArea.parentElement !== appLayout) {
      appLayout.appendChild(actionsArea);
    }

    // Capture semua elemen input kontrol DOM
    const dateInput = container.querySelector("#order-date");
    const customerInput = container.querySelector("#customer-search");
    const customerFloat = container.querySelector("#customer-floating-list");
    const salesmanSelect = container.querySelector("#salesman-select");
    const productInput = container.querySelector("#product-search");
    const productFloat = container.querySelector("#product-floating-list");
    const cartContainer = container.querySelector("#cart-items-container");
    const manufacturingCard = container.querySelector("#manufacturing-analysis-card");
    const bomDetails = container.querySelector("#bom-details-list");
    
    // Elemen Ringkasan Biaya
    const summarySubtotal = container.querySelector("#summary-subtotal");
    const summaryBayar = container.querySelector("#summary-bayar");
    const summarySisa = container.querySelector("#summary-sisa");
    const bayarInput = container.querySelector("#pay-amount");
    const catatanInput = container.querySelector("#order-note");

    // Jendela Jaga Modal Tambah Customer Baru
    const customerModal = container.querySelector("#customer-modal");
    const saveNewCustomerBtn = container.querySelector("#save-new-customer");
    const closeCustomerModalBtn = container.querySelector("#close-customer-modal");
    const newCustName = container.querySelector("#new-cust-name");
    const newCustPhone = container.querySelector("#new-cust-phone");
    const newCustAddress = container.querySelector("#new-cust-address");

    // Set tanggal default ke input
    if (dateInput) dateInput.value = today;

    // ==========================================================================
    // 1. POPULASI DATA DROPDOWN SALESMAN
    // ==========================================================================
    try {
      const { data: salesmen, error } = await supabase
        .from('salesmen')
        .select('id, name')
        .eq('status', 'aktif');
      
      if (!error && salesmen && salesmanSelect) {
        salesmanSelect.innerHTML = '<option value="">-- Pilih Salesman Lapangan --</option>' + 
          salesmen.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
      }
    } catch (err) {
      console.error("Gagal memuat list salesmen:", err);
    }

    if (salesmanSelect) {
      salesmanSelect.addEventListener("change", (e) => {
        selectedSalesman = e.target.value ? parseInt(e.target.value) : null;
      });
    }

    // ==========================================================================
    // 2. LIVE SEARCH CUSTOMER + TRIGGER MODAL QUICK ADD
    // ==========================================================================
    if (customerInput && customerFloat) {
      customerInput.addEventListener("input", async (e) => {
        const val = e.target.value.trim();
        if (val.length < 2) {
          customerFloat.style.display = "none";
          return;
        }

        const { data: customers, error } = await supabase
          .from('customers')
          .select('id, name, address, customer_code')
          .ilike('name', `%${val}%`)
          .limit(5);

        if (!error && customers) {
          if (customers.length === 0) {
            // Jika customer tidak ada, tawarkan modal buat baru di tempat
            customerFloat.innerHTML = `
              <div class="float-item-action" style="padding: var(--space-sm); text-align: center; color: var(--orange); font-weight: bold; cursor: pointer;">
                <i data-lucide="plus-circle" style="width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
                "${val}" Belum terdaftar. Tambah Baru?
              </div>
            `;
            customerFloat.style.display = "block";
            
            const actionRow = customerFloat.querySelector(".float-item-action");
            if (actionRow) {
              actionRow.addEventListener("click", () => {
                if (newCustName) newCustName.value = val;
                if (customerModal) customerModal.style.display = "flex";
                customerFloat.style.display = "none";
              });
            }
          } else {
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
                selectedCustomer = {
                  id: parseInt(target.dataset.id),
                  name: target.dataset.name
                };
                customerInput.value = target.dataset.name;
                customerFloat.style.display = "none";
              });
            });
          }
        }
        if (window.lucide) window.lucide.createIcons();
      });

      // Tutup floating card pas ngeklik area luar skrin
      document.addEventListener("click", (e) => {
        if (!customerInput.contains(e.target) && !customerFloat.contains(e.target)) {
          customerFloat.style.display = "none";
        }
      });
    }

    // Logika Simpan Customer Baru via Modal
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
          // Reset kolom input form modal
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
    // 3. LIVE SEARCH PRODUK + STOK INDIKATOR
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
              
              // Validasi agar satu produk tidak masuk berkali-kali ke dalam daftar keranjang
              if (cart.some(item => item.id === pId)) {
                productFloat.style.display = "none";
                productInput.value = "";
                return;
              }

              // Masukkan barang ke array keranjang dinamis
              cart.push({
                id: pId,
                name: target.dataset.name,
                stock: parseFloat(target.dataset.stock),
                unit: target.dataset.unit,
                category: target.dataset.category,
                qty: 1,
                price: 25000 // Harga baseline default awal
              });

              productFloat.style.display = "none";
              productInput.value = "";
              calculateAndRender();
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
    // 4. CORE ENGINE DATA: HITUNG & RENDER UTAMA (CART, BOM, & KEUANGAN)
    // ==========================================================================
    function calculateAndRender() {
      // Render Baris Item Keranjang Belanja
      if (cart.length === 0) {
        cartContainer.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-md);">
            Belum ada produk terpilih harian.
          </p>
        `;
      } else {
        cartContainer.innerHTML = cart.map((item, idx) => `
          <div class="card create-card" style="margin-bottom: var(--space-sm); border: 1px solid var(--border);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-sm); padding-bottom: 4px; border-bottom: 1px solid var(--border);">
              <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
                ${item.name}
              </strong>
              <button class="btn-remove-cart" data-idx="${idx}" style="background: none; border: none; color: var(--danger); font-size: var(--text-xs); font-weight: var(--font-semibold); cursor: pointer;">
                Hapus
              </button>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Qty (${item.unit})</label>
                <input type="number" class="input cart-qty" data-idx="${idx}" value="${item.qty}" min="1" step="any" />
              </div>

              <div class="form-group">
                <label class="form-label">Harga (Rp)</label>
                <input type="number" class="input cart-price" data-idx="${idx}" value="${item.price}" min="0" />
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-sm); padding-top: 4px; border-top: 1px dashed var(--border);">
              <span class="text-light text-xs">Subtotal</span>
              <strong style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text);">
                Rp ${(item.qty * item.price).toLocaleString('id-ID')}
              </strong>
            </div>
          </div>
        `).join('');

        // Pasang Event Listener Interaktif untuk baris Qty & Harga di dalam cart
        cartContainer.querySelectorAll(".cart-qty").forEach(input => {
          input.addEventListener("input", (e) => {
            const idx = parseInt(e.target.dataset.idx);
            cart[idx].qty = parseFloat(e.target.value) || 0;
            calculateAndRender();
          });
        });

        cartContainer.querySelectorAll(".cart-price").forEach(input => {
          input.addEventListener("input", (e) => {
            const idx = parseInt(e.target.dataset.idx);
            cart[idx].price = parseFloat(e.target.value) || 0;
            calculateAndRender();
          });
        });

        cartContainer.querySelectorAll(".btn-remove-cart").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const idx = parseInt(e.target.dataset.idx);
            cart.splice(idx, 1);
            calculateAndRender();
          });
        });
      }

      // 4.1 LOGIKA OTOMATIS MANUFACTURING ANALYSIS (BOM ENGINE)
      let needsProduction = false;
      let totalRobustaNeeded = 0;
      let totalJagungNeeded = 0;

      cart.forEach(item => {
        // Analisis dipicu jika kuantitas pesanan melebihi stok fisik gudang
        if (item.qty > item.stock) {
          const shortage = item.qty - item.stock;

          // Simulasi racikan khusus Kopi Giras atau Blend dengan rasio komposisi 1:1
          if (item.name.toLowerCase().includes("giras") || item.name.toLowerCase().includes("blend")) {
            needsProduction = true;
            totalRobustaNeeded += (shortage * 0.5); // 50% Robusta
            totalJagungNeeded += (shortage * 0.5);  // 50% Jagung Penolong
          } else if (item.category === 'kopi_bubuk' || item.category === 'roastedbean') {
            // Asumsi varian single origin murni tanpa racikan campuran
            needsProduction = true;
            totalRobustaNeeded += shortage; 
          }
        }
      });

      if (needsProduction) {
        if (manufacturingCard) manufacturingCard.style.display = "block";
        if (bomDetails) {
          let bomHtml = "";
          if (totalRobustaNeeded > 0) {
            bomHtml += `
              <div class="detail-row-item" style="padding: 2px 0; display:flex; justify-content:space-between;">
                <span class="text-light text-sm">RB Robusta Base Material</span>
                <strong class="right-value" style="font-size: var(--text-sm); color: var(--text);">${totalRobustaNeeded.toFixed(1)}kg</strong>
              </div>
            `;
          }
          if (totalJagungNeeded > 0) {
            bomHtml += `
              <div class="detail-row-item" style="padding: 2px 0; display:flex; justify-content:space-between;">
                <span class="text-light text-sm">Jagung Roasted</span>
                <strong class="right-value" style="font-size: var(--text-sm); color: var(--text);">${totalJagungNeeded.toFixed(1)}kg</strong>
              </div>
            `;
          }
          bomDetails.innerHTML = bomHtml;
        }
      } else {
        if (manufacturingCard) manufacturingCard.style.display = "none";
      }

      // 4.2 LOGIKA INTEGRASI KEUANGAN (SUBTOTAL, BAYAR, STATUS SISA)
      const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
      const payVal = parseFloat(bayarInput?.value) || 0;
      const sisaTotal = subtotalTotal - payVal;

      if (summarySubtotal) summarySubtotal.textContent = `Rp ${subtotalTotal.toLocaleString('id-ID')}`;
      if (summaryBayar) summaryBayar.textContent = `Rp ${payVal.toLocaleString('id-ID')}`;
      if (summarySisa) {
        summarySisa.textContent = `Rp ${sisaTotal.toLocaleString('id-ID')}`;
        summarySisa.style.color = sisaTotal > 0 ? "var(--orange)" : "#10B981";
      }
    }

    if (bayarInput) {
      bayarInput.addEventListener("input", calculateAndRender);
    }

    // Initialize render awal
    calculateAndRender();

    // ==========================================================================
    // 5. SUBMIT DATA KE SUPABASE (DATABASE CORE EXECUTION)
    // ==========================================================================
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

          isSubmitting = true;
          submitBtn.disabled = true;
          submitBtn.textContent = "Processing...";

          try {
            const invoiceNo = 'SO-' + today.replace(/-/g, '') + '-' + Date.now().toString().slice(-4);
            const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
            const payAmount = parseFloat(bayarInput?.value) || 0;
            const netAmount = subtotalTotal;

            // 5.1 PENENTUAN STATUS PEMBAYARAN OTOMATIS SESUAI LOGIKA BISNIS
            let paymentStatus = 'pending'; // Default antrean masuk pending
            if (payAmount === 0) {
              paymentStatus = 'pending'; // Belum lunas
            } else if (payAmount > 0 && payAmount < netAmount) {
              paymentStatus = 'pending'; // Masuk hitungan DP (Status SO tetap pending produksi)
            } else if (payAmount >= netAmount) {
              // Jika lunas dan barang tidak butuh produksi (ready), bisa langsung diset lunas
            }

            // A. Kirim Data ke Nota Induk (sales_orders)
            const { data: orderData, error: orderError } = await supabase
              .from('sales_orders')
              .insert([{
                invoice_no: invoiceNo,
                order_date: dateInput?.value || today,
                customer_id: selectedCustomer.id,
                salesman_id: selectedSalesman,
                total_amount: subtotalTotal,
                discount: 0,
                net_amount: netAmount,
                payment_method: payAmount >= netAmount ? 'QRIS' : 'Cash',
                status: 'pending' // Sesuai perintah: Otomatis masuk status pending
              }])
              .select();

            if (orderError) throw orderError;

            const orderId = orderData[0].id;

            // B. Kirim Data ke Nota Detail (sales_order_items)
            const orderItemsPayload = cart.map(item => ({
              sales_order_id: orderId,
              product_id: item.id,
              qty: item.qty,
              unit_price: item.price
            }));

            const { error: itemsError } = await supabase
              .from('sales_order_items')
              .insert(orderItemsPayload);

            if (itemsError) throw itemsError;

            alert(`🎉 Sales Order ${invoiceNo} Berhasil Disimpan ke Antrean Pending!`);
            
            // Bersihkan tombol di luar scope layout, lalu kembali ke list utama
            if (actionsArea && actionsArea.parentElement === appLayout) {
              appLayout.removeChild(actionsArea);
            }
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

      // Tombol Cancel / Kembali
      if (draftBtn) {
        draftBtn.innerHTML = "Kembali";
        draftBtn.addEventListener("click", () => {
          if (actionsArea && actionsArea.parentElement === appLayout) {
            appLayout.removeChild(actionsArea);
          }
          if (window.navigate) window.navigate('order');
        });
      }
    }

  }, 50);

  return `
    <section class="create-page" style="padding-bottom: 120px;">

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Tanggal</label>
          <input type="date" id="order-date" class="input" />
        </div>

        <div class="form-group" style="position: relative;">
          <label class="form-label">Customer</label>
          <input type="text" id="customer-search" class="input" placeholder="Ketik nama warung / cari customer..." autocomplete="off" />
          <div id="customer-floating-list" class="card" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0;"></div>
        </div>

        <div class="form-group" style="margin-top: var(--space-md);">
          <label class="form-label">Salesman Lapangan</label>
          <select id="salesman-select" class="input" style="width: 100%; height: var(--input-height); background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0 var(--space-md);">
            <option value="">Memuat list salesman...</option>
          </select>
        </div>
      </div>

      <div class="card create-card">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-sm);">
          <div>
            <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text);">Produk</h3>
            <p class="text-light text-xs" style="margin-top: 1px;">Ketik nama item di bawah untuk menambahkan</p>
          </div>
        </div>

        <div class="form-group" style="position: relative;">
          <input type="text" id="product-search" class="input" placeholder="Ketik nama kopi / jenis produk..." autocomplete="off" />
          <div id="product-floating-list" class="card" style="position: absolute; top: 100%; left: 0; right: 0; z-index: 1010; display: none; max-height: 200px; overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 4px; padding:0;"></div>
        </div>
      </div>

      <div id="cart-items-container">
        </div>

      <div class="card create-card" id="manufacturing-analysis-card" style="display: none;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
          <div>
            <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text);">
              Produksi Dibutuhkan
            </h3>
            <p class="text-light text-xs" style="margin-top: 1px;">Auto manufacturing analysis</p>
          </div>
          <span class="badge badge-warning">Diproses</span>
        </div>

        <div style="display: flex; align-items: center; gap: var(--space-sm); background: var(--warning-soft); color: #D97706; padding: var(--space-md); border-radius: var(--radius-md); margin-bottom: var(--space-md);">
          <i data-lucide="factory" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
          <p style="font-size: var(--text-xs); font-weight: var(--font-medium); line-height: 1.4; margin: 0;">
            Stock produk gudang tidak mencukupi, sistem menjadwalkan produksi otomatis
          </p>
        </div>

        <div class="detail-info" id="bom-details-list" style="gap: var(--space-sm);">
          </div>
      </div>

      <div class="card create-card">
        <div class="detail-info" style="gap: var(--space-sm);">
          <div class="detail-row-item" style="padding: 2px 0; display:flex; justify-content:space-between;">
            <span class="text-light text-sm">Subtotal</span>
            <strong id="summary-subtotal" style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 0</strong>
          </div>

          <div class="detail-row-item" style="padding: 2px 0; display:flex; justify-content:space-between;">
            <span class="text-light text-sm">Bayar</span>
            <strong id="summary-bayar" style="font-size: var(--text-sm); font-weight: var(--font-bold);">Rp 0</strong>
          </div>

          <div class="detail-row-item" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: 4px; display:flex; justify-content:space-between;">
            <span class="font-semibold text-sm">Sisa Tagihan</span>
            <strong id="summary-sisa" class="right-value" style="color: var(--orange); font-size: var(--text-md); font-weight: var(--font-bold);">Rp 0</strong>
          </div>
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Nominal Pembayaran Saat Ini (Rp)</label>
          <input type="number" id="pay-amount" inputmode="numeric" class="input" placeholder="0" min="0" />
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Catatan Order</label>
          <textarea id="order-note" class="textarea" placeholder="Tambahkan instruksi pengiriman / racikan khusus harian..."></textarea>
        </div>
      </div>

      <div class="detail-actions">
        <button class="action-btn">Draft</button>
        <button class="action-btn primary-action">Submit</button>
      </div>

      <div id="customer-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 2000; display: none; align-items: center; justify-content: center; padding: 20px;">
        <div class="card" style="width: 100%; max-width: 400px; background: var(--white); padding: var(--space-lg); border-radius: var(--radius-md); box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
          <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); margin-bottom: var(--space-sm); color: var(--text);">Tambah Customer Baru</h3>
          <p class="text-light text-xs" style="margin-bottom: var(--space-md);">Warung belum terdaftar di master data area Anda.</p>
          
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
            <button id="close-customer-modal" class="action-btn" style="background: var(--border); color: var(--text); padding: 0 var(--space-md); border-radius: var(--radius-sm); border:none; height:38px; cursor:pointer;">Batal</button>
            <button id="save-new-customer" class="action-btn" style="background: var(--orange); color: white; padding: 0 var(--space-md); border-radius: var(--radius-sm); border:none; height:38px; font-weight:bold; cursor:pointer;">Simpan Data</button>
          </div>
        </div>
      </div>

    </section>
  `;
}
