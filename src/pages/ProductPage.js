import { supabase } from "../supabaseClient.js";

// ==========================================================================
// 1. FUNGSI AMBIL DATA STOCK DARI SUPABASE (PRODUCTS TABLE)
// ==========================================================================
async function getSupabaseInventory() {
  try {
    const { data, error } = await supabase
      .from('products') 
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Gagal mengambil data produk:", error.message);
    return [];
  }
}

// ==========================================================================
// 2. CORE COMPONENT: PRODUCT PAGE (DEFAULT EXPORT)
// ==========================================================================
export default function ProductPage() {
  setTimeout(async () => {
    const container = document.querySelector(".product-data-list");
    const searchInput = document.querySelector(".search-box input");
    
    // Tarik FAB ke root .app-layout agar mengambang kokoh di atas bottom nav bar
    const fab = document.querySelector(".fab-btn");
    const appLayout = document.querySelector(".app-layout");
    if (fab && appLayout && fab.parentElement !== appLayout) {
      fab.style.display = "flex";
      appLayout.appendChild(fab);
    }

    if (!container) return;

    const allItems = await getSupabaseInventory();

    // ==========================================================================
    // ENGINE RENDERER DENGAN STRUKTUR CARD UNIFORM & TOMBOL PANAH DETIL
    // ==========================================================================
    const renderList = (filteredItems) => {
      container.classList.add("page-leave");

      setTimeout(() => {
        if (filteredItems.length === 0) {
          container.innerHTML = `
            <div style="padding: 32px; text-align: center; color: #94a3b8; font-size: 13px;">
              Tidak ada produk ditemukan.
            </div>
          `;
        } else {
         container.innerHTML = filteredItems.map(item => {
            let catText = 'Lainnya';
            let catBadge = 'void';
            if (item.category === 'greenbean') { catText = 'Bahan Baku'; catBadge = 'ready'; }
            if (item.category === 'roastedbean') { catText = 'Barang Jadi'; catBadge = 'diproses'; }
            if (item.category === 'kopi_bubuk') { catText = 'Kopi Bubuk'; catBadge = 'diproses'; }

            const priceFormatted = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0
            }).format(item.price || 0);

            const isCritical = (item.stock || 0) <= (item.min_stock || 0);
            let statusBadge = 'dikirim';
            let statusText = 'Aman';
            let stockStyle = 'color: #0f172a; background: rgba(15,23,42,0.06);';

            if (isCritical) {
              statusBadge = 'pending';
              statusText = 'Kritis';
              stockStyle = 'color: #b45309; background: rgba(251,191,36,0.12); font-weight: 700;';
            }

            return `
              <div class="list-card compact-product-card detail-trigger" data-id="${item.id}" style="cursor: pointer;">
                
                <div class="product-info-left">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <strong style="font-size: 15px; font-weight: 700; color: #0f172a;">${item.name}</strong>
                    <span class="modern-status ${catBadge}" style="height: 18px; padding: 0 6px; font-size: 10px; text-transform: none;">${catText}</span>
                  </div>
                  
                  <span style="font-size: 13px; font-weight: 700; color: #0ea5e9;">${priceFormatted}</span>
                  
                  <div class="product-meta-row">
                    <span class="modern-status" style="${stockStyle} height: 20px; padding: 0 8px; font-size: 11px; text-transform: none; border-radius: 6px;">
                      Stok: ${(item.stock || 0).toFixed(1)} ${item.unit || 'kg'}
                    </span>
                    <span class="modern-status ${statusBadge}" style="height: 20px; padding: 0 8px; font-size: 11px; border-radius: 6px;">${statusText}</span>
                  </div>
                </div>

                <button class="order-arrow-btn" style="width: 36px; height: 36px;">
                  <i data-lucide="arrow-up-right" style="width: 16px; height: 16px;"></i>
                </button>

              </div>
            `;
          }).join('');

        if (window.lucide) window.lucide.createIcons();

        // Pasang event listener klik satu kartu penuh mengarah ke detail modifikasi produk
        container.querySelectorAll(".detail-trigger").forEach(card => {
          card.addEventListener("click", (e) => {
            const currentTarget = e.currentTarget;
            const itemId = currentTarget.dataset.id;
            localStorage.setItem("selected_product_id", itemId);
            if (window.navigate) window.navigate("product-detail"); // Sesuaikan nama rute navigasimu gais
          });
        });

        container.classList.remove("page-leave");
        container.classList.add("page-enter");

        requestAnimationFrame(() => {
          setTimeout(() => {
            container.classList.remove("page-enter");
          }, 50);
        });

      }, 150);
    };

    renderList(allItems);

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        const filtered = allItems.filter(item => 
          item.name.toLowerCase().includes(keyword)
        );
        renderList(filtered);
      });
    }

  }, 50);

  /* ==========================================================================
     RETURN CLEAN TEMPLATE (SUDAH DISINKRONKAN DENGAN FORMULA CSS BARU)
     ========================================================================== */
  return `
    <section class="list-page">
      
      <div class="normal-search-row">
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="text" placeholder="Cari nama master produk..." />
        </div>
      </div>

      <div class="data-list product-data-list" style="margin-top: 12px;">
        <div style="display: flex; justify-content: center; padding: 40px; color: #94a3b8; font-size: 13px;">
          <p>Memuat data master produk...</p>
        </div>
      </div>

      <button class="fab-btn" onclick="window.navigate('create-product')">
        <i data-lucide="plus"></i>
      </button>

    </section>
  `;
}
