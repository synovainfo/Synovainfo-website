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
}
