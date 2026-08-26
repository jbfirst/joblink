import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-surface-variant/70 rounded-lg ${className}`}
    />
  );
};

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-soft flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-lg bg-surface-variant/80" />
        <div className="w-16 h-6 rounded-full bg-surface-variant/80" />
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-6 rounded bg-surface-variant/80" />
        <div className="w-1/2 h-4 rounded bg-surface-variant/60" />
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-outline-variant/20">
        <div className="w-16 h-6 rounded-full bg-surface-variant/60" />
        <div className="w-20 h-6 rounded-full bg-surface-variant/60" />
      </div>
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-soft flex items-center justify-between animate-pulse">
      <div className="space-y-2 flex-1">
        <div className="w-24 h-4 rounded bg-surface-variant/60" />
        <div className="w-16 h-8 rounded bg-surface-variant/80" />
      </div>
      <div className="w-12 h-12 rounded-full bg-surface-variant/80 shrink-0" />
    </div>
  );
};
