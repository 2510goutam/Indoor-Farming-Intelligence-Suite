import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import { Store, Tag, Filter, Search, ShoppingBag, Leaf, User, ArrowRight, Loader2, Plus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Marketplace = () => {
    const [crops, setCrops] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('crops');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMarketplace();
    }, []);

    const fetchMarketplace = async () => {
        try {
            const [cropData, productData] = await Promise.all([
                api.get('/api/marketplace/crops'),
                api.get('/api/marketplace/products')
            ]);
            setCrops(cropData);
            setProducts(productData);
        } catch (error) {
            // Error handled by api
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (activeTab === 'crops') {
                const data = await api.get(`/api/marketplace/crops/search?cropName=${searchTerm}`);
                setCrops(data);
            } else {
                const data = await api.get(`/api/marketplace/products/search?name=${searchTerm}`);
                setProducts(data);
            }
        } catch (error) {
            // Error handled by api
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (itemId, type) => {
        try {
            const data = {
                itemType: type,
                quantity: 1
            };
            if (type === 'PRODUCT') {
                data.productId = itemId;
            } else {
                data.marketplaceCropId = itemId;
            }
            await api.post('/api/cart/add', data);
            toast.success("Added to cart!");
        } catch (error) {
        }
    };

    return (
        <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Marketplace</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Direct trading between farmers and verified vendors.</p>
                    </div>
                </header>

                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl w-fit shadow-sm border border-slate-200 dark:border-slate-800">
                        <TabButton
                            active={activeTab === 'crops'}
                            onClick={() => setActiveTab('crops')}
                            icon={Leaf}
                            label="Farmer's Crops"
                        />
                        <TabButton
                            active={activeTab === 'products'}
                            onClick={() => setActiveTab('products')}
                            icon={ShoppingBag}
                            label="Vendor Seeds/Equip"
                        />
                    </div>

                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={activeTab === 'crops' ? "Search for saffron, mushrooms..." : "Search for seeds, equipment, fertilizers..."}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-6 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-sm text-slate-700 dark:text-slate-200"
                        />
                    </form>
                </div>

                {loading ? (
                    <div className="h-60 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {activeTab === 'crops' ? (
                            crops.length === 0 ? <NoData msg="No crop listings available" /> :
                                crops.map(item => <CropCard key={item.id} item={item} onAdd={() => handleAddToCart(item.id, 'CROP')} />)
                        ) : (
                            products.length === 0 ? <NoData msg="No vendor products available" /> :
                                products.map(item => <ProductCard key={item.productId} item={item} onAdd={() => handleAddToCart(item.productId, 'PRODUCT')} />)
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm
            ${active ? 'grad-primary text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'}
        `}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

const CropCard = ({ item, onAdd }) => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/10 transition-standard group">
        <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center shadow-sm">
                <Leaf className="text-primary-600 dark:text-primary-400 w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-full text-[10px] font-bold text-primary-700 dark:text-primary-400 uppercase tracking-widest border border-primary-100 dark:border-primary-900/30">
                {item.quality} Quality
            </span>
        </div>
        <h3 className="text-xl font-bold truncate text-slate-900 dark:text-white">{item.cropName}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-2 font-medium">{item.description}</p>

        <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter text-xs">Price</span>
                <span className="font-black text-primary-700 dark:text-primary-400 text-lg">₹{item.pricePerKg}/kg</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter text-xs">Available</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold">{item.availableQuantityKg} kg</span>
            </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800 my-5" />

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">{item.farmerName}</span>
            </div>
            <button
                onClick={onAdd}
                className="grad-primary p-2.5 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all group/add text-white"
            >
                <Plus className="w-5 h-5 group-hover/add:rotate-90 transition-transform" />
            </button>
        </div>
    </div>
);

const ProductCard = ({ item, onAdd }) => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary-500/10 transition-standard group">
        <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center shadow-sm">
                <ShoppingBag className="text-amber-600 dark:text-amber-400 w-6 h-6" />
            </div>
            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest border border-amber-100 dark:border-amber-900/30">
                {item.category}
            </span>
        </div>
        <h3 className="text-xl font-bold truncate text-slate-900 dark:text-white">{item.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-2 font-medium">High quality {item.category?.toLowerCase()} from verified source.</p>

        <div className="mt-6 flex justify-between items-center">
            <div>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest">Price</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">₹{item.price}</p>
            </div>
            <button
                onClick={onAdd}
                className="grad-primary p-3 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all text-white"
            >
                <ShoppingBag className="w-5 h-5" />
            </button>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800 my-5" />

        <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <Store className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Sold by <span className="text-primary-600 dark:text-primary-400">{item.vendorName}</span></p>
        </div>
    </div>
);

const NoData = ({ msg }) => (
    <div className="col-span-full h-40 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
        <Tag className="w-8 h-8 mb-2 opacity-20" />
        <p className="font-medium">{msg}</p>
    </div>
);


export default Marketplace;
