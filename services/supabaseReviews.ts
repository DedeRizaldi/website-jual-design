import { supabase } from '../lib/supabase';

export interface Review {
    id: string;
    user_id: string;
    product_id: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
    user_email?: string; // From join
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

// Create a new review
export const createReview = async (
    userId: string,
    productId: string,
    rating: number,
    comment: string
): Promise<{ data: Review | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([
                {
                    user_id: userId,
                    product_id: productId,
                    rating,
                    comment,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error: any) {
        console.error('Error creating review:', error);
        return {
            data: null,
            error: error.message || 'Failed to create review',
        };
    }
};

// Get reviews for a product
export const fetchProductReviews = async (
    productId: string
): Promise<{ data: Review[] | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
        *,
        user:user_id (email)
      `)
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to include user_email
        const reviews = data?.map((review: any) => ({
            ...review,
            user_email: review.user?.email || 'Anonymous',
        }));

        return { data: reviews, error: null };
    } catch (error: any) {
        console.error('Error fetching reviews:', error);
        return {
            data: null,
            error: error.message || 'Failed to fetch reviews',
        };
    }
};

// Get review stats for a product
export const fetchReviewStats = async (
    productId: string
): Promise<{ data: ReviewStats | null; error: string | null }> => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('rating')
            .eq('product_id', productId);

        if (error) throw error;

        if (!data || data.length === 0) {
            return {
                data: {
                    averageRating: 0,
                    totalReviews: 0,
                    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                },
                error: null,
            };
        }

        const totalReviews = data.length;
        const sumRatings = data.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = sumRatings / totalReviews;

        const ratingDistribution: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        data.forEach((r) => {
            ratingDistribution[r.rating]++;
        });

        return {
            data: {
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews,
                ratingDistribution,
            },
            error: null,
        };
    } catch (error: any) {
        console.error('Error fetching review stats:', error);
        return {
            data: null,
            error: error.message || 'Failed to fetch review stats',
        };
    }
};

// Check if user can review product (has purchased it)
export const canUserReview = async (
    userId: string,
    productId: string
): Promise<{ data: boolean; error: string | null }> => {
    try {
        // Check if user has purchased the product
        const { data: orders, error: orderError } = await supabase
            .from('order_items')
            .select('id, orders!inner(user_id)')
            .eq('product_id', productId)
            .eq('orders.user_id', userId);

        if (orderError) throw orderError;

        if (!orders || orders.length === 0) {
            return { data: false, error: null };
        }

        // Check if user has already reviewed
        const { data: existingReview, error: reviewError } = await supabase
            .from('reviews')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (reviewError && reviewError.code !== 'PGRST116') throw reviewError;

        // Can review if purchased and no existing review
        return { data: !existingReview, error: null };
    } catch (error: any) {
        console.error('Error checking review eligibility:', error);
        return {
            data: false,
            error: error.message || 'Failed to check review eligibility',
        };
    }
};

// Update a review
export const updateReview = async (
    reviewId: string,
    rating: number,
    comment: string
): Promise<{ error: string | null }> => {
    try {
        const { error } = await supabase
            .from('reviews')
            .update({ rating, comment })
            .eq('id', reviewId);

        if (error) throw error;

        return { error: null };
    } catch (error: any) {
        console.error('Error updating review:', error);
        return {
            error: error.message || 'Failed to update review',
        };
    }
};

// Delete a review
export const deleteReview = async (
    reviewId: string
): Promise<{ error: string | null }> => {
    try {
        const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

        if (error) throw error;

        return { error: null };
    } catch (error: any) {
        console.error('Error deleting review:', error);
        return {
            error: error.message || 'Failed to delete review',
        };
    }
};
