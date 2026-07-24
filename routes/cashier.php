<?php

use App\Http\Controllers\Advance\Cashier\HistoryController;
use App\Http\Controllers\Advance\Cashier\OrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('cashier')->name('cashier.')->group(function () {
  Route::get('/order', [OrderController::class, 'index'])->name('order.index');
  Route::post('/order', [OrderController::class, 'store'])->name('order.store');
  Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
  Route::post('/history/{transaction}/send-email', [HistoryController::class, 'sendReceiptEmail'])->name('history.send-email');
});
