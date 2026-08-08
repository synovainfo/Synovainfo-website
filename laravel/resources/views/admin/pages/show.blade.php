<x-admin-layout>
    <x-slot name="title">View Page</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.pages.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Pages</a>
    </div>

    <x-admin.page-header title="Page: {{ $page->title }}" description="View page details and content." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 p-6 max-w-4xl">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Title</dt>
                <dd class="mt-1 text-sm font-medium text-slate-900">{{ $page->title }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</dt>
                <dd class="mt-1 text-sm font-mono text-slate-900">{{ $page->slug }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</dt>
                <dd class="mt-1">
                    @php
                        $status = is_string($page->status) ? $page->status : (string) ($page->status->value ?? 'DRAFT');
                    @endphp
                    <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold {{ in_array(strtoupper($status), ['PUBLISHED']) ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700' }}">
                        {{ ucfirst(strtolower($status)) }}
                    </span>
                </dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Template</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $page->template ?? 'Default' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Author</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $page->author->name ?? 'N/A' }}</dd>
            </div>

            <div>
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Published At</dt>
                <dd class="mt-1 text-sm text-slate-900">{{ $page->published_at ? $page->published_at->format('F d, Y H:i A') : 'Not published' }}</dd>
            </div>

            @if($page->excerpt)
                <div class="col-span-full">
                    <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500">Excerpt / Meta Description</dt>
                    <dd class="mt-2 text-sm text-slate-800 bg-slate-50 p-4 rounded-md border border-slate-200">{{ $page->excerpt }}</dd>
                </div>
            @endif
        </div>

        @if($page->content && is_array($page->content) && count($page->content) > 0)
            <div class="mt-8">
                <dt class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Content Blocks ({{ count($page->content) }})</dt>
                <div class="space-y-3 max-h-96 overflow-y-auto border border-slate-200 rounded-md p-4 bg-slate-50">
                    @foreach($page->content as $index => $block)
                        <div class="text-xs text-slate-600 border-b border-slate-200 pb-3 last:border-0">
                            <span class="font-bold text-slate-900">#{{ $index + 1 }}</span>
                            @if(is_array($block))
                                @php $json = json_encode($block, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES); @endphp
                                <pre class="mt-1 whitespace-pre-wrap font-mono text-[11px] text-slate-500">{{ $json }}</pre>
                            @else
                                <div class="mt-1 prose prose-sm max-w-none">{{ $block }}</div>
                            @endif
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        <div class="mt-8 border-t border-slate-200 pt-6 flex items-center gap-4">
            <a href="{{ route('admin.pages.edit', $page) }}" class="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500">Edit Page</a>

            <form action="{{ route('admin.pages.destroy', $page) }}" method="POST" onsubmit="return confirm('Delete this page?');">
                @csrf
                @method('DELETE')
                <button type="submit" class="text-sm font-semibold text-red-600 hover:text-red-800">Delete Page</button>
            </form>
        </div>
    </div>
</x-admin-layout>
