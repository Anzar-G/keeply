import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Building2, UserPlus, Loader2 } from 'lucide-react';
import { contactAPI } from '../services/api';

const StatCard = ({ title, value, change, icon: Icon, color, isNegative }) => (
    <div className="premium-card p-6 group">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-2xl shadow-sm ${color} transition-transform group-hover:scale-110 duration-300`}>
                <Icon size={22} className="text-white" />
            </div>
        </div>
        <div className="mt-6 flex items-center text-sm">
            <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${isNegative ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                <TrendingUp size={14} className={isNegative ? 'rotate-180' : ''} />
                {change}
            </span>
            <span className="text-slate-400 ml-2 font-medium">vs last month</span>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalContacts: 0,
        newThisMonth: 0,
        companies: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const contacts = await contactAPI.getAll();

                // Calculate Stats
                const total = contacts.length;

                const now = new Date();
                const thisMonth = contacts.filter(c => {
                    const d = new Date(c.created_at);
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length;

                const uniqueCompanies = new Set(contacts.map(c => c.company).filter(Boolean)).size;

                setStats({
                    totalContacts: total,
                    newThisMonth: thisMonth,
                    companies: uniqueCompanies,
                    recentActivity: contacts.slice(0, 5) // Take first 5 as recent
                });
            } catch (error) {
                console.error('Failed to load dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Preparing your analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Monitor your contact database performance and growth.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">
                        Export Report
                    </button>
                    <button className="btn-primary">
                        Refresh Stats
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Contacts"
                    value={stats.totalContacts}
                    change="+12.5%"
                    icon={Users}
                    color="bg-indigo-600"
                />
                <StatCard
                    title="Growth Rate"
                    value={`${((stats.newThisMonth / (stats.totalContacts || 1)) * 100).toFixed(1)}%`}
                    change="+18%"
                    icon={UserPlus}
                    color="bg-slate-900"
                />
                <StatCard
                    title="Partnerships"
                    value={stats.companies}
                    change="+2.4%"
                    icon={Building2}
                    color="bg-cyan-600"
                />
                <StatCard
                    title="Engagement"
                    value="84%"
                    change="-2%"
                    isNegative={true}
                    icon={TrendingUp}
                    color="bg-indigo-500"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 premium-card p-8 flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Growth Analytics</h3>
                        <select className="bg-slate-50 border-none text-sm font-semibold text-slate-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500">
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>
                    <div className="flex-1 bg-slate-50/50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                        <div className="text-center max-w-sm px-6">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <TrendingUp size={32} className="text-indigo-600" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-2">Visualizing Progress</h4>
                            <p className="text-slate-500 text-sm font-medium">Our advanced analytics engine is processing your historical data to generate detailed growth trends.</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="premium-card p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Recent Pulse</h3>
                        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</button>
                    </div>
                    <div className="space-y-6">
                        {stats.recentActivity.map((contact, index) => (
                            <div key={contact.id} className="flex items-center gap-4 group cursor-pointer">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-110 ${index % 3 === 0 ? 'bg-indigo-600' : index % 3 === 1 ? 'bg-slate-900' : 'bg-cyan-600'
                                    }`}>
                                    {contact.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 truncate">{contact.name}</h4>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-tighter">{contact.company || 'Direct Client'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-900">
                                        {new Date(contact.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                                </div>
                            </div>
                        ))}
                        {stats.recentActivity.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="mx-auto text-slate-200 mb-3" size={48} />
                                <p className="text-slate-400 font-medium">No fresh activity recorded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
