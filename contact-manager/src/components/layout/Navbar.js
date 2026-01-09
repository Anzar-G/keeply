import React, { useState, useRef, useMemo } from 'react';
import { Bell, Search, Menu, CheckCheck, LogOut, Sun, Moon, Command } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useNavigate } from 'react-router-dom';

function Navbar({ toggleSidebar, isMobile }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, unreadCount, markAllAsRead } = useNotification();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const shortcuts = useMemo(() => ({
        'k': () => searchRef.current?.focus()
    }), []);

    useKeyboardShortcuts(shortcuts);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const [topSearch, setTopSearch] = useState('');

    const handleGlobalSearch = (e) => {
        e.preventDefault();
        if (topSearch.trim()) {
            navigate(`/contacts?search=${encodeURIComponent(topSearch.trim())}`);
            setTopSearch('');
        }
    };

    return (
        <nav className="h-16 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800/60 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between w-full transition-all duration-300">
            {/* Left side: Mobile Toggle & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-600 dark:text-slate-400"
                >
                    <Menu size={24} />
                </button>

                <form
                    onSubmit={handleGlobalSearch}
                    className="hidden md:flex items-center gap-2 text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-950 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-800 w-96 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:focus-within:ring-indigo-500/10 focus-within:border-indigo-400 dark:focus-within:border-indigo-600 transition-all group"
                >
                    <Search size={18} className="group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search anything..."
                        value={topSearch}
                        onChange={(e) => setTopSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-slate-200 w-full placeholder-gray-400 dark:placeholder-slate-600"
                    />
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-[10px] font-bold text-gray-400 dark:text-slate-600 shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
                        <Command size={10} />
                        <span>K</span>
                    </div>
                </form>
            </div>

            {/* Right side: Notifications & Profile */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-slate-400 transition-all duration-300 transform active:rotate-180"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
                </button>

                {/* Notification Dropdown Container */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-slate-400 relative transition-colors"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl z-50 animate-in slide-in-from-top-2">
                                <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium flex items-center gap-1"
                                        >
                                            <CheckCheck size={14} />
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${!notification.read ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="mt-1">
                                                        <div className={`w-2 h-2 rounded-full ${!notification.read ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-700'}`} />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm ${!notification.read ? 'text-gray-900 dark:text-slate-100 font-medium' : 'text-gray-600 dark:text-slate-400'}`}>
                                                            {notification.text}
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{notification.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            No notifications
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {user ? (
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-800">
                        <div className="text-right hidden md:block">
                            <div className="flex items-center gap-2 justify-end">
                                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{user?.username || 'User'}</p>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user?.role === 'admin'
                                    ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-400'
                                    }`}>
                                    {user?.role || 'viewer'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-500">{user?.email || 'user@example.com'}</p>
                        </div>
                        <div className="w-9 h-9 bg-indigo-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-indigo-200 dark:border-slate-700 shadow-sm overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="pl-4 border-l border-gray-200 dark:border-slate-800">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm active:scale-95"
                        >
                            Admin Login
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
