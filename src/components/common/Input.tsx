import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-primary flex items-center justify-between">
            <span>{label}</span>
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-outline">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-surface-container-lowest border rounded-lg py-2.5 px-3.5 text-sm text-on-surface placeholder:text-outline/60 focus:outline-none focus:ring-2 transition-all ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-outline-variant/60 focus:border-primary focus:ring-primary/15'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-outline">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-error font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-on-surface-variant">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
