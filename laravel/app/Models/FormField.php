<?php

namespace App\Models;

use App\Enums\FormFieldType;
use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormField extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';
    
    const UPDATED_AT = null;
    
    protected $fillable = [
        'form_id',
        'type',
        'label',
        'placeholder',
        'required',
        'validation_rules',
        'options',
        'order'
    ];
    
    protected function casts(): array
    {
        return [
            'type' => FormFieldType::class,
            'required' => 'boolean',
            'validation_rules' => 'array',
            'options' => 'array',
        ];
    }
    
    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class, 'formId');
    }
}
