"use client";

import React, { useState } from "react";
import { DashboardShell, NavMenuItem } from "@/components/DashboardShell";
import { InteractiveMap } from "@/components/InteractiveMap";
import { useApp } from "@/context/AppContext";
import { exportSalesToExcel, exportSalesToPDF } from "@/lib/exportUtils";
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Store,
  BarChart3,
  ShieldCheck,
  Users,
  Bell,
  Settings,
  Plus,
  Trash2,
  Download,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function PertaminaDashboardPage() {
  const {
    currentUser,
    users,
    agents,
    outlets,
    sales,
    notifications,
    addAgentByPertamina,
    deleteAgent,
    deleteOutlet,
    toggleUserStatus,
    deleteUser,
    markAllNotificationsRead,
  } = useApp();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mapRegion, setMapRegion] = useState("Semua Wilayah");
  const [auditFilter, setAuditFilter] = useState<"all" | "agen" | "outlet">("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgnName, setNewAgnName] = useState("");
  const [newAgnPic, setNewAgnPic] = useState("");
  const [newAgnPhone, setNewAgnPhone] = useState("");
  const [newAgnEmail, setNewAgnEmail] = useState("");
  const [newAgnRegion, setNewAgnRegion] = useState<
    "Kota Bandung" | "Kabupaten Bandung" | "Kabupaten Sumedang" | "Kabupaten Garut"
  >("Kota Bandung");
  const [newAgnDistrict, setNewAgnDistrict] = useState("");
  const [newAgnAddress, setNewAgnAddress] = useState("");
  const [newAgnSppbe, setNewAgnSppbe] = useState("SPPBE Padalarang");
  const [newAgnCap, setNewAgnCap] = useState(1500);

  const menuItems: NavMenuItem[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, section: "DASHBOARD" },
    { key: "peta", label: "Peta Persebaran Jaringan", icon: <MapPin className="w-4 h-4" />, section: "DASHBOARD" },
    { key: "agen", label: "Data Agen Regional", icon: <Building2 className="w-4 h-4" />, section: "DASHBOARD" },
    { key: "outlet", label: "Data Outlet", icon: <Store className="w-4 h-4" />, section: "DASHBOARD" },
    { key: "laporan", label: "Laporan Penjualan Retail", icon: <BarChart3 className="w-4 h-4" />, section: "DASHBOARD" },
    { key: "audit", label: "Audit & Database", icon: <ShieldCheck className="w-4 h-4" />, section: "DASHBOARD" },
    { key: "akun", label: "Kelola Akun & Hak Akses", icon: <Users className="w-4 h-4" />, section: "DASHBOARD" },
    { key: "notifikasi", label: "Kotak Notifikasi", icon: <Bell className="w-4 h-4" />, section: "AKUN & SISTEM" },
    { key: "pengaturan", label: "Pengaturan Akun", icon: <Settings className="w-4 h-4" />, section: "AKUN & SISTEM" },
  ];

  const totalAgentStock = agents.reduce(
    (sum, a) => sum + Object.values(a.stock).reduce((x, y) => x + y.ready, 0),
    0
  );
  const totalOutletStock = outlets.reduce(
    (sum, o) => sum + Object.values(o.stock).reduce((x, y) => x + y.ready, 0),
    0
  );
  const totalRegionalReady = totalAgentStock + totalOutletStock;
  const activeOutlets = outlets.filter((o) => o.status === "Aktif");
  const pendingOutlets = outlets.filter((o) => o.status === "Pending");
  const myNotifs = notifications.filter((n) => n.userId === currentUser?.id);

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    addAgentByPertamina({
      name: newAgnName,
      pic: newAgnPic,
      phone: newAgnPhone,
      email: newAgnEmail,
      region: newAgnRegion,
      district: newAgnDistrict || newAgnRegion,
      address: newAgnAddress,
      sppbe: newAgnSppbe,
      warehouseCapacity: newAgnCap,
    });
    setShowAddAgent(false);
    setNewAgnName("");
    setNewAgnPic("");
    setNewAgnPhone("");
    setNewAgnEmail("");
    setNewAgnAddress("");
  };

  return (
    <DashboardShell
      roleBadge="Pertamina Official HQ"
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Selamat Datang, <span className="text-[#0055B8]">{currentUser?.name || "pertaminagas"}</span> 👋
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                Ringkasan Penyaluran Wilayah
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitoring jaringan penyalur, kepatuhan agen &amp; pangkalan, serta pengawasan distribusi LPG Non-Subsidi se-Bandung Raya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">TOTAL GAS SIAP JUAL WILAYAH</div>
              <div className="text-2xl font-black text-[#0055B8]">{totalRegionalReady} Tabung</div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Target: 8.000 Tabung</span>
                <button onClick={() => setActiveTab("peta")} className="text-[#0055B8] font-bold hover:underline">
                  Peta Sebaran →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">MITRA AGEN RESMI</div>
              <div className="text-2xl font-black text-slate-900">{agents.length} Agen</div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-600 font-semibold">Wilayah Operasional</span>
                <button onClick={() => setActiveTab("agen")} className="text-[#0055B8] font-bold hover:underline">
                  Kelola Agen →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">MITRA PANGKALAN RESMI</div>
              <div className="text-2xl font-black text-slate-900">{activeOutlets.length} Aktif</div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{pendingOutlets.length} Pending Verifikasi</span>
                <button onClick={() => setActiveTab("outlet")} className="text-[#0055B8] font-bold hover:underline">
                  Kelola Pangkalan →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">REKAPITULASI PENJUALAN</div>
              <div className="text-2xl font-black text-emerald-600">{sales.length} Transaksi</div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Total {sales.reduce((a, b) => a + b.quantity, 0)} Tabung</span>
                <button onClick={() => setActiveTab("laporan")} className="text-emerald-600 font-bold hover:underline">
                  Audit Penjualan →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Daftar Mitra Penyalur Terdaftar</h3>
                <p className="text-xs text-slate-500">Data operasional terkini dari seluruh Gudang Agen dan Pangkalan Resmi terverifikasi.</p>
              </div>
              <button
                onClick={() => setActiveTab("peta")}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                Buka Peta Persebaran
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-2">NAMA PENYALUR</th>
                    <th className="py-3 px-2">TIPE</th>
                    <th className="py-3 px-2">WILAYAH &amp; KECAMATAN</th>
                    <th className="py-3 px-2">AGEN INDUK / SPPBE</th>
                    <th className="py-3 px-2">GAS SIAP JUAL</th>
                    <th className="py-3 px-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agents.map((a) => (
                    <tr key={a.id}>
                      <td className="py-3 px-2 font-bold text-slate-900">{a.name}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0055B8] text-[10px] font-bold">AGEN INDUK</span>
                      </td>
                      <td className="py-3 px-2">{a.region} • {a.district}</td>
                      <td className="py-3 px-2">{a.sppbe}</td>
                      <td className="py-3 px-2 font-extrabold text-[#0055B8]">
                        {Object.values(a.stock).reduce((x, y) => x + y.ready, 0)} Tabung
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">● Valid</span>
                      </td>
                    </tr>
                  ))}
                  {outlets.map((o) => {
                    const parent = agents.find((a) => a.id === o.agentId);
                    const tbg = Object.values(o.stock).reduce((x, y) => x + y.ready, 0);
                    return (
                      <tr key={o.id}>
                        <td className="py-3 px-2 font-bold text-slate-900">{o.name}</td>
                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">PANGKALAN</span>
                        </td>
                        <td className="py-3 px-2">{o.region} • {o.district}</td>
                        <td className="py-3 px-2">{parent?.name || "-"}</td>
                        <td className="py-3 px-2 font-bold">{tbg} Tabung</td>
                        <td className="py-3 px-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            ● {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "peta" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Peta Persebaran Jaringan Distribusi LPG</h2>
              <p className="text-xs text-slate-500">Peta lokasi seluruh Gudang Agen Resmi (Biru) dan Pangkalan Resmi Aktif (Merah) di wilayah Sales Area Retail Bandung.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Semua Wilayah", "Kota Bandung", "Kabupaten Bandung", "Kabupaten Sumedang", "Kabupaten Garut"].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setMapRegion(reg)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    mapRegion === reg ? "bg-[#0055B8] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
          <InteractiveMap
            agents={agents.filter((a) => mapRegion === "Semua Wilayah" || a.region === mapRegion)}
            outlets={activeOutlets.filter((o) => mapRegion === "Semua Wilayah" || o.region === mapRegion)}
            heightClass="h-[480px]"
          />
        </div>
      )}

      {activeTab === "agen" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Pengelolaan Data Agen</h2>
              <p className="text-xs text-slate-500">{agents.length} agen terdaftar di Sales Area Retail Bandung</p>
            </div>
            <button
              onClick={() => setShowAddAgent(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Agen</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-2">AGEN</th>
                  <th className="py-3 px-2">WILAYAH</th>
                  <th className="py-3 px-2">PIC &amp; KONTAK</th>
                  <th className="py-3 px-2">OUTLET</th>
                  <th className="py-3 px-2">STOK READY</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agents.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 px-2">
                      <div className="font-bold text-slate-900">{a.name}</div>
                      <div className="text-[10px] text-slate-400">{a.regCode}</div>
                    </td>
                    <td className="py-3 px-2">{a.region} • {a.district}</td>
                    <td className="py-3 px-2">
                      <div className="font-bold">{a.pic}</div>
                      <div className="text-[11px] text-slate-500">{a.phone}</div>
                    </td>
                    <td className="py-3 px-2 font-bold">
                      {outlets.filter((o) => o.agentId === a.id).length}
                    </td>
                    <td className="py-3 px-2 font-extrabold text-[#0055B8]">
                      {Object.values(a.stock).reduce((x, y) => x + y.ready, 0)}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => deleteAgent(a.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "outlet" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Pengelolaan Data Outlet</h2>
            <p className="text-xs text-slate-500">{outlets.length} outlet terdaftar • {activeOutlets.length} aktif</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-2">OUTLET</th>
                  <th className="py-3 px-2">AGEN PEMBINA</th>
                  <th className="py-3 px-2">LOKASI</th>
                  <th className="py-3 px-2">STOK READY</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outlets.map((o) => {
                  const parent = agents.find((a) => a.id === o.agentId);
                  return (
                    <tr key={o.id}>
                      <td className="py-3 px-2">
                        <div className="font-bold text-slate-900">{o.name}</div>
                        <div className="text-[10px] text-slate-400">{o.regCode}</div>
                      </td>
                      <td className="py-3 px-2">{parent?.name || "-"}</td>
                      <td className="py-3 px-2">{o.district}, {o.region}</td>
                      <td className="py-3 px-2 font-extrabold text-[#0055B8]">
                        {Object.values(o.stock).reduce((x, y) => x + y.ready, 0)}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => deleteOutlet(o.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "laporan" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Monitoring Penjualan Agen</h2>
              <p className="text-xs text-slate-500">Seluruh Agen &amp; Outlet Sales Area Retail Bandung</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await exportSalesToExcel(
                    sales,
                    "Laporan Rekapitulasi Penjualan Seluruh Agen — SA Retail Bandung",
                    "Laporan_Penjualan_Pertamina_Bandung.xlsx"
                  );
                  toast.success("Berkas Excel (.xlsx) berhasil diunduh!");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A651] text-white text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Excel</span>
              </button>
              <button
                onClick={() => {
                  exportSalesToPDF(
                    sales,
                    "Laporan Penjualan Retail LPG NPSO",
                    "Seluruh Agen & Outlet Sales Area Retail Bandung",
                    "Laporan_Penjualan_Pertamina_Bandung.pdf"
                  );
                  toast.success("Berkas PDF resmi berhasil diunduh!");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                <span>Ekspor PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400">TOTAL TRANSAKSI</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{sales.length}</div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400">TABUNG TERJUAL</div>
              <div className="text-2xl font-black text-[#0055B8] mt-1">
                {sales.reduce((a, b) => a + b.quantity, 0)} Tbg
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400">NILAI PENJUALAN</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                Rp {sales.reduce((a, b) => a + b.total, 0).toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">Detail Transaksi Penjualan</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-2">TANGGAL</th>
                  <th className="py-3 px-2">OUTLET</th>
                  <th className="py-3 px-2">AGEN</th>
                  <th className="py-3 px-2">PRODUK</th>
                  <th className="py-3 px-2">JML</th>
                  <th className="py-3 px-2 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-2 text-slate-500">{s.date}</td>
                    <td className="py-3 px-2 font-bold">{s.outletName}</td>
                    <td className="py-3 px-2">{s.agentName}</td>
                    <td className="py-3 px-2">{s.productName}</td>
                    <td className="py-3 px-2 font-bold">{s.quantity} Tbg</td>
                    <td className="py-3 px-2 text-right font-extrabold text-[#0055B8]">
                      Rp {s.total.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Buku Data Penyalur &amp; Kepatuhan Distribusi
              </h2>
              <p className="text-xs text-slate-500">
                Pemantauan status resmi mitra, ketersediaan tabung gas, dan kepatuhan harga penjualan.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setAuditFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  auditFilter === "all" ? "bg-[#0055B8] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Semua Entitas
              </button>
              <button
                onClick={() => setAuditFilter("agen")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  auditFilter === "agen" ? "bg-[#0055B8] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Agen ({agents.length})
              </button>
              <button
                onClick={() => setAuditFilter("outlet")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  auditFilter === "outlet" ? "bg-[#0055B8] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Pangkalan ({outlets.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-2">ID REGISTRASI</th>
                  <th className="py-3 px-2">NAMA PENYALUR &amp; PIC</th>
                  <th className="py-3 px-2">WILAYAH</th>
                  <th className="py-3 px-2">GAS TERSEDIA / KOSONG / RUSAK</th>
                  <th className="py-3 px-2">STATUS KEPATUHAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditFilter !== "outlet" &&
                  agents.map((a) => {
                    const ready = Object.values(a.stock).reduce((x, y) => x + y.ready, 0);
                    const empty = Object.values(a.stock).reduce((x, y) => x + y.empty, 0);
                    const quar = Object.values(a.stock).reduce((x, y) => x + y.quarantine, 0);
                    return (
                      <tr key={a.id}>
                        <td className="py-3 px-2 font-mono font-bold text-[#0055B8]">{a.regCode}</td>
                        <td className="py-3 px-2">
                          <div className="font-bold">{a.name}</div>
                          <div className="text-[10px] text-slate-500">Manager: {a.pic}</div>
                        </td>
                        <td className="py-3 px-2">{a.region} ({a.district})</td>
                        <td className="py-3 px-2">
                          <span className="text-emerald-600 font-bold">{ready} Isi</span> • {empty} Kosong •{" "}
                          <span className="text-red-600">{quar} Rusak</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            MITRA RESMI TERVERIFIKASI
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                {auditFilter !== "agen" &&
                  outlets.map((o) => {
                    const ready = Object.values(o.stock).reduce((x, y) => x + y.ready, 0);
                    const empty = Object.values(o.stock).reduce((x, y) => x + y.empty, 0);
                    const quar = Object.values(o.stock).reduce((x, y) => x + y.quarantine, 0);
                    return (
                      <tr key={o.id}>
                        <td className="py-3 px-2 font-mono font-bold text-slate-800">{o.regCode}</td>
                        <td className="py-3 px-2">
                          <div className="font-bold">{o.name}</div>
                          <div className="text-[10px] text-slate-500">PIC: {o.pic}</div>
                        </td>
                        <td className="py-3 px-2">{o.region} ({o.district})</td>
                        <td className="py-3 px-2">
                          <span className="text-emerald-600 font-bold">{ready} Isi</span> • {empty} Kosong •{" "}
                          <span className="text-red-600">{quar} Rusak</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            AKTIF • HARGA JUAL SESUAI HET
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "akun" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Daftar Akun Pengguna Sistem ({users.length} Akun)
              </h2>
              <p className="text-xs text-slate-500">
                Manajemen hak akses, aktivasi status, dan pengelolaan akun pengguna sistem.
              </p>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
            >
              <option value="all">Semua Peran</option>
              <option value="pertamina">Pertamina</option>
              <option value="agen">Agen</option>
              <option value="outlet">Outlet</option>
              <option value="konsumen">Konsumen</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-2">PENGGUNA &amp; KONTAK</th>
                  <th className="py-3 px-2">EMAIL</th>
                  <th className="py-3 px-2">PERAN (ROLE)</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users
                  .filter((u) => roleFilter === "all" || u.role === roleFilter)
                  .map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 px-2">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.phone}</div>
                      </td>
                      <td className="py-3 px-2">{u.email}</td>
                      <td className="py-3 px-2">
                        <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === "Aktif"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-1.5">
                        {u.role !== "pertamina" && (
                          <>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold text-[11px]"
                            >
                              {u.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "notifikasi" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Kotak Masuk Notifikasi ({myNotifs.length})
            </h2>
            {currentUser && (
              <button
                onClick={() => markAllNotificationsRead(currentUser.id)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
              >
                ✓ Tandai Semua Dibaca
              </button>
            )}
          </div>
          {myNotifs.map((n) => (
            <div key={n.id} className="p-4 rounded-2xl border border-slate-200 space-y-1">
              <div className="text-xs font-extrabold text-slate-900">{n.title}</div>
              <p className="text-xs text-slate-600">{n.message}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "pengaturan" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Biodata Pejabat Pengawas Pertamina
            </h2>
            <p className="text-xs text-slate-500">
              Informasi identitas pengawas Sales Area Retail Bandung PT Pertamina Patra Niaga.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Nama Lengkap &amp; Gelar</label>
              <input
                type="text"
                defaultValue={currentUser?.name || "pertaminagas"}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">NIP / Employee ID</label>
              <input
                type="text"
                defaultValue="19840512 200812 1 002"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Jabatan Struktural</label>
              <input
                type="text"
                defaultValue="Sales Area Manager Retail Bandung"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Unit Kerja / Sales Area</label>
              <input
                type="text"
                defaultValue="SAM Retail Bandung Raya & Priangan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
          </div>
          <button
            onClick={() => toast.success("Biodata pengawas Pertamina berhasil disimpan!")}
            className="px-6 py-3 rounded-xl bg-[#0055B8] text-white text-xs font-bold"
          >
            Simpan Biodata Pengawas
          </button>
        </div>
      )}

      {showAddAgent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">Tambah Mitra Agen Resmi</h3>
              <button onClick={() => setShowAddAgent(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateAgent} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Nama Badan Usaha Agen (PT / CV)"
                value={newAgnName}
                onChange={(e) => setNewAgnName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nama PIC / Direktur"
                  value={newAgnPic}
                  onChange={(e) => setNewAgnPic(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  required
                  placeholder="No. Telepon"
                  value={newAgnPhone}
                  onChange={(e) => setNewAgnPhone(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email Resmi Agen"
                  value={newAgnEmail}
                  onChange={(e) => setNewAgnEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
                <select
                  value={newAgnRegion}
                  onChange={(e) => setNewAgnRegion(e.target.value as any)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Kota Bandung">Kota Bandung</option>
                  <option value="Kabupaten Bandung">Kabupaten Bandung</option>
                  <option value="Kabupaten Sumedang">Kabupaten Sumedang</option>
                  <option value="Kabupaten Garut">Kabupaten Garut</option>
                </select>
              </div>
              <input
                type="text"
                required
                placeholder="Alamat Lengkap Gudang Agen"
                value={newAgnAddress}
                onChange={(e) => setNewAgnAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAgent(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0055B8] text-white font-bold"
                >
                  Simpan Agen Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
