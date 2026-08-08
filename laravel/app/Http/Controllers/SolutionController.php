<?php

namespace App\Http\Controllers;

use App\Models\Solution;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SolutionController extends Controller
{
    public function index(): View
    {
        $solutions = Solution::where('status', true)->get();
        return view('solutions.index', compact('solutions'));
    }

    public function show(string $slug): View
    {
        $solution = Solution::where('slug', $slug)->where('status', true)->firstOrFail();
        return view('solutions.show', compact('solution'));
    }
}
