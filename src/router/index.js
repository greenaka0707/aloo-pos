import { DashboardPage } from "../pages/dashboard";
import { OrderListPage } from "../pages/order-list-page";
import { OrderDetailPage } from "../pages/order-detail-page";
import { CreateOrderPage } from "../pages/create-order-page";

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