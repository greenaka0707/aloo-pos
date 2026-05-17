import { DashboardPage } from "../pages/dashboard";
import { OrderListPage } from "../pages/order-list-page";

export function renderRoute(route) {
  switch (route) {

    case "order":
      return OrderListPage();

    case "dashboard":
    default:
      return DashboardPage();
  }
}