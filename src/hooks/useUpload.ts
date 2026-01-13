'use client';

import { useState, useCallback } from 'react';
import { mediaService } from '@/services/supabase';
import type { MediaUploadOptions } from '@/services/supabase/media';

interface UseUploadOptions {
  bucket?: 'media' | 'logos' | 'avatars' | 'documents';
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

interface UseUploadReturn {
  upload: (file: File, options?: Partial<MediaUploadOptions>) => Promise<string | null>;
  isUploading: boolean;
  progress: number;
  error: Error | null;
  reset: () => void;
}

export function useUpload(options: UseUploadOptions = {}): UseUploadReturn {
  const { bucket = 'media', onSuccess, onError } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const upload = useCallback(
    async (file: File, uploadOptions?: Partial<MediaUploadOptions>): Promise<string | null> => {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        // Simulate progress (Supabase doesn't provide real progress for small files)
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const url = await mediaService.uploadFile(file, {
          bucket,
          ...uploadOptions,
        });

        clearInterval(progressInterval);
        setProgress(100);
        setIsUploading(false);

        onSuccess?.(url);
        return url;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed');
        setError(error);
        setIsUploading(false);
        onError?.(error);
        return null;
      }
    },
    [bucket, onSuccess, onError]
  );

  return {
    upload,
    isUploading,
    progress,
    error,
    reset,
  };
}

// Hook for uploading dog photos
interface UseDogPhotoUploadOptions {
  dogId: string;
  onSuccess?: (url: string) => void;
}

export function useDogPhotoUpload({ dogId, onSuccess }: UseDogPhotoUploadOptions) {
  return useUpload({
    bucket: 'media',
    onSuccess: (url) => {
      console.log(`Photo uploaded for dog ${dogId}: ${url}`);
      onSuccess?.(url);
    },
  });
}

// Hook for uploading activity media
interface UseActivityMediaUploadOptions {
  activityId: string;
  onSuccess?: (mediaId: string) => void;
}

export function useActivityMediaUpload({
  activityId,
  onSuccess,
}: UseActivityMediaUploadOptions) {
  const [mediaId, setMediaId] = useState<string | null>(null);

  const { upload, ...rest } = useUpload({
    bucket: 'media',
    onSuccess: async (url) => {
      // In a real app, we would create a media record linked to the activity
      // For now, just log and call the callback
      const id = crypto.randomUUID();
      setMediaId(id);
      console.log(`Activity media uploaded: ${url}, mediaId: ${id}`);
      onSuccess?.(id);
    },
  });

  const uploadMedia = useCallback(
    async (file: File, caption?: string, isHighlight?: boolean) => {
      return upload(file, {
        folder: `activities/${activityId}`,
      });
    },
    [upload, activityId]
  );

  return {
    uploadMedia,
    mediaId,
    ...rest,
  };
}

// Hook for uploading profile avatars
interface UseAvatarUploadOptions {
  entityType: 'user' | 'dog' | 'family';
  entityId: string;
  onSuccess?: (url: string) => void;
}

export function useAvatarUpload({
  entityType,
  entityId,
  onSuccess,
}: UseAvatarUploadOptions) {
  return useUpload({
    bucket: 'avatars',
    onSuccess: (url) => {
      console.log(`Avatar uploaded for ${entityType} ${entityId}: ${url}`);
      onSuccess?.(url);
    },
  });
}

// Hook for batch uploading multiple files
interface UseBatchUploadOptions {
  bucket?: 'media' | 'logos' | 'avatars' | 'documents';
  maxConcurrent?: number;
  onFileSuccess?: (file: File, url: string) => void;
  onFileError?: (file: File, error: Error) => void;
  onComplete?: (results: { file: File; url: string | null; error?: Error }[]) => void;
}

interface UseBatchUploadReturn {
  uploadBatch: (files: File[]) => Promise<{ file: File; url: string | null; error?: Error }[]>;
  isUploading: boolean;
  progress: { total: number; completed: number; percentage: number };
  results: { file: File; url: string | null; error?: Error }[];
  reset: () => void;
}

export function useBatchUpload(options: UseBatchUploadOptions = {}): UseBatchUploadReturn {
  const {
    bucket = 'media',
    maxConcurrent = 3,
    onFileSuccess,
    onFileError,
    onComplete,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ total: 0, completed: 0, percentage: 0 });
  const [results, setResults] = useState<{ file: File; url: string | null; error?: Error }[]>([]);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress({ total: 0, completed: 0, percentage: 0 });
    setResults([]);
  }, []);

  const uploadBatch = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      setProgress({ total: files.length, completed: 0, percentage: 0 });
      setResults([]);

      const allResults: { file: File; url: string | null; error?: Error }[] = [];

      // Process files in batches
      for (let i = 0; i < files.length; i += maxConcurrent) {
        const batch = files.slice(i, i + maxConcurrent);
        const batchPromises = batch.map(async (file) => {
          try {
            const url = await mediaService.uploadFile(file, { bucket });
            onFileSuccess?.(file, url);
            return { file, url, error: undefined };
          } catch (err) {
            const error = err instanceof Error ? err : new Error('Upload failed');
            onFileError?.(file, error);
            return { file, url: null, error };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        allResults.push(...batchResults);

        const completed = Math.min(i + maxConcurrent, files.length);
        setProgress({
          total: files.length,
          completed,
          percentage: Math.round((completed / files.length) * 100),
        });
      }

      setResults(allResults);
      setIsUploading(false);
      onComplete?.(allResults);

      return allResults;
    },
    [bucket, maxConcurrent, onFileSuccess, onFileError, onComplete]
  );

  return {
    uploadBatch,
    isUploading,
    progress,
    results,
    reset,
  };
}
