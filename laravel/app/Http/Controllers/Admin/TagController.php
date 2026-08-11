<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Http\Requests\Admin\TagRequest;

class TagController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Tag::query()->latest('created_at');
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('id', 'like', "%$search%");
        }
        $tags = $query->paginate(15);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $tags->items(),
                'meta' => [
                    'current_page' => $tags->currentPage(),
                    'last_page' => $tags->lastPage(),
                    'total' => $tags->total()
                ]
            ]);
        }

        return view('admin.tags.index', compact('tags'));
    }

    public function create()
    {
        return view('admin.tags.create');
    }

    public function store(\App\Http\Requests\Admin\TagRequest $request)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Tag)->getTable(), 'created_by_id')) {
            $data['created_by_id'] = auth()->id();
            $data['updated_by_id'] = auth()->id();
        }
        \App\Models\Tag::create($data);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => Tag::latest()->first()
            ], 201);
        }

        return redirect()->route('admin.tags.index')->with('success', 'Tag created successfully.');
    }

    public function show(\App\Models\Tag $tag)
    {
        return view('admin.tags.show', compact('tag'));
    }

    public function edit(\App\Models\Tag $tag)
    {
        return view('admin.tags.edit', compact('tag'));
    }

    public function update(\App\Http\Requests\Admin\TagRequest $request, \App\Models\Tag $tag)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Tag)->getTable(), 'updated_by_id')) {
            $data['updated_by_id'] = auth()->id();
        }
        $tag->update($data);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $tag
            ]);
        }

        return redirect()->route('admin.tags.index')->with('success', 'Tag updated successfully.');
    }

    public function destroy(\App\Models\Tag $tag)
    {
        $tag->delete();
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Record deleted successfully.'
            ]);
        }

        return redirect()->route('admin.tags.index')->with('success', 'Tag deleted successfully.');
    }
}