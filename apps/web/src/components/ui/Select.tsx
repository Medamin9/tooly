import React, { forwardRef } from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full text-start">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-ink">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-surface text-ink text-sm rounded-control border ${
            error ? 'border-danger focus:border-danger' : 'border-line focus:border-tooly-red'
          } focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-danger' : 'focus:ring-tooly-red'
          } transition-colors ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-[11px] text-danger font-medium">{error}</span>}
      </div>
    );
  },
);

Select.displayName = 'Select';
