import StockAdjustmentPage from "../pages/StockAdjustmentPage.js"; // ✔️ FIX: Mengubah 'Import' menjadi 'import' huruf kecil

import { DashboardPage } from "../pages/dashboard.js";

import { SampleOutListPage } from "../pages/SampleOutListPage.js";

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
import { supabase } from "../supabaseClient.js";

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

    case "sample-out":
      return SampleOutListPage();

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

// ==========================================================================
// 🔔 ENGINE NOTIFIKASI REALTIME: SINKRONISASI NOTA BARU MASUK GLOBAL GAIS
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
        event: 'INSERT', // Menangkap murni baris order baru masuk gais
        schema: 'public',
        table: 'sales_orders'
      },
      (payload) => {
        const newOrder = payload.new;
        
        // 1. Trigger Efek Suara Bell Kasir Ting-Ting Resmi
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx) {
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // Tone 1 (D5)
          oscillator.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1); // Tone 2 (A5)
          gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
          
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.4);
        }

        // 2. Buat Elemen Pop-up Banner Animasi di Atas Layar HP Lo
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

        // Inject animasi CSS transisi jika belum terpasang gais
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

        // Hapus Pop-up otomatis dalam tempo 4 detik
        setTimeout(() => {
          alertBanner.style.opacity = '0';
          alertBanner.style.transition = 'all 0.3s ease';
          setTimeout(() => alertBanner.remove(), 300);
        }, 4000);
      }
    )
    .subscribe();
}

// Nyalakan monitor pengawasan order gais
listenToNewOrdersRealtime();
