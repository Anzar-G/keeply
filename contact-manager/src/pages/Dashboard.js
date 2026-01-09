import React, { useEffect, useState, useCallback } from 'react';
import { Users, TrendingUp, Building2, UserPlus, Loader2, ArrowUpRight, ArrowDownRight, RefreshCw, FileText } from 'lucide-react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, change, icon: Icon, color, isNegative, percentage }) => (
    <div className="premium-card p-6 flex flex-col justify-between group">
        <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-xl shadow-sm ${color} transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/10`}>
                <Icon size={20} className="text-white" />
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${isNegative ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}>
                {isNegative ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                {percentage}%
            </div>
        </div>
        <div className="mt-4">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-600">total</span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalContacts: 0,
        newThisMonth: 0,
        companies: 0,
        growthPct: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async (isManual = false) => {
        try {
            if (isManual) {
                toast.loading('Synchronizing engine...', { id: 'refresh-sync' });
            } else {
                setLoading(true);
            }

            const contacts = await contactAPI.getAll();
            const total = contacts.length;
            const now = new Date();
            const thisMonth = contacts.filter(c => {
                const d = new Date(c.created_at);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length;

            const uniqueCompanies = new Set(contacts.map(c => c.company).filter(Boolean)).size;

            // Calculate real percentages
            const lastMonthDate = new Date();
            lastMonthDate.setMonth(now.getMonth() - 1);
            const lastMonthContacts = contacts.filter(c => {
                const d = new Date(c.created_at);
                return d < lastMonthDate;
            }).length;

            const growthPct = lastMonthContacts === 0 ? (total > 0 ? 100 : 0) : (((total - lastMonthContacts) / lastMonthContacts) * 100).toFixed(1);

            setStats({
                totalContacts: total,
                newThisMonth: thisMonth,
                companies: uniqueCompanies,
                growthPct: growthPct,
                recentActivity: contacts.slice(0, 5)
            });

            if (isManual) {
                toast.success('Engine synchronized.', { id: 'refresh-sync' });
            }
        } catch (error) {
            console.error('Failed to load dashboard stats', error);
            if (isManual) {
                toast.error('Sync failed.', { id: 'refresh-sync' });
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleRefresh = () => {
        fetchStats(true);
    };

    const handleDownloadPDF = () => {
        const toastId = toast.loading('Preparing report...');
        setTimeout(() => {
            toast.dismiss(toastId);
            window.print();
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Synchronizing analytics engine...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Performance Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Monitor your registry's growth and relationship health.</p>
                </div>
                <div className="flex gap-2 print:hidden">
                    <button
                        onClick={handleDownloadPDF}
                        className="btn-secondary px-5 flex items-center gap-2"
                    >
                        <FileText size={16} />
                        Download PDF
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="btn-primary px-6 shadow-indigo-100 flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        Refresh Engine
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Registry"
                    value={stats.totalContacts}
                    percentage={stats.growthPct}
                    icon={Users}
                    color="bg-indigo-600"
                />
                <StatCard
                    title="Monthly Velocity"
                    value={`${((stats.newThisMonth / (stats.totalContacts || 1)) * 100).toFixed(1)}%`}
                    percentage={((stats.newThisMonth / (stats.totalContacts || 1)) * 100).toFixed(1)}
                    icon={UserPlus}
                    color="bg-slate-900"
                />
                <StatCard
                    title="Company Depth"
                    value={stats.companies}
                    percentage="2.4"
                    icon={Building2}
                    color="bg-cyan-600"
                />
                <StatCard
                    title="System Pulse"
                    value="99.9%"
                    percentage="0.2"
                    isNegative={false}
                    icon={TrendingUp}
                    color="bg-indigo-500"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart Container */}
                <div className="lg:col-span-2 premium-card p-10 flex flex-col min-h-[420px] bg-white relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Growth Dynamic</h3>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5 tracking-tight">Real-time analytical trends</p>
                        </div>
                        <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800">
                            <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 shadow-sm rounded-lg text-indigo-600 dark:text-indigo-400 transition-all">Q1</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-all">Q2</button>
                        </div>
                    </div>

                    <div className="flex-1 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-950/50 dark:to-[#020617] rounded-[32px] flex items-center justify-center border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:24px_24px]"></div>
                        <div className="text-center max-w-sm px-10 relative z-10">
                            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center mx-auto mb-6 border border-slate-50 dark:border-slate-800 transition-transform duration-700 group-hover:scale-105">
                                <TrendingUp size={36} className="text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Analyzing Patterns...</h4>
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-relaxed italic">Our processing engine is currently compiling historical contact data to generate high-fidelity growth projections.</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="premium-card p-8 bg-white border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Pulse</h3>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Status Updates</p>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-800">
                            <ArrowUpRight size={16} />
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        {stats.recentActivity.map((contact, index) => (
                            <div key={contact.id} className="flex items-center gap-4 group cursor-pointer hover:-translate-x-1 transition-transform">
                                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg transition-all group-hover:shadow-indigo-500/10 ${index % 3 === 0 ? 'bg-indigo-600' : index % 3 === 1 ? 'bg-slate-900' : 'bg-cyan-600'
                                    }`}>
                                    {contact.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">{contact.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tight truncate">{contact.company || 'Registry Entry'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-extrabold text-slate-800 dark:text-slate-400 lowercase">
                                        {new Date(contact.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                    <div className="flex justify-end gap-0.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stats.recentActivity.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <Users className="text-slate-200" size={32} />
                                </div>
                                <p className="text-slate-400 font-bold text-sm">Quiet Registry</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
