import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu, CheckCheck, LogOut, Sun, Moon, LayoutDashboard, Users, UserCircle, Settings, History, Shield, Plus, X } from 'lucide-react';

export default function NotemyLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-all duration-300">
            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#020617] transition-all duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)]`}>
                <div className="flex h-20 items-center border-b border-slate-50 dark:border-slate-800/40 px-8 bg-white/50 dark:bg-slate-900/20 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 shadow-indigo-200 dark:shadow-indigo-500/20 shadow-lg text-white rotate-3 hover:rotate-0 transition-transform">
                            <Shield size={20} fill="currentColor" />
                        </div>
                        <div>
                            <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight leading-none block">Notemy<span className="text-indigo-600">.</span></span>
                            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Intelligence Pro</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col justify-between h-[calc(100vh-5rem)] overflow-y-auto px-4 py-8">
                    <nav className="space-y-2">
                        <p className="px-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">Menu Utama</p>

                        <Link href={route('contacts.index')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${route().current('contacts.index') ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                            <Users size={18} />
                            Daftar Kontak
                        </Link>

                        <Link href={route('dashboard')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${route().current('dashboard') ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                            <LayoutDashboard size={18} />
                            Analitik
                        </Link>

                        {auth.user?.role === 'admin' && (
                            <>
                                <p className="px-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mt-8 mb-4">Administration</p>
                                <Link href={route('activities.index')} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${route().current('activities.index') ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                                    <History size={18} />
                                    Log Aktivitas
                                </Link>
                                {window.location.hostname === 'notemy.test' && (
                                    <a href="/admin" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200">
                                        <Shield size={18} />
                                        Super Admin Panel
                                    </a>
                                )}
                            </>
                        )}
                    </nav>

                    <div className="mt-auto border-t border-slate-50 dark:border-slate-800/50 pt-8 space-y-2">
                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200 text-left">
                            <UserCircle size={18} />
                            Profil
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200 text-left">
                            <Settings size={18} />
                            Pengaturan
                        </button>
                        <div className="mt-6 p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden group border border-white/5">
                            <div className="relative z-10">
                                <p className="text-xs font-bold opacity-80 mb-1">Support Plan</p>
                                <p className="text-sm font-extrabold">Enterprise Plus</p>
                            </div>
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Navbar */}
                <nav className="h-16 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800/60 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between w-full transition-all duration-300">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-600 dark:text-slate-400">
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-3 ml-auto">
                        <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-slate-400 transition-all duration-300 transform active:rotate-180">
                            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
                        </button>

                        {auth.user ? (
                            <>
                                <div className="relative">
                                    <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-slate-400 relative transition-colors">
                                        <Bell size={20} />
                                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-800">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{auth.user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-500 capitalize">{auth.user.role || 'User'}</p>
                                    </div>
                                    <div className="w-9 h-9 bg-indigo-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-indigo-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.name}`} alt="User" />
                                    </div>
                                    <Link href={route('logout')} method="post" as="button" className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                                        <LogOut size={18} />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-800">
                                <Link href={route('login')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                                    Log In
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
