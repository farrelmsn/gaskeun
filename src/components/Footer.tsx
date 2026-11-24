"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, Mail, Globe, Home, Search, MapPin, HelpCircle, User, Truck } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Footer() {
  const { currentUser } = useApp();

  return (
    <>
      <footer className="bg-white border-t border-slate-200 mt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0055B8] flex items-center justify-center text-white">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-extrabold text-slate-900">
                  Gas<span className="text-[#0055B8]">NPSO</span>
                </div>
                <p className="text-[11px] text-slate-500">Sales Area Retail Bandung</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sistem Informasi Pengelolaan Jaringan Agen dan Outlet LPG Non-Subsidi (Bright Gas 5.5 kg, 12 kg, Canister &amp; Elpiji 50 kg) untuk wilayah Kota Bandung, Kabupaten Bandung, Kabupaten Sumedang, dan Kabupaten Garut.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-[#0055B8] text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Mitra Patra Niaga
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                PDS 135 Reference
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Varian Bright Gas
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/search?q=Bright+Gas+5.5+kg" className="hover:text-[#0055B8]">Bright Gas 5.5 kg</Link></li>
              <li><Link href="/search?q=Bright+Gas+12+kg" className="hover:text-[#0055B8]">Bright Gas 12 kg</Link></li>
              <li><Link href="/search?q=Canister+220+gr" className="hover:text-[#0055B8]">Bright Gas Canister 220 gr</Link></li>
              <li><Link href="/search?q=Elpiji+50+kg" className="hover:text-[#0055B8]">Elpiji Industri 50 kg</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Wilayah Layanan
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/#peta-interaktif" className="hover:text-[#0055B8]">Kota Bandung</Link></li>
              <li><Link href="/#peta-interaktif" className="hover:text-[#0055B8]">Kabupaten Bandung</Link></li>
              <li><Link href="/#peta-interaktif" className="hover:text-[#0055B8]">Kabupaten Sumedang</Link></li>
              <li><Link href="/#peta-interaktif" className="hover:text-[#0055B8]">Kabupaten Garut</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Kontak Bantuan Resmi
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <a href="tel:135" className="flex items-center gap-2 font-bold text-slate-900 hover:text-[#0055B8]">
                <Phone className="w-3.5 h-3.5 text-[#0055B8]" />
                <span>Pertamina Call Center 135</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>pcc135@pertamina.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>pertaminapatraniaga.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© 2026 GasNPSO Platform - Sales Area Retail Bandung. All rights reserved.</p>
            <p>
              Kanal Pemesanan Konsumen:{" "}
              <strong className="text-[#0055B8]">Pertamina Delivery Service 135</strong>
            </p>
          </div>
        </div>
      </footer>

      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 grid grid-cols-5 py-2 text-[10px] font-medium text-slate-600"
      >
        <Link href="/" className="flex flex-col items-center gap-1 hover:text-[#0055B8]">
          <Home className="w-4 h-4" />
          <span>Beranda</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center gap-1 hover:text-[#0055B8]">
          <Search className="w-4 h-4" />
          <span>Katalog</span>
        </Link>
        <Link href="/map" className="flex flex-col items-center gap-1 hover:text-[#0055B8]">
          <MapPin className="w-4 h-4" />
          <span>Peta Outlet</span>
        </Link>
        <Link href="/help" className="flex flex-col items-center gap-1 hover:text-[#0055B8]">
          <HelpCircle className="w-4 h-4" />
          <span>Bantuan</span>
        </Link>
        <Link
          href={currentUser ? `/dashboard/${currentUser.role}` : "/login"}
          className="flex flex-col items-center gap-1 hover:text-[#0055B8]"
        >
          <User className="w-4 h-4" />
          <span>{currentUser ? "Akun" : "Masuk"}</span>
        </Link>
      </nav>
    </>
  );
}