import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Loader, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/admin/Modal';
import { Button } from '../../components/admin/Button';
import { Product } from '../../types';
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../../services/supabaseProducts';
import { fetchCategories, Category } from '../../services/supabaseCategories';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Fetch products and categories on mount
    useEffect(() => {
        loadData();
    }, []);

    // Timeout fallback - if loading > 10 seconds, force stop loading
    useEffect(() => {
        if (loading) {
            const timeout = setTimeout(() => {
                console.warn('Loading timeout - forcing loading to false');
                setLoading(false);
            }, 10000); // 10 seconds

            return () => clearTimeout(timeout);
        }
    }, [loading]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
    });

    // Fetch products and categories on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [productsResult, categoriesResult] = await Promise.all([
                fetchProducts(),
                fetchCategories(),
            ]);

            if (productsResult.error) {
                setError(productsResult.error);
            } else {
                setProducts(productsResult.data || []);
            }

            if (categoriesResult.data) {
                setCategories(categoriesResult.data);
                if (categoriesResult.data.length > 0 && !formData.category) {
                    setFormData((prev) => ({ ...prev, category: categoriesResult.data[0].name }));
                }
            }
        } catch (err: any) {
            console.error('Load data error:', err);
            setError(err.message || 'Failed to load data');
        } finally {
            // Always set loading to false
            setLoading(false);
        }
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
            });
            setPreviewImage(product.imageUrl);
        } else {
            setEditingProduct(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                category: categories[0]?.name || '',
            });
            setPreviewImage(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setPreviewImage(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File too large. Max 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const productData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            imageUrl: previewImage || undefined,
        };

        let result;
        if (editingProduct) {
            result = await updateProduct(editingProduct.id, productData);
        } else {
            result = await createProduct(productData);
        }

        setSubmitting(false);

        if (result.error) {
            setError(result.error);
        } else {
            handleCloseModal();
            loadData(); // Reload products
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        setError(null);
        const result = await deleteProduct(id);

        if (result.error) {
            setError(result.error);
        } else {
            loadData(); // Reload products
        }
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
                    <p className="text-slate-400">Manage your digital products</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                        ×
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950 text-slate-300 uppercase text-xs font-medium">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No products yet. Click "Add Product" to create one.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.title}
                                                className="w-12 h-12 rounded object-cover bg-slate-800"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium max-w-xs truncate">
                                            {product.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-slate-800 text-xs border border-slate-700 text-slate-300">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-semibold">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingProduct ? 'Edit Product' : 'Add Product'}
                maxWidth="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Product Title
                            </label>
                            <input
                                type="text"
                                required
                                disabled={submitting}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors disabled:opacity-50"
                                placeholder="Enter product title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                disabled={submitting}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors disabled:opacity-50"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0"
                                disabled={submitting}
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors disabled:opacity-50"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Product Image
                            </label>
                            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-slate-950 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer hover:bg-slate-800/50 hover:border-brand-500">
                                <div className="flex flex-col items-center space-y-2">
                                    <Upload className="w-8 h-8 text-slate-500" />
                                    <span className="text-sm text-slate-400">
                                        {previewImage ? 'Click to change image' : 'Click to upload image (Max 2MB)'}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    disabled={submitting}
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        {previewImage && (
                            <div className="col-span-2">
                                <div className="h-48 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="h-full object-contain"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Description
                            </label>
                            <textarea
                                required
                                rows={4}
                                disabled={submitting}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors resize-none disabled:opacity-50"
                                placeholder="Enter product description"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1" disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" loading={submitting}>
                            {editingProduct ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Products;
