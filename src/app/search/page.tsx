"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderModal } from "@/components/OrderModal";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/mockData";
import { OutletEntity, ProductKey } from "@/types";
import { Filter, Star, Store, ArrowRight, Phone, Truck } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const { outlets, agents, gpsCoords, calculateDistanceKm } = useApp();

  const [tab, setTab] = useState<"toko" | "produk">("toko");
  const [selectedVariants, setSelectedVariants] = useState<ProductKey[]>([
    "bg55",
    "bg12",
    "canister220",
    "elpiji50",
  ]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [orderModalData, setOrderModalData] = useState<{
    outlet: OutletEntity;
    productKey: ProductKey;
    distanceKm: number;
  } | null>(null);

  const toggleVariant = (key: ProductKey) => {
    setSelectedVariants((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const enrichedOutlets = useMemo(() => {
    return outlets
      .filter((o) => o.status === "Aktif")
      .map((o) => ({
        ...o,
        distanceKm: gpsCoords
          ? calculateDistanceKm(gpsCoords.lat, gpsCoords.lng, o.lat, o.lng)
          : 1.8,
      }))
      .filter((o) => {
        if (!initialQ) return true;
        const q = initialQ.toLowerCase();
        const matchesOutlet =
          o.name.toLowerCase().includes(q) ||
          o.district.toLowerCase().includes(q) ||
          o.region.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q);
        const matchesProduct = PRODUCTS.some((p) => p.name.toLowerCase().includes(q));
        return matchesOutlet || matchesProduct;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [outlets, gpsCoords, calculateDistanceKm, initialQ]);

  const allProductCards = useMemo(() => {
    const list: { outlet: OutletEntity & { distanceKm: number }; productKey: ProductKey }[] = [];
    enrichedOutlets.forEach((out) => {
      PRODUCTS.forEach((p) => {
        if (!selectedVariants.includes(p.key)) return;
        const st = out.stock[p.key];
        if (onlyAvailable && st.ready <= 0) return;
        if (st.price < minPrice || st.price > maxPrice) return;
        list.push({ outlet: out, productKey: p.key });
      });
    });
    return list;
  }, [enrichedOutlets, selectedVariants, onlyAvailable, minPrice, maxPrice]);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 space-y-6">
      <div className="space-y-3">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {initialQ ? `Hasil Pencarian untuk '${initialQ}'` : "Katalog Outlet & Varian Bright Gas"}
        </h1>

        <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setTab("toko")}
            className={`pb-3 border-b-2 transition ${
              tab === "toko"
                ? "border-[#0055B8] text-[#0055B8]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Toko ({enrichedOutlets.length})
          </button>
          <button
            onClick={() => setTab("produk")}
            className={`pb-3 border-b-2 transition ${
              tab === "produk"
                ? "border-[#0055B8] text-[#0055B8]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Produk ({allProductCards.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-5 shadow-sm sticky top-28">
            <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
              <Filter className="w-4 h-4 text-[#0055B8]" />
              <span>Filter</span>
            </div>

            <div className="space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                VARIAN LPG
              </div>
              {PRODUCTS.map((p) => (
                <label key={p.key} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedVariants.includes(p.key)}
                    onChange={() => toggleVariant(p.key)}
                    className="rounded accent-[#0055B8]"
                  />
                  <span>{p.shortName}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                KETERSEDIAAN
              </div>
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded accent-[#0055B8]"
                />
                <span>Hanya Stok Tersedia (&gt; 0)</span>
              </label>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                HARGA
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Harga Minimum (Rp)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Harga Maksimum (Rp)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Catalog Content */}
        <div className="lg:col-span-9 space-y-6">
          {tab === "toko" ? (
            enrichedOutlets.map((out) => {
              const parentAgent = agents.find((a) => a.id === out.agentId);
              return (
                <div
                  key={out.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0055B8] flex items-center justify-center shrink-0">
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-extrabold text-slate-900">{out.name}</h2>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0055B8] text-[10px] font-bold">
                            OUTLET RESMI
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {out.rating}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">
                            ● {out.isOpen ? "Sedang Buka" : "Tutup"}
                          </span>
                          <span>•</span>
                          <span>
                            {out.district}, {out.region}
                          </span>
                          <span>•</span>
                          <span>Binaan: {parentAgent?.name || "Agen Resmi"}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/outlet/${out.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:border-[#0055B8] text-xs font-bold text-slate-800 hover:text-[#0055B8] transition"
                    >
                      <span>Lihat Toko</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PRODUCTS.filter((p) => selectedVariants.includes(p.key)).map((prod) => {
                      const st = out.stock[prod.key];
                      if (onlyAvailable && st.ready <= 0) return null;
                      if (st.price < minPrice || st.price > maxPrice) return null;
                      const isAvailable = st.ready > 0;
                      const waUrl = `https://wa.me/${out.phone.replace(
                        /[^0-9]/g,
                        ""
                      )}?text=${encodeURIComponent(
                        `Halo ${out.name}, saya ingin menanyakan ketersediaan ${prod.shortName}`
                      )}`;

                      return (
                        <div
                          key={prod.key}
                          className="rounded-2xl border border-slate-200 p-4 flex flex-col justify-between bg-slate-50/40"
                        >
                          <div>
                            <div className="h-24 rounded-xl bg-gradient-to-b from-pink-50 to-white border border-pink-100 flex items-center justify-center mb-3">
                              <div className="w-9 h-12 rounded-lg bg-[#D81B60] text-white flex flex-col items-center justify-center">
                                <span className="text-[7px] font-bold">Bright</span>
                                <span className="text-[9px] font-extrabold">{prod.weightLabel}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isAvailable
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {isAvailable ? `Stok: ${st.ready}` : "Stok Kosong"}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0055B8] text-[10px] font-semibold">
                                {out.distanceKm} KM
                              </span>
                            </div>
                            <div className="text-xs font-bold text-slate-900">{prod.name}</div>
                            <div className="text-sm font-extrabold text-slate-900 mt-1">
                              Rp {st.price.toLocaleString("id-ID")}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {isAvailable ? "Siap kirim PDS" : "Stok habis / konfirmasi outlet"}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="py-1.5 px-2 rounded-xl border border-emerald-200 bg-emerald-50/50 text-emerald-700 text-[11px] font-bold flex items-center justify-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Tanya</span>
                            </a>
                            <button
                              disabled={!isAvailable}
                              onClick={() =>
                                setOrderModalData({
                                  outlet: out,
                                  productKey: prod.key,
                                  distanceKm: out.distanceKm,
                                })
                              }
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 ${
                                isAvailable
                                  ? "bg-[#0055B8] text-white"
                                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                              }`}
                            >
                              <Truck className="w-3 h-3" />
                              <span>{isAvailable ? "Pesan" : "Stok Habis"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProductCards.map(({ outlet, productKey }) => {
                const prod = PRODUCTS.find((p) => p.key === productKey)!;
                const st = outlet.stock[productKey];
                return (
                  <div
                    key={`${outlet.id}-${productKey}`}
                    className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="text-[11px] font-bold text-[#0055B8] mb-1">
                        {outlet.name} • {outlet.distanceKm} KM
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900">{prod.name}</h3>
                      <div className="text-base font-extrabold text-slate-900 mt-1">
                        Rp {st.price.toLocaleString("id-ID")}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Stok Siap Jual: <strong>{st.ready} Tabung</strong>
                      </div>
                    </div>
                    <button
                      disabled={st.ready <= 0}
                      onClick={() =>
                        setOrderModalData({
                          outlet,
                          productKey,
                          distanceKm: outlet.distanceKm,
                        })
                      }
                      className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold ${
                        st.ready > 0
                          ? "bg-[#0055B8] text-white"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {st.ready > 0 ? "Pesan Antar (PDS)" : "Stok Habis"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {orderModalData && (
        <OrderModal
          outlet={orderModalData.outlet}
          initialProductKey={orderModalData.productKey}
          distanceKm={orderModalData.distanceKm}
          onClose={() => setOrderModalData(null)}
        />
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="p-10 text-center text-xs">Memuat katalog...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}