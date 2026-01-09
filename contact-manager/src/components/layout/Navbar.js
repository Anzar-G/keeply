import React, { useState } from 'react';
import { Bell, Search, Menu, CheckCheck, LogOut } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ toggleSidebar, isMobile }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, unreadCount, markAllAsRead } = useNotification();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
        <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between w-full transition-all duration-300">
            {/* Left side: Mobile Toggle & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                    <Menu size={24} />
                </button>

                <form
                    onSubmit={handleGlobalSearch}
                    className="hidden md:flex items-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 w-96 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all"
                >
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        value={topSearch}
                        onChange={(e) => setTopSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400"
                    />
                </form>
            </div>

            {/* Right side: Notifications & Profile */}
            <div className="flex items-center gap-4">
                {/* Notification Dropdown Container */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-600 relative transition-colors"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
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
                                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="mt-1">
                                                        <div className={`w-2 h-2 rounded-full ${!notification.read ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm ${!notification.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                                            {notification.text}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
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
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right hidden md:block">
                            <div className="flex items-center gap-2 justify-end">
                                <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user?.role === 'admin'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {user?.role || 'viewer'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                        </div>
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`} alt="User" className="w-full h-full rounded-full" />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="pl-4 border-l border-gray-200">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
