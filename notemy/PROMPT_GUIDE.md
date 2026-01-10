# 🤖 AI Prompt Guide: Notemy Backend & Security

 Bos, gunain prompt ini kalau Bos mau bikin sistem serupa (Laravel + React + Google Auth + Whitelist) di proyek lain. Cukup **Copy-Paste** semuanya ke AI (seperti saya).

 ---

## 🧱 PART 1: Pondasi Awal (Laravel + Filament)

 **Prompt:**
 > "Tolong buatkan pondasi backend modern menggunakan Laravel 11. Saya ingin stack berikut:
 >
 > 1. **Inertia.js + React** (Breeze) sebagai frontend stack.
 > 2. **Filament PHP** sebagai panel admin (God Mode).
 > 3. **Database PostgreSQL**.
 > 4. Buat tabel `users` dengan kolom tambahan `role` (enum: user, admin) dan `avatar_url` (nullable).
 > 5. Setup model `User` agar kolom-kolom baru tersebut 'fillable'."

 ---

## 🔐 PART 2: Keamanan Google OAuth & Whitelist (Fitur Andalan)

 **Prompt:**
 > "Saya ingin mengimplementasikan sistem login Google OAuth yang super aman dengan logika **WHITELIST**:
 >
 > 1. Gunakan **Laravel Socialite**.
 > 2. **LOGIKA PENTING**: Matikan registrasi publik. Hanya email yang sudah ada di tabel `users` yang boleh masuk via Google.
 > 3. Jika email yang mencoba login tidak ada di database, lempar kembali ke halaman login dengan error: 'Email tidak terdaftar dalam whitelist.'
 > 4. Jika email ditemukan, hubungkan `google_id` dan login-kan user tersebut secara otomatis.
 > 5. Buat file migrasinya secara cerdas (idempotent) agar tidak error saat deploy di server seperti Render/Neon."

 ---

## 👔 PART 3: Manajemen Admin via Filament

 **Prompt:**
 > "Buat Resource Filament untuk mengelola User (`UserResource`).
 >
 > 1. Admin harus bisa menambah, mengubah, dan menghapus user atau admin lainnya.
 > 2. Di form pembuatan user, tambahkan input: Name, Email, Password, dan Role (Select: Admin/User).
 > 3. Pastikan Password di-hash secara otomatis sebelum disimpan.
 > 4. Di tabel user, tampilkan badge Role yang berwarna (misal: Admin = Merah, User = Hijau)."

 ---

## 🎨 PART 4: Integrasi Frontend (Tombol Google)

 **Prompt:**
 > "Tambahkan tombol 'Masuk dengan Google' di halaman Login React.
 >
 > 1. Pastikan desainnya premium/mewah (menggunakan Tailwind CSS).
 > 2. Tambahkan separator 'Atau' di antara form login biasa dan tombol Google.
 > 3. Pastikan link-nya mengarah ke rute `/auth/google`."

 ---

 > [!TIP]
 > **Bonus Tip**: Jika AI memberikan error migrasi saat deploy, katakan padanya: *"Gunakan raw SQL ALTER TABLE IF NOT EXISTS dan matikan $withinTransaction di file migrasi."*
