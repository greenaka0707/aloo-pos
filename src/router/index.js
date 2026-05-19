import StockAdjustmentPage from "../pages/StockAdjustmentPage.js";

import { DashboardPage } from "../pages/dashboard.js";

import { OrderListPage } from "../pages/order-list-page.js";
import { OrderDetailPage } from "../pages/order-detail-page.js";
import CreateOrderPage from "../pages/create-order-page.js";

import { ProduksiListPage } from "../pages/produksi-list-page.js";
import { ProduksiDetailPage } from "../pages/produksi-detail-page.js";

import { StockPage } from "../pages/stock-page.js";
import { StockDetailPage } from "../pages/stock-detail-page.js";

import { PurchaseListPage } from "../pages/purchase-list-page.js";
import { PurchaseDetailPage } from "../pages/purchase-detail-page.js";
import { CreatePurchasePage } from "../pages/create-purchase-page.js";

// 💸 SUNTIKAN JALUR PAGE BARU: IMPORT HALAMAN PIUTANG USAHA TRIAL LO GAIS
import DebtsPage from "../pages/DebtsPage.js"; 

// 2. PERBAIKAN UTAMA: Mengubah named import {} menjadi default import (tanpa {})
import ProductPage from "../pages/ProductPage.js"; 

// 🕵️ 3. SUNTIKAN: IMPORT COMPONENT LAYAR PIN IPHONE LO GAIS
import { PinLock } from "../components/PinLock.js";

export function renderRoute(route) {

  // ==========================================================================
  // 🕵️ INTERCEPTOR ENGINE PIN ACCESS (PENCEGAT ROUTER MULTIKUNCI GAIS)
  // ==========================================================================
  const isUnlocked = sessionStorage.getItem("app_unlocked");

  if (!isUnlocked) {
    // Paksa render layar iPhone Lockscreen duluan gais!
    return PinLock(() => {
      // Callback ketika sukses tembus PIN:
      sessionStorage.setItem("app_unlocked", "true");
      
      // Begitu PIN cocok, langsung pemicu reload navigasi balik ke dashboard gais!
      if (window.navigate) {
        window.navigate("dashboard");
      } else {
        window.location.reload();
      }
    });
  }

  // ==========================================================================
  // CORE APP ROUTER MAP (JALUR ROUTE ASLI TRANS PARAN LO)
  // ==========================================================================
  switch (route) {
    
    /* =========================
       🛠️ INVENTORY ADJUSTMENT (PENYESUAIAN STOK GUDANG)
    ========================= */
    case "penyesuaian-stok":
      return StockAdjustmentPage();

    /* =========================
       DASHBOARD
    ========================= */
    case "dashboard":
      return DashboardPage();

    /* =========================
       ORDER
    ========================= */
    case "order":
      return OrderListPage();

    case "order-detail":
      return OrderDetailPage();

    case "create-order":
      return CreateOrderPage();

    /* =========================
       PRODUKSI
    ========================= */
    case "produksi":
      return ProduksiListPage();

    case "produksi-detail":
      return ProduksiDetailPage();

    /* =========================
       STOCK
    ========================= */
    case "stok":
      return StockPage();

    case "stock-detail":
      return StockDetailPage();

    /* =========================
       PURCHASE
    ========================= */
    case "pembelian":
      return PurchaseListPage();

    case "purchase-detail":
      return PurchaseDetailPage();

    case "create-purchase":
      return CreatePurchasePage();

    /* =========================
       MASTER PRODUK
    ========================= */
    case "produk":
      return ProductPage();

    /* =========================
       💸 ACCOUNTS RECEIVABLE (PIUTANG TRIAL)
    ========================= */
    case "piutang":
      return DebtsPage();

    default:
      return DashboardPage();
  }
}
