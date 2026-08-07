<?php

namespace App\Enums;

enum BackupStatus: string
{
    case PENDING = 'PENDING';
    case RUNNING = 'RUNNING';
    case COMPLETED = 'COMPLETED';
    case FAILED = 'FAILED';

    public function label(): string
    {
        return ucfirst(strtolower($this->value));
    }

    public function isFinished(): bool
    {
        return in_array($this, [self::COMPLETED, self::FAILED], true);
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
