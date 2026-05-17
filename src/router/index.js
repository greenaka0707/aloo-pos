import { DashboardPage } from "../pages/dashboard.js";
import { OrderListPage } from "../pages/order-list-page.js";
import { OrderDetailPage } from "../pages/order-detail-page.js";
import { CreateOrderPage } from "../pages/create-order-page.js";

export function renderRoute(route) {

  switch (route) {

    case "dashboard":
      return DashboardPage();

    case "order":
      return OrderListPage();

    case "order-detail":
      return OrderDetailPage();

    case "create-order":
      return CreateOrderPage();

    default:
      return DashboardPage();
  }
}