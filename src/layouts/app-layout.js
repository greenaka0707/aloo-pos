import { BottomNav } from "../components/bottom-nav.js";

// Objek Pemetaan Judul, Subjudul, dan Aturan Tombol Back berdasarkan Route ID
const navbarMeta = {
  'dashboard': { title: 'Dashboard', subtitle: 'Manufacturing overview', showBack: false },
  'order': { title: 'Sales Order', subtitle: 'Manufacturing sales workflow', showBack: false },
  'create-order': { title: 'Create Order', subtitle: 'Sales order manufacturing', showBack: true, backTo: 'order' },
  'pembelian': { title: 'Pembelian', subtitle: 'Supplier purchasing workflow', showBack: false },
  'create-purchase': { title: 'Create Purchase', subtitle: 'Supplier purchasing workflow', showBack: true, backTo: 'pembelian' },
  'produksi': { title: 'Produksi', subtitle: 'Manufacturing production workflow', showBack: false },
  'stok': { title: 'Stock', subtitle: 'Inventory management', showBack: false },
  'stock-detail': { title: 'Stock Detail', subtitle: 'Inventory item tracking', showBack: true, backTo: 'stok' }
};

export function AppLayout({ content, route }) {
  // Ambil meta data berdasarkan route saat ini, jika tidak terdaftar pakai fallback default
  const meta = navbarMeta[route] || { title: 'ERP POS', subtitle: 'PT Prabhaskoe', showBack: false };

  // Buat HTML Tombol Back bulat jika nilai showBack bernilai true
  const backButtonHtml = meta.showBack 
    ? `<button class="btn-back" onclick="window.navigate('${meta.backTo}')">
         <i data-lucide="arrow-left"></i>
       </button>`
    : '';

  return `
    <div class="app-layout">

      <div class="page-navbar">
        <div class="navbar-container">
          ${backButtonHtml}
          <div class="navbar-title-wrapper">
            <h2 class="navbar-title">${meta.title}</h2>
            <p class="navbar-subtitle">${meta.subtitle}</p>
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
