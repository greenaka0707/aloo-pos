import { supabase } from "../supabaseClient.js";

export function SampleOutListPage() {

  let currentTab = "Semua";
  let searchQuery = "";
  let allSamples = [];

  setTimeout(async () => {

    const container = document.querySelector(".data-list");
    const fab = document.querySelector(".fab-btn");
    const appLayout = document.querySelector(".app-layout");
    const listPage = document.querySelector(".list-page");

    if (fab && appLayout) {
      fab.style.display = "flex";

      if (fab.parentElement !== appLayout) {
        appLayout.appendChild(fab);
      }
    }

    if (!listPage || !container) return;

    const searchInput =
      listPage.querySelector(".stock-search-input");

    const filterChips =
      listPage.querySelectorAll(".filter-chip");

    // ======================================================
    // FETCH DATA
    // ======================================================

    async function fetchSampleOutflows() {

      try {

        container.innerHTML = `
          <p
            class="text-light text-xs"
            style="
              text-align:center;
              padding:var(--space-xl);
            "
          >
            Memuat data barang keluar sampel...
          </p>
        `;

        const { data, error } = await supabase
          .from("sample_outflows")
          .select(`
            id,
            reference_no,
            date,
            customer_name,
            status,
            total_amount,
            created_at
          `)
          .order("created_at", {
            ascending: false
          });

        if (error) throw error;

        allSamples = data || [];

        renderFilteredList();

      } catch (err) {

        container.innerHTML = `
          <p
            class="text-xs"
            style="
              text-align:center;
              padding:var(--space-xl);
              color:var(--danger);
            "
          >
            ❌ ${err.message}
          </p>
        `;
      }
    }

    // ======================================================
    // RENDER
    // ======================================================

    function renderFilteredList() {

      let filtered = [...allSamples];

      // FILTER STATUS
      if (currentTab !== "Semua") {

        filtered = filtered.filter(item =>
          item.status?.toLowerCase() ===
          currentTab.toLowerCase()
        );
      }

      // SEARCH
      if (searchQuery) {

        filtered = filtered.filter(item => {

          const customer =
            item.customer_name?.toLowerCase() || "";

          const ref =
            item.reference_no?.toLowerCase() || "";

          return (
            customer.includes(searchQuery) ||
            ref.includes(searchQuery)
          );
        });
      }

      // EMPTY
      if (filtered.length === 0) {

        container.innerHTML = `
          <p
            class="text-light text-xs"
            style="
              text-align:center;
              padding:var(--space-xl);
            "
          >
            Tidak ada data sampel keluar.
          </p>
        `;

        return;
      }

      // CARD LIST
      container.innerHTML = filtered.map(item => {

        let formattedDate = "-";

        if (item.date) {

          const d = new Date(item.date);

          const months = [
            "Jan","Feb","Mar","Apr",
            "Mei","Jun","Jul","Agu",
            "Sep","Okt","Nov","Des"
          ];

          formattedDate =
            `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        const status =
          item.status?.toLowerCase() || "released";


        return `
          <div
           class="list-card modern-order-card"
          >

            <div class="order-card-left">

              <!-- TOP -->
              <div class="order-main-row">

                <div class="order-title-group">

                  <h3>
                    ${item.customer_name || "Tanpa Customer"}
                  </h3>

                </div>

                <span
                  class="modern-status ${status}"
                >
                  ${item.status || "Released"}
                </span>

              </div>

              <!-- REF -->
              <p class="order-ref">
                ${item.reference_no || "-"}
              </p>

              <!-- DATE -->
             <p
                class="order-ref"
                style="
                  margin-top:2px;
                  font-size:11px;
                "
              >
                ${formattedDate}
              </p>
              <!-- BOTTOM -->
              <div class="order-bottom-row">

                <strong class="order-total">
                  Rp ${Number(item.total_amount || 0)
                    .toLocaleString("id-ID")}
                </strong>

                <button
                  class="order-arrow-btn detail-btn"
                  data-id="${Number(item.id)}"
                >
                  <i data-lucide="arrow-up-right"></i>
                </button>

              </div>

            </div>

          </div>
        `;

      }).join("");

      // DETAIL BUTTON
      container
        .querySelectorAll(".detail-btn")
        .forEach(btn => {

          btn.addEventListener("click", () => {

            const sampleId =
              Number(btn.dataset.id);

            if (!sampleId || isNaN(sampleId)) {
              return alert("ID tidak valid");
            }

            localStorage.setItem(
              "selected_sample_out_id",
              sampleId.toString()
            );

            if (window.navigate) {
              window.navigate(
                "sample-out-detail"
              );
            }

          });

        });

      if (window.lucide) {
        window.lucide.createIcons();
      }

    }

    // ======================================================
    // SEARCH
    // ======================================================

    if (searchInput) {

      searchInput.addEventListener(
        "input",
        (e) => {

          searchQuery =
            e.target.value
              .trim()
              .toLowerCase();

          renderFilteredList();
        }
      );
    }

    // ======================================================
    // FILTER
    // ======================================================

    filterChips.forEach(chip => {

      chip.addEventListener("click", (e) => {

        filterChips.forEach(c =>
          c.classList.remove("active")
        );

        e.target.classList.add("active");

        currentTab =
          e.target.textContent.trim();

        renderFilteredList();

      });

    });

    fetchSampleOutflows();

  }, 50);

  // ======================================================
  // TEMPLATE
  // ======================================================

  return `
    <section class="list-page">

      <div class="normal-search-row">

        <div class="search-box">

          <i data-lucide="search"></i>

          <input
            type="text"
            class="stock-search-input"
            placeholder="Cari customer / nomor referensi..."
          />

        </div>

      </div>

      <div class="filter-scroll">

        <button class="filter-chip active">
          Semua
        </button>

        <button class="filter-chip">
          Released
        </button>

        <button class="filter-chip">
          Void
        </button>

      </div>

      <div class="data-list"></div>

      <button
        class="fab-btn"
        onclick="window.navigate('create-sample-out')"
      >
        <i data-lucide="plus"></i>
      </button>

    </section>
  `;
}
