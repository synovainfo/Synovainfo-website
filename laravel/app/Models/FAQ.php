<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FAQ extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'faqs';
    
    protected $fillable = [
        'question',
        'answer',
        'category_id',
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
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(FAQCategory::class, 'categoryId');
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
