import React, { useState } from 'react';
import { UserPlus, Download, Trash2, X, Edit2, User, Mail, Building2 } from 'lucide-react';

function ContactList({ contacts, onEdit, onDelete, onBulkDelete }) {
    const [selectedIds, setSelectedIds] = useState([]);

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
                contact.email,
                contact.phone || '',
                contact.company || '',
                contact.position || '',
                (contact.tags || []).join('; '),
                contact.notes || ''
            ].map(field => `"${field}"`).join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `keeply_contacts_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        setSelectedIds([]);
    };

    if (contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-200">
                    <UserPlus size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Registry is empty</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                    Begin building your professional database by adding your first contact entry above.
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="p-6 w-12">
                                <div className="flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500/20 h-5 w-5 bg-white cursor-pointer transition-all"
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                    />
                                </div>
                            </th>
                            <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Contact Info</th>
                            <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-[0.15em] hidden lg:table-cell">Professional</th>
                            <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-[0.15em] hidden xl:table-cell">Tags</th>
                            <th className="p-6 text-right text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Meta</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {contacts.map((contact) => {
                            const isSelected = selectedIds.includes(contact.id);
                            const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

                            return (
                                <tr
                                    key={contact.id}
                                    className={`group hover:bg-slate-50/50 transition-all duration-200 ${isSelected ? 'bg-indigo-50/30' : ''}`}
                                >
                                    <td className="p-6">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500/20 h-5 w-5 bg-white cursor-pointer transition-all"
                                                checked={isSelected}
                                                onChange={() => handleSelectOne(contact.id)}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-extrabold text-sm flex-shrink-0 shadow-sm">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                                    {contact.name}
                                                    {isSelected && <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                    <Mail size={12} className="text-slate-300" />
                                                    {contact.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden lg:table-cell">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                                                <Building2 size={14} className="text-slate-300" />
                                                {contact.company || 'Private'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                                <User size={12} className="text-slate-200" />
                                                {contact.position || 'Neutral'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 hidden xl:table-cell">
                                        <div className="flex flex-wrap gap-1.5">
                                            {contact.tags && contact.tags.length > 0 ? (
                                                contact.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-600 uppercase tracking-wider border border-slate-200/50"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-300 text-sm italic font-medium">None</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(contact)}
                                                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all"
                                                    title="Refine information"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(contact.id)}
                                                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white hover:shadow-md rounded-xl transition-all"
                                                    title="Archive entry"
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
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-slate-900 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl px-8 py-5 flex items-center gap-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-600 text-white text-[10px] font-extrabold rounded-full h-6 w-6 flex items-center justify-center shadow-lg shadow-indigo-900/50">
                                {selectedIds.length}
                            </div>
                            <span className="text-sm font-bold text-white tracking-tight">
                                {selectedIds.length} Selected
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
                                    Archive
                                </button>
                            )}
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-extrabold rounded-xl hover:bg-indigo-700 transition-all active:scale-95 tracking-wider uppercase"
                            >
                                <Download size={14} />
                                Export
                            </button>
                            <button
                                onClick={() => setSelectedIds([])}
                                className="h-10 w-10 flex items-center justify-center bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                                title="Deselect all"
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

export default ContactList;
