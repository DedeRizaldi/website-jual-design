import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchUserWishlist } from '../services/supabaseWishlist';
import { removeFromWishlist } from '../services/supabaseWishlist';
import { Product } from '../types';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const Wishlist: React.FC = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadWishlist();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadWishlist = async () => {
        if (!user) return;

        setLoading(true);
        const { data } = await fetchUserWishlist(user.id);
        if (data) {
            setWishlist(data);
        }
        setLoading(false);
    };

    const handleRemove = async (productId: string) => {
        if (!user) return;

        const { error } = await removeFromWishlist(user.id, productId);
        if (!error) {
            setWishlist(wishlist.filter(p => p.id !== productId));
        }
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
                    <p className="text-slate-400 mb-6">Please log in to view your wishlist</p>
                    <Link to="/login" className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 inline-block">
                        Log In
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-slate-950 min-h-screen py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Loading Wishlist...</h1>
                        <p className="text-slate-400 mt-1">Please wait</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-brand-500 fill-brand-500" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
                        <p className="text-slate-400 mt-1">{wishlist.length} items saved</p>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                        <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl text-white font-medium mb-2">Your wishlist is empty</h3>
                        <p className="text-slate-400 mb-6">Start adding products you love!</p>
                        <Link
                            to="/products"
                            className="inline-block px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <div key={product.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-brand-500/30 transition-all">
                                <Link to={`/products/${product.id}`} className="block">
                                    <div className="aspect-square overflow-hidden bg-slate-800 relative">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border border-slate-800">
                                            ${product.price.toFixed(2)}
                                        </div>
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <div className="text-xs text-brand-400 font-semibold mb-1 uppercase">{product.category}</div>
                                    <Link to={`/products/${product.id}`}>
                                        <h3 className="text-base font-bold text-white group-hover:text-brand-200 transition-colors mb-3">
                                            {product.title}
                                        </h3>
                                    </Link>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <ShoppingCart size={16} />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            className="bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
                                            aria-label="Remove from wishlist"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
