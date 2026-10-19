import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full text-start">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-ink">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-surface text-ink text-sm rounded-control border ${
            error ? 'border-danger focus:border-danger' : 'border-line focus:border-tooly-red'
          } placeholder:text-muted/60 focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-danger' : 'focus:ring-tooly-red'
          } transition-colors ${className}`}
          {...props}
        />
        {hint && !error && <span className="text-[11px] text-muted">{hint}</span>}
        {error && <span className="text-[11px] text-danger font-medium">{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
