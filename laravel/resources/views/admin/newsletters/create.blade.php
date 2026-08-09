<x-admin-layout>
    <x-slot name="title">Create Newsletter</x-slot>

    <x-admin.page-header title="Create Newsletter">
        <a href="{{ route('admin.newsletters.index') }}" class="text-sm font-semibold leading-6 text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 rounded-md">
            Back to Newsletters
        </a>
    </x-admin.page-header>

    <form action="{{ route('admin.newsletters.store') }}" method="POST" class="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl md:col-span-2 mt-6">
        @csrf
        <div class="px-4 py-6 sm:p-8">
            <div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="sm:col-span-4">
                            <label for="subject" class="block text-sm font-medium leading-6 text-slate-900">Subject</label>
                            <div class="mt-2">
                                <input type="text" name="subject" id="subject" value="{{ old('subject', $newsletter->subject ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('subject')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="body" class="block text-sm font-medium leading-6 text-slate-900">Body</label>
                            <div class="mt-2">
                                <input type="text" name="body" id="body" value="{{ old('body', $newsletter->body ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('body')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="sent_at" class="block text-sm font-medium leading-6 text-slate-900">Sent At</label>
                            <div class="mt-2">
                                <input type="text" name="sent_at" id="sent_at" value="{{ old('sent_at', $newsletter->sent_at ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('sent_at')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="status" class="block text-sm font-medium leading-6 text-slate-900">Status</label>
                            <div class="mt-2">
                                <input type="text" name="status" id="status" value="{{ old('status', $newsletter->status ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('status')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="recipient_count" class="block text-sm font-medium leading-6 text-slate-900">Recipient Count</label>
                            <div class="mt-2">
                                <input type="text" name="recipient_count" id="recipient_count" value="{{ old('recipient_count', $newsletter->recipient_count ?? '') }}" class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6">
                                @error('recipient_count')
                                    <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>
                        </div>

            </div>
        </div>
        <div class="flex items-center justify-end gap-x-6 border-t border-slate-900/10 px-4 py-4 sm:px-8">
            <a href="{{ route('admin.newsletters.index') }}" class="text-sm font-semibold leading-6 text-slate-900">Cancel</a>
            <button type="submit" class="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Save</button>
        </div>
    </form>
</x-admin-layout>