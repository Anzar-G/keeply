import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, ArrowRight, AlertTriangle, Loader2, DownloadCloud } from 'lucide-react';
import Papa from 'papaparse';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

const ImportModal = ({ isOpen, onClose, onImportSuccess, groups }) => {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [mapping, setMapping] = useState({});
    const [importing, setImporting] = useState(false);

    const systemFields = [
        { key: 'name', label: 'Contact Name', required: true },
        { key: 'email', label: 'Email Address', required: true },
        { key: 'phone', label: 'Phone Number', required: false },
        { key: 'company', label: 'Company', required: false },
        { key: 'position', label: 'Job Position', required: false },
        { key: 'notes', label: 'Special Notes', required: false },
        { key: 'group_id', label: 'Group ID', required: false },
    ];

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setCsvData(results.data);
                    setHeaders(Object.keys(results.data[0]));

                    // Auto-mapping logic
                    const initialMapping = {};
                    const csvHeaders = Object.keys(results.data[0]);

                    systemFields.forEach(field => {
                        const match = csvHeaders.find(h =>
                            h.toLowerCase().includes(field.key.toLowerCase()) ||
                            h.toLowerCase().includes(field.label.toLowerCase())
                        );
                        if (match) initialMapping[field.key] = match;
                    });
                    setMapping(initialMapping);
                    setStep(2);
                }
            });
        }
    };

    const handleImport = async () => {
        const requiredFields = systemFields.filter(f => f.required).map(f => f.key);
        const missing = requiredFields.filter(f => !mapping[f]);

        if (missing.length > 0) {
            toast.error(`Please map required fields: ${missing.join(', ')}`);
            return;
        }

        try {
            setImporting(true);
            const formattedContacts = csvData.map(row => {
                const contact = {};
                Object.entries(mapping).forEach(([sysKey, csvKey]) => {
                    contact[sysKey] = row[csvKey];
                });
                return contact;
            });

            await contactAPI.bulkCreate(formattedContacts);
            toast.success(`Successfully imported ${formattedContacts.length} contacts`);
            onImportSuccess();
            onClose();
        } catch (error) {
            console.error('Import failed:', error);
            toast.error(error.response?.data?.error || 'Failed to import contacts');
        } finally {
            setImporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden scale-in-center border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Import Intelligence</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Transform your CSV data into professional registry entries.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                    {/* Step 1: Upload */}
                    <div className={step !== 1 ? 'opacity-50 pointer-events-none' : ''}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-200">1</div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Registry Source</h3>
                        </div>

                        {!file ? (
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-slate-50/50 dark:bg-slate-800/20 hover:bg-indigo-50/30 hover:border-indigo-400 transition-all cursor-pointer group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="text-indigo-600" size={32} />
                                    </div>
                                    <p className="mb-2 text-sm font-bold text-slate-900 dark:text-white">Click to upload or drag and drop</p>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Strictly CSV formats only</p>
                                </div>
                                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                            </label>
                        ) : (
                            <div className="flex items-center gap-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-6 rounded-2xl">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                    <FileText className="text-emerald-500" size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                                    <p className="text-xs text-slate-400 font-medium">{(file.size / 1024).toFixed(1)} KB • {csvData.length} records detected</p>
                                </div>
                                <CheckCircle className="text-emerald-500" size={24} />
                                <button onClick={() => { setFile(null); setStep(1); }} className="text-xs font-bold text-indigo-600 hover:underline px-4">Change File</button>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Mapping */}
                    {step >= 2 && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-200">2</div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Field Orchestration</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">System Schema</h4>
                                    <div className="space-y-3">
                                        {systemFields.map(field => (
                                            <div key={field.key} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:border-indigo-200 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-2 h-2 rounded-full ${mapping[field.key] ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{field.label} {field.required && <span className="text-rose-500">*</span>}</span>
                                                </div>
                                                <div className="flex items-center gap-3 flex-1 justify-end ml-4 max-w-[240px]">
                                                    <ArrowRight size={16} className="text-slate-300" />
                                                    <select
                                                        value={mapping[field.key] || ''}
                                                        onChange={(e) => setMapping(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                        className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 py-2"
                                                    >
                                                        <option value="">Select Column...</option>
                                                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Data Integrity Preview</h4>
                                    <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden min-h-[300px]">
                                        <table className="w-full text-left text-[11px]">
                                            <thead className="bg-white/50 dark:bg-slate-900/50">
                                                <tr>
                                                    {systemFields.map(f => (
                                                        <th key={f.key} className="px-4 py-3 font-bold text-slate-400 uppercase tracking-tighter border-b border-slate-100 dark:border-slate-800">
                                                            {f.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {csvData.slice(0, 5).map((row, i) => (
                                                    <tr key={i} className="hover:bg-white dark:hover:bg-slate-900 transition-colors">
                                                        {systemFields.map(f => (
                                                            <td key={f.key} className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                                                                {row[mapping[f.key]] || <span className="text-slate-300 italic">null</span>}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="p-6 text-center">
                                            <p className="text-[10px] font-bold text-slate-400 italic">Displaying algorithmic projection of the first 5 entries.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/50 sticky bottom-0 z-10">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <span>Unmapped fields will be bypassed by the ingestion engine.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Abort Mission
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={step < 2 || importing}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 active:scale-95"
                        >
                            {importing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Ingesting Data...
                                </>
                            ) : (
                                <>
                                    Commit {csvData.length} Records
                                    <DownloadCloud size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
