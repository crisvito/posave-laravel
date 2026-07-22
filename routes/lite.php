<?php

use App\Http\Controllers\Lite\Inventory\AdjustmentController;
use App\Http\Controllers\Lite\Inventory\CategoryController;
use App\Http\Controllers\Lite\Inventory\ItemController;
use App\Http\Controllers\Lite\OrderController;
use App\Http\Controllers\Lite\HistoryController;
use App\Http\Controllers\Lite\SettingsController;
use Illuminate\Support\Facades\Route;

Route::prefix('inventory')->name('lite.inventory.')->group(function () {
  Route::get('/items', [ItemController::class, 'index'])->name('items.index');
  Route::post('/items', [ItemController::class, 'store'])->name('items.store');
  Route::put('/items/{item}', [ItemController::class, 'update'])->name('items.update');
  Route::patch('/items/{item}/stock', [ItemController::class, 'adjustStock'])->name('items.stock');
  Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');

  Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
  Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
  Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
  Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

  Route::get('/adjustments', [AdjustmentController::class, 'index'])->name('adjustments.index');
  Route::post('/adjustments', [AdjustmentController::class, 'store'])->name('adjustments.store');
  Route::put('/adjustments/{adjustment}', [AdjustmentController::class, 'update'])->name('adjustments.update');
  Route::delete('/adjustments/{adjustment}', [AdjustmentController::class, 'destroy'])->name('adjustments.destroy');
});

Route::get('/order', [OrderController::class, 'index'])->name('lite.order.index');
Route::post('/order', [OrderController::class, 'store'])->name('lite.order.store');
Route::get('/history', [HistoryController::class, 'index'])->name('lite.history.index');

Route::get('/store-settings/profile', [SettingsController::class, 'profile'])->name('lite.settings.profile.index');
Route::post('/store-settings/profile', [SettingsController::class, 'updateProfile'])->name('lite.settings.profile.update');
Route::get('/store-settings/receipt', [SettingsController::class, 'receipt'])->name('lite.settings.receipt.index');
Route::post('/store-settings/receipt', [SettingsController::class, 'updateReceipt'])->name('lite.settings.receipt.update');
