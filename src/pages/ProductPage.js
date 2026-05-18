import { supabase } from "../supabaseClient.js"; // ✔️ Diubah menjadi huruf kecil 'import'

// Fungsi untuk menarik data dari tabel 'raw_material'
async function getSupabaseStock() {
  try {
    const { data, error } = await supabase
      .from('raw_material')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Gagal mengambil data stok:", error.message);
    return [];
  }
}

// Disarankan menggunakan default export jika komponen ini dipanggil secara dinamis oleh router
export default function StockPage() {
  // Jalankan penarikan data setelah komponen terpasang di DOM
  setTimeout(async () => {
    const stockContainer = document.querySelector(".stock-data-list");
    if (!stockContainer) return;

    const materials = await getSupabaseStock();

    if (materials.length === 0) {
      stockContainer.innerHTML = `
        <div class="card" style="padding: 24px; text-align: center; color: var(--text-light);">
          Belum ada data bahan baku di database Supabase.
        </div>
      `;
      return;
    }

    // Render list bahan baku dari Supabase
    stockContainer.innerHTML = materials.map(mat => `
      <div class="card list-card">
        <div class="list-card-top">
          <div>
            <span class="badge badge-success">Gudang Utama</span>
          </div>
          <span class="text-xs text-light">Min. Stok: ${mat.min_stock} ${mat.unit}</span>
        </div>

        <div style="display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-xs) 0;">
          <div class="icon-box" style="width: 42px; height: 42px; background: rgba(16, 185, 129, 0.1); color: #10B981;">
            <i data-lucide="package" style="width: 18px; height: 18px;"></i>
          </div>
          
          <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
            <strong style="font-size: var(--text-sm); color: var(--text); font-weight: var(--font-bold);">
              ${mat.name}
            </strong>
            <p class="text-light text-xs">
              ${mat.description || 'Tidak ada deskripsi.'}
            </p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-xs);">
              <span class="text-xs font-semibold" style="color: ${mat.stock <= mat.min_stock ? '#EF4444' : 'var(--text-light)'}">
                Stok Saat Ini:
              </span>
              <strong style="font-size: var(--text-md); color: ${mat.stock <= mat.min_stock ? '#EF4444' : '#10B981'}">
                ${mat.stock} ${mat.unit}
              </strong>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Render ulang icon Lucide
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, 50);

  return `
    <section class="list-page">
      <div class="card search-box">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Cari bahan baku..." />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Bahan Baku</button>
        <button class="filter-chip">Kemasan</button>
      </div>

      <div class="data-list stock-data-list">
        <div style="display: flex; justify-content: center; padding: 40px; color: var(--text-light);">
          <p>Memuat data stok dari Supabase...</p>
        </div>
      </div>

      <button class="fab-btn" onclick="window.navigate('create-stock')">
        <i data-lucide="plus"></i>
      </button>
    </section>
  `;
}
