// ==========================================================================
// FILE: src/router/index.js (FULL FIXED VERSION - NO MORE UNDEFINED)
// ==========================================================================

import StockAdjustmentPage from "../pages/StockAdjustmentPage.js"; 
import { DashboardPage } from "../pages/dashboard.js";
import { SampleOutListPage } from "../pages/SampleOutListPage.js";
import { SampleOutDetailPage } from "../pages/SampleOutDetailPage.js";

import { OrderListPage } from "../pages/order-list-page.js";
import { OrderDetailPage } from "../pages/order-detail-page.js";
import { CreateOrderPage } from "../pages/create-order-page.js";

import { ProduksiListPage } from "../pages/produksi-list-page.js";
import { ProduksiDetailPage } from "../pages/produksi-detail-page.js";

import { StockPage } from "../pages/stock-page.js";
import { StockDetailPage } from "../pages/stock-detail-page.js";

import { PurchaseListPage } from "../pages/purchase-list-page.js";
import { PurchaseDetailPage } from "../pages/purchase-detail-page.js";
import { CreatePurchasePage } from "../pages/create-purchase-page.js";

import DebtsPage from "../pages/DebtsPage.js"; 
import ProductPage from "../pages/ProductPage.js"; 

import { PinLock } from "../components/PinLock.js";
import { supabase } from "../supabaseClient.js";

// ==========================================================================
// CENTRAL CONTAINER FINDER
// Mendapatkan root element aplikasi tunggal (SPA) gais
// ==========================================================================
function getAppContainer() {
  return document.getElementById("app") || document.getElementById("content") || document.body;
}

export function renderRoute(route) {
  // ==========================================================================
  // 🕵️ INTERCEPTOR ENGINE PIN ACCESS
  // ==========================================================================
  const isUnlocked = sessionStorage.getItem("app_unlocked");

  if (!isUnlocked) {
    return PinLock(() => {
      sessionStorage.setItem("app_unlocked", "true");
      if (window.navigate) {
        window.navigate("dashboard");
      } else {
        window.location.reload();
      }
    });
  }

  // Ambil instance container aktif sebelum masuk ke mapping halaman
  const container = getAppContainer();

  // ==========================================================================
  // CORE APP ROUTER MAP - AMAN DARI BOCORAN TEKS UNDEFINED 🚀
  // ==========================================================================
  let pageContent;

  switch (route) {
    
    /* =========================
       🛠️ INVENTORY ADJUSTMENT
    ========================= */
    case "penyesuaian-stok":
      pageContent = StockAdjustmentPage(container);
      break;

    /* =========================
       DASHBOARD
    ========================= */
    case "dashboard":
      pageContent = DashboardPage(container);
      break;

    /* =========================
       ORDER & SAMPEL
    ========================= */
    case "order":
      pageContent = OrderListPage(container);
      break;

    case "sample-out":
      pageContent = SampleOutListPage(container);
      break;

    case "sample-out-detail":
      pageContent = SampleOutDetailPage(container);
      break;

    case "order-detail":
      pageContent = OrderDetailPage(container);
      break;

    case "create-order":
      // Fungsi ini merender langsung ke container, nilai baliknya adalah undefined
      pageContent = CreateOrderPage(container); 
      break;

    /* =========================
       PRODUKSI
    ========================= */
    case "produksi":
      pageContent = ProduksiListPage(container);
      break;

    case "produksi-detail":
      pageContent = ProduksiDetailPage(container);
      break;

    /* =========================
       STOCK
    ========================= */
    case "stok":
      pageContent = StockPage(container);
      break;

    case "stock-detail":
      pageContent = StockDetailPage(container);
      break;

    /* =========================
       PURCHASE
    ========================= */
    case "pembelian":
      pageContent = PurchaseListPage(container);
      break;

    case "purchase-detail":
      pageContent = PurchaseDetailPage(container);
      break;

    case "create-purchase":
      pageContent = CreatePurchasePage(container);
      break;

    /* =========================
       MASTER PRODUK
    ========================= */
    case "produk":
      pageContent = ProductPage(container);
      break;

    /* =========================
       💸 ACCOUNTS RECEIVABLE (PIUTANG)
    ========================= */
    case "piutang":
      pageContent = DebtsPage(container);
      break;

    default:
      pageContent = DashboardPage(container);
      break;
  }

  // JARING PENGAMAN: Jika fungsi halaman bertipe void / memanipulasi DOM langsung (return undefined),
  // kembalikan string kosong agar template penampung luar tidak mencetak tulisan "undefined".
  return (pageContent === undefined || pageContent === null) ? "" : pageContent;
}

// ==========================================================================
// 🔔 ENGINE NOTIFIKASI REALTIME
// ==========================================================================
let isNotificationInitialized = false;

function listenToNewOrdersRealtime() {
  if (isNotificationInitialized) return;
  isNotificationInitialized = true;

  supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'sales_orders'
      },
      (payload) => {
        const newOrder = payload.new;
        
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx) {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); 
          oscillator.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); 
          gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
          
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.4);
        }

        const alertBanner = document.createElement("div");
        alertBanner.style.cssText = `
          position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
          background: #1E293B; color: white; padding: 14px 20px; border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 10000; display: flex;
          align-items: center; gap: 12px; font-family: Arial, sans-serif;
          border-left: 4px solid #F97316; width: 90%; max-width: 360px;
          animation: slideDownIn 0.3s ease forwards;
        `;
        
        alertBanner.innerHTML = `
          <div style="background: rgba(249, 115, 22, 0.2); color: #F97316; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px;">🔔</div>
          <div style="flex: 1;">
            <strong style="font-size: 13px; display: block; letter-spacing:0.3px;">ORDERAN BARU MASUK!</strong>
            <span style="font-size: 11px; color: #94A3B8;">Nota ${newOrder.invoice_no || 'Baru'} menunggu diproses gais.</span>
          </div>
        `;

        if (!document.getElementById("notif-anim-style")) {
          const style = document.createElement("style");
          style.id = "notif-anim-style";
          style.innerHTML = `
            @keyframes slideDownIn {
              from { top: -60px; opacity: 0; }
              to { top: 20px; opacity: 1; }
            }
          `;
          document.head.appendChild(style);
        }

        document.body.appendChild(alertBanner);

        setTimeout(() => {
          alertBanner.style.opacity = '0';
          alertBanner.style.transition = 'all 0.3s ease';
          setTimeout(() => alertBanner.remove(), 300);
        }, 4000);
      }
    )
    .subscribe();
}

listenToNewOrdersRealtime();
