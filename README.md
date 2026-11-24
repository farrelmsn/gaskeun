# GasNPSO Bandung V2.0 — PT Pertamina Patra Niaga (Sales Area Retail Bandung)

Aplikasi web multi-peran terintegrasi untuk pengelolaan jaringan agen & outlet LPG Non-Subsidi (Bright Gas 5,5 kg, 12 kg, Canister 220 gr, dan Elpiji 50 kg) pada wilayah **Kota Bandung, Kabupaten Bandung, Kabupaten Sumedang, dan Kabupaten Garut**.

## Teknologi
- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons + Sonner Toast
- **Peta Interaktif:** Leaflet + OpenStreetMap (Real-time Marker & Rute Google Maps)
- **Ekspor Laporan:** ExcelJS (`.xlsx`) & jsPDF + AutoTable (`.pdf` + Surat Jalan DO)
- **Database & Auth:** Supabase PostgreSQL / Auth Ready (`supabase/schema.sql`) + Sinkronisasi Lokal Real-Time antar Tab (`localStorage`) agar langsung bisa dipakai setelah deploy di Vercel.

## Akun Login Terdaftar (Bisa Langsung Dipakai)
| Peran (Role) | Email | Password |
| :--- | :--- | :--- |
| **PT Pertamina Patra Niaga** | `pertaminagas@gmail.com` | `pertaminagas321` |
| **Agen Resmi (PT Pijar Cahaya Gas)** | `pijarcahaya@gmail.com` | `pijar123` |
| **Outlet Resmi (Outlet Ali Sobar)** | `alisobar@gmail.com` | `alisobar123` |
| **Konsumen (Farrel Maisoon Maulana)** | `mocasfarrelm@gmail.com` | `mocas123` |

## Cara Menjalankan di Lokal
```bash
npm install
npm run dev
```
Buka `http://localhost:3000`.

## Cara Deploy ke Vercel (Siap Langsung Online)
1. Ekstrak file `gasnpso-bandung-vercel.zip`.
2. Upload folder hasil ekstrak ke repository **GitHub** baru Anda (atau jalankan `vercel` CLI di folder tersebut).
3. Buka [vercel.com](https://vercel.com) → **Add New Project** → pilih repository GitHub Anda → klik **Deploy**.
4. *(Opsional untuk Database Supabase)*:
   - Jalankan script SQL pada `supabase/schema.sql` di **Supabase SQL Editor**.
   - Masukkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` pada **Vercel → Project Settings → Environment Variables**, lalu redeploy.
