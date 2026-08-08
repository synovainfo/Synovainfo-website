<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use Illuminate\Http\Request;
use Illuminate\View\View;

class TechnologyController extends Controller
{
    public function index(): View
    {
        $technologies = Technology::where('status', true)->get()->groupBy('category');
        return view('technologies.index', compact('technologies'));
    }
}
