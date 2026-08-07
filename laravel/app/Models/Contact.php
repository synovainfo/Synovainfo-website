<?php

namespace App\Models;

use App\Enums\LeadStage;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasUlids;

    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'service',
        'budget',
        'timeline',
        'message',
        'source',
        'landing_page',
        'referrer',
        'browser',
        'device',
        'ip_address',
        'status',
        'assigned_to_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => LeadStage::class,
        ];
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class);
    }

    public function scopeUnassigned($query)
    {
        return $query->whereNull('assigned_to_id');
    }
}
