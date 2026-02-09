import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBarChart2, FiLogOut, FiClock } from 'react-icons/fi';
import clsx from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: FiHome, label: 'Dashboard' },
        { path: '/stats', icon: FiBarChart2, label: 'Statistics' },
        { path: '/tracker', icon: FiClock, label: 'Tracker' },
    ];

    return (
        <div className="min-h-screen bg-background text-white font-sans overflow-hidden flex relative">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px]" />

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-64 bg-surface/50 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-10"
            >
                <div className="mb-10 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-primary to-accent rounded-lg" />
                    <h1 className="text-2xl font-bold tracking-tight">TaskForge</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center font-bold text-sm">
                            {userInfo.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{userInfo.name}</p>
                            <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10 p-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
