<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Career;
use App\Http\Requests\Admin\CareerRequest;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Career::query()->latest('createdAt');
        
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
        }

        $careers = $query->paginate(15);
        return view('admin.careers.index', compact('careers'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.careers.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CareerRequest $request)
    {
        $data = $request->validated();
        $data['created_by_id'] = auth()->id();
        $data['updated_by_id'] = auth()->id();
        
        Career::create($data);

        return redirect()->route('admin.careers.index')
            ->with('success', 'Career created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Career $career)
    {
        return view('admin.careers.show', compact('career'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Career $career)
    {
        return view('admin.careers.edit', compact('career'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CareerRequest $request, Career $career)
    {
        $data = $request->validated();
        $data['updated_by_id'] = auth()->id();

        $career->update($data);

        return redirect()->route('admin.careers.index')
            ->with('success', 'Career updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Career $career)
    {
        $career->delete();

        return redirect()->route('admin.careers.index')
            ->with('success', 'Career deleted successfully.');
    }
}
