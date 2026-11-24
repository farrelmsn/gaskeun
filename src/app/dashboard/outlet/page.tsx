"use client";

import React, { useState } from "react";
import { DashboardShell, NavMenuItem } from "@/components/DashboardShell";
import { useApp } from "@/context/AppContext";
import { PRODUCTS } from "@/data/mockData";
import { exportSalesToExcel, exportSalesToPDF } from "@/lib/exportUtils";
import { ProductKey, StockDetail } from "@/types";
import {
  LayoutDashboard,
  Truck,
  FileSpreadsheet,
  BarChart3,
  Bell,
  Settings,
  CheckCircle2,
  X,
  Plus,
  Minus,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function OutletDashboardPage() {
  const {
    currentUser,
    outlets,
    agents,
    orders,
    stockRequests,
    sales,
    notifications,
    updateOutletStockAndPrice,
    updateOutletDeliverySettings,
    updateOutletProfile,
    createStockRequest,
    completeOrderByOutlet,
    recordDailySales,
    markAllNotificationsRead,
  } = useApp();

  const [activeTab, setActiveTab] = useState("dashboard");

  const outlet =
    outlets.find((o) => o.userId === currentUser?.id) ||
    outlets.find((o) => o.email === "alisobar@gmail.com") ||
    outlets[0];
  const parentAgent = agents.find((a) => a.id === outlet.agentId) || agents[0];

  // Stock & Price local editable state
  const [stockDraft, setStockDraft] = useState<Record<ProductKey, StockDetail>>(outlet.stock);
  const [isOpenDraft, setIsOpenDraft] = useState<boolean>(outlet.isOpen);

  // Modals: Delivery (PDS) & Trade-in/Perdana
  const [showPdsModal, setShowPdsModal] = useState(false);
  const [pdsActive, setPdsActive] = useState(outlet.pdsActive);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(outlet.deliveryRadiusKm);
  const [deliveryFee55, setDeliveryFee55] = useState(outlet.deliveryFee55);
  const [deliveryFee12, setDeliveryFee12] = useState(outlet.deliveryFee12);
  const [extraKmFee, setExtraKmFee] = useState(outlet.extraKmFee);
  const [courierNote, setCourierNote] = useState(outlet.courierNote);

  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [schemeProduct, setSchemeProduct] = useState<"bg55" | "bg12">("bg55");

  // Stock Request Form
  const [reqQty, setReqQty] = useState<Record<ProductKey, number>>({
    bg55: 0,
    bg12: 0,
    canister220: 0,
    elpiji50: 0,
  });
  const [reqPriority, setReqPriority] = useState<"Normal (Reguler)" | "Mendesak (Stok Kritis)">(
    "Normal (Reguler)"
  );
  const [reqNote, setReqNote] = useState("");

  // Smart Daily Closing (Walk-in Stepper)
  const [closingDate, setClosingDate] = useState(new Date().toISOString().slice(0, 10));
  const [buyerLabel, setBuyerLabel] = useState("Warga Sekitar / Pembeli Toko Fisik");
  const [walkInQty, setWalkInQty] = useState<Record<ProductKey, number>>({
    bg55: 0,
    bg12: 0,
    canister220: 0,
    elpiji50: 0,
  });
  const [reduceStockOnClose, setReduceStockOnClose] = useState(true);

  // Profile Form
  const [profName, setProfName] = useState(outlet.name);
  const [profPic, setProfPic] = useState(outlet.pic);
  const [profPhone, setProfPhone] = useState(outlet.phone);
  const [profHours, setProfHours] = useState(outlet.operatingHours);
  const [profAddress, setProfAddress] = useState(outlet.address);
  const [bankName, setBankName] = useState(outlet.bankName || "");
  const [bankAccount, setBankAccount] = useState(outlet.bankAccount || "");
  const [bankHolder, setBankHolder] = useState(outlet.bankHolder || "");

  const menuItems: NavMenuItem[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, section: "OPERASIONAL OUTLET" },
    { key: "permintaan", label: "Permintaan Stok Agen", icon: <Truck className="w-4 h-4" />, section: "OPERASIONAL OUTLET" },
    { key: "import", label: "Import Laporan Penjualan", icon: <FileSpreadsheet className="w-4 h-4" />, section: "OPERASIONAL OUTLET" },
    { key: "laporan", label: "Laporan Penjualan", icon: <BarChart3 className="w-4 h-4" />, section: "OPERASIONAL OUTLET" },
    { key: "notifikasi", label: "Kotak Notifikasi", icon: <Bell className="w-4 h-4" />, section: "AKUN & SISTEM" },
    { key: "profil", label: "Profil & Titik Peta", icon: <Settings className="w-4 h-4" />, section: "AKUN & SISTEM" },
  ];

  const totalReady = Object.values(outlet.stock).reduce((acc, s) => acc + s.ready, 0);
  const totalEmpty = Object.values(outlet.stock).reduce((acc, s) => acc + s.empty, 0);
  const myOrders = orders.filter((o) => o.outletId === outlet.id);
  const myRequests = stockRequests.filter((r) => r.outletId === outlet.id);
  const mySales = sales.filter((s) => s.outletId === outlet.id);
  const myNotifs = notifications.filter((n) => n.userId === currentUser?.id);

  const totalRequestedTabung = Object.values(reqQty).reduce((a, b) => a + b, 0);
  const walkInTotalRp = PRODUCTS.reduce(
    (sum, p) => sum + walkInQty[p.key] * outlet.stock[p.key].price,
    0
  );
  const walkInTotalTbg = Object.values(walkInQty).reduce((a, b) => a + b, 0);

  const handleSaveDailyClosing = () => {
    if (walkInTotalTbg <= 0) {
      toast.error("Masukkan minimal 1 tabung pada penjualan toko fisik.");
      return;
    }
    const records = PRODUCTS.filter((p) => walkInQty[p.key] > 0).map((p) => ({
      date: closingDate,
      outletId: outlet.id,
      outletName: outlet.name,
      agentId: parentAgent.id,
      agentName: parentAgent.name,
      buyerName: buyerLabel,
      productKey: p.key,
      productName: p.shortName,
      quantity: walkInQty[p.key],
      unitPrice: outlet.stock[p.key].price,
      total: walkInQty[p.key] * outlet.stock[p.key].price,
      source: "Toko Fisik / Walk-in" as const,
    }));
    recordDailySales(records, reduceStockOnClose);
    setWalkInQty({ bg55: 0, bg12: 0, canister220: 0, elpiji50: 0 });
  };

  return (
    <DashboardShell
      roleBadge="Outlet Resmi"
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
                Selamat Datang, <span className="text-[#0055B8]">{outlet.name}</span> 👋
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                Stok &amp; Operasional Pangkalan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pangkalan Binaan {parentAgent.name} • {outlet.district}, {outlet.region}
            </p>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">GAS SIAP JUAL</div>
              <div className="text-2xl font-black text-[#0055B8]">{totalReady} Tabung</div>
              <div className="text-xs text-emerald-600 font-semibold">
                Status: {totalReady > 0 ? "Tersedia" : "Habis"}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                TABUNG KOSONG (SIAP TUKAR)
              </div>
              <div className="text-2xl font-black text-slate-900">{totalEmpty} Tabung</div>
              <button
                onClick={() => setActiveTab("permintaan")}
                className="text-xs text-[#0055B8] font-bold hover:underline"
              >
                Pesan Pasokan →
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                CATATAN PENJUALAN HARIAN
              </div>
              <div className="text-2xl font-black text-emerald-600">{mySales.length} Baris</div>
              <button
                onClick={() => setActiveTab("import")}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                Buka Catatan →
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">AGEN PEMBINA INDUK</div>
              <div className="text-base font-extrabold text-slate-900 truncate">
                {parentAgent.name}
              </div>
              <div className="text-[11px] text-slate-500">
                Operasional: {parentAgent.operatingHours} WIB
              </div>
            </div>
          </div>

          {/* Pengaturan Stok Gas, Harga Jual & Jam Buka */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Pengaturan Stok Gas, Harga Jual &amp; Jam Buka
                </h3>
                <p className="text-xs text-slate-500">
                  Atur Harga Jual dan jumlah stok tabung per varian. Data yang disimpan langsung tampil di Peta Pencarian Warga &amp; Laporan Agen.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsOpenDraft(!isOpenDraft)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                    isOpenDraft
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-slate-100 border-slate-200 text-slate-600"
                  }`}
                >
                  {isOpenDraft ? "● Pangkalan Buka" : "○ Pangkalan Tutup"}
                </button>
                <button
                  onClick={() => setShowPdsModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#0055B8] border border-blue-200 text-xs font-bold"
                >
                  Pengantaran (PDS): {outlet.deliveryRadiusKm.toFixed(1)} km
                </button>
                <button
                  onClick={() => setShowSchemeModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold"
                >
                  Atur Trade-In &amp; Perdana
                </button>
                <button
                  onClick={() => updateOutletStockAndPrice(outlet.id, stockDraft, isOpenDraft)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Simpan Stok &amp; Harga Jual
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-2">VARIAN PRODUK LPG NON-SUBSIDI</th>
                    <th className="py-3 px-2">HARGA JUAL (RP)</th>
                    <th className="py-3 px-2">GAS SIAP JUAL</th>
                    <th className="py-3 px-2">TABUNG KOSONG</th>
                    <th className="py-3 px-2">TABUNG RUSAK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRODUCTS.map((p) => {
                    const row = stockDraft[p.key];
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
                                setStockDraft({
                                  ...stockDraft,
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
                              setStockDraft({
                                ...stockDraft,
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
                              setStockDraft({
                                ...stockDraft,
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
                              setStockDraft({
                                ...stockDraft,
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

          {/* Pesanan Masuk dari Pelanggan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Pesanan Masuk dari Pelanggan ({myOrders.length}){" "}
                  <span className="ml-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0055B8] text-[10px]">
                    PDS 135 &amp; Publik
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Klik &ldquo;Selesaikan Pesanan&rdquo; untuk konfirmasi transaksi dan memotong stok gas secara otomatis.
                </p>
              </div>
            </div>

            {myOrders.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                Belum ada pesanan baru dari warga sekitar.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-3 px-2">WAKTU PESANAN</th>
                      <th className="py-3 px-2">KONSUMEN &amp; ALAMAT ANTAR</th>
                      <th className="py-3 px-2">PRODUK &amp; TOTAL</th>
                      <th className="py-3 px-2">PEMBAYARAN</th>
                      <th className="py-3 px-2">STATUS PESANAN</th>
                      <th className="py-3 px-2 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-3 px-2 text-slate-500">{ord.createdAt}</td>
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">{ord.consumerName}</div>
                          <div className="text-[11px] text-slate-500">{ord.deliveryAddress}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">
                            {ord.productName} (×{ord.quantity})
                          </div>
                          <div className="text-[11px] font-extrabold text-[#0055B8]">
                            Rp {ord.totalAmount.toLocaleString("id-ID")}
                          </div>
                        </td>
                        <td className="py-3 px-2 font-semibold">{ord.paymentMethod}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              ord.status === "Selesai"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          {ord.status !== "Selesai" && (
                            <button
                              onClick={() => completeOrderByOutlet(ord.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                            >
                              Selesaikan Pesanan
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PERMINTAAN STOK AGEN */}
      {activeTab === "permintaan" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Pesan Pasokan Gas ke Agen Pembina
                </h2>
                <p className="text-xs text-slate-500">
                  Ajukan pesanan pasokan tabung Bright Gas ke Agen Pembina (<strong>{parentAgent.name}</strong>).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0055B8] text-xs font-bold">
                Total Diminta: {totalRequestedTabung} Tabung
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCTS.map((p) => {
                const agentAvail = parentAgent.stock[p.key].ready;
                return (
                  <div key={p.key} className="p-4 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-900">{p.shortName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          agentAvail > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        Stok Agen: {agentAvail} Tbg
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Stok Toko Saat Ini: <strong>{outlet.stock[p.key].ready} Tbg</strong>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Jumlah Tabung
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={reqQty[p.key]}
                        onChange={(e) =>
                          setReqQty({ ...reqQty, [p.key]: Math.max(0, Number(e.target.value)) })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Tingkat Prioritas Kebutuhan
                </label>
                <select
                  value={reqPriority}
                  onChange={(e) => setReqPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <option value="Normal (Reguler)">Normal (Reguler)</option>
                  <option value="Mendesak (Stok Kritis)">Mendesak (Stok Kritis)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Catatan Kebutuhan / Keterangan untuk Agen
                </label>
                <input
                  type="text"
                  value={reqNote}
                  onChange={(e) => setReqNote(e.target.value)}
                  placeholder="Contoh: Stok di pangkalan menipis menjelang akhir pekan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                disabled={totalRequestedTabung <= 0}
                onClick={() => {
                  createStockRequest({
                    outletId: outlet.id,
                    outletName: outlet.name,
                    agentId: parentAgent.id,
                    items: reqQty,
                    priority: reqPriority,
                    note: reqNote || "Permintaan pasokan stok tabung reguler",
                  });
                  setReqQty({ bg55: 0, bg12: 0, canister220: 0, elpiji50: 0 });
                  setReqNote("");
                }}
                className={`px-6 py-3 rounded-xl text-xs font-bold transition ${
                  totalRequestedTabung > 0
                    ? "bg-[#0055B8] hover:bg-[#003B82] text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Kirim Pesanan Pasokan ({totalRequestedTabung} Tabung) ke Agen
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900">
              Riwayat Pesanan Pasokan Gas ke Agen ({myRequests.length} Pesanan)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-2">NO PESANAN</th>
                    <th className="py-3 px-2">TANGGAL</th>
                    <th className="py-3 px-2">AGEN TUJUAN</th>
                    <th className="py-3 px-2">VARIAN &amp; JUMLAH</th>
                    <th className="py-3 px-2">STATUS</th>
                    <th className="py-3 px-2">TANGGAPAN AGEN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRequests.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 px-2 font-mono font-bold text-slate-800">{r.ticketNo}</td>
                      <td className="py-3 px-2 text-slate-500">{r.date}</td>
                      <td className="py-3 px-2 font-bold">{parentAgent.name}</td>
                      <td className="py-3 px-2">
                        {Object.values(r.items).reduce((a, b) => a + b, 0)} Tabung
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === "Disetujui"
                              ? "bg-emerald-50 text-emerald-700"
                              : r.status === "Ditolak"
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-[#0055B8]"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500">
                        {r.agentResponse || "Menunggu konfirmasi agen"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: IMPORT LAPORAN PENJUALAN (SMART DAILY CLOSING) */}
      {activeTab === "import" && (
        <div className="space-y-6">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-emerald-900">
                {outlet.name.toUpperCase()} ({outlet.regCode})
              </div>
              <div className="text-xs text-emerald-700">
                Penanggung Jawab: {outlet.pic} ({parentAgent.name} — {outlet.district})
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-white text-emerald-700 text-xs font-bold border border-emerald-200">
              Smart Daily Closing
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Tanggal Tutup Buku:
              </label>
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Catatan Pembeli:</label>
              <input
                type="text"
                value={buyerLabel}
                onChange={(e) => setBuyerLabel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* 2. Penjualan Toko Fisik / Walk-in Stepper */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Penjualan Toko Fisik / Walk-in Customer
                </h3>
                <p className="text-xs text-slate-500">
                  Gunakan tombol stepper [ - ] dan [ + ] untuk mencatat tabung yang dibeli langsung di pangkalan hari ini.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                Input Stepper Harian
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRODUCTS.map((p) => {
                const st = outlet.stock[p.key];
                const qty = walkInQty[p.key];
                return (
                  <div key={p.key} className="p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">{p.shortName}</div>
                        <div className="text-[11px] font-bold text-emerald-600">
                          Rp {st.price.toLocaleString("id-ID")} / tabung
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                        Stok Siap: {st.ready}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setWalkInQty({ ...walkInQty, [p.key]: Math.max(0, qty - 1) })
                          }
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-extrabold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setWalkInQty({ ...walkInQty, [p.key]: qty + 1 })}
                          className="w-8 h-8 rounded-full bg-[#00A651] text-white flex items-center justify-center hover:bg-emerald-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Subtotal</div>
                        <div className="text-xs font-extrabold text-slate-900">
                          Rp {(qty * st.price).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dark Total Bar */}
          <div className="rounded-3xl bg-slate-900 text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                TOTAL AKUMULASI HARIAN ({closingDate})
              </div>
              <div className="text-3xl font-black text-white mt-0.5">
                Rp {walkInTotalRp.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Total {walkInTotalTbg} tabung terjual via Toko Fisik
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reduceStockOnClose}
                  onChange={(e) => setReduceStockOnClose(e.target.checked)}
                  className="accent-[#0055B8]"
                />
                <span>Otomatis kurangi stok gas siap jual &amp; catat tabung kosong kembali</span>
              </label>
              <button
                onClick={handleSaveDailyClosing}
                className="w-full py-3 px-6 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white text-xs font-extrabold transition"
              >
                ✓ Simpan Penjualan Harian &amp; Tutup Buku
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LAPORAN PENJUALAN */}
      {activeTab === "laporan" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Laporan Penjualan Outlet</h2>
              <p className="text-xs text-slate-500">{outlet.name}</p>
            </div>
            <button
              onClick={async () => { await exportSalesToExcel(mySales, `Laporan Penjualan - ${outlet.name}`, "Laporan_Penjualan_Outlet.xlsx"); toast.success("Berkas Excel (.xlsx) berhasil diunduh!"); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A651] text-white text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Excel</span>
            </button>
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
              Detail Transaksi Penjualan
            </h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-2">TANGGAL</th>
                  <th className="py-3 px-2">PEMBELI</th>
                  <th className="py-3 px-2">PRODUK</th>
                  <th className="py-3 px-2">JML</th>
                  <th className="py-3 px-2">SUMBER</th>
                  <th className="py-3 px-2 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mySales.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 px-2 text-slate-500">{s.date}</td>
                    <td className="py-3 px-2 font-bold">{s.buyerName}</td>
                    <td className="py-3 px-2">{s.productName}</td>
                    <td className="py-3 px-2 font-bold">{s.quantity} Tbg</td>
                    <td className="py-3 px-2">{s.source}</td>
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
          {myNotifs.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">Belum ada notifikasi.</p>
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

      {/* TAB: PROFIL & TITIK PETA */}
      {activeTab === "profil" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Identitas Pangkalan Resmi
            </h2>
            <p className="text-xs text-slate-500">
              Data pangkalan binaan resmi penyalur Bright Gas kepada konsumen.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateOutletProfile(outlet.id, {
                name: profName,
                pic: profPic,
                phone: profPhone,
                operatingHours: profHours,
                address: profAddress,
                bankName,
                bankAccount,
                bankHolder,
              });
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Nama Pangkalan</label>
                <input
                  type="text"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Penanggung Jawab (Pemilik/Pengelola)</label>
                <input
                  type="text"
                  value={profPic}
                  onChange={(e) => setProfPic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">No. WhatsApp Pesan Antar</label>
                <input
                  type="text"
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Jam Layanan Penjualan</label>
                <input
                  type="text"
                  value={profHours}
                  onChange={(e) => setProfHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Alamat Lengkap Pangkalan</label>
              <input
                type="text"
                value={profAddress}
                onChange={(e) => setProfAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="font-extrabold text-slate-900">
                REKENING BANK PEMBAYARAN (OPSIONAL)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Nama Bank (BCA / Mandiri)"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200"
                />
                <input
                  type="text"
                  placeholder="Nomor Rekening"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200"
                />
                <input
                  type="text"
                  placeholder="Atas Nama (A/N)"
                  value={bankHolder}
                  onChange={(e) => setBankHolder(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#0055B8] hover:bg-[#003B82] text-white font-bold"
            >
              Simpan Perubahan Pangkalan
            </button>
          </form>
        </div>
      )}

      {/* MODAL: PENGATURAN ONGKOS KIRIM (PDS) & JANGKAUAN */}
      {showPdsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                Pengaturan Ongkos Kirim (PDS) &amp; Jangkauan
              </h3>
              <button onClick={() => setShowPdsModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-slate-700">
              <strong className="text-[#0055B8]">Pendapatan Penuh Milik Pangkalan:</strong> Biaya ongkir masuk 100% ke kas operasional kurir pangkalan Anda.
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <span className="font-bold">Status Layanan Siap Antar (PDS)</span>
                <input
                  type="checkbox"
                  checked={pdsActive}
                  onChange={(e) => setPdsActive(e.target.checked)}
                  className="accent-[#0055B8] w-4 h-4"
                />
              </label>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Radius Jangkauan Antar</span>
                  <span className="text-[#0055B8]">{deliveryRadiusKm} km (Maks 5.0 km)</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={deliveryRadiusKm}
                  onChange={(e) => setDeliveryRadiusKm(Number(e.target.value))}
                  className="w-full accent-[#0055B8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Ongkir Bright Gas 5,5 Kg (Rp)</label>
                  <input
                    type="number"
                    value={deliveryFee55}
                    onChange={(e) => setDeliveryFee55(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Ongkir Bright Gas 12 Kg (Rp)</label>
                  <input
                    type="number"
                    value={deliveryFee12}
                    onChange={(e) => setDeliveryFee12(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Catatan Operasional Kurir Pengantar</label>
                <input
                  type="text"
                  value={courierNote}
                  onChange={(e) => setCourierNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPdsModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  updateOutletDeliverySettings(outlet.id, {
                    pdsActive,
                    deliveryRadiusKm,
                    deliveryFee55,
                    deliveryFee12,
                    extraKmFee,
                    courierNote,
                  });
                  setShowPdsModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#0055B8] text-white text-xs font-bold"
              >
                Simpan Pengaturan Pengantaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PENGATURAN SKEMA PENJUALAN (TRADE-IN & PERDANA) */}
      {showSchemeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                Pengaturan Skema Penjualan (Trade-In &amp; Perdana)
              </h3>
              <button onClick={() => setShowSchemeModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-bold">
              <button
                onClick={() => setSchemeProduct("bg55")}
                className={`py-2.5 border-b-2 ${
                  schemeProduct === "bg55"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500"
                }`}
              >
                Bright Gas 5,5 Kg
              </button>
              <button
                onClick={() => setSchemeProduct("bg12")}
                className={`py-2.5 border-b-2 ${
                  schemeProduct === "bg12"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500"
                }`}
              >
                Bright Gas 12 Kg
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-2">
                <div className="font-extrabold text-slate-900">
                  1. Program Trade-In (Tukar Tambah 2 Tabung Melon 3 Kg)
                </div>
                <label className="block text-[11px] font-bold text-slate-600">
                  Biaya Selisih Penukaran Tabung (Rp)
                </label>
                <input
                  type="number"
                  value={stockDraft[schemeProduct].tradeInFee || 0}
                  onChange={(e) =>
                    setStockDraft({
                      ...stockDraft,
                      [schemeProduct]: {
                        ...stockDraft[schemeProduct],
                        tradeInFee: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold"
                />
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-extrabold text-slate-900">
                  2. Harga Paket Tabung Baru Perdana + Isi (Rp)
                </div>
                <input
                  type="number"
                  value={stockDraft[schemeProduct].newCylinderPrice || 324000}
                  onChange={(e) =>
                    setStockDraft({
                      ...stockDraft,
                      [schemeProduct]: {
                        ...stockDraft[schemeProduct],
                        newCylinderPrice: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSchemeModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  updateOutletStockAndPrice(outlet.id, stockDraft, isOpenDraft);
                  setShowSchemeModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
              >
                Simpan Skema Penjualan
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}