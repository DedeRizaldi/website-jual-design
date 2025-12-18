import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ShoppingBag, ArrowLeft, ShieldCheck, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { fetchProductById } from '../services/supabaseProducts';
import { fetchProductReviews, fetchReviewStats, canUserReview, Review, ReviewStats } from '../services/supabaseReviews';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch product on mount
  useEffect(() => {
    if (id) {
      loadProduct(id);
      loadReviews(id);
    }
  }, [id]);

  // Check if user can review
  useEffect(() => {
    if (id && user) {
      checkReviewEligibility(id, user.id);
    }
  }, [id, user]);

  const loadProduct = async (productId: string) => {
    setLoading(true);
    setError(null);

    const result = await fetchProductById(productId);

    if (result.error) {
      setError(result.error);
    } else {
      setProduct(result.data);
    }

    setLoading(false);
  };

  const loadReviews = async (productId: string) => {
    setReviewsLoading(true);

    const [reviewsResult, statsResult] = await Promise.all([
      fetchProductReviews(productId),
      fetchReviewStats(productId),
    ]);

    if (reviewsResult.data) {
      setReviews(reviewsResult.data);
    }

    if (statsResult.data) {
      setReviewStats(statsResult.data);
    }

    setReviewsLoading(false);
  };

  const checkReviewEligibility = async (productId: string, userId: string) => {
    const { data } = await canUserReview(userId, productId);
    setCanReview(data);
  };

  const handleReviewSubmitted = () => {
    if (id) {
      loadReviews(id);
      setCanReview(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white font-bold">Product not found</h2>
          <p className="text-slate-400 mt-2">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/products" className="inline-block mt-4 text-brand-400 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-slate-900 rounded-2xl p-2 border border-slate-800 shadow-2xl">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-auto rounded-xl"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-900/30 text-brand-400 text-xs font-bold tracking-wider uppercase mb-4 w-max border border-brand-900/50">
              {product.category}
            </span>
            <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
              {product.title}
            </h1>
            <div className="text-3xl font-light text-white mb-6">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 border-b border-slate-800 pb-8">
              {product.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-slate-300">
                <Check className="text-brand-500 mr-3 h-5 w-5" />
                <span>Instant High-Speed Download</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Check className="text-brand-500 mr-3 h-5 w-5" />
                <span>Commercial License Included</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Check className="text-brand-500 mr-3 h-5 w-5" />
                <span>24/7 Support Access</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${added
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-slate-950 hover:bg-slate-200'
                  }`}
              >
                {added ? (
                  <>
                    <Check size={20} className="mr-2" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} className="mr-2" /> Add to Cart
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center text-slate-500 text-xs">
              <ShieldCheck size={14} className="mr-1" />
              Secure Checkout via Stripe (Simulated)
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Customer Reviews</h2>
              {reviewStats && reviewStats.totalReviews > 0 && (
                <div className="flex items-center gap-4 mt-2">
                  <StarRating rating={reviewStats.averageRating} size={20} readonly showValue />
                  <span className="text-slate-400 text-sm">
                    Based on {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="lg:col-span-1">
              {user ? (
                canReview ? (
                  <ReviewForm
                    productId={product.id}
                    userId={user.id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                ) : (
                  <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-6 text-center">
                    <p className="text-slate-400">
                      {reviews.find(r => r.user_id === user.id)
                        ? 'You have already reviewed this product'
                        : 'Purchase this product to leave a review'}
                    </p>
                  </div>
                )
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-6 text-center">
                  <p className="text-slate-400 mb-4">Log in to write a review</p>
                  <Link
                    to="/login"
                    className="inline-block px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              <ReviewList reviews={reviews} loading={reviewsLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;