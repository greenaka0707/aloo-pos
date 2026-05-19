import { BottomNav } from "../components/bottom-nav.js";
import { supabase } from "../supabaseClient.js";

// Objek Pemetaan Judul & Subjudul berdasarkan Route ID aplikasi Anda
const navbarMeta = {
  'dashboard': { title: 'Dashboard', subtitle: 'Manufacturing overview', backTo: 'dashboard' },
  'order': { title: 'Sales Order', subtitle: 'Manufacturing sales workflow', backTo: 'dashboard' },
  'create-order': { title: 'Create Order', subtitle: 'Sales order manufacturing', backTo: 'order' },
  'order-detail': { title: 'SO-001', subtitle: 'Sales Order Detail', backTo: 'order' },
  'pembelian': { title: 'Pembelian', subtitle: 'Supplier purchasing workflow', backTo: 'dashboard' },
  'create-purchase': { title: 'Create Purchase', subtitle: 'Supplier purchasing workflow', backTo: 'pembelian' },
  'purchase-detail': { title: 'PO-001', subtitle: 'Purchase Detail', backTo: 'pembelian' },
  'produksi': { title: 'Produksi', subtitle: 'Manufacturing production workflow', backTo: 'dashboard' },
  'produksi-detail': { title: 'PRD-001', subtitle: 'Produksi Detail', backTo: 'produksi' },
  'stok': { title: 'Stock', subtitle: 'Inventory management', backTo: 'dashboard' },
  'stock-detail': { title: 'RB Robusta Grade A', subtitle: 'Stock Detail', backTo: 'stok' },
  'laporan': { title: 'Laporan', subtitle: 'Operational analytics reporting', backTo: 'dashboard' },
  'produk': { title: 'Produk', subtitle: 'Product master data list', backTo: 'dashboard' },
  'akun': { title: 'Akun Saya', subtitle: 'User profile settings', backTo: 'dashboard' },
  
  // 💸 SUNTIKAN METADATA BARU: ROUTE PIUTANG TOKO ENNA FIELD TRIAL LO GAIS
  'piutang': { title: 'Piutang Usaha', subtitle: 'PT. Ekspansi Nutrisi Nusantara', backTo: 'dashboard' },
  
  // 🛠️ SUNTIKAN METADATA BARU: ROUTE ADJUSTMENT STOK TIMBANGAN GUDANG LO GAIS
  'penyesuaian-stok': { title: 'Penyesuaian Stok', subtitle: 'PT. Ekspansi Nutrisi Nusantara', backTo: 'stok' }
};

// State penampung jumlah unread order secara global gais
let unreadOrderCount = 0;
let isRealtimeInitialized = false;

export function AppLayout({ content, route }) {
  // Ambil meta data berdasarkan route saat ini (Default fallback diganti ke PT baru lo gais)
  const meta = navbarMeta[route] || { title: 'ERP POS', subtitle: 'PT. Ekspansi Nutrisi Nusantara', backTo: 'dashboard' };

  const isDashboard = route === 'dashboard';

  // 1. Tombol Back Bulat (Hanya muncul jika BUKAN di halaman dashboard)
  const backButtonHtml = !isDashboard 
    ? `<button class="btn-back" onclick="window.navigate('${meta.backTo}')">
         <i data-lucide="arrow-left"></i>
       </button>`
    : '';

  // ==========================================================================
  // 🔔 REALTIME COUNTER ENGINE FOR NAVBAR NOTIFICATION BELL GAIS
  // ==========================================================================
  setTimeout(() => {
    const badgeEl = document.getElementById("navbar-bell-badge");
    const bellBtn = document.getElementById("navbar-bell-btn");
    
    // Fungsi sinkronisasi render visual angka di DOM gais
    const updateBadgeDOM = () => {
      if (!badgeEl) return;
      if (unreadOrderCount > 0) {
        badgeEl.textContent = unreadOrderCount;
        badgeEl.style.display = "flex";
      } else {
        badgeEl.style.display = "none";
      }
    };

    // Jalankan render awal status badge
    updateBadgeDOM();

    // Reset notifikasi jika kasir klik tombol lonceng dan arahkan ke Sales Order gais
    if (bellBtn) {
      bellBtn.onclick = () => {
        unreadOrderCount = 0;
        updateBadgeDOM();
        if (window.navigate) window.navigate("order");
      };
    }

    // Pasang Realtime Listener Supabase jika belum di-init
    if (!isRealtimeInitialized) {
      isRealtimeInitialized = true;

      supabase
        .channel('navbar-global-realtime-orders')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'sales_orders' },
          () => {
            unreadOrderCount += 1; // Dongkrak angka counter tiap ada sales order masuk gais
            updateBadgeDOM();
          }
        )
        .subscribe();
    }
  }, 50);

  return `
    <div class="app-layout">

      <div class="page-navbar">
        <div class="navbar-container">
          
          <div class="navbar-left-content">
            ${backButtonHtml}
            <div class="navbar-title-wrapper">
              <h2 class="navbar-title">${meta.title}</h2>
              <p class="navbar-subtitle">${meta.subtitle}</p>
            </div>
          </div>

          <div class="navbar-actions">
            <button class="btn-nav-action" onclick="window.navigate('akun')">
              <i data-lucide="user"></i>
            </button>
            
            <button id="navbar-bell-btn" class="btn-nav-action" style="position: relative;">
              <i data-lucide="bell"></i>
              <span id="navbar-bell-badge" style="
                position: absolute;
                top: -2px;
                right: -2px;
                background: #EF4444;
                color: white;
                font-size: 9px;
                font-weight: bold;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              ">0</span>
            </button>
          </div>

        </div>
      </div>

      <main class="app-content">
        ${content}
      </main>

      ${BottomNav(route)}

    </div>
  `;
}
