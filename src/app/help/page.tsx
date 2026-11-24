"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChevronDown, ChevronUp, HelpCircle, Phone } from "lucide-react";

const FAQS = [
  {
    q: "Apa itu PDS ?",
    a: "Pertamina Delivery Service (PDS 135) adalah layanan pesan antar resmi dari PT Pertamina Patra Niaga yang melayani pemesanan produk LPG Non-Subsidi (Bright Gas 5,5 Kg, 12 Kg, Canister 220 gr, dan Elpiji 50 Kg) langsung ke alamat rumah, kantor, atau tempat usaha Anda melalui kurir pangkalan resmi terdekat.",
  },
  {
    q: "Bagaimana jika belum punya akun PDS?",
    a: "Anda dapat mendaftar akun Konsumen secara gratis melalui menu Masuk -> Daftar Akun Konsumen dengan mengisi nama lengkap, nomor WhatsApp aktif, dan alamat pengantaran.",
  },
  {
    q: "Bagaimana cara berbelanja di PDS?",
    a: "Aktifkan deteksi lokasi GPS atau pilih pangkalan resmi terdekat di halaman Beranda/Katalog, pilih varian tabung Bright Gas (Refill, Trade-In 2 tabung 3 Kg, atau Perdana), tentukan metode pengantaran, lalu selesaikan pesanan.",
  },
  {
    q: "Apa yang dilakukan setelah Login?",
    a: "Setelah login, Anda dapat menyimpan beberapa titik alamat pengantaran (SmartPin GPS), memantau status pengantaran kurir secara real-time, serta mengakses riwayat transaksi.",
  },
  {
    q: "Bagaimana cara berbelanja untuk dikirimkan ke alamat lain?",
    a: "Pada menu Pengaturan Alamat di Portal Konsumen atau pada formulir checkout Pesan Antar Gas (PDS), Anda dapat menambahkan atau memilih alamat tujuan baru.",
  },
  {
    q: "Apakah ketika saya memilih layanan pengantaran barang ke alamat bisa dilakukan dengan pengiriman yang terjadwal?",
    a: "Jam operasional pengantaran pangkalan resmi umumnya berlangsung antara pukul 07.00 – 20.00 WIB. Anda dapat berkoordinasi langsung dengan kurir pangkalan melalui tombol WhatsApp setelah pesanan dibuat.",
  },
  {
    q: "Bagaimana jika pesanan yang dikirim toko belum diterima konsumen?",
    a: "Anda dapat menghubungi langsung kontak WhatsApp pangkalan terkait yang tertera pada detail pesanan atau menghubungi Pertamina Call Center 135 (Bebas Pulsa).",
  },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Bantuan &amp; FAQ</h1>
            <p className="text-xs text-slate-500 mt-1">
              Pertanyaan yang sering dicari seputar layanan Pertamina Delivery Service (PDS 135) &amp; GasNPSO
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left bg-white hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#0055B8] shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{item.q}</span>
                  </div>
                  {openIdx === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openIdx === idx && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#0055B8] flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">Butuh Bantuan Lebih Lanjut?</div>
                <div className="text-[11px] text-slate-600">
                  Hubungi Pertamina Call Center 135 (Bebas Pulsa) atau hubungi pangkalan resmi terdekat.
                </div>
              </div>
            </div>
            <a
              href="tel:135"
              className="px-5 py-2.5 rounded-full bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-bold text-center"
            >
              Panggil 135
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}