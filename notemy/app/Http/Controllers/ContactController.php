<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Contact;
use App\Models\Group;
use App\Helpers\ObfuscateHelper;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::with('groups')->latest()->get();

        // Obfuscate sensitive data for non-admin users
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            $contacts = $contacts->map(function ($contact) {
                $contact->email = ObfuscateHelper::email($contact->email);
                $contact->phone = ObfuscateHelper::phone($contact->phone);
                return $contact;
            });
        }

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
            'groups' => Group::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $validated['id'] = 'contact_' . time() . '_' . bin2hex(random_bytes(4));
        $validated['user_id'] = auth()->id();

        Contact::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $contact->update($validated);

        return redirect()->back();
    }

    public function destroy($id)
    {
        Contact::findOrFail($id)->delete();
        return redirect()->back();
    }
}
