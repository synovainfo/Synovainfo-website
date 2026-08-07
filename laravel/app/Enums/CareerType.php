<?php

namespace App\Enums;

enum CareerType: string
{
    case FULL_TIME = 'FULL_TIME';
    case PART_TIME = 'PART_TIME';
    case CONTRACT = 'CONTRACT';
    case REMOTE = 'REMOTE';

    public function label(): string
    {
        return match ($this) {
            self::FULL_TIME => 'Full time',
            self::PART_TIME => 'Part time',
            self::CONTRACT => 'Contract',
            self::REMOTE => 'Remote',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
