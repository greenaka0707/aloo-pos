export function CreatePurchasePage() {
  return `
    <section class="create-order-page">

      <!-- HEADER -->

      <div class="create-header">

        <button
          class="btn-icon"
          onclick="window.navigate('pembelian')"
        >
          <i data-lucide="arrow-left"></i>
        </button>

        <div>

          <h2 class="text-2xl font-bold">
            Create Purchase
          </h2>

          <p class="text-light text-sm">
            Supplier purchasing workflow
          </p>

        </div>

      </div>

      <!-- PURCHASE INFO -->

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
            Supplier
          </label>

          <input
            type="text"
            class="input"
            placeholder="Cari supplier..."
          />

        </div>

      </div>

      <!-- PRODUCT SEARCH -->

      <div class="card create-card">

        <div class="section-head">

          <div>

            <h3 class="text-lg font-bold">
              Produk
            </h3>

            <p class="text-light text-sm">
              Tambahkan item pembelian
            </p>

          </div>

          <button class="btn btn-soft add-item-btn">

            <i data-lucide="plus"></i>

            Tambah

          </button>

        </div>

        <div class="form-group">

          <input
            type="text"
            class="input"
            placeholder="Cari bahan baku..."
          />

        </div>

      </div>

      <!-- PRODUCT ITEM -->

      <div class="card create-card">

        <div class="product-item-head">

          <strong class="product-name">
            RB Robusta Grade A
          </strong>

          <button class="delete-item-btn">
            Hapus
          </button>

        </div>

        <div class="product-fields">

          <div class="form-group">

            <label class="form-label">
              Qty
            </label>

            <input
              type="text"
              inputmode="numeric"
              class="input"
              value="100"
            />

          </div>

          <div class="form-group">

            <label class="form-label">
              Harga Beli
            </label>

            <input
              type="text"
              inputmode="numeric"
              class="input"
              value="45000"
            />

          </div>

        </div>

        <div class="product-subtotal">

          <span>
            Subtotal
          </span>

          <strong>
            Rp 4.500.000
          </strong>

        </div>

      </div>

      <!-- SUMMARY -->

      <div class="card create-card">

        <div class="summary-row">

          <span class="text-light text-sm">
            Subtotal
          </span>

          <strong class="font-bold">
            Rp 4.500.000
          </strong>

        </div>

        <div class="summary-row">

          <span class="text-light text-sm">
            Ongkir
          </span>

          <strong class="font-bold">
            Rp 0
          </strong>

        </div>

        <div class="summary-row total-row">

          <span class="font-semibold">
            Total
          </span>

          <strong class="text-lg font-bold">
            Rp 4.500.000
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
            type="text"
            inputmode="numeric"
            class="input"
            placeholder="0"
          />

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
            placeholder="Tambahkan catatan pembelian..."
          ></textarea>

        </div>

      </div>

      <!-- ACTION -->

      <div class="create-actions">

        <button class="btn btn-secondary action-btn">
          Draft
        </button>

        <button class="btn btn-primary action-btn primary-action">
          Simpan
        </button>

      </div>

    </section>
  `;
}