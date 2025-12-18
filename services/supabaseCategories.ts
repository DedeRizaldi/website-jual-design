import { supabase } from '../lib/supabase';

export interface Category {
    id: string;
    name: string;
    created_at?: string;
}

// Fetch all categories
export const fetchCategories = async (): Promise<{ data: Category[] | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        return {
            data: data || [],
            error: null,
        };
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return {
            data: null,
            error: error.message || 'Failed to fetch categories',
        };
    }
};

// Create new category
export const createCategory = async (name: string): Promise<{ data: Category | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ name }])
            .select()
            .single();

        if (error) throw error;

        return {
            data: data || null,
            error: null,
        };
    } catch (error: any) {
        console.error('Error creating category:', error);
        return {
            data: null,
            error: error.message || 'Failed to create category',
        };
    }
};

// Update category
export const updateCategory = async (
    id: string,
    name: string
): Promise<{ data: Category | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .update({ name })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return {
            data: data || null,
            error: null,
        };
    } catch (error: any) {
        console.error('Error updating category:', error);
        return {
            data: null,
            error: error.message || 'Failed to update category',
        };
    }
};

// Delete category
export const deleteCategory = async (id: string): Promise<{ error: string | null }> => {
    try {
        const { error } = await supabase.from('categories').delete().eq('id', id);

        if (error) throw error;

        return { error: null };
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return {
            error: error.message || 'Failed to delete category',
        };
    }
};
