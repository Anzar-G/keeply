<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateLegacyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-legacy-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting legacy data migration...');

        // 1. Users
        $legacyUsers = \DB::table('legacy_users')->get();
        foreach ($legacyUsers as $oldUser) {
            \DB::table('users')->updateOrInsert(
                ['email' => $oldUser->email],
                [
                    'name' => $oldUser->username ?? 'Legacy User',
                    'password' => $oldUser->password,
                    'role' => $oldUser->role ?? 'user',
                    'created_at' => $oldUser->created_at,
                    'updated_at' => $oldUser->updated_at,
                ]
            );
        }
        $this->info('Users migrated.');

        $admin = \DB::table('users')->where('role', 'admin')->first();

        // 2. Groups
        $legacyGroups = \DB::table('legacy_contact_groups')->get();
        foreach ($legacyGroups as $oldGroup) {
            \DB::table('groups')->updateOrInsert(
                ['id' => $oldGroup->id],
                [
                    'name' => $oldGroup->name,
                    'description' => $oldGroup->description ?? '',
                    'created_at' => $oldGroup->created_at ?? now(),
                    'updated_at' => now(),
                ]
            );
        }
        $this->info('Groups migrated.');

        // 3. Contacts
        $legacyContacts = \DB::table('legacy_contacts')->get();
        foreach ($legacyContacts as $oldContact) {
            \DB::table('contacts')->updateOrInsert(
                ['id' => $oldContact->id],
                [
                    'name' => $oldContact->name,
                    'email' => $oldContact->email,
                    'phone' => $oldContact->phone,
                    'company' => $oldContact->company,
                    'job_title' => $oldContact->position ?? null,
                    'address' => $oldContact->address ?? null,
                    'notes' => $oldContact->notes,
                    'tags' => is_string($oldContact->tags) ? $oldContact->tags : json_encode($oldContact->tags),
                    'user_id' => $admin ? $admin->id : 1,
                    'created_at' => $oldContact->created_at ?? now(),
                    'updated_at' => now(),
                ]
            );
        }
        $this->info('Contacts migrated.');

        $this->info('Migration complete!');
    }
}
