import React, { useState, useEffect } from 'react';
import { activityAPI } from '../services/api';
import { User, Calendar, Info, Loader2, Database } from 'lucide-react';

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await activityAPI.getAll();
                setActivities(data);
            } catch (error) {
                console.error('Failed to load activities', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE_CONTACT': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'UPDATE_CONTACT': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'DELETE_CONTACT': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatAction = (action) => {
        return action.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Retrieving audit logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Activity Log</h1>
                <p className="text-slate-500 mt-1 font-medium italic">Monitor every modification made to the contact registry.</p>
            </div>

            {/* Audit Table */}
            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Actor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {activities.map((activity) => (
                                <tr key={activity.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(activity.created_at).toLocaleString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <User size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{activity.actor || 'System'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getActionColor(activity.action)}`}>
                                            {formatAction(activity.action)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                            <Info size={14} className="text-slate-400 shrink-0" />
                                            <span className="truncate max-w-xs md:max-w-md">
                                                {activity.details.name ? `Contact: ${activity.details.name}` :
                                                    activity.details.id ? `ID: ${activity.details.id}` :
                                                        JSON.stringify(activity.details)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {activities.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="max-w-xs mx-auto text-slate-400">
                                            <Database size={48} className="mx-auto mb-4 opacity-20" />
                                            <p className="font-bold">No historical data found</p>
                                            <p className="text-sm">Audit trails will appear here as soon as changes occur.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Activities;
