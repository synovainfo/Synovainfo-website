<?php

namespace App\Http\Controllers;

use App\Models\Career;
use App\Models\CareerApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CareerController extends Controller
{
    public function index(): View
    {
        $careers = Career::whereIn('status', [1, '1', true])
            ->orderBy('createdAt', 'desc')
            ->get();

        return view('careers.index', compact('careers'));
    }

    public function show(string $slug): View
    {
        $career = Career::where('slug', $slug)->firstOrFail();

        return view('careers.show', compact('career'));
    }

    public function apply(Request $request, string $slug): RedirectResponse
    {
        $career = Career::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'first_name'   => ['required', 'string', 'max:100'],
            'last_name'    => ['required', 'string', 'max:100'],
            'email'        => ['required', 'email', 'max:255'],
            'phone'        => ['required', 'string', 'max:30'],
            'linkedin'     => ['nullable', 'url', 'max:255'],
            'portfolio'    => ['nullable', 'url', 'max:255'],
            'cover_letter' => ['nullable', 'string', 'max:5000'],
            'resume'       => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ]);

        $resumePath = $request->file('resume')->store('resumes', 'public');

        CareerApplication::create([
            'career_id'    => $career->id,
            'name'         => $validated['first_name'].' '.$validated['last_name'],
            'email'        => $validated['email'],
            'phone'        => $validated['phone'],
            'linkedin_url' => $validated['linkedin'] ?? null,
            'portfolio_url'=> $validated['portfolio'] ?? null,
            'cover_letter' => $validated['cover_letter'] ?? null,
            'resume_path'  => $resumePath,
            'status'       => 'NEW',
        ]);

        return back()->with('success', 'Your application has been submitted successfully.');
    }
}
