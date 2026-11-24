"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Bell, LogOut, Search, Truck, Menu, X, Home } from "lucide-react";

export interface NavMenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

interface DashboardShellProps {
  roleBadge: string;
  menuItems: NavMenuItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export function DashboardShell({
  roleBadge,
  menuItems,
  activeTab,
  setActiveTab,
  children,
}: DashboardShellProps) {
  const { currentUser, logout, notifications } = useApp();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const unreadCount = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.isRead
  ).length;

  const activeTitle = menuItems.find((m) => m.key === activeTab)?.label || "Dashboard";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 z-30">
        <div className="px-5 h-16 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0055B8] text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-extrabold leading-none text-slate-900">
                Gas<span className="text-[#0055B8]">NPSO</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Dashboard</div>
            </div>
          </Link>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
            V2.0
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const showSection =
              item.section && (idx === 0 || menuItems[idx - 1].section !== item.section);
            return (
              <React.Fragment key={item.key}>
                {showSection && (
                  <div className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === item.key
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-1.5">
          <Link
            href="/"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            <Home className="w-4 h-4" />
            <span>Beranda Publik</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 max-w-xs bg-white h-full flex flex-col p-4 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-extrabold text-sm">
                Gas<span className="text-[#0055B8]">NPSO</span> V2.0
              </span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    activeTab === item.key ? "bg-slate-900 text-white" : "text-slate-600"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
              {activeTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Cari data..."
                className="pl-8 pr-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs w-48 focus:outline-none focus:bg-white"
              />
            </div>

            <button
              onClick={() => setActiveTab("notifikasi")}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ED1C24] text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0055B8] font-extrabold text-xs flex items-center justify-center uppercase">
                {(currentUser?.name || "US").slice(0, 2)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-none">
                  {currentUser?.name || "Pengguna"}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{roleBadge}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}