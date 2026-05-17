export function DashboardPage() {
  return `
    <section class="dashboard-page">

      <!-- TOP -->

      <div class="dashboard-top">

        <div>
          <h2>
            Welcome Back
          </h2>

          <p class="dashboard-subtitle">
            aloo pos
          </p>
        </div>

        <button class="top-icon">
          <i data-lucide="bell"></i>
        </button>

      </div>

      <!-- BALANCE -->

      <div class="balance-card">

        <div class="balance-head">

          <div>
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

          <div class="balance-badge">
            +3
          </div>

        </div>

        <div class="balance-stats">

          <div class="mini-stat">
            <strong>5</strong>
            <span>Diproses</span>
          </div>

          <div class="mini-stat">
            <strong>3</strong>
            <span>Ready</span>
          </div>

          <div class="mini-stat">
            <strong>2</strong>
            <span>Kirim</span>
          </div>

        </div>

      </div>

      <!-- QUICK ACTION -->

      <div class="quick-actions">

        <button class="action-item">

          <div class="action-icon">
            <i data-lucide="plus"></i>
          </div>

          <span>
            Order
          </span>

        </button>

        <button class="action-item">

          <div class="action-icon">
            <i data-lucide="factory"></i>
          </div>

          <span>
            Produksi
          </span>

        </button>

        <button class="action-item">

          <div class="action-icon">
            <i data-lucide="package"></i>
          </div>

          <span>
            Stok
          </span>

        </button>

        <button class="action-item">

          <div class="action-icon">
            <i data-lucide="truck"></i>
          </div>

          <span>
            Kirim
          </span>

        </button>

      </div>

      <!-- ACTIVITY -->

      <div class="section-title">

        <h3>
          Aktivitas
        </h3>

        <button class="see-all-btn">
          Lihat Semua
        </button>

      </div>

      <div class="activity-list">

        <div class="activity-card">

          <div class="activity-left">

            <div class="activity-icon">
              <i data-lucide="factory"></i>
            </div>

            <div>

              <h4>
                Kopi Giras 1:1
              </h4>

              <p>
                Diproses • 50kg
              </p>

            </div>

          </div>

          <div class="activity-right">

            <strong>
              SO-001
            </strong>

            <span class="status processing">
              Diproses
            </span>

          </div>

        </div>

        <div class="activity-card">

          <div class="activity-left">

            <div class="activity-icon">
              <i data-lucide="truck"></i>
            </div>

            <div>

              <h4>
                RB Robusta Grade A
              </h4>

              <p>
                Ready Kirim • 20kg
              </p>

            </div>

          </div>

          <div class="activity-right">

            <strong>
              SO-002
            </strong>

            <span class="status ready">
              Ready
            </span>

          </div>

        </div>

      </div>

    </section>
  `;
}