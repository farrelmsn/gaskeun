import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GasNPSO - Sales Area Retail Bandung | PT Pertamina Patra Niaga",
  description: "Sistem Informasi Pengelolaan Jaringan Agen dan Outlet LPG Non-Subsidi (Bright Gas 5.5 kg, 12 kg, Canister & Elpiji 50 kg).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${poppins.className} min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900`}>
        <AppProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AppProvider>
      </body>
    </html>
  );
}