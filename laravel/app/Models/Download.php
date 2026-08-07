<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Download extends Model
{
    use HasUlids;

    protected $fillable = [
        'title',
        'file_type',
        'file_size',
        'file_url',
        'description',
        'category',
        'icon',
        'is_featured',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'is_featured' => 'boolean',
            'status' => 'boolean',
            'download_count' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function incrementDownloadCount(): void
    {
        $this->newQuery()->whereKey($this->getKey())->increment('download_count');
    }
}
