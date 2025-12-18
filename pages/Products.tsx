import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Loader, Search, X } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts } from '../services/supabaseProducts';
import { fetchCategories, Category } from '../services/supabaseCategories';
import WishlistButton from '../components/WishlistButton';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products and categories on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [productsResult, categoriesResult] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);

      if (productsResult.data) {
        setAllProducts(productsResult.data);
      } else if (productsResult.error) {
        console.error('Products error:', productsResult.error);
        // Keep showing skeleton, don't hide products
      }

      if (categoriesResult.data) {
        setCategories(categoriesResult.data);
      } else if (categoriesResult.error) {
        console.error('Categories error:', categoriesResult.error);
      }
    } catch (error) {
      console.error('Load data error:', error);
      // Don't force stop - keep skeleton showing
    } finally {
      // Always stop loading when data arrives or fails
      setLoading(false);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      case 'popular':
        // For now, same as newest. Later can add view count
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    setFilteredProducts(filtered);
  }, [categoryFilter, allProducts, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white">Loading Products...</h1>
            <p className="text-slate-400 mt-1">Please wait</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {categoryFilter ? `${categoryFilter}` : 'All Products'}
            </h1>
            <p className="text-slate-400 mt-1">
              {filteredProducts.length} results found
            </p>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors min-w-[200px]"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* Clear Filters Button */}
          {(searchQuery || categoryFilter || sortBy !== 'newest') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSortBy('newest');
                setSearchParams({});
              }}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <Filter size={18} className="text-slate-500 mr-2" />
            <button
              onClick={() => setSearchParams({})}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!categoryFilter
                ? 'bg-brand-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.name })}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${categoryFilter === cat.name
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="group block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-brand-500/30 transition-all hover:shadow-lg hover:shadow-brand-900/10">
              <div className="aspect-square overflow-hidden bg-slate-800 relative">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Wishlist Heart Icon */}
                <div className="absolute top-2 left-2 z-10">
                  <WishlistButton productId={product.id} size={22} className="bg-slate-950/80 backdrop-blur-sm p-2 rounded-full border border-slate-800 hover:border-brand-500 transition-colors" />
                </div>
                <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border border-slate-800">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-brand-400 font-semibold mb-1 uppercase">{product.category}</div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-200 transition-colors">{product.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <h3 className="text-xl text-white font-medium">No products found</h3>
            <p className="text-slate-500 mt-2">Try selecting a different category.</p>
            <button
              onClick={() => setSearchParams({})}
              className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;