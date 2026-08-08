<x-admin-layout>
    <x-slot name="title">Edit Case Study</x-slot>

    <div class="mb-8">
        <a href="{{ route('admin.case-studies.index') }}" class="text-sm font-semibold text-slate-500 hover:text-slate-900">&larr; Back to Case Studies</a>
    </div>

    <x-admin.page-header title="Edit Case Study: {{ $caseStudy->title }}" description="Update the details of this success story." />

    <div class="bg-white shadow sm:rounded-lg border border-slate-200 mb-10">
        <div class="px-4 py-5 sm:p-6">
            <form action="{{ route('admin.case-studies.update', $caseStudy) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.case-studies._form', ['caseStudy' => $caseStudy])
            </form>
        </div>
    </div>
</x-admin-layout>
