import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Activities from './pages/Activities';
import Login from './pages/Login';
import { Loader2 } from 'lucide-react';

// Protected Route by Role
function RoleRoute({ children, role }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-sm font-bold text-slate-400 animate-pulse tracking-widest uppercase">Securing Session...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NotificationProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Layout><Contacts /></Layout>} />
                            <Route
                                path="/contacts/:id"
                                element={
                                    <RoleRoute role="admin">
                                        <Layout>
                                            <ContactDetail />
                                        </Layout>
                                    </RoleRoute>
                                }
                            />
                            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

                            {/* Admin Only Routes */}
                            <Route
                                path="/activities"
                                element={
                                    <RoleRoute role="admin">
                                        <Layout>
                                            <Activities />
                                        </Layout>
                                    </RoleRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </NotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
