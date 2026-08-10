<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use App\Http\Requests\Admin\NewsletterRequest;

class NewsletterController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Newsletter::query()->latest('created_at');
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('subject', 'like', "%$search%");
        }
        $newsletters = $query->paginate(15);
        return view('admin.newsletters.index', compact('newsletters'));
    }

    public function create()
    {
        return view('admin.newsletters.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\App\Http\Requests\Admin\NewsletterRequest $request)
    {
        $data = $request->validated();
        $data['recipient_count'] = 0; // Default when created
        
        Newsletter::create($data);

        return redirect()->route('admin.newsletters.index')
            ->with('success', 'Newsletter created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Newsletter $newsletter)
    {
        return view('admin.newsletters.show', compact('newsletter'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Newsletter $newsletter)
    {
        return view('admin.newsletters.edit', compact('newsletter'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(\App\Http\Requests\Admin\NewsletterRequest $request, Newsletter $newsletter)
    {
        $newsletter->update($request->validated());

        return redirect()->route('admin.newsletters.index')
            ->with('success', 'Newsletter updated successfully.');
    }

    public function destroy(\App\Models\Newsletter $newsletter)
    {
        $newsletter->delete();
        return redirect()->route('admin.newsletters.index')->with('success', 'Newsletter deleted successfully.');
    }
}