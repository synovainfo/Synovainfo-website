<?php

namespace App\Enums;

enum CareerType: string
{
    case FULL_TIME = 'FULL_TIME';
    case PART_TIME = 'PART_TIME';
    case CONTRACT = 'CONTRACT';
    case REMOTE = 'REMOTE';
}
