"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderModal } from "@/components/OrderModal";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/mockData";
import { ProductKey } from "@/types";
import {
  ArrowLeft,
  Share2,
  Store,
  Star,
  Phone,
  Navigation,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

export default function OutletDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { outlets, agents, gpsCoords, calculateDistanceKm } = useApp();
  const [orderProductKey, setOrderProductKey] = useState<ProductKey | null>(null);

  const outlet = outlets.find((o) => o.id === id) || outlets[0];
  const parentAgent = agents.find((a) => a.id === outlet.agentId);
  const distanceKm = gpsCoords
    ? calculateDistanceKm(gpsCoords.lat, gpsCoords.lng, outlet.lat, outlet.lng)
    : 1.5;

  const waUrl = `https://wa.me/${outlet.phone.replace(/[^0-9]/g, "")}`;
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${outlet.lat},${outlet.lng}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0055B8]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Hasil Pencarian</span>
          </Link>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Tautan profil outlet disalin!");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan Profil</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0055B8] flex items-center justify-center shrink-0">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {outlet.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#0055B8] text-[10px] font-bold">
                    OUTLET RESMI PERTAMINA
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {outlet.rating}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">
                    ● {outlet.isOpen ? "Sedang Buka" : "Tutup"}
                  </span>
                  <span>•</span>
                  <span>{outlet.operatingHours}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {outlet.district}, {outlet.region} • Binaan:{" "}
                  <strong className="text-slate-700">{parentAgent?.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00A651] hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
              >
                <Phone className="w-4 h-4" />
                <span>Chat WhatsApp Outlet</span>
              </a>
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-bold shadow-sm transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Buka Rute Google Maps</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#0055B8] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0055B8]">Pertamina Delivery Service</div>
                <div className="text-[11px] text-slate-500">Tersedia Kirim ke Rumah (PDS 135)</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/60 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Segel Hologram Resmi</div>
                <div className="text-[11px] text-slate-500">100% Asli Standar Pertamina</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100/60 text-[#0055B8] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Harga Eceran Tertinggi (HET)</div>
                <div className="text-[11px] text-slate-500">Sesuai Ketetapan Pertamina SA Bandung</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Daftar Stok Produk Gas</h2>
                <p className="text-xs text-slate-500">
                  Pilih varian tabung untuk pemesanan langsung atau konsultasi ketersediaan.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold">
                4 Varian
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRODUCTS.map((prod) => {
                const st = outlet.stock[prod.key];
                const isAvailable = st.ready > 0;
                return (
                  <div
                    key={prod.key}
                    className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                        {prod.weightLabel}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold ${
                          isAvailable
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {isAvailable ? `Stok Tersedia: ${st.ready} Tbg` : "Stok habis / konfirmasi"}
                      </span>
                    </div>

                    <div className="h-32 rounded-2xl bg-gradient-to-b from-pink-50 to-slate-50 border border-pink-100 flex items-center justify-center">
                      <div className="w-12 h-16 rounded-xl bg-[#D81B60] text-white flex flex-col items-center justify-center shadow">
                        <span className="text-[8px] font-bold">Bright</span>
                        <span className="text-xs font-extrabold">{prod.weightLabel}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{prod.shortName}</h3>
                      <div className="text-base font-extrabold text-slate-900 mt-1">
                        Rp {st.price.toLocaleString("id-ID")}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <a
                        href={`${waUrl}?text=${encodeURIComponent(
                          `Halo ${outlet.name}, saya ingin bertanya stok ${prod.shortName}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Tanya</span>
                      </a>
                      <button
                        disabled={!isAvailable}
                        onClick={() => setOrderProductKey(prod.key)}
                        className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                          isAvailable
                            ? "bg-[#0055B8] hover:bg-[#003B82] text-white"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{isAvailable ? "Pesan Antar" : "Stok Habis"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900">Alamat &amp; Lokasi Outlet</h3>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <p className="text-slate-700 leading-relaxed">{outlet.address}</p>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(outlet.address);
                    toast.success("Alamat disalin!");
                  }}
                  className="inline-flex items-center gap-1 text-[#0055B8] font-bold text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Salin Alamat Lengkap</span>
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Kecamatan</span>
                  <span className="font-bold text-slate-900">{outlet.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kota / Kabupaten</span>
                  <span className="font-bold text-slate-900">{outlet.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jam Operasional</span>
                  <span className="font-bold text-slate-900">{outlet.operatingHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Telepon</span>
                  <span className="font-bold text-[#0055B8]">{outlet.phone}</span>
                </div>
              </div>

              <a
                href={gmapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Buka di Google Maps Navigasi</span>
              </a>
            </div>

            {parentAgent && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0055B8]" />
                  <span>Agen Pembina Resmi</span>
                </h3>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">{parentAgent.name}</div>
                  <p className="text-[11px] text-slate-500">{parentAgent.address}</p>
                  <div className="text-[11px] text-slate-600 pt-1">
                    Penanggung Jawab: <strong>{parentAgent.pic}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Outlet ini dibina dan disuplai langsung oleh agen LPG NPSO resmi Pertamina di wilayah Sales Area Retail Bandung.
                </p>
              </div>
            )}

            <div className="rounded-3xl bg-[#003B82] text-white p-6 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-sm font-extrabold">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span>Jaminan Pertamina 100%</span>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Seluruh tabung Bright Gas telah melewati uji kebocoran, tera timbangan digital presisi, dan dilengkapi segel hologram resmi Pertamina.
              </p>
              <div className="pt-2 border-t border-blue-800 flex items-center justify-between text-xs">
                <span className="text-blue-200">Pusat Pengaduan Konsumen</span>
                <strong className="text-white">Call Center 135</strong>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {orderProductKey && (
        <OrderModal
          outlet={outlet}
          initialProductKey={orderProductKey}
          distanceKm={distanceKm}
          onClose={() => setOrderProductKey(null)}
        />
      )}
    </div>
  );
}
