import { DashboardPage } from "../pages/dashboard.js";

import { OrderListPage } from "../pages/order-list-page.js";
import { OrderDetailPage } from "../pages/order-detail-page.js";
import { CreateOrderPage } from "../pages/create-order-page.js";

import { ProduksiListPage } from "../pages/produksi-list-page.js";
import { ProduksiDetailPage } from "../pages/produksi-detail-page.js";

import { StockPage } from "../pages/stock-page.js";
import { StockDetailPage } from "../pages/stock-detail-page.js";

import { PurchaseListPage } from "../pages/purchase-list-page.js";

export function renderRoute(route) {

  switch (route) {

    case "dashboard":
      return DashboardPage();

    /* =========================
       SALES ORDER
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
       PEMBELIAN
    ========================= */

    case "pembelian":
      return PurchaseListPage();

    default:
      return DashboardPage();
  }
}