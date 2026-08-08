<?php

namespace App\Models;

use App\Enums\LeadStage;
use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
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
        'notes'
    ];
    
    protected function casts(): array
    {
        return [
            'status' => LeadStage::class,
        ];
    }
    
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignedToId');
    }
    
    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class, 'contactId');
    }
}
