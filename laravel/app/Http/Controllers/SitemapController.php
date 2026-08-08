<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class SitemapController extends Controller
{
    /**
     * Emit an XML sitemap of the public site (static routes + CMS content).
     */
    public function index(): Response
    {
        $urls = $this->staticUrls();
        $urls = array_merge($urls, $this->dbUrls());

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . e($url['loc']) . "</loc>\n";
            if (! empty($url['lastmod'])) {
                $xml .= "    <lastmod>" . $url['lastmod'] . "</lastmod>\n";
            }
            $xml .= "    <changefreq>" . ($url['changefreq'] ?? 'monthly') . "</changefreq>\n";
            $xml .= "    <priority>" . ($url['priority'] ?? '0.7') . "</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }

    private function staticUrls(): array
    {
        $base = url('/');
        $routes = [
            '/' => ['1.0', 'daily'],
            '/about' => ['0.8', 'monthly'],
            '/approach' => ['0.7', 'monthly'],
            '/architecture' => ['0.7', 'monthly'],
            '/services' => ['0.9', 'weekly'],
            '/industries' => ['0.9', 'weekly'],
            '/technologies' => ['0.7', 'monthly'],
            '/solutions' => ['0.8', 'weekly'],
            '/portfolio' => ['0.7', 'monthly'],
            '/case-studies' => ['0.8', 'weekly'],
            '/blog' => ['0.8', 'weekly'],
            '/careers' => ['0.7', 'weekly'],
            '/contact' => ['0.7', 'yearly'],
        ];

        return collect($routes)->map(fn ($meta, $path) => [
            'loc' => $base . $path,
            'priority' => $meta[0],
            'changefreq' => $meta[1],
        ])->values()->all();
    }

    private function dbUrls(): array
    {
        $base = url('/');
        $urls = [];

        $queries = [
            ['table' => 'services', 'route' => 'services', 'priority' => '0.8'],
            ['table' => 'industries', 'route' => 'industries', 'priority' => '0.7'],
            ['table' => 'solutions', 'route' => 'solutions', 'priority' => '0.7'],
            ['table' => 'case_studies', 'route' => 'case-studies', 'priority' => '0.7'],
            ['table' => 'blog_posts', 'route' => 'blog', 'priority' => '0.6'],
            ['table' => 'careers', 'route' => 'careers', 'priority' => '0.6'],
            ['table' => 'portfolios', 'route' => 'portfolio', 'priority' => '0.5'],
        ];

        foreach ($queries as $q) {
            try {
                $query = DB::table($q['table']);

                // blog_posts stores status as a string enum while the other
                // content tables use a boolean flag. Only PUBLISHED posts are
                // listed — matching the /blog index filter, so every sitemap
                // URL is reachable from the index.
                if ($q['table'] === 'blog_posts') {
                    $query->where('status', 'PUBLISHED');
                } else {
                    $query->where('status', true);
                }

                $rows = $query->whereNotNull('slug')->select('slug', 'updatedAt')->get();

                foreach ($rows as $row) {
                    // DB::table() returns raw PDO strings — parse defensively (no Carbon casts).
                    $lastmod = null;
                    if (! empty($row->updatedAt)) {
                        $lastmod = date('Y-m-d', strtotime((string) $row->updatedAt)) ?: null;
                    }

                    $urls[] = [
                        'loc' => $base . '/' . $q['route'] . '/' . $row->slug,
                        'lastmod' => $lastmod,
                        'priority' => $q['priority'],
                        'changefreq' => 'monthly',
                    ];
                }
            } catch (\Throwable $e) {
                // Table missing or DB unavailable — skip this content group gracefully.
            }
        }

        return $urls;
    }
}
