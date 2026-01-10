# 📘 Notemy - Intelligent Contact Management System

**Notemy** adalah sistem manajemen kontak modern yang menggabungkan kekuatan backend **Laravel 11** dengan interaktivitas frontend **React (via Inertia.js)**, dibalut dalam desain "Premium Dark" yang elegan. Proyek ini dirancang sebagai solusi *Monolith Modern* yang Scalable, Secure, dan User-Friendly.

---

## 🌟 Fitur Utama (Key Features)

### 1. Public Registry (Guest View) 🌐

* **Akses Tanpa Login**: Halaman depan (`/`) langsung menampilkan daftar kontak publik.
* **Read-Only Mode**: Pengunjung dapat melihat kartu kontak, filter, dan detail tanpa bisa mengubah data.
* **Call-to-Action**: Tombol "Login" dan "Register" yang intuitif untuk akses administrator.

### 2. Administrator Panel (User App) 🛡️

* **Manajemen Kontak Lengkap (CRUD)**: Tambah, Edit, Hapus, dan Lihat detail kontak.
* **Real-time Analytics**: Dashboard dengan statistik performa, grafik pertumbuhan, dan "System Pulse".
* **Advanced Filtering**: Filter kontak berdasarkan Group, Company, Tags, atau Rentang Tanggal.
* **Bulk Actions**: Hapus atau Ekspor banyak kontak sekaligus (CSV/PDF).

### 3. Super Admin Zone (Filament PHP) ⚙️

* **Backend Dashboard**: Panel khusus untuk "God Mode" menggunakan **Filament PHP**.
* **User Management**: Mengelola akun user dan Role (RBAC).
* **Activity Logs**: Melacak siapa melakukan apa, kapan, dan di mana (Audit Trail).
* **Database Management**: Akses langsung ke tabel database via GUI yang aman.

---

## 🎨 UI/UX Design Language

**aesthetic:** `Premium Dark Blue` & `Glassmorphism`

* **Color Palette**:
  * *Primary*: Indigo-600 (Brand Color)
  * *Background*: Slate-950 (Deep Dark)
  * *Surface*: Slate-900 dengan opacity (Glass Effect)
  * *Text*: Slate-100 (High Contrast)
* **Interaction**: Transisi halus (`framer-motion` feel), hover effects, dan loading states yang responsif.
* **Typography**: Menggunakan font modern sans-serif yang bersih dan mudah dibaca (Inter/Figtree).
* **Mobile First**: Sidebar responsif, tabel yang bisa di-scroll, dan layout adaptif untuk semua perangkat.

---

## 🏗️ Architecture & Data Flow

Notemy menggunakan pola **Classic Monolith** dengan **Inertia.js** sebagai jembatannya.

1. **Request**: User mengakses URL (misal `/contacts`).
2. **Controller**: Laravel mengambil data dari PostgreSQL melalui Eloquent ORM.
3. **Inertia**: Laravel mengirimkan data (Props) ke React Component tanpa memutus koneksi (Single Page Application feel).
4. **React**: Frontend merender komponen secara dinamis tanpa refresh halaman penuh.
5. **Persistence**: Data disimpan di Neon PostgreSQL dengan layer keamanan middleware Laravel.

---

## 📁 Directory Structure (Core Files)

```text
notemy/
├── app/
│   ├── Http/Controllers/    # Logika bisnis (Contacts, Dashboard, dll)
│   ├── Models/               # Struktur data (User, Contact, Group)
│   └── Providers/            # Konfigurasi sistem (HTTPS force, dll)
├── resources/
│   ├── js/
│   │   ├── Components/       # UI Reusable (ContactList, Form, dll)
│   │   ├── Layouts/          # NotemyLayout (Sidebar & Navbar)
│   │   └── Pages/            # View utama (Index, Dashboard, dll)
│   └── views/                # Root template (app.blade.php)
├── routes/
│   ├── web.php               # Routing utama & Grouping Auth
│   └── auth.php              # Routing login/register (Laravel Breeze)
├── Dockerfile                # Instruksi build server Render
├── entrypoint.sh             # Script inisialisasi server (Migration & Cache)
└── PROMPT_GUIDE.md           # Panduan prompt AI untuk replikasi proyek
```

---

## 🔐 Advanced Security & Authentication

### 1. Google OAuth (Zero-Password Login) 🌐

* **Integration**: Menggunakan `laravel/socialite` untuk autentikasi Google.
* **One-Click Experience**: Admin cukup klik "Masuk dengan Google" tanpa perlu mengingat password tambahan.

### 2. Strict Whitelisting Logic (Anti-Penyusup) 🛡️
>
> [!IMPORTANT]
> **Kenapa Tidak Ada Public Sign-Up?**
> Notemy didesain untuk kolaborasi tim internal. Karena database kontak bersifat satu kesatuan (shared database), mengizinkan orang asing mendaftar secara bebas adalah risiko besar bagi integritas data.
>
> **Sistem Kerja Whitelist:**
>
> * Hanya user yang emailnya **SUDAH TERDAFTAR** di sistem oleh Super Admin yang bisa masuk via Google.
> * Orang asing yang mencoba login pakai Google akan langsung ditolak: *"Email tidak terdaftar dalam whitelist."*

### 3. Multi-Admin Role Management 👔

* **Delegasi Tugas**: Super Admin dapat menambahkan anggota tim lain sebagai member dengan role `admin`.
* **Filament User Resource**: Manajemen admin dilakukan secara visual melalui panel God Admin (`/admin`).

---

## 🏗️ Technology Stack

### Backend (The Brain) 🧠

* **Framework**: [Laravel 11](https://laravel.com)
* **Auth Engine**: Laravel Breeze + [Laravel Socialite](https://laravel.com/docs/11.x/socialite)
* **Admin Panel**: [Filament PHP 3](https://filamentphp.com)
* **Database**: PostgreSQL (via [Neon Tech](https://neon.tech))

### Frontend (The Face) 💅

* **Framework**: [React.js](https://react.dev) & [Inertia.js](https://inertiajs.com)
* **Styling**: [Tailwind CSS](https://tailwindcss.com)
* **Icons**: Lucide React
* **Bundler**: Vite

### Infrastructure (The Home) 🏠

* **Container**: Docker 🐳
* **Host**: [Render](https://render.com)
* **SSL**: Force HTTPS via AppServiceProvider.

---

## 🛠️ Getting Started (Local Development)

Jika ingin menjalankan proyek ini secara lokal:

1. **Clone Repo**: `git clone [url-repo]`
2. **Install PHP Deps**: `composer install`
3. **Install JS Deps**: `npm install`
4. **Env Setup**: Copy `.env.example` ke `.env` dan sesuaikan DB.
5. **Migrate**: `php artisan migrate`
6. **Run Build**: `npm run dev`
7. **Serve**: `php artisan serve`

---

## 🚀 Deployment & Admin Access

* **Live URL**: [https://keeply-i2wa.onrender.com](https://keeply-i2wa.onrender.com)
* **God Admin Panel**: `/admin` (Hanya untuk Boss/Super Admin).
* **Cara Menambah Admin Baru**:
    1. Masuk ke `/admin` -> Menu **Manajemen User**.
    2. Tambahkan email Google admin baru, set role ke `admin`.
    3. Pilih password asal (tidak akan terpakai karena mereka pakai Google).
    4. Save. Admin baru sekarang bisa login via tombol Google di halaman depan.

---

> *"Notemy: Keamanan tingkat enterprise dalam balutan desain yang memanjakan mata."*
