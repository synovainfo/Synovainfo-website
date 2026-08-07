<?php

namespace App\Enums;

enum LeadStage: string
{
    case NEW = 'NEW';
    case CONTACTED = 'CONTACTED';
    case QUALIFIED = 'QUALIFIED';
    case PROPOSAL = 'PROPOSAL';
    case WON = 'WON';
    case LOST = 'LOST';

    public function label(): string
    {
        return ucfirst(strtolower($this->value));
    }

    public function isClosed(): bool
    {
        return in_array($this, [self::WON, self::LOST], true);
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
