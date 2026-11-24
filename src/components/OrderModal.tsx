"use client";

import React, { useState } from "react";
import { OutletEntity, ProductKey } from "@/types";
import { PRODUCTS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import { X, Truck, Store, CheckCircle2, Phone, Minus, Plus, Info } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderModalProps {
  outlet: OutletEntity;
  initialProductKey: ProductKey;
  distanceKm: number;
  onClose: () => void;
}

export function OrderModal({ outlet, initialProductKey, distanceKm, onClose }: OrderModalProps) {
  const { currentUser, addresses, createConsumerOrder } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [quantity, setQuantity] = useState(1);
  const [orderOption, setOrderOption] = useState<"refill" | "tradein" | "perdana">("refill");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Transfer Bank">("COD");

  const product = PRODUCTS.find((p) => p.key === initialProductKey) || PRODUCTS[0];
  const stockInfo = outlet.stock[initialProductKey];
  const primaryAddr = addresses.find((a) => a.isPrimary) || addresses[0];
  const [customAddress, setCustomAddress] = useState(
    primaryAddr?.address || "Jl. Ir. H. Juanda No. 115, Coblong, Kota Bandung"
  );

  const unitPrice =
    orderOption === "perdana"
      ? stockInfo.newCylinderPrice || stockInfo.price + 220000
      : orderOption === "tradein"
      ? stockInfo.price + (stockInfo.tradeInFee || 0)
      : stockInfo.price;

  const baseDeliveryFee =
    initialProductKey === "bg55" ? outlet.deliveryFee55 : outlet.deliveryFee12;
  const deliveryFee = deliveryMethod === "delivery" ? baseDeliveryFee : 0;
  const totalAmount = unitPrice * quantity + deliveryFee;

  const optionLabel =
    orderOption === "refill"
      ? `Isi Ulang (Tukar 1 Tabung ${product.shortName})`
      : orderOption === "tradein"
      ? `Program Trade-In Resmi (Tukar 2 Tabung Melon 3 Kg)`
      : `Beli Tabung Baru Perdana + Isi (Tanpa Tukar)`;

  const handleConfirmOrder = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    createConsumerOrder({
      consumerId: currentUser.id,
      consumerName: currentUser.name,
      consumerPhone: currentUser.phone,
      outletId: outlet.id,
      outletName: outlet.name,
      productKey: initialProductKey,
      productName: product.name,
      orderOption,
      orderOptionLabel: optionLabel,
      deliveryMethod,
      deliveryAddress: deliveryMethod === "delivery" ? customAddress : `Ambil di ${outlet.name}`,
      quantity,
      unitPrice,
      deliveryFee,
      totalAmount,
      paymentMethod,
    });
    setStep(3);
  };

  const whatsappUrl = `https://wa.me/${outlet.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Halo ${outlet.name}, saya ingin konfirmasi pesanan PDS:
- Produk: ${product.name} (${quantity} tabung)
- Opsi: ${optionLabel}
- Metode: ${deliveryMethod === "delivery" ? "Diantar Kurir (PDS)" : "Ambil di Pangkalan"}
- Alamat: ${customAddress}
- Total: Rp ${totalAmount.toLocaleString("id-ID")}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0055B8] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pesan Antar Gas (PDS)</h3>
              <p className="text-[11px] text-slate-500">
                {outlet.name} • PDS Siap Kirim
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0055B8] text-[11px] font-bold">
              Langkah {step === 3 ? "Selesai" : `${step}/2`}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {step === 1 && (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-slate-900">{product.name}</div>
                <div className="text-xs text-[#0055B8] font-bold mt-0.5">
                  Rp {stockInfo.price.toLocaleString("id-ID")}{" "}
                  <span className="text-slate-500 font-normal">/ tabung (Refill)</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Ongkir PDS: <strong>Rp {baseDeliveryFee.toLocaleString("id-ID")}</strong> •{" "}
                  <span className="text-emerald-600 font-semibold">Jarak: {distanceKm} km</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                Stok: {stockInfo.ready}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Jumlah Tabung:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockInfo.ready || 10, quantity + 1))}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#0055B8]" /> Pilihan Opsi Tabung Gas:
                </span>
                <span className="text-[10px] text-slate-400">Tarif Terkonfigurasi Pangkalan</span>
              </div>

              <label
                onClick={() => setOrderOption("refill")}
                className={`block p-3.5 rounded-2xl border cursor-pointer transition ${
                  orderOption === "refill" ? "border-[#0055B8] bg-blue-50/40" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <input type="radio" checked={orderOption === "refill"} onChange={() => setOrderOption("refill")} className="mt-1 accent-[#0055B8]" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Isi Ulang (Refill) Tabung Sejenis</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Siapkan 1 tabung kosong {product.shortName} untuk ditukar saat kurir tiba.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    Rp {stockInfo.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </label>

              {(initialProductKey === "bg55" || initialProductKey === "bg12") && (
                <>
                  <label
                    onClick={() => setOrderOption("tradein")}
                    className={`block p-3.5 rounded-2xl border cursor-pointer transition ${
                      orderOption === "tradein" ? "border-[#0055B8] bg-blue-50/40" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <input type="radio" checked={orderOption === "tradein"} onChange={() => setOrderOption("tradein")} className="mt-1 accent-[#0055B8]" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Program Trade-In Resmi (Tukar 2 Tabung Melon 3 Kg)</div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Tukar 2 tabung kosong LPG 3 Kg subsidi untuk beralih ke {product.shortName}.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 shrink-0">
                        Rp {(stockInfo.price + (stockInfo.tradeInFee || 0)).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setOrderOption("perdana")}
                    className={`block p-3.5 rounded-2xl border cursor-pointer transition ${
                      orderOption === "perdana" ? "border-[#0055B8] bg-blue-50/40" : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <input type="radio" checked={orderOption === "perdana"} onChange={() => setOrderOption("perdana")} className="mt-1 accent-[#0055B8]" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Beli Tabung Baru Perdana + Isi (Tanpa Tukar)</div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Pembelian paket perdana tabung baja {product.shortName} baru beserta isi.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 shrink-0">
                        Rp {(stockInfo.newCylinderPrice || stockInfo.price + 220000).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </label>
                </>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800">Metode Pengambilan Tabung Gas</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`p-3 rounded-2xl border text-left transition ${
                    deliveryMethod === "delivery" ? "border-[#0055B8] bg-blue-50/40" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Truck className="w-4 h-4 text-[#0055B8]" />
                    <span>Diantar Kurir (PDS)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Antar langsung ke rumah</div>
                  <div className="text-[11px] font-bold text-[#0055B8] mt-1.5">
                    Ongkir: Rp {baseDeliveryFee.toLocaleString("id-ID")}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`p-3 rounded-2xl border text-left transition ${
                    deliveryMethod === "pickup" ? "border-[#0055B8] bg-blue-50/40" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Store className="w-4 h-4 text-slate-700" />
                    <span>Ambil di Pangkalan</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Bawa tabung ke outlet</div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-1.5">
                    Bebas Ongkir (Rp 0)
                  </div>
                </button>
              </div>
            </div>

            {deliveryMethod === "delivery" && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Alamat Pengantaran</label>
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-bold transition"
            >
              Lanjut ke Pembayaran (Rp {totalAmount.toLocaleString("id-ID")}) →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{product.name} (×{quantity} tabung)</span>
                <span className="font-semibold text-slate-900">Rp {(unitPrice * quantity).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim ({deliveryMethod === "delivery" ? "PDS" : "Ambil Sendiri"})</span>
                <span className="font-semibold text-slate-900">Rp {deliveryFee.toLocaleString("id-ID")}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold">
                <span>Total Pembayaran</span>
                <span className="text-[#0055B8]">Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-800">Metode Pembayaran</div>
              <label
                onClick={() => setPaymentMethod("COD")}
                className={`block p-3.5 rounded-2xl border cursor-pointer ${
                  paymentMethod === "COD" ? "border-[#0055B8] bg-blue-50/30" : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="accent-[#0055B8]" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Bayar Tunai di Tempat (COD)</div>
                    <p className="text-[11px] text-slate-500">Bayar langsung ke kurir saat tabung gas tiba di rumah.</p>
                  </div>
                </div>
              </label>

              {outlet.bankAccount ? (
                <label
                  onClick={() => setPaymentMethod("Transfer Bank")}
                  className={`block p-3.5 rounded-2xl border cursor-pointer ${
                    paymentMethod === "Transfer Bank" ? "border-[#0055B8] bg-blue-50/30" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input type="radio" checked={paymentMethod === "Transfer Bank"} onChange={() => setPaymentMethod("Transfer Bank")} className="accent-[#0055B8]" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Transfer Bank ({outlet.bankName} — {outlet.bankAccount})
                      </div>
                      <p className="text-[11px] text-slate-500">A/N {outlet.bankHolder}</p>
                    </div>
                  </div>
                </label>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                  Pangkalan ini hanya melayani pembayaran <strong>Bayar Tunai di Tempat (COD)</strong> karena belum mengaktifkan rekening transfer bank.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                ← Kembali
              </button>
              <button onClick={handleConfirmOrder} className="px-6 py-2.5 rounded-xl bg-[#0055B8] hover:bg-[#003B82] text-white text-xs font-bold transition">
                Selesaikan Pesanan ✓
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">Pesanan Berhasil Dikirim!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Pangkalan <strong>{outlet.name}</strong> telah menerima rincian pemesanan Anda.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-left space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Pemesan:</span><span className="font-bold text-slate-900">{currentUser?.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Metode Pengambilan:</span><span className="font-bold text-emerald-600">{deliveryMethod === "delivery" ? "Diantar Kurir (PDS)" : "Ambil di Pangkalan"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Produk:</span><span className="font-bold text-slate-900">{product.name} ({quantity} Tbg)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Metode Bayar:</span><span className="font-bold text-[#0055B8]">{paymentMethod}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2"><span className="text-slate-500">Total Tagihan:</span><span className="font-extrabold text-emerald-600 text-sm">Rp {totalAmount.toLocaleString("id-ID")}</span></div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-[#00A651] hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Konfirmasi Cepat via WhatsApp</span>
            </a>

            <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}