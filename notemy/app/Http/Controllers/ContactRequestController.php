<?php

namespace App\Http\Controllers;

use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class ContactRequestController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Rate limiting: 5 requests per day per IP
            $key = 'contact-request:' . $request->ip();

            if (RateLimiter::tooManyAttempts($key, 5)) {
                return back()->withErrors([
                    'message' => 'Anda telah mencapai batas maksimal permintaan hari ini (5 permintaan). Silakan coba lagi besok.'
                ]);
            }

            $validated = $request->validate([
                'contact_id' => 'required|string|max:255',
                'requester_name' => 'required|string|max:255',
                'requester_email' => 'required|email|max:255',
                'message' => 'nullable|string|max:1000',
            ]);

            $validated['ip_address'] = $request->ip();
            $validated['status'] = 'pending';

            ContactRequest::create($validated);

            // Increment rate limiter (expires in 24 hours)
            RateLimiter::hit($key, 86400);

            return back()->with('success', 'Permintaan Anda telah dikirim. Admin akan meninjau dan menghubungi Anda via email.');
        } catch (\Exception $e) {
            \Log::error('Contact Request Error: ' . $e->getMessage());
            return back()->withErrors([
                'message' => 'Terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.'
            ]);
        }
    }
}
