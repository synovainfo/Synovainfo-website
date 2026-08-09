<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required'],
            'designation' => ['required'],
            'department' => ['required'],
            'bio' => ['required'],
            'avatar' => ['required'],
            'email' => ['required'],
            'linkedin' => ['required'],
            'twitter' => ['required'],
            'order' => ['required'],
            'status' => ['required'],
            'created_by_id' => ['required'],
            'updated_by_id' => ['required'],
        ];
    }
}