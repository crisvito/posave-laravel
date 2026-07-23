<?php

use App\Http\Controllers\Advance\Management\Employee\EmployeeController;
use App\Http\Controllers\Advance\Management\Inventory\AdjustmentController;
use App\Http\Controllers\Advance\Management\Inventory\CategoryController;
use App\Http\Controllers\Advance\Management\Inventory\ItemController;
use App\Http\Controllers\Advance\Management\Inventory\PurchaseOrderController;
use App\Http\Controllers\Advance\Management\Inventory\SupplierController;
use App\Http\Controllers\Advance\Management\Inventory\TransferController;
use App\Http\Controllers\Advance\Management\ReportController;
use App\Http\Controllers\Advance\Management\Settings\SettingsController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->name('dashboard.')->group(function () {

  Route::middleware('role:owner,branch_manager')->group(function () {
    Route::prefix('inventory')->name('inventory.')->group(function () {
      Route::resource('items', ItemController::class);
      Route::patch('/items/{item}/stock', [ItemController::class, 'adjustStock'])->name('items.stock');
      Route::resource('suppliers', SupplierController::class);
      Route::resource('purchase-orders', PurchaseOrderController::class);
      Route::resource('transfers', TransferController::class)->except(['update']);
      Route::patch('/transfers/{transfer}/accept', [TransferController::class, 'accept'])->name('transfers.accept');
      Route::patch('/transfers/{transfer}/reject', [TransferController::class, 'reject'])->name('transfers.reject');
      Route::resource('adjustments', AdjustmentController::class);
      Route::resource('categories', CategoryController::class);

      Route::middleware('role:owner')->group(function () {
        Route::patch('/items/{item}/toggle-active', [ItemController::class, 'toggleActive'])->name('items.toggle-active');
        Route::patch('/categories/{category}/toggle-active', [CategoryController::class, 'toggleActive'])->name('categories.toggle-active');
        Route::patch('/suppliers/{supplier}/toggle-active', [SupplierController::class, 'toggleActive'])->name('suppliers.toggle-active');
      });
    });

    Route::resource('reports', ReportController::class);
    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');

    Route::middleware('role:owner')->group(function () {
      Route::get('/employees/create', [EmployeeController::class, 'create'])->name('employees.create');
      Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    });

    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    Route::patch('/employees/{employee}/toggle-active', [EmployeeController::class, 'toggleActive'])->name('employees.toggle-active');
  });
});

Route::middleware(['auth', 'onboarded', 'advance', 'role:owner'])->group(function () {
  Route::get('/settings/company-profile', [SettingsController::class, 'companyProfile'])->name('settings.company-profile');
  Route::post('/settings/company-profile', [SettingsController::class, 'updateCompanyProfile'])->name('settings.company-profile.update');

  Route::get('/settings/branches', [SettingsController::class, 'branches'])->name('settings.branches');
  Route::post('/settings/branches', [SettingsController::class, 'storeBranch'])->name('settings.branches.store');
  Route::put('/settings/branches/{branch}', [SettingsController::class, 'updateBranch'])->name('settings.branches.update');
  Route::delete('/settings/branches/{branch}', [SettingsController::class, 'destroyBranch'])->name('settings.branches.destroy');

  Route::get('/settings/receipt', [SettingsController::class, 'receiptSettings'])->name('settings.receipt');
  Route::post('/settings/receipt', [SettingsController::class, 'updateReceiptSettings'])->name('settings.receipt.update');
});
