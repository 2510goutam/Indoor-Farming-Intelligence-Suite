import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Layout/Navbar';

const Contact = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success("Message sent! We'll get back to you soon.");
            setLoading(false);
            e.target.reset();
        }, 1000);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Navbar />

            <main className="pt-32 px-8 max-w-6xl mx-auto pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight">Get in <br />Touch</h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed font-medium">
                            Have questions about setting up your farm? Our experts are here to help you grow.
                        </p>

                        <div className="space-y-8">
                            <ContactInfo icon={Mail} title="Email Us" value="support@farming-suite.com" />
                            <ContactInfo icon={Phone} title="Call Us" value="+91 9685274837" />
                            <ContactInfo icon={MapPin} title="Visit Us" value="CBD Belapur, Kharghar, Navi Mumbai" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <Input label="First Name" placeholder="Goutam" />
                                <Input label="Last Name" placeholder="Soni" />
                            </div>
                            <Input label="Email Address" type="email" placeholder="goutam@example.com" />
                            <div>
                                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Message</label>
                                <textarea
                                    rows="5"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none text-slate-700 dark:text-slate-200 font-bold shadow-inner"
                                    placeholder="How can we help you?"
                                    required
                                ></textarea>
                            </div>
                            <button
                                disabled={loading}
                                className="w-full grad-primary py-5 rounded-[24px] font-black text-white text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-primary-500/20"
                            >
                                {loading ? "Sending..." : <>Send Message <Send className="w-6 h-6" /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

const ContactInfo = ({ icon: Icon, title, value }) => (
    <div className="flex gap-6 items-center group">
        <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none group-hover:shadow-primary-500/10 transition-all">
            <Icon className="text-primary-600 dark:text-primary-400 w-6 h-6" />
        </div>
        <div>
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</h3>
            <p className="text-lg font-black text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{label}</label>
        <input
            {...props}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner"
            required
        />
    </div>
);

export default Contact;
