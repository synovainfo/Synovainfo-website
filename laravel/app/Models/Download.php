<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Download extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'title',
        'file_type',
        'file_size',
        'file_url',
        'description',
        'category',
        'icon',
        'is_featured',
        'download_count',
        'status'
    ];
    
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'status' => 'boolean',
        ];
    }
}
