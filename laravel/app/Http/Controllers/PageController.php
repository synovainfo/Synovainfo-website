<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PageController extends Controller
{
    public function home(): View
    {
        $page = Page::where('slug', '/')->with('sections')->first();

        $seo = $this->seo(config('seo.home', []));
        $content = config('content');

        return view('pages.home', array_merge(compact('page', 'seo'), $content));
    }

    public function about(): View
    {
        $page = Page::where('slug', 'about')->with('sections')->first();

        $seo = $this->seo([
            'title' => 'About Us — Enterprise Technology Consulting',
            'description' => 'Synovainfo Infotech is a premier enterprise technology consultancy specializing in large-scale digital transformation, custom ecosystem development, and AI-driven capability realization for Fortune 500 environments.',
            'keywords' => 'about Synovainfo Infotech, enterprise technology consultancy, digital transformation company, IT consulting Pune, technology leadership',
            'ogImage' => 'images/global/og-about.png',
        ]);

        return view('pages.about', compact('page', 'seo'));
    }

    public function approach(): View
    {
        $page = Page::where('slug', 'approach')->with('sections')->first();

        $seo = $this->seo([
            'title' => 'Our Approach — Enterprise Architecture Methodology',
            'description' => 'Discover Synovainfo\'s disciplined enterprise engineering methodology: architecture-first design, governed delivery, and measurable business outcomes.',
            'keywords' => 'enterprise architecture methodology, software delivery process, digital engineering approach, IT governance',
        ]);

        return view('pages.approach', compact('page', 'seo'));
    }

    public function architecture(): View
    {
        $page = Page::where('slug', 'architecture')->with('sections')->first();

        $seo = $this->seo([
            'title' => 'Architecture — Mission-Critical Platform Design',
            'description' => 'Explore how Synovainfo designs mission-critical, AI-native multi-cloud architectures with zero-downtime migration, observability, and zero-trust security baked in.',
            'keywords' => 'enterprise architecture, multi-cloud platform design, zero trust architecture, microservices, event-driven systems',
        ]);

        return view('pages.architecture', compact('page', 'seo'));
    }

    public function show(string $slug): View
    {
        $page = Page::where('slug', $slug)->with('sections')->firstOrFail();

        $seo = $this->seo([
            'title' => $page->title ?? null,
            'description' => $page->excerpt ?? null,
        ]);

        return view('pages.default', compact('page', 'seo'));
    }

    /**
     * Default SEO payload merged with per-page overrides.
     */
    private function seo(array $overrides = []): array
    {
        return array_merge([
            'title' => null,
            'description' => null,
            'keywords' => null,
            'ogImage' => null,
            'ogType' => 'website',
        ], $overrides);
    }
}
