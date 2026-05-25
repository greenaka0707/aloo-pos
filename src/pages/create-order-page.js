import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";

// Fungsi pembantu global untuk me-render UI secara manual ke dalam DOM Vanilla
function RenderReactForm({ 
  customers, salesList, products, selectedCustomer, setSelectedCustomer,
  selectedSales, setSelectedSales, searchProductQuery, setSearchProductQuery,
  cart, addToCart, updateQty, isSample, setIsSample, shippingCost, setShippingCost,
  paymentAmount, setPaymentAmount, catatan, setCatatan, orderDate, setOrderDate,
  isSubmitting, handleSubmit, subtotalTotal, grandTotal, sisaKembalian, hasActiveProduction, filteredProducts
}) {
  
  // Karena struktur lama aplikasimu membaca string, kita rakit HTML-nya secara dinamis di sini
  // agar performanya tetap reaktif menyerupai state bawaan React.
  const targetContainer = document.getElementById("react-form-root");
  if (!targetContainer) return;

  targetContainer.innerHTML = `
    <h2 style="margin-bottom: 20px; font-size: 20px; font-weight: bold;">Buat Order & Manufaktur Baru</h2>
    
    <form id="main-order-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label style="font-size: 14px; color: #aaa;">Tanggal Order:</label>
          <input type="date" id="form-order-date" value="${orderDate}" style="width: 100%; padding: 10px; margin-top: 4px; background-color: #222; color: #fff; border: 1px solid #444; border-radius: 4px; box-sizing: border-box;" />
        </div>
        <div>
          <label style="font-size: 14px; color: #aaa;">Pilih Sales:</label>
          <select id="form-sales" style="width: 100%; padding: 10px; margin-top: 4px; background-color: #222; color: #fff; border: 1px solid #444; border-radius: 4px; box-sizing: border-box;">
            <option value="">-- Pilih Sales --</option>
            ${salesList.map(s => `<option value="${s.id}" ${selectedSales === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <label style="font-size: 14px; color: #aaa;">Pilih Customer:</label>
        <select id="form-customer" style="width: 100%; padding: 10px; margin-top: 4px; background-color: #222; color: #fff; border: 1px solid #444; border-radius: 4px; box-sizing: border-box;">
          <option value="">-- Pilih Customer --</option>
          ${customers.map(c => `<option value="${c.id}" ${selectedCustomer === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>

      <div style="margin-bottom: 16px; background: #1e1e1e; padding: 12px; border-radius: 8px;">
        <label style="font-size: 14px; color: #aaa;">Cari Produk Manufaktur / Stok:</label>
        <input type="text" id="form-search-product" placeholder="Ketik nama produk..." value="${searchProductQuery}" style="width: 100%; padding: 10px; margin-top: 4px; background-color: #222; color: #fff; border: 1px solid #444; border-radius: 4px; box-sizing: border-box;" />
        
        ${searchProductQuery ? `
          <div style="background-color: #2a2a2a; max-height: 150px; overflow-y: auto; margin-top: 4px; border-radius: 4px;">
            ${filteredProducts.map(p => `
              <div class="search-item-row" data-id="${p.id}" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #333; display: flex; justify-content: space-between;">
                <span>${p.name} ${p.needs_production ? '<span style="color: #ffc107; font-size: 11px;">(Butuh Pabrikasi)</span>' : ''}</span>
                <strong>Rp ${p.price.toLocaleString('id-ID')}</strong>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 16px; margin-bottom: 8px;">Daftar Item Order:</h4>
        ${cart.length === 0 ? `
          <p style="color: #888; font-size: 14px;">Belum ada item terpilih.</p>
        ` : cart.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; background-color: #1e1e1e; padding: 10px; border-radius: 6px; margin-bottom: 6px;">
              <div>
                <div style="font-size: 14px; font-weight: bold;">${item.name}</div>
                <div style="font-size: 12px; color: #aaa;">Rp ${item.price.toLocaleString('id-ID')}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button type="button" class="btn-cart-minus" data-id="${item.id}" style="width: 28px; height: 28px; background-color: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                <span>${item.qty}</span>
                <button type="button" class="btn-cart-plus" data-id="${item.id}" style="width: 28px; height: 28px; background-color: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
              </div>
            </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 12px;">
        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" id="form-is-sample" ${isSample ? 'checked' : ''} />
          Jadikan Sample Order (Tanpa Biaya)
        </label>
      </div>

      ${!isSample ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div>
            <label style="font-size: 14px; color: #aaa;">Ongkos Kirim:</label>
            <input type="number" id="form-shipping" value="${shippingCost}" style="width: 100%; padding: 10px; margin-top: 4px; background-color: #222; color: #fff; border: 1px solid #444; border-radius: 4px; box-sizing: border-box;" />
          </div>
          <div>
            <label style="font-size: 14px; color: #aaa;">Nominal Pembayaran:</label>
            <input type="number" id="form-payment" value="${paymentAmount}" style="width: 100%; padding: 10px; margin-top: 4px; background-color: #222; color: #fff; border: 1px solid #444; border-radius: 4px; box-sizing: border-box;" />
          </div>
        </div>
      ` : ''}

      <div style="margin-bottom: 16px;">
        <label style="font-size: 14px; color: #aaa;">Catatan Tambahan:</label>
        <textarea id="form-catatan" style="width: 100%; padding: 10px; margin-top: 4px; background-color: #222; color: #fff; border: 1px solid #444; border-radius: 4px; box-sizing: border-box; height: 60px; resize: none;">${catatan}</textarea>
      </div>

      <div style="background: #1e1e1e; padding: 14px; border-radius: 8px; margin-bottom: 20px; border-left: ${hasActiveProduction ? '4px solid #ffc107' : '4px solid #28a745'}">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">Subtotal: <span>Rp ${subtotalTotal.toLocaleString('id-ID')}</span></div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">Ongkir: <span>Rp ${isSample ? 0 : shippingCost.toLocaleString('id-ID')}</span></div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold;">Grand Total: <span>Rp ${grandTotal.toLocaleString('id-ID')}</span></div>
        <hr style="border-color: #333;" />
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 13px; color: #aaa;">
          Status Kas: <strong>${isSample ? "Sample (Free)" : (sisaKembalian >= 0 ? `Kembalian: Rp ${sisaKembalian.toLocaleString('id-ID')}` : `Kurang: Rp ${Math.abs(sisaKembalian).toLocaleString('id-ID')}`)}</strong>
        </div>
      </div>

      <button type="submit" ${isSubmitting ? 'disabled' : ''} style="width: 100%; padding: 14px; background: ${hasActiveProduction ? '#ffc107' : '#007bff'}; color: ${hasActiveProduction ? '#000' : '#fff'}; border: none; border-radius: 6px; font-weight: bold; font-size: 16px; cursor: pointer;">
        ${isSubmitting ? "Memproses..." : (hasActiveProduction ? "Kirim ke Produksi & Simpan" : "Simpan Order")}
      </button>
    </form>
  `;

  // --- ATTACH EVENT LISTENERS MANUAL UNTUK METODE HYBRID ---
  document.getElementById("main-order-form")?.addEventListener("submit", handleSubmit);
  document.getElementById("form-order-date")?.addEventListener("change", (e) => setOrderDate(e.target.value));
  document.getElementById("form-sales")?.addEventListener("change", (e) => setSelectedSales(e.target.value));
  document.getElementById("form-customer")?.addEventListener("change", (e) => setSelectedCustomer(e.target.value));
  
  const searchInput = document.getElementById("form-search-product");
  searchInput?.addEventListener("input", (e) => setSearchProductQuery(e.target.value));
  if (searchProductQuery) {
    searchInput.focus();
    searchInput.setSelectionRange(searchProductQuery.length, searchProductQuery.length);
  }

  document.querySelectorAll(".search-item-row").forEach(row => {
    row.addEventListener("click", () => {
      const pId = row.getAttribute("data-id");
      const matchedProd = products.find(p => p.id === pId);
      if (matchedProd) {
        addToCart(matchedProd);
        setSearchProductQuery("");
      }
    });
  });

  document.querySelectorAll(".btn-cart-minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const currentItem = cart.find(item => item.id === id);
      if (currentItem) updateQty(id, currentItem.qty - 1);
    });
  });

  document.querySelectorAll(".btn-cart-plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const currentItem = cart.find(item => item.id === id);
      if (currentItem) updateQty(id, currentItem.qty + 1);
    });
  });

  document.getElementById("form-is-sample")?.addEventListener("change", (e) => setIsSample(e.target.checked));
  document.getElementById("form-shipping")?.addEventListener("input", (e) => setShippingCost(parseFloat(e.target.value) || 0));
  document.getElementById("form-payment")?.addEventListener("input", (e) => setPaymentAmount(parseFloat(e.target.value) || 0));
  document.getElementById("form-catatan")?.addEventListener("input", (e) => setCatatan(e.target.value));
}

export function CreateOrderPage() {
  // --- STATE MANAGEMENT ---
  const [customers, setCustomers] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSales, setSelectedSales] = useState("");
  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [cart, setCart] = useState([]);
  
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [catatan, setCatatan] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSample, setIsSample] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. AMBIL DATA MASTER DARI SUPABASE ---
  useEffect(() => {
    async function loadMasterData() {
      try {
        const { data: customerData } = await supabase.from("customers").select("id, name");
        if (customerData) setCustomers(customerData);

        const { data: salesData } = await supabase.from("sales").select("id, name");
        if (salesData) setSalesList(salesData);

        const { data: productData } = await supabase.from("products").select("id, name, price, needs_production");
        if (productData) setProducts(productData);
      } catch (err) {
        console.error("Gagal memuat data master:", err.message);
      }
    }
    loadMasterData();
  }, []);

  // --- 2. LOGIC ACTIONS ---
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, qty: 1, needs_production: product.needs_production }]);
    }
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, qty: newQty } : item));
    }
  };

  const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * (item.price || 0)), 0);
  const grandTotal = isSample ? 0 : (subtotalTotal + shippingCost);
  const sisaKembalian = isSample ? 0 : (paymentAmount - grandTotal);
  const hasActiveProduction = cart.some(item => item.needs_production === true);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchProductQuery.toLowerCase()));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return alert("Silakan pilih Customer terlebih dahulu!");
    
    setIsSubmitting(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_id: selectedCustomer,
          sales_id: selectedSales,
          order_date: orderDate,
          subtotal: subtotalTotal,
          shipping_cost: isSample ? 0 : shippingCost,
          grand_total: grandTotal,
          notes: catatan,
          is_sample: isSample,
          status: hasActiveProduction ? "Pending Production" : "Completed"
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      if (cart.length > 0) {
        const orderItems = cart.map(item => ({
          order_id: orderData.id,
          product_id: item.id,
          qty: item.qty,
          price: item.price
        }));
        await supabase.from("order_items").insert(orderItems);

        if (hasActiveProduction) {
          const productionItems = cart
            .filter(item => item.needs_production)
            .map(item => ({
              order_id: orderData.id,
              product_id: item.id,
              qty_target: item.qty,
              status: "Queued"
            }));
          await supabase.from("manufacturing_queue").insert(productionItems);
        }
      }

      alert("Order berhasil disimpan!");
      setCart([]);
    } catch (error) {
      alert("Gagal menyimpan order: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. TRIGGER RE-RENDER MANUAL SETIAP STATE BERUBAH ---
  useEffect(() => {
    RenderReactForm({
      customers, salesList, products, selectedCustomer, setSelectedCustomer,
      selectedSales, setSelectedSales, searchProductQuery, setSearchProductQuery,
      cart, addToCart, updateQty, isSample, setIsSample, shippingCost, setShippingCost,
      paymentAmount, setPaymentAmount, catatan, setCatatan, orderDate, setOrderDate,
      isSubmitting, handleSubmit, subtotalTotal, grandTotal, sisaKembalian, hasActiveProduction, filteredProducts
    });
  }, [customers, salesList, products, selectedCustomer, selectedSales, searchProductQuery, cart, isSample, shippingCost, paymentAmount, catatan, orderDate, isSubmitting]);

  // Kembalikan kontainer kosong bertipe string murni agar router vanilla-mu tidak blank
  return `
    <section class="create-order-page" id="react-form-root" style="padding: 16px; color: #fff; min-height: 100vh;">
      <p style="color: #888;">Memuat formulir order manufaktur...</p>
    </section>
  `;
}