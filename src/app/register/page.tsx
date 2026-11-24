"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";

export default function RegisterPage() {
  const { agents, registerUser } = useApp();
  const router = useRouter();
  const [role, setRole] = useState<"outlet" | "agen" | "konsumen">("outlet");
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState<
    "Kota Bandung" | "Kabupaten Bandung" | "Kabupaten Sumedang" | "Kabupaten Garut"
  >("Kota Bandung");
  const [agentId, setAgentId] = useState(agents[0]?.id || "");
  const [sppbe, setSppbe] = useState("SPPBE Padalarang");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = registerUser({
      role,
      name,
      pic,
      phone,
      region,
      address,
      email,
      password,
      agentId,
      sppbe,
    });
    if (ok) {
      router.push(role === "konsumen" ? "/dashboard/konsumen" : "/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0055B8]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-7 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0055B8] text-white flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {role === "outlet"
                ? "Pendaftaran Outlet Baru"
                : role === "agen"
                ? "Pendaftaran Mitra Agen Baru"
                : "Pendaftaran Akun Konsumen"}
            </h1>
            <p className="text-xs text-slate-500">
              {role === "outlet"
                ? "Khusus pendaftaran Outlet / Sub-Penyalur LPG Non-Subsidi di bawah pengawasan Agen Regional"
                : role === "agen"
                ? "Khusus pendaftaran Badan Usaha Agen Resmi LPG Non-Subsidi di wilayah kerja Sales Area Bandung"
                : "Daftar akun konsumen untuk mengelola profil, alamat pengiriman, dan pemesanan Bright Gas"}
            </p>
          </div>

          {/* 3-Role Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole("outlet")}
              className={`py-2 rounded-xl transition ${
                role === "outlet" ? "bg-white text-[#0055B8] shadow-sm" : "text-slate-600"
              }`}
            >
              Mitra Outlet
            </button>
            <button
              type="button"
              onClick={() => setRole("agen")}
              className={`py-2 rounded-xl transition ${
                role === "agen" ? "bg-white text-[#0055B8] shadow-sm" : "text-slate-600"
              }`}
            >
              Mitra Agen
            </button>
            <button
              type="button"
              onClick={() => setRole("konsumen")}
              className={`py-2 rounded-xl transition ${
                role === "konsumen" ? "bg-white text-[#0055B8] shadow-sm" : "text-slate-600"
              }`}
            >
              Konsumen
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {role === "outlet"
                  ? "Nama Outlet"
                  : role === "agen"
                  ? "Nama Badan Usaha Agen (PT / CV)"
                  : "Nama Lengkap"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === "outlet"
                    ? "Cth: Outlet Berkah Mandiri"
                    : role === "agen"
                    ? "Cth: PT Gasindo Sarana Utama"
                    : "Nama lengkap sesuai KTP"
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>

            {role !== "konsumen" && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nama Pemilik / Penanggung Jawab (PIC)
                </label>
                <input
                  type="text"
                  required
                  value={pic}
                  onChange={(e) => setPic(e.target.value)}
                  placeholder="Nama sesuai identitas"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  No. WhatsApp / Telepon
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812 3456 7890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Kota / Kabupaten Wilayah
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <option value="Kota Bandung">Kota Bandung</option>
                  <option value="Kabupaten Bandung">Kabupaten Bandung</option>
                  <option value="Kabupaten Sumedang">Kabupaten Sumedang</option>
                  <option value="Kabupaten Garut">Kabupaten Garut</option>
                </select>
              </div>
            </div>

            {role === "outlet" && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Agen Pembina Regional
                </label>
                <select
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.region})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {role === "agen" && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  SPPBE Pasokan Induk
                </label>
                <input
                  type="text"
                  required
                  value={sppbe}
                  onChange={(e) => setSppbe(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Alamat Lengkap (Jalan, Kelurahan, Kecamatan)
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Sukajadi No. 123, Kelurahan, Kecamatan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Kata Sandi</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-bold shadow-sm transition"
            >
              {role === "outlet"
                ? "Ajukan Pendaftaran Outlet →"
                : role === "agen"
                ? "Ajukan Kemitraan Agen →"
                : "Daftar Akun Konsumen"}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Sudah memiliki akun terdaftar?{" "}
            <Link href="/login" className="font-bold text-[#0055B8] hover:underline">
              Masuk di sini
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sistem Kemitraan Digital Terenkripsi — Mitra Distribusi LPG Non-Subsidi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}