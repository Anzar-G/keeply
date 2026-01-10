<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Matikan transaksi untuk migrasi ini agar DDL tidak memblokir sesi pada Neon/Pgbouncer.
     */
    public $withinTransaction = false;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Gunakan Raw SQL IF NOT EXISTS agar ultra-robust
        DB::statement('ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)');
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS users_google_id_unique ON users (google_id)');
        DB::statement('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE users DROP COLUMN IF EXISTS google_id');
        DB::statement('ALTER TABLE users DROP COLUMN IF EXISTS avatar_url');
    }
};
