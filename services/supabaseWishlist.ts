import { supabase } from '../lib/supabase';
import { Product } from '../types';

export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
}

// Add product to wishlist
export const addToWishlist = async (
    userId: string,
    productId: string
): Promise<{ data: WishlistItem | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('wishlists')
            .insert([{ user_id: userId, product_id: productId }])
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error: any) {
        console.error('Error adding to wishlist:', error);
        return {
            data: null,
            error: error.message || 'Failed to add to wishlist',
        };
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (
    userId: string,
    productId: string
): Promise<{ error: string | null }> => {
    try {
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;

        return { error: null };
    } catch (error: any) {
        console.error('Error removing from wishlist:', error);
        return {
            error: error.message || 'Failed to remove from wishlist',
        };
    }
};

// Get user's wishlist with product details
export const fetchUserWishlist = async (
    userId: string
): Promise<{ data: Product[] | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('wishlists')
            .select(`
        product_id,
        products (
          id,
          title,
          description,
          price,
          category,
          imageUrl,
          created_at
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to Product array
        const products = data
            ?.map((item: any) => item.products)
            .filter((p: any) => p !== null) || [];

        return { data: products, error: null };
    } catch (error: any) {
        console.error('Error fetching wishlist:', error);
        return {
            data: null,
            error: error.message || 'Failed to fetch wishlist',
        };
    }
};

// Check if product is in wishlist
export const isInWishlist = async (
    userId: string,
    productId: string
): Promise<{ data: boolean; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

        return { data: !!data, error: null };
    } catch (error: any) {
        console.error('Error checking wishlist:', error);
        return {
            data: false,
            error: error.message || 'Failed to check wishlist',
        };
    }
};

// Get wishlist count for user
export const getWishlistCount = async (
    userId: string
): Promise<{ data: number; error: string | null }> => {
    try {
        const { count, error } = await supabase
            .from('wishlists')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) throw error;

        return { data: count || 0, error: null };
    } catch (error: any) {
        console.error('Error getting wishlist count:', error);
        return {
            data: 0,
            error: error.message || 'Failed to get wishlist count',
        };
    }
};
