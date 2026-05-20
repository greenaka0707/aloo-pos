import { supabase } from "../supabaseClient.js";

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

export default function ProductPage() {
  setTimeout(async () => {
    const container = document.querySelector(".product-data-list");
    const searchInput = document.querySelector(".search-box input");
    
    // Tarik FAB ke root .app-layout agar mengambang kokoh di atas bottom nav bar
    const fab = document.querySelector(".fab-btn");
    const appLayout = document.querySelector(".app-layout");
    if (fab && appLayout && fab.parentElement !== appLayout) {
      appLayout.appendChild(fab);
    }

    if (!container) return;

    const allItems = await getSupabaseInventory();

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
            let catCode = 'UNSET';
            if (item.category === 'greenbean') catCode = 'GB';
            if (item.category === 'roastedbean') catCode = 'RB';
            if (item.category === 'kopi_bubuk') catCode = 'KB';

            const priceFormatted = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0
            }).format(item.price || 0);

            const isCritical = (item.stock || 0) <= (item.min_stock || 0);
            const stockClass = isCritical ? 'meta-item stock-critical' : 'meta-item';

            return `
              <div class="list-card">
                <div class="product-card-body">
                  
                  <div class="product-avatar">
                    <i data-lucide="box"></i>
                  </div>

                  <div class="product-details">
                    <strong class="product-title">${item.name}</strong>
                    <span class="product-price">${priceFormatted}</span>
                    
                    <div class="product-meta">
                      <span class="${stockClass}">
                        <i data-lucide="archive"></i> 
                        Stok: ${(item.stock || 0).toFixed(1)}
                      </span>
                      <span class="meta-item">
                        <i data-lucide="layers"></i> 
                        ${catCode}
                      </span>
                    </div>
                  </div>

                  <button class="action-trigger-btn" onclick="console.log('Menu produk ID: ${item.id}')">
                    •••
                  </button>

                </div>
              </div>
            `;
          }).join('');
        }

        if (window.lucide) window.lucide.createIcons();

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

  return `
    <section class="list-page">
      
      <div class="search-box">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Cari nama atau barcode..." />
      </div>

      <div class="data-list product-data-list">
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