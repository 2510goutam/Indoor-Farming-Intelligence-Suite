import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { Thermometer, Droplets, Sun, Wind, Send, History, Loader2, Sparkles, Lock, CreditCard, ArrowRight, CheckCircle2, Trash2 } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { sendMessage } from '../services/n8nService';
import toast from 'react-hot-toast';

const Environment = () => {
    const { user, login } = useAuth();
    const [readings, setReadings] = useState({
        cropType: '',
        temperature: '',
        humidity: '',
        moisture: '',
        lightIntensity: ''
    });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [processing, setProcessing] = useState(false);

    const isSubscribed = user?.role === 'SUBSCRIBED_USER' || user?.role === 'ADMIN' || user?.role === 'SUBSCRIBED_VENDOR';

    useEffect(() => {
        if (isSubscribed) {
            fetchHistory();
        } else {
            setFetching(false);
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, [isSubscribed]);

    const fetchHistory = async () => {
        try {
            const data = await api.get('/api/environment');
            setHistory(data);
        } catch (error) {
        } finally {
            setFetching(false);
        }
    };

    const handleSubscription = async () => {
        setProcessing(true);
        try {
            const orderRequest = {
                amount: 999,
                currency: 'INR',
                orderType: 'SUBSCRIPTION'
            };

            const orderData = await api.post('/api/payment/create-order', orderRequest);

            const cleanPhone = (user?.mobileNumber || '').replace(/\D/g, '');

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Indoor Farming Suite',
                description: 'Pro Subscription',
                order_id: orderData.razorpayOrderId,
                handler: async (response) => {
                    try {
                        const verifiedData = await api.post(`/api/payment/verify-subscription?razorpayOrderId=${response.razorpay_order_id}&razorpayPaymentId=${response.razorpay_payment_id}&razorpaySignature=${response.razorpay_signature}&planId=1`);
                        toast.success("Subscription Activated!");

                        if (verifiedData.token && verifiedData.user) {
                            login(verifiedData.user, verifiedData.token);
                        }

                        window.location.reload();
                    } catch (error) {
                        toast.error("Subscription verification failed.");
                    }
                },
                prefill: {
                    name: user?.name || 'Customer',
                    email: user?.email || 'customer@example.com',
                    contact: cleanPhone
                },
                theme: { color: '#22c55e' }
            };

            console.log("Razorpay Subscription Options:", options);
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error("Payment failed: " + response.error.description);
            });
            rzp.open();
        } catch (error) {
            toast.error("Failed to initiate subscription.");
        } finally {
            setProcessing(false);
        }
    };

    const handleChange = (e) => {
        setReadings({ ...readings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const contextPrefix = `CONTEXT: You are an environmental monitoring AI for indoor farming. Analyze these readings for ${readings.cropType || 'general crops'} and provide BRIEF, ACTIONABLE suggestions (2-3 sentences maximum).

CROP: ${readings.cropType || 'Not specified'}
READINGS:
- Temperature: ${readings.temperature}°C
- Humidity: ${readings.humidity}%
- Moisture: ${readings.moisture}%
- Light Intensity: ${readings.lightIntensity} Lux

Provide ONLY specific actions to optimize these conditions for this crop. Be concise. All currency should be in Indian Rupees (₹).`;

            const aiSuggestion = await sendMessage(contextPrefix);

            const dataToSave = {
                ...readings,
                aiSuggestion: aiSuggestion || 'No suggestions available at this time.'
            };

            const response = await api.post('/api/environment', dataToSave);
            toast.success('Record saved and analyzed!');
            setHistory([response, ...history]);
            setReadings({ cropType: '', temperature: '', humidity: '', moisture: '', lightIntensity: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to save record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await api.delete(`/api/environment/${id}`);
            setHistory(history.filter(record => record.id !== id));
            toast.success('Record deleted');
        } catch (error) {
            toast.error('Failed to delete record');
        }
    };

    if (!isSubscribed) return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none text-center max-w-xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-50 dark:bg-primary-900/20 blur-[100px] -z-10" />

                    <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-100 dark:border-amber-900/30 shadow-sm">
                        <Lock className="text-amber-600 dark:text-amber-400 w-10 h-10" />
                    </div>

                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Unlock AI Insights</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-10">
                        Get real-time environmental suggestions powered by n8n AI. Optimize your crop growth with professional-grade analysis.
                    </p>

                    <div className="space-y-4 mb-10 text-left bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <Benefit text="Continuous monitoring history" />
                        <Benefit text="AI-driven optimization suggestions" />
                        <Benefit text="Advanced nutrient tracking" />
                        <Benefit text="Priority support for crop anomalies" />
                    </div>

                    <button
                        onClick={handleSubscription}
                        disabled={processing}
                        className="w-full grad-primary py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-white shadow-xl shadow-primary-500/20"
                    >
                        {processing ? <Loader2 className="animate-spin" /> : <>Upgrade to Pro • ₹999 <ArrowRight className="w-6 h-6" /></>}
                    </button>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 flex items-center justify-center gap-2 font-bold uppercase tracking-wider">
                        <CreditCard className="w-3 h-3" /> Secure payment via Razorpay
                    </p>
                </div>
            </main>
        </div>
    );

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Environmental Management</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Monitor and optimize your farm's vital signs.</p>
                    </div>
                    <div className="px-5 py-2.5 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30 rounded-xl flex items-center gap-2 shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-xs font-black text-primary-700 dark:text-primary-400 uppercase tracking-widest">AI Pro Enabled</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl space-y-8 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 grad-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <Send className="text-white w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Log New Readings</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-2 group">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    Crop Type
                                </label>
                                <input
                                    name="cropType"
                                    value={readings.cropType}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Mushrooms, Lettuce, Tomatoes"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner"
                                />
                            </div>
                            <InputGroup
                                icon={Thermometer}
                                label="Temperature (°C)"
                                name="temperature"
                                value={readings.temperature}
                                onChange={handleChange}
                                placeholder="e.g. 24.5"
                                color="text-red-500 dark:text-red-400"
                            />
                            <InputGroup
                                icon={Droplets}
                                label="Humidity (%)"
                                name="humidity"
                                value={readings.humidity}
                                onChange={handleChange}
                                placeholder="e.g. 65"
                                color="text-blue-500 dark:text-blue-400"
                            />
                            <InputGroup
                                icon={Wind}
                                label="Moisture (%)"
                                name="moisture"
                                value={readings.moisture}
                                onChange={handleChange}
                                placeholder="e.g. 70"
                                color="text-cyan-500 dark:text-cyan-400"
                            />
                            <InputGroup
                                icon={Sun}
                                label="Light (Lux)"
                                name="lightIntensity"
                                value={readings.lightIntensity}
                                onChange={handleChange}
                                placeholder="e.g. 25000"
                                color="text-amber-500 dark:text-amber-400"
                            />

                            <button
                                disabled={loading}
                                type="submit"
                                className="col-span-2 grad-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all disabled:opacity-50 mt-4"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Save & Get AI Insights
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl flex flex-col border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <History className="text-slate-400 dark:text-slate-500 w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Recent Logs</h3>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-hide">
                            {fetching ? (
                                <div className="h-40 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="h-40 flex items-center justify-center text-slate-300 dark:text-slate-700 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl font-bold uppercase tracking-widest text-xs">
                                    No records found
                                </div>
                            ) : (
                                history.map((record) => (
                                    <div key={record.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-100 dark:hover:border-primary-500/50 transition-colors shadow-sm relative group">
                                        <button
                                            onClick={() => handleDelete(record.id)}
                                            className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-900 text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 bg-primary-100/30 dark:bg-primary-900/40 px-2 py-0.5 rounded uppercase tracking-wider w-fit">
                                                        {record.cropType || 'General'}
                                                    </span>
                                                    <div className="grid grid-cols-4 gap-4 mt-2">
                                                        <MiniStat value={`${record.temperature}°C`} label="Temp" color="text-red-500 dark:text-red-400" />
                                                        <MiniStat value={`${record.humidity}%`} label="Hum" color="text-blue-500 dark:text-blue-400" />
                                                        <MiniStat value={`${record.moisture}%`} label="Moist" color="text-cyan-500 dark:text-cyan-400" />
                                                        <MiniStat value={`${record.lightIntensity}`} label="Lux" color="text-amber-500 dark:text-amber-400" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest px-2 py-1 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                                                    {new Date(record.recordedAt).toLocaleString()}
                                                </span>
                                            </div>

                                            {record.aiSuggestion && (
                                                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-900/30">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Sparkles className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                                                        <span className="text-[10px] font-black text-primary-700 dark:text-primary-400 uppercase tracking-widest">AI Analysis</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic font-medium">"{record.aiSuggestion}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};


const Benefit = ({ text }) => (
    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
        <div className="w-6 h-6 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center shrink-0 border border-primary-100 dark:border-primary-900/30 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
        </div>
        <span className="text-sm font-bold">{text}</span>
    </div>
);

const InputGroup = ({ icon: Icon, label, color, ...props }) => (
    <div className="space-y-2 group">
        <label className="text-xs font-black text-slate-400 dark:text-slate-500 flex items-center gap-2 uppercase tracking-widest">
            <Icon className={`w-4 h-4 ${color}`} />
            {label}
        </label>
        <input
            {...props}
            type="number"
            step="0.1"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner"
        />
    </div>
);

const MiniStat = ({ value, label, color }) => (
    <div>
        <p className={`text-base font-black ${color}`}>{value}</p>
        <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mt-0.5">{label}</p>
    </div>
);


export default Environment;
