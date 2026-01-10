<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\ContactController::class, 'index'])->name('home');
Route::get('/contacts', [\App\Http\Controllers\ContactController::class, 'index'])->name('contacts.index');
Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::post('/contacts', [\App\Http\Controllers\ContactController::class, 'store'])->name('contacts.store');
    Route::put('/contacts/{id}', [\App\Http\Controllers\ContactController::class, 'update'])->name('contacts.update');
    Route::delete('/contacts/{id}', [\App\Http\Controllers\ContactController::class, 'destroy'])->name('contacts.destroy');

    Route::get('/activities', [\App\Http\Controllers\ActivityLogController::class, 'index'])->name('activities.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/fix-admin', function () {
    $user = \App\Models\User::firstOrCreate(
        ['email' => 'admin@notemy.app'],
        [
            'name' => 'Super Admin',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]
    );
    return 'Admin User Created/Verified. Login: admin@notemy.app / password';
});

Route::get('/debug-db', function () {
    $report = [
        'users_count' => \App\Models\User::count(),
        'contacts_count' => \App\Models\Contact::count(),
        'groups_count' => \App\Models\Group::count(),
        'legacy_contacts_exists' => \Illuminate\Support\Facades\Schema::hasTable('legacy_contacts'),
        'legacy_users_exists' => \Illuminate\Support\Facades\Schema::hasTable('legacy_users'),
    ];

    if ($report['legacy_contacts_exists']) {
        $report['legacy_contacts_count'] = \Illuminate\Support\Facades\DB::table('legacy_contacts')->count();
    }

    return response()->json($report);
});

Route::get('/fix-migration', function () {
    \Illuminate\Support\Facades\Artisan::call('app:migrate-legacy-data');
    return 'Legacy Migration Triggered! Output: ' . \Illuminate\Support\Facades\Artisan::output();
});

require __DIR__ . '/auth.php';
