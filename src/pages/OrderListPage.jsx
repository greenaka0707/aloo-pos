// ==========================================================================
// FILE: src/pages/OrderListPage.jsx (MURNI REACT VERSION - HIGH PERFORMANCE)
// ==========================================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { 
  CalendarDays, 
  Search, 
  Download, 
  Plus, 
  ArrowUpRight 
} from "lucide-react";

export default function OrderListPage() {
  const navigate = useNavigate();

  // ==========================================================================
  // STATE MANAGEMENT LIST ORDER GAIS
  // ==========================================================================
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const tabs = ["Semua", "Pending", "Diproses", "Ready", "Dikirim", "Void"];

  // ==========================================================================
  // EFFECT 1: AMBIL DATA DARI SUPABASE
  // ==========================================================================
  useEffect(() => {
    async function fetchSalesOrders() {
      try {
        setIsLoading(true);
        const { data: orders, error } = await supabase
          .from("sales_orders")
          .select(`
            id,
            invoice_no,
            order_date,
            status,
            total_amount,
            net_amount,
            payment_method,
            created_at,
            customers ( name ),
            sales_order_items ( qty )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAllOrders(orders || []);
        setFilteredOrders(orders || []);
      } catch (err) {
        setErrorMessage(`Gagal memuat data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSalesOrders();
  }, []);

  // ==========================================================================
  // EFFECT 2: FILTERING DATA LIVE BERDASARKAN TAB & KEYWORD DI HP
  // ==========================================================================
  useEffect(() => {
    let result = allOrders;

    if (currentTab !== "Semua") {
      result = result.filter(o => o.status?.toLowerCase() === currentTab.toLowerCase());
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(o => 
        o.invoice_no?.toLowerCase().includes(query) || 
        o.customers?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(result);
  }, [currentTab, searchQuery, allOrders]);

  // ==========================================================================
  // HANDLER 1: MASUK KE DETAIL ORDER VIA LOCAL STORAGE
  // ==========================================================================
  const handleOpenDetail = (orderId) => {
    if (!orderId || isNaN(orderId)) return;
    localStorage.setItem("selected_order_id", orderId.toString());
    navigate("/order-detail");
  };

  // ==========================================================================
  // HANDLER 2: DOWNLOAD REKAP PDF HARIAN LIVE (HTML2PDF)
  // ==========================================================================
  const handleDownloadReport = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isoToday = today.toISOString();

    try {
      const { data: freshOrders, error } = await supabase
        .from("sales_orders")
        .select(`
          id,
          invoice_no,
          created_at,
          status,
          total_amount,
          net_amount,
          payment_method,
          customers ( name )
        `)
        .gte("created_at", isoToday)
        .neq("status", "void") 
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!freshOrders || freshOrders.length === 0) {
        return alert("☕ Belum ada transaksi penjualan yang sah masuk hari ini gais!");
      }

      const element = document.createElement("div");
      element.style.padding = "20px 15px";
      element.style.width = "750px"; 
      element.style.boxSizing = "border-box";
      element.style.fontFamily = "Arial, sans-serif";
      element.style.color = "#1F2937";
      element.style.backgroundColor = "#FFFFFF";

      let totalOmzet = 0;
      let totalCash = 0;
      let totalTransfer = 0;
      let totalPiutang = 0;

      const tableRowsHtml = freshOrders.map((o, idx) => {
        const gross = parseFloat(o.total_amount || 0);
        const debt = parseFloat(o.net_amount || 0);
        const paid = gross - debt;
        const method = o.payment_method ? o.payment_method.toUpperCase() : "CASH";
        const custName = o.customers ? o.customers.name : "Warung Umum";
        const timeStr = new Date(o.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

        totalOmzet += gross;
        totalPiutang += debt;
        if (method === "CASH") totalCash += paid;
        else totalTransfer += paid;

        return `
          <tr style="border-bottom: 1px solid #E5E7EB; font-size: 11px;">
            <td style="padding: 8px; text-align: center; color: #4B5563;">${idx + 1}</td>
            <td style="padding: 8px; font-weight: bold; color: #111827;">${o.invoice_no}<br><span style="font-size:9px; color:#6B7280; font-weight:normal;">Jam ${timeStr}</span></td>
            <td style="padding: 8px; color: #111827; font-weight:600;">${custName}</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; color: #4B5563;">${method}</td>
            <td style="padding: 8px; text-align: right; font-weight: bold; color: #111827;">Rp ${gross.toLocaleString("id-ID")}</td>
            <td style="padding: 8px; text-align: right; font-weight: bold; color: #DC2626;">Rp ${debt.toLocaleString("id-ID")}</td>
            <td style="padding: 8px; text-align: right; font-weight: bold; color: #166534;">Rp ${paid.toLocaleString("id-ID")}</td>
          </tr>
        `;
      }).join("");

      element.innerHTML = `
        <div style="border-bottom: 2px solid #F97316; padding-bottom: 10px; margin-bottom: 15px;">
          <h1 style="margin: 0; font-size: 22px; color: #1E293B; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">PT EKSPANSI NUTRISI NUSANTARA</h1>
          <div style="font-size: 11px; font-weight: 700; color: #F97316; text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px;">Laporan Penjualan Harian</div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; line-height: 1.4;">
          <tr>
            <td style="color: #6B7280; width: 15%;">Tanggal Cetak:</td>
            <td style="font-weight: 600; color: #111827; width: 35%;">: ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</td>
            <td style="color: #6B7280; width: 15%;">Sistem Terkait:</td>
            <td style="font-weight: 600; color: #111827; width: 35%;">: Aloo POS</td>
          </tr>
          <tr>
            <td style="color: #6B7280;">Status Finansial:</td>
            <td style="font-weight: 600; color: #111827;" colspan="3">: Terkoneksi Live (Supabase)</td>
          </tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; border: 1px solid #E5E7EB;">
          <thead>
            <tr style="background-color: #1E293B; color: #FFFFFF;">
              <th style="padding: 8px; text-align: center; font-weight: bold; width: 35px;">NO</th>
              <th style="padding: 8px; text-align: left; font-weight: bold; width: 110px;">NO INVOICE</th>
              <th style="padding: 8px; text-align: left; font-weight: bold;">NAMA PELANGGAN</th>
              <th style="padding: 8px; text-align: center; font-weight: bold; width: 80px;">METODE</th>
              <th style="padding: 8px; text-align: right; font-weight: bold; width: 100px;">TOTAL NOTA</th>
              <th style="padding: 8px; text-align: right; font-weight: bold; width: 100px;">PIUTANG</th>
              <th style="padding: 8px; text-align: right; font-weight: bold; width: 100px;">KAS MASUK</th>
            </tr>
          </thead>
          <tbody>${tableRowsHtml}</tbody>
        </table>
        <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px; margin-bottom: 35px;">
          <div style="font-size: 11px; font-weight: bold; color: #1E293B; text-transform: uppercase; margin-bottom: 8px;">Ringkasan Setoran Buku Kas Harian</div>
          <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 23%;">
                <span style="font-size: 9px; color: #64748B; display: block;">Total Omzet Kotor</span>
                <strong style="font-size: 11px; color: #0F172A;">Rp ${totalOmzet.toLocaleString("id-ID")}</strong>
              </td>
              <td style="width: 2%;"></td>
              <td style="padding: 6px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 23%;">
                <span style="font-size: 9px; color: #64748B; display: block;">Total Kas Cash Diterima</span>
                <strong style="font-size: 11px; color: #166534;">Rp ${totalCash.toLocaleString("id-ID")}</strong>
              </td>
              <td style="width: 2%;"></td>
              <td style="padding: 6px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 23%;">
                <span style="font-size: 9px; color: #64748B; display: block;">Total Kas Transfer/QRIS</span>
                <strong style="font-size: 11px; color: #0284C7;">Rp ${totalTransfer.toLocaleString("id-ID")}</strong>
              </td>
              <td style="width: 2%;"></td>
              <td style="padding: 6px; background: white; border: 1px dashed #CBD5E1; text-align: center; width: 23%;">
                <span style="font-size: 9px; color: #64748B; display: block;">Piutang Lapangan Tertahan</span>
                <strong style="font-size: 11px; color: #DC2626;">Rp ${totalPiutang.toLocaleString("id-ID")}</strong>
              </td>
            </tr>
          </table>
        </div>
        <table style="width: 100%; font-size: 11px; margin-top: 20px;">
          <tr>
            <td style="text-align: center; width: 50%;">
              <p style="margin: 0;">Dilaporkan Oleh,</p>
              <br><br><br>
              <strong style="text-decoration: underline; color: #111827;">Staff Lapangan Gudang</strong>
            </td>
            <td style="text-align: center; width: 50%;"></td>
          </tr>
        </table>
      `;

      const opt = {
        margin:       10,
        filename:     `Laporan_Penjualan_Harian_ENN_${new Date().toISOString().split("T")[0]}.pdf`,
        image:        { type: "jpeg", quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" }
      };

      window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      alert("❌ Gagal mencetak laporan penjualan: " + err.message);
    }
  };

  return (
    <section className="list-page p-4 space-y-4 pb-24">
      
      {/* BARISAN PENCARI & AKSI */}
      <div className="normal-search-row flex items-center gap-2 bg-white border border-zinc-200 rounded-2xl p-2 shadow-sm">
        <button type="button" className="filter-date-btn text-zinc-500 p-2 hover:bg-zinc-100 rounded-xl" title="Filter Tanggal">
          <CalendarDays size={20} />
        </button>

        <div className="search-box flex-1 flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100">
          <Search size={16} className="text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-800 focus:outline-none"
            placeholder="Cari nama warung / nomor invoice order..."
          />
        </div>

        <button 
          type="button" 
          onClick={handleDownloadReport}
          className="download-sales-btn text-zinc-500 p-2 hover:bg-zinc-100 rounded-xl" 
          title="Download Rekap PDF Harian"
        >
          <Download size={20} />
        </button>
      </div>

      {/* CHIPS FILTER TAB HORIZONTAL */}
      <div className="filter-scroll flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setCurrentTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
              currentTab === tab
                ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/10"
                : "bg-white text-zinc-600 border-zinc-200 active:bg-zinc-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* AREA KONTEN DAFTAR TRANSAKSI LIVE */}
      <div className="data-list space-y-3">
        {isLoading ? (
          <p className="text-zinc-400 text-xs text-center py-10">Memuat antrean orderan Supabase...</p>
        ) : errorMessage ? (
          <p className="text-red-500 text-xs text-center py-10">{errorMessage}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-zinc-400 text-xs text-center py-10">Tidak ada transaksi sales order yang cocok.</p>
        ) : (
          filteredOrders.map((order) => {
            const currentDbStatus = order.status ? order.status.toLowerCase() : "pending";
            
            // Konfigurasi style kartu berdasarkan status pesanan gais
            let cardBg = "bg-white";
            let borderLeft = "border-l-4 border-zinc-200";
            let badgeStyle = "bg-amber-50 text-amber-600 border-amber-200";

            if (currentDbStatus === "pending" || currentDbStatus === "butuh produksi") {
              cardBg = "bg-amber-50/40";
              borderLeft = "border-l-4 border-amber-500";
              badgeStyle = "bg-amber-100 text-amber-700 font-semibold";
            } else if (currentDbStatus === "diproses") {
              borderLeft = "border-l-4 border-blue-500";
              badgeStyle = "bg-blue-50 text-blue-600 font-semibold";
            } else if (currentDbStatus === "ready") {
              borderLeft = "border-l-4 border-orange-500";
              badgeStyle = "bg-orange-50 text-orange-600 font-semibold";
            } else if (currentDbStatus === "dikirim") {
              borderLeft = "border-l-4 border-emerald-500";
              badgeStyle = "bg-emerald-50 text-emerald-600 font-semibold";
            } else if (currentDbStatus === "void") {
              cardBg = "bg-zinc-50 opacity-60";
              borderLeft = "border-l-4 border-zinc-400";
              badgeStyle = "bg-zinc-200 text-zinc-600";
            }

            return (
              <div
                key={order.id}
                className={`list-card modern-order-card ${cardBg} ${borderLeft} border-y border-r border-zinc-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3`}
              >
                <div className="order-main-row flex items-start justify-between gap-2">
                  <div className="order-title-group">
                    <h4 className="text-sm font-bold text-zinc-800 leading-snug">
                      {order.customers?.name || "Tanpa Nama Customer"}
                    </h4>
                    <p className="order-ref text-[11px] text-zinc-400 font-mono mt-0.5">
                      {order.invoice_no}
                    </p>
                  </div>
                  <span className={`modern-status text-[10px] px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="order-bottom-row flex items-center justify-between pt-1 border-t border-zinc-50">
                  <strong className="order-total text-sm font-extrabold text-zinc-900">
                    Rp {Number(order.total_amount || 0).toLocaleString("id-ID")}
                  </strong>
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(order.id)}
                    className="order-arrow-btn detail-btn bg-zinc-50 text-zinc-600 p-2 rounded-xl border border-zinc-100 active:bg-zinc-200 transition-all"
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FLOATING ACTION BUTTON (FAB) TAMBAH ORDER DI HP */}
      <button
        type="button"
        onClick={() => navigate("/create-order")}
        className="fab-btn fixed bottom-24 right-6 bg-orange-500 text-white p-4 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center active:scale-95 transition-all z-40"
      >
        <Plus size={24} />
      </button>

    </section>
  );
}