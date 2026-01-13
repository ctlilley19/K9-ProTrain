'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Modal } from './Modal';
import {
  Upload,
  Camera,
  X,
  Image as ImageIcon,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface PhotoUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  onUpload?: (file: File) => Promise<string>;
  placeholder?: React.ReactNode;
  shape?: 'circle' | 'square' | 'rectangle';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

export function PhotoUpload({
  value,
  onChange,
  onUpload,
  placeholder,
  shape = 'square',
  size = 'md',
  className,
  disabled = false,
  accept = 'image/*',
  maxSizeMB = 5,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: shape === 'circle' ? 'w-16 h-16' : 'w-20 h-16',
    md: shape === 'circle' ? 'w-24 h-24' : 'w-32 h-24',
    lg: shape === 'circle' ? 'w-32 h-32' : 'w-48 h-32',
    xl: shape === 'circle' ? 'w-40 h-40' : 'w-64 h-40',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-xl',
    rectangle: 'rounded-xl',
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      if (onUpload) {
        setIsUploading(true);
        try {
          const url = await onUpload(file);
          onChange(url);
        } catch (err) {
          setError('Failed to upload image');
          console.error('Upload error:', err);
        } finally {
          setIsUploading(false);
        }
      } else {
        // Create local preview URL if no upload handler
        const url = URL.createObjectURL(file);
        onChange(url);
      }
    },
    [onUpload, onChange, maxSizeMB]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!disabled && e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative overflow-hidden cursor-pointer transition-all',
          'border-2 border-dashed',
          sizeClasses[size],
          shapeClasses[shape],
          disabled
            ? 'bg-surface-800 border-surface-700 cursor-not-allowed opacity-50'
            : dragActive
            ? 'bg-brand-500/10 border-brand-500'
            : value
            ? 'border-transparent hover:border-surface-600'
            : 'bg-surface-800/50 border-surface-700 hover:border-surface-600 hover:bg-surface-800'
        )}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleClick}
                  className="text-white hover:bg-white/20"
                >
                  <Camera size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleRemove}
                  className="text-white hover:bg-red-500/20 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            )}
          </>
        ) : isUploading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
            <span className="text-xs text-surface-400 mt-2">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-2">
            {placeholder || (
              <>
                <Upload
                  className={cn(
                    'text-surface-500',
                    size === 'sm' ? 'w-5 h-5' : 'w-8 h-8'
                  )}
                />
                {size !== 'sm' && (
                  <span className="text-xs text-surface-500 mt-2 text-center">
                    Click or drag to upload
                  </span>
                )}
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}

// Multi-photo upload gallery
interface PhotoGalleryUploadProps {
  photos: { id: string; url: string; caption?: string }[];
  onAdd: (file: File) => Promise<string>;
  onRemove: (id: string) => void;
  onSetCaption?: (id: string, caption: string) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

export function PhotoGalleryUpload({
  photos,
  onAdd,
  onRemove,
  onSetCaption,
  maxPhotos = 10,
  disabled = false,
}: PhotoGalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [captionModal, setCaptionModal] = useState<{
    id: string;
    caption: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await onAdd(file);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const canAddMore = photos.length < maxPhotos && !disabled;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square rounded-xl overflow-hidden group"
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Photo'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              {onSetCaption && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setCaptionModal({ id: photo.id, caption: photo.caption || '' })
                  }
                  className="text-white hover:bg-white/20"
                >
                  Caption
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(photo.id)}
                className="text-white hover:bg-red-500/20 hover:text-red-400"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                <p className="text-xs text-white truncate">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}

        {canAddMore && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              'aspect-square rounded-xl border-2 border-dashed',
              'flex flex-col items-center justify-center gap-2',
              'transition-colors',
              isUploading
                ? 'bg-surface-800 border-surface-700 cursor-wait'
                : 'bg-surface-800/50 border-surface-700 hover:border-surface-600 hover:bg-surface-800'
            )}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-surface-500" />
                <span className="text-xs text-surface-500">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleAdd}
        disabled={disabled || isUploading}
        className="hidden"
      />

      <p className="text-xs text-surface-500">
        {photos.length} of {maxPhotos} photos
      </p>

      {/* Caption Modal */}
      {captionModal && onSetCaption && (
        <Modal
          isOpen={true}
          onClose={() => setCaptionModal(null)}
          title="Edit Caption"
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setCaptionModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onSetCaption(captionModal.id, captionModal.caption);
                  setCaptionModal(null);
                }}
              >
                Save
              </Button>
            </>
          }
        >
          <textarea
            value={captionModal.caption}
            onChange={(e) =>
              setCaptionModal({ ...captionModal, caption: e.target.value })
            }
            placeholder="Enter photo caption..."
            className="w-full h-24 bg-surface-800 border border-surface-700 rounded-lg p-3 text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none resize-none"
            autoFocus
          />
        </Modal>
      )}
    </div>
  );
}

// Quick camera capture button for mobile
interface CameraCaptureProps {
  onCapture: (file: File) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function CameraCapture({
  onCapture,
  disabled = false,
  className,
}: CameraCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCapturing(true);
    try {
      await onCapture(file);
    } catch (err) {
      console.error('Capture error:', err);
    } finally {
      setIsCapturing(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        disabled={disabled || isCapturing}
        isLoading={isCapturing}
        leftIcon={<Camera size={20} />}
        onClick={() => inputRef.current?.click()}
        className={className}
      >
        Take Photo
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        disabled={disabled}
        className="hidden"
      />
    </>
  );
}
