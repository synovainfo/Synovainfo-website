<?php

namespace App\Models;

use App\Models\Concerns\HasCamelCaseColumns;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class SiteConfig extends Model
{
    use HasUlids, HasCamelCaseColumns;

    public $incrementing = false;
    protected $keyType = 'string';

    // The Prisma-generated DB stores site settings in the `settings` table
    // (key / value / type / description), not a dedicated `site_configs` table.
    protected $table = 'settings';

    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];
}
