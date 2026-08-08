<?php

namespace App\Models;

use App\Enums\BackupStatus;
use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Backup extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';

    const UPDATED_AT = null;

    protected $fillable = [
        'filename',
        'file_size',
        'type',
        'status',
        'file_url',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => BackupStatus::class,
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }
}
