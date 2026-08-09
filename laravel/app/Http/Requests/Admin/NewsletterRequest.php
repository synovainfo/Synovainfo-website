<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class NewsletterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject' => ['required'],
            'body' => ['required'],
            'sent_at' => ['required'],
            'status' => ['required'],
            'recipient_count' => ['required'],
        ];
    }
}