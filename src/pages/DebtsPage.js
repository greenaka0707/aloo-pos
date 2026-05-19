import { supabase } from "../supabaseClient.js";

export default function DebtsPage() {
  let debtOrdersLocal = [];
  let totalDebtAmount = 0;
  let currentTab = "belum-lunas"; // Tab default gais

  setTimeout(async () => {
    const container = document.querySelector(".debts-page");
    if (!container) return;

    // ==========================================================================
    // 💥 REPARASI HEADER NAVBAR TOP DINAMIS (GUSUR PT PRABHASKOE KELUAR GAIS)
    // ==========================================================================
    // Cari elemen teks header di navbar luar komponen pos pusat lo
    const globalHeaderTitle = document.querySelector("header h1, .nav-top-title, header div h2"); 
    const globalHeaderSub = document.querySelector("header p, .nav-top-subtitle, header div span");

    // Jika struktur layout global lo pakai class standard atau div text, kita intercept murni di sini:
    const mainAppHeader = document.querySelector("header");
    if (mainAppHeader) {
      const titleEl = mainAppHeader.querySelector("h1, h2, .title, strong");
      const subEl = mainAppHeader.querySelector("p, span, .subtitle, small");
      
      if (titleEl) titleEl.textContent = "Piutang Usaha";
      if (subEl) subEl.textContent = "PT. Ekspansi Nutrisi Nusantara";
    }

    const summaryTotalArea = container.querySelector("#summary-total-debt");
    const debtListArea = container.querySelector("#debt-list-container");
    const tabBelumLunasBtn = container.querySelector("#tab-belum-lunas");
    const tabLunasBtn = container.querySelector("#tab-lunas");

    // ==========================================================================
    // 1. PULL DATA NOTA AKTIF (BUKAN VOID)
    // ==========================================================================
    async function fetchDebtsData() {
      try {
        const { data: orders, error } = await supabase
          .from("sales_orders")
          .select(`
            id,
            invoice_no,
            order_date,
            status,
            net_amount,
            notes,
            customers ( name, phone ),
            salesmen ( name )
          `)
          .neq("status", "void") 
          .order("order_date", { ascending: false });

        if (error) throw error;

        debtOrdersLocal = orders || [];
        calculateAndRenderDOM();

      } catch (err) {
        debtListArea.innerHTML = `<p style="padding:var(--space-xl); text-align:center; color:var(--danger);">❌ Gagal muat data piutang: ${err.message}</p>`;
      }
    }

    // ==========================================================================
    // 2. LOGIKA FILTER TAB & RENDERING CARD
    // ==========================================================================
    function calculateAndRenderDOM() {
      totalDebtAmount = 0;

      // Hitung total piutang berjalan murni dari yang net_amount > 0 gais
      debtOrdersLocal.forEach(order => {
        const sisaHutang = parseFloat(order.net_amount || 0);
        if (sisaHutang > 0) {
          totalDebtAmount += sisaHutang;
        }
      });
      if (summaryTotalArea) summaryTotalArea.textContent = `Rp ${totalDebtAmount.toLocaleString('id-ID')}`;

      // Filter data berdasarkan TAB aktif
      const filteredOrders = debtOrdersLocal.filter(order => {
        const sisaHutang = parseFloat(order.net_amount || 0);
        if (currentTab === "belum-lunas") {
          return sisaHutang > 0;
        } else {
          return sisaHutang <= 0;
        }
      });

      if (filteredOrders.length === 0) {
        debtListArea.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-xl); background: var(--white); border-radius: var(--radius-md); border: 1px dashed var(--border); margin-top:10px;">
            ${currentTab === "belum-lunas" ? "🎉 Mantap gais! Semua piutang toko lunas murni aman." : "Belum ada riwayat nota yang lunas murni gais."}
          </p>
        `;
        return;
      }

      // Render list data warung ke DOM
      debtListArea.innerHTML = filteredOrders.map(order => {
        const cust = order.customers || {};
        const sales = order.salesmen || {};
        const sisaHutang = parseFloat(order.net_amount || 0);

        return `
          <div class="card" style="margin-bottom: var(--space-sm); border: 1px solid var(--border); padding: var(--space-md); background: var(--white); border-radius: var(--radius-md);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-xs); border-bottom:1px solid var(--border); padding-bottom:6px;">
              <div>
                <strong style="color:var(--text); font-size:var(--text-sm); display:block;">${cust.name || "Warung Tanpa Nama"}</strong>
                <span class="text-xs text-light">${order.invoice_no} &bull; ${order.order_date}</span>
              </div>
              <span class="badge ${sisaHutang > 0 ? 'badge-warning' : 'badge-success'}" style="text-transform:uppercase; font-size:10px;">
                ${sisaHutang > 0 ? 'Belum Lunas' : 'Lunas Murni'}
              </span>
            </div>

            <div style="font-size:12px; color:var(--text-light); line-height:1.5; margin-bottom: var(--space-sm);">
              <div style="display:flex; justify-content:space-between;"><span>Salesman:</span><strong style="color:var(--text);">${sales.name || "-"}</strong></div>
              <div style="display:flex; justify-content:space-between; margin-top:2px;"><span>Catatan Lapangan:</span><span style="color:var(--text); font-style:italic;">${order.notes || "-"}</span></div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:${sisaHutang > 0 ? 'var(--warning-soft)' : '#ECFDF5'}; padding:8px var(--space-sm); border-radius:var(--radius-sm);">
              <div>
                <span style="font-size:10px; color:${sisaHutang > 0 ? '#D97706' : '#10B981'}; display:block; font-weight:var(--font-medium);">${sisaHutang > 0 ? 'Sisa Piutang:' : 'Status Keuangan:'}</span>
                <strong style="font-size:14px; color:${sisaHutang > 0 ? '#B45309' : '#047857'};">Rp ${sisaHutang.toLocaleString('id-ID')}</strong>
              </div>
              ${sisaHutang > 0 ? `
                <button class="btn-pay-debt" data-id="${order.id}" data-invoice="${order.invoice_no}" data-amount="${sisaHutang}" style="background:var(--orange); color:white; border:none; padding:6px var(--space-md); border-radius:var(--radius-sm); font-size:12px; font-weight:bold; cursor:pointer;">
                  Bayar / Cicil
                </button>
              ` : `
                <span style="color:#10B981; font-size:12px; font-weight:bold;"><i data-lucide="check-circle" style="width:16px; height:16px; vertical-align:middle; margin-right:2px;"></i> Selesai</span>
              `}
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();

      // Pasang Listener Tombol Setor Cicilan
      debtListArea.querySelectorAll(".btn-pay-debt").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const target = e.target;
          openDebtPaymentModal(target.dataset.id, target.dataset.invoice, parseFloat(target.dataset.amount));
        });
      });
    }

    // ==========================================================================
    // 3. LOGIKA INTERAKSI TAB NAVIGATION
    // ==========================================================================
    function updateTabUI() {
      if (currentTab === "belum-lunas") {
        tabBelumLunasBtn.style.background = "var(--orange)";
        tabBelumLunasBtn.style.color = "white";
        tabBelumLunasBtn.style.border = "none";

        tabLunasBtn.style.background = "none";
        tabLunasBtn.style.color = "var(--text-light)";
        tabLunasBtn.style.border = "1px solid var(--border)";
      } else {
        tabLunasBtn.style.background = "#10B981";
        tabLunasBtn.style.color = "white";
        tabLunasBtn.style.border = "none";

        tabBelumLunasBtn.style.background = "none";
        tabBelumLunasBtn.style.color = "var(--text-light)";
        tabBelumLunasBtn.style.border = "1px solid var(--border)";
      }
      calculateAndRenderDOM();
    }

    tabBelumLunasBtn.addEventListener("click", () => { currentTab = "belum-lunas"; updateTabUI(); });
    tabLunasBtn.addEventListener("click", () => { currentTab = "lunas"; updateTabUI(); });

    // ==========================================================================
    // 4. INTERAKSI MODAL PENAGIHAN PIUTANG KASIR
    // ==========================================================================
    const modal = container.querySelector("#debt-payment-modal");
    const modalTitle = container.querySelector("#debt-modal-title");
    const modalMaxInfo = container.querySelector("#debt-modal-max-info");
    const payInput = container.querySelector("#debt-pay-amount");
    const saveBtn = container.querySelector("#btn-save-debt-payment");
    const closeBtn = container.querySelector("#btn-close-debt-modal");

    let currentSelectedOrderId = null;
    let currentMaxDebt = 0;

    function openDebtPaymentModal(orderId, invoiceNo, maxDebt) {
      currentSelectedOrderId = orderId;
      currentMaxDebt = maxDebt;

      if (modalTitle) modalTitle.textContent = `Setoran Nota ${invoiceNo}`;
      if (modalMaxInfo) modalMaxInfo.textContent = `Total Piutang Toko: Rp ${maxDebt.toLocaleString('id-ID')}`;
      if (payInput) {
        payInput.value = maxDebt; 
        payInput.max = maxDebt;
      }
      if (modal) modal.style.display = "flex";
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (modal) modal.style.display = "none";
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        const inputAmount = parseFloat(payInput.value) || 0;

        if (inputAmount <= 0 || inputAmount > currentMaxDebt) {
          alert(`⚠️ INPUT DATA INVALID!\nNominal pembayaran wajib angka positif and tidak boleh melebih sisa piutang Rp ${currentMaxDebt.toLocaleString('id-ID')} gais!`);
          return;
        }

        try {
          saveBtn.disabled = true;
          saveBtn.textContent = "Saving...";

          const isLunasMurni = (inputAmount === currentMaxDebt);
          const newNetAmount = currentMaxDebt - inputAmount;

          const { error: updateErr } = await supabase
            .from("sales_orders")
            .update({ 
              net_amount: newNetAmount,
              notes: isLunasMurni ? "LUNAS NAGIH LAPANGAN" : `Dicicil masuk Rp ${inputAmount.toLocaleString('id-ID')}`
            })
            .eq("id", currentSelectedOrderId);

          if (updateErr) throw updateErr;

          alert("🎉 Sukses mencatat setoran cicilan piutang warung harian!");
          if (modal) modal.style.display = "none";
          fetchDebtsData();

        } catch (err) {
          alert("❌ Gagal memproses cicilan piutang: " + err.message);
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = "Simpan Setoran";
        }
      });
    }

    fetchDebtsData();

  }, 50);

  return `
    <section class="debts-page" style="padding-bottom: 80px;">
      
      <div class="card" style="background: linear-gradient(135deg, #2A3B50 0%, #1A2635 100%); color: white; padding: var(--space-lg); border-radius: var(--radius-md); margin-bottom: var(--space-md); box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-top: var(--space-md);">
        <span style="font-size: var(--text-xs); color: #94A3B8; text-transform: uppercase; font-weight: var(--font-semibold); letter-spacing: 0.5px;">Total Piutang Usaha Lapangan</span>
        <h2 id="summary-total-debt" style="font-size: 26px; font-weight: var(--font-bold); margin-top: 4px; color: #F97316;">Rp 0</h2>
        <p style="font-size: 11px; color: #94A3B8; margin-top: 6px; font-style: italic;">* Akumulasi dana nota yang belum disetor lunas oleh warung/toko.</p>
      </div>

      <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-md);">
        <button id="tab-belum-lunas" style="flex:1; height:38px; font-size:12px; font-weight:bold; border-radius:var(--radius-sm); border:none; background:var(--orange); color:white; cursor:pointer; transition:all 0.2s;">
          Belum Lunas
        </button>
        <button id="tab-lunas" style="flex:1; height:38px; font-size:12px; font-weight:bold; border-radius:var(--radius-sm); border:1px solid var(--border); background:none; color:var(--text-light); cursor:pointer; transition:all 0.2s;">
          Lunas
        </button>
      </div>
      
      <div id="debt-list-container">
        <p class="text-light text-xs" style="text-align: center; padding: var(--space-md);">Memuat silsilah piutang toko...</p>
      </div>

      <div id="debt-payment-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: none; align-items: center; justify-content: center; padding: 20px;">
        <div class="card" style="width: 100%; max-width: 400px; background: var(--white); padding: var(--space-lg); border-radius: var(--radius-md); box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
          <h3 id="debt-modal-title" style="font-size: var(--text-md); font-weight: var(--font-bold); margin-bottom: 2px; color: var(--text);">Setoran Nota</h3>
          <p id="debt-modal-max-info" style="font-size: var(--text-xs); color: var(--orange); font-weight: var(--font-semibold); margin-bottom: var(--space-md);"></p>
          
          <div class="form-group" style="margin-bottom: var(--space-lg);">
            <label class="form-label">Nominal Uang Setoran Diterima (Rp)</label>
            <input type="number" pattern="[0-9]*" inputmode="numeric" id="debt-pay-amount" class="input" style="font-size: 16px; font-weight: bold; color: var(--text);" placeholder="0" />
          </div>

          <div style="display: flex; gap: var(--space-md); justify-content: flex-end;">
            <button id="btn-close-debt-modal" style="background: var(--border); border:none; padding: 0 var(--space-md); border-radius: var(--radius-sm); height:40px; font-size:13px; font-weight:var(--font-semibold); cursor:pointer;">Batal</button>
            <button id="btn-save-debt-payment" style="background: var(--orange); color: white; border:none; padding: 0 var(--space-md); border-radius: var(--radius-sm); height:40px; font-size:13px; font-weight:bold; cursor:pointer;">Simpan Setoran</button>
          </div>
        </div>
      </div>

    </section>
  `;
}
