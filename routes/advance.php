<?php

use App\Http\Controllers\Advance\Owner\DashboardController;
use App\Http\Controllers\Advance\Owner\EmployeeController;
use App\Http\Controllers\Advance\Owner\Inventory\AdjustmentController;
use App\Http\Controllers\Advance\Owner\Inventory\InventoryCategoryController;
use App\Http\Controllers\Advance\Owner\Inventory\InventoryListController;
use App\Http\Controllers\Advance\Owner\Inventory\PurchaseOrderController;
use App\Http\Controllers\Advance\Owner\Inventory\SupplierController;
use App\Http\Controllers\Advance\Owner\Inventory\TransferController;
use App\Http\Controllers\Advance\Owner\MessageController;
use App\Http\Controllers\Advance\Owner\ReportController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\BranchController;

Route::middleware('auth')->prefix('dashboard')->name('dashboard.')->group(function () {

  Route::get('/', [DashboardController::class, 'index'])->name('index');

  Route::prefix('inventory')->name('inventory.')->group(function () {

    Route::resource('items', InventoryListController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('purchase-orders', PurchaseOrderController::class);
    Route::resource('transfers', TransferController::class);
    Route::resource('adjustments', AdjustmentController::class);
    Route::resource('categories', InventoryCategoryController::class);
  });

  Route::prefix('employees')->name('employees.')->group(function () {
    Route::resource('employees', EmployeeController::class);
  });

  Route::prefix('reports')->name('reports')->group(function () {
    Route::resource('reports', ReportController::class);
  });

  Route::prefix('messages')->name('messages')->group(function () {
    Route::resource('messages', MessageController::class);
  });
});
