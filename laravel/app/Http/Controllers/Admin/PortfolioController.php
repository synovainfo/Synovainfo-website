<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Http\Requests\Admin\PortfolioRequest;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Portfolio::query()->latest('created_at');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%");
        }

        $portfolios = $query->paginate(15);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $portfolios->items(),
                'meta' => [
                    'current_page' => $portfolios->currentPage(),
                    'last_page' => $portfolios->lastPage(),
                    'total' => $portfolios->total()
                ]
            ]);
        }

        return view('admin.portfolios.index', compact('portfolios'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.portfolios.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PortfolioRequest $request)
    {
        $data = $request->validated();
        $data['created_by_id'] = auth()->id();
        $data['updated_by_id'] = auth()->id();

        Portfolio::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => Portfolio::latest()->first()
            ], 201);
        }

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Portfolio project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Portfolio $portfolio)
    {
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $portfolio
            ]);
        }

        return view('admin.portfolios.show', compact('portfolio'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Portfolio $portfolio)
    {
        return view('admin.portfolios.edit', compact('portfolio'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PortfolioRequest $request, Portfolio $portfolio)
    {
        $data = $request->validated();
        $data['updated_by_id'] = auth()->id();

        $portfolio->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $portfolio
            ]);
        }

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Portfolio project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Portfolio $portfolio)
    {
        $portfolio->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Record deleted successfully.'
            ]);
        }

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Portfolio project deleted successfully.');
    }
}
