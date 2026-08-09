<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Technology;
use App\Http\Requests\Admin\TechnologyRequest;

class TechnologyController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Technology::query()->latest('created_at');
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('id', 'like', "%$search%");
        }
        $technologys = $query->paginate(15);
        return view('admin.technologies.index', compact('technologys'));
    }

    public function create()
    {
        return view('admin.technologies.create');
    }

    public function store(\App\Http\Requests\Admin\TechnologyRequest $request)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Technology)->getTable(), 'created_by_id')) {
            $data['created_by_id'] = auth()->id();
            $data['updated_by_id'] = auth()->id();
        }
        \App\Models\Technology::create($data);
        return redirect()->route('admin.technologies.index')->with('success', 'Technology created successfully.');
    }

    public function show(\App\Models\Technology $technology)
    {
        return view('admin.technologies.show', compact('technology'));
    }

    public function edit(\App\Models\Technology $technology)
    {
        return view('admin.technologies.edit', compact('technology'));
    }

    public function update(\App\Http\Requests\Admin\TechnologyRequest $request, \App\Models\Technology $technology)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Technology)->getTable(), 'updated_by_id')) {
            $data['updated_by_id'] = auth()->id();
        }
        $technology->update($data);
        return redirect()->route('admin.technologies.index')->with('success', 'Technology updated successfully.');
    }

    public function destroy(\App\Models\Technology $technology)
    {
        $technology->delete();
        return redirect()->route('admin.technologies.index')->with('success', 'Technology deleted successfully.');
    }
}