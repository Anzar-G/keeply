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
        const name = window.prompt('Enter new group name:');
        if (!name) return;
        try {
            const newGroup = await groupAPI.create({ name });
            setGroups([...groups, newGroup]);
            toast.success('Group created');
        } catch (error) {
            toast.error('Failed to create group');
        }
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-slate-100 bg-white transition-transform md:translate-x-0">
            {/* Logo Area */}
            <div className="flex h-20 items-center border-b border-slate-50 px-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-indigo-200 shadow-lg text-white">
                        <Shield size={20} fill="currentColor" />
                    </div>
                    <span className="font-extrabold text-xl text-slate-900 tracking-tight">Keeply<span className="text-indigo-600">.</span></span>
                </div>
            </div>

            {/* Navigation and Bottom Section */}
            <div className="flex flex-col justify-between h-[calc(100vh-5rem)] overflow-y-auto px-4 py-8">
                <nav className="space-y-2">
                    <p className="px-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${isActive
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <Users size={18} />
                        Contact List
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${isActive
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <LayoutDashboard size={18} />
                        Analytics
                    </NavLink>

                    {/* Groups Section */}
                    <div className="pt-6">
                        <div className="flex items-center justify-between px-4 mb-4">
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Contact Groups</p>
                            {user?.role === 'admin' && (
                                <button
                                    onClick={handleAddGroup}
                                    className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
                                    title="Create Group"
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
                                            ? 'bg-slate-50 text-indigo-700'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
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
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {group.contact_count}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                            {groups.length === 0 && (
                                <p className="px-4 text-[10px] font-medium text-slate-400 italic">No groups defined</p>
                            )}
                        </div>
                    </div>

                    {user?.role === 'admin' && (
                        <>
                            <p className="px-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mt-8 mb-4">Administration</p>
                            <NavLink
                                to="/activities"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <History size={18} />
                                Activity Log
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Bottom Section */}
                <div className="mt-auto border-t border-slate-50 pt-8 space-y-2">
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200">
                        <UserCircle size={18} />
                        Profile
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200">
                        <Settings size={18} />
                        Settings
                    </button>

                    <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden group">
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
