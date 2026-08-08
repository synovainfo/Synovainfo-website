<?php

namespace App\Http\Requests\Admin;

use App\Enums\CareerType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class CareerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('careers')->ignore($this->career)],
            'department' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', new Enum(CareerType::class)],
            'description' => ['nullable', 'string'],
            'requirements' => ['nullable', 'array'],
            'benefits' => ['nullable', 'array'],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'min:0', 'gte:salary_min'],
            'status' => ['boolean'],
        ];
    }
}
