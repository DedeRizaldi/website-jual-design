import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash, Edit, Image as ImageIcon, Upload } from 'lucide-react';
import { MOCK_PRODUCTS } from '../services/mockData';
import { Product, CATEGORIES } from '../types';

const Admin: React.FC = () => {
    const { isAdmin } = useAuth();
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: CATEGORIES[0].name,
    });

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">
                Access Denied. Admin only.
            </div>
        );
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 300 * 1024) {
                alert("File too large. Max 300KB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
        });
        setPreviewImage(product.imageUrl);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingProduct) {
            // Update existing product
            const updatedProduct: Product = {
                ...editingProduct,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                imageUrl: previewImage || editingProduct.imageUrl,
            };
            setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        } else {
            // Create new product
            const newProduct: Product = {
                id: Math.random().toString(36).substr(2, 9),
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                imageUrl: previewImage || 'https://placehold.co/400x600/1e293b/94a3b8?text=No+Image',
            };
            setProducts([newProduct, ...products]);
        }

        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ title: '', description: '', price: '', category: CATEGORIES[0].name });
        setPreviewImage(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                    >
                        <Plus size={18} className="mr-2" /> Add Product
                    </button>
                </div>

                {/* Product Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950 text-slate-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-800/50 transition">
                                        <td className="px-6 py-4">
                                            <img src={product.imageUrl} alt="" className="w-12 h-12 rounded object-cover bg-slate-800" />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">{product.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-slate-800 text-xs border border-slate-700">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 bg-slate-800 rounded hover:bg-slate-700 transition"
                                                    title="Edit product"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-400 hover:text-red-300 bg-slate-800 rounded hover:bg-slate-700 transition"
                                                    title="Delete product"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-brand-500 outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                                <select
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Price ($)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Image (Max 300KB)</label>
                                    <label className="flex items-center justify-center w-full h-10 px-4 transition bg-slate-950 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800">
                                        <span className="text-sm text-slate-400 truncate">
                                            {previewImage ? "Changed" : "Choose File"}
                                        </span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>

                            {previewImage && (
                                <div className="h-40 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                                    <img src={previewImage} alt="Preview" className="h-full object-contain" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition font-medium"
                                >
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;