// ==========================================================================
// FILE: src/pages/create-order-page.js
// STATUS: FULL FIXED + HTML TEMPLATE INCLUDED 🚀
// ==========================================================================

export function CreateOrderPage(container) {
  
  // 1. SAFE GUARD RUNTIME
  if (!container) {
    console.error("Gagal memuat halaman: Elemen 'container' tidak ditemukan!");
    return;
  }

  // ==========================================================================
  // 2. INJEKSI HTML FORM (Menggambar UI Form POS ke Layar HP)
  // ==========================================================================
  container.innerHTML = `
    <div class="p-4 font-sans max-w-md mx-auto bg-gray-50 min-h-screen pb-24" style="letter-spacing: 0.3px;">
      
      <div class="bg-white p-4 rounded-xl shadow-sm mb-4 flex items-center justify-between border border-gray-100">
        <div>
          <label class="font-bold text-sm text-gray-800 block">Sample Order Mode</label>
          <span class="text-xs text-gray-400">Aktifkan untuk pesanan contoh gratis</span>
        </div>
        <div class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
          <input type="checkbox" name="toggle" id="sample-order-toggle" class="toggle-checkbox absolute block w-6 height-6 rounded-full bg-white border-4 appearance-none cursor-pointer" style="top:2px; left:2px; border-color: #E2E8F0; width:20px; height:20px;"/>
          <label for="sample-order-toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-200 cursor-pointer" style="width:44px; height:24px;"></label>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100 space-y-3">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal Pesanan</label>
          <input type="date" id="order-date" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Catatan Internal / Warung</label>
          <textarea id="order-note" rows="2" placeholder="Masukkan catatan pesanan di sini..." class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500"></textarea>
        </div>
      </div>

      <div id="manufacturing-analysis-card" class="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4 hidden animate-fade-in">
        <div class="flex gap-2">
          <span class="text-amber-600 font-bold">⚠️</span>
          <div>
            <strong class="text-amber-800 text-sm block">Butuh Antrean Produksi!</strong>
            <span class="text-amber-700 text-xs block mt-0.5">Stok roastbean di POS kurang. Sistem akan otomatis mendaftarkan ke list jadwal produksi gais.</span>
          </div>
        </div>
      </div>

      <div id="summary-card" class="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100 space-y-2.5">
        <h3 class="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Rincian Biaya</h3>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Subtotal Produk</span>
          <span id="summary-subtotal" class="font-semibold text-gray-800">Rp 0</span>
        </div>
        <div class="flex justify-between text-sm items-center">
          <span class="text-gray-500">Ongkos Kirim (Ongkir)</span>
          <input type="number" id="order-ongkir" value="0" class="w-24 bg-gray-50 border border-gray-200 rounded p-1 text-right text-sm font-semibold focus:outline-none" />
        </div>
        <hr class="border-gray-100 my-1">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Total Tagihan</span>
          <span id="summary-ongkir" class="font-bold text-gray-900">Rp 0</span>
        </div>
      </div>

      <div id="payment-card" class="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nominal Uang Diterima (Bayar)</label>
        <div class="relative">
          <span class="absolute left-3 top-2.5 text-sm font-bold text-gray-400">Rp</span>
          <input type="number" id="order-bayar" placeholder="0" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 pl-9 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500" />
        </div>
        <div class="flex justify-between text-sm mt-3 pt-2 border-t border-gray-50">
          <span class="text-gray-500 font-medium">Sisa / Kembalian</span>
          <span id="summary-sisa" class="font-bold text-emerald-600">Rp 0</span>
        </div>
      </div>

      <button id="btn-simpan-order" class="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-150 transform active:scale-95 text-sm tracking-wide">
        SIMPAN & PROSES NOTA
      </button>

    </div>

    <style>
      .toggle-checkbox:checked { right: 2px; left: auto; background-color: #10B981; border-color: #10B981; }
      .toggle-checkbox:checked + .toggle-label { background-color: #A7F3D0; }
    </style>
  `;

  // ==========================================================================
  // 3. JALUR SELECTOR ELEMENT (Mencari elemen HTML yang baru saja di-inject di atas)
  // ==========================================================================
  const today = new Date().toISOString().split('T')[0];
  const dateInput = container.querySelector("#order-date");
  const ongkirInput = container.querySelector("#order-ongkir");
  const bayarInput = container.querySelector("#order-bayar");
  
  const summarySubtotal = container.querySelector("#summary-subtotal");
  const summaryOngkir = container.querySelector("#summary-ongkir");
  const summaryBayar = container.querySelector("#summary-bayar");
  const summarySisa = container.querySelector("#summary-sisa");

  const catatanInput = container.querySelector("#order-note");
  const sampleToggle = container.querySelector("#sample-order-toggle");
  const manufacturingCard = container.querySelector("#manufacturing-analysis-card");

  // STATE INTERNAL
  let isSubmitting = false;
  let isSampleOrder = false;

  // ==========================================================================
  // 4. EVENT LISTENERS & LOGIC INITIALIZATION
  // ==========================================================================
  if (dateInput) dateInput.value = today;

  if (sampleToggle) {
    sampleToggle.addEventListener("change", (e) => {
      isSampleOrder = e.target.checked;
      updateSampleMode();
      calculateTotalsOnly(); 
    });
  }

  // Tambahkan listener ketikan untuk dinamis kalkulasi total
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

    // Proteksi pengaman array keranjang belanja global POS kamu gais
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

    if (!needsProduction) {
      if (typeof bomCart !== "undefined") bomCart = [];
      if (typeof renderBomCartStructure === "function") renderBomCartStructure();
    }

    const subtotalTotal = (typeof cart !== "undefined") 
      ? cart.reduce((acc, item) => acc + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0)
      : 0;

    const ongkirVal = parseFloat(ongkirInput?.value || 0);
    const payVal = parseFloat(bayarInput?.value || 0);
    
    // Jika mode sample aktif, paksa total biaya jadi nol rupiah gais
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

  // Pemicu hitung instan saat halaman dibuka gais
  calculateTotalsOnly();

  // ==========================================================================
  // 5. SUBMIT PAYLOAD HANDLER TO SUPABASE
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

      alert("Pesanan Sample/Reguler Berhasil Disimpan gais!");
      
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

  // Bind klik tombol simpan transaksi
  const submitBtn = container.querySelector("#btn-simpan-order");
  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmitOrder);
  }
}
