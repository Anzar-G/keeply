import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { UserPlus, Download, Trash2, X, Edit2, User, Mail, Building2, Phone, FolderPlus, ChevronUp, Lock } from 'lucide-react';

export default function ContactList({ contacts, onEdit, onDelete, onBulkDelete, isAdmin, groups }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [showGroupSelect, setShowGroupSelect] = useState(false);

    const allSelected = contacts.length > 0 && selectedIds.length === contacts.length;

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(contacts.map(c => c.id));
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDeleteAction = () => {
        if (onBulkDelete) {
            onBulkDelete(selectedIds).then(() => {
                setSelectedIds([]);
            });
        }
    };

    const handleExportCSV = () => {
        const selectedContacts = contacts.filter(c => selectedIds.includes(c.id));
        const headers = ['Name', 'Email', 'Phone', 'Company', 'Position', 'Tags', 'Notes'];
        const csvRows = [
            headers.join(','),
            ...selectedContacts.map(contact => [
                contact.name,
                isAdmin ? contact.email : '••••••••@••••.•••',
                contact.phone || '',
                contact.company || '',
                contact.job_title || '',
                (contact.tags || []).join('; '),
                contact.notes || ''
            ].map(field => `"${field}"`).join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notemy_contacts_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        setSelectedIds([]);
    };

    if (contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-slate-200 dark:text-slate-700">
                    <UserPlus size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Registri kosong</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                    Mulai bangun database profesional Anda dengan menambahkan entri kontak pertama di atas.
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                            <th className="p-6 w-12">
                                <div className="flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="rounded-lg border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500/20 h-5 w-5 bg-white dark:bg-slate-900 cursor-pointer transition-all"
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                    />
                                </div>
                            </th>
                            <th className="p-6 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.15em]">Info Kontak</th>
                            <th className="p-6 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.15em] hidden lg:table-cell">Profesional</th>
                            <th className="p-6 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.15em] hidden xl:table-cell">Tag</th>
                            <th className="p-6 text-right text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.15em]">Meta</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {contacts.map((contact) => {
                            const isSelected = selectedIds.includes(contact.id);
                            const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

                            return (
                                <tr
                                    key={contact.id}
                                    className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 ${isSelected ? 'bg-indigo-50/30 dark:bg-indigo-500/10' : ''}`}
                                >
                                    <td className="p-6">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="rounded-lg border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500/20 h-5 w-5 bg-white dark:bg-slate-900 cursor-pointer transition-all"
                                                checked={isSelected}
                                                onChange={() => handleSelectOne(contact.id)}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-sm flex-shrink-0 shadow-sm">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-2">
                                                    {contact.name}
                                                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        <Mail size={12} className="text-slate-300 dark:text-slate-700" />
                                                        {isAdmin ? contact.email : '••••••••@••••.•••'}
                                                    </div>
                                                    {contact.phone && (
                                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                                                            <Phone size={12} className="text-slate-200 dark:text-slate-800" />
                                                            {contact.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden lg:table-cell">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">
                                                <Building2 size={14} className="text-slate-300 dark:text-slate-700" />
                                                {contact.company || 'Pribadi'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                                                <User size={12} className="text-slate-200 dark:text-slate-800" />
                                                {contact.job_title || 'Netral'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden xl:table-cell">
                                        <div className="flex flex-wrap gap-1.5">
                                            {contact.tags && contact.tags.length > 0 ? (
                                                contact.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider border border-slate-200/50 dark:border-slate-700/50"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-700 text-sm italic font-medium">Kosong</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!isAdmin && (
                                                <button
                                                    onClick={() => onEdit(contact)}
                                                    className="px-3 py-2 flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all border border-indigo-200 dark:border-indigo-500/20"
                                                    title="Minta akses detail kontak"
                                                >
                                                    <Lock size={14} />
                                                    Minta Detail
                                                </button>
                                            )}
                                            {onEdit && isAdmin && (
                                                <button
                                                    onClick={() => onEdit(contact)}
                                                    className="w-9 h-9 flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md dark:hover:shadow-indigo-500/10 rounded-xl transition-all"
                                                    title="Perbarui informasi"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            {onDelete && isAdmin && (
                                                <button
                                                    onClick={() => onDelete(contact.id)}
                                                    className="w-9 h-9 flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md dark:hover:shadow-rose-500/10 rounded-xl transition-all"
                                                    title="Arsipkan entri"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Bulk Action Floating Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-8 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
                    <div className="bg-slate-950 border border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl px-8 py-4 flex items-center gap-10 backdrop-blur-xl bg-slate-950/90 pointer-events-auto ring-1 ring-white/5 animate-in slide-in-from-bottom-5 duration-300">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-600 text-white text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                {selectedIds.length}
                            </div>
                            <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase whitespace-nowrap">
                                {selectedIds.length} Terpilih
                            </span>
                        </div>

                        <div className="h-6 w-px bg-slate-800"></div>

                        <div className="flex items-center gap-3">
                            {onBulkDelete && (
                                <button
                                    onClick={handleBulkDeleteAction}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white text-xs font-extrabold rounded-xl hover:bg-rose-600 transition-all active:scale-95 tracking-wider uppercase"
                                >
                                    <Trash2 size={14} />
                                    Hapus
                                </button>
                            )}
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-extrabold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 tracking-wider uppercase"
                            >
                                <Download size={14} />
                                Ekspor
                            </button>
                            <button
                                onClick={() => setSelectedIds([])}
                                className="h-10 w-10 flex items-center justify-center bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                                title="Batalkan semua"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
