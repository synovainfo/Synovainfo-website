<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use App\Http\Requests\Admin\CaseStudyRequest;
use Illuminate\Http\Request;

class CaseStudyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CaseStudy::query()->latest('created_at');
        
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%");
        }

        $caseStudies = $query->paginate(15);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $caseStudies->items(),
                'meta' => [
                    'current_page' => $caseStudies->currentPage(),
                    'last_page' => $caseStudies->lastPage(),
                    'total' => $caseStudies->total()
                ]
            ]);
        }

        return view('admin.case-studies.index', compact('caseStudies'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.case-studies.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CaseStudyRequest $request)
    {
        $data = $request->validated();
        $data['created_by_id'] = auth()->id();
        $data['updated_by_id'] = auth()->id();
        
        CaseStudy::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => CaseStudy::latest()->first()
            ], 201);
        }

        return redirect()->route('admin.case-studies.index')
            ->with('success', 'Case study created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CaseStudy $caseStudy)
    {
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $caseStudy
            ]);
        }

        return view('admin.case-studies.show', compact('caseStudy'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CaseStudy $caseStudy)
    {
        return view('admin.case-studies.edit', compact('caseStudy'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CaseStudyRequest $request, CaseStudy $caseStudy)
    {
        $data = $request->validated();
        $data['updated_by_id'] = auth()->id();

        $caseStudy->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $caseStudy
            ]);
        }

        return redirect()->route('admin.case-studies.index')
            ->with('success', 'Case study updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CaseStudy $caseStudy)
    {
        $caseStudy->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Record deleted successfully.'
            ]);
        }

        return redirect()->route('admin.case-studies.index')
            ->with('success', 'Case study deleted successfully.');
    }
}
