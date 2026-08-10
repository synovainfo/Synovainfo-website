<?php

namespace App\Support;

class RichTextSanitizer
{
    private const ALLOWED_TAGS = '<p><br><strong><b><em><i><u><s><h1><h2><h3><h4><ul><ol><li><blockquote><pre><code><a><img><figure><figcaption><table><thead><tbody><tr><th><td><hr><div><span>';

    public static function clean(?string $html): ?string
    {
        if ($html === null) {
            return null;
        }

        $html = trim($html);

        if ($html === '') {
            return null;
        }

        $html = preg_replace('#<(script|style|iframe|object|embed|form|input|button|meta|link)[^>]*>.*?</\1>#is', '', $html) ?? '';
        $html = preg_replace('/\s+on[a-z]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $html) ?? '';
        $html = preg_replace('/\s+(href|src)\s*=\s*([\'"])\s*javascript:[^\'"]*\2/i', '', $html) ?? '';

        return strip_tags($html, self::ALLOWED_TAGS);
    }
}
