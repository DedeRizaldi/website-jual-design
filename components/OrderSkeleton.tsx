import React from 'react';

const OrderSkeleton: React.FC = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-pulse">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800">
                <div className="flex justify-between">
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-800 rounded w-24"></div>
                        <div className="h-3 bg-slate-800 rounded w-32"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-800 rounded w-16"></div>
                        <div className="h-4 bg-slate-800 rounded w-20"></div>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-800">
                {[1, 2].map((i) => (
                    <div key={i} className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            {/* Image */}
                            <div className="w-16 h-16 bg-slate-800 rounded-lg"></div>

                            {/* Details */}
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-800 rounded w-1/4"></div>
                            </div>
                        </div>

                        {/* Button */}
                        <div className="h-10 w-28 bg-slate-800 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderSkeleton;
