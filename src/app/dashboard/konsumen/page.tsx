"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  User,
  ShoppingBag,
  MapPin,
  Bell,
  HelpCircle,
  FileText,
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Truck,
  Phone,
  Home,
} from "lucide-react";
import { toast } from "sonner";

export default function KonsumenPortalPage() {
  const {
    currentUser,
    logout,
    orders,
    addresses,
    addAddress,
    deleteAddress,
    setPrimaryAddress,
    notifications,
    markAllNotificationsRead,
  } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<
    "profil" | "pesanan" | "alamat" | "notifikasi" | "bantuan" | "syarat" | "privasi"
  >("profil");

  const [fullName, setFullName] = useState(currentUser?.name || "Farrel Maisoon Maulana");
  const [phone, setPhone] = useState(currentUser?.phone || "+628123546789");

  // Add Address Form State
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [addrLabel, setAddrLabel] = useState("");
  const [addrDistrict, setAddrDistrict] = useState("Coblong");
  const [addrRegion, setAddrRegion] = useState("Kota Bandung");
  const [addrDetail, setAddrDetail] = useState("");
  const [addrNote, setAddrNote] = useState("");

  const myOrders = orders.filter((o) => o.consumerId === (currentUser?.id || "usr-konsumen-1"));
  const myNotifs = notifications.filter((n) => n.userId === currentUser?.id);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      label: addrLabel || "Rumah",
      recipientName: fullName,
      phone,
      region: addrRegion,
      district: addrDistrict,
      address: addrDetail,
      note: addrNote,
      lat: -6.9175,
      lng: 107.6191,
      isPrimary: addresses.length === 0,
    });
    setShowAddAddr(false);
    setAddrLabel("");
    setAddrDetail("");
    setAddrNote("");
  };

  const navItems = [
    { key: "profil", label: "Info Akun", icon: <User className="w-4 h-4" /> },
    { key: "pesanan", label: "Riwayat Pesanan", icon: <ShoppingBag className="w-4 h-4" /> },
    { key: "alamat", label: "Pengaturan Alamat", icon: <MapPin className="w-4 h-4" /> },
    { key: "notifikasi", label: "Kotak Notifikasi", icon: <Bell className="w-4 h-4" /> },
    { key: "bantuan", label: "Bantuan", icon: <HelpCircle className="w-4 h-4" /> },
    { key: "syarat", label: "Syarat Ketentuan", icon: <FileText className="w-4 h-4" /> },
    { key: "privasi", label: "Kebijakan Privasi", icon: <ShieldCheck className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0055B8] text-white flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900">GasNPSO</div>
            <div className="text-[10px] text-slate-500">Portal Konsumen Bright Gas</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#0055B8] text-xs font-bold hover:bg-blue-100"
          >
            Cari &amp; Pesan Gas
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#0055B8]">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <span>›</span>
          <span className="font-semibold text-slate-800">
            {navItems.find((i) => i.key === tab)?.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Menu Card */}
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-200 p-3 space-y-1 shadow-sm">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition ${
                    tab === item.key
                      ? "bg-blue-50 text-[#0055B8]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  <span>›</span>
                </button>
              ))}

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  <span className="flex items-center gap-2.5">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </span>
                  <span>›</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Right Content Card */}
          <div className="md:col-span-8 lg:col-span-9">
            {tab === "profil" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Info Akun</h2>
                  <p className="text-xs text-slate-500">
                    Kelola data pribadi dan informasi akun Pertamina Delivery Service Anda.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0055B8] font-extrabold text-sm flex items-center justify-center">
                    {fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">{fullName}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Konsumen Terverifikasi
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {currentUser?.email || "mocasfarrelm@gmail.com"}
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Perubahan profil konsumen berhasil disimpan!");
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={currentUser?.email || "mocasfarrelm@gmail.com"}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Nomor WhatsApp / Handphone
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-bold"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </div>
            )}

            {tab === "pesanan" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Riwayat Pesanan</h2>
                  <p className="text-xs text-slate-500">
                    Pantau status pengantaran dan arsip pemesanan Bright Gas Anda.
                  </p>
                </div>

                <div className="space-y-4">
                  {myOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/30"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs text-slate-500">
                          {ord.createdAt} • <strong className="text-slate-900">{ord.outletName}</strong>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            ord.status === "Selesai"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-extrabold text-slate-900">
                            {ord.productName}
                          </div>
                          <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                            <span>
                              Jumlah: <strong>{ord.quantity} Tabung</strong>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0055B8] text-[11px] font-semibold">
                              {ord.orderOptionLabel}
                            </span>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-sm font-extrabold text-[#0055B8]">
                            Rp {ord.totalAmount.toLocaleString("id-ID")}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Metode: {ord.paymentMethod}
                          </div>
                        </div>
                      </div>

                      <div className="px-3.5 py-2.5 rounded-xl bg-slate-100/80 text-xs text-slate-600 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#0055B8] shrink-0" />
                        <span>{ord.deliveryAddress}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "alamat" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Pengaturan Alamat</h2>
                    <p className="text-xs text-slate-500">
                      Kelola daftar alamat tujuan pengantaran Bright Gas Anda di wilayah Bandung Raya.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddAddr(!showAddAddr)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0055B8] text-white text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alamat</span>
                  </button>
                </div>

                {showAddAddr && (
                  <form
                    onSubmit={handleSaveAddress}
                    className="p-5 rounded-2xl border border-blue-200 bg-blue-50/30 space-y-4"
                  >
                    <div className="text-xs font-extrabold text-slate-900">
                      Form Tambah Alamat Pengiriman (SmartPin GPS)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Label Alamat</label>
                        <input
                          type="text"
                          required
                          value={addrLabel}
                          onChange={(e) => setAddrLabel(e.target.value)}
                          placeholder="Rumah, Kantor..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Kecamatan</label>
                        <input
                          type="text"
                          required
                          value={addrDistrict}
                          onChange={(e) => setAddrDistrict(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Kota / Kabupaten</label>
                        <select
                          value={addrRegion}
                          onChange={(e) => setAddrRegion(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                        >
                          <option value="Kota Bandung">Kota Bandung</option>
                          <option value="Kabupaten Bandung">Kabupaten Bandung</option>
                          <option value="Kabupaten Sumedang">Kabupaten Sumedang</option>
                          <option value="Kabupaten Garut">Kabupaten Garut</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold mb-1">
                        Alamat Lengkap (Jalan, No. Rumah, RT/RW, Patokan)
                      </label>
                      <input
                        type="text"
                        required
                        value={addrDetail}
                        onChange={(e) => setAddrDetail(e.target.value)}
                        placeholder="Jalan Baranangsiang, Kel. Kebon Pisang..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddr(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#0055B8] text-white text-xs font-bold"
                      >
                        Simpan Alamat
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                        addr.isPrimary ? "border-[#0055B8] bg-blue-50/20" : "border-slate-200"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-slate-900">{addr.label}</span>
                          {addr.isPrimary && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0055B8] text-[10px] font-bold">
                              Alamat Utama
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-slate-700">
                          {addr.recipientName} ({addr.phone})
                        </div>
                        <p className="text-xs text-slate-500">
                          {addr.address}, Kec. {addr.district}, {addr.region}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!addr.isPrimary && (
                          <button
                            onClick={() => setPrimaryAddress(addr.id)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold hover:bg-slate-50"
                          >
                            Jadikan Utama
                          </button>
                        )}
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "notifikasi" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Kotak Masuk Notifikasi</h2>
                    <p className="text-xs text-slate-500">{myNotifs.length} notifikasi</p>
                  </div>
                  {currentUser && (
                    <button
                      onClick={() => markAllNotificationsRead(currentUser.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                    >
                      ✓ Tandai Semua Dibaca
                    </button>
                  )}
                </div>
                {myNotifs.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    Tidak ada notifikasi baru saat ini.
                  </div>
                ) : (
                  myNotifs.map((n) => (
                    <div key={n.id} className="p-4 rounded-2xl border border-slate-200 space-y-1">
                      <div className="text-xs font-extrabold text-slate-900">{n.title}</div>
                      <p className="text-xs text-slate-600">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "bantuan" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">Bantuan</h2>
                <p className="text-xs text-slate-500">
                  Layanan Pertamina Delivery Service (PDS 135) siap membantu kebutuhan LPG Non-Subsidi Anda.
                </p>
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      Pertamina Call Center 135
                    </div>
                    <div className="text-xs text-slate-600">Layanan 24 Jam Bebas Pulsa</div>
                  </div>
                  <a
                    href="tel:135"
                    className="px-5 py-2.5 rounded-full bg-[#0055B8] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Panggil 135</span>
                  </a>
                </div>
              </div>
            )}

            {tab === "syarat" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Syarat &amp; Ketentuan Layanan
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ketentuan resmi pemesanan dan distribusi LPG Non-Subsidi Pertamina Delivery Service 135.
                  </p>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-900 mb-1">1. Ketentuan Umum Pemesanan</div>
                    <p className="text-slate-600">
                      Layanan Pertamina Delivery Service (PDS 135) disediakan oleh PT Pertamina Patra Niaga melalui kemitraan agen dan pangkalan resmi terdaftar di Sales Area Retail Bandung.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-900 mb-1">
                      2. Standar Keamanan &amp; Segel DSVS
                    </div>
                    <p className="text-slate-600">
                      Semua tabung Bright Gas 5,5 Kg dan 12 Kg dilengkapi dengan katup pengaman ganda (Double Spindle Valve System) serta segel barcode hologram resmi.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-900 mb-1">
                      3. Program Trade-In (Tukar Tabung)
                    </div>
                    <p className="text-slate-600">
                      Konsumen dapat melakukan trade-in tabung 3 Kg (subsidi) menjadi tabung Bright Gas 5,5 Kg non-subsidi sesuai kebijakan kuota yang berlaku di pangkalan resmi binaan Pertamina.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-900 mb-1">
                      4. Waktu Operasional &amp; Pengantaran
                    </div>
                    <p className="text-slate-600">
                      Jam operasional pengantaran pangkalan resmi umumnya berlangsung antara pukul 07.00 – 20.00 WIB.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {tab === "privasi" && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Kebijakan Privasi</h2>
                  <p className="text-xs text-slate-500">
                    Kebijakan perlindungan data pribadi konsumen Pertamina Delivery Service 135.
                  </p>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-900 mb-1">1. Data yang Kami Kumpulkan</div>
                    <p className="text-slate-600">
                      Kami mengumpulkan informasi yang Anda berikan secara sukarela seperti nama lengkap, nomor telepon/WhatsApp, alamat rumah/tempat pengantaran, dan titik koordinat untuk keperluan navigasi kurir pangkalan resmi.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-900 mb-1">2. Penggunaan Informasi</div>
                    <p className="text-slate-600">
                      Informasi pengantaran hanya digunakan secara eksklusif untuk memproses pengiriman tabung Bright Gas ke alamat tujuan, koordinasi status pesanan kurir, serta rekapitulasi pelaporan resmi distribusi Sales Area Retail Bandung.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="font-bold text-slate-900 mb-1">
                      3. Keamanan Informasi Konsumen
                    </div>
                    <p className="text-slate-600">
                      Sistem kami menerapkan enkripsi standar industri untuk menjaga data pribadi Anda dari akses tidak sah. Kami tidak menjual atau menyewakan data pribadi konsumen kepada pihak ketiga mana pun.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}