<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Lead;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stats = [
            'pages_count' => Page::count(),
            'leads_count' => Lead::count(),
            'users_count' => User::count(),
            'services_count' => \App\Models\Service::count(),
            'case_studies_count' => \App\Models\CaseStudy::count(),
            'careers_count' => \App\Models\Career::count(),
            'new_leads_this_week' => Lead::where('created_at', '>=', now()->subWeek())->count(),
        ];

        $recentLogs = [];
        if (class_exists(AuditLog::class)) {
            $recentLogs = AuditLog::with('user')->latest('created_at')->take(5)->get();
        }
        $recentLeads = Lead::latest('created_at')->take(5)->get();

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => compact('stats', 'recentLogs', 'recentLeads'),
                'total' => collect($stats)->sum()
            ]);
        }

        return view('admin.dashboard', compact('stats', 'recentLogs', 'recentLeads'));
    }
}
