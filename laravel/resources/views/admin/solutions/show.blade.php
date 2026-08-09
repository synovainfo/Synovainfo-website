<x-admin-layout>
    <x-slot name="title">View Solution</x-slot>

    <x-admin.page-header title="Solution Details">
        <a href="{{ route('admin.solutions.index') }}" class="text-sm font-semibold leading-6 text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 rounded-md">
            Back to Solutions
        </a>
    </x-admin.page-header>

    <div class="mt-6 bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl">
        <div class="px-4 py-6 sm:p-8 border-b border-slate-200">
            <h3 class="text-base font-semibold leading-7 text-slate-900">Solution Information</h3>
        </div>
        <div class="border-t border-slate-100">
            <dl class="divide-y divide-slate-100 px-4 sm:px-8">
                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Title</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->title }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Slug</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->slug }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Short Description</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->short_description }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Full Description</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->full_description }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Icon</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->icon }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Features</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->features }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Benefits</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->benefits }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Status</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->status }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Seo Title</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->seo_title }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Seo Description</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->seo_description }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Created By Id</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->created_by_id }}</dd>
                        </div>                        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt class="text-sm font-medium leading-6 text-slate-900">Updated By Id</dt>
                            <dd class="mt-1 text-sm leading-6 text-slate-700 sm:col-span-2 sm:mt-0">{{ $solution->updated_by_id }}</dd>
                        </div>
            </dl>
        </div>
    </div>
</x-admin-layout>