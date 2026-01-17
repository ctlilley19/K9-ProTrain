'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-surface-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">You're Offline</h1>
        <p className="text-surface-400 mb-6">
          It looks like you've lost your internet connection.
          Please check your connection and try again.
        </p>
        <Button onClick={handleRetry} className="inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <p className="text-sm text-surface-500 mt-6">
          Some features may still be available offline.
          Your data will sync when you're back online.
        </p>
      </div>
    </div>
  );
}
