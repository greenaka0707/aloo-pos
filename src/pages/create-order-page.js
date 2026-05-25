export function CreateOrderPage(container) {
  
  // Deteksi waktu default untuk input tanggal
  const today = new Date().toISOString().split('T')[0];

  setTimeout(() => {
    if (!container) return;
    console.log("DOM Sederhana CreateOrderPage Berhasil Terpasang!");

    // Set tanggal otomatis hari ini
    const dateInput = container.querySelector("#order-date");
    if (dateInput) dateInput.value = today;

    // Respon klik tombol simpan untuk memastikan interaksi aktif
    const submitBtn = container.querySelector(".primary-action");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        alert("Koneksi UI Berhasil! Form siap diintegrasikan ke database.");
      });
    }
  }, 50);

  // Mengembalikan layout HTML murni tanpa interupsi query database
  return `
    <section class="create-order-page">

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Tanggal Order</label>
          <input type="date" id="order-date" class="input" />
        </div>
        <div class="form-group">
          <label class="form-label">Nama Sales</label>
          <input type="text" class="input" placeholder="Ketik nama sales..." autocomplete="off" />
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Customer / Pelanggan</label>
          <input type="text" class="input" placeholder="Ketik nama customer..." autocomplete="off" />
        </div>
      </div>

      <div class="card create-card">
        <div style="margin-bottom: var(--space-md);">
          <h3 style="font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text);">Produk Order</h3>
          <p class="text-light text-xs" style="margin-top: 1px;">Input item pengerjaan pabrik</p>
        </div>
        <div class="form-group">
          <input type="text" class="input" placeholder="Ketik nama produk manufaktur..." autocomplete="off" />
        </div>
      </div>

      <div class="card create-card" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div class="form-group">
          <label class="form-label">Estimasi Ongkir (Rp)</label>
          <input type="number" class="input" placeholder="0" />
        </div>
        <div class="form-group">
          <label class="form-label">Uang Muka / DP (Rp)</label>
          <input type="number" class="input" placeholder="0" />
        </div>
      </div>

      <div class="card create-card">
        <div class="form-group">
          <label class="form-label">Catatan Spesifikasi Produksi</label>
          <textarea class="textarea" placeholder="Tambahkan instruksi detail ukuran/warna untuk pabrik..."></textarea>
        </div>
      </div>

      <div class="detail-actions">
        <button class="action-btn" type="button">Batal</button>
        <button class="action-btn primary-action" type="button">Simpan Uji Coba</button>
      </div>

    </section>
  `;
}