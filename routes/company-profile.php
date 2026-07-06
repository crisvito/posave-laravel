<?php

use App\Http\Controllers\CompanyProfile\BlogController;
use App\Http\Controllers\CompanyProfile\FaqController;
use App\Http\Controllers\CompanyProfile\InquiryController;
use Illuminate\Support\Facades\Session;
use App\Models\Testimonial;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('company-profile/welcome/welcome', [
        'testimonials' => Testimonial::all(),
    ]);
})->name('home');

Route::prefix('hubungi-kami')->name('contact-us.')->group(function () {
    Route::get('/', [InquiryController::class, 'index'])->name('index');
    Route::post('/', [InquiryController::class, 'store'])->name('store');
});

Route::get('faq', [FaqController::class, 'index'])->name('faq');

Route::get('/layanan', function () {
    return Inertia::render('company-profile/services/services');
})->name('service.index');

Route::prefix('artikel')->name('artikel.')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('index');
    Route::get('/semua', [BlogController::class, 'all'])->name('all');
    Route::get('/{id}', [BlogController::class, 'show'])->name('show');
});

// =========================================================================
// RUTE LOKALISASI / PENUKAR BAHASA (Ketik di browser untuk ganti bahasa)
// =========================================================================
Route::get('language/{locale}', function (Request $request, $locale) {
    if (in_array($locale, ['en', 'id'])) {
        $request->session()->put('locale', $locale);
    }
})->name('language.switch');