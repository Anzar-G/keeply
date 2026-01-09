<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalContacts = Contact::count();
        $thisMonth = Contact::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();

        $companies = Contact::whereNotNull('company')->distinct('company')->count('company');

        // Calculate growth percentages
        // Logic: Compare current total with total at the end of last month
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();
        $activeLastMonth = Contact::where('created_at', '<=', $endOfLastMonth)->count();

        $growthPct = 0;
        if ($activeLastMonth > 0) {
            $growthPct = (($totalContacts - $activeLastMonth) / $activeLastMonth) * 100;
        } elseif ($totalContacts > 0) {
            $growthPct = 100;
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalContacts' => $totalContacts,
                'newThisMonth' => $thisMonth,
                'companies' => $companies,
                'growthPct' => number_format($growthPct, 1),
                'recentActivity' => Contact::latest()->take(5)->get(),
            ]
        ]);
    }
}
