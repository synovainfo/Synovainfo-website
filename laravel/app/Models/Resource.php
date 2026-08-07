<?php

namespace App\Models;

use App\Models\Concerns\HasAuthorship;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasAuthorship;
    use HasUlids;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'type',
        'file_url',
        'cover_image',
        'category',
        'tags',
        'status',
        'created_by_id',
        'updated_by_id',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'status' => 'boolean',
            'download_count' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function incrementDownloadCount(): void
    {
        $this->newQuery()->whereKey($this->getKey())->increment('download_count');
    }
}
