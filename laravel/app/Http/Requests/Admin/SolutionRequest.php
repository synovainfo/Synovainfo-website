<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SolutionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required'],
            'slug' => ['required'],
            'short_description' => ['required'],
            'full_description' => ['required'],
            'icon' => ['required'],
            'features' => ['required'],
            'benefits' => ['required'],
            'status' => ['required'],
            'seo_title' => ['required'],
            'seo_description' => ['required'],
            'created_by_id' => ['required'],
            'updated_by_id' => ['required'],
        ];
    }
}