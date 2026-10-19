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
    demo: 'bg-amber-50 text-amber-900 border border-amber-200/80',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    accent: 'bg-tooly-soft-red text-tooly-red border border-tooly-red/20 font-semibold',
    outline: 'border border-line text-muted',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}
