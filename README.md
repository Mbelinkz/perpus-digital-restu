# 📚 Perpustakaan Digital "Sumber Ilmu" — SD Negeri 1 Rejoso

Aplikasi Web Perpustakaan Digital terpadu untuk **SD Negeri 1 Rejoso** yang dilengkapi dengan Katalog Buku Fisik, Pembaca E-Book Interaktif, Galeri Karya Siswa, Pojok Cerpen Siswa, Grafik Progress Keaktifan, Cetak Kartu Anggota, serta Arsitektur **1 Database Terpadu** (Mendukung Server Hosting, Google Drive Cloud, dan Penyimpanan Lokal).

---

## 📂 Struktur File Kelengkapan Hosting

Seluruh file kelengkapan telah disiapkan agar aplikasi ini dapat langsung di-*deploy* ke berbagai layanan hosting:

| Nama File | Fungsi Utama |
| :--- | :--- |
| [`index.html`](./index.html) | File utama aplikasi web (*entry point* wajib untuk semua layanan hosting). |
| [`perpustakaan_digital_sumber_ilmu_sdn_1_rejoso.html`](./perpustakaan_digital_sumber_ilmu_sdn_1_rejoso.html) | Salinan identik aplikasi utama untuk penggunaan mandiri/lokal. |
| [`database.json`](./database.json) | File **1 Database Terpadu** di sisi server (menyimpan profil, siswa, buku, peminjaman, kunjungan, karya, & cerpen). |
| [`api.php`](./api.php) | Endpoint backend REST API otomatis untuk **cPanel / Shared Hosting / Apache / XAMPP**. |
| [`.htaccess`](./.htaccess) | Konfigurasi server Apache/cPanel (routing `/api/db`, kompresi GZIP, keamanan header, anti-cache database). |
| [`server.js`](./server.js) & [`package.json`](./package.json) | Server **Node.js** tanpa dependensi eksternal (*zero-dependency*) untuk VPS, Render, Railway, atau Server Lokal Sekolah. |
| [`google-apps-script.gs`](./google-apps-script.gs) | Kode backend **Google Apps Script** agar Google Drive sekolah dapat menjadi Cloud Database gratis. |
| [`manifest.json`](./manifest.json) & [`sw.js`](./sw.js) | Kelengkapan **PWA (Progressive Web App)** agar aplikasi bisa di-*install* di HP Android/iOS & Laptop. |
| [`favicon.svg`](./favicon.svg) | Ikon resmi aplikasi Perpustakaan Sumber Ilmu pada tab browser dan layar utama HP. |
| [`vercel.json`](./vercel.json) & [`netlify.toml`](./netlify.toml) | Konfigurasi *deploy* instan 1-klik ke **Vercel** dan **Netlify**. |
| [`Dockerfile`](./Dockerfile) | Konfigurasi container untuk Cloud Run / Docker VPS. |

---

## 🚀 Panduan Cara Deploy / Hosting

Anda bebas memilih **salah satu** dari 4 metode hosting di bawah ini sesuai fasilitas sekolah:

### Opsi 1: Hosting di cPanel / Shared Hosting Sekolah (Rekomendasi untuk Domain `.sch.id`)
1. Masuk ke **cPanel** hosting sekolah Anda, lalu buka **File Manager**.
2. Masuk ke folder `public_html` (atau buat subfolder seperti `public_html/perpus`).
3. Unggah (*Upload*) file berikut:
   - `index.html`
   - `api.php`
   - `database.json`
   - `.htaccess`
   - `manifest.json`, `sw.js`, dan `favicon.svg`
4. Pastikan *permission* file `database.json` adalah `644` atau `664` agar `api.php` dapat menyimpan perubahan peminjaman dan karya siswa secara *real-time*.
5. Selesai! Aplikasi langsung aktif dan semua siswa serta admin terhubung ke 1 database server (`database.json`).

---

### Opsi 2: Hosting Gratis di Vercel / Netlify / GitHub Pages + Database Google Drive
Cocok jika sekolah ingin menggunakan hosting gratis berkecepatan tinggi:
1. Unggah seluruh folder ini ke repositori **GitHub**, atau tarik (*drag-and-drop*) folder ini langsung ke [Netlify Drop](https://app.netlify.com/drop) / [Vercel](https://vercel.com).
2. Agar data peminjaman dan karya siswa tersimpan terpusat di **Google Drive Sekolah**:
   - Buka [script.google.com](https://script.google.com) dan buat proyek baru.
   - Salin seluruh isi file [`google-apps-script.gs`](./google-apps-script.gs) ke editor Google Apps Script.
   - Klik **Terapkan (Deploy) -> Deployment Baru -> Aplikasi Web (Web App)**.
   - Pilih *Execute as*: **Me (Saya)** dan *Who has access*: **Anyone (Siapa saja)**.
   - Salin URL Web App yang dihasilkan, lalu tempelkan pada menu **Login Admin -> Pengaturan & Database -> Integrasi Cloud Google Drive** dan klik **Kirim ke Drive**.

---

### Opsi 3: Hosting di Cloud Node.js (Render / Railway / VPS) atau Server LAN Sekolah
1. Pastikan **Node.js** sudah terpasang.
2. Jalankan perintah berikut di terminal:
   ```bash
   node server.js
   ```
   atau:
   ```bash
   npm start
   ```
3. Server otomatis berjalan di `http://localhost:3000` dan menyediakan REST API database terpadu di `/api/db`.

---

## 🔑 Akun Akses Default

### 1. Login Siswa (Menggunakan NISN)
- **Username**: `0123456789` (atau NISN siswa lainnya yang terdaftar)
- **Password**: `0123456789` (sama dengan NISN)

### 2. Login Admin Perpustakaan
- **Username**: `admin`
- **Password**: `admin123`
*(Dapat diubah kapan saja melalui menu **Panel Admin -> Pengaturan & Database**)*

