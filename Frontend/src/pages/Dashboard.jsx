import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Leaf, Award, Calendar, ExternalLink, Users, ShieldCheck, ShoppingBag, Loader2, Star, MessageSquare, Package, TrendingUp, Store } from 'lucide-react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'ADMIN';
    const isRegisteredUser = user?.role === 'REGISTERED_USER';
    const isVendor = user?.role === 'VENDOR' || user?.role === 'SUBSCRIBED_VENDOR';
    const [stats, setStats] = useState(null);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [positiveFeedbacks, setPositiveFeedbacks] = useState([]);
    const [vendorRequests, setVendorRequests] = useState([]);

    useEffect(() => {
        if (isAdmin) {
            fetchAdminStats();
            fetchVendorRequests();
        } else {
            fetchPositiveFeedbacks();
            fetchDashboardStats();
            fetchSalesData();
        }
    }, [isAdmin]);

    const fetchAdminStats = async () => {
        setLoading(true);
        try {
            const data = await api.get('/api/admin/stats');
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVendorRequests = async () => {
        try {
            const data = await api.get('/api/admin/vendor-requests');
            setVendorRequests(data);
        } catch (error) {
            console.error("Failed to fetch vendor requests", error);
        }
    };

    const fetchPositiveFeedbacks = async () => {
        try {
            const data = await api.get('/api/feedback/positive');
            setPositiveFeedbacks(data);
        } catch (error) {
            console.error("Failed to fetch feedbacks", error);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const data = await api.get('/api/dashboard/stats');
            setDashboardStats(data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        }
    };

    const fetchSalesData = async () => {
        try {
            const data = await api.get('/api/dashboard/sales');
            setSalesData(data);
        } catch (error) {
            console.error("Failed to fetch sales data", error);
        }
    };

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {isAdmin ? `Welcome to Control Center, ${user?.name}` : `Welcome back, ${user?.name}`}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            {isAdmin ? "Overseeing the entire farming ecosystem today." : "Here's what's happening on your farm today."}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl flex items-center gap-3 border border-primary-500/20 dark:border-primary-500/10 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            <span className="text-sm font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider">{user?.role}</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {isAdmin ? (
                        <>
                            <StatCard
                                icon={Users}
                                label="Total Users"
                                value={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats?.totalUsers || '0'}
                                color="text-primary-600 dark:text-primary-400"
                                bg="bg-primary-50 dark:bg-primary-900/20"
                            />
                            <StatCard
                                icon={ShieldCheck}
                                label="Subscribed Users"
                                value={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats?.subscribedUsers || '0'}
                                color="text-amber-600 dark:text-amber-400"
                                bg="bg-amber-50 dark:bg-amber-900/20"
                            />
                            <StatCard
                                icon={Store}
                                label="Vendors"
                                value={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats?.totalVendors || '0'}
                                color="text-blue-600 dark:text-blue-400"
                                bg="bg-blue-50 dark:bg-blue-900/20"
                            />
                            <StatCard
                                icon={Award}
                                label="Subscribed Vendors"
                                value={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : stats?.subscribedVendors || '0'}
                                color="text-purple-600 dark:text-purple-400"
                                bg="bg-purple-50 dark:bg-purple-900/20"
                            />
                        </>
                    ) : (
                        <>
                            {isRegisteredUser || user?.role === 'VENDOR' ? (
                                <div
                                    onClick={() => navigate('/environment')}
                                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-amber-500/20 dark:border-amber-500/10 hover:border-amber-500/50 cursor-pointer transition-all group relative overflow-hidden shadow-lg shadow-amber-500/5"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl -z-10" />
                                    <div className={`w-12 h-12 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Award className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Subscription</p>
                                    <div className="text-xl font-bold mt-1 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                        Get Environment Pro <ExternalLink className="w-4 h-4" />
                                    </div>
                                    <p className="text-[10px] text-amber-700 dark:text-amber-500 mt-2 uppercase tracking-widest font-black">Unlock AI Insights & Market Access</p>
                                </div>
                            ) : (
                                <StatCard
                                    icon={Award}
                                    label="Subscription"
                                    value={user?.role === 'SUBSCRIBED_USER' || user?.role === 'SUBSCRIBED_VENDOR' ? 'PRO PLAN' : 'ACTIVE'}
                                    color="text-amber-600 dark:text-amber-400"
                                    bg="bg-amber-50 dark:bg-amber-900/20"
                                />
                            )}

                            <StatCard
                                icon={Calendar}
                                label="Account Created"
                                value={(() => {
                                    if (!user?.createdAt) return 'N/A';
                                    try {
                                        return new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        });
                                    } catch (e) {
                                        return 'N/A';
                                    }
                                })()}
                                color="text-blue-600 dark:text-blue-400"
                                bg="bg-blue-50 dark:bg-blue-900/20"
                            />

                            {user?.role === 'SUBSCRIBED_VENDOR' ? (
                                <>
                                    <StatCard
                                        icon={Package}
                                        label="Total Products"
                                        value={dashboardStats?.totalProductsCount ?? <Loader2 className="w-4 h-4 animate-spin" />}
                                        color="text-amber-600 dark:text-amber-400"
                                        bg="bg-amber-50 dark:bg-amber-900/20"
                                    />
                                    <StatCard
                                        icon={Leaf}
                                        label="Active Crops"
                                        value={dashboardStats?.activeCropsCount ?? <Loader2 className="w-4 h-4 animate-spin" />}
                                        color="text-primary-600 dark:text-primary-400"
                                        bg="bg-primary-50 dark:bg-primary-900/20"
                                    />
                                </>
                            ) : (
                                !isRegisteredUser && (
                                    <StatCard
                                        icon={isVendor ? Package : Leaf}
                                        label={isVendor ? "Total Products" : "Active Crops"}
                                        value={dashboardStats ? (isVendor ? dashboardStats.totalProductsCount : dashboardStats.activeCropsCount) : <Loader2 className="w-4 h-4 animate-spin" />}
                                        color={isVendor ? "text-amber-600 dark:text-amber-400" : "text-primary-600 dark:text-primary-400"}
                                        bg={isVendor ? "bg-amber-50 dark:bg-amber-900/20" : "bg-primary-50 dark:bg-primary-900/20"}
                                    />
                                )
                            )}
                        </>
                    )}
                </div>

                <div className={`grid grid-cols-1 ${!isRegisteredUser ? 'lg:grid-cols-2' : ''} gap-8`}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            {isAdmin ? "Recent Activities" : "High Rated Feedback"}
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </h3>
                        <div className="space-y-4">
                            {isAdmin ? (
                                vendorRequests.length === 0 ? (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                        <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">No pending vendor requests</p>
                                    </div>
                                ) : (
                                    vendorRequests.slice(0, 3).map((request) => (
                                        <div key={request.id} className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors cursor-pointer" onClick={() => navigate('/admin/approvals')}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{request.userName}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{request.userEmail}</p>
                                                </div>
                                                <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Pending</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Shop: {request.shopName}</p>
                                        </div>
                                    ))
                                )
                            ) : (
                                positiveFeedbacks.length === 0 ? (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                        <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Wait for the love to pour in!</p>
                                    </div>
                                ) : (
                                    positiveFeedbacks.map((fb, idx) => (
                                        <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-500/50 transition-colors">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold text-primary-700 dark:text-primary-400">{fb.userName}</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(fb.rating)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 text-amber-500 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-2">"{fb.message}"</p>
                                        </div>
                                    ))
                                )
                            )}
                        </div>
                    </div>

                    {!isRegisteredUser && (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                {isAdmin ? "Platform Insights" : user?.role === 'SUBSCRIBED_VENDOR' ? "Sales Overview (Last 30 Days)" : isVendor ? "Product Sales (Last 30 Days)" : "Crop Sales (Last 30 Days)"}
                            </h3>
                            {isAdmin ? (
                                stats?.userRegistrations && stats.userRegistrations.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={stats.userRegistrations}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                            <XAxis
                                                dataKey="date"
                                                className="text-xs text-slate-500 dark:text-slate-400"
                                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            />
                                            <YAxis className="text-xs text-slate-500 dark:text-slate-400" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgb(15 23 42)',
                                                    border: '1px solid rgb(51 65 85)',
                                                    borderRadius: '0.5rem',
                                                    color: 'white'
                                                }}
                                                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                                dot={{ fill: '#22c55e', r: 4 }}
                                                activeDot={{ r: 6 }}
                                                name="New Users"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No registration data available</p>
                                    </div>
                                )
                            ) : user?.role === 'SUBSCRIBED_VENDOR' ? (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wider">Product Sales</p>
                                        {salesData && salesData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={150}>
                                                <LineChart data={salesData}>
                                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                                    <XAxis
                                                        dataKey="date"
                                                        className="text-xs text-slate-500 dark:text-slate-400"
                                                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    />
                                                    <YAxis className="text-xs text-slate-500 dark:text-slate-400" />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'rgb(15 23 42)',
                                                            border: '1px solid rgb(51 65 85)',
                                                            borderRadius: '0.5rem',
                                                            color: 'white'
                                                        }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="totalAmount"
                                                        stroke="#3b82f6"
                                                        strokeWidth={2}
                                                        dot={{ fill: '#3b82f6', r: 3 }}
                                                        name="Products"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-24 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                                <p className="text-slate-400 dark:text-slate-500 text-xs">No product sales</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-3 uppercase tracking-wider">Crop Sales</p>
                                        {salesData && salesData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={150}>
                                                <LineChart data={salesData}>
                                                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                                    <XAxis
                                                        dataKey="date"
                                                        className="text-xs text-slate-500 dark:text-slate-400"
                                                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    />
                                                    <YAxis className="text-xs text-slate-500 dark:text-slate-400" />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'rgb(15 23 42)',
                                                            border: '1px solid rgb(51 65 85)',
                                                            borderRadius: '0.5rem',
                                                            color: 'white'
                                                        }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="totalAmount"
                                                        stroke="#22c55e"
                                                        strokeWidth={2}
                                                        dot={{ fill: '#22c55e', r: 3 }}
                                                        name="Crops"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-24 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                                <p className="text-slate-400 dark:text-slate-500 text-xs">No crop sales</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : salesData && salesData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                        <XAxis
                                            dataKey="date"
                                            className="text-xs text-slate-500 dark:text-slate-400"
                                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        />
                                        <YAxis className="text-xs text-slate-500 dark:text-slate-400" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgb(15 23 42)',
                                                border: '1px solid rgb(51 65 85)',
                                                borderRadius: '0.5rem',
                                                color: 'white'
                                            }}
                                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="totalAmount"
                                            stroke="#22c55e"
                                            strokeWidth={2}
                                            dot={{ fill: '#22c55e', r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">No sales data available</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-standard hover:shadow-2xl hover:shadow-primary-500/10 group">
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{label}</p>
        <div className="text-2xl font-black mt-1 flex items-center h-8 text-slate-900 dark:text-white">{value}</div>
    </div>
);


export default Dashboard;
