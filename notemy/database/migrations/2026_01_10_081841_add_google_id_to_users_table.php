<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cek google_id secara terpisah
        if (!Schema::hasColumn('users', 'google_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('google_id')->nullable()->unique()->after('email');
            });
        }

        // Cek avatar_url secara terpisah
        if (!Schema::hasColumn('users', 'avatar_url')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('avatar_url')->nullable()->after('role');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'google_id')) {
                $table->dropColumn('google_id');
            }
            if (Schema::hasColumn('users', 'avatar_url')) {
                $table->dropColumn('avatar_url');
            }
        });
    }
};
