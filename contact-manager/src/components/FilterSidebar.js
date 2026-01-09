import React from 'react';
import { X, Calendar, Building2, Tag, Users, RotateCcw } from 'lucide-react';

const FilterSidebar = ({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    groups,
    onReset
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-hidden">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Advanced Filtering</h2>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-0.5">Refine your registry view</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shadow-sm transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Groups Filter */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] px-1">
                            <Users size={12} className="text-slate-300 dark:text-slate-700" />
                            By Registry Group
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => onFilterChange('group', '')}
                                className={`px-4 py-3 rounded-xl text-left text-sm font-bold transition-all border ${!filters.group
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
                                    }`}
                            >
                                All Contacts
                            </button>
                            {groups.map(group => (
                                <button
                                    key={group.id}
                                    onClick={() => onFilterChange('group', group.id)}
                                    className={`px-4 py-3 rounded-xl text-left text-sm font-bold transition-all border flex items-center gap-3 ${filters.group === group.id
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100/20'
                                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
                                        }`}
                                >
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: group.color || '#4338ca' }}
                                    />
                                    {group.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Company Filter */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] px-1">
                            <Building2 size={12} className="text-slate-300 dark:text-slate-700" />
                            Business Intelligence
                        </label>
                        <input
                            type="text"
                            placeholder="Search by company name..."
                            value={filters.company}
                            onChange={(e) => onFilterChange('company', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm text-sm"
                        />
                    </div>

                    {/* Tags Filter */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] px-1">
                            <Tag size={12} className="text-slate-300 dark:text-slate-700" />
                            Registry Tags
                        </label>
                        <input
                            type="text"
                            placeholder="E.g. VIP, Partner, Lead..."
                            value={filters.tag}
                            onChange={(e) => onFilterChange('tag', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm text-sm"
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] px-1">
                            <Calendar size={12} className="text-slate-300 dark:text-slate-700" />
                            Registration Period
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 px-1 italic">From Date</span>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-bold text-slate-600 dark:text-slate-300 shadow-sm text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 px-1 italic">To Date</span>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => onFilterChange('dateTo', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-bold text-slate-600 dark:text-slate-300 shadow-sm text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center gap-3">
                    <button
                        onClick={onReset}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <RotateCcw size={14} />
                        Reset All
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 bg-indigo-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-100/20 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
