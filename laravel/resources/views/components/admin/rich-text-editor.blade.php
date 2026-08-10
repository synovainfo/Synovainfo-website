@props([
    'name',
    'id' => null,
    'label' => 'Content',
    'value' => '',
    'required' => false,
    'help' => null,
])

@php
    $editorId = $id ?? $name;
    $initialValue = \App\Support\RichTextSanitizer::clean(old($name, $value)) ?? '';
@endphp

<div class="col-span-full">
    <label for="{{ $editorId }}" class="block text-sm font-medium leading-6 text-slate-900">
        {{ $label }} @if($required)<span class="text-red-500">*</span>@endif
    </label>

    <div class="mt-2 rich-editor rounded-lg border border-slate-300 bg-white shadow-sm" data-rich-editor>
        <div class="rich-editor-toolbar flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2" role="toolbar" aria-label="{{ $label }} formatting toolbar">
            <button type="button" data-command="formatBlock" data-value="H2" title="Heading" aria-label="Heading" class="rich-editor-button">H2</button>
            <button type="button" data-command="formatBlock" data-value="P" title="Paragraph" aria-label="Paragraph" class="rich-editor-button">P</button>
            <span class="mx-1 h-6 w-px bg-slate-300" aria-hidden="true"></span>
            <button type="button" data-command="bold" title="Bold" aria-label="Bold" class="rich-editor-button font-bold">B</button>
            <button type="button" data-command="italic" title="Italic" aria-label="Italic" class="rich-editor-button italic">I</button>
            <button type="button" data-command="underline" title="Underline" aria-label="Underline" class="rich-editor-button underline">U</button>
            <button type="button" data-command="strikeThrough" title="Strikethrough" aria-label="Strikethrough" class="rich-editor-button line-through">S</button>
            <span class="mx-1 h-6 w-px bg-slate-300" aria-hidden="true"></span>
            <button type="button" data-command="insertUnorderedList" title="Bulleted list" aria-label="Bulleted list" class="rich-editor-button">&bull;</button>
            <button type="button" data-command="insertOrderedList" title="Numbered list" aria-label="Numbered list" class="rich-editor-button">1.</button>
            <button type="button" data-command="formatBlock" data-value="BLOCKQUOTE" title="Quote" aria-label="Quote" class="rich-editor-button">"</button>
            <span class="mx-1 h-6 w-px bg-slate-300" aria-hidden="true"></span>
            <button type="button" data-command="justifyLeft" title="Align left" aria-label="Align left" class="rich-editor-button">L</button>
            <button type="button" data-command="justifyCenter" title="Align center" aria-label="Align center" class="rich-editor-button">C</button>
            <button type="button" data-command="justifyRight" title="Align right" aria-label="Align right" class="rich-editor-button">R</button>
            <span class="mx-1 h-6 w-px bg-slate-300" aria-hidden="true"></span>
            <button type="button" data-command="createLink" title="Insert link" aria-label="Insert link" class="rich-editor-button">Link</button>
            <button type="button" data-command="insertImage" title="Insert image URL" aria-label="Insert image URL" class="rich-editor-button">Image</button>
            <button type="button" data-command="insertTable" title="Insert table" aria-label="Insert table" class="rich-editor-button">Table</button>
            <button type="button" data-command="removeFormat" title="Clear formatting" aria-label="Clear formatting" class="rich-editor-button">Clear</button>
        </div>

        <div
            id="{{ $editorId }}"
            class="rich-editor-surface prose prose-sm max-w-none min-h-80 overflow-y-auto p-5 focus:outline-none"
            contenteditable="true"
            role="textbox"
            aria-multiline="true"
            aria-label="{{ $label }}"
            data-rich-editor-surface
        >{!! $initialValue !!}</div>

        <textarea name="{{ $name }}" data-rich-editor-input class="sr-only" @if($required) required @endif>{{ $initialValue }}</textarea>
    </div>

    @if($help)
        <p class="mt-3 text-sm leading-6 text-slate-600">{{ $help }}</p>
    @endif

    @error($name)
        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
    @enderror
</div>
