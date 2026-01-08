import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Building2, UserPlus, Loader2 } from 'lucide-react';
import { contactAPI } from '../services/api';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium flex items-center gap-1">
                <TrendingUp size={14} />
                {change}
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
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
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Contacts"
                    value={stats.totalContacts}
                    change="+12%"
                    icon={Users}
                    color="bg-blue-600"
                />
                <StatCard
                    title="New This Month"
                    value={stats.newThisMonth}
                    change="+100%"
                    icon={UserPlus}
                    color="bg-indigo-600"
                />
                <StatCard
                    title="Companies"
                    value={stats.companies}
                    change="+2%"
                    icon={Building2}
                    color="bg-purple-600"
                />
                <StatCard
                    title="Active Deals"
                    value="-"
                    change="0%"
                    icon={TrendingUp}
                    color="bg-emerald-600"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Placeholder Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Growth Analytics</h3>
                    <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
                        <div className="text-center text-gray-400">
                            <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Chart Visualization Area</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Contacts</h3>
                    <div className="space-y-4">
                        {stats.recentActivity.map((contact) => (
                            <div key={contact.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {contact.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                                    <p className="text-sm text-gray-500">{contact.company || 'No Company'}</p>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(contact.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        {stats.recentActivity.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No recent activity</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
