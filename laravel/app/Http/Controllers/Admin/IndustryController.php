<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Industry;
use App\Http\Requests\Admin\IndustryRequest;
use Illuminate\Http\Request;

class IndustryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Industry::query()->latest('created_at');
        
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
        }

        $industries = $query->paginate(15);
        return view('admin.industries.index', compact('industries'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.industries.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(IndustryRequest $request)
    {
        $data = $request->validated();
        $data['created_by_id'] = auth()->id();
        $data['updated_by_id'] = auth()->id();
        
        Industry::create($data);

        return redirect()->route('admin.industries.index')
            ->with('success', 'Industry created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Industry $industry)
    {
        return view('admin.industries.show', compact('industry'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Industry $industry)
    {
        return view('admin.industries.edit', compact('industry'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(IndustryRequest $request, Industry $industry)
    {
        $data = $request->validated();
        $data['updated_by_id'] = auth()->id();

        $industry->update($data);

        return redirect()->route('admin.industries.index')
            ->with('success', 'Industry updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Industry $industry)
    {
        $industry->delete();

        return redirect()->route('admin.industries.index')
            ->with('success', 'Industry deleted successfully.');
    }
}
