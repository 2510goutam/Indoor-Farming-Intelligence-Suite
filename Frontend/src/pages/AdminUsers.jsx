import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { Users, Search, Mail, Shield, UserCheck, Loader2, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await api.get('/api/admin/users');
            setUsers(data);
        } catch (error) { } finally {
            setLoading(false);
        }
    };



    const handleDelete = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            try {
                await api.delete(`/api/admin/users/${userId}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Oversee and manage all registered users in the system.</p>
                </header>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl mb-8 flex items-center gap-4 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-2" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    />
                </div>

                {loading ? <div className="h-40 flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div> : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-8 py-5">User</th>
                                    <th className="px-8 py-5">Role</th>
                                    <th className="px-8 py-5">Verified</th>
                                    <th className="px-8 py-5">Registered</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-black shadow-sm border border-primary-100 dark:border-primary-900/30">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white text-sm">{u.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${getRoleStyle(u.role)}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {u.verified ? (
                                                <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                                                    <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
                                                    <Shield className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDelete(u.id, u.name)}
                                                    className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}


            </main>
        </div>
    );
};

const getRoleStyle = (role) => {
    switch (role) {
        case 'ADMIN': return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
        case 'VENDOR': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
        case 'SUBSCRIBED_USER': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30';
        case 'SUBSCRIBED_VENDOR': return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30';
        default: return 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800';
    }
}

export default AdminUsers;
