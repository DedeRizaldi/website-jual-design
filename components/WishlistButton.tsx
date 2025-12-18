import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/supabaseWishlist';
import toast from 'react-hot-toast';

interface WishlistButtonProps {
    productId: string;
    size?: number;
    className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
    productId,
    size = 20,
    className = ''
}) => {
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if product is in wishlist on mount
    useEffect(() => {
        if (user) {
            checkWishlist();
        }
    }, [user, productId]);

    const checkWishlist = async () => {
        if (!user) return;

        const { data } = await isInWishlist(user.id, productId);
        setIsFavorite(data);
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent card click
        e.stopPropagation();

        if (!user) {
            toast.error('Please login to add to wishlist');
            return;
        }

        setLoading(true);

        if (isFavorite) {
            const { error } = await removeFromWishlist(user.id, productId);
            if (!error) {
                setIsFavorite(false);
                toast.success('Removed from wishlist');
            } else {
                toast.error('Failed to remove from wishlist');
            }
        } else {
            const { error } = await addToWishlist(user.id, productId);
            if (!error) {
                setIsFavorite(true);
                toast.success('Added to wishlist! ❤️');
            } else {
                toast.error('Failed to add to wishlist');
            }
        }

        setLoading(false);
    };

    return (
        <button
            onClick={toggleWishlist}
            disabled={loading}
            className={`group transition-all duration-200 ${className}`}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                size={size}
                className={`transition-all duration-200 ${isFavorite
                    ? 'fill-red-500 stroke-red-500'
                    : 'stroke-slate-400 group-hover:stroke-red-400 group-hover:scale-110'
                    } ${loading ? 'opacity-50' : ''}`}
            />
        </button>
    );
};

export default WishlistButton;
