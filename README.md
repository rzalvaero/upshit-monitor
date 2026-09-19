# 🚀 Open Uptime Monitor

Uptime Monitor pribadi dan elegan yang dibangun dengan **Next.js**, **Tailwind CSS**, dan **Supabase**. Pantau status server dan API Anda secara *real-time* dengan cron jobs otomatis, tanpa biaya berlangganan!

## ✨ Fitur
- 🟢 **Monitoring Real-time:** Melacak status *Operational* atau *Down* dari Endpoint Anda.
- ⚡ **Cron Otomatis:** Berjalan di latar belakang (Background) 24/7 menggunakan Vercel Cron.
- 🎨 **UI/UX Premium:** Antarmuka bergaya *Glassmorphism* lengkap dengan fitur *Dark Mode*.
- 📊 **Status Bars:** Riwayat *Uptime* bergaya batang vertikal mirip seperti *UptimeRobot*.
- 🗄️ **Database Serverless:** Mendukung koneksi Postgres (dioptimalkan untuk Supabase).

---

## ⚡ Instalasi Instan (Cara Termudah)

Cara termudah untuk menggunakan proyek ini untuk Anda sendiri adalah dengan men-deploy-nya langsung ke Vercel secara gratis. Anda hanya memerlukan akun **GitHub**, **Vercel**, dan **Supabase** (untuk Database).

### Langkah 1: Siapkan Database Supabase
1. Buat proyek baru di [Supabase](https://database.new/).
2. Buka menu **Project Settings > Database**.
3. Salin **Connection String (URI)** Anda. Pastikan Anda memiliki 2 buah link:
   - **Transaction Pooler (Port 6543)** untuk `DATABASE_URL` (Contoh: `...pooler.supabase.com:6543/postgres?pgbouncer=true`)
   - **Session Pooler (Port 5432)** untuk `DIRECT_URL` (Contoh: `...pooler.supabase.com:5432/postgres`)
   - **Password Rahasia** untuk `ADMIN_PASSWORD` (Bebas, contoh: `rahasia123` - untuk akses admin)

### Langkah 2: Deploy ke Vercel

Cukup klik tombol di bawah ini. Vercel akan otomatis menyalin proyek ini ke akun GitHub Anda, meminta Anda memasukkan ketiga variabel di atas, lalu membuat tabel database-nya secara otomatis!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA&env=DATABASE_URL,DIRECT_URL,ADMIN_PASSWORD&envDescription=Masukkan%20koneksi%20Supabase%20dan%20Password%20Admin%20untuk%20mengamankan%20dashboard%20Anda.)

*(Catatan: Harap ganti `USERNAME_ANDA` dan `NAMA_REPO_ANDA` pada link tombol di atas sesuai dengan URL repositori GitHub tempat Anda mengupload kodingan ini nantinya)*

### Langkah 3: Aktifkan Cron Job
Setelah berhasil ter-deploy, jangan lupa masuk ke Dashboard Vercel proyek Anda:
1. Pergi ke **Settings > Cron Jobs**.
2. Pastikan rute `/api/cron/check` (yang sudah terkonfigurasi di `vercel.json`) berstatus aktif. Ini akan memastikan monitor Anda mengecek server setiap 5 menit.

---

## 💻 Instalasi Lokal (Bagi Pengembang)

Jika Anda ingin menjalankan atau memodifikasi kode ini di komputer Anda sendiri:

```bash
# 1. Clone repository
git clone https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git
cd uptime

# 2. Install dependencies
npm install

# 3. Setup file .env (Copy dan sesuaikan)
cp .env.example .env

# 4. Push Skema ke Database Anda
npx prisma db push

# 5. Jalankan server
npm run dev
```

Buka `http://localhost:3000` di browser Anda!

---
*Dibangun dengan ❤️ oleh [Nama/Organisasi Anda]*
