<?php

namespace App\Http\Controllers;

use App\Models\CaseStudy;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CaseStudyController extends Controller
{
    public function index(): View
    {
        $caseStudies = CaseStudy::whereIn('status', ['PUBLISHED', 1, '1', true])
            ->orderBy('createdAt', 'desc')
            ->paginate(12);
            
        return view('case-studies.index', compact('caseStudies'));
    }

    public function show(string $slug): View
    {
        $caseStudy = CaseStudy::where('slug', $slug)->firstOrFail();
            
        return view('case-studies.show', compact('caseStudy'));
    }
}
