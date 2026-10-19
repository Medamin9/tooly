'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 end-0 max-w-full flex">
        <div
          role="dialog"
          aria-modal="true"
          className="w-screen max-w-sm bg-surface border-s border-line shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
              <h3 className="text-lg font-bold text-ink">{title}</h3>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-1.5 rounded-control text-muted hover:text-ink hover:bg-paper transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
