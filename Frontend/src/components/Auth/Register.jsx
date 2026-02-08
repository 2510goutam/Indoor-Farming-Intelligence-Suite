import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/api/auth/register', formData);

            const successMessage = response?.message || response;
            toast.success(successMessage);

            navigate('/verify-otp', {
                state: {
                    email: formData.email,
                    registrationData: formData
                }
            });
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
                        <User className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:text-primary-500 transition-colors" />
                    </Link>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Join the Suite</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Start your indoor farming journey today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
                            <input
                                required
                                minLength="5"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text"
                                placeholder="Full Name (Min 5 characters)"
                                title="Name must be at least 5 characters long"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
                            <input
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
                            <input
                                required
                                pattern="^[6789]\d{9}$"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                type="tel"
                                placeholder="Mobile Number (10 digits)"
                                title="Please enter a valid Indian mobile number starting with 6-9"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
                            <input
                                required
                                pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                type="password"
                                placeholder="Password"
                                title="Password must be at least 6 characters long and contain at least one uppercase letter, one digit, and one special character"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200 font-medium"
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
                                Send OTP
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>

    );
};

export default Register;
