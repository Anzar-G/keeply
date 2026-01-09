<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::with('user')
            ->latest()
            ->paginate(50)
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'created_at' => $log->created_at,
                    'actor' => $log->user ? $log->user->name : 'System',
                    'action' => $log->action,
                    'details' => $log->metadata ?? ['description' => $log->description],
                ];
            });

        return Inertia::render('Activities/Index', [
            'activities' => $logs
        ]);
    }
}
