<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TechnologyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required'],
            'slug' => ['required'],
            'category' => ['required'],
            'description' => ['required'],
            'icon' => ['required'],
            'website_url' => ['required'],
            'proficiency_level' => ['required'],
            'status' => ['required'],
            'created_by_id' => ['required'],
            'updated_by_id' => ['required'],
        ];
    }
}