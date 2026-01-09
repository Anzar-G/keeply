# Notemy 🐘⚛️

Modern Contact Management System built with Laravel 11, Inertia.js, and React.

## 🚀 Fitur Utama

- **Dashboard Analitik**: Grafik pertumbuhan kontak real-time.
- **Manajemen Kontak**: CRUD lengkap dengan filter canggih.
- **Premium UI**: Desain "Dark Blue" yang elegan dan responsif.
- **Admin Panel**: Backend manajemen user via Filament PHP.

## 🌍 Cara Deploy (Render.com)

Aplikasi ini sudah dikonfigurasi untuk deployment mudah menggunakan Docker di Render.com.

### Langkah-langkah

1. **Push Kode**: Upload seluruh folder `notemy` ini ke repositori GitHub/GitLab Anda.
2. **Buka Render**: Login ke [Render Dashboard](https://dashboard.render.com).
3. **New Web Service**:
    - Klik tombol **New +** -> **Web Service**.
    - Connect akun GitHub dan pilih repo `notemy` Anda.
4. **Konfigurasi**:
    - **Runtime**: Pilih `Docker`.
    - **Root Directory**: Ketik `notemy` (PENTING! Karena kode ada di folder ini).
    - **Region**: Singapore (biar dekat Indonesia).
    - **Instance Type**: `Free` (untuk coba-coba) atau `Starter`.
5. **Environment Variables** (Wajib Diisi di menu Environment):
    - `APP_KEY`: (Generate pakai `php artisan key:generate --show` di lokal lalu copy).
    - `APP_URL`: `https://nama-project-kamu.onrender.com`
    - `DB_CONNECTION`: `pgsql`
    - `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: (Ambil dari detail database Neon atau Render PostgreSQL Anda).
    - `ASSET_URL`: Kosongkan saja (atau isi URL Render jika perlu).
    - `ABSOLUTE_HTTPS`: `true` (Penting!).

6. **Deploy**: Klik **Create Web Service**.

Render akan otomatis:

1. Build image Docker.
2. Install dependensi PHP & Node.js.
3. Jalankan migrasi database (`php artisan migrate --force`).
4. Jalankan aplikasi!

## 💻 Instalasi Lokal

1. Clone repo.
2. `composer install`
3. `npm install && npm run build`
4. Copy `.env.example` ke `.env` dan atur database.
5. `php artisan key:generate`
6. `php artisan migrate`
7. `php artisan serve`

## 🔐 Login Default

- **Email**: `admin@notemy.app`
- **Password**: `password`
