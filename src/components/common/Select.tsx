import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (SelectOption | string)[];
  error?: string;
  leftIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, leftIcon, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-semibold text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-outline">
              {leftIcon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none bg-surface-container-lowest border rounded-lg py-2.5 px-3.5 pr-10 text-sm text-on-surface focus:outline-none focus:ring-2 transition-all ${
              leftIcon ? 'pl-10' : ''
            } ${
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-outline-variant/60 focus:border-primary focus:ring-primary/15'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value;
              const labelText = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={value} value={value}>
                  {labelText}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3.5 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[20px]">expand_more</span>
          </div>
        </div>
        {error && <p className="text-xs text-error font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
