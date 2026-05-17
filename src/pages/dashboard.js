export function DashboardPage() {
  return `
    <section class="dashboard-page">

      <!-- TOP -->

      <div class="dashboard-top">

        <div>

          <h2 class="text-3xl font-bold">
            Welcome Back
          </h2>

          <p class="text-light text-md dashboard-subtitle">
            aloo pos
          </p>

        </div>

        <button class="btn-icon">
          <i data-lucide="bell"></i>
        </button>

      </div>

      <!-- BALANCE -->

      <div class="card balance-card">

        <div class="balance-head">

          <div>

            <p class="text-light text-lg">
              Pending Order
            </p>

            <div class="balance-value">
              12
            </div>

            <p class="text-light balance-sub">
              Order menunggu produksi
            </p>

          </div>

          <div class="badge badge-primary">
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

      <div class="card quick-actions">

        <button class="action-item">

          <div class="icon-box">
            <i data-lucide="plus"></i>
          </div>

          <span>
            Order
          </span>

        </button>

        <button class="action-item">

          <div class="icon-box">
            <i data-lucide="factory"></i>
          </div>

          <span>
            Produksi
          </span>

        </button>

        <button class="action-item">

          <div class="icon-box">
            <i data-lucide="package"></i>
          </div>

          <span>
            Stok
          </span>

        </button>

        <button class="action-item">

          <div class="icon-box">
            <i data-lucide="truck"></i>
          </div>

          <span>
            Kirim
          </span>

        </button>

      </div>

      <!-- ACTIVITY -->

      <div class="section-title">

        <h3 class="text-2xl font-bold">
          Aktivitas
        </h3>

        <button class="btn btn-soft see-all-btn">
          Lihat Semua
        </button>

      </div>

      <div class="activity-list">

        <div class="card activity-card">

          <div class="activity-left">

            <div class="icon-box">
              <i data-lucide="factory"></i>
            </div>

            <div>

              <h4 class="font-bold text-xl">
                Kopi Giras 1:1
              </h4>

              <p class="text-light">
                Diproses • 50kg
              </p>

            </div>

          </div>

          <div class="activity-right">

            <strong>
              SO-001
            </strong>

            <span class="badge badge-info">
              Diproses
            </span>

          </div>

        </div>

        <div class="card activity-card">

          <div class="activity-left">

            <div class="icon-box">
              <i data-lucide="truck"></i>
            </div>

            <div>

              <h4 class="font-bold text-xl">
                RB Robusta Grade A
              </h4>

              <p class="text-light">
                Ready Kirim • 20kg
              </p>

            </div>

          </div>

          <div class="activity-right">

            <strong>
              SO-002
            </strong>

            <span class="badge badge-success">
              Ready
            </span>

          </div>

        </div>

      </div>

    </section>
  `;
}