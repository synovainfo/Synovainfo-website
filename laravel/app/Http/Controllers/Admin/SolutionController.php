<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Solution;
use App\Http\Requests\Admin\SolutionRequest;

class SolutionController extends Controller
{
    public function index(\Illuminate\Http\Request $request)
    {
        $query = \App\Models\Solution::query()->latest('created_at');
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('id', 'like', "%$search%");
        }
        $solutions = $query->paginate(15);
        return view('admin.solutions.index', compact('solutions'));
    }

    public function create()
    {
        return view('admin.solutions.create');
    }

    public function store(\App\Http\Requests\Admin\SolutionRequest $request)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Solution)->getTable(), 'created_by_id')) {
            $data['created_by_id'] = auth()->id();
            $data['updated_by_id'] = auth()->id();
        }
        \App\Models\Solution::create($data);
        return redirect()->route('admin.solutions.index')->with('success', 'Solution created successfully.');
    }

    public function show(\App\Models\Solution $solution)
    {
        return view('admin.solutions.show', compact('solution'));
    }

    public function edit(\App\Models\Solution $solution)
    {
        return view('admin.solutions.edit', compact('solution'));
    }

    public function update(\App\Http\Requests\Admin\SolutionRequest $request, \App\Models\Solution $solution)
    {
        $data = $request->validated();
        if (\Illuminate\Support\Facades\Schema::hasColumn((new \App\Models\Solution)->getTable(), 'updated_by_id')) {
            $data['updated_by_id'] = auth()->id();
        }
        $solution->update($data);
        return redirect()->route('admin.solutions.index')->with('success', 'Solution updated successfully.');
    }

    public function destroy(\App\Models\Solution $solution)
    {
        $solution->delete();
        return redirect()->route('admin.solutions.index')->with('success', 'Solution deleted successfully.');
    }
}