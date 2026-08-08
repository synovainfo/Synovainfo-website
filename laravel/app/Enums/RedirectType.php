<?php

namespace App\Enums;

enum RedirectType: string
{
    case PERMANENT_301 = 'PERMANENT_301';
    case TEMPORARY_302 = 'TEMPORARY_302';
}
