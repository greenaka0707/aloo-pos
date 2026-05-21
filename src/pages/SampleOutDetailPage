import { supabase } from "../supabaseClient.js";

export function SampleOutDetailPage() {

  setTimeout(async () => {

    const container =
      document.querySelector(".sample-detail-page");

    if (!container) return;

    const sampleId =
      Number(
        localStorage.getItem(
          "selected_sample_out_id"
        )
      );

    if (!sampleId || isNaN(sampleId)) {

      container.innerHTML = `
        <div class="empty-state">
          <p>ID sample tidak ditemukan.</p>
        </div>
      `;

      return;
    }

    try {

      container.innerHTML = `
        <div
          style="
            padding:40px 20px;
            text-align:center;
            color:var(--text-light);
          "
        >
          Memuat detail sample...
        </div>
      `;

      // ======================================================
      // HEADER
      // ======================================================

      const {
        data: sample,
        error: sampleError
      } = await supabase
        .from("sample_outflows")
        .select(`
          *
        `)
        .eq("id", sampleId)
        .single();

      if (sampleError) throw sampleError;

      // ======================================================
      // ITEMS
      // ======================================================

      const {
        data: items,
        error: itemError
      } = await supabase
        .from("sample_outflow_items")
        .select(`
          id,
          qty,
          unit,
          products (
            id,
            name
          )
        `)
        .eq("sample_outflow_id", sampleId);

      if (itemError) throw itemError;

      // ======================================================
      // DATE FORMAT
      // ======================================================

      let formattedDate = "-";

      if (sample.date) {

        const d = new Date(sample.date);

        const months = [
          "Jan","Feb","Mar","Apr",
          "Mei","Jun","Jul","Agu",
          "Sep","Okt","Nov","Des"
        ];

        formattedDate =
          `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }

      const status =
        sample.status?.toLowerCase() || "released";

      // ======================================================
      // PRODUCT HTML
      // ======================================================

      const productHtml =
        !items || items.length === 0
          ? `
            <div
              class="card"
              style="
                padding:16px;
                text-align:center;
                color:var(--text-light);
              "
            >
              Tidak ada item sample.
            </div>
          `
          : items.map(item => {

              return `
                <div
                  class="compact-product-card"
                >

                  <div class="product-info-left">

                    <strong
                      style="
                        font-size:14px;
                        color:var(--text);
                      "
                    >
                      ${item.products?.name || "-"}
                    </strong>

                    <div class="product-meta-row">

                      <span
                        class="text-sm text-light"
                      >
                        ${Number(item.qty || 0)}
                        ${item.unit || ""}
                      </span>

                    </div>

                  </div>

                </div>
              `;

            }).join("");

      // ======================================================
      // RENDER
      // ======================================================

      container.innerHTML = `
        <section class="detail-page">

          <!-- STATUS CARD -->
          <div
            class="card"
            style="
              padding:16px;
              display:flex;
              flex-direction:column;
              gap:12px;
            "
          >

            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
              "
            >

              <div>

                <h2
                  style="
                    margin:0;
                    font-size:18px;
                    font-weight:700;
                  "
                >
                  ${sample.reference_no || "-"}
                </h2>

                <p
                  class="text-sm text-light"
                  style="
                    margin-top:4px;
                  "
                >
                  ${formattedDate}
                </p>

              </div>

              <span
                class="modern-status ${status}"
              >
                ${sample.status || "Released"}
              </span>

            </div>

            <div>

              <p
                class="text-xs text-light"
                style="
                  margin-bottom:4px;
                "
              >
                Total Nilai Sample
              </p>

              <h1
                style="
                  margin:0;
                  font-size:24px;
                  font-weight:700;
                "
              >
                Rp ${Number(
                  sample.total_amount || 0
                ).toLocaleString("id-ID")}
              </h1>

            </div>

          </div>

          <!-- INFO -->
          <div
            class="card"
            style="
              padding:16px;
              display:flex;
              flex-direction:column;
              gap:14px;
            "
          >

            ${infoRow(
              "Customer",
              sample.customer_name
            )}

            ${infoRow(
              "Requester",
              sample.requester
            )}

            ${infoRow(
              "Divisi",
              sample.division
            )}

            ${infoRow(
              "Tujuan",
              sample.purpose
            )}

            ${infoRow(
              "Catatan",
              sample.notes
            )}

          </div>

          <!-- PRODUCT -->
          <div
            style="
              display:flex;
              flex-direction:column;
              gap:10px;
            "
          >

            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
              "
            >

              <h3
                style="
                  margin:0;
                  font-size:15px;
                  font-weight:700;
                "
              >
                Barang Sample
              </h3>

              <span
                class="text-xs text-light"
              >
                ${items?.length || 0} item
              </span>

            </div>

            ${productHtml}

          </div>

          <!-- ACTION -->
          <div
            style="
              display:flex;
              gap:10px;
              margin-top:4px;
            "
          >

            <button
              class="btn btn-secondary"
              style="flex:1;"
            >
              Edit
            </button>

            <button
              class="btn"
              style="
                flex:1;
                background:#FEE2E2;
                color:#DC2626;
              "
            >
              Void
            </button>

          </div>

        </section>
      `;

      if (window.lucide) {
        window.lucide.createIcons();
      }

    } catch (err) {

      container.innerHTML = `
        <div
          style="
            padding:40px 20px;
            text-align:center;
            color:var(--danger);
          "
        >
          ❌ ${err.message}
        </div>
      `;
    }

  }, 50);

  return `
    <section
      class="sample-detail-page"
      style="
        display:flex;
        flex-direction:column;
        gap:14px;
        padding-bottom:120px;
      "
    ></section>
  `;
}

function infoRow(label, value) {

  return `
    <div
      style="
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:16px;
      "
    >

      <span
        class="text-sm text-light"
      >
        ${label}
      </span>

      <strong
        style="
          text-align:right;
          font-size:14px;
          color:var(--text);
          max-width:60%;
        "
      >
        ${value || "-"}
      </strong>

    </div>
  `;
}
