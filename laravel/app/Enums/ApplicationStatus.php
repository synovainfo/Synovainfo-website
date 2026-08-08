<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case NEW = 'NEW';
    case REVIEWED = 'REVIEWED';
    case SHORTLISTED = 'SHORTLISTED';
    case REJECTED = 'REJECTED';
    case HIRED = 'HIRED';
}
