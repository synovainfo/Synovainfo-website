<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case NEW = 'NEW';
    case REVIEWED = 'REVIEWED';
    case SHORTLISTED = 'SHORTLISTED';
    case REJECTED = 'REJECTED';
    case HIRED = 'HIRED';

    public function label(): string
    {
        return ucfirst(strtolower($this->value));
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
