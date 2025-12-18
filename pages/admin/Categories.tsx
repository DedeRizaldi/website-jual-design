import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/admin/Modal';
import { Button } from '../../components/admin/Button';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    Category,
} from '../../services/supabaseCategories';

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        setError(null);

        const result = await fetchCategories();

        if (result.error) {
            setError(result.error);
        } else {
            setCategories(result.data || []);
        }

        setLoading(false);
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setCategoryName(category.name);
        } else {
            setEditingCategory(null);
            setCategoryName('');
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setCategoryName('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        let result;
        if (editingCategory) {
            result = await updateCategory(editingCategory.id, categoryName);
        } else {
            result = await createCategory(categoryName);
        }

        setSubmitting(false);

        if (result.error) {
            setError(result.error);
        } else {
            handleCloseModal();
            loadCategories(); // Reload categories
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        setError(null);
        const result = await deleteCategory(id);

        if (result.error) {
            setError(result.error);
        } else {
            loadCategories(); // Reload categories
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
                    <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
                    <p className="text-slate-400">Manage product categories</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
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
                                <th className="px-6 py-4">No</th>
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                        No categories yet. Click "Add Category" to create one.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category, index) => (
                                    <tr key={category.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-400">{index + 1}</td>
                                        <td className="px-6 py-4 text-white font-medium">{category.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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
                title={editingCategory ? 'Edit Category' : 'Add Category'}
                maxWidth="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Category Name
                        </label>
                        <input
                            type="text"
                            required
                            disabled={submitting}
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors disabled:opacity-50"
                            placeholder="Enter category name"
                        />
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1" disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" loading={submitting}>
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Categories;
