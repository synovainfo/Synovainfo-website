<?php

namespace App\Enums;

enum RedirectType: string
{
    case PERMANENT_301 = 'PERMANENT_301';
    case TEMPORARY_302 = 'TEMPORARY_302';

    public function statusCode(): int
    {
        return match ($this) {
            self::PERMANENT_301 => 301,
            self::TEMPORARY_302 => 302,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::PERMANENT_301 => 'Permanent (301)',
            self::TEMPORARY_302 => 'Temporary (302)',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
