import React, { useState, useEffect } from 'react';
import ContactList from '../components/ContactList';
import ContactForm from '../components/ContactForm';
import { Plus, Search, Loader2, Users, Filter, Download } from 'lucide-react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const { addNotification } = useNotification();
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            setLoading(true);
            const data = await contactAPI.getAll();
            setContacts(data);
        } catch (error) {
            console.error('Error loading contacts:', error);
            toast.error('Failed to load contacts.');
        } finally {
            setLoading(false);
        }
    };

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

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Synchronizing contact registry...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Registry</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Manage and organize your professional network with precision.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <Download size={18} />
                        Export
                    </button>
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
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                    />
                </div>
                <button className="btn-secondary flex items-center gap-2 border-slate-200 px-6">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* List Content */}
            <div className="premium-card min-h-[400px]">
                <ContactList
                    contacts={filteredContacts}
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
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scale-in-center">
                        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900">
                                    {editingContact ? 'Refine Contact' : 'Create New Entry'}
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">Please provide accurate contact information.</p>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={() => setShowForm(false)}>
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
        </div>
    );
}

export default Contacts;
