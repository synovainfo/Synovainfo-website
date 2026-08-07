<?php

namespace App\Enums;

enum PageStatus: string
{
    case DRAFT = 'DRAFT';
    case PUBLISHED = 'PUBLISHED';
    case SCHEDULED = 'SCHEDULED';

    public function label(): string
    {
        return ucfirst(strtolower($this->value));
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
