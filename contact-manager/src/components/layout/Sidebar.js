import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Settings } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white transition-transform md:translate-x-0">
            {/* Logo Area */}
            <div className="flex h-16 items-center border-b border-gray-100 px-6">
                <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <Users size={20} />
                    </div>
                    <span>Contact<span className="text-blue-600">Pro</span></span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col justify-between h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
                <nav className="space-y-1">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/contacts"
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <Users size={20} />
                        Contacts
                    </NavLink>
                </nav>

                {/* Bottom Section */}
                <div className="mt-auto border-t border-gray-100 pt-4 space-y-1">
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <UserCircle size={20} />
                        Profile
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        <Settings size={20} />
                        Settings
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
