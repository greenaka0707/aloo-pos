import { BottomNav } from "../components/bottom-nav.js";

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
  'piutang': { title: 'Piutang Usaha', subtitle: 'PT. Ekspansi Nutrisi Nusantara', backTo: 'dashboard' }
};

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
            <button class="btn-nav-action">
              <i data-lucide="bell"></i>
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
