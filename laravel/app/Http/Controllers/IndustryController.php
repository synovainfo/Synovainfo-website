<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use Illuminate\Http\Request;
use Illuminate\View\View;

class IndustryController extends Controller
{
    public function index(): View
    {
        $industries = Industry::whereIn('status', [1, '1', true])->get();
        return view('industries.index', compact('industries'));
    }

    public function show(string $slug): View
    {
        $industry = Industry::where('slug', $slug)->firstOrFail();
        return view('industries.show', compact('industry'));
    }
}
