// ==========================================================================
// FILE: src/pages/create-order-page.js
// STATUS: 100% FIXED STRING CLOSURE, HTML TAGS & STRUCTURE SECURED! 🚀
// ==========================================================================

export function CreateOrderPage(container) {
  
  if (!container) {
    console.error("Gagal memuat halaman: Elemen 'container' tidak ditemukan!");
    return;
  }

  // Set class native pembungkus halaman form input kasir
  container.className = "create-order-page";

  // ==========================================================================
  // 1. INJEKSI UI - URUTAN BENAR SESUAI MOCKUP TOKOMU
  // ==========================================================================
  container.innerHTML = `
    <!-- TOGGLE SAMPLE ORDER MODE -->
    <div class="card create-card" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; background: #ffffff; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: var(--space-md);">
      <div>
        <label style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text); display: block;">Sample Order Mode</label>
        <span style="font-size: var(--text-xs); color: var(--text-light); display: block; margin-top: 2px;">Aktifkan untuk pesanan contoh gratis / warung</span>
      </div>
      <div class="toggle-wrapper" style="position: relative; display: inline-block; width: 44px; height: 24px;">
        <input type="checkbox" id="sample-order-toggle" class="toggle-checkbox" style="position: absolute; opacity: 0; width: 0; height: 0;" />
        <label for="sample-order-toggle" class="toggle-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #E2E8F0; transition: .3s; border-radius: 24px;"></label>
      </div>
    </div>

    <!-- FORM UTAMA: TANGGAL, CUSTOMER, SALESMAN -->
    <div class="card create-card" style="background: #ffffff; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-md);">
      
      <div class="form-group">
        <label class="form-label" for="order-date">Tanggal Pesanan</label>
        <input type="date" id="order-date" class="input" style="width: 100%; box-sizing: border-box;" />
      </div>

      <div class="form-group" style="position: relative;">
        <label class="form-label" for="search-customer">Customer</label>
        <input type="text" id="search-customer" class="input" placeholder="Cari nama customer / warung dari database..." autocomplete="off" style="width: 100%; box-sizing: border-box;" />
        <div id="customer-dropdown" class="dropdown-results" style="display:none; position:absolute; top:100%; left:0; background:#fff; border:1px solid var(--border); width:100%; z-index:100;"></div>
      </div>

      <div class="form-group" style="position: relative;">
        <label class="form-label" for="search-sales">Salesman</label>
        <input type="text" id="search-sales" class="input" placeholder="Pilih nama sales..." autocomplete="off" style="width: 100%; box-sizing: border-box;" />
        <div id="sales-dropdown" class="dropdown-results" style="display:none; position:absolute; top:100%; left:0; background:#fff; border:1px solid var(--border); width:100%; z-index:100;"></div>
      </div>

    </div>

    <!-- PILIH PRODUK -->
    <div class="card create-card" style="background: #ffffff; padding: var(--space-md); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: var(--space-md);">
      <div class="form-group" style="position: relative;">
        <label class="form-label" style="font-weight: var(--font-bold); display: block; margin-bottom: var(--space-xs);">Tambah Produk</label>
        <input type="text" id="search-product" class="input" placeholder="Cari kopi, roastbean, cup, packaging..." autocomplete="off" style="width: 100%; box-sizing: border-box;" />
        <div id="product-dropdown" class="dropdown-results" style="display:none; position:absolute; top:100%; left:0; background:#fff; border:1px solid var(--border); width:100%; z-index:100;"></div>
      </div>
    </div>

    <!-- PLACEHOLDER UNTUK LIST ITEM YANG DIPILIH -->
    <div id="selected-products-container" class="margin-top-md"></div>
  `;

  // ==========================================================================
  // 2. LOGIC & INITIALIZATION (SUPABASE SEARCH / EVENT LISTENERS)
  // ==========================================================================
  
  // Set default tanggal hari ini otomatis
  const dateInput = document.getElementById('order-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Sisa fungsi logic Supabase search untuk Customer, Sales, dan Product 
  // bisa langsung kamu letakkan di bawah sini tanpa merusak syntax HTML-nya lagi.
}
