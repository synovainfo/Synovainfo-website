<?php

namespace App\Enums;

enum FormFieldType: string
{
    case TEXT = 'TEXT';
    case EMAIL = 'EMAIL';
    case TEXTAREA = 'TEXTAREA';
    case SELECT = 'SELECT';
    case CHECKBOX = 'CHECKBOX';
    case RADIO = 'RADIO';
    case FILE = 'FILE';
    case PHONE = 'PHONE';
    case DATE = 'DATE';

    public function label(): string
    {
        return ucfirst(strtolower($this->value));
    }

    /**
     * Field types that require an options payload to render.
     */
    public function needsOptions(): bool
    {
        return in_array($this, [self::SELECT, self::CHECKBOX, self::RADIO], true);
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
