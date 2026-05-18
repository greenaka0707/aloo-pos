import { supabase } from "../supabaseClient.js";

// Fungsi untuk menarik data dari tabel 'products' di Supabase
async function getSupabaseProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Gagal mengambil data Supabase:", error.message);
    return [];
  }
}

export function ProductPage() {
  // Jalankan penarikan data sesaat setelah HTML utama terpasang di layar
  setTimeout(async () => {
    const dataListContainer = document.querySelector(".product-data-list");
    if (!dataListContainer) return;

    const products = await getSupabaseProducts();

    // Jika data kosong
    if (products.length === 0) {
      dataListContainer.innerHTML = `
        <div class="card" style="padding: 24px; text-align: center; color: var(--text-light);">
          Belum ada data produk di database Supabase Anda.
        </div>
      `;
      return;
    }

    // Tampilkan data ke dalam susunan kartu (list-card)
    dataListContainer.innerHTML = products.map(product => `
      <div class="card list-card">
        <div class="list-card-top">
          <div>
            <span class="badge badge-primary">${product.category || 'Coffee'}</span>
          </div>
          <strong class="text-sm font-semibold" style="color: var(--text-light);">SKU: ${product.sku || 'N/A'}</strong>
        </div>

        <div style="display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-xs) 0;">
          <div class="icon-box" style="width: 44px; height: 44px; background: rgba(214, 90, 49, 0.1); color: var(--orange);">
            <i data-lucide="coffee" style="width: 20px; height: 20px;"></i>
          </div>
          
          <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
            <h3 class="font-bold" style="font-size: var(--text-md); color: var(--text);">
              ${product.name}
            </h3>
            <p class="text-light text-xs">
              ${product.description || 'Tidak ada deskripsi produk.'}
            </p>
            
            <div style="display: flex; align-items: center; gap: var(--space-sm); margin-top: 4px;">
              <span class="badge" style="background: var(--bg); color: var(--text); height: 22px;">
                Rp ${Number(product.price).toLocaleString('id-ID')} / ${product.unit || 'kg'}
              </span>
              <span class="text-light text-xs" style="display: flex; align-items: center; gap: 4px;">
                <i data-lucide="layers" style="width: 12px; height: 12px;"></i> BOM: ${product.bom_count || 0} Bahan
              </span>
            </div>
          </div>
        </div>

        <div class="list-card-footer" style="border-top: 1px solid var(--border); padding-top: var(--space-sm); margin-top: var(--space-xs);">
          <span class="text-light text-xs">Active Master</span>
          <div style="display: flex; gap: var(--space-xs);">
            <button class="btn btn-soft" style="padding: var(--space-xs) var(--space-sm); font-size: var(--text-xs);">
              BOM
            </button>
            <button class="btn btn-soft detail-btn">
              Edit
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Render ulang icon Lucide agar muncul di kartu yang baru dibuat
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, 50);

  return `
    <section class="list-page">
      <div class="card search-box">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Cari produk..." />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Coffee Blend</button>
        <button class="filter-chip">RTD Beverages</button>
      </div>

      <div class="data-list product-data-list">
        <div style="display: flex; justify-content: center; padding: 40px; color: var(--text-light);">
          <p>Memuat data master produk dari Supabase...</p>
        </div>
      </div>

      <button class="fab-btn" onclick="window.navigate('create-product')">
        <i data-lucide="plus"></i>
      </button>
    </section>
  `;
}
