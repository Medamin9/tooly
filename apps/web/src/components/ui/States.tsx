import React from 'react';
import { AlertCircle, FolderSearch, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface rounded-card border border-line p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-control bg-paper-dark" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-paper-dark rounded w-1/2" />
              <div className="h-3 bg-paper-dark rounded w-1/3" />
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-3 bg-paper-dark rounded w-full" />
            <div className="h-3 bg-paper-dark rounded w-4/5" />
          </div>
          <div className="h-8 bg-paper-dark rounded-control w-full" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
}: {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-surface rounded-card border border-line">
      <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center text-muted mb-4">
        <FolderSearch className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-ink mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-muted max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function ErrorBanner({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-control bg-red-50 border border-red-200 text-danger">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div>
          <h4 className="text-sm font-bold">{title}</h4>
          <p className="text-xs text-red-700 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button variant="destructive" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          <span>إعادة المحاولة</span>
        </Button>
      )}
    </div>
  );
}
