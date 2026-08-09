<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BlogController extends Controller
{
    public function index(Request $request): View
    {
        $query = BlogPost::with('author', 'category')
            ->whereIn('status', ['PUBLISHED', '1', 1]);

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        $posts = $query->orderBy('published_at', 'desc')->paginate(12);
        $categories = BlogCategory::orderBy('name')->get();

        return view('blog.index', compact('posts', 'categories'));
    }

    public function show(string $slug): View
    {
        $post = BlogPost::with('author', 'category', 'tags')
            ->where('slug', $slug)
            ->firstOrFail();
            
        return view('blog.show', compact('post'));
    }
}
