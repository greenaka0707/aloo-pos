import { DashboardPage } from "../pages/dashboard";
import { OrderListPage } from "../pages/order-list-page";
import { OrderDetailPage } from "../pages/order-detail-page";

export function renderRoute(route) {

  switch (route) {

    case "order":
      return OrderListPage();

    case "order-detail":
      return OrderDetailPage();

    case "dashboard":
    default:
      return DashboardPage();
  }
}