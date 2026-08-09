<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SubscriberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required'],
            'name' => ['required'],
            'status' => ['required'],
            'source' => ['required'],
            'subscribed_at' => ['required'],
            'unsubscribed_at' => ['required'],
        ];
    }
}