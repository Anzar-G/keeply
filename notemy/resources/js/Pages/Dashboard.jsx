import React from 'react';
import { Head, router } from '@inertiajs/react';
import NotemyLayout from '@/Layouts/NotemyLayout';
import { Users, TrendingUp, Building2, UserPlus, ArrowUpRight, ArrowDownRight, RefreshCw, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const StatCard = ({ title, value, change, icon: Icon, color, isNegative, percentage }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all">
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

export default function Dashboard({ stats }) {

    const handleRefresh = () => {
        router.reload({
            only: ['stats'],
            onSuccess: () => toast.success('Mesin sinkron.'),
            onError: () => toast.error('Sinkronisasi gagal.'),
        });
    };

    const handleDownloadPDF = () => {
        const toastId = toast.loading('Menyiapkan laporan...');
        setTimeout(() => {
            toast.dismiss(toastId);
            window.print();
        }, 1000);
    };

    return (
        <NotemyLayout>
            <Head title="Ringkasan Performa" />
            <Toaster position="top-right" />

            <div className="space-y-8 animate-in fade-in duration-1000">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Ringkasan Performa</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic text-sm">Pantau pertumbuhan registri dan kesehatan relasi Anda.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDownloadPDF}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 flex items-center gap-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all py-2.5"
                        >
                            <FileText size={16} />
                            Ekspor PDF
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg shadow-indigo-100/20 flex items-center gap-2 rounded-xl text-sm font-bold transition-all py-2.5 active:scale-95"
                        >
                            <RefreshCw size={16} />
                            Segarkan Mesin
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Registri Aktif"
                        value={stats.totalContacts}
                        percentage={stats.growthPct}
                        icon={Users}
                        color="bg-indigo-600"
                        isNegative={parseFloat(stats.growthPct) < 0}
                    />
                    <StatCard
                        title="Veloitas Bulanan"
                        value={`${((stats.newThisMonth / (stats.totalContacts || 1)) * 100).toFixed(1)}%`}
                        percentage={((stats.newThisMonth / (stats.totalContacts || 1)) * 100).toFixed(1)}
                        icon={UserPlus}
                        color="bg-slate-900"
                    />
                    <StatCard
                        title="Kedalaman Perusahaan"
                        value={stats.companies}
                        percentage="2.4"
                        icon={Building2}
                        color="bg-cyan-600"
                    />
                    <StatCard
                        title="Denyut Sistem"
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
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-10 flex flex-col min-h-[420px] relative overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dinamika Pertumbuhan</h3>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5 tracking-tight">Tren analitik waktu nyata</p>
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
                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Menganalisis Pola...</h4>
                                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium leading-relaxed italic">Mesin pemrosesan kami sedang menyusun data kontak historis untuk menghasilkan proyeksi pertumbuhan dengan fidelitas tinggi.</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 flex flex-col shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Denyut Terkini</h3>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Pembaruan Status</p>
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
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tight truncate">{contact.company || 'Entri Registri'}</p>
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
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                                        <Users className="text-slate-200 dark:text-slate-600" size={32} />
                                    </div>
                                    <p className="text-slate-400 dark:text-slate-600 font-bold text-sm">Registri Hening</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </NotemyLayout>
    );
}
