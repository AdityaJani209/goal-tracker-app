import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { GoalProvider } from './contexts/GoalContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import GoalDetail from './pages/GoalDetail';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import { useAuth } from './contexts/AuthContext';

const AppContent = () => {
    const { isAuthenticated } = useAuth();    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Toaster position="top-right" />

            {isAuthenticated ? (
                <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <Navbar />
                        <main className="flex-1 overflow-y-auto p-6">
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/goals" element={
                                    <ProtectedRoute>
                                        <Goals />
                                    </ProtectedRoute>
                                } />
                                <Route path="/goals/:id" element={
                                    <ProtectedRoute>
                                        <GoalDetail />
                                    </ProtectedRoute>
                                } />
                                <Route path="/analytics" element={
                                    <ProtectedRoute>
                                        <Analytics />
                                    </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } />
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            ) : (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            )}
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <GoalProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </GoalProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
