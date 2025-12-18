import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    iconColor = 'text-brand-400',
    iconBg = 'bg-brand-600/20'
}) => {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:shadow-lg hover:shadow-black/20 transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <p className="text-white text-3xl font-bold">{value}</p>
                </div>
                <div className={`${iconBg} ${iconColor} p-3 rounded-lg`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};
