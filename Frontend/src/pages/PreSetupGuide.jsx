import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { Send, Bot, User, Loader2, Sparkles, ClipboardCheck, Ruler, DollarSign, Lightbulb, Lock, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { sendMessage } from '../services/n8nService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PreSetupGuide = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const isSubscribed = user?.role === 'REGISTERED_USER' || user?.role === 'SUBSCRIBED_USER' || user?.role === 'ADMIN' || user?.role === 'VENDOR' || user?.role === 'SUBSCRIBED_VENDOR';


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

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
                        await api.post(`/api/payment/verify-subscription?razorpayOrderId=${response.razorpay_order_id}&razorpayPaymentId=${response.razorpay_payment_id}&razorpaySignature=${response.razorpay_signature}&planId=1`);
                        toast.success("Subscription Activated!");
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

    const handleSend = async (e) => {
        e.preventDefault();
        const query = typeof e === 'string' ? e : input;
        if (!query.trim()) return;

        const userMessage = { role: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        if (typeof e !== 'string') setInput('');
        setLoading(true);

        try {
            const contextPrefix = "CONTEXT: You are an indoor farming pre-setup advisor. Answer questions BRIEFLY and DIRECTLY. Focus only on what the user asked. Keep responses SHORT (2-3 sentences maximum). No lengthy explanations unless specifically requested. ALL CURRENCY MUST BE IN INDIAN RUPEES (₹), never use dollars or other currencies.\n\nQUERY: ";
            const aiResponse = await sendMessage(contextPrefix + query);

            const aiMessage = {
                role: 'bot',
                content: aiResponse || 'I am specialized in setup requirements. Could you please specify your available area or budget?'
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            setMessages(prev => prev.slice(0, -1));
            if (typeof e !== 'string') setInput(query);
        } finally {
            setLoading(false);
        }
    };

    if (!isSubscribed) return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none text-center max-w-xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary-50 dark:bg-primary-900/10 blur-[100px] -z-10" />
                    <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-100 dark:border-amber-900/30 shadow-sm">
                        <Lock className="text-amber-600 dark:text-amber-400 w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Pre-Setup Guide</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-10">
                        Plan your infrastructure and budget with expert precision. Unlock the advisor to get detailed setup requirements.
                    </p>
                    <div className="space-y-4 mb-10 text-left bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                        <Benefit text="Infrastructure & Equipment planning" />
                        <Benefit text="Budget & ROI estimations" />
                        <Benefit text="Area requirement analysis" />
                        <Benefit text="Step-by-step setup guides" />
                    </div>
                    <button onClick={handleSubscription} disabled={processing} className="w-full grad-primary py-5 rounded-2xl font-black text-white text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-primary-500/20">
                        {processing ? <Loader2 className="animate-spin" /> : <>Upgrade to Pro • ₹999 <ArrowRight className="w-6 h-6" /></>}
                    </button>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 flex items-center justify-center gap-2 font-black uppercase tracking-widest">
                        <CreditCard className="w-3 h-3" /> Secure payment via Razorpay
                    </p>
                </div>
            </main>
        </div>
    );

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
                <header className="p-8 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md relative z-10 flex-shrink-0 shadow-sm">
                    <div className="absolute top-0 right-0 w-64 h-full bg-primary-50 dark:bg-primary-900/10 blur-[80px] -z-10" />
                    <div className="flex items-center justify-between max-w-5xl mx-auto">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 grad-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 border border-primary-400">
                                <ClipboardCheck className="text-white w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Pre-Setup Advisor</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 font-medium">
                                    <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                    Plan your indoor farming infrastructure with n8n AI
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="max-w-5xl mx-auto w-full">
                        {messages.length === 0 ? (
                            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-10 group">
                                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[32px] flex items-center justify-center mb-8 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none group-hover:scale-110 transition-transform">
                                    <Bot className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">How should we start?</h2>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg mb-12 font-medium leading-relaxed">
                                    Tell me your available area or budget, and I'll help you design your ideal indoor farming setup.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                                    <QuickStartCard
                                        icon={Ruler}
                                        title="Area Analysis"
                                        desc="I have a 10x10 ft room. How many mushroom racks can I fit?"
                                        onClick={() => {
                                            setInput("I have a 10x10 ft room. How many mushroom racks can I fit?");
                                            inputRef.current?.focus();
                                        }}
                                    />
                                    <QuickStartCard
                                        icon={DollarSign}
                                        title="Budget Planning"
                                        desc="I have a ₹50,000 budget. Suggest a setup for saffron."
                                        onClick={() => {
                                            setInput("I have a ₹50,000 budget. Suggest an indoor setup for saffron farming.");
                                            inputRef.current?.focus();
                                        }}
                                    />
                                    <QuickStartCard
                                        icon={Lightbulb}
                                        title="Equipment Checklist"
                                        desc="What lighting and HVAC do I need for a 200 sq ft farm?"
                                        onClick={() => {
                                            setInput("What specific lighting and HVAC equipment do I need for a 200 sq ft indoor farm?");
                                            inputRef.current?.focus();
                                        }}
                                    />
                                    <QuickStartCard
                                        icon={ClipboardCheck}
                                        title="Yield Estimation"
                                        desc="What's the expected yield in a 500 sq ft aeroponic setup?"
                                        onClick={() => {
                                            setInput("What's the expected yield and monthly ROI for a 500 sq ft aeroponic setup?");
                                            inputRef.current?.focus();
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 py-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                        max-w-[85%] rounded-[32px] p-6 flex gap-4 shadow-xl
                                        ${msg.role === 'user'
                                                ? 'grad-primary text-white shadow-primary-500/20 rounded-tr-none'
                                                : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-slate-200/50 dark:shadow-none'}
                                    `}>
                                            {msg.role === 'bot' && (
                                                <div className="w-8 h-8 grad-primary rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-md">
                                                    <Bot className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                            <div className="text-lg leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</div>
                                            {msg.role === 'user' && (
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 mt-1">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 flex gap-4 rounded-tl-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                                            <div className="w-8 h-8 grad-primary rounded-lg flex items-center justify-center shrink-0">
                                                <Bot className="w-5 h-5 text-white animate-pulse" />
                                            </div>
                                            <div className="flex gap-2 items-center h-8">
                                                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
                        <div className="flex-1 relative group">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="E.g. I have 100 sq ft, suggest a setup..."
                                disabled={loading}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] py-5 px-8 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 font-bold text-slate-700 dark:text-slate-200 shadow-inner disabled:opacity-50"
                            />
                        </div>
                        <button
                            disabled={loading || !input.trim()}
                            type="submit"
                            className="grad-primary hover:shadow-primary-500/40 active:scale-95 disabled:opacity-50 text-white w-16 h-16 rounded-[28px] flex items-center justify-center transition-all shadow-xl shadow-primary-500/20"
                        >
                            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8" />}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

const QuickStartCard = ({ icon: Icon, title, desc, onClick }) => (
    <button
        onClick={onClick}
        className="bg-white dark:bg-slate-900 p-6 rounded-3xl text-left border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/10 hover:border-primary-100 dark:hover:border-primary-900/50 transition-all group"
    >
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-primary-100 dark:border-primary-900/30 shadow-sm">
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">{title}</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm italic font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">"{desc}"</p>
    </button>
);

const Benefit = ({ text }) => (
    <div className="flex items-center gap-3 text-slate-600">
        <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center shrink-0 border border-primary-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-primary-600" />
        </div>
        <span className="text-sm font-bold">{text}</span>
    </div>
);

export default PreSetupGuide;
