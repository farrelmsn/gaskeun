export type UserRole = 'pertamina' | 'agen' | 'outlet' | 'konsumen';
export type ProductKey = 'bg55' | 'bg12' | 'canister220' | 'elpiji50';

export interface ProductMaster {
  key: ProductKey;
  sku: string;
  name: string;
  shortName: string;
  weightLabel: string;
  defaultPrice: number;
  unit: string;
}

export interface StockDetail {
  ready: number;
  empty: number;
  quarantine: number;
  price: number;
  tradeInFee?: number;
  tradeInActive?: boolean;
  newCylinderPrice?: number;
  newCylinderActive?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  status: 'Aktif' | 'Tidak Aktif' | 'Pending';
  nip?: string;
  jabatan?: string;
  unitKerja?: string;
  officeAddress?: string;
}

export interface AgentEntity {
  id: string;
  regCode: string;
  userId: string;
  name: string;
  pic: string;
  phone: string;
  email: string;
  region: 'Kota Bandung' | 'Kabupaten Bandung' | 'Kabupaten Sumedang' | 'Kabupaten Garut';
  district: string;
  address: string;
  sppbe: string;
  lat: number;
  lng: number;
  operatingHours: string;
  warehouseCapacity: number;
  status: 'Valid' | 'Menunggu Persetujuan' | 'Perlu Review';
  stock: Record<ProductKey, StockDetail>;
}

export interface OutletEntity {
  id: string;
  regCode: string;
  userId: string;
  agentId: string;
  name: string;
  pic: string;
  phone: string;
  email: string;
  region: 'Kota Bandung' | 'Kabupaten Bandung' | 'Kabupaten Sumedang' | 'Kabupaten Garut';
  district: string;
  address: string;
  lat: number;
  lng: number;
  operatingHours: string;
  isOpen: boolean;
  status: 'Aktif' | 'Tidak Aktif' | 'Pending';
  pdsActive: boolean;
  deliveryRadiusKm: number;
  deliveryFee55: number;
  deliveryFee12: number;
  extraKmFee: number;
  courierNote: string;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
  rating: number;
  soldCount: number;
  updatedAt: string;
  stock: Record<ProductKey, StockDetail>;
}

export interface ConsumerAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  region: string;
  district: string;
  address: string;
  note?: string;
  lat: number;
  lng: number;
  isPrimary: boolean;
}

export interface ConsumerOrder {
  id: string;
  createdAt: string;
  consumerId: string;
  consumerName: string;
  consumerPhone: string;
  outletId: string;
  outletName: string;
  productKey: ProductKey;
  productName: string;
  orderOption: 'refill' | 'tradein' | 'perdana';
  orderOptionLabel: string;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress: string;
  quantity: number;
  unitPrice: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'Transfer Bank';
  status: 'Menunggu Konfirmasi' | 'Sedang Diproses Kurir' | 'Selesai' | 'Dibatalkan';
}

export interface StockRequestItem {
  id: string;
  ticketNo: string;
  date: string;
  outletId: string;
  outletName: string;
  agentId: string;
  items: Record<ProductKey, number>;
  priority: 'Normal (Reguler)' | 'Mendesak (Stok Kritis)';
  note: string;
  status: 'Diajukan' | 'Disetujui' | 'Ditolak';
  agentResponse?: string;
}

export interface StockTransferDO {
  id: string;
  docNo: string;
  date: string;
  agentId: string;
  agentName: string;
  outletId: string;
  outletName: string;
  items: Record<ProductKey, number>;
  driverNote: string;
  status: 'Selesai' | 'Dalam Perjalanan';
}

export interface SalesRecord {
  id: string;
  date: string;
  outletId: string;
  outletName: string;
  agentId: string;
  agentName: string;
  buyerName: string;
  productKey: ProductKey;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  source: 'Website PDS' | 'Toko Fisik / Walk-in';
}

export interface NotificationItem {
  id: string;
  userId: string;
  category: string;
  sender: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}