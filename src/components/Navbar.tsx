"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Search,
  MapPin,
  HelpCircle,
  Phone,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Truck,
} from "lucide-react";

export function Navbar() {
  const { currentUser, logout, gpsCoords, detectGps } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const getDashboardLink = () => {
    if (!currentUser) return "/login";
    return `/dashboard/${currentUser.role}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="bg-slate-50 border-b border-slate-100 text-[11px] text-slate-600 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Tentang</span>
            <span className="font-bold text-[#0055B8]">Pertamina Delivery Service</span>
            <span className="text-slate-300">|</span>
            <span>Sales Area Retail Bandung</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Ikuti Kami:</span>
            <a href="https://youtube.com/@pertamina" target="_blank" rel="noreferrer" className="hover:text-[#0055B8] font-medium">
              YouTube
            </a>
            <a href="https://instagram.com/pertamina" target="_blank" rel="noreferrer" className="hover:text-[#0055B8] font-medium">
              Instagram
            </a>
            <a href="https://tiktok.com/@pertamina" target="_blank" rel="noreferrer" className="hover:text-[#0055B8] font-medium">
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#0055B8] flex items-center justify-center text-white shadow-sm">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight leading-none text-slate-900">
              Gas<span className="text-[#0055B8]">NPSO</span>
            </div>
            <div className="text-[10px] font-medium text-slate-500 mt-0.5">
              Sales Area Retail Bandung
            </div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pangkalan atau tabung gas (Bright Gas 5.5 kg, 12 kg, Dago, Garut)..."
              className="w-full pl-4 pr-11 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs focus:outline-none focus:bg-white focus:border-[#0055B8] transition"
            />
            <button
              type="submit"
              aria-label="Cari"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0055B8] hover:bg-[#003B82] text-white flex items-center justify-center transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2.5 shrink-0">
          {currentUser ? (
            <>
              <Link
                href={getDashboardLink()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-semibold shadow-sm transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                title="Keluar"
                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-semibold shadow-sm transition"
            >
              Masuk
            </Link>
          )}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="sm:hidden p-2 rounded-lg border border-slate-200 text-slate-700"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            onClick={detectGps}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 transition"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0055B8]" />
            <span>Lokasi:</span>
            <strong className="text-[#0055B8]">
              {gpsCoords ? gpsCoords.label : "Klik Deteksi GPS"}
            </strong>
          </button>

          <div className="flex items-center gap-4 text-slate-600">
            <Link href="/help" className="inline-flex items-center gap-1 hover:text-[#0055B8] font-medium">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Bantuan</span>
            </Link>
            <a href="tel:135" className="inline-flex items-center gap-1 hover:text-[#0055B8]">
              <Phone className="w-3.5 h-3.5 text-[#ED1C24]" />
              <span>
                Pertamina Contact Center <strong className="text-[#0055B8]">135</strong>
              </span>
            </a>
          </div>
        </div>
      </div>

      {mobileMenu && (
        <div className="sm:hidden px-4 pb-3 bg-white border-t border-slate-100">
          <form onSubmit={handleSearch} className="mt-2 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pangkalan atau tabung gas..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-100 text-xs"
            />
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#0055B8] text-white text-xs font-semibold">
              Cari
            </button>
          </form>
        </div>
      )}
    </header>
  );
}