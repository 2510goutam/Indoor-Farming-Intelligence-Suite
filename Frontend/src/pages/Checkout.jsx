import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import { CreditCard, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const fetchCart = async () => {
        try {
            const data = await api.get('/api/cart');
            if (!data.items || data.items.length === 0) {
                navigate('/marketplace');
                return;
            }
            setCart(data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const checkoutRes = await api.post('/api/orders/checkout');
            const orderId = checkoutRes.orderId;

            const orderRequest = {
                orderId: orderId,
                amount: cart.totalAmount,
                currency: 'INR',
                orderType: 'MARKETPLACE'
            };

            const orderData = await api.post('/api/payment/create-order', orderRequest);

            if (!orderData.razorpayOrderId) {
                console.error("❌ ERROR: No Razorpay Order ID received from backend!");
                toast.error("Failed to create payment order. Please try again.");
                setProcessing(false);
                return;
            }

            if (!orderData.keyId) {
                console.error("❌ ERROR: No Razorpay Key ID received from backend!");
                toast.error("Payment configuration error. Please contact support.");
                setProcessing(false);
                return;
            }

            if (!orderData.amount || orderData.amount <= 0) {
                toast.error("Invalid payment amount. Please try again.");
                setProcessing(false);
                return;
            }

            let cleanPhone = (user?.mobileNumber || '').replace(/\D/g, '');

            if (cleanPhone.length !== 10) {
                cleanPhone = '9999999999';
            }

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Indoor Farming Suite',
                description: 'Marketplace Purchase',
                order_id: orderData.razorpayOrderId,
                handler: async (response) => {
                    try {
                        await api.post(`/api/payment/verify?razorpayOrderId=${response.razorpay_order_id}&razorpayPaymentId=${response.razorpay_payment_id}&razorpaySignature=${response.razorpay_signature}`);
                        toast.success("Payment Successful! Your order is placed.");
                        await api.delete('/api/cart/clear');
                        navigate('/dashboard');
                    } catch (error) {
                        console.error("❌ Payment verification failed:", error);
                        toast.error("Payment verification failed.");
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user?.name || 'Customer',
                    email: user?.email || 'customer@example.com',
                    contact: cleanPhone
                },
                theme: {
                    color: '#22c55e'
                },
                modal: {
                    ondismiss: function () {
                        console.log("⚠️ Payment modal dismissed by user");
                        setProcessing(false);
                        toast.error('Payment cancelled');
                    },
                    escape: true,
                    backdropclose: false
                }
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response) {
                const errorMsg = response.error?.description || response.error?.reason || "Payment failed";
                toast.error(errorMsg);
                setProcessing(false);
            });

            rzp.open();
        } catch (error) {
            console.error("Payment initiation error:", error);
            toast.error("Failed to initiate payment: " + (error.message || "Unknown error"));
            setProcessing(false);
        }
    };

    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest text-xs">Loading Secure Gateway...</div>
    </div>

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Secure Checkout</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Complete your purchase securely via Razorpay.</p>
                </header>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-widest">Payment Details</h3>
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30 flex gap-4 shadow-sm">
                                <CreditCard className="text-primary-600 dark:text-primary-400 w-6 h-6 shrink-0" />
                                <div>
                                    <p className="font-black text-primary-700 dark:text-primary-400 text-sm">Razorpay Secure Checkout</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Supports Cards, UPI, Netbanking, and Wallets.</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex gap-4 shadow-sm">
                                <ShieldCheck className="text-blue-600 dark:text-blue-400 w-6 h-6 shrink-0" />
                                <div>
                                    <p className="font-black text-blue-700 dark:text-blue-400 text-sm">Encrypted Transaction</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Your payment information is never stored on our servers.</p>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full grad-primary py-5 rounded-2xl font-black text-white text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-8 shadow-xl shadow-primary-500/20"
                            >
                                {processing ? <Loader2 className="animate-spin" /> : <>Pay ₹{cart?.totalAmount} Now</>}
                            </button>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">PCI DSS Compliant</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-widest">Order Overview</h3>
                        <div className="space-y-4 mb-10 max-h-[300px] overflow-y-auto pr-4 scrollbar-hide bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
                            {cart?.items.map(item => (
                                <div key={item.cartItemId} className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-black text-slate-800 dark:text-slate-200">{item.itemName}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-black text-slate-900 dark:text-white">₹{item.totalPrice}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-baseline pt-4">
                            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Amount</span>
                            <span className="text-3xl font-black text-slate-900 dark:text-white">₹{cart?.totalAmount}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
};

export default Checkout;
