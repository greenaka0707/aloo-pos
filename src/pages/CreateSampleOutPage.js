import { supabase } from "../supabaseClient.js";

export default function CreateSampleOutPage() {

  let cart = [];
  let isSubmitting = false;

  const today =
    new Date().toISOString().split("T")[0];

  setTimeout(async () => {

    const container =
      document.querySelector(".create-sample-page");

    if (!container) return;

    // ======================================================
    // ELEMENTS
    // ======================================================

    const dateInput =
      container.querySelector("#sample-date");

    const receiverInput =
      container.querySelector("#sample-receiver");

    const requesterInput =
      container.querySelector("#sample-requester");

    const divisionInput =
      container.querySelector("#sample-division");

    const purposeInput =
      container.querySelector("#sample-purpose");

    const notesInput =
      container.querySelector("#sample-notes");

    const productInput =
      container.querySelector("#product-search");

    const productFloat =
      container.querySelector("#product-floating-list");

    const cartContainer =
      container.querySelector("#cart-items-container");

    const totalText =
      container.querySelector("#summary-total");

    const totalQtyText =
      container.querySelector("#summary-total-qty");

    const submitBtn =
      container.querySelector(".primary-action");

    // ======================================================
    // INIT DATE
    // ======================================================

    if (dateInput) {
      dateInput.value = today;
    }

    // ======================================================
    // PRODUCT SEARCH
    // ======================================================

    if (productInput && productFloat) {

      productInput.addEventListener(
        "input",
        async (e) => {

          const val =
            e.target.value.trim();

          if (val.length < 1) {

            productFloat.style.display = "none";
            return;
          }

          const {
            data: products,
            error
          } = await supabase
            .from("products")
            .select(`
              id,
              name,
              stock,
              unit,
              cost_price
            `)
            .ilike("name", `%${val}%`)
            .limit(8);

          if (!error && products) {

            productFloat.innerHTML =
              products.map(p => `

                <div
                  class="product-row-item"
                  data-id="${p.id}"
                  data-name="${p.name}"
                  data-unit="${p.unit || "pcs"}"
                  data-price="${p.cost_price || 0}"
                  style="
                    padding:12px;
                    border-bottom:1px solid var(--border);
                    cursor:pointer;
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:12px;
                  "
                >

                  <div>

                    <strong
                      style="
                        font-size:14px;
                        color:var(--text);
                        display:block;
                      "
                    >
                      ${p.name}
                    </strong>

                    <span
                      class="text-xs text-light"
                    >
                      Stok:
                      ${p.stock || 0}
                      ${p.unit || "pcs"}
                    </span>

                  </div>

                  <span class="badge badge-primary">
                    ${p.unit || "pcs"}
                  </span>

                </div>

              `).join("");

            productFloat.style.display =
              "block";

            productFloat
              .querySelectorAll(".product-row-item")
              .forEach(row => {

                row.addEventListener(
                  "click",
                  (evt) => {

                    const target =
                      evt.currentTarget;

                    const pId =
                      parseInt(
                        target.dataset.id
                      );

                    if (
                      cart.some(
                        item => item.id === pId
                      )
                    ) {

                      productInput.value = "";
                      productFloat.style.display =
                        "none";

                      return;
                    }

                    cart.push({

                      id: pId,

                      name:
                        target.dataset.name,

                      unit:
                        target.dataset.unit,

                      qty: "",

                      price:
                        parseFloat(
                          target.dataset.price
                        ) || 0

                    });

                    renderCart();

                    productInput.value = "";

                    productFloat.style.display =
                      "none";

                  }
                );

              });

          }

        }
      );

      document.addEventListener(
        "click",
        (e) => {

          if (
            !productInput.contains(e.target) &&
            !productFloat.contains(e.target)
          ) {

            productFloat.style.display =
              "none";
          }

        }
      );

    }

    // ======================================================
    // RENDER CART
    // ======================================================

    function renderCart() {

      if (!cart.length) {

        cartContainer.innerHTML = `

          <div
            class="card"
            style="
              padding:16px;
              text-align:center;
              color:var(--text-light);
            "
          >
            Belum ada item sample.
          </div>

        `;

        calculateTotals();

        return;
      }

      cartContainer.innerHTML =
        cart.map((item, idx) => `

          <div
            class="card"
            style="
              padding:14px;
              margin-bottom:10px;
            "
          >

            <div
              style="
                display:flex;
                align-items:flex-start;
                justify-content:space-between;
                gap:12px;
                margin-bottom:12px;
              "
            >

              <div>

                <strong
                  style="
                    font-size:14px;
                    color:var(--text);
                  "
                >
                  ${item.name}
                </strong>

              </div>

              <button
                class="btn-remove-item"
                data-idx="${idx}"
                style="
                  border:none;
                  background:none;
                  color:var(--danger);
                  cursor:pointer;
                  font-size:12px;
                  font-weight:600;
                "
              >
                Hapus
              </button>

            </div>

            <div
              style="
                display:grid;
                grid-template-columns:1fr 90px;
                gap:10px;
              "
            >

              <input
                type="number"
                inputmode="decimal"
                class="input item-qty"
                data-idx="${idx}"
                placeholder="Qty"
                value="${item.qty}"
              />

              <input
                type="text"
                class="input"
                readonly
                value="${item.unit}"
              />

            </div>

            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                margin-top:10px;
                padding-top:10px;
                border-top:1px dashed var(--border);
              "
            >

              <span
                class="text-xs text-light"
              >
                Nilai Sample
              </span>

              <strong
                class="item-total"
                style="
                  font-size:14px;
                  color:var(--text);
                "
              >
                Rp ${(
                  (parseFloat(item.qty) || 0)
                  *
                  (parseFloat(item.price) || 0)
                ).toLocaleString("id-ID")}
              </strong>

            </div>

          </div>

        `).join("");

      // ====================================================
      // EVENTS
      // ====================================================

      cartContainer
        .querySelectorAll(".item-qty")
        .forEach(input => {

          input.addEventListener(
            "input",
            (e) => {

              const idx =
                parseInt(
                  e.target.dataset.idx
                );

              cart[idx].qty =
                e.target.value;

              renderCart();

            }
          );

        });

      cartContainer
        .querySelectorAll(".btn-remove-item")
        .forEach(btn => {

          btn.addEventListener(
            "click",
            (e) => {

              const idx =
                parseInt(
                  e.target.dataset.idx
                );

              cart.splice(idx, 1);

              renderCart();

            }
          );

        });

      calculateTotals();

    }

    // ======================================================
    // CALCULATE TOTAL
    // ======================================================

    function calculateTotals() {

      const totalQty =
        cart.reduce(
          (acc, item) =>
            acc +
            (parseFloat(item.qty) || 0),
          0
        );

      const totalAmount =
        cart.reduce(
          (acc, item) =>
            acc +
            (
              (parseFloat(item.qty) || 0)
              *
              (parseFloat(item.price) || 0)
            ),
          0
        );

      if (totalQtyText) {

        totalQtyText.textContent =
          `${totalQty} item`;
      }

      if (totalText) {

        totalText.textContent =
          `Rp ${totalAmount.toLocaleString("id-ID")}`;
      }

    }

    // ======================================================
    // SUBMIT
    // ======================================================

    if (submitBtn) {

      submitBtn.addEventListener(
        "click",
        async () => {

          if (isSubmitting) return;

          if (!receiverInput.value.trim()) {

            alert(
              "Penerima sample wajib diisi."
            );

            return;
          }

          if (!cart.length) {

            alert(
              "Item sample masih kosong."
            );

            return;
          }

          isSubmitting = true;

          submitBtn.disabled = true;

          submitBtn.textContent =
            "Menyimpan...";

          try {

            const totalAmount =
              cart.reduce(
                (acc, item) =>
                  acc +
                  (
                    (parseFloat(item.qty) || 0)
                    *
                    (parseFloat(item.price) || 0)
                  ),
                0
              );

            const refNo =
              "SMP-" +
              today.replace(/-/g, "") +
              "-" +
              Date.now()
                .toString()
                .slice(-4);

            // ==============================================
            // HEADER
            // ==============================================

            const {
              data: header,
              error: headerError
            } = await supabase
              .from("sample_outflows")
              .insert([{

                reference_no: refNo,

                date:
                  dateInput.value || today,

                customer_name:
                  receiverInput.value,

                requester:
                  requesterInput.value,

                division:
                  divisionInput.value,

                purpose:
                  purposeInput.value,

                notes:
                  notesInput.value,

                total_amount:
                  totalAmount,

                status: "released"

              }])
              .select()
              .single();

            if (headerError)
              throw headerError;

            // ==============================================
            // DETAIL
            // ==============================================

            const itemPayload =
              cart.map(item => ({

                sample_outflow_id:
                  header.id,

                product_id:
                  item.id,

                qty:
                  parseFloat(item.qty) || 0,

                unit:
                  item.unit

              }));

            const {
              error: itemError
            } = await supabase
              .from("sample_outflow_items")
              .insert(itemPayload);

            if (itemError)
              throw itemError;

            alert(
              `Sample ${refNo} berhasil disimpan`
            );

            if (window.navigate) {

              window.navigate(
                "sample-out"
              );

            }

          }

          catch (err) {

            alert(
              "Gagal menyimpan sample: "
              + err.message
            );

          }

          finally {

            isSubmitting = false;

            submitBtn.disabled = false;

            submitBtn.textContent =
              "Simpan Sample";

          }

        }
      );

    }

    renderCart();

  }, 50);

  return `

    <section
      class="create-sample-page"
      style="
        padding-bottom:120px;
      "
    >

      <!-- INFO -->

      <div class="card create-card">

        <div class="form-group">
          <label class="form-label">
            Tanggal
          </label>

          <input
            type="date"
            id="sample-date"
            class="input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            Penerima Sample
          </label>

          <input
            type="text"
            id="sample-receiver"
            class="input"
            placeholder="Nama cafe / customer"
          />
        </div>

        <div
          style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:12px;
          "
        >

          <div class="form-group">
            <label class="form-label">
              Requester
            </label>

            <input
              type="text"
              id="sample-requester"
              class="input"
              placeholder="Nama PIC"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              Divisi
            </label>

            <input
              type="text"
              id="sample-division"
              class="input"
              placeholder="Marketing"
            />
          </div>

        </div>

        <div class="form-group">
          <label class="form-label">
            Tujuan
          </label>

          <input
            type="text"
            id="sample-purpose"
            class="input"
            placeholder="Tujuan sample keluar"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            Catatan
          </label>

          <textarea
            id="sample-notes"
            class="textarea"
            placeholder="Tambahkan catatan..."
          ></textarea>
        </div>

      </div>

      <!-- SEARCH PRODUCT -->

      <div class="card create-card">

        <div
          style="
            margin-bottom:12px;
          "
        >

          <h3
            style="
              font-size:15px;
              font-weight:700;
              margin-bottom:2px;
            "
          >
            Barang Sample
          </h3>

          <p
            class="text-xs text-light"
          >
            Cari produk untuk ditambahkan
          </p>

        </div>

        <div
          class="form-group"
          style="
            position:relative;
          "
        >

          <input
            type="text"
            id="product-search"
            class="input"
            placeholder="Cari nama produk..."
            autocomplete="off"
          />

          <div
            id="product-floating-list"
            class="card"
            style="
              position:absolute;
              top:100%;
              left:0;
              right:0;
              z-index:1000;
              display:none;
              overflow:hidden;
              margin-top:4px;
              max-height:260px;
              overflow-y:auto;
            "
          ></div>

        </div>

      </div>

      <!-- CART -->

      <div id="cart-items-container"></div>

      <!-- SUMMARY -->

      <div class="card create-card">

        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:10px;
          "
        >

          <span
            class="text-sm text-light"
          >
            Total Item
          </span>

          <strong
            id="summary-total-qty"
            style="
              font-size:14px;
            "
          >
            0 item
          </strong>

        </div>

        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
          "
        >

          <span
            class="font-semibold"
          >
            Total Nilai Sample
          </span>

          <strong
            id="summary-total"
            style="
              font-size:18px;
              font-weight:700;
              color:var(--orange);
            "
          >
            Rp 0
          </strong>

        </div>

      </div>

      <!-- ACTION -->

      <div
        class="detail-actions"
        style="
          display:flex;
          gap:12px;
          margin-top:20px;
        "
      >

        <button
          class="btn btn-secondary"
          style="flex:1;"
          onclick="
            window.navigate &&
            window.navigate('sample-out')
          "
        >
          Kembali
        </button>

        <button
          class="btn btn-primary primary-action"
          style="flex:1;"
        >
          Simpan Sample
        </button>

      </div>

    </section>

  `;
}
