import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";

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

  // --- 1. AMBIL DATA MASTER DARI SUPABASE (LOAD ON START) ---
  useEffect(() => {
    async function loadMasterData() {
      try {
        // Ambil data pelanggan
        const { data: customerData } = await supabase.from("customers").select("id, name");
        if (customerData) setCustomers(customerData);

        // Ambil data sales
        const { data: salesData } = await supabase.from("sales").select("id, name");
        if (salesData) setSalesList(salesData);

        // Ambil data produk manufaktur / stok
        const { data: productData } = await supabase.from("products").select("id, name, price, needs_production");
        if (productData) setProducts(productData);
      } catch (err) {
        console.error("Gagal memuat data master:", err.message);
      }
    }
    loadMasterData();
  }, []);

  // --- 2. LOGIC KERANJANG (CART ACTIONS) ---
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

  // --- 3. KALKULASI OTOMATIS (REAKTIF) ---
  const subtotalTotal = cart.reduce((acc, item) => acc + (item.qty * (item.price || 0)), 0);
  const grandTotal = isSample ? 0 : (subtotalTotal + shippingCost);
  const sisaKembalian = isSample ? 0 : (paymentAmount - grandTotal);
  const hasActiveProduction = cart.some(item => item.needs_production === true);

  // Filter produk berdasarkan input pencarian
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchProductQuery.toLowerCase()));

  // --- 4. FUNGSI SIMPAN KE DB (MANUFACTURING & ORDER) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return alert("Silakan pilih Customer terlebih dahulu!");
    
    setIsSubmitting(true);
    try {
      // a. Insert ke tabel Orders
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

      // b. Insert ke tabel Order Items / Produksi jika butuh manufacturing
      if (cart.length > 0) {
        const orderItems = cart.map(item => ({
          order_id: orderData.id,
          product_id: item.id,
          qty: item.qty,
          price: item.price
        }));
        
        await supabase.from("order_items").insert(orderItems);

        // Jika ada item yang perlu masuk jalur produksi pabrik
        if (hasActiveProduction) {
          const productionItems = cart
            .filter(item => item.needs_production)
            .map(item => ({
              order_id: orderData.id,
              product_id: item.id,
              qty_target: item.qty,
              status: "Queued" // Masuk antrean produksi pabrik
            }));
          await supabase.from("manufacturing_queue").insert(productionItems);
        }
      }

      alert("Order berhasil disimpan!");
      // Reset keranjang belanja setelah sukses
      setCart([]);
    } catch (error) {
      alert("Gagal menyimpan order: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="create-order-page" style={{ padding: '16px', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px' }}>Buat Order & Manufaktur Baru</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Row Info Utama */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label>Tanggal Order:</label>
            <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label>Pilih Sales:</label>
            <select value={selectedSales} onChange={(e) => setSelectedSales(e.target.value)} style={inputStyle}>
              <option value="">-- Pilih Sales --</option>
              {salesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Pilih Customer:</label>
          <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} style={inputStyle}>
            <option value="">-- Pilih Customer --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* CARI & TAMBAH PRODUK */}
        <div style={{ marginBottom: '16px', background: '#1e1e1e', padding: '12px', borderRadius: '8px' }}>
          <label> Cari Produk Manufaktur / Stok:</label>
          <input 
            type="text" 
            placeholder="Ketik nama produk..." 
            value={searchProductQuery} 
            onChange={(e) => setSearchProductQuery(e.target.value)}
            style={inputStyle}
          />
          
          {searchProductQuery && (
            <div style={{ backgroundColor: '#2a2a2a', maxHeight: '150px', overflowY: 'auto', marginTop: '4px', borderRadius: '4px' }}>
              {filteredProducts.map(p => (
                <div key={p.id} onClick={() => { addToCart(p); setSearchProductQuery(""); }} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.name} {p.needs_production && <span style={{ color: '#ffc107', fontSize: '11px' }}>(Butuh Pabrikasi)</span>}</span>
                  <strong>Rp {p.price.toLocaleString('id-ID')}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KERANJANG BELANJA (DYNAMIC CART) */}
        <div style={{ marginBottom: '16px' }}>
          <h4>Daftar Item Order:</h4>
          {cart.length === 0 ? (
            <p style={{ color: '#888', fontSize: '14px' }}>Belum ada item terpilih.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '6px', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>Rp {item.price.toLocaleString('id-ID')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} style={btnQtyStyle}>-</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} style={btnQtyStyle}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Toggle Sample */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isSample} onChange={(e) => setIsSample(e.target.checked)} />
            Jadikan Sample Order (Tanpa Biaya)
          </label>
        </div>

        {!isSample && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label>Ongkos Kirim:</label>
              <input type="number" value={shippingCost} onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)} style={inputStyle} />
            </div>
            <div>
              <label>Nominal Pembayaran:</label>
              <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)} style={inputStyle} />
            </div>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label>Catatan Tambahan:</label>
          <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} style={{ ...inputStyle, height: '60px', resize: 'none' }} />
        </div>

        {/* RINGKASAN PEMBAYARAN */}
        <div style={{ background: '#1e1e1e', padding: '14px', borderRadius: '8px', marginBottom: '20px', borderLeft: hasActiveProduction ? '4px solid #ffc107' : '4px solid #28a745' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>Subtotal: <span>Rp {subtotalTotal.toLocaleString('id-ID')}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>Ongkir: <span>Rp {isSample ? 0 : shippingCost.toLocaleString('id-ID')}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}>Grand Total: <span>Rp {grandTotal.toLocaleString('id-ID')}</span></div>
          <hr style={{ borderColor: '#333' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '13px', color: '#aaa' }}>
            Status Kas: <strong>{isSample ? "Sample (Free)" : (sisaKembalian >= 0 ? `Kembalian: Rp ${sisaKembalian.toLocaleString('id-ID')}` : `Kurang: Rp ${Math.abs(sisaKembalian).toLocaleString('id-ID')}`)}</strong>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '14px', background: hasActiveProduction ? '#ffc107' : '#007bff', color: hasActiveProduction ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          {isSubmitting ? "Memproses..." : (hasActiveProduction ? "Kirim ke Produksi & Simpan" : "Simpan Order")}
        </button>
      </form>
    </section>
  );
}

// --- STYLING HELPER (Inlined biar rapi) ---
const inputStyle = { width: '100%', padding: '10px', marginTop: '4px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', boxSizing: 'border-box' };
const btnQtyStyle = { width: '28px', height: '28px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };