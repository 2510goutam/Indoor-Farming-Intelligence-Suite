import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const registrationData = location.state?.registrationData;

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/api/auth/verify-otp', {
                email: email,
                otp: otp
            });
            toast.success('Account verified successfully! Please login.');

            navigate('/login');
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-2xl space-y-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-6 shadow-sm border border-primary-100 dark:border-primary-900/30">
                        <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Verify Email</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        We've sent a 6-digit code to <br />
                        <span className="text-primary-600 dark:text-primary-400 font-bold">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <input
                            required
                            type="text"
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 text-center text-3xl tracking-[0.5em] font-mono focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all placeholder:text-[14px] placeholder:tracking-normal placeholder:font-sans text-slate-900 dark:text-white font-black shadow-inner"
                        />
                    </div>

                    <button
                        disabled={loading || otp.length !== 6}
                        type="submit"
                        className="w-full grad-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 group shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Verify & Register
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => navigate('/register')}
                        className="text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold text-sm transition-colors"
                    >
                        Wait, I used the wrong email
                    </button>
                </div>
            </div>
        </div>

    );
};

export default OTPVerification;
