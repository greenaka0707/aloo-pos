// ==========================================================================
// FILE: src/pages/create-order-page.js
// STATUS: FULL FIXED & PROTECTED
// ==========================================================================

export function CreateOrderPage(container) {
  
  // ==========================================================================
  // RUNTIME SAFE GUARD (Mencegah Error 'querySelector of undefined')
  // ==========================================================================
  if (!container) {
    console.error("Gagal memuat halaman: Elemen 'container' tidak ditemukan atau undefined!");
    return; // Berhenti dengan aman tanpa merusak aplikasi
  }

  // ==========================================================================
  // DEPENDENCIES & GLOBAL VARIABLES CHECK
  // ==========================================================================
  const today = new Date().toISOString().split('T')[0];
  const dateInput = container.querySelector("#order-date");
  const ongkirInput = container.querySelector("#order-ongkir");
  const bayarInput = container.querySelector("#order-bayar");
  
  const summarySubtotal = container.querySelector("#summary-subtotal");
  const summaryOngkir = container.querySelector("#summary-ongkir");
  const summaryBayar = container.querySelector("#summary-bayar");
  const summarySisa = container.querySelector("#summary-sisa");

  // ==========================================================================
  // STATE
  // ==========================================================================
  let isSubmitting = false;
  let isSampleOrder = false;

  // ==========================================================================
  // ELEMENT
  // ==========================================================================
  const catatanInput = container.querySelector("#order-note");
  const sampleToggle = container.querySelector("#sample-order-toggle");
  const manufacturingCard = container.querySelector("#manufacturing-analysis-card");

  // ==========================================================================
  // INIT
  // ==========================================================================
  if (dateInput) dateInput.value = today;

  if (sampleToggle) {
    sampleToggle.addEventListener("change", (e) => {
      isSampleOrder = e.target.checked;
      updateSampleMode();
      calculateTotalsOnly(); // Mengatur ulang perhitungan dan visual komponen
    });
  }

  // ==========================================================================
  // UPDATE SAMPLE MODE (UI VISIBILITY)
  // ==========================================================================
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
      // Tampilan manufacturingCard dikembalikan pengaturannya ke calculateTotalsOnly()
    }
  }

  // ==========================================================================
  // CALCULATE TOTALS & PRODUCTION CHECK
  // ==========================================================================
  function calculateTotalsOnly() {
    let needsProduction = false;

    // Pastikan variabel array 'cart' tersedia secara global
    if (typeof cart !== "undefined" && Array.isArray(cart)) {
      cart.forEach((item) => {
        const validQty = parseFloat(item.qty) || 0;
        if (
          !isSampleOrder &&
          item.category !== "greenbean" &&
          validQty > item.stock
        ) {
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
    const sisaTotal = (subtotalTotal + ongkirVal) - payVal;

    if (summarySubtotal) {
      summarySubtotal.textContent = `Rp ${subtotalTotal.toLocaleString("id-ID")}`;
    }
    if (summaryOngkir) {
      summaryOngkir.textContent = `Rp ${ongkirVal.toLocaleString("id-ID")}`;
    }
    if (summaryBayar) {
      summaryBayar.textContent = `Rp ${payVal.toLocaleString("id-ID")}`;
    }
    if (summarySisa) {
      summarySisa.textContent = `Rp ${sisaTotal.toLocaleString("id-ID")}`;
      summarySisa.style.color = sisaTotal > 0 ? "var(--orange)" : "#10B981";
    }
  }

  // ==========================================================================
  // SAFE SUBMIT HANDLER (SUPABASE BACKEND INTEGRATION)
  // ==========================================================================
  async function handleSubmitOrder() {
    if (isSubmitting) return;
    
    if (typeof cart === "undefined" || cart.length === 0) {
      alert("Keranjang masih kosong!");
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
      
      const finalOngkir = isSampleOrder ? 0 : (parseFloat(ongkirInput?.value) || 0);
      const finalBayar = isSampleOrder ? 0 : (parseFloat(bayarInput?.value) || 0);
      const finalTotal = isSampleOrder ? 0 : cart.reduce((acc, item) => acc + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);

      // Ambil objek customer global jika ada
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

      // Pastikan objek koneksi 'supabase' di-import/tersedia secara global
      if (typeof supabase === "undefined") {
        throw new Error("Koneksi database (Supabase) tidak ditemukan!");
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

      alert("Pesanan berhasil disimpan!");
      
      if (typeof cart !== "undefined") cart = [];
      isSampleOrder = false;
      if (sampleToggle) sampleToggle.checked = false;
      
      window.location.hash = "#/orders"; 

    } catch (error) {
      console.error("Gagal menyimpan order:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      isSubmitting = false;
    }
  }

  // Bind fungsi submit ke tombol aksi simpan order
  const submitBtn = container.querySelector("#btn-simpan-order");
  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmitOrder);
  }
}
