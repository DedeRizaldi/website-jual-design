import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderOpen,
    Package,
    ShoppingCart,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Redirect non-admin users to login
    React.useEffect(() => {
        if (!isAdmin && !user) {
            navigate('/login');
        }
    }, [isAdmin, user, navigate]);

    // Show access denied for non-admin authenticated users
    if (user && !isAdmin) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
                    <p className="text-slate-400 mb-4">You need admin privileges to access this page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    // Return null while redirecting
    if (!isAdmin) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Categories', path: '/admin/categories', icon: FolderOpen },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow bg-slate-900 border-r border-slate-800">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-4 border-b border-slate-800">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded bg-gradient-to-tr from-brand-600 to-neon-blue flex items-center justify-center">
                                <span className="text-white font-bold text-lg">7</span>
                            </div>
                            <span className="text-xl font-bold text-white">ARTINFINITY7</span>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive(item.path)
                                    ? 'bg-slate-800 text-brand-400'
                                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800/50 rounded-lg transition-all"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/80" onClick={() => setSidebarOpen(false)}>
                    <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col h-full">
                            {/* Logo */}
                            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded bg-gradient-to-tr from-brand-600 to-neon-blue flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">7</span>
                                    </div>
                                    <span className="text-xl font-bold text-white">ARTINFINITY7</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <nav className="flex-1 px-4 py-6 space-y-1">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive(item.path)
                                            ? 'bg-slate-800 text-brand-400'
                                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Logout Button */}
                            <div className="p-4 border-t border-slate-800">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800/50 rounded-lg transition-all"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="md:pl-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-slate-300 hover:text-white"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="flex-1 md:flex-none"></div>

                        {/* Admin Info */}
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-slate-400">{user?.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
