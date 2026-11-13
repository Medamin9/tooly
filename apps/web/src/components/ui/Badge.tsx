import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'demo' | 'success' | 'warning' | 'accent' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className = '',
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';

  const variants = {
    default: 'bg-paper text-ink border border-line',
    demo: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25',
    success: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25',
    accent: 'bg-tooly-soft-red text-tooly-red border border-tooly-red/20 font-semibold',
    outline: 'border border-line text-muted',
  };

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}
