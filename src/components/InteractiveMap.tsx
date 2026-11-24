"use client";

import React, { useEffect, useRef } from "react";
import { AgentEntity, OutletEntity } from "@/types";

interface InteractiveMapProps {
  agents: AgentEntity[];
  outlets: OutletEntity[];
  selectedId?: string | null;
  onSelectEntity?: (id: string) => void;
  userCoords?: { lat: number; lng: number } | null;
  heightClass?: string;
}

export function InteractiveMap({
  agents,
  outlets,
  selectedId,
  onSelectEntity,
  userCoords,
  heightClass = "h-[430px]",
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import("leaflet")).default;
      if (!isMounted || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [-6.95, 107.72],
        zoom: 10,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors | PT Pertamina Patra Niaga",
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      renderMarkers(L);
    }

    async function renderMarkers(LeafletLib?: any) {
      if (!mapRef.current || !markersLayerRef.current) return;
      const L = LeafletLib || (await import("leaflet")).default;
      const layer = markersLayerRef.current;
      layer.clearLayers();

      const bounds: [number, number][] = [];

      // Plot Agents (Blue Marker)
      agents.forEach((agn) => {
        const totalReady = Object.values(agn.stock).reduce((a, b) => a + b.ready, 0);
        const icon = L.divIcon({
          className: "custom-agent-pin",
          html: `<div style="width:34px;height:34px;border-radius:9999px;background:#0055B8;color:#fff;border:3px solid #fff;box-shadow:0 4px 10px rgba(0,85,184,0.4);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;">A</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([agn.lat, agn.lng], { icon })
          .addTo(layer)
          .bindPopup(
            `<div style="min-width:190px;font-size:12px;">
              <div style="color:#0055B8;font-weight:800;font-size:10px;text-transform:uppercase;">AGEN RESMI PERTAMINA</div>
              <div style="font-weight:800;margin-top:2px;color:#0f172a;">${agn.name}</div>
              <div style="color:#64748b;font-size:11px;margin-top:2px;">${agn.district}, ${agn.region}</div>
              <div style="margin-top:6px;padding:4px 8px;background:#eff6ff;border-radius:6px;font-weight:700;color:#0055B8;">Stok Gudang: ${totalReady} Tabung</div>
            </div>`
          );

        marker.on("click", () => onSelectEntity?.(agn.id));
        bounds.push([agn.lat, agn.lng]);
      });

      // Plot Outlets (Red Marker)
      outlets.forEach((out) => {
        const totalReady = Object.values(out.stock).reduce((a, b) => a + b.ready, 0);
        const isSel = selectedId === out.id;
        const icon = L.divIcon({
          className: "custom-outlet-pin",
          html: `<div style="width:${isSel ? 36 : 30}px;height:${isSel ? 36 : 30}px;border-radius:9999px;background:#ED1C24;color:#fff;border:3px solid #fff;box-shadow:0 4px 10px rgba(237,28,36,0.4);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;">O</div>`,
          iconSize: [isSel ? 36 : 30, isSel ? 36 : 30],
          iconAnchor: [isSel ? 18 : 15, isSel ? 18 : 15],
        });

        const marker = L.marker([out.lat, out.lng], { icon })
          .addTo(layer)
          .bindPopup(
            `<div style="min-width:200px;font-size:12px;">
              <div style="color:#ED1C24;font-weight:800;font-size:10px;text-transform:uppercase;">OUTLET RESMI • ${out.pdsActive ? "SIAP ANTAR PDS" : "REGULER"}</div>
              <div style="font-weight:800;margin-top:2px;color:#0f172a;">${out.name}</div>
              <div style="color:#64748b;font-size:11px;margin-top:2px;">${out.address}</div>
              <div style="margin-top:6px;padding:4px 8px;background:#ecfdf5;border-radius:6px;font-weight:700;color:#047857;">Stok Ready: ${totalReady} Tabung • BG 5.5kg Rp ${out.stock.bg55.price.toLocaleString("id-ID")}</div>
              <div style="margin-top:8px;display:flex;gap:6px;">
                <a href="/outlet/${out.id}" style="flex:1;text-align:center;background:#0055B8;color:#fff;padding:5px 8px;border-radius:6px;font-weight:700;text-decoration:none;font-size:11px;">Lihat Toko</a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${out.lat},${out.lng}" target="_blank" rel="noreferrer" style="flex:1;text-align:center;background:#f1f5f9;color:#0f172a;padding:5px 8px;border-radius:6px;font-weight:700;text-decoration:none;font-size:11px;">Rute Maps</a>
              </div>
            </div>`
          );

        marker.on("click", () => onSelectEntity?.(out.id));
        bounds.push([out.lat, out.lng]);
      });

      // Plot User GPS location if available
      if (userCoords) {
        const userIcon = L.divIcon({
          className: "custom-user-pin",
          html: `<div style="width:16px;height:16px;border-radius:9999px;background:#2563EB;border:3px solid #fff;box-shadow:0 0 0 6px rgba(37,99,235,0.25);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
          .addTo(layer)
          .bindPopup("<strong>Posisi Anda (Device)</strong>");
      }

      if (selectedId) {
        const selOut = outlets.find((o) => o.id === selectedId);
        const selAgn = agents.find((a) => a.id === selectedId);
        const target = selOut || selAgn;
        if (target) {
          mapRef.current.flyTo([target.lat, target.lng], 14, { duration: 0.6 });
          return;
        }
      }

      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [45, 45], maxZoom: 13 });
      }
    }

    if (!mapRef.current) {
      initMap();
    } else {
      renderMarkers();
    }

    return () => {
      isMounted = false;
    };
  }, [agents, outlets, selectedId, userCoords]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-200 bg-slate-100`}>
      <div ref={containerRef} className="w-full h-full" />

      {/* Bottom Legend matching Hi-Fi */}
      <div className="absolute bottom-3 left-3 bg-white/95 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-700 z-[400]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0055B8]" />
          Agen Utama ({agents.length})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ED1C24]" />
          Outlet ({outlets.length})
        </span>
        {userCoords && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            Posisi Anda (Device)
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Real-time Live Stock
        </span>
      </div>
    </div>
  );
}
