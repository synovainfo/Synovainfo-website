<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PortfolioController extends Controller
{
    public function index(): View
    {
        $portfolios = Portfolio::whereIn('status', ['PUBLISHED', '1', 1])
            ->orderBy('publishedAt', 'desc')
            ->paginate(12);
            
        return view('portfolio.index', compact('portfolios'));
    }

    public function show(string $slug): View
    {
        $portfolio = Portfolio::where('slug', $slug)->firstOrFail();
            
        return view('portfolio.show', compact('portfolio'));
    }
}
