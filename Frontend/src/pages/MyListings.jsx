import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { Leaf, Plus, Trash2, Edit3, Loader2, Tag, Calendar, Database } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MyListings = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        cropName: '',
        description: '',
        pricePerKg: '',
        availableQuantityKg: '',
        quality: 'A',
        harvestDate: ''
    });

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const endpoint = isAdmin ? '/api/marketplace/admin/all-crops' : '/api/marketplace/farmer/my-listings';
            const data = await api.get(endpoint);
            setListings(data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                const response = await api.put(`/api/marketplace/farmer/crop/${editingId}`, formData);
                toast.success('Listing updated successfully!');
                setListings(listings.map(l => l.id === editingId ? response : l));
            } else {
                const response = await api.post('/api/marketplace/farmer/list-crop', formData);
                toast.success('Crop listed successfully!');
                setListings([...listings, response]);
            }
            setShowForm(false);
            setIsEditing(false);
            setEditingId(null);
            setFormData({ cropName: '', description: '', pricePerKg: '', availableQuantityKg: '', quality: 'A', harvestDate: '' });
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (listing) => {
        setFormData({
            cropName: listing.cropName,
            description: listing.description,
            pricePerKg: listing.pricePerKg,
            availableQuantityKg: listing.availableQuantityKg,
            quality: listing.quality,
            harvestDate: listing.harvestDate
        });
        setEditingId(listing.id);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setShowForm(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ cropName: '', description: '', pricePerKg: '', availableQuantityKg: '', quality: 'A', harvestDate: '' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            const endpoint = isAdmin ? `/api/marketplace/admin/crop/${id}` : `/api/marketplace/farmer/crop/${id}`;
            await api.delete(endpoint);
            setListings(listings.filter(l => l.id !== id));
            toast.success('Listing removed');
        } catch (error) {
            toast.error("Failed to delete listing");
        }
    };

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{isAdmin ? 'Total Crop Listings' : 'My Crop Listings'}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{isAdmin ? 'Review and manage all crops listed by farmers and users.' : 'Sell your premium harvest directly to markets.'}</p>
                    </div>
                    {!isAdmin && (
                        <button
                            onClick={showForm ? handleCancel : () => setShowForm(true)}
                            className={`px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-black text-white shadow-lg transition-all hover:scale-105 ${showForm ? 'bg-slate-500 shadow-slate-500/20' : 'grad-primary shadow-primary-500/20'}`}
                        >
                            {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> List New Crop</>}
                        </button>
                    )}
                </header>

                {showForm && !isAdmin && (
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none mb-10 max-w-2xl">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-widest">{isEditing ? 'Update Listing' : 'Create Marketplace Listing'}</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Crop Name</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner" value={formData.cropName} onChange={e => setFormData({ ...formData, cropName: e.target.value })} placeholder="e.g. Kashmiri Saffron" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Price (₹ / kg)</label>
                                <input type="number" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner" value={formData.pricePerKg} onChange={e => setFormData({ ...formData, pricePerKg: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Available (kg)</label>
                                <input type="number" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner" value={formData.availableQuantityKg} onChange={e => setFormData({ ...formData, availableQuantityKg: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Quality Grade</label>
                                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner cursor-pointer" value={formData.quality} onChange={e => setFormData({ ...formData, quality: e.target.value })}>
                                    <option value="PREMIUM">Premium</option>
                                    <option value="A">Grade A</option>
                                    <option value="B">Grade B</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Harvest Date</label>
                                <input type="date" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner" value={formData.harvestDate} onChange={e => setFormData({ ...formData, harvestDate: e.target.value })} />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Description</label>
                                <textarea className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner resize-none" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your crop quality and growing conditions..." />
                            </div>
                            <button className="col-span-2 grad-primary py-5 rounded-[24px] font-black text-white text-lg mt-4 shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">{isEditing ? 'Update Listing' : 'Publish Listing'}</button>
                        </form>
                    </div>
                )}

                {loading ? <div className="h-40 flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {listings.length === 0 ? (
                            <div className="col-span-full h-40 flex flex-col items-center justify-center text-gray-500 dark:text-slate-600 border-2 border-dashed border-white/5 dark:border-slate-800/5 rounded-3xl">
                                <Leaf className="w-8 h-8 mb-2 opacity-20" />
                                <p>{isAdmin ? 'No crop listings found in the system.' : "You haven't listed any crops for sale."}</p>
                            </div>
                        ) : listings.map(listing => (
                            <div key={listing.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 group relative shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/5 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center border border-primary-100 dark:border-primary-900/30 shadow-sm">
                                            <Leaf className="text-primary-600 dark:text-primary-400 w-8 h-8" />
                                        </div>
                                        {isAdmin && (
                                            <div className="flex flex-col justify-center">
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-1">Listed By</p>
                                                <p className="font-black text-slate-900 dark:text-white text-sm">{listing.farmerName}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{listing.pricePerKg}/kg</p>
                                            <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-xl border border-primary-100 dark:border-primary-900/30 uppercase tracking-widest shadow-sm">{listing.quality} Grade</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {!isAdmin && (
                                                <button
                                                    onClick={() => handleEdit(listing)}
                                                    className="w-10 h-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(listing.id)}
                                                className="w-10 h-10 flex items-center justify-center bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{listing.cropName}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">{listing.description}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-2">Stock Available</p>
                                        <div className="flex items-center gap-2">
                                            <Database className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                            <span className="text-base font-black text-slate-700 dark:text-slate-300">{listing.availableQuantityKg} kg</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-2">Harvest Date</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            <span className="text-base font-black text-slate-700 dark:text-slate-300">{listing.harvestDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyListings;
