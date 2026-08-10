<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest as BaseFormRequest;

class FormRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('form') ? $this->route('form')->id : null;
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:forms,slug,' . $id],
            'description' => ['nullable', 'string'],
            'submit_button_text' => ['required', 'string', 'max:255'],
            'success_message' => ['nullable', 'string', 'max:255'],
            'email_notification' => ['nullable', 'email', 'max:255'],
            'status' => ['required', 'boolean'],
        ];
    }
}
