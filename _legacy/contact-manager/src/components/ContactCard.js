import React from 'react';
import { Pencil, Trash2, Mail, Phone, Briefcase } from 'lucide-react';

function ContactCard({ contact, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">{contact.name}</h3>
                    {contact.company && (
                        <p className="text-sm text-gray-500 font-medium">{contact.company}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(contact)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(contact.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-5">
                <div className="flex items-center text-gray-600 text-sm">
                    <Mail size={16} className="mr-3 text-gray-400" />
                    <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition-colors">
                        {contact.email}
                    </a>
                </div>
                {contact.phone && (
                    <div className="flex items-center text-gray-600 text-sm">
                        <Phone size={16} className="mr-3 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="hover:text-blue-600 transition-colors">
                            {contact.phone}
                        </a>
                    </div>
                )}
                {contact.position && (
                    <div className="flex items-center text-gray-600 text-sm">
                        <Briefcase size={16} className="mr-3 text-gray-400" />
                        <span>{contact.position}</span>
                    </div>
                )}
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Notes */}
            {contact.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">{contact.notes}</p>
                </div>
            )}
        </div>
    );
}

export default ContactCard;
