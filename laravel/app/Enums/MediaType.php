<?php

namespace App\Enums;

enum MediaType: string
{
    case IMAGE = 'IMAGE';
    case SVG = 'SVG';
    case VIDEO = 'VIDEO';
    case PDF = 'PDF';
    case DOCUMENT = 'DOCUMENT';

    public function label(): string
    {
        return match ($this) {
            self::SVG, self::PDF => $this->value,
            default => ucfirst(strtolower($this->value)),
        };
    }

    /**
     * Derive a media type from a mime type, since the schema stores mime_type
     * rather than a type column on the media table.
     */
    public static function fromMimeType(?string $mimeType): self
    {
        return match (true) {
            $mimeType === 'image/svg+xml' => self::SVG,
            $mimeType === 'application/pdf' => self::PDF,
            str_starts_with((string) $mimeType, 'image/') => self::IMAGE,
            str_starts_with((string) $mimeType, 'video/') => self::VIDEO,
            default => self::DOCUMENT,
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
