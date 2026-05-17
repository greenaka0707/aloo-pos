import { AppLayout } from "./layouts/app-layout";
import { DashboardPage } from "./pages/dashboard";

document.querySelector("#app").innerHTML =
  AppLayout(
    DashboardPage()
  );

lucide.createIcons();