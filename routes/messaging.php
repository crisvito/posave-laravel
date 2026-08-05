<?php

use App\Http\Controllers\Advance\MessagingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'onboarded', 'advance'])->group(function () {
  Route::get('/messaging', [MessagingController::class, 'index'])->name('messaging.index');

  Route::get('/messaging/conversations/{conversation}/messages', [MessagingController::class, 'getMessages'])->name('messaging.messages');
  Route::post('/messaging/conversations/{conversation}/messages', [MessagingController::class, 'sendMessage'])->name('messaging.send');
  Route::post('/messaging/conversations/private', [MessagingController::class, 'startPrivateConversation'])->name('messaging.private');

  Route::post('/messaging/broadcasts', [MessagingController::class, 'storeBroadcast'])->name('messaging.broadcast.store');
  Route::delete('/messaging/broadcasts/{broadcast}', [MessagingController::class, 'destroyBroadcast'])->name('messaging.broadcast.destroy');

  Route::post('/messaging/notes', [MessagingController::class, 'storeNote'])->name('messaging.note.store');
  Route::put('/messaging/notes/{note}', [MessagingController::class, 'updateNote'])->name('messaging.note.update');
  Route::delete('/messaging/notes/{note}', [MessagingController::class, 'destroyNote'])->name('messaging.note.destroy');

  Route::post('/messaging/{conversation}/read', [MessagingController::class, 'markRead'])->name('messaging.mark-read');
});
