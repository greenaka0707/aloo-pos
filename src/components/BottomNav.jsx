// ==========================================================================
// FILE: src/components/BottomNav.jsx (MURNI REACT COMPONENT - STABLE)
// ==========================================================================

import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ShoppingCart,
  Factory,
  Package,
} from "lucide-react";

const menus = [
  {
    label: "Dashboard",
    path: "/dashboard", // Disesuaikan dengan rute index.jsx gais
    icon: LayoutGrid,
  },
  {
    label: "Order",
    path: "/sales",
    icon: ShoppingCart,
  },
  {
    label: "Produksi",
    path: "/manufacturing",
    icon: Factory,
  },
  {
    label: "Stok",
    path: "/inventory",
    icon: Package,
  },
];

export default function BottomNav() {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        px-4
        pb-[max(env(safe-area-inset-bottom),16px)]
        pt-3
      "
    >
      <div
        className="
          bg-white/90
          backdrop-blur-xl
          border
          border-zinc-200
          rounded-[28px]
          px-2
          py-2
          flex
          items-center
          justify-between
          shadow-lg
          max-w-md
          mx-auto
        "
      >
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  w-full
                  h-16
                  rounded-2xl
                  transition-all
                  ${
                    isActive
                      ? "bg-orange-500 text-white shadow-sm font-semibold"
                      : "text-zinc-500 active:bg-zinc-100"
                  }
                `
              }
            >
              <Icon size={20} />
              <span className="text-xs">{menu.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}