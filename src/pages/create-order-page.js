// ==========================================================================
// FILE: src/pages/create-order-page.js
// STATUS: 100% MATCH WITH YOUR NATIVE CSS 🚀
// ==========================================================================

export function CreateOrderPage(container) {
  
  if (!container) {
    console.error("Gagal memuat halaman: Elemen 'container' tidak ditemukan!");
    return;
  }

  // ==========================================================================
  // INJEKSI UI - MENGIKUTI CLASS CSS NATIVE DI STYLE.CSS KAMU
  // ==========================================================================
  container.innerHTML = `
    <div class="create-order-page">
      
      <div class="card create-card" style="flex-direction: row; justify-content: space-between; align-items: center;">
        <div>
          <label style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text); block">Sample Order Mode</label>
          <span style="font-size: var(--text-xs); color: var(--text-light); display: block; margin-top: 2px;">Aktifkan untuk pesanan contoh gratis</span>
        </div>
        <div class="toggle-wrapper" style="position: relative; inline-block; width: 44px; height: 24px;">
          <input type="checkbox" id="sample-order-toggle" class="toggle-checkbox" style="position: absolute; opacity: 0; width: 0; height: 0;" />
          <label for="sample-order-toggle" class="toggle-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #E2E8F0; transition: .3s; border-radius: 24px;"></label>
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label" for="order-date">Tanggal Pesanan</label>
          <input type="date" id="order-date" class="input" />
        </div>
        
        <div class="form-group">
          <label class="form-label" for="order-note">Catatan Internal / Warung</label>
          <textarea id="order-note" class="textarea" placeholder="Masukkan catatan pesanan di sini..."></textarea>
        </div>
      </div>

      <div id="manufacturing-analysis-card" class="card create-card" style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: var(--radius-sm); display: none;">
        <div style="display: flex; gap: 8px;">
          <span style="color: #EA580C; font-weight: bold;">⚠️</span>
          <div>
            <strong style="color: #9A3412; font-size: var(--text-sm); display: block;">Butuh Antrean Produksi!</strong>
            <span style="color: #C2410C; font-size: var(--text-xs); display: block; margin-top: 2px;">Stok roastbean di POS kurang. Sistem otomatis mendaftarkan ke list jadwal produksi gais.</span>
          </div>
        </div>
      </div>

      <div id="summary-card" class="card create-card">
        <h3 class="form-label" style="text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Rincian Biaya</h3>
        
        <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
          <span style="color: var(--text-light);">Subtotal Produk</span>
          <span id="summary-subtotal" style="font-weight: var(--font-semibold); color: var(--text);">Rp 0</span>
        </div>
        
        <div class="form-grid-2" style="align-items: center;">
          <span style="color: var(--text-light); font-size: var(--text-sm);">Ongkos Kirim</span>
          <input type="number" id="order-ongkir" value="0" class="input" style="text-align: right; font-weight: var(--font-semibold);" />
        </div>
        
        <div style="border-top: 1px solid var(--border); margin: 4px 0;"></div>
        
        <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
          <span style="color: var(--text-light); font-weight: var(--font-semibold);">Total Tagihan</span>
          <span id="summary-ongkir" style="font-weight: var(--font-bold); color: var(--text);">Rp 0</span>
        </div>
      </div>

      <div id="payment-card" class="card create-card">
        <div class="form-group">
          <label class="form-label" for="order-bayar">Nominal Uang Diterima (Bayar)</label>
          <div style="position: relative; width: 100%;">
            <span style="position: absolute; left: var(--space-md); top: 50%; transform: translateY(-50%); font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text-light);">Rp</span>
            <input type="number" id="order-bayar" class="input" style="padding-left: 36px; font-weight: var(--font-bold);" placeholder="0" />
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; font-size: var(--text-sm); margin-top: 8px; pt: 4px; border-top: 1px solid var(--border);">
          <span style="color: var(--text-light);">Sisa / Kembalian</span>
          <span id="summary-sisa" style="font-weight: var(--font-bold); color: #10B981;">Rp 0</span>
        </div>
      </div>

      <button id="btn-simpan-order" style="width: 100%; background: var(--orange); color: var(--white); border: none; border-radius: var(--radius-sm); font-weight: var(--font-bold); padding: var(--space-md) 0; font-size: var(--text-sm); cursor: pointer; transition: var(--transition); box-shadow: 0 4px 12px rgba(249,115,22,0.15);">
        SIMPAN & PROSES NOTA
      </button>

    </div>

    <style>
      .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
      .toggle-checkbox:checked + .toggle-slider { background-color: #10B981; }
      .toggle-checkbox:checked + .toggle-slider:before { transform: translateX(20px); }
    </style>
  `;

  // ==========================================================================
  // SELECTOR ELEMENT - SEKARANG MENCOCOKKAN ID DAN CLASS BARU
  // ==========================================================================
  const today = new Date().toISOString().split('T')[0];
  const dateInput = container.querySelector("#order-date");
  const ongkirInput = container.querySelector("#order-ongkir");
  const bayarInput = container.querySelector("#order-bayar");
  
  const summarySubtotal = container.querySelector("#summary-subtotal");
  const summaryOngkir = container.querySelector("#summary-ongkir");
  const summarySisa = container.querySelector("#summary-sisa");

  const catatanInput = container.querySelector("#order-note");
  const sampleToggle = container.querySelector("#sample-order-toggle");
  const manufacturingCard = container.querySelector("#manufacturing-analysis-card");

  let isSubmitting = false;
  let isSampleOrder = false;

  // ==========================================================================
  // INIT & LISTENERS
  // ==========================================================================
  if (dateInput) dateInput.value = today;

  if (sampleToggle) {
    sampleToggle.addEventListener("change", (e) => {
      isSampleOrder = e.target.checked;
      updateSampleMode();
      calculateTotalsOnly(); 
    });
  }

  if (ongkirInput) ongkirInput.addEventListener("input", calculateTotalsOnly);
  if (bayarInput) bayarInput.addEventListener("input", calculateTotalsOnly);

  function updateSampleMode() {
    const summaryCard = container.querySelector("#summary-card");
    const paymentCard = container.querySelector("#payment-card");

    if (isSampleOrder) {
      if (summaryCard) summaryCard.style.display = "none";
      if (paymentCard) paymentCard.style.display = "none";
      if (manufacturingCard) manufacturingCard.style.display = "none";
    } else {
      if (summaryCard) summaryCard.style.display = "block";
      if (paymentCard) paymentCard.style.display = "block";
    }
  }

  function calculateTotalsOnly() {
    let needsProduction = false;

    if (typeof cart !== "undefined" && Array.isArray(cart)) {
      cart.forEach((item) => {
        const validQty = parseFloat(item.qty) || 0;
        if (!isSampleOrder && item.category !== "greenbean" && validQty > item.stock) {
          needsProduction = true;
        }
      });
    }

    if (manufacturingCard) {
      manufacturingCard.style.display = (needsProduction && !isSampleOrder) ? "block" : "none";
    }

    const subtotalTotal = (typeof cart !== "undefined") 
      ? cart.reduce((acc, item) => acc + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0)
      : 0;

    const ongkirVal = parseFloat(ongkirInput?.value || 0);
    const payVal = parseFloat(bayarInput?.value || 0);
    
    const totalTagihan = isSampleOrder ? 0 : (subtotalTotal + ongkirVal);
    const sisaTotal = totalTagihan - payVal;

    if (summarySubtotal) {
      summarySubtotal.textContent = `Rp ${subtotalTotal.toLocaleString("id-ID")}`;
    }
    if (summaryOngkir) {
      summaryOngkir.textContent = `Rp ${totalTagihan.toLocaleString("id-ID")}`;
    }
    if (summarySisa) {
      summarySisa.textContent = `Rp ${Math.abs(sisaTotal).toLocaleString("id-ID")}`;
      summarySisa.style.color = sisaTotal > 0 ? "var(--orange)" : "#10B981";
    }
  }

  calculateTotalsOnly();

  // ==========================================================================
  // SUBMIT HANDLER TO SUPABASE
  // ==========================================================================
  async function handleSubmitOrder() {
    if (isSubmitting) return;
    
    if (typeof cart === "undefined" || cart.length === 0) {
      alert("Keranjang belanja kasir masih kosong gais!");
      return;
    }

    if (!isSampleOrder) {
      const payVal = parseFloat(bayarInput?.value || 0);
      if (payVal <= 0) {
        alert("Mohon masukkan nominal pembayaran untuk pesanan reguler!");
        return;
      }
    }

    try {
      isSubmitting = true;
      
      const subtotalTotal = cart.reduce((acc, item) => acc + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);
      const finalOngkir = isSampleOrder ? 0 : (parseFloat(ongkirInput?.value) || 0);
      const finalBayar = isSampleOrder ? 0 : (parseFloat(bayarInput?.value) || 0);
      const finalTotal = isSampleOrder ? 0 : (subtotalTotal + finalOngkir);

      const currentCustomer = typeof selectedCustomer !== "undefined" ? selectedCustomer : null;

      const orderPayload = {
        customer_id: currentCustomer?.id || null,
        order_date: dateInput?.value || today,
        note: catatanInput?.value || "",
        is_sample: isSampleOrder, 
        total_price: finalTotal,
        ongkir: finalOngkir,
        amount_paid: finalBayar,
        status: isSampleOrder ? "completed" : "pending" 
      };

      if (typeof supabase === "undefined") {
        throw new Error("Koneksi database Supabase terputus!");
      }

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([orderPayload])
        .select();

      if (orderError) throw orderError;

      const newOrderId = orderData[0].id;

      const itemsPayload = cart.map((item) => ({
        order_id: newOrderId,
        product_id: item.id,
        qty: parseFloat(item.qty) || 0,
        price: isSampleOrder ? 0 : (parseFloat(item.price) || 0)
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (itemsError) throw itemsError;

      alert("Pesanan Berhasil Disimpan!");
      
      if (typeof cart !== "undefined") cart = [];
      isSampleOrder = false;
      if (sampleToggle) sampleToggle.checked = false;
      
      window.location.hash = "#/orders"; 

    } catch (error) {
      console.error("Gagal menyimpan data transaksi:", error);
      alert(`Terjadi kesalahan database: ${error.message}`);
    } finally {
      isSubmitting = false;
    }
  }

  const submitBtn = container.querySelector("#btn-simpan-order");
  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmitOrder);
  }
}
