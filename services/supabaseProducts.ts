import { supabase } from '../lib/supabase';
import { Product } from '../types';

export interface SupabaseProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

// Convert Supabase product to app Product type
const toProduct = (dbProduct: SupabaseProduct): Product => ({
    id: dbProduct.id,
    title: dbProduct.title,
    description: dbProduct.description,
    category: dbProduct.category,
    price: dbProduct.price,
    imageUrl: dbProduct.image_url || 'https://placehold.co/400x600/1e293b/94a3b8?text=No+Image',
});

// Fetch all products
export const fetchProducts = async (): Promise<{ data: Product[] | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return {
            data: data ? data.map(toProduct) : [],
            error: null,
        };
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return {
            data: null,
            error: error.message || 'Failed to fetch products',
        };
    }
};

// Fetch single product by ID
export const fetchProductById = async (id: string): Promise<{ data: Product | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            data: data ? toProduct(data) : null,
            error: null,
        };
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return {
            data: null,
            error: error.message || 'Product not found',
        };
    }
};

// Create new product
export const createProduct = async (product: {
    title: string;
    description: string;
    category: string;
    price: number;
    imageUrl?: string;
}): Promise<{ data: Product | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    title: product.title,
                    description: product.description,
                    category: product.category,
                    price: product.price,
                    image_url: product.imageUrl || null,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return {
            data: data ? toProduct(data) : null,
            error: null,
        };
    } catch (error: any) {
        console.error('Error creating product:', error);
        return {
            data: null,
            error: error.message || 'Failed to create product',
        };
    }
};

// Update product
export const updateProduct = async (
    id: string,
    updates: {
        title?: string;
        description?: string;
        category?: string;
        price?: number;
        imageUrl?: string;
    }
): Promise<{ data: Product | null; error: string | null }> => {
    try {
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.price !== undefined) dbUpdates.price = updates.price;
        if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;

        const { data, error } = await supabase
            .from('products')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return {
            data: data ? toProduct(data) : null,
            error: null,
        };
    } catch (error: any) {
        console.error('Error updating product:', error);
        return {
            data: null,
            error: error.message || 'Failed to update product',
        };
    }
};

// Delete product
export const deleteProduct = async (id: string): Promise<{ error: string | null }> => {
    try {
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) throw error;

        return { error: null };
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return {
            error: error.message || 'Failed to delete product',
        };
    }
};
