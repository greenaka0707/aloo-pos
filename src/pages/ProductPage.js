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
    const searchInput = document.querySelector(".custom-search-input");
    
    // Pindahkan FAB ke root .app-layout agar tidak ikut tergulung/terpotong
    const fab = document.querySelector(".fab-btn-extended");
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
            const stockColor = isCritical ? '#ef4444' : '#6b7280'; 
            const stockIconColor = isCritical ? '#ef4444' : '#9ca3af';

            return `
              <div class="compact-product-card" style="
                display: flex; 
                align-items: center; 
                background: #ffffff; 
                border-radius: 14px; 
                padding: 12px 16px; 
                margin-bottom: 6px; /* SOLUSI PERBAIKAN 2: Jarak antar card dibuat mepet rapat */
                box-shadow: 0 1px 2px rgba(0,0,0,0.02);
                position: relative;
                width: 100%;
                box-sizing: border-box;
                border: 1px solid #f1f5f9;
              ">
                <div class="product-avatar" style="
                  width: 44px; 
                  height: 44px; 
                  background: #a5f3fc; 
                  color: #083344; 
                  border-radius: 10px; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  margin-right: 14px;
                  flex-shrink: 0;
                ">
                  <i data-lucide="box" style="width: 20px; height: 20px;"></i>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; gap: 2px; overflow: hidden;">
                  <strong style="font-size: 14px; color: #1e293b; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${item.name}
                  </strong>
                  
                  <span style="font-size: 13px; color: #0ea5e9; font-weight: 600;">
                    ${priceFormatted}
                  </span>
                  
                  <div style="display: flex; align-items: center; gap: 12px; margin-top: 1px; font-size: 11px; color: #6b7280;">
                    <span style="display: flex; align-items: center; gap: 4px; color: ${stockColor}; font-weight: ${isCritical ? '600' : '400'};">
                      <i data-lucide="archive" style="width: 12px; height: 12px; color: ${stockIconColor};"></i> 
                      Stok: ${(item.stock || 0).toFixed(1)}
                    </span>
                    <span style="display: flex; align-items: center; gap: 4px;">
                      <i data-lucide="layers" style="width: 12px; height: 12px; color: #9ca3af;"></i> 
                      ${catCode}
                    </span>
                  </div>
                </div>

                <button class="action-trigger-btn" style="
                  background: none; 
                  border: none; 
                  color: #334155; 
                  padding: 8px 0 8px 12px; 
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: bold;
                  flex-shrink: 0;
                " onclick="console.log('Menu opsional untuk produk: ${item.id}')">
                  •••
                </button>
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
    <section class="list-page-clean" style="
      width: 100vw !important; 
      max-width: 100vw !important; 
      margin-left: -20px !important; 
      margin-right: -20px !important;
      padding: 0 16px 120px 16px !important; 
      background: #f8fafc !important; 
      min-height: 100vh;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    ">
      
      <div class="sticky-search-wrapper" style="
        position: sticky;
        top: -20px; /* Tarik paksa ke atas melewati padding container bawaan aplikasi */
        margin-left: -16px; /* Lebarkan paksa ke kiri menembus padding */
        margin-right: -16px; /* Lebarkan paksa ke kanan menembus padding */
        padding: 16px 16px 12px 16px; /* Beri padding internal baru agar input tetap presisi di tengah */
        background: #f8fafc;
        z-index: 100;
        box-sizing: border-box;
      ">
        <div class="custom-search-box" style="
          background: #f1f5f9; 
          border-radius: 14px; 
          padding: 10px 14px; 
          display: flex; 
          align-items: center; 
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        ">
          <i data-lucide="search" style="color: #94a3b8; width: 18px; height: 18px;"></i>
          <input type="text" class="custom-search-input" placeholder="Cari nama atau barcode..." style="
            background: transparent; 
            border: none; 
            outline: none; 
            width: 100%; 
            font-size: 13px; 
            color: #1e293b;
          " />
        </div>
      </div>

      <div class="data-list product-data-list" style="
        width: 100%; 
        box-sizing: border-box; 
        margin-top: 0px; /* Pangkas jarak atas list agar mepet */
        display: flex;
        flex-direction: column;
      ">
        <div style="display: flex; justify-content: center; padding: 40px; color: #94a3b8; font-size: 13px;">
          <p>Memuat data master produk...</p>
        </div>
      </div>

      <button class="fab-btn-extended" 
        onclick="window.navigate('create-product')" 
        style="
          position: fixed;
          bottom: 90px;
          right: 16px;
          background: #349a9a;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          padding: 12px 20px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(52, 154, 154, 0.25);
          cursor: pointer;
          z-index: 999;
        ">
        <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
        <span>Produk Baru</span>
      </button>
    </section>
  `;
}