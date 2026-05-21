// ==========================================================================
// FILE: src/pages/create-order-page.js
// STATUS: 100% INTEGRATED WITH YOUR NATIVE CSS CLASSES! 🚀
// ==========================================================================

export function CreateOrderPage(container) {
  
  if (!container) {
    console.error("Gagal memuat halaman: Elemen 'container' tidak ditemukan!");
    return;
  }

  // Menggunakan kelas utama dari CSS kamu untuk form layout universal
  container.className = "create-order-page";

  // ==========================================================================
  // 1. INJEKSI UI - MENGIKUTI STRUKTUR & KELAS CSS NATIVE KAMU
  // ==========================================================================
  container.innerHTML = `
    <!-- TOGGLE SAMPLE ORDER MODE (Menggunakan struktur .create-card kamu) -->
    <div class="card create-card" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
      <div>
        <label style="font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text); display: block;">Sample Order Mode</label>
        <span style="font-size: var(--text-xs); color: var(--text-light); display: block; margin-top: 2px;">Aktifkan untuk pesanan contoh gratis / warung</span>
      </div>
      <div class="toggle-wrapper" style="position: relative; display: inline-block; width: 44px; height: 24px;">
        <input type="checkbox" id="sample-order-toggle" class="toggle-checkbox" style="position: absolute; opacity: 0; width: 0; height: 0;" />
        <label for="sample-order-toggle" class="toggle-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #E2E8F0; transition: .3s; border-radius: 24px;"></label>
      </div>
    </div>

    <!-- FORM UTAMA (Menggunakan .create-card dan .form-group dari CSS kamu) -->
    <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
      
      <!-- TANGGAL -->
      <div class="form-group">
        <label class="form-label" for="order-date">Tanggal Pesanan</label>
        <input type="date" id="order-date" class="input" />
      </div>

      <!-- CUSTOMER -->
      <div class="form-group" style="position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <label class="form-label" for="search-customer" style="margin-bottom: 0;">Customer</label>
          <button type="button" id="btn-add-customer" style="background: none; border: none; color: #3B82F6; font-size: var(--text-xs); font-weight: var(--font-medium); cursor: pointer; padding: 0;">+ Tambah Baru</button>
        </div>
        <input type="text" id="search-customer" class="input" placeholder="Cari nama customer / warung dari database..." autocomplete="off" />
        <div id="customer-dropdown" class="dropdown-results" style="display:none; position:absolute; top:100%; left:0; background: var(--white); border:1px solid var(--border); width:100%; z-index:100; max-height: 200px; overflow-y: auto;"></div>
      </div>

      <!-- SALES -->
      <div class="form-group" style="position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <label class="form-label" for="search-sales" style="margin-bottom: 0;">Salesman</label>
          <button type="button" id="btn-add-sales" style="background: none; border: none; color: #3B82F6; font-size: var(--text-xs); font-weight: var(--font-medium); cursor: pointer; padding: 0;">+ Tambah Baru</button>
        </div>
        <input type="text" id="search-sales" class="input" placeholder="Pilih atau cari nama sales..." autocomplete="off" />
        <div id="sales-dropdown" class="dropdown-results" style="display:none; position:absolute; top:100%; left:0; background: var(--white); border:1px solid var(--border); width:100%; z-index:100; max-height: 150px; overflow-y: auto;"></div>
      </div>

    </div>

    <!-- PENCARIAN PRODUK -->
    <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
      <div class="form-group" style="position: relative;">
        <label class="form-label" style="font-weight: var(--font-medium); color: var(--text);">Tambah Produk</label>
        <input type="text" id="search-product" class="input" placeholder="Cari kopi, roastbean, cup, packaging..." autocomplete="off" />
        <div id="product-dropdown" class="dropdown-results" style="display:none; position:absolute; top:100%; left:0; background: var(--white); border:1px solid var(--border); width:100%; z-index:100; max-height: 200px; overflow-y: auto;"></div>
      </div>
    </div>

    <!-- KERANJANG / CART PRODUK -->
    <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm); overflow-x: auto;">
      <label class="form-label" style="font-weight: var(--font-medium); color: var(--text);">Keranjang Produk</label>
      <table style="width: 100%; border-collapse: collapse; font-size: var(--text-sm);">
        <thead>
          <tr style="border-bottom: 2px solid var(--border); text-align: left; background: #F8FAFC;">
            <th style="padding: var(--space-xs); color: var(--text-light); font-size: var(--text-xs);">Produk</th>
            <th style="padding: var(--space-xs); width: 70px; color: var(--text-light); font-size: var(--text-xs);">Qty</th>
            <th style="padding: var(--space-xs); width: 130px; color: var(--text-light); font-size: var(--text-xs);">Harga (Rp)</th>
            <th style="padding: var(--space-xs); width: 100px; text-align: right; color: var(--text-light); font-size: var(--text-xs);">Total</th>
            <th style="padding: var(--space-xs); width: 40px; text-align: center; color: var(--text-light); font-size: var(--text-xs);">Aksi</th>
          </tr>
        </thead>
        <tbody id="cart-items-body">
          <!-- Dinamis via JS, jika kosong tampilkan ini -->
          <tr id="empty-cart-row">
            <td colspan="5" style="text-align: center; padding: var(--space-md); color: var(--text-light); font-style: italic;">Belum ada produk</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- RINCIAN PEMBAYARAN & SUMMARY (Memanfaatkan .form-grid-2 milikmu) -->
    <div class="card create-card" style="background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-sm);">
      <label class="form-label" style="font-weight: var(--font-medium); color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 4px;">Rincian & Biaya</label>
      
      <!-- Menggunakan Form Grid 2 dari CSS kamu untuk Qty/Harga/Nominal Sampingan -->
      <div class="form-grid-2">
        <div class="form-group">
          <label class="form-label">Nominal Bayar (Rp)</label>
          <input type="number" id="input-payment" class="input" placeholder="0" min="0" style="text-align: right;" />
        </div>
        <div class="form-group">
          <label class="form-label">Ongkos Kirim (Rp)</label>
          <input type="number" id="input-shipping" class="input" placeholder="0" min="0" style="text-align: right;" />
        </div>
      </div>

      <hr style="border: 0; border-top: 1px dashed var(--border); margin: 4px 0;" />

      <!-- RINGKASAN TOTAL -->
      <div id="summary-section" style="display: flex; flex-direction: column; gap: 6px; font-size: var(--text-sm);">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-light); font-size: var(--text-xs);">Subtotal Produk</span>
          <span id="summary-subtotal" style="font-weight: var(--font-medium);">Rp 0</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-light); font-size: var(--text-xs);">Ongkos Kirim</span>
          <span id="summary-shipping" style="font-weight: var(--font-medium);">Rp 0</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; padding-top: 8px; border-top: 1px solid var(--border);">
          <span style="font-weight: var(--font-bold); color: var(--text);">Grand Total</span>
          <span id="summary-grand-total" style="font-weight: var(--font-bold); color: #10B981; font-size: var(--text-base);">Rp 0</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-light); font-size: var(--text-xs);">Sisa / Kembalian</span>
          <span id="summary-change" style="font-weight: var(--font-medium);">Rp 0</span>
        </div>
      </div>
    </div>

    <!-- TOMBOL AKSI UTAMA (Dibungkus rapi, otomatis aman dengan padding-bottom bawaan CSS .create-order-page) -->
    <div style="display: flex; justify-content: flex-end; gap: var(--space-sm); margin-top: auto;">
      <button type="button" id="btn-action-draft" style="background: #64748B; color: #fff; padding: 0 var(--space-lg); height: 40px; border: none; border-radius: var(--radius-sm); font-weight: var(--font-medium); cursor: pointer;">Draft</button>
      <button type="button" id="btn-action-save" style="background: var(--orange, #F97316); color: #fff; padding: 0 var(--space-lg); height: 40px; border: none; border-radius: var(--radius-sm); font-weight: var(--font-medium); cursor: pointer;">Simpan</button>
    </div>
  `;

  // ==========================================================================
  // 2. LOGIC INITIALIZATION (AUTO DATE & LISTENERS BASE)
  // ==========================================================================
  
  const dateInput = document.getElementById('order-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Handler Tambah Customer Baru
  const btnAddCustomer = document.getElementById('btn-add-customer');
  if (btnAddCustomer) {
    btnAddCustomer.addEventListener('click', () => {
      const newCustomerName = prompt("Masukkan nama Customer baru:");
      if (newCustomerName) {
        document.getElementById('search-customer').value = newCustomerName;
      }
    });
  }

  // Handler Tambah Sales Baru
  const btnAddSales = document.getElementById('btn-add-sales');
  if (btnAddSales) {
    btnAddSales.addEventListener('click', () => {
      const newSalesName = prompt("Masukkan nama Salesman baru:");
      if (newSalesName) {
        document.getElementById('search-sales').value = newSalesName;
      }
    });
  }
}
