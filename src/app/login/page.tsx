"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ShieldCheck, Truck } from "lucide-react";

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      router.push(`/dashboard/${user.role}`);
    }
  };

  const quickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0055B8]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-7 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0055B8] text-white flex items-center justify-center mx-auto shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Portal Ekosistem Gas NPSO</h1>
            <p className="text-xs text-slate-500">
              Akses terpadu untuk Konsumen, Outlet Resmi, Agen Distributor, dan Stakeholder Pertamina
            </p>
          </div>

          {/* Quick Role Fill Pills */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Akses Cepat Akun Terdaftar (Klik untuk Isi Otomatis)
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => quickFill("pertaminagas@gmail.com", "pertaminagas321")}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0055B8] font-semibold text-slate-700 text-left truncate"
              >
                1. Pertamina HQ
              </button>
              <button
                type="button"
                onClick={() => quickFill("pijarcahaya@gmail.com", "pijar123")}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0055B8] font-semibold text-slate-700 text-left truncate"
              >
                2. Agen (Pijar Cahaya)
              </button>
              <button
                type="button"
                onClick={() => quickFill("alisobar@gmail.com", "alisobar123")}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0055B8] font-semibold text-slate-700 text-left truncate"
              >
                3. Outlet (Ali Sobar)
              </button>
              <button
                type="button"
                onClick={() => quickFill("mocasfarrelm@gmail.com", "mocas123")}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0055B8] font-semibold text-slate-700 text-left truncate"
              >
                4. Konsumen (Farrel)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@gasdelivery.id atau email mitra"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:bg-white focus:border-[#0055B8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:bg-white focus:border-[#0055B8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-bold shadow-sm transition"
            >
              Masuk ke Dashboard
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Belum memiliki akun?{" "}
            <Link href="/register" className="font-bold text-[#0055B8] hover:underline">
              Daftar Mitra Outlet, Agen, atau Konsumen →
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sistem Kemitraan Digital Terenkripsi — Mitra Distribusi LPG Non-Subsidi</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Platform Koordinasi Agen &amp; Outlet Resmi Sales Area Bandung
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}