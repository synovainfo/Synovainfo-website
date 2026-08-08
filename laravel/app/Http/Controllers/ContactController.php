<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class ContactController extends Controller
{
    public function index(): View
    {
        return view('contact.index');
    }

    public function submit(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // The contacts table stores a single `name` and has no subject column,
        // so fold the subject into the message to avoid losing it.
        $message = $validated['message'];
        if (!empty($validated['subject'])) {
            $message = $validated['subject']."\n\n".$message;
        }

        Contact::create([
            'name' => trim($validated['first_name'].' '.$validated['last_name']),
            'company' => $validated['company'] ?? null,
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'message' => $message,
            'source' => 'contact_form',
            'ip_address' => $request->ip(),
            'browser' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', 'Thank you for contacting us. We will get back to you shortly.');
    }
}
