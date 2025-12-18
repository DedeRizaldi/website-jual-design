import React, { useState, useEffect } from 'react';
import { Download, FileText, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { fetchUserOrders, OrderWithItems } from '../services/supabaseOrders';

const Downloads: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        const result = await fetchUserOrders(user.id);

        if (result.error) {
            setError(result.error);
        } else {
            setOrders(result.data || []);
        }

        setLoading(false);
    };

    const handleDownload = (imageUrl: string | null, productTitle: string) => {
        if (!imageUrl) {
            alert('No image available for download');
            return;
        }

        // Download image
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${productTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl text-white mb-4">Please log in to view downloads</h2>
                    <Link to="/login" className="text-brand-400 underline">Log In</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-slate-950 min-h-screen py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <h1 className="text-3xl font-bold text-white mb-2">My Downloads</h1>
                <p className="text-slate-400 mb-8">Access your purchased digital assets.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                            ×
                        </button>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                        <h3 className="text-xl text-white font-medium mb-2">No purchases yet</h3>
                        <p className="text-slate-400 mb-6">Start shopping to see your downloads here!</p>
                        <Link
                            to="/products"
                            className="inline-block px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                <div className="p-4 bg-slate-950 border-b border-slate-800">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-xs text-slate-500">Order ID: {order.id.slice(0, 8)}</span>
                                            <p className="text-sm text-slate-400 mt-1">
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-400">Total</p>
                                            <p className="text-lg font-bold text-white">${order.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-800">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-800/50 transition-colors"
                                        >
                                            <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
                                                <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden mr-4 flex-shrink-0">
                                                    {item.product_image_url ? (
                                                        <img
                                                            src={item.product_image_url}
                                                            alt={item.product_title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                // Show placeholder if image fails to load
                                                                e.currentTarget.style.display = 'none';
                                                                const parent = e.currentTarget.parentElement;
                                                                if (parent && !parent.querySelector('.fallback-icon')) {
                                                                    const icon = document.createElement('div');
                                                                    icon.className = 'fallback-icon text-slate-600';
                                                                    icon.innerHTML = '<svg width="24" height="24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
                                                                    parent.appendChild(icon);
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <FileText size={24} className="text-brand-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-white font-medium text-lg">{item.product_title}</h3>
                                                        {!item.product_image_url && (
                                                            <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                                                                Unavailable
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-400">${item.product_price.toFixed(2)}</p>
                                                    {!item.product_image_url && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Product has been removed from store
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(item.product_image_url, item.product_title)}
                                                disabled={!item.product_image_url}
                                                className={`flex items-center px-4 py-2 rounded-lg transition-colors border ${item.product_image_url
                                                        ? 'bg-slate-800 hover:bg-brand-600 text-white border-slate-700 hover:border-brand-500'
                                                        : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Download size={18} className="mr-2" />
                                                {item.product_image_url ? 'Download' : 'Not Available'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Downloads;