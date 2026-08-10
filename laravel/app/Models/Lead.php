<?php

namespace App\Models;

use App\Enums\LeadStage;
use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'company_name',
        'contact_name',
        'email',
        'phone',
        'service_interest',
        'value',
        'stage',
        'assigned_to_id',
        'source',
        'notes',
        'ip_address'
    ];
    
    protected function casts(): array
    {
        return [
            'stage' => LeadStage::class,
        ];
    }
    
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignedToId');
    }
    
    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class, 'leadId');
    }
}
