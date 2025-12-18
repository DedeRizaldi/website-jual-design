import React, { ButtonHTMLAttributes } from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'font-medium rounded-lg transition-all inline-flex items-center justify-center';

    const variantStyles = {
        primary: 'bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-600/50',
        secondary: 'bg-slate-700 text-white hover:bg-slate-600 disabled:bg-slate-700/50',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/50',
        ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800 disabled:text-slate-500'
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} disabled:cursor-not-allowed`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};
