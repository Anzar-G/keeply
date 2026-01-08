import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import { Loader2 } from 'lucide-react';


function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Route */}
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/"
                            element={
                                <Layout>
                                    <Contacts />
                                </Layout>
                            }
                        />

                        <Route
                            path="/dashboard"
                            element={
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
