<?php

namespace App\Enums;

enum BlogPostStatus: string
{
    case DRAFT = 'DRAFT';
    case PUBLISHED = 'PUBLISHED';
    case SCHEDULED = 'SCHEDULED';
}
