import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { Send, Bot, User, Loader2, Trash2, Lock } from 'lucide-react';
import { sendMessage, loadChatHistory, saveChatHistory, clearChatHistory } from '../services/n8nService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Consultation = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const isAdmin = user?.role === 'ADMIN';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {

        if (isAdmin) {
            const history = loadChatHistory();
            setMessages(history);
        }
    }, [isAdmin]);

    useEffect(() => {
        if (messages.length > 0 && isAdmin) {
            saveChatHistory(messages);
        }
    }, [messages, isAdmin]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const aiResponse = await sendMessage(currentInput);
            const aiMessage = {
                role: 'bot',
                content: aiResponse || 'Sorry, I could not process your request.'
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            toast.error(error.message || 'Failed to send message. Please try again.');
            setMessages(prev => prev.slice(0, -1));
            setInput(currentInput);
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to clear all chat history?')) {
            clearChatHistory();
            setMessages([]);
            toast.success('Chat history cleared');
        }
    };

    if (!isAdmin) {
        return (
            <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
                <Sidebar />
                <main className="ml-64 flex-1 p-8 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none text-center max-w-xl">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-100 dark:border-red-900/30 shadow-sm">
                            <Lock className="text-red-600 dark:text-red-400 w-10 h-10" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Access Restricted</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-6">
                            This AI Chat Assistant is only available for administrators.
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm">
                            For farming assistance, please use the <strong>Setup Advisor</strong> or <strong>Environment</strong> features available in the sidebar.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 flex flex-col h-screen">
                <header className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 grad-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <Bot className="text-white w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">AI Farming Assistant</h2>
                                <p className="text-[10px] text-primary-600 dark:text-primary-400 font-black tracking-widest uppercase">Powered by n8n AI</p>
                            </div>
                        </div>
                        {messages.length > 0 && (
                            <button
                                onClick={handleClearHistory}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Clear History</span>
                            </button>
                        )}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 border border-slate-100 dark:border-slate-800">
                                <Bot className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">How can I help you today?</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm">Ask about setup costs, area requirements, crop selection, or profitability analysis for indoor farming.</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                                        max-w-[80%] rounded-2xl p-5 flex gap-4 shadow-xl
                                        ${msg.role === 'user'
                                            ? 'grad-primary text-white ml-12 rounded-tr-none shadow-primary-500/20'
                                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 mr-12 rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-slate-200/50 dark:shadow-none'}
                                    `}>
                                        {msg.role === 'bot' && <Bot className="w-5 h-5 mt-1 shrink-0 text-primary-600 dark:text-primary-400" />}
                                        <div className="space-y-1">
                                            <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                        {msg.role === 'user' && <User className="w-5 h-5 mt-1 shrink-0 text-white/50" />}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 flex gap-4 mr-12 rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                        <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400 animate-pulse" />
                                        <div className="flex gap-1 items-center h-5">
                                            <span className="w-1.5 h-1.5 bg-primary-500/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-1.5 h-1.5 bg-primary-500/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-1.5 h-1.5 bg-primary-500/50 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
                        <div className="flex-1 relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about farming costs, area, or crops..."
                                disabled={loading}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50 shadow-inner"
                            />
                        </div>
                        <button
                            disabled={loading || !input.trim()}
                            type="submit"
                            className="grad-primary hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed text-white w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-primary-500/20"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Consultation;


