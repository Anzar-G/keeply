import React, { useState, useEffect } from 'react';
import ContactList from '../components/ContactList';
import ContactForm from '../components/ContactForm';
import { Plus, Search, Loader2 } from 'lucide-react';
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

    // Load contacts on mount
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
            // Replaced alert with toast
            toast.error('Failed to load contacts. Make sure backend is running.');
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
            if (error.message && error.message.includes('Email already exists')) {
                toast.error('Email already exists');
            } else {
                toast.error('Failed to add contact');
            }
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
                // Find contact name before deleting for notification
                const contactName = contacts.find(c => c.id === id)?.name || 'Unknown';

                await contactAPI.delete(id);
                setContacts((prev) => prev.filter((c) => c.id !== id));
                toast.success('Contact deleted successfully!');
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
                // Delete all selected contacts concurrently
                await Promise.all(ids.map(id => contactAPI.delete(id)));

                // Update local state
                setContacts((prev) => prev.filter((c) => !ids.includes(c.id)));
                toast.success('Selected contacts deleted successfully!');
                addNotification(`${ids.length} contacts deleted via bulk action`);
            } catch (error) {
                console.error('Error deleting contacts:', error);
                toast.error('Failed to delete some contacts');
            }
        }
    };

    // Filter contacts based on search
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                {isAdmin && (
                    <button
                        onClick={() => {
                            setEditingContact(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                        <Plus size={20} />
                        Add Contact
                    </button>
                )}
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <>
                    {/* Contact List */}
                    <ContactList
                        contacts={filteredContacts}
                        onEdit={isAdmin ? (contact) => {
                            setEditingContact(contact);
                            setShowForm(true);
                        } : null}
                        onDelete={isAdmin ? handleDeleteContact : null}
                        onBulkDelete={isAdmin ? handleBulkDelete : null}
                    />
                </>
            )}

            {/* Modal Form - Only for Admins */}
            {showForm && isAdmin && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingContact ? 'Edit Contact' : 'Add New Contact'}
                            </h2>
                        </div>
                        <div className="p-6">
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
