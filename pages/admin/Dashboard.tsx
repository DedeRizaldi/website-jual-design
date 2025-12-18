import React, { useState, useEffect } from 'react';
import { Package, FolderOpen, ShoppingCart, Loader } from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { fetchProducts } from '../../services/supabaseProducts';
import { fetchCategories } from '../../services/supabaseCategories';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 12, // Mock for now
    });
    const [loading, setLoading] = useState(true);

    // Fetch real stats from database
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const [productsResult, categoriesResult] = await Promise.all([
            fetchProducts(),
            fetchCategories(),
        ]);

        setStats({
            totalProducts: productsResult.data?.length || 0,
            totalCategories: categoriesResult.data?.length || 0,
            totalOrders: 12, // Mock number for now
        });

        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Message */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Admin</h1>
                <p className="text-slate-400">Here's what's happening with your store today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    iconColor="text-blue-400"
                    iconBg="bg-blue-600/20"
                />
                <StatCard
                    title="Total Categories"
                    value={stats.totalCategories}
                    icon={FolderOpen}
                    iconColor="text-green-400"
                    iconBg="bg-green-600/20"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    iconColor="text-purple-400"
                    iconBg="bg-purple-600/20"
                />
            </div>
        </div>
    );
};

export default Dashboard;
