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
└── entrypoint.sh             # Script inisialisasi server (Migration & Cache)
```

---

## 🏗️ Technology Stack

### Backend (The Brain) 🧠

* **Framework**: [Laravel 11](https://laravel.com)
* **Admin Panel**: [Filament PHP 3](https://filamentphp.com)
* **Database**: PostgreSQL (via [Neon Tech](https://neon.tech))
* **Security**: Laravel Breeze, Spatie Permissions.

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

## 🚀 Deployment Access

* **Live URL**: `https://keeply-i2wa.onrender.com`
* **Access Levels**:
  * **Guest**: View Contacts Only (Homepage).
  * **Admin**: Akun administrator utama untuk manajemen konten. (Login: `admin@notemy.app` / Password silakan diubah via Profile).

---

> *"Notemy membuktikan bahwa aplikasi korporat tidak harus kaku dan membosankan. Ia bisa cepat, aman, dan tetap memanjakan mata."*
