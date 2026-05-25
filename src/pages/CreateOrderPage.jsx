// ==========================================================================
// FILE: src/pages/CreateOrderPage.jsx (MURNI REACT CONVERSION - STABLE)
// ==========================================================================

import React, { useState } from "react";

export default function CreateOrderPage() {
  // 1. Menggunakan State React untuk mengatur tanggal otomatis hari ini gais
  const today = new Date().toISOString().split("T")[0];
  const [orderDate, setOrderDate] = useState(today);

  // 2. Handler aksi ketika tombol simpan diklik
  const handleSave = () => {
    alert("Koneksi UI Berhasil! Form siap diintegrasikan ke database.");
  };

  return (
    <section className="create-order-page p-4 space-y-4 pb-24">

      {/* BLOK TANGGAL & SALES */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500">Tanggal Order</label>
          <input 
            type="date" 
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500">Nama Sales</label>
          <input 
            type="text" 
            placeholder="Ketik nama sales..." 
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500" 
            autoComplete="off" 
          />
        </div>
      </div>

      {/* BLOK CUSTOMER */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500">Customer / Pelanggan</label>
          <input 
            type="text" 
            placeholder="Ketik nama customer..." 
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500" 
            autoComplete="off" 
          />
        </div>
      </div>

      {/* BLOK DETAIL PRODUK MANUFAKTUR */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-2">
        <div>
          <h3 className="text-sm font-bold text-zinc-800">Produk Order</h3>
          <p className="text-zinc-400 text-xs">Input item pengerjaan pabrik</p>
        </div>
        <div className="flex flex-col gap-1">
          <input 
            type="text" 
            placeholder="Ketik nama produk manufaktur..." 
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500" 
            autoComplete="off" 
          />
        </div>
      </div>

      {/* BLOK ONGKIR & DP */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500">Estimasi Ongkir (Rp)</label>
          <input 
            type="number" 
            placeholder="0" 
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500">Uang Muka / DP (Rp)</label>
          <input 
            type="number" 
            placeholder="0" 
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-orange-500" 
          />
        </div>
      </div>

      {/* BLOK CATATAN TEKNIS PABRIK */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500">Catatan Spesifikasi Produksi</label>
          <textarea 
            placeholder="Tambahkan instruksi detail ukuran/warna untuk pabrik..." 
            className="w-full px-3 py-2 border border-zinc-200 rounded-xl h-24 resize-none focus:outline-none focus:border-orange-500"
          ></textarea>
        </div>
      </div>

      {/* AKSI TOMBOL */}
      <div className="flex gap-3 pt-2">
        <button 
          type="button"
          className="w-full py-3 bg-zinc-100 text-zinc-700 font-semibold rounded-xl active:scale-95 transition-all duration-150" 
        >
          Batal
        </button>
        <button 
          type="button"
          onClick={handleSave}
          className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all duration-150"
        >
          Simpan Uji Coba
        </button>
      </div>

    </section>
  );
}