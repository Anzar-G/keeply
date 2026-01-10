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


require __DIR__ . '/auth.php';
