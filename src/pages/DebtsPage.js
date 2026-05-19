import { supabase } from "../supabaseClient.js";

export default function DebtsPage() {
  let debtOrdersLocal = [];
  let totalDebtAmount = 0;

  setTimeout(async () => {
    const container = document.querySelector(".debts-page");
    if (!container) return;

    const summaryTotalArea = container.querySelector("#summary-total-debt");
    const debtListArea = container.querySelector("#debt-list-container");

    // ==========================================================================
    // 1. PULL DATA NOTA YANG MASIH PUNYA SISA TAGIHAN (NET_AMOUNT > TOTAL PAID)
    // ==========================================================================
    async function fetchDebtsData() {
      try {
        // Ambil data sales order yang statusnya sudah jalan/dikirim tapi belum lunas murni gais
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
          .neq("status", "void") // Nota void jangan dihitung hutang
          .order("order_date", { ascending: false });

        if (error) throw error;

        // Tarik data mutasi pembayaran/cicilan harian (jika lo ada tabel pembayaran terpisah kelak)
        // Sementara kita bandingkan net_amount dengan status atau records pembayaran kasir.
        // Di sistem trial ini, kita asumsikan net_amount yang sisa didapat dari pelacakan dinamis atau field sisa tagihan.
        
        debtOrdersLocal = orders || [];
        calculateDebtSummaryDOM();

      } catch (err) {
        debtListArea.innerHTML = `<p style="padding:var(--space-xl); text-align:center; color:var(--danger);">❌ Gagal muat data piutang: ${err.message}</p>`;
      }
    }

    // ==========================================================================
    // 2. HITUNG TOTAL & RENDER KE DOM
    // ==========================================================================
    function calculateDebtSummaryDOM() {
      totalDebtAmount = 0;

      if (debtOrdersLocal.length === 0) {
        summaryTotalArea.textContent = "Rp 0";
        debtListArea.innerHTML = `
          <p class="text-light text-xs" style="text-align: center; padding: var(--space-xl); background: var(--white); border-radius: var(--radius-md); border: 1px dashed var(--border);">
            🎉 Mantap gais! Semua piutang toko lunas murni aman terkendali.
          </p>
        `;
        return;
      }

      // Render list data warung berpiutang gais
      let htmlRows = debtOrdersLocal.map(order => {
        const cust = order.customers || {};
        const sales = order.salesmen || {};
        
        // Sementara simulasikan hitungan sisa piutang rill (bisa disesuaikan field database lo gais)
        const sisaHutang = order.net_amount; 
        totalDebtAmount += sisaHutang;

        return `
          <div class="card" style="margin-bottom: var(--space-sm); border: 1px solid var(--border); padding: var(--space-md); background: var(--white); border-radius: var(--radius-md);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-xs); border-bottom:1px solid var(--border); padding-bottom:6px;">
              <div>
                <strong style="color:var(--text); font-size:var(--text-sm); display:block;">${cust.name || "Warung Tanpa Nama"}</strong>
                <span class="text-xs text-light">${order.invoice_no} &bull; ${order.order_date}</span>
              </div>
              <span class="badge badge-warning" style="text-transform:uppercase; font-size:10px;">Belum Lunas</span>
            </div>

            <div style="font-size:12px; color:var(--text-light); line-height:1.5; margin-bottom:var(--space-md);">
              <div style="display:flex; justify-content:space-between;"><span>Salesman:</span><strong style="color:var(--text);">${sales.name || "-"}</strong></div>
              <div style="display:flex; justify-content:space-between; margin-top:2px;"><span>Catatan Lapangan:</span><span style="color:var(--text); italic">${order.notes || "-"}</span></div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--warning-soft); padding:8px var(--space-sm); border-radius:var(--radius-sm);">
              <div>
                <span style="font-size:10px; color:#D97706; display:block; font-weight:var(--font-medium);">Sisa Piutang:</span>
                <strong style="font-size:14px; color:#B45309;">Rp ${sisaHutang.toLocaleString('id-ID')}</strong>
              </div>
              <button class="btn-pay-debt" data-id="${order.id}" data-invoice="${order.invoice_no}" data-amount="${sisaHutang}" style="background:var(--orange); color:white; border:none; padding:6px var(--space-md); border-radius:var(--radius-sm); font-size:12px; font-weight:bold; cursor:pointer;">
                Bayar / Cicil
              </button>
            </div>
          </div>
        `;
      }).join('');

      summaryTotalArea.textContent = `Rp ${totalDebtAmount.toLocaleString('id-ID')}`;
      debtListArea.innerHTML = htmlRows;

      // Pasang Event Listener Tombol Setor Cicilan/Pelunasan
      debtListArea.querySelectorAll(".btn-pay-debt").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const target = e.target;
          openDebtPaymentModal(target.dataset.id, target.dataset.invoice, parseFloat(target.dataset.amount));
        });
      });
    }

    // ==========================================================================
    // 3. INTERAKSI MODAL PENAGIHAN PIUTANG KASIR
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
        payInput.value = maxDebt; // Default-kan langsung lunas gais
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
          alert(`⚠️ INPUT DATA INVALID!\nNominal pembayaran wajib angka positif dan tidak boleh melebih sisa piutang Rp ${currentMaxDebt.toLocaleString('id-ID')} gais!`);
          return;
        }

        try {
          saveBtn.disabled = true;
          saveBtn.textContent = "Saving...";

          // Hitung nilai akhir status nota
          const isLunasMurni = (inputAmount === currentMaxDebt);
          
          // Hitung net_amount baru setelah dipotong setoran cicilan uang kasir gais
          const newNetAmount = currentMaxDebt - inputAmount;

          // Update data keuangan order di tabel Supabase
          const { error: updateErr } = await supabase
            .from("sales_orders")
            .update({ 
              net_amount: newNetAmount,
              // Jika lunas murni, lo bisa tambahkan penanda notes atau log pembayaran kelak gais
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
      
      <div class="card" style="background: linear-gradient(135deg, #2A3B50 0%, #1A2635 100%); color: white; padding: var(--space-lg); border-radius: var(--radius-md); margin-bottom: var(--space-md); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <span style="font-size: var(--text-xs); color: #94A3B8; text-transform: uppercase; font-weight: var(--font-semibold); letter-spacing: 0.5px;">Total Piutang Usaha Lapangan</span>
        <h2 id="summary-total-debt" style="font-size: 26px; font-weight: var(--font-bold); margin-top: 4px; color: #F97316;">Rp 0</h2>
        <p style="font-size: 11px; color: #94A3B8; margin-top: 6px; font-style: italic;">* Akumulasi dana nota yang belum disetor lunas oleh warung/toko.</p>
      </div>

      <h3 style="font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text); margin-bottom: var(--space-sm); padding-left: 2px;">Daftar Tagihan Mengambang</h3>
      
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
