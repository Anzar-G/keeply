import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, Briefcase, Tag, FileText, X, Check } from 'lucide-react';

const InputField = ({ label, icon: Icon, name, value, onChange, type = "text", placeholder, error, rows }) => (
    <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">
            <Icon size={12} className="text-slate-300 dark:text-slate-700" />
            {label}
            {(label === 'Nama' || label === 'Email') && <span className="text-rose-400">*</span>}
        </label>
        {rows ? (
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-4 transition-all font-medium text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm ${error ? 'border-rose-200 dark:border-rose-500/50 focus:ring-rose-500/10 focus:border-rose-400' : 'border-slate-100 dark:border-slate-800 focus:ring-indigo-500/10 focus:border-indigo-400'
                    }`}
                placeholder={placeholder}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:outline-none focus:ring-4 transition-all font-medium text-slate-600 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm ${error ? 'border-rose-200 dark:border-rose-500/50 focus:ring-rose-500/10 focus:border-rose-400' : 'border-slate-100 dark:border-slate-800 focus:ring-indigo-500/10 focus:border-indigo-400'
                    }`}
                placeholder={placeholder}
            />
        )}
        {error && <p className="text-rose-500 text-[10px] font-bold px-1 italic">{error}</p>}
    </div>
);

function ContactForm({ contact, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        tags: '',
        notes: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name || '',
                email: contact.email || '',
                phone: contact.phone || '',
                company: contact.company || '',
                position: contact.position || '',
                tags: contact.tags ? contact.tags.join(', ') : '',
                notes: contact.notes || '',
            });
        }
    }, [contact]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
        if (!formData.email.trim()) {
            newErrors.email = 'Alamat email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Mohon masukkan email yang valid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const dataToSubmit = {
                ...formData,
                tags: formData.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== ''),
            };
            onSubmit(dataToSubmit);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Nama" icon={User} name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Alexander Pierce" error={errors.name} />
                <InputField label="Email" icon={Mail} name="email" value={formData.email} onChange={handleChange} type="email" placeholder="alex@perusahaan.com" error={errors.email} />
                <InputField label="Telepon" icon={Phone} name="phone" value={formData.phone} onChange={handleChange} placeholder="+62 812-xxxx-xxxx" />
                <InputField label="Perusahaan" icon={Building2} name="company" value={formData.company} onChange={handleChange} placeholder="PT Maju Mundur" />
                <InputField label="Jabatan" icon={Briefcase} name="position" value={formData.position} onChange={handleChange} placeholder="Arsitek Sistem" />
                <InputField label="Tag" icon={Tag} name="tags" value={formData.tags} onChange={handleChange} placeholder="VIP, Engineering, Lead" />
            </div>

            <InputField label="Catatan Tambahan" icon={FileText} name="notes" value={formData.notes} onChange={handleChange} placeholder="Detail relevan tentang kontak ini..." rows={4} />

            <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 px-6 py-2.5 text-slate-400 dark:text-slate-500 font-bold text-sm hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    <X size={18} />
                    Batalkan Perubahan
                </button>
                <button
                    type="submit"
                    className="btn-primary flex items-center gap-2 px-8 py-3 rounded-2xl shadow-lg shadow-indigo-100/20"
                >
                    <Check size={18} />
                    {contact ? 'Perbarui Registri' : 'Simpan Entri'}
                </button>
            </div>
        </form>
    );
}

export default ContactForm;
