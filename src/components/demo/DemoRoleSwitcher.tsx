'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useDemoPersona, useIsDemoMode, type DemoPersona } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import {
  Settings2,
  Home,
  ClipboardList,
  Briefcase,
  ChevronUp,
  X,
  Sparkles,
} from 'lucide-react';

const personaConfig: Record<DemoPersona, { label: string; icon: typeof Home; color: string; path: string }> = {
  dog_owner: {
    label: 'Family',
    icon: Home,
    color: 'blue',
    path: '/parent',
  },
  trainer: {
    label: 'Trainer',
    icon: ClipboardList,
    color: 'green',
    path: '/dashboard',
  },
  manager: {
    label: 'Manager',
    icon: Briefcase,
    color: 'purple',
    path: '/dashboard',
  },
};

export function DemoRoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const isDemoMode = useIsDemoMode();
  const currentPersona = useDemoPersona();
  const { setDemoPersona } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in demo mode
  if (!isDemoMode) return null;

  const current = currentPersona ? personaConfig[currentPersona] : null;

  const handlePersonaChange = (persona: DemoPersona) => {
    setDemoPersona(persona);
    setIsExpanded(false);

    // Redirect to appropriate view
    const config = personaConfig[persona];
    const currentBase = '/' + pathname.split('/')[1];
    if (config.path !== currentBase) {
      router.push(config.path);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-surface-800 border border-surface-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-surface-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-400" />
              <span className="text-sm font-medium text-white">Demo Mode</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-surface-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Persona Options */}
          <div className="p-2">
            {(Object.entries(personaConfig) as [DemoPersona, typeof personaConfig[DemoPersona]][]).map(([key, config]) => {
              const isActive = currentPersona === key;
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => handlePersonaChange(key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                    isActive
                      ? 'bg-brand-500/10 text-brand-400'
                      : 'text-surface-300 hover:bg-surface-700'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    config.color === 'blue' && 'bg-blue-500/20 text-blue-400',
                    config.color === 'green' && 'bg-green-500/20 text-green-400',
                    config.color === 'purple' && 'bg-purple-500/20 text-purple-400',
                  )}>
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-medium">{config.label}</span>
                  {isActive && (
                    <span className="ml-auto text-xs text-brand-400">Active</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-surface-700">
            <button
              onClick={() => {
                setIsExpanded(false);
                router.push('/demo/config');
              }}
              className="text-xs text-surface-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Settings2 size={12} />
              Demo Configuration
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all',
          'bg-surface-800 border border-surface-700 hover:border-surface-600',
          isExpanded && 'ring-2 ring-brand-500/50'
        )}
      >
        {current ? (
          <>
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center',
              current.color === 'blue' && 'bg-blue-500/20 text-blue-400',
              current.color === 'green' && 'bg-green-500/20 text-green-400',
              current.color === 'purple' && 'bg-purple-500/20 text-purple-400',
            )}>
              <current.icon size={14} />
            </div>
            <span className="text-sm font-medium text-white">{current.label}</span>
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-brand-500/20 text-brand-400">
              <Sparkles size={14} />
            </div>
            <span className="text-sm font-medium text-white">Demo</span>
          </>
        )}
        <ChevronUp
          size={14}
          className={cn(
            'text-surface-400 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>
    </div>
  );
}
