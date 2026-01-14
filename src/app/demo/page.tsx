'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoPersona } from '@/stores/authStore';
import { Loader2, Dog } from 'lucide-react';

export default function DemoPage() {
  const router = useRouter();
  const existingPersona = useDemoPersona();

  useEffect(() => {
    // If already has a persona, go to appropriate dashboard
    if (existingPersona) {
      const path = existingPersona === 'dog_owner' ? '/parent' : '/dashboard';
      router.push(path);
    } else {
      // First time - show config page to select persona
      router.push('/demo/config');
    }
  }, [existingPersona, router]);

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center shadow-glow-amber mb-6">
        <Dog size={32} className="text-white" />
      </div>
      <Loader2 className="h-8 w-8 animate-spin text-brand-500 mb-4" />
      <p className="text-surface-400">Loading demo mode...</p>
    </div>
  );
}
