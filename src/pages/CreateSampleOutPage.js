import { supabase } from "../supabaseClient.js";

export default function CreateSampleOutPage() {

  let cart = [];

  let isSubmitting = false;

  let selectedCustomer = null;

  let selectedSalesman = null;

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

    const customerInput =
      container.querySelector("#customer-search");

    const customerFloat =
      container.querySelector("#customer-floating-list");

    const salesmanInput =
      container.querySelector("#salesman-search");

    const salesmanFloat =
      container.querySelector("#salesman-floating-list");

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
    // INIT
    // ======================================================

    dateInput.value = today;

    // ======================================================
    // CUSTOMER SEARCH
    // ======================================================

    customerInput.addEventListener(
      "input",
      async (e) => {

        selectedCustomer = null;

        const val =
          e.target.value.trim();

        if (!val) {

          customerFloat.style.display =
            "none";

          return;
        }

        const {
          data,
          error
        } = await supabase
          .from("customers")
          .select(`
            id,
            name
          `)
          .ilike("name", `%${val}%`)
          .limit(8);

        if (error || !data) return;

        customerFloat.innerHTML =
          data.map(c => `

            <div
              class="floating-item customer-item"
              data-id="${c.id}"
              data-name="${c.name}"
            >
              ${c.name}
            </div>

          `).join("");

        customerFloat.style.display =
          "block";

        customerFloat
          .querySelectorAll(".customer-item")
          .forEach(item => {

            item.addEventListener(
              "click",
              () => {

                selectedCustomer = {

                  id:
                    item.dataset.id,

                  name:
                    item.dataset.name

                };

                customerInput.value =
                  item.dataset.name;

                customerFloat.style.display =
                  "none";

              }
            );

          });

      }
    );

    // ======================================================
    // SALESMAN SEARCH
    // ======================================================

    salesmanInput.addEventListener(
      "input",
      async (e) => {

        selectedSalesman = null;

        const val =
          e.target.value.trim();

        if (!val) {

          salesmanFloat.style.display =
            "none";

          return;
        }

        const {
          data,
          error
        } = await supabase
          .from("salesmen")
          .select(`
            id,
            name
          `)
          .ilike("name", `%${val}%`)
          .limit(8);

        if (error || !data) return;

        salesmanFloat.innerHTML =
          data.map(s => `

            <div
              class="floating-item salesman-item"
              data-id="${s.id}"
              data-name="${s.name}"
            >
              ${s.name}
            </div>

          `).join("");

        salesmanFloat.style.display =
          "block";

        salesmanFloat
          .querySelectorAll(".salesman-item")
          .forEach(item => {

            item.addEventListener(
              "click",
              () => {

                selectedSalesman = {

                  id:
                    item.dataset.id,

                  name:
                    item.dataset.name

                };

                salesmanInput.value =
                  item.dataset.name;

                salesmanFloat.style.display =
                  "none";

              }
            );

          });

      }
    );

    // ======================================================
    // PRODUCT SEARCH
    // ======================================================

    productInput.addEventListener(
      "input",
      async (e) => {

        const val =
          e.target.value.trim();

        if (!val) {

          productFloat.style.display =
            "none";

          return;
        }

        const {
          data,
          error
        } = await supabase
          .from("products")
          .select(`
            id,
            name,
            stock,
            unit,
            price
          `)
          .ilike("name", `%${val}%`)
          .limit(8);

        if (error || !data) return;

        productFloat.innerHTML =
          data.map(p => `

            <div
              class="floating-item product-item"
              data-id="${p.id}"
              data-name="${p.name}"
              data-unit="${p.unit || "pcs"}"
              data-price="${p.price || 0}"
            >

              <div>

                <strong>
                  ${p.name}
                </strong>

                <small>
                  Stok:
                  ${p.stock || 0}
                  ${p.unit || ""}
                </small>

              </div>

            </div>

          `).join("");

        productFloat.style.display =
          "block";

        productFloat
          .querySelectorAll(".product-item")
          .forEach(item => {

            item.addEventListener(
              "click",
              () => {

                const id =
                  Number(item.dataset.id);

                if (
                  cart.some(x => x.id === id)
                ) return;

                cart.push({

                  id,

                  name:
                    item.dataset.name,

                  unit:
                    item.dataset.unit,

                  qty: "",

                  price:
                    Number(
                      item.dataset.price
                    )

                });

                renderCart();

                productInput.value = "";

                productFloat.style.display =
                  "none";

              }
            );

          });

      }
    );

    // ======================================================
    // CART
    // ======================================================

    function renderCart() {

      if (!cart.length) {

        cartContainer.innerHTML = `

          <div class="card create-card">

            <div
              style="
                text-align:center;
                color:var(--text-light);
              "
            >
              Belum ada item sample
            </div>

          </div>

        `;

        calculateTotals();

        return;
      }

      cartContainer.innerHTML =
        cart.map((item, idx) => `

          <div class="card create-card">

            <div
              style="
                display:flex;
                align-items:flex-start;
                justify-content:space-between;
                gap:12px;
              "
            >

              <div>

                <strong
                  style="
                    font-size:14px;
                  "
                >
                  ${item.name}
                </strong>

              </div>

              <button
                class="remove-item-btn"
                data-idx="${idx}"
              >
                Hapus
              </button>

            </div>

            <div class="form-grid-2">

              <div class="form-group">

                <label class="form-label">
                  Qty
                </label>

                <input
                  type="number"
                  inputmode="decimal"
                  class="input item-qty"
                  data-idx="${idx}"
                  value="${item.qty}"
                  placeholder="0"
                />

              </div>

              <div class="form-group">

                <label class="form-label">
                  Unit
                </label>

                <input
                  type="text"
                  class="input"
                  readonly
                  value="${item.unit}"
                />

              </div>

            </div>

            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
              "
            >

              <span class="text-xs text-light">
                Nilai Sample
              </span>

              <strong
                class="item-total"
              >
                Rp ${(
                  (Number(item.qty) || 0)
                  *
                  (Number(item.price) || 0)
                ).toLocaleString("id-ID")}
              </strong>

            </div>

          </div>

        `).join("");

      // ====================================================
      // QTY
      // ====================================================

      cartContainer
        .querySelectorAll(".item-qty")
        .forEach(input => {

          input.addEventListener(
            "input",
            (e) => {

              const idx =
                Number(
                  e.target.dataset.idx
                );

              cart[idx].qty =
                e.target.value;

              calculateTotals();

              const card =
                e.target.closest(".card");

              const totalEl =
                card.querySelector(".item-total");

              totalEl.textContent =
                `Rp ${(
                  (Number(cart[idx].qty) || 0)
                  *
                  (Number(cart[idx].price) || 0)
                ).toLocaleString("id-ID")}`;

            }
          );

        });

      // ====================================================
      // REMOVE
      // ====================================================

      cartContainer
        .querySelectorAll(".remove-item-btn")
        .forEach(btn => {

          btn.addEventListener(
            "click",
            (e) => {

              const idx =
                Number(
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
    // TOTALS
    // ======================================================

    function calculateTotals() {

      const totalQty =
        cart.reduce(
          (acc, item) =>
            acc +
            (Number(item.qty) || 0),
          0
        );

      const totalAmount =
        cart.reduce(
          (acc, item) =>
            acc +
            (
              (Number(item.qty) || 0)
              *
              (Number(item.price) || 0)
            ),
          0
        );

      totalQtyText.textContent =
        `${totalQty} item`;

      totalText.textContent =
        `Rp ${totalAmount.toLocaleString("id-ID")}`;

    }

    // ======================================================
    // SUBMIT
    // ======================================================

    submitBtn.addEventListener(
      "click",
      async () => {

        if (isSubmitting) return;

        if (!selectedCustomer) {

          alert(
            "Pilih customer terlebih dahulu"
          );

          return;
        }

        if (!selectedSalesman) {

          alert(
            "Pilih requester terlebih dahulu"
          );

          return;
        }

        if (!cart.length) {

          alert(
            "Item sample masih kosong"
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
                  (Number(item.qty) || 0)
                  *
                  (Number(item.price) || 0)
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

          // ==================================================
          // HEADER
          // ==================================================

          const {
            data: header,
            error: headerError
          } = await supabase
            .from("sample_outflows")
            .insert([{

              reference_no: refNo,

              date:
                dateInput.value,

              customer_name:
                selectedCustomer.name,

              requester:
                selectedSalesman.name,

              division:
                divisionInput.value,

              purpose:
                purposeInput.value,

              notes:
                notesInput.value,

              total_amount:
                totalAmount,

              status:
                "released"

            }])
            .select()
            .single();

          if (headerError)
            throw headerError;

          // ==================================================
          // ITEMS
          // ==================================================

          const itemPayload =
            cart.map(item => ({

              sample_outflow_id:
                header.id,

              product_id:
                item.id,

              qty:
                Number(item.qty) || 0,

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
            `Sample ${refNo} berhasil dibuat`
          );

          window.navigate("sample-out");

        }

        catch (err) {

          alert(
            "Gagal membuat sample: "
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

    renderCart();

  }, 50);

  return `

    <section class="create-sample-page">

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

        <!-- CUSTOMER -->

        <div
          class="form-group"
          style="position:relative;"
        >

          <label class="form-label">
            Customer
          </label>

          <input
            type="text"
            id="customer-search"
            class="input"
            placeholder="Cari customer..."
            autocomplete="off"
          />

          <div
            id="customer-floating-list"
            class="card floating-list"
          ></div>

        </div>

        <!-- SALESMAN -->

        <div
          class="form-group"
          style="position:relative;"
        >

          <label class="form-label">
            Requester
          </label>

          <input
            type="text"
            id="salesman-search"
            class="input"
            placeholder="Cari sales..."
            autocomplete="off"
          />

          <div
            id="salesman-floating-list"
            class="card floating-list"
          ></div>

        </div>

        <!-- DIVISION -->

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

        <!-- PURPOSE -->

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

        <!-- NOTES -->

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

      <!-- PRODUCT -->

      <div class="card create-card">

        <div
          style="
            display:flex;
            flex-direction:column;
            gap:2px;
          "
        >

          <strong>
            Create Sample
          </strong>

          <span
            class="text-xs text-light"
          >
            Cari produk untuk ditambahkan
          </span>

        </div>

        <div
          class="form-group"
          style="position:relative;"
        >

          <input
            type="text"
            id="product-search"
            class="input"
            placeholder="Cari produk..."
            autocomplete="off"
          />

          <div
            id="product-floating-list"
            class="card floating-list"
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
          "
        >

          <span class="text-sm text-light">
            Total Item
          </span>

          <strong id="summary-total-qty">
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

          <span class="font-semibold">
            Total Nilai Sample
          </span>

          <strong
            id="summary-total"
            style="
              font-size:18px;
              color:var(--orange);
            "
          >
            Rp 0
          </strong>

        </div>

      </div>

      <!-- ACTION -->

      <div class="detail-actions">

        <button
          class="btn btn-secondary"
          style="flex:1;"
          onclick="
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
