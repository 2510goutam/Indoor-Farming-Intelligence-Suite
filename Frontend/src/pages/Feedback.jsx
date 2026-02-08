import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { Star, Send, MessageSquare, Loader2, User } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Feedback = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            fetchFeedbacks();
        }
    }, [isAdmin]);

    const fetchFeedbacks = async () => {
        setFetchingFeedbacks(true);
        try {
            const data = await api.get('/api/feedback/all');
            setFeedbacks(data);
        } catch (error) {
            toast.error("Failed to load feedbacks");
        } finally {
            setFetchingFeedbacks(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/feedback', { message, rating });
            toast.success("Thank you for your feedback!");
            setMessage('');
            setRating(5);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (isAdmin) {
        return (
            <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
                <Sidebar />
                <main className="ml-64 flex-1 p-8">
                    <header className="mb-10">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Platform Feedbacks</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Review feedback submitted by users to improve the platform.</p>
                    </header>

                    {fetchingFeedbacks ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {feedbacks.length === 0 ? (
                                <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-400 dark:text-slate-500 font-medium">No feedbacks received yet.</p>
                                </div>
                            ) : (
                                feedbacks.map((fb) => (
                                    <div key={fb.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex gap-6 items-start hover:shadow-2xl hover:shadow-primary-500/10 transition-all">
                                        <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{fb.userName}</h3>
                                                    <p className="text-[10px] text-primary-600 dark:text-primary-400 font-black uppercase tracking-widest">{fb.userRole}</p>
                                                </div>
                                                <div className="flex gap-1 text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic font-medium">"{fb.message}"</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="mb-10 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Share Your Thoughts</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Your feedback helps us grow and improve the Indoor Farming Suite experiences for everyone.</p>
                </header>

                <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 text-center">Rate your experience</label>
                            <div className="flex justify-center gap-4">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setRating(num)}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${rating >= num ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 border-2 border-amber-500 dark:border-amber-400/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        <Star className={`w-6 h-6 ${rating >= num ? 'fill-current' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Your Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="6"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[32px] p-6 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none text-lg text-slate-700 dark:text-slate-200 shadow-inner"
                                placeholder="What's on your mind? We'd love to hear your suggestions or issues."
                                required
                            ></textarea>
                        </div>

                        <button
                            disabled={loading || !message}
                            className="w-full grad-primary py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-white shadow-xl shadow-primary-500/20"
                        >
                            {loading ? "Submitting..." : <>Submit Feedback <Send className="w-6 h-6" /></>}
                        </button>
                    </form>
                </div>
            </main>
        </div>

    );
};

export default Feedback;
