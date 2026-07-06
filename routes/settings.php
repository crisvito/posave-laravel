<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\BranchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// GROUP 1: Memenuhi pencarian rute 'settings.profile'
Route::middleware('auth')->prefix('settings')->name('settings.')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    Route::get('/appearance', function () { return Inertia::render('settings/appearance'); })->name('appearance');
});

// GROUP 2: Memenuhi pencarian rute 'dashboard.settings' untuk LINK SIDEBAR kamu
Route::middleware('auth')->prefix('dashboard/settings')->name('dashboard.settings.')->group(function () {
    
    // Menghasilkan nama rute tepat: dashboard.settings.receipt
    Route::get('/payment-proof', function () {
        return inertia('settings/payment-proof');
    })->name('receipt');

    // Menghasilkan nama rute tepat: dashboard.settings.store
    Route::get('/store', [BranchController::class, 'index'])->name('store');

    // Aksi CRUD cabang (Store, Update, Destroy)
    Route::resource('branches', BranchController::class)->except(['index', 'create', 'edit', 'show']);
});