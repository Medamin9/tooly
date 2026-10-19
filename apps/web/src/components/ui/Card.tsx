import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({
  className = '',
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-surface rounded-card border border-line p-6 shadow-sm transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-tooly-red/40 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
