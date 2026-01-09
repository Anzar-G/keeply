import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Download, Trash2, X, Edit2, User, Mail, Building2, Phone, FolderPlus, ChevronUp } from 'lucide-react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNotification } from '../context/NotificationContext';

function ContactList({ contacts, onEdit, onDelete, onBulkDelete, isAdmin, groups }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [showGroupSelect, setShowGroupSelect] = useState(false);
    const { addNotification } = useNotification();

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
    const handleBulkGroupAssign = async (groupId) => {
        try {
            await contactAPI.bulkAssignToGroup(selectedIds, groupId);
            const groupName = groups.find(g => g.id === groupId)?.name || 'Group';
            toast.success(`Assigned ${selectedIds.length} contacts to ${groupName}`);
            addNotification(`Assigned ${selectedIds.length} contacts to group "${groupName}"`);
            setSelectedIds([]);
            setShowGroupSelect(false);
        } catch (error) {
            toast.error('Failed to assign group');
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
                                                {isAdmin ? (
                                                    <Link to={`/contacts/${contact.id}`} className="font-bold text-slate-900 truncate flex items-center gap-2 hover:text-indigo-600 transition-colors">
                                                        {contact.name}
                                                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>}
                                                    </Link>
                                                ) : (
                                                    <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                                        {contact.name}
                                                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>}
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                                        <Mail size={12} className="text-slate-300" />
                                                        {isAdmin ? contact.email : '••••••••@••••.•••'}
                                                    </div>
                                                    {contact.phone && (
                                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                                            <Phone size={12} className="text-slate-200" />
                                                            {contact.phone}
                                                        </div>
                                                    )}
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
                <div className="fixed bottom-8 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
                    <div className="bg-slate-950 border border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl px-8 py-4 flex items-center gap-10 backdrop-blur-xl bg-slate-950/90 pointer-events-auto ring-1 ring-white/5 animate-in slide-in-from-bottom-5 duration-300">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-600 text-white text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                {selectedIds.length}
                            </div>
                            <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase whitespace-nowrap">
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
                            {onBulkDelete && isAdmin && groups && groups.length > 0 && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowGroupSelect(!showGroupSelect)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-xs font-extrabold rounded-xl hover:bg-slate-700 transition-all active:scale-95 tracking-wider uppercase"
                                    >
                                        <FolderPlus size={14} />
                                        Group
                                        <ChevronUp size={12} className={`transition-transform ${showGroupSelect ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showGroupSelect && (
                                        <div className="absolute bottom-full mb-3 left-0 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden min-w-[200px] animate-in slide-in-from-bottom-2 duration-200">
                                            <div className="p-3 border-b border-slate-800">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Group</p>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto py-1">
                                                {groups.map(group => (
                                                    <button
                                                        key={group.id}
                                                        onClick={() => handleBulkGroupAssign(group.id)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                                                    >
                                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: group.color || '#4338ca' }} />
                                                        <span className="text-xs font-bold">{group.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
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
