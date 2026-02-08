import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { Package, Plus, Trash2, Edit3, Loader2, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MyProducts = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: 'SEEDS'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const endpoint = isAdmin ? '/api/products' : '/api/products/vendor';
            const data = await api.get(endpoint);
            setProducts(data);
        } catch (error) {
            // Error handled by api
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stockQuantity: product.stockQuantity,
            category: product.category
        });
        setIsEditing(true);
        setEditingId(product.productId);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', stockQuantity: '', category: 'SEEDS' });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await api.put(`/api/products/vendor/${editingId}`, formData);
                toast.success('Product updated successfully!');
            } else {
                await api.post('/api/products/vendor', formData);
                toast.success('Product added successfully!');
            }
            fetchProducts();
            resetForm();
        } catch (error) {
            // Error handled by api
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const endpoint = isAdmin ? `/api/admin/product/${id}` : `/api/products/${id}`;
            await api.delete(endpoint);
            setProducts(products.filter(p => p.productId !== id));
            toast.success('Product deleted');
        } catch (error) { }
    };

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{isAdmin ? 'Total Inventory' : 'My Inventory'}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{isAdmin ? 'Oversee all products listed by vendors.' : 'Manage your seeds and equipment listings.'}</p>
                    </div>
                    {!isAdmin && (
                        <button
                            onClick={() => {
                                if (showForm) resetForm();
                                else setShowForm(true);
                            }}
                            className="grad-primary px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-black shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all text-white"
                        >
                            {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Product</>}
                        </button>
                    )}
                </header>

                {showForm && !isAdmin && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none mb-10 max-w-2xl animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Product Name</label>
                                <input required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Price (₹)</label>
                                <input type="number" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Stock Qty</label>
                                <input type="number" required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Category</label>
                                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-slate-700 dark:text-slate-200 font-bold shadow-inner" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="SEEDS">Seeds</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                    <option value="NUTRIENTS">Nutrients</option>
                                </select>
                            </div>
                            <button className="col-span-2 grad-primary py-4 rounded-2xl font-black text-white text-lg shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all mt-4">
                                {isEditing ? 'Update Product' : 'Save Product'}
                            </button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.length === 0 ? (
                            <div className="col-span-full h-40 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl font-black uppercase tracking-widest text-xs">
                                <Package className="w-8 h-8 mb-2 opacity-20" />
                                <p>{isAdmin ? 'No products available in the system.' : "You haven't added any products yet."}</p>
                            </div>
                        ) : (
                            products.map(product => (
                                <div key={product.productId} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 group relative overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/10 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm border border-amber-100 dark:border-amber-900/30">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                        <div className="flex gap-2">
                                            {!isAdmin && (
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-slate-100 dark:border-slate-700 transition-colors shadow-sm"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(product.productId)}
                                                className="w-9 h-9 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-400 hover:text-white border border-red-100 dark:border-red-900/30 transition-colors shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{product.name}</h3>
                                    <p className="text-[10px] text-primary-600 dark:text-primary-400 font-black uppercase tracking-widest mt-0.5">{product.category}</p>
                                    {isAdmin && <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-2">Vendor: <span className="text-slate-600 dark:text-slate-300">{product.vendorName}</span></p>}
                                    <div className="mt-6 flex justify-between items-end">
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{product.price}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mt-1">
                                                Stock: {product.stockQuantity > 0 ? <span className="text-slate-700 dark:text-slate-300">{product.stockQuantity}</span> : <span className="text-red-500 dark:text-red-400">Out of Stock</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>

    );
};

export default MyProducts;
