<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Http\Requests\Admin\BlogCategoryRequest;
use Illuminate\Http\Request;

class BlogCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = BlogCategory::withCount('posts')->latest();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
        }

        $categories = $query->paginate(15);
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $categories->items(),
                'meta' => [
                    'current_page' => $categories->currentPage(),
                    'last_page' => $categories->lastPage(),
                    'total' => $categories->total()
                ]
            ]);
        }

        return view('admin.blog-categories.index', compact('categories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.blog-categories.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BlogCategoryRequest $request)
    {
        BlogCategory::create($request->validated());

        return redirect()->route('admin.blog-categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BlogCategory $blogCategory)
    {
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $blogCategory
            ]);
        }

        return view('admin.blog-categories.show', compact('blogCategory'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BlogCategory $blogCategory)
    {
        return view('admin.blog-categories.edit', compact('blogCategory'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BlogCategoryRequest $request, BlogCategory $blogCategory)
    {
        $blogCategory->update($request->validated());

        return redirect()->route('admin.blog-categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlogCategory $blogCategory)
    {
        $blogCategory->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Record deleted successfully.'
            ]);
        }

        return redirect()->route('admin.blog-categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
