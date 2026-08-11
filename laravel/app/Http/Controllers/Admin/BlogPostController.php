<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BlogPostRequest;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Support\RichTextSanitizer;
use Illuminate\Http\Request;

class BlogPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = BlogPost::with('category', 'author')->latest('created_at');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
        }

        $posts = $query->paginate(15);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $posts->items(),
                'meta' => [
                    'current_page' => $posts->currentPage(),
                    'last_page' => $posts->lastPage(),
                    'total' => $posts->total()
                ]
            ]);
        }

        return view('admin.blog-posts.index', compact('posts'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = BlogCategory::pluck('name', 'id')->all();

        return view('admin.blog-posts.create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BlogPostRequest $request)
    {
        $data = $request->validated();
        $data['author_id'] = auth()->id();
        $data['content'] = RichTextSanitizer::clean($data['content'] ?? null);

        BlogPost::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => BlogPost::latest()->first()
            ], 201);
        }

        return redirect()->route('admin.blog-posts.index')
            ->with('success', 'Blog post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BlogPost $blogPost)
    {
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $blogPost
            ]);
        }

        return view('admin.blog-posts.show', compact('blogPost'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BlogPost $blogPost)
    {
        $categories = BlogCategory::pluck('name', 'id')->all();

        return view('admin.blog-posts.edit', compact('blogPost', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BlogPostRequest $request, BlogPost $blogPost)
    {
        $data = $request->validated();
        $data['content'] = RichTextSanitizer::clean($data['content'] ?? null);

        $blogPost->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $blogPost
            ]);
        }

        return redirect()->route('admin.blog-posts.index')
            ->with('success', 'Blog post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlogPost $blogPost)
    {
        $blogPost->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Record deleted successfully.'
            ]);
        }

        return redirect()->route('admin.blog-posts.index')
            ->with('success', 'Blog post deleted successfully.');
    }
}