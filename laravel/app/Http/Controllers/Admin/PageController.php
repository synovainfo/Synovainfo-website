<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PageRequest;
use App\Models\Page;
use App\Support\RichTextSanitizer;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Page::query()->latest('created_at');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('slug', 'like', "%{$search}%");
        }

        $pages = $query->paginate(10);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $pages->items(),
                'meta' => [
                    'current_page' => $pages->currentPage(),
                    'last_page' => $pages->lastPage(),
                    'total' => $pages->total()
                ]
            ]);
        }

        return view('admin.pages.index', compact('pages'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.pages.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PageRequest $request)
    {
        $data = $request->validated();
        $data['author_id'] = auth()->id();
        $data['content'] = $this->contentBlocks($data['content'] ?? null);

        $page = Page::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => Page::latest()->first(), // We need the newly created page. Actually, Page::create returns the model, but we didn't assign it.
            ], 201);
        }

        return redirect()->route('admin.pages.index')
            ->with('success', 'Page created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $page
            ]);
        }

        return view('admin.pages.show', compact('page'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page)
    {
        $pageContent = $this->htmlFromContentBlocks($page->content);

        return view('admin.pages.edit', compact('page', 'pageContent'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PageRequest $request, Page $page)
    {
        $data = $request->validated();
        $data['content'] = $this->contentBlocks($data['content'] ?? null);

        $page->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $page
            ]);
        }

        return redirect()->route('admin.pages.index')
            ->with('success', 'Page updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        $page->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Page deleted successfully.'
            ]);
        }

        return redirect()->route('admin.pages.index')
            ->with('success', 'Page deleted successfully.');
    }

    private function contentBlocks(?string $content): ?array
    {
        $cleanContent = RichTextSanitizer::clean($content);

        return $cleanContent === null ? null : [$cleanContent];
    }

    private function htmlFromContentBlocks(mixed $content): string
    {
        if (! is_array($content)) {
            return is_string($content) ? $content : '';
        }

        return collect($content)
            ->map(function (mixed $block): string {
                if (is_string($block)) {
                    return $block;
                }

                if (is_array($block)) {
                    return (string) ($block['body'] ?? $block['content'] ?? $block['text'] ?? '');
                }

                return '';
            })
            ->filter()
            ->implode("\n\n");
    }
}