<x-admin-layout>
    <x-slot name="title">View Technology</x-slot>

    <x-admin.page-header title="Technology Details">
        <a href="{{ route('admin.technologies.index') }}" class="text-sm font-semibold leading-6 text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 rounded-md">
            Back to Technologies
        </a>
    </x-admin.page-header>

    <div class="mt-6 bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
        <div class="px-4 py-6 sm:p-8 border-b border-slate-200">
            <h3 class="text-base font-semibold leading-7 text-slate-900">Technology Information</h3>
        </div>
        <div class="border-t border-slate-100">
            <dl class="divide-y divide-slate-100 px-4 sm:px-8">
                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Name</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->name }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Slug</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->slug }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Category</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->category }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Description</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->description }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Icon</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->icon }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Website Url</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->website_url }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Proficiency Level</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->proficiency_level }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Status</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->status }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Created By Id</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->created_by_id }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Updated By Id</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $technology->updated_by_id }}</dd>
                        </div>
            </dl>
        </div>
    </div>
</x-admin-layout>