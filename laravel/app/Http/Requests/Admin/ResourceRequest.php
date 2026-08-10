<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('resource') ? $this->route('resource')->id : null;
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:resources,slug,' . $id],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', 'string', 'max:100'],
            'file_url' => ['nullable', 'url', 'max:255'],
            'cover_image' => ['nullable', 'url', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'tags' => ['nullable', 'array'],
            'status' => ['required', 'boolean'],
        ];
    }
}
