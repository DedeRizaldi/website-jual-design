import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Image, PenTool, Layout, Monitor, Zap, Loader } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts } from '../services/supabaseProducts';
import { fetchCategories, Category } from '../services/supabaseCategories';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productsResult, categoriesResult] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);

    if (productsResult.data) {
      setProducts(productsResult.data);
    }

    if (categoriesResult.data) {
      setCategories(categoriesResult.data);
    }

    setLoading(false);
  };

  const featuredProducts = products.slice(0, 4);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Poster': return <Layers className="w-6 h-6" />;
      case 'Layout': return <Layout className="w-6 h-6" />;
      case 'Image': return <Image className="w-6 h-6" />;
      case 'Instagram': return <Monitor className="w-6 h-6" />;
      case 'Briefcase': return <PenTool className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-slate-950 to-slate-950 z-0" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Unlimited Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-neon-blue">
              Creativity
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Premium digital design assets for posters, UI, branding, and more.
            Curated for modern creators.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50"
          >
            Explore Designs <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Browse Categories</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader className="w-6 h-6 text-brand-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.name}`}
                  className="group flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-brand-500/50 transition-all cursor-pointer"
                >
                  <div className="p-3 bg-slate-800 rounded-full text-brand-400 group-hover:scale-110 transition-transform group-hover:bg-brand-900/30 group-hover:text-brand-300">
                    {getIcon(cat.name)}
                  </div>
                  <span className="mt-3 text-sm font-medium text-slate-300 group-hover:text-white">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Assets</h2>
            <Link to="/products" className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-brand-900/20">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Link to={`/products/${product.id}`} className="w-full py-2 bg-white text-slate-950 font-bold text-center rounded-lg hover:bg-brand-50 transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-brand-400 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{product.title}</h3>
                    <div className="text-slate-400 text-lg font-medium">${product.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800/50 text-center">
              <div className="mx-auto w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-brand-400 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Download</h3>
              <p className="text-slate-400">Get access to your files immediately after secure payment processing.</p>
            </div>
            <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800/50 text-center">
              <div className="mx-auto w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-neon-blue mb-4">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">High Quality</h3>
              <p className="text-slate-400">Professionally crafted assets ensuring the best resolution and layer organization.</p>
            </div>
            <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800/50 text-center">
              <div className="mx-auto w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-neon-pink mb-4">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Curated Assets</h3>
              <p className="text-slate-400">Hand-picked designs to ensure your projects stand out from the crowd.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;