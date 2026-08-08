<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareerApplication extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'career_id',
        'name',
        'email',
        'phone',
        'resume_url',
        'cover_letter',
        'status',
        'notes'
    ];
    
    protected function casts(): array
    {
        return [
            'status' => ApplicationStatus::class,
        ];
    }
    
    public function career(): BelongsTo
    {
        return $this->belongsTo(Career::class, 'careerId');
    }
}
