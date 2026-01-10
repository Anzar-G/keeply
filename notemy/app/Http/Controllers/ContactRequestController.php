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
            // Log incoming request for debugging
            \Log::info('Contact Request Attempt', [
                'ip' => $request->ip(),
                'data' => $request->all()
            ]);

            // Rate limiting: 5 requests per day per IP
            $key = 'contact-request:' . $request->ip();

            if (RateLimiter::tooManyAttempts($key, 5)) {
                \Log::warning('Rate limit exceeded', ['ip' => $request->ip()]);
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

            \Log::info('Creating contact request', $validated);

            $contactRequest = ContactRequest::create($validated);

            \Log::info('Contact request created successfully', ['id' => $contactRequest->id]);

            // Increment rate limiter (expires in 24 hours)
            RateLimiter::hit($key, 86400);

            return back()->with('success', 'Permintaan Anda telah dikirim. Admin akan meninjau dan menghubungi Anda via email.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation Error in Contact Request', [
                'errors' => $e->errors(),
                'data' => $request->all()
            ]);
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Contact Request Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $request->all()
            ]);
            return back()->withErrors([
                'message' => 'Terjadi kesalahan saat mengirim permintaan. Silakan coba lagi.'
            ]);
        }
    }
}
