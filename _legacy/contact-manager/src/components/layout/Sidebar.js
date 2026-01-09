import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Settings, History, Shield, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { groupAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Sidebar = () => {
    const { user } = useAuth();
    const [groups, setGroups] = React.useState([]);

    React.useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await groupAPI.getAll();
                setGroups(data);
            } catch (error) {
                console.error('Failed to load groups in sidebar');
            }
        };
        fetchGroups();
    }, []);

    const handleAddGroup = async () => {
        const name = window.prompt('Masukkan nama grup baru:');
        if (!name) return;
        try {
            const newGroup = await groupAPI.create({ name });
            setGroups([...groups, newGroup]);
            toast.success('Grup dibuat');
        } catch (error) {
            toast.error('Gagal membuat grup');
        }
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-slate-100 dark:border-slate-800/60 bg-white dark:bg-[#020617] transition-all duration-500 md:translate-x-0 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.02)]">
            {/* Logo Area */}
            <div className="flex h-20 items-center border-b border-slate-50 dark:border-slate-800/40 px-8 bg-white/50 dark:bg-slate-900/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 shadow-indigo-200 dark:shadow-indigo-500/20 shadow-lg text-white rotate-3 hover:rotate-0 transition-transform">
                        <Shield size={20} fill="currentColor" />
                    </div>
                    <div>
                        <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight leading-none block">Keeply<span className="text-indigo-600">.</span></span>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Intelligence Pro</p>
                    </div>
                </div>
            </div>

            {/* Navigation and Bottom Section */}
            <div className="flex flex-col justify-between h-[calc(100vh-5rem)] overflow-y-auto px-4 py-8">
                <nav className="space-y-2">
                    <p className="px-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">Menu Utama</p>

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${isActive
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                            }`
                        }
                    >
                        <Users size={18} />
                        Daftar Kontak
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${isActive
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                            }`
                        }
                    >
                        <LayoutDashboard size={18} />
                        Analitik
                    </NavLink>

                    {/* Groups Section */}
                    <div className="pt-6">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Grup Kontak</p>
                            {user?.role === 'admin' && (
                                <button
                                    onClick={handleAddGroup}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
                                    title="Buat Grup"
                                >
                                    <Plus size={14} />
                                </button>
                            )}
                        </div>
                        <div className="space-y-1">
                            {groups.map(group => (
                                <NavLink
                                    key={group.id}
                                    to={`/?group=${group.id}`}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${isActive
                                            ? 'bg-slate-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400'
                                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: group.color || '#4338ca' }}
                                            />
                                            <span className="flex-1 truncate">{group.name}</span>
                                            {group.contact_count > 0 && (
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400'
                                                    }`}>
                                                    {group.contact_count}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                            {groups.length === 0 && (
                                <p className="px-4 text-[10px] font-medium text-slate-400 italic">Belum ada grup</p>
                            )}
                        </div>
                    </div>

                    {user?.role === 'admin' && (
                        <>
                            <p className="px-4 text-[10px] font-extrabold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mt-8 mb-4">Administration</p>
                            <NavLink
                                to="/activities"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${isActive
                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`
                                }
                            >
                                <History size={18} />
                                Log Aktivitas
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Bottom Section */}
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
    );
};

export default Sidebar;
