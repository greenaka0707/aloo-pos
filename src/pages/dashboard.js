export function DashboardPage() {
  return `
    <section class="dashboard-page">

      <!-- HEADER -->

      <div class="dashboard-header">
        <h1>
          ENNA POS
        </h1>

        <p>
          Mobile Manufacturing POS
        </p>
      </div>

      <!-- SUMMARY -->

      <div class="summary-scroll">

        <div class="summary-card">
          <h3>Pending Order</h3>
          <strong>12</strong>
        </div>

        <div class="summary-card">
          <h3>Produksi</h3>
          <strong>5</strong>
        </div>

        <div class="summary-card">
          <h3>Ready Kirim</h3>
          <strong>3</strong>
        </div>

      </div>

      <!-- QUICK ACTION -->

      <div class="quick-grid">

        <button class="quick-card">
          <h4>Order Baru</h4>
        </button>

        <button class="quick-card">
          <h4>Produksi</h4>
        </button>

        <button class="quick-card">
          <h4>Inventory</h4>
        </button>

        <button class="quick-card">
          <h4>Pengiriman</h4>
        </button>

      </div>

    </section>
  `;
}