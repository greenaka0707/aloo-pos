import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Membaca variabel lingkungan secara aman dari file .env melalui build-system Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi pengaman untuk memastikan token .env tidak kosong atau terlewat
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Waduh! Kredensial Supabase gagal terbaca. Pastikan server Vite sudah di-restart setelah membuat file .env');
}

// Inisialisasi dan export instance client Supabase utama
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
