// ==========================================================================
// SAMPLE ORDER SUPPORT
// FULL SAFE PATCH
// ==========================================================================

// ==========================================================================
// 1. STATE
// ==========================================================================

let isSubmitting = false;
let isSampleOrder = false;

// ==========================================================================
// 2. ELEMENT
// ==========================================================================

const catatanInput =
  container.querySelector("#order-note");

const sampleToggle =
  container.querySelector(
    "#sample-order-toggle"
  );

const manufacturingCard =
  container.querySelector(
    "#manufacturing-analysis-card"
  );

// ==========================================================================
// 3. INIT
// ==========================================================================

if (dateInput)
  dateInput.value = today;

if (sampleToggle) {

  sampleToggle.addEventListener(
    "change",
    (e) => {

      isSampleOrder =
        e.target.checked;

      updateSampleMode();

      calculateTotalsOnly();

    }
  );

}

// ==========================================================================
// 4. UPDATE SAMPLE MODE
// ==========================================================================

function updateSampleMode() {

  const summaryCard =
    container.querySelector(
      "#summary-card"
    );

  const paymentCard =
    container.querySelector(
      "#payment-card"
    );

  if (isSampleOrder) {

    if (summaryCard) {

      summaryCard.style.display =
        "none";

    }

    if (paymentCard) {

      paymentCard.style.display =
        "none";

    }

    if (manufacturingCard) {

      manufacturingCard.style.display =
        "none";

    }

  }

  else {

    if (summaryCard) {

      summaryCard.style.display =
        "block";

    }

    if (paymentCard) {

      paymentCard.style.display =
        "block";

    }

  }

}

// ==========================================================================
// 5. REPLACE FULL FUNCTION calculateTotalsOnly()
// ==========================================================================

function calculateTotalsOnly() {

  let needsProduction = false;

  cart.forEach((item) => {

    const validQty =
      parseFloat(item.qty) || 0;

    if (
      !isSampleOrder &&
      item.category !== "greenbean" &&
      validQty > item.stock
    ) {

      needsProduction = true;

    }

  });

  if (manufacturingCard) {

    manufacturingCard.style.display =
      (
        needsProduction &&
        !isSampleOrder
      )
        ? "block"
        : "none";

  }

  if (!needsProduction) {

    bomCart = [];

    renderBomCartStructure();

  }

  const subtotalTotal =
    cart.reduce(
      (acc, item) => {

        return (
          acc +
          (
            (parseFloat(item.qty) || 0) *
            (parseFloat(item.price) || 0)
          )
        );

      },
      0
    );

  const ongkirVal =
    parseFloat(
      ongkirInput?.value || 0
    );

  const payVal =
    parseFloat(
      bayarInput?.value || 0
    );

  const sisaTotal =
    (
      subtotalTotal +
      ongkirVal
    ) - payVal;

  if (summarySubtotal) {

    summarySubtotal.textContent =
      `Rp ${subtotalTotal.toLocaleString("id-ID")}`;

  }

  if (summaryOngkir) {

    summaryOngkir.textContent =
      `Rp ${ongkirVal.toLocaleString("id-ID")}`;

  }

  if (summaryBayar) {

    summaryBayar.textContent =
      `Rp ${payVal.toLocaleString("id-ID")}`;

  }

  if (summarySisa) {

    summarySisa.textContent =
      `Rp ${sisaTotal.toLocaleString("id-ID")}`;

    summarySisa.style.color =
      sisaTotal > 0
        ? "var(--orange)"
        : "#10B981";

  }

}
