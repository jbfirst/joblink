import React, { ReactNode } from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: string;
  actionText?: string;
  onAction?: () => void;
  actionNode?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconName = 'search_off',
  actionText,
  onAction,
  actionNode,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-soft ${className}`}>
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
        <span className="material-symbols-outlined text-3xl">{iconName}</span>
      </div>
      <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-md mb-6">{description}</p>
      {actionNode || (actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      ))}
    </div>
  );
};
