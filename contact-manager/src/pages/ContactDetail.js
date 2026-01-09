import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Phone,
    Building2,
    User,
    Calendar,
    Clock,
    Plus,
    MessageSquare,
    History,
    Loader2,
    Save,
    Tag,
    Briefcase
} from 'lucide-react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

const ContactDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contact, setContact] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' or 'notes'

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [contactData, timelineData, notesData] = await Promise.all([
                contactAPI.getById(id),
                contactAPI.getTimeline(id),
                contactAPI.getNotes(id)
            ]);
            setContact(contactData);
            setTimeline(timelineData);
            setNotes(notesData);
        } catch (error) {
            console.error('Error fetching contact details:', error);
            toast.error('Failed to load contact records.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        try {
            setSubmitting(true);
            const addedNote = await contactAPI.addNote(id, newNote);
            setNotes(prev => [addedNote, ...prev]);
            setTimeline(prev => [
                { ...addedNote, type: 'note', actor_name: addedNote.creator_name },
                ...prev
            ]);
            setNewNote('');
            toast.success('Reflection recorded.');
        } catch (error) {
            toast.error('Failed to save note.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-bold tracking-tight">Accessing encrypted archives...</p>
                </div>
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 font-bold">Entry not found in the registry.</p>
                <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-bold hover:underline">
                    Return to Registry
                </button>
            </div>
        );
    }

    const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigation & Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{contact.name}</h1>
                        {contact.group && (
                            <span
                                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                                style={{ backgroundColor: contact.group.color }}
                            >
                                {contact.group.name}
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 font-medium italic">Detailed intelligence profile and interaction history.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar: Contact Overview */}
                <div className="space-y-6">
                    <div className="premium-card p-8">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="h-24 w-24 rounded-3xl bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 font-black text-3xl mb-4">
                                {initials}
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900">{contact.name}</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{contact.position || 'Professional Contact'}</p>
                        </div>

                        <div className="space-y-6 border-t border-slate-50 pt-8 text-sm">
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex items-center justify-center shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-0.5">Primary Email</p>
                                    <p className="font-bold text-slate-700 truncate">{contact.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex items-center justify-center shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-0.5">Contact Line</p>
                                    <p className="font-bold text-slate-700">{contact.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors flex items-center justify-center shrink-0">
                                    <Building2 size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-0.5">Organization</p>
                                    <p className="font-bold text-slate-700">{contact.company || 'Private Entity'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-6 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Metadata Visualization</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Tag size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">Tags</span>
                                </div>
                                <div className="flex gap-1">
                                    {contact.tags.map((t, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-white text-[9px] font-black uppercase text-indigo-600 rounded border border-indigo-100">{t}</span>
                                    ))}
                                    {contact.tags.length === 0 && <span className="text-[10px] text-slate-400 italic">None</span>}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold text-slate-600">Created</span>
                                </div>
                                <span className="text-xs font-bold text-slate-500">{new Date(contact.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content Area: Timeline & Notes */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs Navigation */}
                    <div className="premium-card p-1 flex gap-1">
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'timeline'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <History size={16} />
                            Relationship Timeline
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'notes'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <MessageSquare size={16} />
                            Reflection Notes ({notes.length})
                        </button>
                    </div>

                    {/* Tab Panels */}
                    <div className="min-h-[500px]">
                        {activeTab === 'timeline' ? (
                            <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3.5 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200">
                                {timeline.map((item, i) => (
                                    <div key={i} className="relative group">
                                        {/* Timeline Node */}
                                        <div className={`absolute -left-8 top-1.5 w-7 h-7 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 ${item.type === 'note' ? 'bg-amber-400 text-white' : 'bg-indigo-500 text-white'
                                            }`}>
                                            {item.type === 'note' ? <Plus size={12} /> : <History size={12} />}
                                        </div>

                                        <div className="premium-card p-5 hover:border-indigo-200 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">
                                                        {new Date(item.created_at).toLocaleString()}
                                                    </span>
                                                    <h4 className="text-sm font-extrabold text-slate-900 capitalize">
                                                        {item.type === 'note' ? 'New Contact Reflection' : item.action.replace('_', ' ').toLowerCase()}
                                                    </h4>
                                                </div>
                                                <div className="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded border border-slate-100 flex items-center gap-1">
                                                    <User size={10} />
                                                    {item.actor_name || 'System'}
                                                </div>
                                            </div>

                                            {item.type === 'note' ? (
                                                <div className="mt-3 p-3 bg-amber-50/30 border-l-4 border-amber-300 rounded text-sm text-slate-600 font-medium italic">
                                                    "{item.content}"
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500 font-medium">
                                                    Performed via {item.details?.source || 'Registry System'}.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {timeline.length === 0 && (
                                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                                        <p className="text-slate-400 font-bold italic">No interaction history found for this entity.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                {/* Add Note Form */}
                                <div className="premium-card p-6 border-2 border-indigo-100 shadow-indigo-50">
                                    <form onSubmit={handleAddNote}>
                                        <textarea
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="Capture a private reflection or strategic note about this contact..."
                                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 min-h-[120px] transition-all resize-none mb-4"
                                        ></textarea>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={submitting || !newNote.trim()}
                                                className="btn-primary"
                                            >
                                                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                                Save Reflection
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Notes List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {notes.map((note, i) => (
                                        <div key={i} className="premium-card p-6 relative group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                    <MessageSquare size={16} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                    {new Date(note.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                {note.content}
                                            </p>
                                            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-md bg-slate-900 text-white text-[9px] font-black flex items-center justify-center">
                                                    {note.creator_name ? note.creator_name[0].toUpperCase() : 'S'}
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Recorded by {note.creator_name || 'System'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {notes.length === 0 && (
                                        <div className="md:col-span-2 text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                                            <p className="text-slate-400 font-bold italic">No personal notes have been recorded yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactDetail;
