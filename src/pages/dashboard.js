export function DashboardPage() {
  return `
    <section class="dashboard-page">

      <!-- TOP -->

      <div class="dashboard-top">
        <h2>
          Welcome Back
        </h2>

        <div>
          🔔
        </div>
      </div>

      <!-- BALANCE -->

      <div class="balance-card">

        <p class="balance-label">
          Pending Order
        </p>

        <div class="balance-value">
          12
        </div>

        <p class="balance-sub">
          Order menunggu produksi
        </p>

      </div>

      <!-- QUICK ACTION -->

      <div class="quick-actions">

        <div class="action-item">
          <div class="action-icon">
            +
          </div>

          <span>Order</span>
        </div>

        <div class="action-item">
          <div class="action-icon">
            ⚙️
          </div>

          <span>Produksi</span>
        </div>

        <div class="action-item">
          <div class="action-icon">
            📦
          </div>

          <span>Stok</span>
        </div>

        <div class="action-item">
          <div class="action-icon">
            🚚
          </div>

          <span>Kirim</span>
        </div>

      </div>

      <!-- ACTIVITY -->

      <div class="section-title">
        <h3>
          Aktivitas
        </h3>

        <span>
          Lihat Semua
        </span>
      </div>

      <div class="activity-list">

        <div class="activity-card">

          <div class="activity-left">
            <h4>
              Kopi Giras 1:1
            </h4>

            <p>
              Diproses • 50kg
            </p>
          </div>

          <div class="activity-right">
            <strong>
              SO-001
            </strong>
          </div>

        </div>

        <div class="activity-card">

          <div class="activity-left">
            <h4>
              RB Robusta Grade A
            </h4>

            <p>
              Ready Kirim • 20kg
            </p>
          </div>

          <div class="activity-right">
            <strong>
              SO-002
            </strong>
          </div>

        </div>

      </div>

    </section>
  `;
}