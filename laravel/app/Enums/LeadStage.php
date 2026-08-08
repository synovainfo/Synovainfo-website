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
}
