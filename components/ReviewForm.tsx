import React, { useState } from 'react';
import { Send } from 'lucide-react';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import { createReview } from '../services/supabaseReviews';

interface ReviewFormProps {
    productId: string;
    userId: string;
    onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, userId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        setSubmitting(true);

        const { error } = await createReview(userId, productId, rating, comment);

        if (error) {
            toast.error(error);
        } else {
            toast.success('Review submitted successfully! ⭐');
            setRating(0);
            setComment('');
            onReviewSubmitted();
        }

        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>

            {/* Star Rating Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Rating *
                </label>
                <StarRating
                    rating={rating}
                    onRate={setRating}
                    size={28}
                    readonly={false}
                />
            </div>

            {/* Comment Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Review *
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                    required
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={submitting || rating === 0}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
                <Send size={18} />
                {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

export default ReviewForm;
