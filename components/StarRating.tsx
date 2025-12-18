import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: number;
    onRate?: (rating: number) => void;
    readonly?: boolean;
    showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxRating = 5,
    size = 20,
    onRate,
    readonly = false,
    showValue = false,
}) => {
    const [hoveredRating, setHoveredRating] = React.useState(0);

    const handleClick = (value: number) => {
        if (!readonly && onRate) {
            onRate(value);
        }
    };

    const displayRating = hoveredRating || rating;

    return (
        <div className="flex items-center gap-1">
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= displayRating;
                const isPartiallyFilled = !Number.isInteger(displayRating) && starValue === Math.ceil(displayRating);

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => !readonly && setHoveredRating(starValue)}
                        onMouseLeave={() => !readonly && setHoveredRating(0)}
                        disabled={readonly}
                        className={`transition-all duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            }`}
                        aria-label={`Rate ${starValue} stars`}
                    >
                        <div className="relative">
                            <Star
                                size={size}
                                className={`transition-colors ${isFilled
                                        ? 'fill-yellow-400 stroke-yellow-400'
                                        : 'fill-none stroke-slate-600'
                                    }`}
                            />
                            {isPartiallyFilled && (
                                <div
                                    className="absolute top-0 left-0 overflow-hidden"
                                    style={{ width: `${(displayRating % 1) * 100}%` }}
                                >
                                    <Star
                                        size={size}
                                        className="fill-yellow-400 stroke-yellow-400"
                                    />
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
            {showValue && (
                <span className="ml-2 text-sm font-medium text-slate-300">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
