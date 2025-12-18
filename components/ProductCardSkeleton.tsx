import React from 'react';

const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-square bg-slate-800"></div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Category */}
                <div className="h-3 bg-slate-800 rounded w-1/3"></div>

                {/* Title */}
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>

                {/* Price */}
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
