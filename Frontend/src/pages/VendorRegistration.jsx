import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import { UserPlus, Building2, MapPin, Briefcase, FileText, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const VendorRegistration = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [formData, setFormData] = useState({
        shopName: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        gstNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/vendor/apply', formData);
            setSuccess(true);
            toast.success("Application submitted successfully!");
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none text-center max-w-lg">
                    <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-100 dark:border-amber-900/30 shadow-sm">
                        <CheckCircle2 className="text-amber-600 dark:text-amber-400 w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Request Submitted!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-8">
                        Your vendor application has been submitted successfully. An <span className="text-primary-600 dark:text-primary-400 font-black">admin will review</span> your request shortly. You'll be notified once your application is <span className="text-slate-900 dark:text-white font-black">approved</span>.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="grad-primary px-10 py-5 rounded-2xl font-black text-white text-lg hover:scale-[1.05] transition-all shadow-xl shadow-primary-500/20"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="mb-10 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Join Our Marketplace</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Become a verified vendor to sell seeds, equipment, and innovative farming solutions directly to our community.</p>
                </header>

                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-12 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 dark:bg-primary-900/10 blur-[100px] -z-10" />

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="Store/Business Name"
                                icon={Building2}
                                value={formData.shopName}
                                onChange={e => setFormData({ ...formData, shopName: e.target.value })}
                                placeholder="Green Seeds Co."
                            />
                            <Input
                                label="GST Number"
                                icon={ShieldCheck}
                                value={formData.gstNumber}
                                onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                                placeholder="22AAAAA0000A1Z5"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="Contact Email"
                                type="email"
                                icon={Briefcase}
                                value={formData.contactEmail}
                                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                placeholder="sales@greenseeds.com"
                            />
                            <Input
                                label="Contact Phone"
                                icon={Briefcase}
                                value={formData.contactPhone}
                                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                placeholder="+91 9234567890"
                            />
                        </div>

                        <div className="grid grid-cols-1">
                            <Input
                                label="Full Store Address"
                                icon={MapPin}
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 Indore, MP"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Store Description</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 w-5 h-5 pointer-events-none" />
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl py-4 pl-12 pr-6 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none h-32 text-slate-700 dark:text-slate-200 font-bold shadow-inner"
                                    placeholder="Tell us about your products and services..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full grad-primary py-5 rounded-[24px] font-black text-white text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-primary-500/20"
                        >
                            {loading ? "Submitting..." : <>Submit Application <Send className="w-6 h-6" /></>}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

const Input = ({ label, icon: Icon, value, onChange, ...props }) => (
    <div>
        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 pointer-events-none" />
            <input
                {...props}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner"
                required
            />
        </div>
    </div>
);

export default VendorRegistration;
