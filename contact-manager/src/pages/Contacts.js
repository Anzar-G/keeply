import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactList from '../components/ContactList';
import ContactForm from '../components/ContactForm';
import { Plus, Search, Loader2, Filter, Download, RefreshCw, FileText } from 'lucide-react';
import { contactAPI, groupAPI } from '../services/api';
import FilterSidebar from '../components/FilterSidebar';
import toast from 'react-hot-toast';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import ImportModal from '../components/ImportModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function Contacts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const groupParam = searchParams.get('group') || '';
    const searchParam = searchParams.get('search') || '';

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true); // Only for initial load
    const [isFetching, setIsFetching] = useState(false); // For search/filter updates
    const [searchQuery, setSearchQuery] = useState(searchParam);
    const [debouncedSearch, setDebouncedSearch] = useState(searchParam);
    const [showForm, setShowForm] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [groups, setGroups] = useState([]);
    const { isAdmin } = useAuth();
    const [activeFilters, setActiveFilters] = useState({
        group: groupParam,
        company: '',
        tag: '',
        dateFrom: '',
        dateTo: ''
    });

    // Keyboard Shortcuts
    useKeyboardShortcuts({
        'n': () => {
            if (isAdmin) {
                setEditingContact(null);
                setShowForm(true);
            }
        },
        'escape': () => {
            setShowForm(false);
            setShowImportModal(false);
            setShowFilters(false);
        }
    });

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        if (groupParam !== activeFilters.group) {
            setActiveFilters(prev => ({ ...prev, group: groupParam }));
        }
    }, [groupParam, activeFilters.group]);

    useEffect(() => {
        const query = searchParam.get('search') || '';
        if (query !== searchQuery) {
            setSearchQuery(query);
            setDebouncedSearch(query);
        }
    }, [searchParam, searchQuery]);

    const { addNotification } = useNotification();

    const loadContacts = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setIsFetching(true);

            const params = {
                ...activeFilters,
                search: debouncedSearch
            };
            const data = await contactAPI.getAll(params);
            setContacts(data);
        } catch (error) {
            console.error('Error loading contacts:', error);
            toast.error('Failed to load contacts.');
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }, [activeFilters, debouncedSearch]);

    const loadGroups = useCallback(async () => {
        try {
            const data = await groupAPI.getAll();
            setGroups(data);
        } catch (error) {
            console.error('Error loading groups:', error);
        }
    }, []);

    // Initial load - Run ONLY once on mount
    useEffect(() => {
        const initialLoad = async () => {
            await loadGroups();
            // We call loadContacts(true) here explicitly for the very first time
            try {
                setLoading(true);
                const data = await contactAPI.getAll({ ...activeFilters, search: '' });
                setContacts(data);
            } finally {
                setLoading(false);
            }
        };
        initialLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle search/filter updates without full-page loading refresh
    useEffect(() => {
        // Only run if we're not in the initial loading state
        if (!loading) {
            loadContacts(false);
        }
    }, [debouncedSearch, activeFilters, loadContacts, loading, searchQuery]);

    const handleAddContact = async (formData) => {
        try {
            const newContact = await contactAPI.create(formData);
            setContacts((prev) => [newContact, ...prev]);
            setShowForm(false);
            toast.success('Contact added successfully');
            addNotification(`New contact "${newContact.name}" added`);
        } catch (error) {
            console.error('Error adding contact:', error);
            toast.error(error.response?.data?.error || 'Failed to add contact');
        }
    };

    const handleUpdateContact = async (formData) => {
        try {
            const updatedContact = await contactAPI.update(editingContact.id, formData);
            setContacts((prev) =>
                prev.map((c) => (c.id === editingContact.id ? updatedContact : c))
            );
            setShowForm(false);
            setEditingContact(null);
            toast.success('Contact updated successfully');
            addNotification(`Contact "${updatedContact.name}" updated`);
        } catch (error) {
            console.error('Error updating contact:', error);
            toast.error('Failed to update contact');
        }
    };

    const handleDeleteContact = async (id) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                const contactName = contacts.find(c => c.id === id)?.name || 'Unknown';
                await contactAPI.delete(id);
                setContacts((prev) => prev.filter((c) => c.id !== id));
                toast.success('Contact deleted successfully');
                addNotification(`Contact "${contactName}" deleted`);
            } catch (error) {
                console.error('Error deleting contact:', error);
                toast.error('Failed to delete contact');
            }
        }
    };

    const handleBulkDelete = async (ids) => {
        if (window.confirm(`Are you sure you want to delete ${ids.length} contacts?`)) {
            try {
                await Promise.all(ids.map(id => contactAPI.delete(id)));
                setContacts((prev) => prev.filter((c) => !ids.includes(c.id)));
                toast.success('Selected contacts deleted');
                addNotification(`${ids.length} contacts deleted via bulk action`);
            } catch (error) {
                console.error('Error deleting contacts:', error);
                toast.error('Failed to delete some contacts');
            }
        }
    };


    const handleRefresh = () => {
        loadContacts(true);
        loadGroups();
        toast.success('Registry refreshed');
    };

    const handleExportPDF = () => {
        window.print();
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium dark:text-slate-400">Synchronizing contact registry...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Contact Registry</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Manage and organize your professional network with precision.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="btn-secondary h-11 w-11 !p-0 flex items-center justify-center"
                        title="Refresh Engine"
                    >
                        <RefreshCw size={18} className={isFetching ? 'animate-spin text-indigo-500' : ''} />
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Download size={18} />
                            Import
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={handleExportPDF}
                            className="btn-secondary flex items-center gap-2"
                            title="Export PDF"
                        >
                            <FileText size={18} />
                            Export PDF
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={() => {
                                setEditingContact(null);
                                setShowForm(true);
                            }}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Contact
                        </button>
                    )}
                </div>
            </div>

            {/* Toolbar Area */}
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5">
                        {isFetching ? (
                            <Loader2 className="text-indigo-500 animate-spin" size={20} />
                        ) : (
                            <Search className="text-slate-400 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Search name, email, company, or position..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-premium pl-12"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(true)}
                    className={`btn-secondary flex items-center gap-2 px-6 ${Object.values(activeFilters).some(v => v !== '') ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-400' : ''
                        }`}
                >
                    <Filter size={18} />
                    {Object.values(activeFilters).some(v => v !== '') ? 'Filters Active' : 'Advanced Filters'}
                </button>
            </div>

            {/* Filter Sidebar Component */}
            <FilterSidebar
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                filters={activeFilters}
                groups={groups}
                onFilterChange={(key, value) => {
                    setActiveFilters(prev => ({ ...prev, [key]: value }));
                    if (key === 'group') {
                        if (value) setSearchParams({ group: value });
                        else setSearchParams({});
                    }
                }}
                onReset={() => {
                    setActiveFilters({
                        group: '',
                        company: '',
                        tag: '',
                        dateFrom: '',
                        dateTo: ''
                    });
                    setSearchQuery('');
                    setDebouncedSearch('');
                    setSearchParams({});
                }}
            />

            {/* List Content */}
            <div className="premium-card min-h-[400px]">
                <ContactList
                    contacts={contacts}
                    isAdmin={isAdmin}
                    groups={groups}
                    onEdit={isAdmin ? (contact) => {
                        setEditingContact(contact);
                        setShowForm(true);
                    } : null}
                    onDelete={isAdmin ? handleDeleteContact : null}
                    onBulkDelete={isAdmin ? handleBulkDelete : null}
                />
            </div>

            {/* Modal Form */}
            {showForm && isAdmin && (
                <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scale-in-center border dark:border-slate-800">
                        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                                    {editingContact ? 'Refine Contact' : 'Create New Entry'}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Please provide accurate contact information.</p>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors" onClick={() => setShowForm(false)}>
                                <Plus className="rotate-45" size={24} />
                            </div>
                        </div>
                        <div className="p-8 overflow-y-auto">
                            <ContactForm
                                contact={editingContact}
                                onSubmit={editingContact ? handleUpdateContact : handleAddContact}
                                onCancel={() => {
                                    setShowForm(false);
                                    setEditingContact(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* Import Modal */}
            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImportSuccess={loadContacts}
                groups={groups}
            />
        </div>
    );
}

export default Contacts;
