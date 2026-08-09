<x-admin-layout>
    <x-slot name="title">View Tag</x-slot>

    <x-admin.page-header title="Tag Details">
        <a href="{{ route('admin.tags.index') }}" class="text-sm font-semibold leading-6 text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 rounded-md">
            Back to Tags
        </a>
    </x-admin.page-header>

    <div class="mt-6 bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
        <div class="px-4 py-6 sm:p-8 border-b border-slate-200">
            <h3 class="text-base font-semibold leading-7 text-slate-900">Tag Information</h3>
        </div>
        <div class="border-t border-slate-100">
            <dl class="divide-y divide-slate-100 px-4 sm:px-8">
                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Name</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $tag->name }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Slug</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $tag->slug }}</dd>
                        </div>
            </dl>
        </div>
    </div>
</x-admin-layout>