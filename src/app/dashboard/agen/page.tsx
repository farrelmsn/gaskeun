"use client";

import React, { useState } from "react";
import { DashboardShell, NavMenuItem } from "@/components/DashboardShell";
import { InteractiveMap } from "@/components/InteractiveMap";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/mockData";
import { exportSalesToExcel, exportSalesToPDF, exportSuratJalanPDF } from "@/lib/exportUtils";
import { ProductKey, StockDetail, StockTransferDO, StockRequestItem } from "@/types";
import {
  LayoutDashboard,
  Store,
  Truck,
  ClipboardList,
  CheckCircle2,
  BarChart3,
  Bell,
  Settings,
  AlertTriangle,
  FileText,
  X,
  Send,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function AgenDashboardPage() {
  const {
    currentUser,
    agents,
    outlets,
    stockRequests,
    transfers,
    sales,
    notifications,
    updateAgentWarehouseStock,
    updateAgentProfile,
    createTransferDO,
    processStockRequest,
    approveOrRejectOutlet,
    markAllNotificationsRead,
  } = useApp();

  const [activeTab, setActiveTab] = useState("dashboard");

  const agent =
    agents.find((a) => a.userId === currentUser?.id) ||
    agents.find((a) => a.email === "pijarcahaya@gmail.com") ||
    agents[0];

  const supervisedOutlets = outlets.filter((o) => o.agentId === agent.id);
  const activeSupervised = supervisedOutlets.filter((o) => o.status === "Aktif");
  const pendingOutlets = supervisedOutlets.filter((o) => o.status === "Pending");
  const myRequests = stockRequests.filter((r) => r.agentId === agent.id);
  const pendingRequests = myRequests.filter((r) => r.status === "Diajukan");
  const myTransfers = transfers.filter((t) => t.agentId === agent.id);
  const mySales = sales.filter((s) => s.agentId === agent.id);
  const myNotifs = notifications.filter((n) => n.userId === currentUser?.id);

  // Warehouse Stock Draft
  const [whDraft, setWhDraft] = useState<Record<ProductKey, StockDetail>>(agent.stock);

  // Transfer DO Form
  const [targetOutletId, setTargetOutletId] = useState(activeSupervised[0]?.id || "");
  const [doItems, setDoItems] = useState<Record<ProductKey, number>>({
    bg55: 0,
    bg12: 0,
    canister220: 0,
    elpiji50: 0,
  });
  const [driverNote, setDriverNote] = useState("");
  const [selectedSuratJalan, setSelectedSuratJalan] = useState<StockTransferDO | null>(null);

  // Request Detail / Reject Modal
  const [detailReq, setDetailReq] = useState<StockRequestItem | null>(null);
  const [rejectReq, setRejectReq] = useState<StockRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Profile Tab Submenu
  const [profSub, setProfSub] = useState<"biodata" | "peta" | "keamanan">("biodata");
  const [agnName, setAgnName] = useState(agent.name);
  const [agnPic, setAgnPic] = useState(agent.pic);
  const [agnPhone, setAgnPhone] = useState(agent.phone);
  const [agnHours, setAgnHours] = useState(agent.operatingHours);
  const [agnCap, setAgnCap] = useState(agent.warehouseCapacity);
  const [agnAddr, setAgnAddr] = useState(agent.address);

  const menuItems: NavMenuItem[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, section: "OPERASIONAL GUDANG & OUTLET" },
    { key: "binaan", label: "Outlet Binaan", icon: <Store className="w-4 h-4" />, section: "OPERASIONAL GUDANG & OUTLET" },
    { key: "transfer", label: "Transfer Stok DO", icon: <Truck className="w-4 h-4" />, section: "OPERASIONAL GUDANG & OUTLET" },
    { key: "permintaan", label: "Permintaan Stok Masuk", icon: <ClipboardList className="w-4 h-4" />, section: "OPERASIONAL GUDANG & OUTLET" },
    { key: "approval", label: "Approval Outlet Baru", icon: <CheckCircle2 className="w-4 h-4" />, section: "OPERASIONAL GUDANG & OUTLET" },
    { key: "laporan", label: "Laporan Penjualan Wilayah", icon: <BarChart3 className="w-4 h-4" />, section: "OPERASIONAL GUDANG & OUTLET" },
    { key: "notifikasi", label: "Kotak Notifikasi", icon: <Bell className="w-4 h-4" />, section: "AKUN & SISTEM" },
    { key: "profil", label: "Pengaturan Akun", icon: <Settings className="w-4 h-4" />, section: "AKUN & SISTEM" },
  ];

  const totalWhReady = Object.values(agent.stock).reduce((a, b) => a + b.ready, 0);
  const totalWhEmpty = Object.values(agent.stock).reduce((a, b) => a + b.empty, 0);
  const totalWhQuarantine = Object.values(agent.stock).reduce((a, b) => a + b.quarantine, 0);
  const totalOutletReady = activeSupervised.reduce(
    (sum, o) => sum + Object.values(o.stock).reduce((a, b) => a + b.ready, 0),
    0
  );

  const criticalOutlets = activeSupervised.filter(
    (o) => Object.values(o.stock).reduce((a, b) => a + b.ready, 0) < 25
  );

  const totalDoQty = Object.values(doItems).reduce((a, b) => a + b, 0);

  return (
    <DashboardShell
      roleBadge="Agen Resmi"
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* TAB: DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Selamat Datang, <span className="text-[#0055B8]">{agent.name}</span> 👋
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                Ringkasan Gudang Agen
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kontrol stok gudang induk, persetujuan permohonan pangkalan baru di wilayah Anda, serta pemantauan jaringan pangkalan binaan.
            </p>
          </div>

          {/* Low Stock Warning Banner */}
          {criticalOutlets.length > 0 && (
            <div className="rounded-3xl bg-amber-50/80 border border-amber-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Peringatan Pasokan: {criticalOutlets.length} Pangkalan Memerlukan Dropping Stok
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Segera jadwalkan pengiriman stok (DO) agar pasokan energi masyarakat tetap lancar.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalOutlets.map((co) => {
                  const tbg = Object.values(co.stock).reduce((a, b) => a + b.ready, 0);
                  return (
                    <div key={co.id} className="bg-white rounded-2xl border border-amber-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">{co.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {co.district} • PIC: {co.pic}
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold">
                          Total: {tbg} Tabung
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setTargetOutletId(co.id);
                          setActiveTab("transfer");
                        }}
                        className="w-full py-2 rounded-xl bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-bold"
                      >
                        Kirim Pasokan (DO)
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                STOK GAS DI GUDANG AGEN
              </div>
              <div className="text-2xl font-black text-[#0055B8]">{totalWhReady} Tabung</div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Kapasitas: {agent.warehouseCapacity.toLocaleString("id-ID")} Tabung</span>
                <button
                  onClick={() => setActiveTab("transfer")}
                  className="text-[#0055B8] font-bold hover:underline"
                >
                  Kirim Pasokan DO →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                MITRA PANGKALAN BINAAN
              </div>
              <div className="text-2xl font-black text-slate-900">
                {activeSupervised.length} Aktif
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-600 font-semibold">Wilayah {agent.region}</span>
                <button
                  onClick={() => setActiveTab("binaan")}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Kelola Pangkalan →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                TOTAL GAS SIAP JUAL DI PANGKALAN
              </div>
              <div className="text-2xl font-black text-emerald-600">{totalOutletReady} Tabung</div>
              <div className="text-xs text-slate-500">Akumulasi di seluruh pangkalan</div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                PESANAN MASUK DARI PANGKALAN
              </div>
              <div className="text-2xl font-black text-slate-900">
                {pendingRequests.length} Permintaan
              </div>
              <button
                onClick={() => setActiveTab("permintaan")}
                className="text-xs text-[#0055B8] font-bold hover:underline"
              >
                Buka Pesanan →
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                PERMOHONAN PANGKALAN BARU
              </div>
              <div className="text-2xl font-black text-amber-600">
                {pendingOutlets.length} Permohonan
              </div>
              <button
                onClick={() => setActiveTab("approval")}
                className="text-xs text-amber-600 font-bold hover:underline"
              >
                Buka Verifikasi →
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-1.5">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                TABUNG KOSONG &amp; RUSAK
              </div>
              <div className="text-2xl font-black text-slate-900">{totalWhEmpty} Kosong</div>
              <div className="text-xs text-red-600 font-semibold">
                Rusak / Karantina: {totalWhQuarantine} Tabung
              </div>
            </div>
          </div>

          {/* Warehouse Stock Management Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Pengelolaan Stok Gudang Agen — {agent.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Pembaruan jumlah tabung gas siap jual, tabung kosong siap tukar, dan tabung rusak di gudang agen.
                </p>
              </div>
              <button
                onClick={() => updateAgentWarehouseStock(agent.id, whDraft)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Simpan Stok Gudang
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-2">VARIAN PRODUK GAS</th>
                    <th className="py-3 px-2">HARGA JUAL</th>
                    <th className="py-3 px-2">GAS SIAP JUAL</th>
                    <th className="py-3 px-2">TABUNG KOSONG</th>
                    <th className="py-3 px-2">TABUNG RUSAK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRODUCTS.map((p) => {
                    const row = whDraft[p.key];
                    return (
                      <tr key={p.key}>
                        <td className="py-3 px-2 font-bold text-slate-900">{p.shortName}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">Rp</span>
                            <input
                              type="number"
                              value={row.price}
                              onChange={(e) =>
                                setWhDraft({
                                  ...whDraft,
                                  [p.key]: { ...row, price: Number(e.target.value) },
                                })
                              }
                              className="w-28 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            value={row.ready}
                            onChange={(e) =>
                              setWhDraft({
                                ...whDraft,
                                [p.key]: { ...row, ready: Number(e.target.value) },
                              })
                            }
                            className="w-20 px-3 py-1.5 rounded-xl bg-blue-50/60 border border-blue-200 font-extrabold text-[#0055B8]"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            value={row.empty}
                            onChange={(e) =>
                              setWhDraft({
                                ...whDraft,
                                [p.key]: { ...row, empty: Number(e.target.value) },
                              })
                            }
                            className="w-20 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <input
                            type="number"
                            value={row.quarantine}
                            onChange={(e) =>
                              setWhDraft({
                                ...whDraft,
                                [p.key]: { ...row, quarantine: Number(e.target.value) },
                              })
                            }
                            className="w-20 px-3 py-1.5 rounded-xl bg-red-50/50 border border-red-200 font-semibold text-red-600"
                          />
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

      {/* TAB: OUTLET BINAAN & PETA */}
      {activeTab === "binaan" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Peta Sebaran Pangkalan Binaan — Wilayah {agent.region}
              </h2>
              <p className="text-xs text-slate-500">
                Menampilkan titik Gudang {agent.name} beserta seluruh pangkalan aktif yang bekerja sama.
              </p>
            </div>
            <InteractiveMap agents={[agent]} outlets={activeSupervised} heightClass="h-[360px]" />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900">
              Daftar Pangkalan Binaan ({activeSupervised.length} Titik)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-2">ID &amp; NAMA PANGKALAN</th>
                    <th className="py-3 px-2">KECAMATAN &amp; ALAMAT</th>
                    <th className="py-3 px-2">PENANGGUNG JAWAB &amp; WA</th>
                    <th className="py-3 px-2">GAS SIAP JUAL</th>
                    <th className="py-3 px-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeSupervised.map((o) => {
                    const tbg = Object.values(o.stock).reduce((a, b) => a + b.ready, 0);
                    return (
                      <tr key={o.id}>
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">{o.name}</div>
                          <div className="text-[10px] text-slate-400">{o.regCode}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-semibold">
                            {o.district}, {o.region}
                          </div>
                          <div className="text-[11px] text-slate-500">{o.address}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-bold">{o.pic}</div>
                          <div className="text-[11px] text-emerald-600">{o.phone}</div>
                        </td>
                        <td className="py-3 px-2 font-extrabold text-[#0055B8]">{tbg} Tabung</td>
                        <td className="py-3 px-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            {o.status}
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

      {/* TAB: TRANSFER STOK DO */}
      {activeTab === "transfer" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Kirim Pasokan Gas ke Pangkalan Binaan
                </h2>
                <p className="text-xs text-slate-500">
                  Stok gudang agen otomatis disesuaikan dan stok siap jual pangkalan bertambah.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0055B8] text-xs font-bold">
                Total: {totalDoQty} Tabung
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Pangkalan Tujuan Pengiriman
              </label>
              <select
                value={targetOutletId}
                onChange={(e) => setTargetOutletId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
              >
                {activeSupervised.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.regCode}) — Kec. {o.district}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCTS.map((p) => (
                <div key={p.key} className="p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold">{p.shortName}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold">
                      Stok: {agent.stock[p.key].ready}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={agent.stock[p.key].ready}
                    value={doItems[p.key]}
                    onChange={(e) =>
                      setDoItems({ ...doItems, [p.key]: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Catatan Pengiriman / Armada Truk / Driver
              </label>
              <input
                type="text"
                value={driverNote}
                onChange={(e) => setDriverNote(e.target.value)}
                placeholder="Contoh: Truk Pick Up D 1234 XY • Driver Pak Yanto"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>

            <div className="flex justify-end">
              <button
                disabled={totalDoQty <= 0}
                onClick={() => {
                  const ok = createTransferDO({
                    agentId: agent.id,
                    outletId: targetOutletId,
                    items: doItems,
                    driverNote,
                  });
                  if (ok) {
                    setDoItems({ bg55: 0, bg12: 0, canister220: 0, elpiji50: 0 });
                    setDriverNote("");
                  }
                }}
                className={`px-6 py-3 rounded-xl text-xs font-bold transition ${
                  totalDoQty > 0
                    ? "bg-[#0055B8] hover:bg-[#003B82] text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Kirim Pasokan Gas ({totalDoQty} Tabung) ke Pangkalan
              </button>
            </div>
          </div>

          {/* Riwayat Surat Jalan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900">
              Riwayat Surat Jalan Pengiriman ke Pangkalan ({myTransfers.length} Surat Jalan)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-2">NO SURAT JALAN</th>
                    <th className="py-3 px-2">WAKTU PENGIRIMAN</th>
                    <th className="py-3 px-2">PANGKALAN TUJUAN</th>
                    <th className="py-3 px-2">TOTAL PASOKAN</th>
                    <th className="py-3 px-2">STATUS</th>
                    <th className="py-3 px-2 text-right">AKSI DOKUMEN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myTransfers.map((trf) => (
                    <tr key={trf.id}>
                      <td className="py-3 px-2 font-mono font-bold text-[#0055B8]">{trf.docNo}</td>
                      <td className="py-3 px-2 text-slate-500">{trf.date}</td>
                      <td className="py-3 px-2 font-bold">{trf.outletName}</td>
                      <td className="py-3 px-2 font-bold">
                        {Object.values(trf.items).reduce((a, b) => a + b, 0)} Tabung
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          {trf.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => setSelectedSuratJalan(trf)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Lihat Surat Jalan</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PERMINTAAN STOK MASUK */}
      {activeTab === "permintaan" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Pesanan Masuk dari Pangkalan Binaan ({myRequests.length} Pesanan)
              </h2>
              <p className="text-xs text-slate-500">
                Kelola pesanan pasokan tabung gas dari mitra pangkalan resmi di bawah naungan {agent.name}.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0055B8] text-xs font-bold">
              {pendingRequests.length} Perlu Diproses
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-2">NO PESANAN</th>
                  <th className="py-3 px-2">PANGKALAN PEMOHON</th>
                  <th className="py-3 px-2">VARIAN &amp; JUMLAH</th>
                  <th className="py-3 px-2">PRIORITAS</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myRequests.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 px-2 font-mono font-bold">{r.ticketNo}</td>
                    <td className="py-3 px-2 font-bold text-slate-900">{r.outletName}</td>
                    <td className="py-3 px-2">
                      4 Varian ({Object.values(r.items).reduce((a, b) => a + b, 0)} Tbg)
                    </td>
                    <td className="py-3 px-2">{r.priority}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === "Disetujui"
                            ? "bg-emerald-50 text-emerald-700"
                            : r.status === "Ditolak"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-1.5">
                      <button
                        onClick={() => setDetailReq(r)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 font-bold"
                      >
                        Detail
                      </button>
                      {r.status === "Diajukan" && (
                        <>
                          <button
                            onClick={() => processStockRequest(r.id, "Disetujui")}
                            className="px-3 py-1 rounded-lg bg-[#00A651] text-white font-bold"
                          >
                            ✓ Setujui
                          </button>
                          <button
                            onClick={() => setRejectReq(r)}
                            className="px-3 py-1 rounded-lg bg-red-50 text-red-600 font-bold"
                          >
                            ✕ Tolak
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

      {/* TAB: APPROVAL OUTLET BARU */}
      {activeTab === "approval" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Verifikasi &amp; Persetujuan Pangkalan Baru — Regional {agent.region}
              </h2>
              <p className="text-xs text-slate-500">
                Verifikasi pendaftaran pangkalan resmi di bawah naungan {agent.name}.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
              {pendingOutlets.length} Menunggu Verifikasi
            </span>
          </div>

          {pendingOutlets.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="text-sm font-extrabold text-slate-900">
                Seluruh Permohonan Pangkalan di Wilayah {agent.region} Telah Diproses
              </div>
              <p className="text-xs text-slate-500">
                Tidak ada antrean pangkalan baru yang menunggu verifikasi saat ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOutlets.map((po) => (
                <div
                  key={po.id}
                  className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">{po.name}</div>
                    <div className="text-xs text-slate-500">
                      PIC: {po.pic} • {po.phone} • {po.address}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveOrRejectOutlet(po.id, "Aktif")}
                      className="px-4 py-2 rounded-xl bg-[#00A651] text-white text-xs font-bold"
                    >
                      Setujui &amp; Aktifkan
                    </button>
                    <button
                      onClick={() => approveOrRejectOutlet(po.id, "Tidak Aktif")}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: LAPORAN PENJUALAN WILAYAH */}
      {activeTab === "laporan" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Monitoring Penjualan Outlet Binaan
              </h2>
              <p className="text-xs text-slate-500">{agent.name} — seluruh outlet binaan</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  toast.success(
                    "Rekapitulasi penjualan agen berhasil dikirim ke PT Pertamina Patra Niaga!"
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim ke Pertamina</span>
              </button>
              <button
                onClick={async () => { await exportSalesToExcel(mySales, `Laporan Penjualan Wilayah - ${agent.name}`, "Laporan_Penjualan_Agen.xlsx"); toast.success("Berkas Excel (.xlsx) berhasil diunduh!"); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A651] text-white text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Excel</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400">TOTAL TRANSAKSI</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{mySales.length}</div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400">TABUNG TERJUAL</div>
              <div className="text-2xl font-black text-[#0055B8] mt-1">
                {mySales.reduce((a, b) => a + b.quantity, 0)} Tbg
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase text-slate-400">NILAI PENJUALAN</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                Rp {mySales.reduce((a, b) => a + b.total, 0).toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">
              Detail Transaksi Penjualan Outlet Binaan
            </h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-2">TANGGAL</th>
                  <th className="py-3 px-2">OUTLET</th>
                  <th className="py-3 px-2">PRODUK</th>
                  <th className="py-3 px-2">JML</th>
                  <th className="py-3 px-2 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mySales.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-2 text-slate-500">{s.date}</td>
                    <td className="py-3 px-2 font-bold">{s.outletName}</td>
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

      {/* TAB: NOTIFIKASI */}
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

      {/* TAB: PENGATURAN AKUN */}
      {activeTab === "profil" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {(["biodata", "peta", "keamanan"] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setProfSub(sub)}
                className={`px-4 py-2 rounded-full text-xs font-bold ${
                  profSub === sub ? "bg-[#0055B8] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {sub === "biodata"
                  ? "Data Biodata & Profil"
                  : sub === "peta"
                  ? "Titik Peta & Operasional"
                  : "Keamanan Akun"}
              </button>
            ))}
          </div>

          {profSub === "biodata" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateAgentProfile(agent.id, {
                  name: agnName,
                  pic: agnPic,
                  phone: agnPhone,
                  operatingHours: agnHours,
                  warehouseCapacity: agnCap,
                  address: agnAddr,
                });
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Nama Badan Usaha Agen (PT / CV)</label>
                  <input
                    type="text"
                    value={agnName}
                    onChange={(e) => setAgnName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Nama Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    value={agnPic}
                    onChange={(e) => setAgnPic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">No. Telepon / Hotline Operasional</label>
                  <input
                    type="text"
                    value={agnPhone}
                    onChange={(e) => setAgnPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Kapasitas Gudang Induk (Tabung)</label>
                  <input
                    type="number"
                    value={agnCap}
                    onChange={(e) => setAgnCap(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Alamat Lengkap Gudang Agen</label>
                <input
                  type="text"
                  value={agnAddr}
                  onChange={(e) => setAgnAddr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#0055B8] text-white font-bold"
              >
                Simpan Perubahan Agen
              </button>
            </form>
          )}

          {profSub === "peta" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Titik Koordinat Gudang: <strong>LAT {agent.lat}</strong>,{" "}
                <strong>LNG {agent.lng}</strong>
              </div>
              <InteractiveMap agents={[agent]} outlets={[]} heightClass="h-[320px]" />
            </div>
          )}

          {profSub === "keamanan" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Kata sandi akun agen berhasil diperbarui!");
              }}
              className="space-y-3 max-w-md text-xs"
            >
              <div>
                <label className="block font-bold mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  minLength={6}
                  required
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#0055B8] text-white font-bold">
                Perbarui Kata Sandi
              </button>
            </form>
          )}
        </div>
      )}

      {/* MODAL: SURAT JALAN PENGIRIMAN */}
      {selectedSuratJalan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="text-[10px] font-extrabold text-[#ED1C24] tracking-wider">
                  PT PERTAMINA PATRA NIAGA | DISTRIBUSI RESMI LPG NON-SUBSIDI
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  SURAT JALAN PENGIRIMAN LPG NON-SUBSIDI
                </h3>
                <div className="text-xs text-slate-500">
                  No. Dokumen: <strong className="text-[#0055B8]">{selectedSuratJalan.docNo}</strong> •{" "}
                  {selectedSuratJalan.date}
                </div>
              </div>
              <button onClick={() => setSelectedSuratJalan(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400">PENGIRIM (AGEN RESMI):</div>
                <div className="font-extrabold text-slate-900">{selectedSuratJalan.agentName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{agent.address}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400">PENERIMA (PANGKALAN):</div>
                <div className="font-extrabold text-slate-900">{selectedSuratJalan.outletName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Armada: {selectedSuratJalan.driverNote}
                </div>
              </div>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400">
                  <th className="py-2">KODE SKU</th>
                  <th className="py-2">VARIAN PRODUK</th>
                  <th className="py-2">KONDISI</th>
                  <th className="py-2 text-right">JUMLAH (TABUNG)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PRODUCTS.map((p) => (
                  <tr key={p.key}>
                    <td className="py-2 font-mono text-[11px]">{p.sku}</td>
                    <td className="py-2 font-bold">{p.shortName}</td>
                    <td className="py-2 text-emerald-600 font-bold">Ready</td>
                    <td className="py-2 text-right font-extrabold text-[#0055B8]">
                      {selectedSuratJalan.items[p.key]} Tabung
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedSuratJalan(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  if (selectedSuratJalan) { exportSuratJalanPDF(selectedSuratJalan, agent); toast.success("Surat Jalan PDF berhasil diunduh!"); }
                }}
                className="px-5 py-2 rounded-xl bg-[#0055B8] text-white text-xs font-bold"
              >
                Download / Cetak PDF Resmi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL PERMINTAAN STOK */}
      {detailReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
                {detailReq.status}
              </span>
              <button onClick={() => setDetailReq(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Permintaan Restock Multi-Varian — {detailReq.outletName}
            </h3>
            <div className="space-y-2 text-xs">
              {PRODUCTS.map((p) => (
                <div
                  key={p.key}
                  className="p-3 rounded-xl border border-slate-100 flex justify-between"
                >
                  <span className="font-bold">{p.shortName}</span>
                  <span className="font-extrabold text-[#0055B8]">
                    {detailReq.items[p.key]} Tabung
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDetailReq(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Tutup
              </button>
              {detailReq.status === "Diajukan" && (
                <button
                  onClick={() => {
                    processStockRequest(detailReq.id, "Disetujui");
                    setDetailReq(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#00A651] text-white text-xs font-bold"
                >
                  Setujui Permintaan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TOLAK PERMINTAAN STOK */}
      {rejectReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">
              Tolak Pesanan Pasokan: {rejectReq.ticketNo}
            </h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Alokasi pengiriman wilayah ini penuh untuk hari ini..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectReq(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  processStockRequest(rejectReq.id, "Ditolak", rejectReason || "Ditolak Agen");
                  setRejectReq(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                Konfirmasi Tolak Permintaan
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}