import React, { useState } from 'react';
import { UserPlus, Download, Trash2, X, Edit2 } from 'lucide-react';

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
                setSelectedIds([]); // Clear selection after delete
            });
        }
    };

    const handleExportCSV = () => {
        const selectedContacts = contacts.filter(c => selectedIds.includes(c.id));

        // Create CSV content
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
        a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        setSelectedIds([]);
    };

    if (contacts.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No contacts yet
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Get started by adding your first contact to manage your network efficiently.
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 w-12">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-transparent cursor-pointer"
                                            checked={allSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </div>
                                </th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Company</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Tags</th>
                                <th className="p-4 w-20 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {contacts.map((contact) => {
                                const isSelected = selectedIds.includes(contact.id);
                                const initials = contact.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);

                                return (
                                    <tr
                                        key={contact.id}
                                        className={`group hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectOne(contact.id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                    {initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium text-slate-900 truncate">{contact.name}</div>
                                                    <div className="text-sm text-slate-500 md:hidden truncate">{contact.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <div className="text-sm text-slate-600">{contact.email}</div>
                                        </td>
                                        <td className="p-4 hidden lg:table-cell">
                                            <div className="text-sm text-slate-600">{contact.phone || '-'}</div>
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            <div className="text-sm text-slate-600">{contact.company || '-'}</div>
                                        </td>
                                        <td className="p-4 hidden xl:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {contact.tags && contact.tags.length > 0 ? (
                                                    contact.tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 text-sm">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(contact)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(contact.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
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
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && onBulkDelete && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-4 transition-all z-20">
                    <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
                        <div className="bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {selectedIds.length}
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                            {selectedIds.length} selected
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleBulkDeleteAction}
                            className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
                        >
                            <Download size={14} />
                            Export CSV
                        </button>
                        <button
                            onClick={() => setSelectedIds([])}
                            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                            title="Clear selection"
                        >
                            <X size={16} className="text-slate-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactList;
