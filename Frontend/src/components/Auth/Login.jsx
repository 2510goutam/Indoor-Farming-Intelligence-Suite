import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/auth/login', formData);
            console.log('Login response received:', response);

            if (response.token && response.user) {
                login(response.user, response.token);
                toast.success(`Welcome back, ${response.user.name}!`);
                navigate('/dashboard');
            } else {
                toast.error('Invalid response from server');
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-2xl space-y-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div className="text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-6 shadow-inner border border-primary-100 dark:border-primary-900/30 hover:scale-110 active:scale-95 transition-all group"
                    >
                        <LogIn className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:text-primary-500 transition-colors" />
                    </Link>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Sign in to manage your indoor farm</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
                            <input
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
                            <input
                                required
                                minLength="6"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                type="password"
                                placeholder="Password"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full grad-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold transition-colors">
                        Create One
                    </Link>
                </p>
            </div>
        </div>

    );
};

export default Login;
