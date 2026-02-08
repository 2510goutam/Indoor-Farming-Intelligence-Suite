import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 w-full z-50 glass dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 grad-primary rounded-xl flex items-center justify-center">
                    <Leaf className="text-white w-6 h-6" />
                </div>
                <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Indoor Farming <span className="text-primary-600">Suite</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                <Link
                    to="/"
                    className={`${isActive('/') ? 'text-slate-900 dark:text-white border-b-2 border-primary-500' : 'hover:text-primary-600 dark:hover:text-primary-400'} transition-colors py-1`}
                >
                    Home
                </Link>
                <Link
                    to="/about"
                    className={`${isActive('/about') ? 'text-slate-900 dark:text-white border-b-2 border-primary-500' : 'hover:text-primary-600 dark:hover:text-primary-400'} transition-colors py-1`}
                >
                    About Us
                </Link>
                <Link
                    to="/contact"
                    className={`${isActive('/contact') ? 'text-slate-900 dark:text-white border-b-2 border-primary-500' : 'hover:text-primary-600 dark:hover:text-primary-400'} transition-colors py-1`}
                >
                    Contact
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <Link to="/dashboard" className="grad-primary px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all text-white">
                        <LayoutDashboard className="w-4 h-4" />
                        Go to Dashboard
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="grad-primary px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all text-white">
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
