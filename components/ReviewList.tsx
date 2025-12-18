import React from 'react';
import { User } from 'lucide-react';
import StarRating from './StarRating';
import { Review } from '../services/supabaseReviews';

interface ReviewListProps {
    reviews: Review[];
    loading?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, loading = false }) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-800 rounded w-32"></div>
                                <div className="h-3 bg-slate-800 rounded w-48"></div>
                            </div>
                        </div>
                        <div className="h-3 bg-slate-800 rounded w-full mb-2"></div>
                        <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-12 text-center">
                <User className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-1">No reviews yet</h3>
                <p className="text-slate-400">Be the first to review this product!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
                >
                    {/* User Info */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center">
                                <User size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-white">
                                    {review.user_email?.split('@')[0] || 'Anonymous'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <StarRating rating={review.rating} size={16} readonly />
                    </div>

                    {/* Review Comment */}
                    <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
