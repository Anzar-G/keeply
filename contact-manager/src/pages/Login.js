import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Loader2, Shield, Lock, Mail, Key } from 'lucide-react';
import toast from 'react-hot-toast';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            toast.success('Access granted. Welcome back.');
            navigate('/');
        } else {
            toast.error(result.error || 'Authentication failed');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-inter transition-colors duration-500">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="w-full max-w-lg relative z-10">
                {/* Brand Logo */}
                <div className="flex justify-center mb-12 animate-in fade-in zoom-in duration-700">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-2xl shadow-indigo-500/20 text-white">
                            <Shield size={28} fill="currentColor" />
                        </div>
                        <span className="font-extrabold text-3xl text-slate-900 dark:text-white tracking-tight">Keeply<span className="text-indigo-500">.</span></span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[40px] shadow-2xl p-10 md:p-14 animate-in slide-in-from-bottom-8 duration-700">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest mb-6">
                            <Lock size={12} />
                            Secure Access
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">Admin Portal</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Please authenticate to manage the registry</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 dark:text-slate-600 uppercase tracking-widest px-1">
                                <Mail size={12} />
                                Work Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 dark:text-slate-600 uppercase tracking-widest px-1">
                                <Key size={12} />
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all font-extrabold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    Enter Registry
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Footer */}
                    <div className="mt-12 flex flex-col items-center gap-4">
                        <div className="h-px w-12 bg-slate-200 dark:bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-600 uppercase tracking-widest mb-3">Audit Credentials</p>
                            <div className="flex items-center gap-4 text-xs font-bold px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                <span className="text-indigo-600 dark:text-indigo-400">admin@example.com</span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="text-slate-500 dark:text-slate-500">admin123</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Footer */}
                <p className="text-center mt-10 text-slate-500 dark:text-slate-600 text-xs font-medium tracking-tight italic">
                    Keeply Protocol v2.4.0 • Encrypted Management System
                </p>
            </div>
        </div>
    );
}

export default Login;
