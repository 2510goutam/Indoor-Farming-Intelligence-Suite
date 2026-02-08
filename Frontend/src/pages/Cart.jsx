import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2, Package } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await api.get('/api/cart');
            setCart(data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, newQty) => {
        if (newQty < 1) return;
        try {
            const updated = await api.put(`/api/cart/item/${itemId}?quantity=${newQty}`);
            setCart(updated);
        } catch (error) {
            // Error handled by api
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/api/cart/item/${itemId}`);
            toast.success("Item removed");
            fetchCart();
        } catch (error) {
            // Error handled by api
        }
    };

    if (loading) return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        </div>
    );

    const hasItems = cart?.items && cart.items.length > 0;

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Your Cart</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Review your items before checkout.</p>
                </header>

                {!hasItems ? (
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-700">
                            <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-400 dark:text-slate-600 mb-8 uppercase tracking-widest">Your cart is empty</h2>
                        <button
                            onClick={() => navigate('/marketplace')}
                            className="grad-primary px-8 py-4 rounded-xl font-black text-white shadow-lg shadow-primary-500/20 hover:scale-105 transition-all"
                        >
                            Browse Marketplace
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.cartItemId} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/5 transition-all">
                                    <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center shrink-0 border border-primary-100 dark:border-primary-900/30">
                                        <Package className="text-primary-600 dark:text-primary-400 w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white">{item.itemName}</h3>
                                        <p className="text-[10px] text-primary-600 dark:text-primary-400 uppercase tracking-widest font-black mt-0.5">{item.itemType}</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
                                        <button
                                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                            className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-sm"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-black text-slate-700 dark:text-slate-200">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                            className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-right min-w-[100px]">
                                        <p className="text-xl font-black text-slate-900 dark:text-white">₹{item.totalPrice}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">₹{item.pricePerUnit} / unit</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.cartItemId)}
                                        className="p-3 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none sticky top-8">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Order Summary</h3>
                                <div className="space-y-4 mb-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                                        <span className="text-xs uppercase tracking-widest">Subtotal</span>
                                        <span className="text-slate-900 dark:text-white">₹{cart.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                                        <span className="text-xs uppercase tracking-widest">Shipping</span>
                                        <span className="text-primary-600 dark:text-primary-400 font-black uppercase text-[10px] tracking-widest bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded border border-primary-100 dark:border-primary-900/30">Free Delivery</span>
                                    </div>
                                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total</span>
                                        <span className="text-3xl font-black text-slate-900 dark:text-white">₹{cart.totalAmount}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full grad-primary py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all text-white shadow-xl shadow-primary-500/20"
                                >
                                    Proceed to Checkout <ArrowRight className="w-6 h-6" />
                                </button>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-4 font-black uppercase tracking-widest">Secure checkout enabled</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>

    );
};

export default Cart;
