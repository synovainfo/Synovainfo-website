<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Client extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo',
        'website_url',
        'industry',
        'order',
        'status',
        'created_by_id',
        'updated_by_id'
    ];
    
    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }
    
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'createdById');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updatedById');
    }
}
