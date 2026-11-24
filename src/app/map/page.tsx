"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InteractiveMap } from "@/components/InteractiveMap";
import { useApp } from "@/context/AppContext";

export default function FullMapPage() {
  const { agents, outlets } = useApp();
  const [region, setRegion] = useState("Semua Wilayah");

  const filteredAgents = agents.filter((a) => region === "Semua Wilayah" || a.region === region);
  const filteredOutlets = outlets.filter(
    (o) => o.status === "Aktif" && (region === "Semua Wilayah" || o.region === region)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 space-y-5">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Peta Persebaran Jaringan Distribusi LPG NPSO
              </h1>
              <p className="text-xs text-slate-500">
                Peta lokasi seluruh Gudang Agen Resmi (Biru) dan Pangkalan Resmi Aktif (Merah) di wilayah Sales Area Retail Bandung.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Semua Wilayah", "Kota Bandung", "Kabupaten Bandung", "Kabupaten Sumedang", "Kabupaten Garut"].map(
                (reg) => (
                  <button
                    key={reg}
                    onClick={() => setRegion(reg)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      region === reg ? "bg-[#0055B8] text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {reg}
                  </button>
                )
              )}
            </div>
          </div>

          <InteractiveMap agents={filteredAgents} outlets={filteredOutlets} heightClass="h-[560px]" />
        </div>
      </main>
      <Footer />
    </div>
  );
}