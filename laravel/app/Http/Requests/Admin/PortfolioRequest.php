<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('portfolios')->ignore($this->portfolio)],
            'description' => ['nullable', 'string'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'featured_image' => ['nullable', 'string', 'max:255'],
            'tech_stack' => ['nullable', 'array'],
            'project_url' => ['nullable', 'url', 'max:255'],
            'status' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
