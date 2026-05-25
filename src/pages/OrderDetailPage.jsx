// ==========================================================================
// FILE: src/pages/OrderDetailPage.jsx (MURNI REACT VERSION - DEEP OPTIMIZED)
// ==========================================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { 
  User, 
  Package, 
  Factory, 
  Clock3, 
  Printer, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  Play, 
  Lock, 
  Truck, 
  CheckSquare,
  Ban,
  Loader2
} from "lucide-react";

export default function OrderDetailPage() {
  const navigate = useNavigate();
  
  // Ambil ID Order dari localStorage dengan validasi aman gais
  const orderId = Number(localStorage.getItem("selected_order_id"));

  // ==========================================================================
  // STATE MANAGEMENT DETAIL NOTA GAIS
  // ==========================================================================
  const [orderData, setOrderData] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [dbBomItems, setDbBomItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================================
  // EFFECT CONTROLLER: FETCH MULTIPLE JOIN TABLES REALTIME
  // ==========================================================================
  useEffect(() => {
    if (!orderId || isNaN(orderId)) {
      setErrorMessage("ID Order tidak valid.");
      setIsLoading(false);
      return;
    }

    async function fetchOrderDetail() {
      try {
        setIsLoading(true);
        
        // 1. Ambil Data Utama Nota & Profil Customer
        const { data: order, error } = await supabase
          .from("sales_orders")
          .select(`
            id,
            invoice_no,
            order_date,
            status,
            total_amount,
            customers ( name, phone, address ),
            salesmen ( name )
          `)
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrderData(order);

        // 2. Tarik Item Barang Belanjaan & Cek Timbangan Gudang
        const { data: items, error: itemsError } = await supabase
          .from("sales_order_items")
          .select(`
            id,
            qty,
            unit_price,
            products ( id, name, stock, unit, category )
          `)
          .eq("sales_order_id", orderId);

        if (itemsError) throw itemsError;
        setOrderItems(items || []);

        // 3. Ambil Bahan Baku Manufaktur (BOM) Jika Ada Antrean Produksi
        const { data: prodData, error: prodErr } = await supabase
          .from("productions")
          .select("id")
          .eq("sales_order_id", orderId)
          .limit(1);

        if (!prodErr && prodData && prodData.length > 0) {
          const { data: ingData, error: ingErr } = await supabase
            .from("production_ingredients")
            .select(`
              qty_used,
              products ( name, unit )
            `)
            .eq("production_id", prodData[0].id);

          if (!ingErr && ingData) {
            setDbBomItems(ingData);
          }
        }
      } catch (err) {
        setErrorMessage(`❌ Gagal muat detail nota: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderDetail();
  }, [orderId]);

  if (!orderId || isNaN(orderId) || errorMessage) {
    return (
      <section className="detail-page p-8 text-center space-y-3">
        <h3 className="text-sm font-bold text-red-500">{errorMessage || "ID Order tidak valid"}</h3>
        <button type="button" onClick={() => navigate("/sales")} className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl">
          Kembali ke List Order
        </button>
      </section>
    );
  }

  if (isLoading || !orderData) {
    return (
      <section className="detail-page p-8 text-center text-xs text-zinc-400">
        Memuat detail nota dari Supabase...
      </section>
    );
  }

  // Definisikan status database saat ini gais
  const currentDbStatus = orderData.status ? orderData.status.toLowerCase() : "pending";

  // Cek kesiapan stok gudang untuk tombol akselerasi rute
  const isAllStockReady = orderItems.every((item) => {
    const p = item.products || {};
    return item.qty <= (p.stock || 0);
  });

  // ==========================================================================
  // HANDLER 1: DOWNLOAD INVOICE CETAK A5 (HTML2PDF)
  // ==========================================================================
  const downloadInvoiceA5 = () => {
    const cust = orderData.customers || {};
    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.width = "540px";  
    element.style.boxSizing = "border-box";
    element.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
    element.style.color = "#1F2937";
    element.style.backgroundColor = "#FFFFFF";

    element.innerHTML = `
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
        <tr>
          <td style="vertical-align:top;">
            <h1 style="margin:0; font-size:20px; color:#111827; font-weight:800; line-height:1.1; letter-spacing:-0.5px;">ENNA</h1>
            <div style="font-size:11px; font-weight:700; color:#F97316; margin-top:2px;">PT. Ekspansi Nutrisi Nusantara</div>
            <div style="font-size:9px; color:#6B7280; margin-top:1px;">Pucang Anom Timur IV 26A Surabaya</div>
          </td>
          <td style="text-align:right; vertical-align:top;">
            <h2 style="margin:0; font-size:12px; color:#1F2937; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Sales Invoice</h2>
            <div style="font-size:10px; font-weight:600; color:#4B5563; margin-top:2px;">${orderData.invoice_no}</div>
          </td>
        </tr>
      </table>
      <div style="border-top:1px solid #E5E7EB; margin-bottom:15px;"></div>
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:10px; line-height:1.4;">
        <tr>
          <td style="width:50%; vertical-align:top; padding-right:10px;">
            <span style="color:#9CA3AF; display:block; text-transform:uppercase; font-size:8px; font-weight:700; margin-bottom:4px; letter-spacing:0.3px;">Tujuan Pengiriman:</span>
            <strong style="font-size:11px; color:#111827; display:block; margin-bottom:2px;">${cust.name || "Tanpa Nama"}</strong>
            <span style="display:block; color:#4B5563; max-width:220px; white-space:pre-wrap;">${cust.address || "-"}</span>
            <span style="display:block; color:#4B5563; margin-top:2px;">Telp: ${cust.phone || "-"}</span>
          </td>
          <td style="width:50%; text-align:right; vertical-align:top;">
            <span style="color:#9CA3AF; display:block; text-transform:uppercase; font-size:8px; font-weight:700; margin-bottom:4px; letter-spacing:0.3px;">Detail Nota:</span>
            <table style="border-collapse:collapse; margin-left:auto; font-size:10px;">
              <tr><td style="text-align:right; color:#6B7280; padding:1px 4px;">Tanggal:</td><td style="text-align:left; font-weight:600; padding:1px 4px;">${orderData.order_date}</td></tr>
              <tr><td style="text-align:right; color:#6B7280; padding:1px 4px;">Salesman:</td><td style="text-align:left; font-weight:600; padding:1px 4px;">${orderData.salesmen?.name || "-"}</td></tr>
              <tr><td style="text-align:right; color:#6B7280; padding:1px 4px;">Status:</td><td style="text-align:left; font-weight:700; color:#F97316; padding:1px 4px;">${orderData.status?.toUpperCase()}</td></tr>
            </table>
          </td>
        </tr>
      </table>
      <table style="width:100%; border-collapse:collapse; font-size:10px; margin-bottom:15px;">
        <thead>
          <tr style="background-color:#F9FAFB; border-top:1px solid #E5E7EB; border-bottom:1px solid #E5E7EB;">
            <th style="text-align:left; padding:6px 8px; color:#4B5563; font-weight:700;">Nama Item Produk Kopi</th>
            <th style="text-align:center; padding:6px 8px; color:#4B5563; font-weight:700; width:50px;">Qty</th>
            <th style="text-align:right; padding:6px 8px; color:#4B5563; font-weight:700; width:90px;">Harga</th>
            <th style="text-align:right; padding:6px 8px; color:#4B5563; font-weight:700; width:100px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems.map(item => {
            const p = item.products || {};
            return `
              <tr style="border-bottom:1px solid #F3F4F6;">
                <td style="padding:8px 8px; font-weight:600; color:#111827;">${p.name || "Item"}</td>
                <td style="text-align:center; padding:8px 8px; color:#4B5563;">${item.qty} ${p.unit || "kg"}</td>
                <td style="text-align:right; padding:8px 8px; color:#4B5563;">Rp ${(item.unit_price || 0).toLocaleString("id-ID")}</td>
                <td style="text-align:right; padding:8px 8px; font-weight:700; color:#111827;">Rp ${(item.qty * item.unit_price).toLocaleString("id-ID")}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:11px;">
        <tr>
          <td></td>
          <td style="width:220px; text-align:right; padding:4px 8px; border-top:1px solid #E5E7EB;">
            <span style="color:#4B5563; font-weight:600; margin-right:15px;">Total Netto:</span>
            <strong style="color:#111827; font-size:12px;">Rp ${(orderData.total_amount || 0).toLocaleString("id-ID")}</strong>
          </td>
        </tr>
      </table>
      <div style="background-color:#F9FAFB; border:1px solid #E5E7EB; border-radius:4px; padding:10px; font-size:10px; line-height:1.4;">
        <strong style="color:#111827; font-size:10px; text-transform:uppercase; display:block; margin-bottom:4px; border-bottom:1px dashed #E5E7EB; padding-bottom:3px; letter-spacing:0.3px;">Konfirmasi Pembayaran</strong>
        <div style="color:#4B5563; margin-bottom:4px;">Silahkan Melakukan Pembayaran Ke:</div>
        <table style="border-collapse:collapse; font-size:10px; color:#111827;">
          <tr><td style="color:#4B5563; padding:1px 0; width:50px;">Bank:</td><td style="font-weight:700; padding:1px 4px;">MANDIRI</td></tr>
          <tr><td style="color:#4B5563; padding:1px 0;">An:</td><td style="font-weight:700; padding:1px 4px;">PT. EKSPANSI NUTRISI NUSANTARA</td></tr>
          <tr><td style="color:#4B5563; padding:1px 0;">No. Rek:</td><td style="font-weight:700; color:#F97316; padding:1px 4px; letter-spacing:0.3px;">1420000699008</td></tr>
        </table>
        <div style="color:#6B7280; font-style:italic; margin-top:5px; font-size:9px;">* Mohon konfirmasi jika sudah melakukan pembayaran</div>
      </div>
    `;

    const opt = {
      margin:       0,
      filename:     `Invoice_${orderData.invoice_no}.pdf`,
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: "mm", format: "a5", orientation: "portrait" }
    };
    window.html2pdf().set(opt).from(element).save();
  };

  // ==========================================================================
  // HANDLER 2: EXECUTE VOID NOTA ATAU SERAH TERIMA FISIK RETUR
  // ==========================================================================
  const handleVoidOrRetur = async () => {
    const isAlreadyShipped = (currentDbStatus === "dikirim");
    
    let confirmationText = `⚠️ KONFIRMASI VOID NOTA!\n\nApakah lo yakin ingin membatalkan transaksi ${orderData.invoice_no}?\n\nStatus nota akan diubah menjadi VOID. Stok kopi matang aman tidak mengalami pergerakan gais.`;
    if (isAlreadyShipped) {
      confirmationText = `⚠️ KONFIRMASI SERAH TERIMA RETUR!\n\nApakah lo yakin ingin memproses retur barang dari nota ${orderData.invoice_no} ke rak gudang?`;
    }

    if (!confirm(confirmationText)) return;

    try {
      setIsActionLoading(true);

      if (isAlreadyShipped) {
        for (const item of orderItems) {
          const p = item.products || {};
          const maxQty = parseFloat(item.qty || 0);
          const pName = p.name || "Kopi Matang";

          let inputQty = prompt(
            `📥 INPUT FISIK RETUR GUDANG\n\nProduk: ${pName}\nKuantitas di Nota Asal: ${maxQty} kg\n\nMasukkan total berat (kg) yang beneran sukses balik masuk rak:`, 
            maxQty
          );

          if (inputQty === null) {
            alert("❌ Void retur dibatalkan oleh user.");
            window.location.reload();
            return;
          }

          let returnedQty = parseFloat(inputQty);
          if (isNaN(returnedQty) || returnedQty < 0 || returnedQty > maxQty) {
            alert(`⚠️ INPUT DATA INVALID GAIS!\nJumlah retur produk ${pName} wajib angka positif dan tidak boleh melebihi ${maxQty} kg!`);
            window.location.reload();
            return;
          }

          if (returnedQty > 0) {
            const currentStock = parseFloat(p.stock) || 0;
            const restoredStock = currentStock + returnedQty;

            await supabase.from("products").update({ stock: restoredStock }).eq("id", p.id);

            await supabase.from("stock_mutations").insert([{
              product_id: p.id,
              type: "in",
              qty: returnedQty,
              reference_no: orderData.invoice_no,
              description: `🔄 RETUR PRODUK JADI (VOID): Sukses serah terima fisik sebanyak ${returnedQty} kg dari nota ${orderData.invoice_no}`
            }]);
          }
        }
      }

      // Otomatis batalkan antrean lini produksi pabrik gais
      await supabase.from("productions").update({ status: "void" }).eq("sales_order_id", orderId);

      // Ubah status nota penjualan utama menjadi VOID permanen
      const { error: voidErr } = await supabase.from("sales_orders").update({ status: "void" }).eq("id", orderId);
      if (voidErr) throw voidErr;

      alert(`🎉 Sukses! Status Nota ${orderData.invoice_no} resmi diubah menjadi VOID.${isAlreadyShipped ? " Kuantitas retur rill berhasil tercatat masuk kembali ke rak gudang!" : " Stok produk aman tidak mengalami pergerakan."}`);
      window.location.reload();

    } catch (err) {
      alert("❌ Gagal merubah status void retur: " + err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // ==========================================================================
  // HANDLER 3: OPERASIONAL ACCELERATION (NAIK TAHAP OPERASIONAL)
  // ==========================================================================
  const handleNextStatus = async () => {
    let nextStatus = "diproses";
    if (currentDbStatus === "pending" || currentDbStatus === "butuh produksi") {
      nextStatus = isAllStockReady ? "ready" : "diproses";
    }
    if (currentDbStatus === "diproses") nextStatus = "ready";
    if (currentDbStatus === "ready") nextStatus = "dikirim";

    try {
      setIsActionLoading(true);

      // Potong timbangan stok rak gudang hanya jika status naik ke 'dikirim' gais
      if (nextStatus === "dikirim") {
        for (const item of orderItems) {
          const p = item.products || {};
          const currentStock = parseFloat(p.stock) || 0;
          const orderQty = parseFloat(item.qty) || 0;
          const newStock = currentStock - orderQty;

          const { error: stockErr } = await supabase.from("products").update({ stock: newStock }).eq("id", p.id);
          if (stockErr) throw stockErr;

          const { error: mutationErr } = await supabase.from("stock_mutations").insert([{
            product_id: p.id,
            type: "out",
            qty: orderQty,
            reference_no: orderData.invoice_no,
            description: `Penjualan Lapangan Berhasil: ${orderData.invoice_no} (${orderData.customers?.name || "Warung"})`
          }]);
          if (mutationErr) throw mutationErr;
        }
      }

      const { error: updateErr } = await supabase.from("sales_orders").update({ status: nextStatus }).eq("id", orderId);
      if (updateErr) throw updateErr;

      alert(`🎉 Status Order Resmi Naik Ke Tahap: ${nextStatus.toUpperCase()}! Arus stok kopi matang tercatat.`);
      window.location.reload();

    } catch (err) {
      alert("❌ Gagal merubah status operational: " + err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Setup Visualisasi Atribut Berdasarkan Posisi Status Lapangan
  let statusText = "Pending Produksi";
  let badgeColor = "bg-amber-50 text-amber-600 border-amber-200";

  if (currentDbStatus === "butuh produksi") { statusText = "Butuh Produksi (MTO)"; badgeColor = "bg-amber-100 text-amber-700 font-bold"; }
  if (currentDbStatus === "diproses") { statusText = "Sedang Diproses"; badgeColor = "bg-blue-50 text-blue-600 border-blue-200 font-bold"; }
  if (currentDbStatus === "ready") { statusText = "Siap Dikirim"; badgeColor = "bg-orange-50 text-orange-600 border-orange-200 font-bold"; }
  if (currentDbStatus === "dikirim") { statusText = "Selesai Dikirim"; badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200 font-bold"; }
  if (currentDbStatus === "void") { statusText = "Nota Dibatalkan (Void)"; badgeColor = "bg-zinc-100 text-zinc-600 border-zinc-300"; }

  return (
    <section className="detail-page p-4 space-y-4 pb-28">
      
      {/* CARD STATUS NOTA UTAMA */}
      <div className="card detail-status-card bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="detail-status-title text-[11px] font-mono text-zinc-400 block">Invoice: {orderData.invoice_no}</span>
          <h3 className="text-base font-extrabold text-zinc-800 mt-0.5">{statusText}</h3>
        </div>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase ${badgeColor}`}>
          {orderData.status || "Pending"}
        </span>
      </div>

      {/* CARD DATA CUSTOMER & SALES */}
      <div className="card detail-card bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="card-title flex items-center gap-2 border-b border-zinc-50 pb-2 text-zinc-800 font-bold text-sm">
          <User size={18} className="text-zinc-500" />
          <h3>Customer & Salesman</h3>
        </div>
        <div className="detail-info space-y-2 text-xs">
          <div className="info-item flex justify-between"><span className="text-zinc-400">Nama Warung</span><strong className="text-zinc-800 font-semibold">{orderData.customers?.name || "Tanpa Nama"}</strong></div>
          <div className="info-item flex justify-between"><span className="text-zinc-400">Telepon / WA</span><strong className="text-zinc-800 font-semibold">{orderData.customers?.phone || "-"}</strong></div>
          <div className="info-item flex justify-between gap-4"><span className="text-zinc-400 whitespace-nowrap">Alamat Kirim</span><strong className="text-zinc-800 font-semibold text-right max-w-[180px] break-words">{orderData.customers?.address || "-"}</strong></div>
          <div className="info-item flex justify-between pt-2 border-t border-dashed border-zinc-200">
            <span className="text-zinc-400">Sales Lapangan</span>
            <strong className="text-orange-500 font-bold">{orderData.salesmen?.name || "None"}</strong>
          </div>
        </div>
      </div>

      {/* CARD LIST BELANJAAN ITEM PRODUK */}
      <div className="card detail-card bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="card-title flex items-center gap-2 border-b border-zinc-50 pb-2 text-zinc-800 font-bold text-sm">
          <Package size={18} className="text-zinc-500" />
          <h3>Produk Terbeli</h3>
        </div>
        <div className="detail-product-card-list space-y-3">
          {orderItems.map((item) => {
            const p = item.products || {};
            const isShortage = item.qty > (p.stock || 0);
            return (
              <div key={item.id} className="detail-row-item flex items-center justify-between gap-2 pb-2.5 border-b border-zinc-100 last:border-none last:pb-0">
                <div className="left-content">
                  <strong className="title text-xs font-bold text-zinc-800 block">{p.name || "Produk Hilang"}</strong>
                  <span className="subtitle text-[11px] text-zinc-400 mt-0.5 block">
                    Qty: {item.qty} {p.unit || "kg"} &bull; @Rp {(item.unit_price || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-md border ${isShortage ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
                  {isShortage ? "Butuh Produksi" : "Stok Ready"}
                </span>
              </div>
            );
          })}
          <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
            <span className="text-xs text-zinc-400">Total Pembelian</span>
            <strong className="text-sm font-black text-zinc-900">Rp {(orderData.total_amount || 0).toLocaleString("id-ID")}</strong>
          </div>
        </div>
      </div>

      {/* CARD KEBUTUHAN ANALISIS MANUFAKTUR (BOM) */}
      {dbBomItems && dbBomItems.length > 0 && currentDbStatus !== "dikirim" && currentDbStatus !== "ready" && currentDbStatus !== "void" && (
        <div className="card detail-card bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="card-title flex items-center gap-2 border-b border-zinc-50 pb-2 text-zinc-800 font-bold text-sm">
            <Factory size={18} className="text-zinc-500" />
            <h3>Kebutuhan Analisis Manufaktur (BOM)</h3>
          </div>
          <div className="bom-list flex flex-col gap-2 text-xs">
            {dbBomItems.map((ing, idx) => (
              <div key={idx} className="detail-row-item flex justify-between items-center py-0.5">
                <span className="title text-zinc-600 font-medium">{ing.products?.name || "Bahan Baku"}</span>
                <strong className="right-value text-zinc-800 font-bold">{parseFloat(ing.qty_used || 0).toFixed(1)} {ing.products?.unit || "kg"}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARD TIMELINE TRACING NOTA */}
      <div className="card detail-card bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="card-title flex items-center gap-2 border-b border-zinc-50 pb-2 text-zinc-800 font-bold text-sm">
          <Clock3 size={18} className="text-zinc-500" />
          <h3>Timeline Perjalanan Nota</h3>
        </div>
        <div className="timeline space-y-3 pl-1 pt-1">
          
          <div className="timeline-item flex gap-3 text-xs active">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shadow-sm shadow-orange-500/30"></div>
            <div><h4 className="font-bold text-zinc-800">Order Dibuat</h4><p className="text-[11px] text-zinc-400 mt-0.5">{orderData.order_date}</p></div>
          </div>
          
          <div className="timeline-item flex gap-3 text-xs">
            <div className={`w-2 h-2 rounded-full mt-1.5 ${currentDbStatus !== "pending" && currentDbStatus !== "void" ? "bg-orange-500 shadow-sm shadow-orange-500/30" : "bg-zinc-200"}`}></div>
            <div>
              <h4 className="font-bold text-zinc-800">Antrean Masuk</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {currentDbStatus === "void" ? "Nota Dibatalkan / Retur" : (currentDbStatus === "pending" || currentDbStatus === "butuh produksi" ? "Menunggu Produksi" : "Disetujui Admin")}
              </p>
            </div>
          </div>
          
          <div className="timeline-item flex gap-3 text-xs">
            <div className={`w-2 h-2 rounded-full mt-1.5 ${currentDbStatus === "ready" || currentDbStatus === "dikirim" ? "bg-orange-500 shadow-sm shadow-orange-500/30" : "bg-zinc-200"}`}></div>
            <div>
              <h4 className="font-bold text-zinc-800">Proses Produksi</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {currentDbStatus === "diproses" ? "Sedang Digiling/Roasting" : (currentDbStatus === "ready" || currentDbStatus === "dikirim" ? "Selesai Sempurna" : "Belum Dimulai")}
              </p>
            </div>
          </div>
          
          <div className="timeline-item flex gap-3 text-xs">
            <div className={`w-2 h-2 rounded-full mt-1.5 ${currentDbStatus === "dikirim" ? "bg-orange-500 shadow-sm shadow-orange-500/30" : "bg-zinc-200"}`}></div>
            <div><h4 className="font-bold text-zinc-800">Pengiriman</h4><p className="text-[11px] text-zinc-400 mt-0.5">{currentDbStatus === "dikirim" ? "Barang Dibawa Sales" : "Menunggu Siap"}</p></div>
          </div>

        </div>
      </div>

      {/* FOOTER BAR: TOMBOL AKSI OPERASIONAL FIXED DI BAWAH HP */}
      <div className="detail-actions fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-zinc-200 px-4 py-3 flex gap-3 max-w-md mx-auto z-40">
        
        {/* Tombol Cetak PDF */}
        <button 
          type="button" 
          onClick={downloadInvoiceA5}
          className="bg-orange-50 text-orange-600 border border-orange-100 w-12 h-12 flex items-center justify-center rounded-xl active:bg-orange-100 transition-all shrink-0" 
          title="Cetak Invoice PDF"
        >
          <Printer size={20} />
        </button>

        {/* Kondisi Tombol Void/Retur */}
        {currentDbStatus !== "void" && (
          <button 
            type="button" 
            onClick={handleVoidOrRetur}
            disabled={isActionLoading}
            className="bg-red-50 text-red-600 border border-red-100 w-12 h-12 flex items-center justify-center rounded-xl active:bg-red-100 transition-all shrink-0 disabled:opacity-50" 
            title={currentDbStatus === "dikirim" ? "Terima Retur" : "Void Order"}
          >
            {currentDbStatus === "dikirim" ? <RefreshCw size={20} className={isActionLoading ? "animate-spin" : ""} /> : <Trash2 size={20} />}
          </button>
        )}

        {/* Kendali Tombol Utama Jalur Alur Kerja POS */}
        {isActionLoading ? (
          <button type="button" className="bg-zinc-800 text-white flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-xs" disabled>
            <Loader2 size={16} className="animate-spin" /> Updating Data...
          </button>
        ) : currentDbStatus === "void" ? (
          <button type="button" className="bg-zinc-100 text-zinc-400 border border-zinc-200 flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-xs" disabled>
            <Ban size={16} /> NOTA VOIDED
          </button>
        ) : currentDbStatus === "pending" || currentDbStatus === "butuh produksi" ? (
          isAllStockReady ? (
            <button type="button" onClick={handleNextStatus} className="bg-cyan-600 text-white shadow-md shadow-cyan-600/10 flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-xs active:scale-95 transition-all">
              <CheckCircle size={16} /> Stok Ready, Siapkan Pengiriman
            </button>
          ) : (
            <button type="button" onClick={handleNextStatus} className="bg-orange-500 text-white shadow-md shadow-orange-500/10 flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-xs active:scale-95 transition-all">
              <Play size={16} /> Mulai Produksi
            </button>
          )
        ) : currentDbStatus === "diproses" ? (
          <button type="button" className="bg-zinc-100 text-zinc-400 border border-zinc-200 flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-xs" disabled>
            <Lock size={16} /> PRODUKSI BERJALAN
          </button>
        ) : currentDbStatus === "ready" ? (
          <button type="button" onClick={handleNextStatus} className="bg-cyan-600 text-white shadow-md shadow-cyan-600/10 flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-xs active:scale-95 transition-all">
            <Truck size={16} /> Kirim Barang
          </button>
        ) : (
          <button type="button" className="bg-emerald-600 text-white flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-xs" disabled>
            <CheckSquare size={16} /> ORDER CLOSED
          </button>
        )}

      </div>

    </section>
  );
}