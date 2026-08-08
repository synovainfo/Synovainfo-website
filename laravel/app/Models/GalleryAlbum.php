<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GalleryAlbum extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'cover_image',
        'order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }

    public function images(): HasMany
    {
        return $this->hasMany(GalleryImage::class, 'albumId');
    }
}
