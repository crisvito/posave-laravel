<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
  public function redirect(): RedirectResponse
  {
    return Socialite::driver('google')->redirect();
  }

  public function callback(): RedirectResponse
  {
    $googleUser = Socialite::driver('google')->user();

    $user = User::where('email', $googleUser->getEmail())->first();

    if ($user) {
      if (!$user->google_id) {
        $user->update(['google_id' => $googleUser->getId()]);
      }
      if (!$user->email_verified_at) {
        $user->update(['email_verified_at' => now()]);
      }
    } else {
      $user = User::create([
        'name' => $googleUser->getName() ?: 'Google User',
        'email' => $googleUser->getEmail(),
        'password' => Hash::make(Str::random(32)),
        'google_id' => $googleUser->getId(),
        'email_verified_at' => now(),
      ]);
    }

    Auth::login($user, remember: true);

    if (!$user->company_id) {
      return redirect()->route('onboarding');
    }

    return redirect()->route('dashboard.index');
  }
}
