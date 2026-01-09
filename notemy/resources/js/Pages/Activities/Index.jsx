import React from 'react';
import { Head, Link } from '@inertiajs/react';
import NotemyLayout from '@/Layouts/NotemyLayout';
import { User, Calendar, Info, Database, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Index({ activities }) {
    const getActionColor = (action) => {
        switch (action) {
            case 'CREATE_CONTACT': return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            case 'UPDATE_CONTACT': return 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'DELETE_CONTACT': return 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
            default: return 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800';
        }
    };

    const formatAction = (action) => {
        return action.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <NotemyLayout>
            <Head title="Log Aktivitas" />

            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Log Aktivitas</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic text-sm">Monitor setiap perubahan yang terjadi pada registri kontak.</p>
                </div>

                {/* Audit Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Waktu</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Aktor</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Aksi</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {activities.data.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-200">
                                                <Calendar size={14} className="text-slate-400 dark:text-slate-600" />
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
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                                                    <User size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{activity.actor}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getActionColor(activity.action)}`}>
                                                {formatAction(activity.action)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                <Info size={14} className="text-slate-400 dark:text-slate-600 shrink-0" />
                                                <span className="truncate max-w-xs md:max-w-md">
                                                    {activity.details.name ? `Kontak: ${activity.details.name}` :
                                                        activity.details.description ? activity.details.description :
                                                            JSON.stringify(activity.details)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {activities.data.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="max-w-xs mx-auto text-slate-400 dark:text-slate-600">
                                                <Database size={48} className="mx-auto mb-4 opacity-20" />
                                                <p className="font-bold">Tidak ada data historis</p>
                                                <p className="text-sm">Jejak audit akan muncul di sini segera setelah perubahan terjadi.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {activities.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Menampilkan <span className="font-bold">{activities.from}</span> sampai <span className="font-bold">{activities.to}</span> dari <span className="font-bold">{activities.total}</span> entri
                            </div>
                            <div className="flex gap-2">
                                {activities.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${link.active
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                            : !link.url
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </NotemyLayout>
    );
}
