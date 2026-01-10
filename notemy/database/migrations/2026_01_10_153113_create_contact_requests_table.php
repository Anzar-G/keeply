<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    // Disable automatic transaction wrapping
    public $withinTransaction = false;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Use raw SQL with IF NOT EXISTS for ultra-robust migration
        DB::statement('CREATE TABLE IF NOT EXISTS contact_requests (
            id BIGSERIAL PRIMARY KEY,
            contact_id VARCHAR(255) NOT NULL,
            requester_name VARCHAR(255) NOT NULL,
            requester_email VARCHAR(255) NOT NULL,
            message TEXT,
            status VARCHAR(50) DEFAULT \'pending\' CHECK (status IN (\'pending\', \'approved\', \'rejected\')),
            ip_address VARCHAR(255),
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        )');

        // Add foreign key constraint separately with IF NOT EXISTS check
        DB::statement('DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint WHERE conname = \'contact_requests_contact_id_foreign\'
            ) THEN
                ALTER TABLE contact_requests 
                ADD CONSTRAINT contact_requests_contact_id_foreign 
                FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;
            END IF;
        END $$;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS contact_requests CASCADE');
    }
};
