export function CreateOrderPage() {
  return `
    <section class="create-order-page">

      <!-- HEADER -->

      <div class="create-header">

        <button
          class="btn-icon"
          onclick="window.navigate('order')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div>

          <h2 class="text-3xl font-bold">
            Create Order
          </h2>

          <p class="text-light text-md">
            Manufacturing sales order
          </p>

        </div>

      </div>

      <!-- CUSTOMER -->

      <div class="card create-card">

        <div class="section-head">

          <div class="icon-box">
            <i data-lucide="user"></i>
          </div>

          <div>

            <h3 class="text-xl font-bold">
              Customer
            </h3>

            <p class="text-light text-sm">
              Informasi customer
            </p>

          </div>

        </div>

        <div class="form-group">

          <label class="form-label">
            Nama Customer
          </label>

          <input
            class="input"
            type="text"
            placeholder="Masukkan customer"
          />

        </div>

        <div class="form-group">

          <label class="form-label">
            Nomor Telepon
          </label>

          <input
            class="input"
            type="text"
            placeholder="08xxxxxxxxxx"
          />

        </div>

      </div>

      <!-- PRODUCT -->

      <div class="card create-card">

        <div class="section-head">

          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>

          <div>

            <h3 class="text-xl font-bold">
              Produk
            </h3>

            <p class="text-light text-sm">
              Pilih produk penjualan
            </p>

          </div>

        </div>

        <div class="form-group">

          <label class="form-label">
            Produk
          </label>

          <select class="input">

            <option>
              Pilih Produk
            </option>

            <option>
              Kopi Giras 1:1
            </option>

            <option>
              RB Robusta Grade A
            </option>

            <option>
              Arabika Flores
            </option>

          </select>

        </div>

        <div class="qty-grid">

          <div class="form-group">

            <label class="form-label">
              Qty
            </label>

            <input
              class="input"
              type="number"
              placeholder="0"
            />

          </div>

          <div class="form-group">

            <label class="form-label">
              Unit
            </label>

            <select class="input">

              <option>
                KG
              </option>

            </select>

          </div>

        </div>

      </div>

      <!-- STATUS PREVIEW -->

      <div class="card create-card">

        <div class="preview-head">

          <div>

            <h3 class="text-xl font-bold">
              Status Produksi
            </h3>

            <p class="text-light text-sm">
              Analisa otomatis system
            </p>

          </div>

          <span class="badge badge-warning">
            Perlu Produksi
          </span>

        </div>

        <div class="preview-alert">

          <i data-lucide="factory"></i>

          <p>
            Produk membutuhkan proses manufacturing
          </p>

        </div>

      </div>

      <!-- BOM -->

      <div class="card create-card">

        <div class="section-head">

          <div class="icon-box">
            <i data-lucide="flask-conical"></i>
          </div>

          <div>

            <h3 class="text-xl font-bold">
              Kebutuhan Produksi
            </h3>

            <p class="text-light text-sm">
              Auto generate BOM
            </p>

          </div>

        </div>

        <div class="bom-list">

          <div class="bom-item">

            <div>

              <strong class="text-lg font-bold">
                RB Robusta Grade A
              </strong>

              <p class="text-light text-sm">
                Bahan utama
              </p>

            </div>

            <span class="badge badge-primary">
              25kg
            </span>

          </div>

          <div class="bom-item">

            <div>

              <strong class="text-lg font-bold">
                Jagung
              </strong>

              <p class="text-light text-sm">
                Campuran
              </p>

            </div>

            <span class="badge badge-primary">
              25kg
            </span>

          </div>

        </div>

      </div>

      <!-- SUMMARY -->

      <div class="card create-card">

        <div class="summary-row">

          <span class="text-light">
            Total Qty
          </span>

          <strong class="text-lg font-bold">
            50kg
          </strong>

        </div>

        <div class="summary-row">

          <span class="text-light">
            Estimasi Produksi
          </span>

          <strong class="text-lg font-bold">
            2 Jam
          </strong>

        </div>

      </div>

      <!-- ACTION -->

      <div class="create-actions">

        <button class="btn btn-secondary action-btn">
          Draft
        </button>

        <button class="btn btn-primary action-btn primary-action">
          Generate Order
        </button>

      </div>

    </section>
  `;
}