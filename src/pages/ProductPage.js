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
    const chips = document.querySelectorAll(".filter-chip");
    if (!container) return;

    // 1. Ambil data terpusat dari tabel products
    const allItems = await getSupabaseInventory();

    // 2. Fungsi render data ke element HTML list
    const renderList = (filteredItems) => {
      if (filteredItems.length === 0) {
        container.innerHTML = `
          <div class="card" style="padding: 24px; text-align: center; color: var(--text-light);">
            Belum ada data untuk kategori ini.
          </div>
        `;
        return;
      }

      container.innerHTML = filteredItems.map(item => {
        // Pewarnaan badge dinamis berdasarkan cluster kopi Anda
        let badgeClass = 'badge-warning'; // Greenbean
        if (item.category === 'roastedbean') badgeClass = 'badge-success'; // Roastedbean
        if (item.category === 'kopi_bubuk') badgeClass = 'badge-primary';  // Kopi Bubuk

        return `
          <div class="card list-card">
            <div class="list-card-top">
              <div>
                <span class="badge ${badgeClass}">
                  ${item.category ? item.category.toUpperCase().replace('_', ' ') : 'UNSET'}
                </span>
              </div>
              <span class="text-xs text-light">Min. Stok: ${item.min_stock || 0} ${item.unit || 'kg'}</span>
            </div>

            <div style="display: flex; align-items: flex-start; gap: var(--space-md); padding: var(--space-xs) 0;">
              <div class="icon-box" style="width: 42px; height: 42px; background: rgba(16, 185, 129, 0.1); color: #10B981;">
                <i data-lucide="package" style="width: 18px; height: 18px;"></i>
              </div>
              
              <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
                <strong style="font-size: var(--text-sm); color: var(--text); font-weight: var(--font-bold);">
                  ${item.name}
                </strong>
                <p class="text-light text-xs">${item.description || 'Tidak ada deskripsi.'}</p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-xs);">
                  <span class="text-xs font-semibold">Stok Aktual:</span>
                  <strong style="font-size: var(--text-md); color: #10B981">${item.stock || 0} ${item.unit || 'kg'}</strong>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
    };

    // Tampilkan semua item saat pertama kali dibuka
    renderList(allItems);

    // 3. Logika Filter Pencocokan Tab UI dengan Kolom Kategori Supabase
    chips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        chips.forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");

        const filterValue = e.target.textContent.trim().toLowerCase();

        if (filterValue === "semua") {
          renderList(allItems);
        } else if (filterValue === "greenbean") {
          renderList(allItems.filter(item => item.category === "greenbean"));
        } else if (filterValue === "roasted bean") { 
          // Mengamankan kecocokan teks tombol 'Roasted Bean' (pakai spasi) ke value db 'roastedbean'
          renderList(allItems.filter(item => item.category === "roastedbean"));
        } else if (filterValue === "kopi bubuk") {
          renderList(allItems.filter(item => item.category === "kopi_bubuk"));
        }
      });
    });

  }, 50);

  return `
    <section class="list-page">
      <div class="card search-box">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Cari item master..." />
      </div>

      <div class="filter-scroll">
        <button class="filter-chip active">Semua</button>
        <button class="filter-chip">Greenbean</button>
        <button class="filter-chip">Roasted Bean</button>
        <button class="filter-chip">Kopi Bubuk</button>
      </div>

      <div class="data-list product-data-list">
        <div style="display: flex; justify-content: center; padding: 40px; color: var(--text-light);">
          <p>Memuat data portofolio kopi...</p>
        </div>
      </div>

      <button class="fab-btn" onclick="window.navigate('create-product')">
        <i data-lucide="plus"></i>
      </button>
    </section>
  `;
}
