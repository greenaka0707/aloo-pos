// ==========================================================================
// SAMPLE ORDER SUPPORT - COMPLETE FULL SAFE PATCH
// ==========================================================================

// ==========================================================================
// 1. STATE
// ==========================================================================
let isSubmitting = false;
let isSampleOrder = false;

// ==========================================================================
// 2. ELEMENT
// ==========================================================================
const catatanInput = container.querySelector("#order-note");
const sampleToggle = container.querySelector("#sample-order-toggle");
const manufacturingCard = container.querySelector("#manufacturing-analysis-card");

// ==========================================================================
// 3. INIT
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
// 4. UPDATE SAMPLE MODE (UI VISIBILITY)
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
    // Biarkan fungsi calculateTotalsOnly() yang menentukan display manufacturingCard
  }
}

// ==========================================================================
// 5. CALCULATE TOTALS & PRODUCTION CHECK
// ==========================================================================
function calculateTotalsOnly() {
  let needsProduction = false;

  cart.forEach((item) => {
    const validQty = parseFloat(item.qty) || 0;
    // Sample order dibebaskan dari kewajiban antrean produksi / manufacturing analysis
    if (
      !isSampleOrder &&
      item.category !== "greenbean" &&
      validQty > item.stock
    ) {
      needsProduction = true;
    }
  });

  // Tampilkan kartu analisis manufaktur hanya jika regular order membutuhkan produksi tambahan
  if (manufacturingCard) {
    manufacturingCard.style.display = (needsProduction && !isSampleOrder) ? "block" : "none";
  }

  if (!needsProduction) {
    bomCart = [];
    renderBomCartStructure();
  }

  const subtotalTotal = cart.reduce((acc, item) => {
    return acc + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0));
  }, 0);

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
// 6. SAFE SUBMIT HANDLER (SUPABASE BACKEND INTEGRATION)
// ==========================================================================
async function handleSubmitOrder() {
  if (isSubmitting) return;
  
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  // VALIDASI PEMBAYARAN: Hanya berlaku jika BUKAN sample order
  if (!isSampleOrder) {
    const payVal = parseFloat(bayarInput?.value || 0);
    if (payVal <= 0) {
      alert("Mohon masukkan nominal pembayaran untuk pesanan reguler!");
      return;
    }
  }

  try {
    isSubmitting = true;
    
    // Set parameter finansial ke angka 0 jika ini adalah orderan sample
    const finalOngkir = isSampleOrder ? 0 : (parseFloat(ongkirInput?.value) || 0);
    const finalBayar = isSampleOrder ? 0 : (parseFloat(bayarInput?.value) || 0);
    const finalTotal = isSampleOrder ? 0 : cart.reduce((acc, item) => acc + ((parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0)), 0);

    // Daftarkan payload utama ke tabel 'orders' di Supabase kamu
    const orderPayload = {
      customer_id: selectedCustomer?.id || null,
      order_date: dateInput?.value || today,
      note: catatanInput?.value || "",
      is_sample: isSampleOrder, // Flag penanda agar laporan keuangan/stok di backend tidak kacau
      total_price: finalTotal,
      ongkir: finalOngkir,
      amount_paid: finalBayar,
      status: isSampleOrder ? "completed" : "pending" 
    };

    // Jalankan operasi insert menggunakan klien Supabase kamu
    // (Sesuaikan variabel 'supabase' dengan inisialisasi yang ada di project kamu)
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([orderPayload])
      .select();

    if (orderError) throw orderError;

    const newOrderId = orderData[0].id;

    // Mapping item keranjang untuk dimasukkan ke tabel 'order_items'
    const itemsPayload = cart.map((item) => ({
      order_id: newOrderId,
      product_id: item.id,
      qty: parseFloat(item.qty) || 0,
      price: isSampleOrder ? 0 : (parseFloat(item.price) || 0) // Harga dicatat 0 jika sample
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) throw itemsError;

    alert("Pesanan berhasil disimpan!");
    
    // Reset state aplikasi/halaman setelah berhasil
    cart = [];
    isSampleOrder = false;
    if (sampleToggle) sampleToggle.checked = false;
    
    // Redirect atau re-render halaman utama POS
    window.location.hash = "#/orders"; 

  } catch (error) {
    console.error("Gagal menyimpan order:", error);
    alert(`Terjadi kesalahan: ${error.message}`);
  } finally {
    isSubmitting = false;
  }
}
