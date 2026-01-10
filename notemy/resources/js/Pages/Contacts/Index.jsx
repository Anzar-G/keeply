import React, { useState, useCallback, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import NotemyLayout from '@/Layouts/NotemyLayout';
import ContactList from '@/Components/Notemy/ContactList';
import ContactForm from '@/Components/Notemy/ContactForm';
import FilterSidebar from '@/Components/Notemy/FilterSidebar';
import { Plus, Filter, Download, RefreshCw, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Index({ contacts: initialContacts, groups }) {
    const { auth } = usePage().props;
    const [contacts, setContacts] = useState(initialContacts);
    const [showForm, setShowForm] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        group: '',
        company: '',
        tag: '',
        dateFrom: '',
        dateTo: ''
    });

    const isAdmin = auth.user?.role === 'admin';

    const handleRefresh = () => {
        router.reload({
            only: ['contacts'],
            onStart: () => setIsFetching(true),
            onFinish: () => {
                setIsFetching(false);
                toast.success('Registri diperbarui');
            }
        });
    };

    const handleAddContact = async (formData) => {
        router.post(route('contacts.store'), formData, {
            onSuccess: () => {
                setShowForm(false);
                toast.success('Kontak berhasil ditambahkan');
            },
            onError: (errors) => {
                toast.error('Gagal menambahkan kontak');
            }
        });
    };

    const handleUpdateContact = async (formData) => {
        router.put(route('contacts.update', editingContact.id), formData, {
            onSuccess: () => {
                setShowForm(false);
                setEditingContact(null);
                toast.success('Kontak berhasil diperbarui');
            },
            onError: (errors) => {
                toast.error('Gagal memperbarui kontak');
            }
        });
    };

    const handleDeleteContact = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
            router.delete(route('contacts.destroy', id), {
                onSuccess: () => toast.success('Kontak berhasil dihapus'),
            });
        }
    };

    return (
        <NotemyLayout>
            <Head title="Registri Kontak v2" />
            <Toaster position="top-right" />

            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Bagian Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Registri Kontak</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic text-sm">Kelola dan atur jaringan profesional Anda dengan presisi.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-11 w-11 flex items-center justify-center rounded-xl text-slate-500 hover:text-indigo-600 transition-all"
                            title="Segarkan Mesin"
                        >
                            <RefreshCw size={18} className={isFetching ? 'animate-spin text-indigo-500' : ''} />
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center gap-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all"
                        >
                            <FileText size={18} />
                            Ekspor PDF
                        </button>

                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setEditingContact(null);
                                    setShowForm(true);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100/20 transition-all active:scale-95"
                            >
                                <Plus size={18} />
                                Tambah Kontak
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                    <button
                        onClick={() => setShowFilters(true)}
                        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(activeFilters).some(v => v !== '') ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                        <Filter size={18} />
                        {Object.values(activeFilters).some(v => v !== '') ? 'Filter Aktif' : 'Filter Lanjutan'}
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
                    }}
                    onReset={() => {
                        setActiveFilters({
                            group: '',
                            company: '',
                            tag: '',
                            dateFrom: '',
                            dateTo: ''
                        });
                    }}
                />

                {/* List Content */}
                <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm min-h-[400px] overflow-hidden">
                    <ContactList
                        contacts={contacts}
                        isAdmin={isAdmin}
                        groups={groups}
                        onEdit={isAdmin ? (contact) => {
                            setEditingContact(contact);
                            setShowForm(true);
                        } : null}
                        onDelete={isAdmin ? handleDeleteContact : null}
                    />
                </div>

                {/* Modal Form */}
                {showForm && isAdmin && (
                    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border dark:border-slate-800 animate-in zoom-in-95 duration-300">
                            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                                        {editingContact ? 'Perbarui Kontak' : 'Buat Entri Baru'}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Mohon berikan informasi kontak yang akurat.</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <X size={24} />
                                </button>
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
            </div>
        </NotemyLayout>
    );
}
