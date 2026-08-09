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
            $query->where('id', 'like', "%$search%");
        }
        $newsletters = $query->paginate(15);
        return view('admin.newsletters.index', compact('newsletters'));
    }

    public function create()
    {
        return view('admin.newsletters.create');
    }

    public function store(\App\Http\Requests\Admin\NewsletterRequest $request)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Newsletter)->getTable(), 'created_by_id')) {
            $data['created_by_id'] = auth()->id();
            $data['updated_by_id'] = auth()->id();
        }
        \App\Models\Newsletter::create($data);
        return redirect()->route('admin.newsletters.index')->with('success', 'Newsletter created successfully.');
    }

    public function show(\App\Models\Newsletter $newsletter)
    {
        return view('admin.newsletters.show', compact('newsletter'));
    }

    public function edit(\App\Models\Newsletter $newsletter)
    {
        return view('admin.newsletters.edit', compact('newsletter'));
    }

    public function update(\App\Http\Requests\Admin\NewsletterRequest $request, \App\Models\Newsletter $newsletter)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Newsletter)->getTable(), 'updated_by_id')) {
            $data['updated_by_id'] = auth()->id();
        }
        $newsletter->update($data);
        return redirect()->route('admin.newsletters.index')->with('success', 'Newsletter updated successfully.');
    }

    public function destroy(\App\Models\Newsletter $newsletter)
    {
        $newsletter->delete();
        return redirect()->route('admin.newsletters.index')->with('success', 'Newsletter deleted successfully.');
    }
}