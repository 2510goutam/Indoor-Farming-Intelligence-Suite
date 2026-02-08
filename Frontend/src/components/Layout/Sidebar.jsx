import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Thermometer,
    Store,
    Package,
    ShieldCheck,
    Users,
    Settings,
    LogOut,
    Leaf,
    MessageCircle,
    ShoppingCart,
    UserPlus,
    ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../Common/ThemeToggle';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const role = user?.role;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['REGISTERED_USER', 'SUBSCRIBED_USER', 'VENDOR', 'ADMIN', 'SUBSCRIBED_VENDOR'] },
        { icon: ClipboardCheck, label: 'Setup Advisor', path: '/pre-setup-advisor', roles: ['REGISTERED_USER', 'SUBSCRIBED_USER', 'VENDOR', 'SUBSCRIBED_VENDOR'] },
        { icon: Thermometer, label: 'Environment', path: '/environment', roles: ['REGISTERED_USER', 'SUBSCRIBED_USER', 'VENDOR', 'SUBSCRIBED_VENDOR'] },
        { icon: MessageSquare, label: 'Chat Assistant', path: '/consultation', roles: ['ADMIN'] },
        { icon: Store, label: 'Marketplace', path: '/marketplace', roles: ['REGISTERED_USER', 'SUBSCRIBED_USER', 'VENDOR', 'SUBSCRIBED_VENDOR'] },
        { icon: ShoppingCart, label: 'My Cart', path: '/cart', roles: ['REGISTERED_USER', 'SUBSCRIBED_USER', 'VENDOR', 'SUBSCRIBED_VENDOR'] },
        { icon: Package, label: role === 'ADMIN' ? 'Total Products' : 'My Products', path: '/my-products', roles: ['VENDOR', 'ADMIN', 'SUBSCRIBED_VENDOR'] },
        { icon: Leaf, label: role === 'ADMIN' ? 'Total Crops' : 'Crop Listings', path: '/my-listings', roles: ['SUBSCRIBED_USER', 'ADMIN', 'SUBSCRIBED_VENDOR'] },
        { icon: UserPlus, label: 'Become Vendor', path: '/vendor-register', roles: ['REGISTERED_USER', 'SUBSCRIBED_USER'] },
        { icon: MessageCircle, label: 'Feedback', path: '/feedback', roles: ['REGISTERED_USER', 'SUBSCRIBED_USER', 'VENDOR', 'ADMIN', 'SUBSCRIBED_VENDOR'] },
        { icon: Users, label: 'Manage Users', path: '/admin/users', roles: ['ADMIN'] },
        { icon: ShieldCheck, label: 'Approvals', path: '/admin/approvals', roles: [] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(role));

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 h-screen fixed left-0 top-0 flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 grad-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Leaf className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">Farming<br /><span className="text-primary-600">Suite</span></h1>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto font-medium">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                            ${isActive
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm border border-primary-100 dark:border-primary-900/30'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary-600 dark:hover:text-primary-400'}
                        `}
                    >
                        <item.icon className={`w-5 h-5 ${item.path === window.location.pathname ? 'text-primary-600' : ''}`} />
                        <span className="text-sm">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                    onClick={logout}
                    className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
