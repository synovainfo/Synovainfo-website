<?php

namespace App\Models;

use App\Models\Concerns\HasAuthorship;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Testimonial extends Model
{
    use HasAuthorship;
    use HasUlids;
    use SoftDeletes;

    protected $fillable = [
        'quote',
        'author',
        'title',
        'company',
        'avatar',
        'image_url',
        'rating',
        'status',
        'order',
        'created_by_id',
        'updated_by_id',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'status' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}
