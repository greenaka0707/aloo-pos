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
    
    // ==========================================================================
    // FIX KUNCI STICKY: Pindahkan FAB Baru ke komponen root .app-layout
    // ==========================================================================
    const fab = document.querySelector(".fab-btn-extended");
    const appLayout = document.querySelector(".app-layout");
    if (fab && appLayout && fab.parentElement !== appLayout) {
      appLayout.appendChild(fab);
    }

    if (!container) return;

    // 1. Ambil data terpusat dari tabel products
    const allItems = await getSupabaseInventory();
    let currentItems = [...allItems];

    // ==========================================================================
    // RENDER UTAMA: Dibuat compact & tipis persis sesuai gambar referensi
    // ==========================================================================
    const renderList = (filteredItems) => {
      container.classList.add("page-leave");

      setTimeout(() => {
        if (filteredItems.length === 0) {
          container.innerHTML = `
            <div style="padding: 32px; text-align: center; color: #9ca3af; font-size: 13px;">
              Tidak ada produk ditemukan.
            </div>
          `;
        } else {
          container.innerHTML = filteredItems.map(item => {
            // Logika singkatan kategori untuk info tag kanan
            let catCode = 'UNSET';
            if (item.category === 'greenbean') catCode = 'GB';
            if (item.category === 'roastedbean') catCode = 'RB';
            if (item.category === 'kopi_bubuk') catCode = 'KB';

            // Logika format rupiah (asumsi ada kolom price di Supabase, default ke 0 jika kosong)
            const priceFormatted = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0
            }).format(item.price || 0);

            // Logika warna stok kritis/habis (Merah jika <= 0 atau <= min_stock)
            const isCritical = (item.stock || 0) <= (item.min_stock || 0);
            const stockColor = isCritical ? '#ef4444' : '#6b7280'; 
            const stockIconColor = isCritical ? '#ef4444' : '#9ca3af';

            return `
              <div class="compact-product-card" style="
                display: flex; 
                align-items: center; 
                background: #ffffff; 
                border: 1px solid #f3f4f6; 
                border-radius: 16px; 
                padding: 12px; 
                margin-bottom: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                position: relative;
              ">
                <div class="product-avatar" style="
                  width: 46px; 
                  height: 46px; 
                  background: #e0f2fe; 
                  color: #0369a1; 
                  border-radius: 10px; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  margin-right: 12px;
                  flex-shrink: 0;
                ">
                  <i data-lucide="box" style="width: 20px; height: 20px;"></i>
                </div>

                <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
                  <strong style="font-size: 14px; color: #1f2937; font-weight: 600;">
                    ${item.name}
                  </strong>
                  
                  <span style="font-size: 13px; color: #0ea5e9; font-weight: 600;">
                    ${priceFormatted}
                  </span>
                  
                  <div style="display: flex; align-items: center; gap: 12px; margin-top: 2px; font-size: 11px; color: #6b7280;">
                    <span style="display: flex; align-items: center; gap: 4px; color: ${stockColor}; font-weight: ${isCritical ? '600' : 'normal'};">
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
                  color: #1f2937; 
                  padding: 8px; 
                  cursor: pointer;
                  font-size: 16px;
                  font-weight: bold;
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

    // Tampilkan data awal
    renderList(allItems);

    // ==========================================================================
    // LOGIKA SEARCHING (Langsung Aktif Berdasarkan Nama Produk)
    // ==========================================================================
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        const filtered = allItems.filter(item => 
          item.name.toLowerCase().includes(keyword) || 
          (item.description && item.description.toLowerCase().includes(keyword))
        );
        renderList(filtered);
      });
    }

  }, 50);

  return `
    <section class="list-page" style="padding: 16px; background: #f9fafb; min-height: 100vh;">
      
      <div class="card search-box" style="
        background: #f3f4f6; 
        border-radius: 14px; 
        padding: 10px 14px; 
        display: flex; 
        align-items: center; 
        gap: 10px;
        margin-bottom: 20px;
        border: none;
      ">
        <i data-lucide="search" style="color: #9ca3af; width: 18px; height: 18px;"></i>
        <input type="text" placeholder="Cari nama atau barcode..." style="
          background: transparent; 
          border: none; 
          outline: none; 
          width: 100%; 
          font-size: 13px; 
          color: #1f2937;
        " />
      </div>

      <div class="data-list product-data-list">
        <div style="display: flex; justify-content: center; padding: 40px; color: #9ca3af; font-size: 13px;">
          <p>Memuat data master produk...</p>
        </div>
      </div>

      <button class="fab-btn-extended" 
        onclick="window.navigate('create-product')" 
        style="
          position: fixed;
          bottom: 80px;
          right: 20px;
          background: #2ea3a3;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          padding: 12px 20px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(46, 163, 163, 0.3);
          cursor: pointer;
          z-index: 999;
        ">
        <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
        <span>Produk Baru</span>
      </button>
    </section>
  `;
}