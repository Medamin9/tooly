import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-control transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-tooly-red focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-tooly-red text-surface hover:bg-tooly-red-dark shadow-sm hover:shadow active:bg-tooly-red-dark',
      secondary:
        'bg-ink text-surface hover:bg-ink-light active:bg-ink',
      outline:
        'border border-line bg-surface text-ink hover:bg-paper hover:border-muted active:bg-paper-dark',
      ghost:
        'text-ink hover:bg-paper active:bg-paper-dark',
      destructive:
        'bg-danger text-surface hover:bg-red-700 active:bg-red-800',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
