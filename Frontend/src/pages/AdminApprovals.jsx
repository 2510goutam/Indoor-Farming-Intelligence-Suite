import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { CheckCircle, XCircle, Loader2, Store, Mail, Phone, MapPin, FileText, CreditCard } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminApprovals = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await api.get('/api/admin/vendor-requests');
            setRequests(data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            await api.post(`/api/admin/vendor-requests/${requestId}/approve`);
            toast.success('Vendor request approved successfully');
            fetchRequests();
        } catch (error) {
            toast.error('Failed to approve request');
        }
    };

    const handleReject = async (requestId) => {
        if (window.confirm('Are you sure you want to reject this vendor request?')) {
            try {
                await api.post(`/api/admin/vendor-requests/${requestId}/reject`);
                toast.success('Vendor request rejected');
                fetchRequests();
            } catch (error) {
                toast.error('Failed to reject request');
            }
        }
    };

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Vendor Approvals</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Review and approve vendor registration requests.</p>
                </header>

                {loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-xl">
                        <Store className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Pending Requests</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">All vendor applications have been processed.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {requests.map((request) => (
                            <div key={request.id} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{request.userName}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{request.userEmail}</p>
                                    </div>
                                    <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                                        Pending
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <Store className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Shop Name</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{request.shopName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Contact Email</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{request.contactEmail}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Contact Phone</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{request.contactPhone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Address</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{request.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CreditCard className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">GST Number</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{request.gstNumber}</p>
                                        </div>
                                    </div>

                                    {request.description && (
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Description</p>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{request.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleReject(request.id)}
                                        className="flex-1 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-black hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(request.id)}
                                        className="flex-1 py-3 rounded-xl grad-primary text-white font-black hover:scale-[1.02] transition-transform shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve
                                    </button>
                                </div>

                                <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-4 font-medium">
                                    Requested {new Date(request.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminApprovals;
