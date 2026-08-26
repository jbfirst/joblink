import React from 'react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Une erreur est survenue',
  message = 'Impossible de charger les données. Veuillez vérifier votre connexion et réessayer.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white border border-error/20 rounded-2xl shadow-soft ${className}`}>
      <div className="w-16 h-16 rounded-full bg-error-container/50 flex items-center justify-center text-error mb-4">
        <span className="material-symbols-outlined text-3xl">error_outline</span>
      </div>
      <h3 className="text-lg font-bold text-error mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} leftIcon={<span className="material-symbols-outlined text-sm">refresh</span>}>
          Réessayer
        </Button>
      )}
    </div>
  );
};
