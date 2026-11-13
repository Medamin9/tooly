import React from 'react';
import { PageLoader } from '@/components/ui/PageLoader';

export default function TestLoaderPage() {
  return (
    <main className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-paper p-8 rounded-2xl border border-line shadow-xl">
        <PageLoader fullscreen={false} />
      </div>
    </main>
  );
}

