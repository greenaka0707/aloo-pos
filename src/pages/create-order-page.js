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

          <h2 class="text-xl font-bold">
            Create Order
          </h2>

          <p class="text-light text-sm">
            Sales order manufacturing
          </p>

        </div>

      </div>

      <!-- ORDER INFO -->

      <div class="card create-card">

        <div class="form-group">

          <label class="form-label">
            Tanggal
          </label>

          <input
            type="date"
            class="input"
          />

        </div>

        <div class="form-group">

          <label class="form-label">
            Customer
          </label>

          <input
            type="text"
            class="input"
            placeholder="Cari customer..."
          />

        </div>

      </div>

      <!-- PRODUCT -->

      <div class="card create-card">

        <div class="section-head">

          <div>

            <h3 class="text-base font-bold">
              Produk
            </h3>

            <p class="text-light text-sm">
              Tambahkan item penjualan
            </p>

          </div>

          <button class="btn btn-soft add-item-btn">

            <i data-lucide="plus"></i>

            <span>Tambah</span>

          </button>

        </div>

        <!-- ITEM -->

        <div class="product-item-card">

          <div class="product-top">

            <div class="product-info">

              <input
                type="text"
                class="input"
                placeholder="Cari produk..."
                value="Kopi Giras 1:1"
              />

              <p class="text-light text-sm">
                Manufacturing Product
              </p>

            </div>

            <button class="delete-btn">
              Hapus
            </button>

          </div>

          <div class="product-inline">

            <div class="form-group">

              <label class="form-label">
                Qty
              </label>

              <input
                type="number"
                class="input"
                placeholder="0"
              />

            </div>

            <div class="form-group">

              <label class="form-label">
                Harga
              </label>

              <input
                type="number"
                class="input"
                value="25000"
              />

            </div>

          </div>

          <div class="product-subtotal">

            <span class="text-light text-sm">
              Subtotal
            </span>

            <strong class="text-base font-bold">
              Rp 1.250.000
            </strong>

          </div>

        </div>

      </div>

      <!-- PRODUCTION -->

      <div class="card create-card production-card">

        <div class="production-head">

          <div>

            <h3 class="text-base font-bold">
              Produksi Dibutuhkan
            </h3>

            <p class="text-light text-sm">
              Auto manufacturing analysis
            </p>

          </div>

          <span class="badge badge-warning">
            Diproses
          </span>

        </div>

        <div class="production-alert">

          <i data-lucide="factory"></i>

          <p>
            Stock produk tidak mencukupi dan perlu produksi
          </p>

        </div>

        <div class="bom-list">

          <div class="bom-item">

            <span class="text-sm">
              RB Robusta Grade A
            </span>

            <strong class="text-sm font-bold">
              25kg
            </strong>

          </div>

          <div class="bom-item">

            <span class="text-sm">
              Jagung
            </span>

            <strong class="text-sm font-bold">
              25kg
            </strong>

          </div>

        </div>

      </div>

      <!-- SUMMARY -->

      <div class="card create-card">

        <div class="summary-row">

          <span class="text-light text-sm">
            Subtotal
          </span>

          <strong class="text-base font-bold">
            Rp 1.250.000
          </strong>

        </div>

        <div class="summary-row">

          <span class="text-light text-sm">
            Diskon
          </span>

          <strong class="text-base font-bold">
            Rp 0
          </strong>

        </div>

        <div class="summary-row total-row">

          <span class="font-semibold">
            Grand Total
          </span>

          <strong class="text-lg font-bold">
            Rp 1.250.000
          </strong>

        </div>

      </div>

      <!-- PAYMENT -->

      <div class="card create-card">

        <div class="form-group">

          <label class="form-label">
            Bayar
          </label>

          <input
            type="number"
            class="input"
            placeholder="0"
          />

        </div>

        <div class="summary-row payment-row">

          <span class="text-light text-sm">
            Sisa
          </span>

          <strong class="text-base font-bold">
            Rp 1.250.000
          </strong>

        </div>

      </div>

      <!-- NOTE -->

      <div class="card create-card">

        <div class="form-group">

          <label class="form-label">
            Catatan
          </label>

          <textarea
            class="textarea"
            placeholder="Tambahkan catatan..."
          ></textarea>

        </div>

      </div>

      <!-- ACTION -->

      <div class="create-actions">

        <button class="btn btn-secondary action-btn">
          Draft
        </button>

        <button class="btn btn-primary action-btn primary-action">
          Submit
        </button>

      </div>

    </section>
  `;
}