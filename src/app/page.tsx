"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InteractiveMap } from "@/components/InteractiveMap";
import { OrderModal } from "@/components/OrderModal";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/mockData";
import { OutletEntity, ProductKey } from "@/types";
import {
  MapPin,
  Phone,
  Search,
  Navigation,
  Truck,
  Store,
  Building2,
  Star,
  ArrowRight,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const { outlets, agents, gpsCoords, detectGps, calculateDistanceKm } = useApp();
  const [bannerSlide, setBannerSlide] = useState(0);
  const [selectedNearestOutletId, setSelectedNearestOutletId] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("Semua Wilayah");
  const [typeFilter, setTypeFilter] = useState<"all" | "agen" | "outlet">("all");
  const [pdsOnly, setPdsOnly] = useState(false);
  const [variantFilter, setVariantFilter] = useState<string>("all");
  const [mapQuery, setMapQuery] = useState("");
  const [selectedMapEntity, setSelectedMapEntity] = useState<string | null>(null);
  const [orderModalData, setOrderModalData] = useState<{
    outlet: OutletEntity;
    productKey: ProductKey;
    distanceKm: number;
  } | null>(null);

  const activeOutlets = useMemo(
    () =>
      outlets
        .filter((o) => o.status === "Aktif")
        .map((o) => {
          const dist = gpsCoords
            ? calculateDistanceKm(gpsCoords.lat, gpsCoords.lng, o.lat, o.lng)
            : 1.2;
          return { ...o, distanceKm: dist };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [outlets, gpsCoords, calculateDistanceKm]
  );

  const nearbyOutlets = useMemo(
    () => activeOutlets.filter((o) => o.distanceKm <= 5.0),
    [activeOutlets]
  );

  const displayedNearestOutlet = useMemo(() => {
    if (nearbyOutlets.length === 0) return null;
    if (selectedNearestOutletId) {
      return nearbyOutlets.find((o) => o.id === selectedNearestOutletId) || nearbyOutlets[0];
    }
    return nearbyOutlets[0];
  }, [nearbyOutlets, selectedNearestOutletId]);

  const filteredAgents = useMemo(() => {
    if (typeFilter === "outlet") return [];
    return agents.filter((a) => {
      if (regionFilter !== "Semua Wilayah" && a.region !== regionFilter) return false;
      if (
        mapQuery &&
        !a.name.toLowerCase().includes(mapQuery.toLowerCase()) &&
        !a.district.toLowerCase().includes(mapQuery.toLowerCase()) &&
        !a.region.toLowerCase().includes(mapQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [agents, typeFilter, regionFilter, mapQuery]);

  const filteredOutlets = useMemo(() => {
    if (typeFilter === "agen") return [];
    return activeOutlets.filter((o) => {
      if (regionFilter !== "Semua Wilayah" && o.region !== regionFilter) return false;
      if (pdsOnly && !o.pdsActive) return false;
      if (variantFilter !== "all") {
        const key = variantFilter as ProductKey;
        if (o.stock[key].ready <= 0) return false;
      }
      if (
        mapQuery &&
        !o.name.toLowerCase().includes(mapQuery.toLowerCase()) &&
        !o.district.toLowerCase().includes(mapQuery.toLowerCase()) &&
        !o.region.toLowerCase().includes(mapQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [activeOutlets, typeFilter, regionFilter, pdsOnly, variantFilter, mapQuery]);

  const totalFound = filteredAgents.length + filteredOutlets.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 space-y-12">
        {/* HERO BANNER CAROUSEL */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0055B8] via-[#0066CC] to-[#003B82] text-white shadow-lg">
          <div className="px-6 sm:px-12 py-10 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ED1C24] text-white text-[11px] font-bold tracking-wide">
                <span>RESMI SA BANDUNG</span>
              </div>

              {bannerSlide === 0 ? (
                <>
                  <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                    LAYANAN PESAN ANTAR RESMI{" "}
                    <span className="text-amber-300">BRIGHT GAS 135</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                    Temukan pangkalan dan agen LPG Non-Subsidi terdekat di Kota Bandung, Kabupaten Bandung, Sumedang, dan Garut dengan ketersediaan stok real-time.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                    PROGRAM TRADE-IN RESMI{" "}
                    <span className="text-amber-300">BRIGHT GAS 5,5 KG &amp; 12 KG</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                    Tukarkan tabung lama Anda ke Bright Gas dengan katup pengaman ganda DSVS dan segel hologram resmi PT Pertamina Patra Niaga.
                  </p>
                </>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#peta-interaktif"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0055B8] hover:bg-blue-50 text-xs font-bold shadow transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Cek Outlet Terdekat</span>
                </a>
                <a
                  href="tel:135"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#003B82] hover:bg-slate-900 text-white border border-blue-400/30 text-xs font-bold transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Center 135</span>
                </a>
              </div>
            </div>

            {/* Right Call Center 135 Badge */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-center shrink-0 min-w-[220px]">
              <div className="text-[11px] font-bold uppercase tracking-widest text-blue-200">
                PERTAMINA CALL CENTER
              </div>
              <div className="text-5xl sm:text-6xl font-black tracking-tighter text-white my-1">
                135
              </div>
              <div className="text-[11px] text-blue-100">
                Energizing Your Journey • 24 Jam
              </div>
            </div>
          </div>

          <button
            onClick={() => setBannerSlide((s) => (s === 0 ? 1 : 0))}
            aria-label="Sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBannerSlide((s) => (s === 0 ? 1 : 0))}
            aria-label="Berikutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        {/* CATEGORY PILL */}
        <div>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0055B8] text-white text-xs font-bold shadow-sm">
            <Flame className="w-4 h-4 text-amber-300" />
            <span>LPG Non-Subsidi (NPSO)</span>
          </span>
        </div>

        {/* SECTION: OUTLET TERDEKAT DARI LOKASI ANDA */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0055B8] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Outlet terdekat dari lokasi Anda
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0055B8] hover:underline"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* GPS & Nearest Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={detectGps}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{gpsCoords ? "GPS Aktif" : "Deteksi Lokasi Saya (GPS)"}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-[#0055B8]" />
                <span>Outlet Terdekat:</span>
                {nearbyOutlets.length > 0 ? (
                  <select
                    value={displayedNearestOutlet?.id || ""}
                    onChange={(e) => setSelectedNearestOutletId(e.target.value)}
                    className="px-3 py-1 rounded-full border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-xs"
                  >
                    {nearbyOutlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.distanceKm} KM)
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
                    Tidak ada outlet (radius &gt; 5 KM)
                  </span>
                )}
              </div>
            </div>

            <div className="text-[11px] font-medium text-slate-500">
              {nearbyOutlets.length > 0 && displayedNearestOutlet ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                  Posisi: {displayedNearestOutlet.district}, {displayedNearestOutlet.region} • Terdekat:{" "}
                  {displayedNearestOutlet.distanceKm} KM
                </span>
              ) : (
                <span>Urutan Terdekat dari Lokasi (Maks 5 KM)</span>
              )}
            </div>
          </div>

          {/* Nearest Outlet Product Grid OR Empty 5KM State */}
          {displayedNearestOutlet ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0055B8] flex items-center justify-center shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {displayedNearestOutlet.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0055B8] text-[10px] font-bold">
                        OUTLET RESMI
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {displayedNearestOutlet.rating}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">
                        ● {displayedNearestOutlet.isOpen ? "Sedang Aktif" : "Tutup"}
                      </span>
                      <span>•</span>
                      <span>
                        {displayedNearestOutlet.district}, {displayedNearestOutlet.region}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/outlet/${displayedNearestOutlet.id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:border-[#0055B8] text-xs font-bold text-slate-800 hover:text-[#0055B8] transition"
                >
                  <span>Lihat Toko</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PRODUCTS.map((prod) => {
                  const st = displayedNearestOutlet.stock[prod.key];
                  const isAvailable = st.ready > 0;
                  const waUrl = `https://wa.me/${displayedNearestOutlet.phone.replace(
                    /[^0-9]/g,
                    ""
                  )}?text=${encodeURIComponent(
                    `Halo ${displayedNearestOutlet.name}, apakah stok ${prod.shortName} tersedia?`
                  )}`;

                  return (
                    <div
                      key={prod.key}
                      className="rounded-2xl border border-slate-200 p-4 flex flex-col justify-between bg-slate-50/40 hover:bg-white hover:shadow-md transition"
                    >
                      <div>
                        <div className="h-28 rounded-xl bg-gradient-to-b from-pink-50 to-white border border-pink-100 flex flex-col items-center justify-center mb-3">
                          <div className="w-10 h-14 rounded-lg bg-[#D81B60] text-white flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[8px] font-bold">Bright</span>
                            <span className="text-[10px] font-extrabold">{prod.weightLabel}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isAvailable
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {isAvailable ? `Stok: ${st.ready} Tbg` : "Stok Kosong"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0055B8] text-[10px] font-semibold">
                            Radius 5 km ({displayedNearestOutlet.distanceKm} KM)
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{prod.name}</h4>
                        <div className="text-sm font-extrabold text-slate-900 mt-1">
                          Rp {st.price.toLocaleString("id-ID")}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {isAvailable
                            ? `Siap antar PDS • Terjual ${displayedNearestOutlet.soldCount}`
                            : "Stok fisik kosong (0 tabung)"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-2 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Tanya</span>
                        </a>
                        <button
                          disabled={!isAvailable}
                          onClick={() =>
                            setOrderModalData({
                              outlet: displayedNearestOutlet,
                              productKey: prod.key,
                              distanceKm: displayedNearestOutlet.distanceKm,
                            })
                          }
                          className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition ${
                            isAvailable
                              ? "bg-[#0055B8] hover:bg-[#003B82] text-white"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <Truck className="w-3 h-3" />
                          <span>{isAvailable ? "Pesan PDS" : "Stok Habis"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Tidak Ada Outlet dalam Radius 5 KM
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tidak ditemukan outlet gas nonsubsidi dalam radius jangkauan 0–5 KM dari lokasi Anda saat ini. Silakan lihat seluruh outlet terdaftar di katalog atau klik tombol Garut/Bandung pada peta di bawah.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-bold transition"
                >
                  <span>Lihat Semua Outlet di Katalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* SECTION: PETA PERSEBARAN & MONITORING STOK AGEN-OUTLET */}
        <section id="peta-interaktif" className="space-y-5 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#ED1C24] text-[11px] font-bold">
                <Flame className="w-3.5 h-3.5" />
                SISTEM INFORMASI JARINGAN PENYALUR
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Peta Persebaran &amp; Monitoring Stok Agen-Outlet
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl">
                Cari outlet dan agen resmi LPG NPSO (Bright Gas 5.5 kg, 12 kg, Canister &amp; Elpiji 50 kg) terdekat di Bandung Raya, Sumedang, dan Garut dengan data ketersediaan stok riil.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs shadow-sm self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                Ditemukan: <strong>{totalFound}</strong> Titik Penyalur
              </span>
            </div>
          </div>

          {/* Search & Filter Control Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mapQuery}
                  onChange={(e) => setMapQuery(e.target.value)}
                  placeholder="Cari kecamatan atau nama outlet resmi (misal: Coblong, Dago, Jatinangor, Tarogong)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:bg-white focus:border-[#0055B8]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={detectGps}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dekat Saya</span>
                </button>
                <button
                  onClick={() => setPdsOnly(!pdsOnly)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                    pdsOnly
                      ? "bg-[#0055B8] text-white border-[#0055B8]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Siap Antar</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 mr-1">WILAYAH:</span>
                {[
                  "Semua Wilayah",
                  "Kota Bandung",
                  "Kabupaten Bandung",
                  "Kabupaten Sumedang",
                  "Kabupaten Garut",
                ].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setRegionFilter(reg)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                      regionFilter === reg
                        ? "bg-[#0055B8] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-full bg-slate-100 p-0.5 text-[11px] font-semibold">
                  <button
                    onClick={() => setTypeFilter("all")}
                    className={`px-3 py-1 rounded-full ${
                      typeFilter === "all" ? "bg-slate-900 text-white" : "text-slate-600"
                    }`}
                  >
                    Semua Tipe
                  </button>
                  <button
                    onClick={() => setTypeFilter("agen")}
                    className={`px-3 py-1 rounded-full ${
                      typeFilter === "agen" ? "bg-slate-900 text-white" : "text-slate-600"
                    }`}
                  >
                    Agen ({agents.length})
                  </button>
                  <button
                    onClick={() => setTypeFilter("outlet")}
                    className={`px-3 py-1 rounded-full ${
                      typeFilter === "outlet" ? "bg-slate-900 text-white" : "text-slate-600"
                    }`}
                  >
                    Outlet ({activeOutlets.length})
                  </button>
                </div>

                <select
                  value={variantFilter}
                  onChange={(e) => setVariantFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-700"
                >
                  <option value="all">Semua Varian Gas</option>
                  <option value="bg55">Bright Gas 5.5 kg</option>
                  <option value="bg12">Bright Gas 12 kg</option>
                  <option value="canister220">Canister 220 gr</option>
                  <option value="elpiji50">Elpiji 50 kg</option>
                </select>
              </div>
            </div>
          </div>

          {/* Split View: Interactive Map + Registered Distributor Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0055B8]" />
                  Sebaran Titik Penyalur
                </span>
                <span className="text-slate-500">{totalFound} Titik Terplot di Peta</span>
              </div>
              <InteractiveMap
                agents={filteredAgents}
                outlets={filteredOutlets}
                selectedId={selectedMapEntity}
                userCoords={gpsCoords}
                onSelectEntity={(id) => setSelectedMapEntity(id)}
                heightClass="h-[460px]"
              />
            </div>

            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-4 flex flex-col h-[535px] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900">Daftar Penyalur Terdaftar</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0055B8] text-[11px] font-bold">
                  {totalFound} Titik
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
                {totalFound === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <h4 className="text-sm font-bold text-slate-800">
                      Tidak ada penyalur yang cocok
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Sesuaikan kata kunci atau ubah filter wilayah.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Outlet Cards */}
                    {filteredOutlets.map((out) => {
                      const parentAgent = agents.find((a) => a.id === out.agentId);
                      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${out.lat},${out.lng}`;
                      const waUrl = `https://wa.me/${out.phone.replace(/[^0-9]/g, "")}`;
                      return (
                        <div
                          key={out.id}
                          onClick={() => setSelectedMapEntity(out.id)}
                          className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                            selectedMapEntity === out.id
                              ? "border-[#0055B8] bg-blue-50/20"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-red-50 text-[#ED1C24] text-[10px] font-bold">
                                OUTLET RESMI
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                ~{out.distanceKm} km
                              </span>
                              <span className="text-[11px] text-slate-500">{out.region}</span>
                            </div>
                            {out.pdsActive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold shrink-0">
                                ● Siap Antar
                              </span>
                            )}
                          </div>

                          <div>
                            <Link
                              href={`/outlet/${out.id}`}
                              className="text-sm font-extrabold text-slate-900 hover:text-[#0055B8]"
                            >
                              {out.name}
                            </Link>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                              {out.address}
                            </p>
                          </div>

                          <div className="px-3 py-1.5 rounded-xl bg-slate-50 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Dinaungi Agen:</span>
                            <span className="font-bold text-[#0055B8]">
                              {parentAgent?.name || "Agen Resmi Pertamina"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {PRODUCTS.map((p) => {
                              const s = out.stock[p.key];
                              return (
                                <div
                                  key={p.key}
                                  className="p-2 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                                >
                                  <div>
                                    <div className="font-bold text-slate-800">{p.shortName}</div>
                                    <div className="text-[10px] text-slate-500">
                                      Rp {s.price.toLocaleString("id-ID")}
                                    </div>
                                  </div>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      s.ready > 0
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-600"
                                    }`}
                                  >
                                    {s.ready > 0 ? `${s.ready} Tbg` : "Habis"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2 rounded-xl bg-[#00A651] hover:bg-emerald-700 text-white text-[11px] font-bold text-center"
                            >
                              WhatsApp
                            </a>
                            <a
                              href={googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold text-center"
                            >
                              Rute
                            </a>
                            <Link
                              href={`/outlet/${out.id}`}
                              className="py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0055B8] text-[11px] font-bold text-center"
                            >
                              Detail Toko
                            </Link>
                          </div>
                        </div>
                      );
                    })}

                    {/* Agent Cards */}
                    {filteredAgents.map((agn) => (
                      <div
                        key={agn.id}
                        onClick={() => setSelectedMapEntity(agn.id)}
                        className={`p-4 rounded-2xl border transition cursor-pointer space-y-2.5 ${
                          selectedMapEntity === agn.id
                            ? "border-[#0055B8] bg-blue-50/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0055B8] text-[10px] font-bold">
                              AGEN RESMI
                            </span>
                            <span className="text-[11px] text-slate-500">{agn.region}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            ● Gudang Aktif
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-slate-900">{agn.name}</div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{agn.address}</p>
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl">
                          <span>Pasokan Induk: {agn.sppbe}</span>
                          <span className="font-bold text-[#0055B8]">
                            Stok Gudang: {Object.values(agn.stock).reduce((acc, v) => acc + v.ready, 0)} Tbg
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {orderModalData && (
        <OrderModal
          outlet={orderModalData.outlet}
          initialProductKey={orderModalData.productKey}
          distanceKm={orderModalData.distanceKm}
          onClose={() => setOrderModalData(null)}
        />
      )}
    </div>
  );
}