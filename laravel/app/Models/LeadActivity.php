<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadActivity extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    const UPDATED_AT = null;
    
    protected $fillable = [
        'lead_id',
        'contact_id',
        'type',
        'description',
        'created_by_id'
    ];
    
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class, 'leadId');
    }
    
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'contactId');
    }
    
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'createdById');
    }
}
