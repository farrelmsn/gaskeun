"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserAccount,
  AgentEntity,
  OutletEntity,
  ConsumerAddress,
  ConsumerOrder,
  StockRequestItem,
  StockTransferDO,
  SalesRecord,
  NotificationItem,
  ProductKey,
  StockDetail,
} from "@/types";
import {
  INITIAL_USERS,
  INITIAL_AGENTS,
  INITIAL_OUTLETS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_STOCK_REQUESTS,
  INITIAL_TRANSFERS,
  INITIAL_SALES,
  INITIAL_NOTIFICATIONS,
} from "@/data/mockData";
import { toast } from "sonner";

const STORAGE_KEY = "gasnpso_bandung_state_v2";

interface GpsCoords {
  lat: number;
  lng: number;
  label: string;
}

interface PersistedState {
  users: UserAccount[];
  agents: AgentEntity[];
  outlets: OutletEntity[];
  addresses: ConsumerAddress[];
  orders: ConsumerOrder[];
  stockRequests: StockRequestItem[];
  transfers: StockTransferDO[];
  sales: SalesRecord[];
  notifications: NotificationItem[];
}

interface AppContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  agents: AgentEntity[];
  outlets: OutletEntity[];
  addresses: ConsumerAddress[];
  orders: ConsumerOrder[];
  stockRequests: StockRequestItem[];
  transfers: StockTransferDO[];
  sales: SalesRecord[];
  notifications: NotificationItem[];
  gpsCoords: GpsCoords | null;
  setGpsCoords: (coords: GpsCoords | null) => void;
  detectGps: () => void;
  login: (email: string, password: string) => UserAccount | null;
  logout: () => void;
  registerUser: (data: {
    role: "konsumen" | "outlet" | "agen";
    name: string;
    pic?: string;
    phone: string;
    region: "Kota Bandung" | "Kabupaten Bandung" | "Kabupaten Sumedang" | "Kabupaten Garut";
    district?: string;
    address: string;
    email: string;
    password: string;
    agentId?: string;
    sppbe?: string;
  }) => boolean;
  updateOutletStockAndPrice: (
    outletId: string,
    updatedStock: Record<ProductKey, StockDetail>,
    isOpen: boolean
  ) => void;
  updateOutletDeliverySettings: (
    outletId: string,
    settings: {
      pdsActive: boolean;
      deliveryRadiusKm: number;
      deliveryFee55: number;
      deliveryFee12: number;
      extraKmFee: number;
      courierNote: string;
    }
  ) => void;
  updateOutletProfile: (outletId: string, data: Partial<OutletEntity>) => void;
  updateAgentWarehouseStock: (agentId: string, updatedStock: Record<ProductKey, StockDetail>) => void;
  updateAgentProfile: (agentId: string, data: Partial<AgentEntity>) => void;
  createStockRequest: (req: Omit<StockRequestItem, "id" | "ticketNo" | "date" | "status">) => void;
  processStockRequest: (reqId: string, action: "Disetujui" | "Ditolak", reason?: string) => void;
  createTransferDO: (data: {
    agentId: string;
    outletId: string;
    items: Record<ProductKey, number>;
    driverNote: string;
  }) => boolean;
  approveOrRejectOutlet: (outletId: string, status: "Aktif" | "Tidak Aktif") => void;
  createConsumerOrder: (order: Omit<ConsumerOrder, "id" | "createdAt" | "status">) => ConsumerOrder;
  completeOrderByOutlet: (orderId: string) => void;
  recordDailySales: (records: Omit<SalesRecord, "id">[], reduceStock: boolean) => void;
  addAddress: (addr: Omit<ConsumerAddress, "id">) => void;
  deleteAddress: (id: string) => void;
  setPrimaryAddress: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  addAgentByPertamina: (data: {
    name: string;
    pic: string;
    phone: string;
    email: string;
    region: "Kota Bandung" | "Kabupaten Bandung" | "Kabupaten Sumedang" | "Kabupaten Garut";
    district: string;
    address: string;
    sppbe: string;
    warehouseCapacity: number;
  }) => void;
  deleteAgent: (agentId: string) => void;
  deleteOutlet: (outletId: string) => void;
  calculateDistanceKm: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [agents, setAgents] = useState<AgentEntity[]>(INITIAL_AGENTS);
  const [outlets, setOutlets] = useState<OutletEntity[]>(INITIAL_OUTLETS);
  const [addresses, setAddresses] = useState<ConsumerAddress[]>(INITIAL_ADDRESSES);
  const [orders, setOrders] = useState<ConsumerOrder[]>(INITIAL_ORDERS);
  const [stockRequests, setStockRequests] = useState<StockRequestItem[]>(INITIAL_STOCK_REQUESTS);
  const [transfers, setTransfers] = useState<StockTransferDO[]>(INITIAL_TRANSFERS);
  const [sales, setSales] = useState<SalesRecord[]>(INITIAL_SALES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [gpsCoords, setGpsCoords] = useState<GpsCoords | null>({
    lat: -6.892,
    lng: 107.614,
    label: "Coblong, Kota Bandung",
  });

  // Load persisted data & listen for cross-tab Realtime updates
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: Partial<PersistedState> = JSON.parse(raw);
          if (parsed.users) setUsers(parsed.users);
          if (parsed.agents) setAgents(parsed.agents);
          if (parsed.outlets) setOutlets(parsed.outlets);
          if (parsed.addresses) setAddresses(parsed.addresses);
          if (parsed.orders) setOrders(parsed.orders);
          if (parsed.stockRequests) setStockRequests(parsed.stockRequests);
          if (parsed.transfers) setTransfers(parsed.transfers);
          if (parsed.sales) setSales(parsed.sales);
          if (parsed.notifications) setNotifications(parsed.notifications);
        }
        const savedUser = localStorage.getItem("gasnpso_current_user");
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      } catch {}
    };

    loadFromStorage();
    setHydrated(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Save state whenever operational data updates
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistedState = {
        users,
        agents,
        outlets,
        addresses,
        orders,
        stockRequests,
        transfers,
        sales,
        notifications,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [
    hydrated,
    users,
    agents,
    outlets,
    addresses,
    orders,
    stockRequests,
    transfers,
    sales,
    notifications,
  ]);

  const calculateDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c * 1.18).toFixed(1));
  };

  const detectGps = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: `GPS Aktif (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
          });
          toast.success("Titik GPS Anda berhasil diperbarui!");
        },
        () => {
          setGpsCoords({
            lat: -6.892,
            lng: 107.614,
            label: "Coblong, Kota Bandung",
          });
          toast.info("Menggunakan titik koordinat Coblong, Kota Bandung");
        }
      );
    }
  };

  const login = (email: string, password: string) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) {
      toast.error("Email atau kata sandi tidak sesuai.");
      return null;
    }
    if (found.status !== "Aktif") {
      toast.error("Akun Anda berstatus " + found.status + ". Hubungi Agen atau Admin Pertamina.");
      return null;
    }
    setCurrentUser(found);
    localStorage.setItem("gasnpso_current_user", JSON.stringify(found));
    toast.success(`Selamat datang kembali, ${found.name}!`);
    return found;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gasnpso_current_user");
    toast.info("Sesi Anda telah diakhiri.");
  };

  const registerUser = (data: {
    role: "konsumen" | "outlet" | "agen";
    name: string;
    pic?: string;
    phone: string;
    region: "Kota Bandung" | "Kabupaten Bandung" | "Kabupaten Sumedang" | "Kabupaten Garut";
    district?: string;
    address: string;
    email: string;
    password: string;
    agentId?: string;
    sppbe?: string;
  }) => {
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      toast.error("Email sudah terdaftar dalam sistem.");
      return false;
    }
    const newUserId = `usr-${Date.now()}`;
    const newUser: UserAccount = {
      id: newUserId,
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
      status: data.role === "konsumen" ? "Aktif" : "Pending",
    };
    setUsers((prev) => [...prev, newUser]);

    if (data.role === "outlet") {
      const newOutlet: OutletEntity = {
        id: `out-${Date.now()}`,
        regCode: `PKL-${Math.floor(100 + Math.random() * 899)}`,
        userId: newUserId,
        agentId: data.agentId || agents[0].id,
        name: data.name,
        pic: data.pic || data.name,
        phone: data.phone,
        email: data.email,
        region: data.region,
        district: data.district || data.region,
        address: data.address,
        lat: -6.9175,
        lng: 107.6191,
        operatingHours: "08:00 - 20:00 WIB",
        isOpen: true,
        status: "Pending",
        pdsActive: true,
        deliveryRadiusKm: 5.0,
        deliveryFee55: 5000,
        deliveryFee12: 10000,
        extraKmFee: 0,
        courierNote: "Pengantaran kurir pangkalan resmi",
        rating: 5.0,
        soldCount: 0,
        updatedAt: "Baru saja",
        stock: {
          bg55: { ready: 0, empty: 0, quarantine: 0, price: 104000, tradeInFee: 0, tradeInActive: true, newCylinderPrice: 324000, newCylinderActive: true },
          bg12: { ready: 0, empty: 0, quarantine: 0, price: 218000, tradeInFee: 0, tradeInActive: true, newCylinderPrice: 530000, newCylinderActive: true },
          canister220: { ready: 0, empty: 0, quarantine: 0, price: 24000 },
          elpiji50: { ready: 0, empty: 0, quarantine: 0, price: 890000 },
        },
      };
      setOutlets((prev) => [...prev, newOutlet]);
      toast.success("Pengajuan Outlet berhasil dikirim! Menunggu persetujuan Agen pembina.");
    } else if (data.role === "agen") {
      const newAgent: AgentEntity = {
        id: `agn-${Date.now()}`,
        regCode: `AGN-${Math.floor(100 + Math.random() * 899)}`,
        userId: newUserId,
        name: data.name,
        pic: data.pic || data.name,
        phone: data.phone,
        email: data.email,
        region: data.region,
        district: data.district || data.region,
        address: data.address,
        sppbe: data.sppbe || "SPPBE Padalarang",
        lat: -6.9175,
        lng: 107.6191,
        operatingHours: "07:00 - 20:00",
        warehouseCapacity: 1500,
        status: "Menunggu Persetujuan",
        stock: {
          bg55: { ready: 0, empty: 0, quarantine: 0, price: 104000 },
          bg12: { ready: 0, empty: 0, quarantine: 0, price: 218000 },
          canister220: { ready: 0, empty: 0, quarantine: 0, price: 24000 },
          elpiji50: { ready: 0, empty: 0, quarantine: 0, price: 890000 },
        },
      };
      setAgents((prev) => [...prev, newAgent]);
      toast.success("Pendaftaran Mitra Agen berhasil dikirim! Menunggu verifikasi Pertamina.");
    } else {
      setCurrentUser(newUser);
      localStorage.setItem("gasnpso_current_user", JSON.stringify(newUser));
      toast.success("Akun Konsumen berhasil dibuat!");
    }
    return true;
  };

  const updateOutletStockAndPrice = (
    outletId: string,
    updatedStock: Record<ProductKey, StockDetail>,
    isOpen: boolean
  ) => {
    setOutlets((prev) =>
      prev.map((o) =>
        o.id === outletId ? { ...o, stock: updatedStock, isOpen, updatedAt: "Baru saja" } : o
      )
    );
    toast.success("Stok & harga jual pangkalan berhasil disinkronkan ke peta publik!");
  };

  const updateOutletDeliverySettings = (
    outletId: string,
    settings: {
      pdsActive: boolean;
      deliveryRadiusKm: number;
      deliveryFee55: number;
      deliveryFee12: number;
      extraKmFee: number;
      courierNote: string;
    }
  ) => {
    setOutlets((prev) => prev.map((o) => (o.id === outletId ? { ...o, ...settings } : o)));
    toast.success("Pengaturan ongkos kirim & jangkauan PDS berhasil disimpan!");
  };

  const updateOutletProfile = (outletId: string, data: Partial<OutletEntity>) => {
    setOutlets((prev) => prev.map((o) => (o.id === outletId ? { ...o, ...data } : o)));
    toast.success("Profil & lokasi outlet berhasil diperbarui!");
  };

  const updateAgentWarehouseStock = (
    agentId: string,
    updatedStock: Record<ProductKey, StockDetail>
  ) => {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, stock: updatedStock } : a)));
    toast.success("Stok gudang induk agen berhasil diperbarui!");
  };

  const updateAgentProfile = (agentId: string, data: Partial<AgentEntity>) => {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, ...data } : a)));
    toast.success("Profil & data gudang agen berhasil disimpan!");
  };

  const createStockRequest = (
    req: Omit<StockRequestItem, "id" | "ticketNo" | "date" | "status">
  ) => {
    const newReq: StockRequestItem = {
      ...req,
      id: `req-${Date.now()}`,
      ticketNo: `TKT-OUT-${Math.floor(100000 + Math.random() * 899999)}`,
      date: "Hari ini, Baru saja",
      status: "Diajukan",
    };
    setStockRequests((prev) => [newReq, ...prev]);
    toast.success(`Pesanan pasokan (${newReq.ticketNo}) berhasil dikirim ke Agen Pembina!`);
  };

  const processStockRequest = (
    reqId: string,
    action: "Disetujui" | "Ditolak",
    reason?: string
  ) => {
    const target = stockRequests.find((r) => r.id === reqId);
    if (!target) return;

    if (action === "Disetujui") {
      const agent = agents.find((a) => a.id === target.agentId);
      if (agent) {
        const insufficient = (Object.keys(target.items) as ProductKey[]).some(
          (k) => agent.stock[k].ready < target.items[k]
        );
        if (insufficient) {
          toast.error("Stok gudang agen tidak mencukupi untuk menyetujui pesanan ini!");
          return;
        }
        const nextAgentStock = { ...agent.stock };
        (Object.keys(target.items) as ProductKey[]).forEach((k) => {
          nextAgentStock[k] = {
            ...nextAgentStock[k],
            ready: nextAgentStock[k].ready - target.items[k],
          };
        });
        setAgents((prev) =>
          prev.map((a) => (a.id === agent.id ? { ...a, stock: nextAgentStock } : a))
        );
        setOutlets((prev) =>
          prev.map((o) => {
            if (o.id !== target.outletId) return o;
            const nextOutletStock = { ...o.stock };
            (Object.keys(target.items) as ProductKey[]).forEach((k) => {
              nextOutletStock[k] = {
                ...nextOutletStock[k],
                ready: nextOutletStock[k].ready + target.items[k],
              };
            });
            return { ...o, stock: nextOutletStock };
          })
        );
      }
      toast.success("Permintaan stok disetujui! Saldo stok gudang & outlet otomatis diperbarui.");
    } else {
      toast.info("Permintaan pasokan telah ditolak.");
    }

    setStockRequests((prev) =>
      prev.map((r) =>
        r.id === reqId ? { ...r, status: action, agentResponse: reason || action } : r
      )
    );
  };

  const createTransferDO = (data: {
    agentId: string;
    outletId: string;
    items: Record<ProductKey, number>;
    driverNote: string;
  }) => {
    const agent = agents.find((a) => a.id === data.agentId);
    const outlet = outlets.find((o) => o.id === data.outletId);
    if (!agent || !outlet) return false;

    const insufficient = (Object.keys(data.items) as ProductKey[]).some(
      (k) => agent.stock[k].ready < data.items[k]
    );
    if (insufficient) {
      toast.error("Stok gudang induk tidak mencukupi untuk transfer DO ini!");
      return false;
    }

    const nextAgentStock = { ...agent.stock };
    const nextOutletStock = { ...outlet.stock };
    (Object.keys(data.items) as ProductKey[]).forEach((k) => {
      nextAgentStock[k] = { ...nextAgentStock[k], ready: nextAgentStock[k].ready - data.items[k] };
      nextOutletStock[k] = { ...nextOutletStock[k], ready: nextOutletStock[k].ready + data.items[k] };
    });

    setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, stock: nextAgentStock } : a)));
    setOutlets((prev) =>
      prev.map((o) => (o.id === outlet.id ? { ...o, stock: nextOutletStock } : o))
    );

    const newDO: StockTransferDO = {
      id: `trf-${Date.now()}`,
      docNo: `SJ-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        1000 + Math.random() * 8999
      )}`,
      date: "Hari ini, Baru saja",
      agentId: agent.id,
      agentName: agent.name,
      outletId: outlet.id,
      outletName: outlet.name,
      items: data.items,
      driverNote: data.driverNote || "Truk Distribusi Agen Resmi",
      status: "Selesai",
    };
    setTransfers((prev) => [newDO, ...prev]);
    toast.success(`Transfer DO (${newDO.docNo}) berhasil & Surat Jalan diterbitkan!`);
    return true;
  };

  const approveOrRejectOutlet = (outletId: string, status: "Aktif" | "Tidak Aktif") => {
    const outlet = outlets.find((o) => o.id === outletId);
    setOutlets((prev) => prev.map((o) => (o.id === outletId ? { ...o, status } : o)));
    if (outlet) {
      setUsers((prev) => prev.map((u) => (u.id === outlet.userId ? { ...u, status } : u)));
    }
    toast.success(`Status pangkalan diperbarui menjadi ${status}.`);
  };

  // Business Rule: Consumer request does NOT deduct stock until confirmed by Outlet!
  const createConsumerOrder = (order: Omit<ConsumerOrder, "id" | "createdAt" | "status">) => {
    const newOrder: ConsumerOrder = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: "Hari ini, Baru saja",
      status: "Sedang Diproses Kurir",
    };
    setOrders((prev) => [newOrder, ...prev]);
    toast.success("Pesanan PDS berhasil dikirim! Stok akan terpotong setelah dikonfirmasi pangkalan.");
    return newOrder;
  };

  const completeOrderByOutlet = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Selesai" } : o))
    );
    setOutlets((prev) =>
      prev.map((o) => {
        if (o.id !== target.outletId) return o;
        const curr = o.stock[target.productKey];
        return {
          ...o,
          soldCount: o.soldCount + target.quantity,
          stock: {
            ...o.stock,
            [target.productKey]: {
              ...curr,
              ready: Math.max(0, curr.ready - target.quantity),
              empty: target.orderOption !== "perdana" ? curr.empty + target.quantity : curr.empty,
            },
          },
        };
      })
    );
    const outlet = outlets.find((o) => o.id === target.outletId);
    const agent = agents.find((a) => a.id === outlet?.agentId);
    setSales((prev) => [
      {
        id: `sls-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        outletId: target.outletId,
        outletName: target.outletName,
        agentId: agent?.id || "agn-1",
        agentName: agent?.name || "PT Pijar Cahaya Gas",
        buyerName: target.consumerName,
        productKey: target.productKey,
        productName: target.productName,
        quantity: target.quantity,
        unitPrice: target.unitPrice,
        total: target.unitPrice * target.quantity,
        source: "Website PDS",
      },
      ...prev,
    ]);
    toast.success("Pesanan diselesaikan! Stok otomatis terpotong & masuk ke laporan penjualan.");
  };

  const recordDailySales = (records: Omit<SalesRecord, "id">[], reduceStock: boolean) => {
    const withIds = records.map((r, idx) => ({ ...r, id: `sls-${Date.now()}-${idx}` }));
    setSales((prev) => [...withIds, ...prev]);

    if (reduceStock && records.length > 0) {
      const outletId = records[0].outletId;
      setOutlets((prev) =>
        prev.map((o) => {
          if (o.id !== outletId) return o;
          const nextStock = { ...o.stock };
          records.forEach((rec) => {
            const curr = nextStock[rec.productKey];
            nextStock[rec.productKey] = {
              ...curr,
              ready: Math.max(0, curr.ready - rec.quantity),
              empty: curr.empty + rec.quantity,
            };
          });
          return { ...o, stock: nextStock };
        })
      );
    }
    toast.success("Laporan penjualan harian berhasil disimpan & direkap!");
  };

  const addAddress = (addr: Omit<ConsumerAddress, "id">) => {
    const newAddr: ConsumerAddress = { ...addr, id: `addr-${Date.now()}` };
    setAddresses((prev) =>
      addr.isPrimary
        ? [...prev.map((a) => ({ ...a, isPrimary: false })), newAddr]
        : [...prev, newAddr]
    );
    toast.success("Alamat pengantaran berhasil ditambahkan!");
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.info("Alamat dihapus.");
  };

  const setPrimaryAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isPrimary: a.id === id })));
    toast.success("Alamat utama diperbarui.");
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, isRead: true } : n))
    );
    toast.success("Semua notifikasi ditandai telah dibaca.");
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === "Aktif" ? "Tidak Aktif" : "Aktif" } : u
      )
    );
    toast.success("Status akun berhasil diubah.");
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success("Akun pengguna dihapus.");
  };

  const addAgentByPertamina = (data: {
    name: string;
    pic: string;
    phone: string;
    email: string;
    region: "Kota Bandung" | "Kabupaten Bandung" | "Kabupaten Sumedang" | "Kabupaten Garut";
    district: string;
    address: string;
    sppbe: string;
    warehouseCapacity: number;
  }) => {
    const uid = `usr-${Date.now()}`;
    setUsers((prev) => [
      ...prev,
      {
        id: uid,
        name: data.name,
        email: data.email,
        password: "123456",
        phone: data.phone,
        role: "agen",
        status: "Aktif",
      },
    ]);
    setAgents((prev) => [
      ...prev,
      {
        id: `agn-${Date.now()}`,
        regCode: `AGN-${Math.floor(100 + Math.random() * 899)}`,
        userId: uid,
        name: data.name,
        pic: data.pic,
        phone: data.phone,
        email: data.email,
        region: data.region,
        district: data.district,
        address: data.address,
        sppbe: data.sppbe,
        lat: -6.9175,
        lng: 107.6191,
        operatingHours: "07:00 - 20:00",
        warehouseCapacity: data.warehouseCapacity,
        status: "Valid",
        stock: {
          bg55: { ready: 100, empty: 0, quarantine: 0, price: 104000 },
          bg12: { ready: 100, empty: 0, quarantine: 0, price: 218000 },
          canister220: { ready: 50, empty: 0, quarantine: 0, price: 24000 },
          elpiji50: { ready: 20, empty: 0, quarantine: 0, price: 890000 },
        },
      },
    ]);
    toast.success("Mitra Agen Resmi berhasil ditambahkan!");
  };

  const deleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== agentId));
    toast.success("Data Agen berhasil dihapus.");
  };

  const deleteOutlet = (outletId: string) => {
    setOutlets((prev) => prev.filter((o) => o.id !== outletId));
    toast.success("Data Outlet berhasil dihapus.");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        agents,
        outlets,
        addresses,
        orders,
        stockRequests,
        transfers,
        sales,
        notifications,
        gpsCoords,
        setGpsCoords,
        detectGps,
        login,
        logout,
        registerUser,
        updateOutletStockAndPrice,
        updateOutletDeliverySettings,
        updateOutletProfile,
        updateAgentWarehouseStock,
        updateAgentProfile,
        createStockRequest,
        processStockRequest,
        createTransferDO,
        approveOrRejectOutlet,
        createConsumerOrder,
        completeOrderByOutlet,
        recordDailySales,
        addAddress,
        deleteAddress,
        setPrimaryAddress,
        markNotificationRead,
        markAllNotificationsRead,
        toggleUserStatus,
        deleteUser,
        addAgentByPertamina,
        deleteAgent,
        deleteOutlet,
        calculateDistanceKm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
