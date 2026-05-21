import { supabase } from "../supabaseClient.js";

export function CreateOrderPage() {
  let selectedCustomer = null;
  let selectedSales = null;
  let cart = [];
  let isSubmitting = false;
  let manufacturingItems = [];
  let currentActiveProductionProduct = null;

  const today = new Date().toISOString().split('T')[0];

  // Helper function ditaruh di luar setTimeout agar bisa diakses kapan saja
  function calculateTotalsOnly(container, ongkirInput, bayarInput, summarySubtotal, summaryOngkir, summaryTotal, summaryChange, submitBtn) {
    const sampleToggle = container.querySelector("#sample-order-toggle");
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
      summaryChange.textContent = isSample ? "Rp 0 (Sample Mode)" : (sisaKembalian >= 0 ? "Rp " + sisaKembalian.toLocaleString('id-ID') + " (Kembalian)" : "Rp " + Math.abs(sisaKembalian).toLocaleString('id-ID') + " (Kurang)");
    }
    const hasActiveProduction = cart.some(item => item.needs_production === true);
    if (submitBtn) submitBtn.textContent = hasActiveProduction ? "Produksi & Simpan" : "Simpan";
  }

  setTimeout(() => {
    const container = document.querySelector(".create-order-page");
    if (!container) return;

    const dateInput = container.querySelector("input[type='date']");
    const customerInput = container.querySelector("#search-customer");
    const salesInput = container.querySelector("#search-sales");
    const productInput = container.querySelector("#search-product");
    const cartContainer = container.querySelector("#dynamic-cart-container");
    const submitBtn = container.querySelector(".primary-action");
    const draftBtn = container.querySelector(".action-btn:not(.primary-action)");
    
    const detailRows = container.querySelectorAll(".detail-info .detail-row-item strong");
    const ongkirInput = container.querySelector("#input-shipping");
    const bayarInput = container.querySelector("#input-payment");
    const catatanInput = container.querySelector(".textarea");
    const sampleToggle = container.querySelector("#sample-order-toggle");

    // Modal & Init Dropdowns (Sama seperti code lu sebelumnya)
    // ... [Masukkan logic modal & dropdown lu di sini] ...

    // Trigger kalkulasi pake parameter yang sudah didefinisikan
    const update = () => calculateTotalsOnly(container, ongkirInput, bayarInput, detailRows[0], detailRows[1], detailRows[2], detailRows[3], submitBtn);

    // Event Listeners
    ongkirInput?.addEventListener("input", update);
    bayarInput?.addEventListener("input", update);
    sampleToggle?.addEventListener("change", update);

    // ... [Sisa logic submit, renderCart, dll] ...
  }, 100);

  return `
    <section class="create-order-page">
      </section>
  `;
}
