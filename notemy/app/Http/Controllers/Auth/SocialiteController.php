<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Whitelisting Logic: Hanya email yang sudah terdaftar yang bisa masuk
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                return redirect()->route('login')->with('error', 'Email tidak terdaftar dalam whitelist.');
            }

            // Hubungkan Google ID jika belum ada
            if (!$user->google_id) {
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar_url' => $googleUser->getAvatar(),
                ]);
            }

            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false));

        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'Gagal masuk dengan Google: ' . $e->getMessage());
        }
    }
}
