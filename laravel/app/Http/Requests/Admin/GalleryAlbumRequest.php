<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class GalleryAlbumRequest extends FormRequest
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
            'description' => ['required'],
            'cover_image' => ['required'],
            'order' => ['required'],
            'status' => ['required'],
        ];
    }
}