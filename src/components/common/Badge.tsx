import React, { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'info' | 'primary' | 'neutral' | 'error';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  icon?: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-secondary-container text-on-secondary-container border-secondary/20',
    warning: 'bg-[#ffdad6]/70 text-[#93000a] border-error/20',
    info: 'bg-surface-variant text-on-surface-variant border-outline-variant/30',
    primary: 'bg-primary-fixed text-on-primary-fixed border-primary/20',
    neutral: 'bg-[#EDF2F7] text-on-surface-variant border-transparent',
    error: 'bg-error-container text-on-error-container border-error/20'
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-xs font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
