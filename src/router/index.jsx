// ==========================================================================
// FILE: src/router/index.jsx (MURNI REACT VERSION - ULTRA CLEAN ROUTE)
// ==========================================================================

import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// IMPORT COMPONENT UTAMA
import BottomNav from "../components/BottomNav.jsx";
import { PinLock } from "../components/PinLock.js"; // Dipanggil jika belum unlock
import { supabase } from "../supabaseClient.js";

// IMPORT PAGES (Murni Menggunakan Format .jsx Baru Gais!)
import StockAdjustmentPage from "../pages/StockAdjustmentPage.js";
import DashboardPage from "../pages/DashboardPage.jsx"; // 🔥 CLEAN FIX: Default export murni tanpa spasi ganda atau huruf liar
import { SampleOutListPage } from "../pages/SampleOutListPage.js";
import { SampleOutDetailPage } from "../pages/SampleOutDetailPage.js";
import OrderListPage from "../pages/OrderListPage.jsx"; 
import OrderDetailPage from "../pages/OrderDetailPage.jsx"; 
import CreateOrderPage from "../pages/CreateOrderPage.jsx"; 
import { ProduksiListPage } from "../pages/produksi-list-page.js";
import { ProduksiDetailPage } from "../pages/produksi-detail-page.js";
import { StockPage } from "../pages/stock-page.js";
import { StockDetailPage } from "../pages/stock-detail-page.js";
import { PurchaseListPage } from "../pages/purchase-list-page.js";
import { PurchaseDetailPage } from "../pages/purchase-detail-page.js";
import { CreatePurchasePage } from "../pages/create-purchase-page.js";
import DebtsPage from "../pages/DebtsPage.js";
import ProductPage from "../pages/ProductPage.js";

export default function AppRouter() {
  // ==========================================================================
  // 🕵️ STATE INTERCEPTOR PIN ACCESS
  // ==========================================================================
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem("app_unlocked") === "true";
  });

  const handleUnlockSuccess = () => {
    sessionStorage.setItem("app_unlocked", "true");
    setIsUnlocked(true);
  };

  // ==========================================================================
  // 🔔 ENGINE NOTIFIKASI REALTIME (SUPABASE WORKER)
  // ==========================================================================
  useEffect(() => {
    if (!isUnlocked) return;

    const channel = supabase
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
          
          // Trigger Audio Beep Notifikasi
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

          // Injeksi Banner Alert Dinamis ke Layar HP
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isUnlocked]);

  if (!isUnlocked) {
    return <PinLock onSuccess={handleUnlockSuccess} />;
  }

  // ==========================================================================
  // CORE APP ROUTER WRAPPER
  // ==========================================================================
  return (
    <Router>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 antialiased selection:bg-orange-100">
        
        {/* VIEWPORT FRAME KHUSUS DISPLAY HP */}
        <main className="w-full max-w-md mx-auto bg-white min-h-screen shadow-sm relative pb-24">
          <Routes>
            {/* BASE REDIRECT */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* ROUTE MAPPING */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/penyesuaian-stok" element={<StockAdjustmentPage />} />
            
            {/* SALES / ORDERS AREA */}
            <Route path="/sales" element={<OrderListPage />} />
            <Route path="/create-order" element={<CreateOrderPage />} />
            <Route path="/order-detail" element={<OrderDetailPage />} />
            
            {/* SAMPLES MANAGEMENT */}
            <Route path="/sample-out" element={<SampleOutListPage />} />
            <Route path="/sample-out-detail" element={<SampleOutDetailPage />} />
            
            {/* PRODUCTION CONTROLS */}
            <Route path="/manufacturing" element={<ProduksiListPage />} />
            <Route path="/produksi-detail" element={<ProduksiDetailPage />} />
            
            {/* INVENTORY TRACKING */}
            <Route path="/inventory" element={<StockPage />} />
            <Route path="/stock-detail" element={<StockDetailPage />} />
            
            {/* SUPPLY / PURCHASING */}
            <Route path="/pembelian" element={<PurchaseListPage />} />
            <Route path="/purchase-detail" element={<PurchaseDetailPage />} />
            <Route path="/create-purchase" element={<CreatePurchasePage />} />
            
            {/* DATA MASTER & METRICS */}
            <Route path="/produk" element={<ProductPage />} />
            <Route path="/piutang" element={<DebtsPage />} />

            {/* FALLBACK REDIRECT ILLEGAL PATH */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* NAVBAR BAWAH MURNI REACT */}
        <BottomNav />

      </div>
    </Router>
  );
}