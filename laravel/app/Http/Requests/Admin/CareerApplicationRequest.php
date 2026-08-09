<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CareerApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'career_id' => ['required'],
            'name' => ['required'],
            'email' => ['required'],
            'phone' => ['required'],
            'resume_url' => ['required'],
            'cover_letter' => ['required'],
            'status' => ['required'],
            'notes' => ['required'],
        ];
    }
}