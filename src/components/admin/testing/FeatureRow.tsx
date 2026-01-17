'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  CircleDashed,
  Save,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { TestNoteStatus } from '@/types/database';
import type { FeatureWithTestNote } from '@/services/test-notes';

interface FeatureRowProps {
  feature: FeatureWithTestNote;
  onStatusChange: (featureId: string, status: TestNoteStatus) => void;
  onNotesChange: (featureId: string, notes: string) => void;
}

const statusOptions: { value: TestNoteStatus; label: string; color: string }[] = [
  { value: 'not_tested', label: 'Not Tested', color: 'text-surface-400' },
  { value: 'testing', label: 'Testing', color: 'text-blue-400' },
  { value: 'passed', label: 'Passed', color: 'text-green-400' },
  { value: 'failed', label: 'Failed', color: 'text-red-400' },
  { value: 'blocked', label: 'Blocked', color: 'text-yellow-400' },
];

const statusIcons: Record<TestNoteStatus, React.ReactNode> = {
  not_tested: <CircleDashed size={16} className="text-surface-400" />,
  testing: <Clock size={16} className="text-blue-400" />,
  passed: <CheckCircle2 size={16} className="text-green-400" />,
  failed: <XCircle size={16} className="text-red-400" />,
  blocked: <AlertTriangle size={16} className="text-yellow-400" />,
};

const statusBadgeVariants: Record<TestNoteStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  not_tested: 'default',
  testing: 'info',
  passed: 'success',
  failed: 'danger',
  blocked: 'warning',
};

export function FeatureRow({ feature, onStatusChange, onNotesChange }: FeatureRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localNotes, setLocalNotes] = useState(feature.testNote?.notes || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const notesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentStatus = feature.testNote?.status || 'not_tested';

  // Update local notes when feature changes
  useEffect(() => {
    setLocalNotes(feature.testNote?.notes || '');
    setHasUnsavedChanges(false);
  }, [feature.testNote?.notes]);

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value as TestNoteStatus;
      onStatusChange(feature.id, newStatus);
    },
    [feature.id, onStatusChange]
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newNotes = e.target.value;
      setLocalNotes(newNotes);
      setHasUnsavedChanges(true);

      // Debounce the save
      if (notesTimeoutRef.current) {
        clearTimeout(notesTimeoutRef.current);
      }

      notesTimeoutRef.current = setTimeout(() => {
        onNotesChange(feature.id, newNotes);
        setHasUnsavedChanges(false);
      }, 1000);
    },
    [feature.id, onNotesChange]
  );

  const saveNotes = useCallback(() => {
    if (notesTimeoutRef.current) {
      clearTimeout(notesTimeoutRef.current);
    }
    onNotesChange(feature.id, localNotes);
    setHasUnsavedChanges(false);
  }, [feature.id, localNotes, onNotesChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (notesTimeoutRef.current) {
        clearTimeout(notesTimeoutRef.current);
      }
    };
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border border-surface-700/50 rounded-lg overflow-hidden">
      {/* Main Row */}
      <div
        className={`flex items-center gap-3 p-3 bg-surface-800/50 hover:bg-surface-800 transition-colors cursor-pointer ${
          isExpanded ? 'border-b border-surface-700/50' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Icon */}
        <button className="text-surface-400 hover:text-white transition-colors">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Status Icon */}
        <div className="flex-shrink-0">{statusIcons[currentStatus]}</div>

        {/* Feature Name */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{feature.name}</p>
          <p className="text-xs text-surface-400 truncate">{feature.path}</p>
        </div>

        {/* Status Badge */}
        <StatusBadge variant={statusBadgeVariants[currentStatus]} size="sm">
          {statusOptions.find(s => s.value === currentStatus)?.label}
        </StatusBadge>

        {/* Last Tested */}
        <div className="hidden sm:block text-xs text-surface-500 w-28 text-right">
          {formatDate(feature.testNote?.tested_at || null)}
        </div>

        {/* Quick Link */}
        <a
          href={feature.path.replace('[id]', '1').replace('[code]', 'demo')}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-surface-400 hover:text-brand-400 transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 bg-surface-900/50 space-y-4">
          {/* Description */}
          {feature.description && (
            <p className="text-sm text-surface-300">{feature.description}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Status Select */}
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">
                Status
              </label>
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                onClick={e => e.stopPropagation()}
                className="w-full px-3 py-2 bg-surface-800 border border-surface-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tested By */}
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">
                Tested By
              </label>
              <p className="px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-surface-300 text-sm">
                {feature.testNote?.tested_by || 'Not set'}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-surface-400">Notes</label>
              {hasUnsavedChanges && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    saveNotes();
                  }}
                  leftIcon={<Save size={14} />}
                  className="text-xs h-6"
                >
                  Save
                </Button>
              )}
            </div>
            <textarea
              value={localNotes}
              onChange={handleNotesChange}
              onClick={e => e.stopPropagation()}
              placeholder="Add testing notes..."
              rows={3}
              className="w-full px-3 py-2 bg-surface-800 border border-surface-600 rounded-lg text-white text-sm placeholder-surface-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Timestamps */}
          <div className="flex gap-6 text-xs text-surface-500">
            <span>Created: {formatDate(feature.testNote?.created_at || null)}</span>
            <span>Updated: {formatDate(feature.testNote?.updated_at || null)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
