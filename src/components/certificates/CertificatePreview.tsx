'use client';

import { forwardRef } from 'react';
import { formatDate } from '@/lib/utils';
import { certificateTemplates, CertificateTemplate } from '@/services/supabase/certificates';

interface CertificatePreviewProps {
  template: CertificateTemplate;
  dogName: string;
  ownerName: string;
  facilityName: string;
  trainerName: string;
  issuedDate: string;
  customTitle?: string;
  customDescription?: string;
  skillsMastered?: string[];
  programName?: string;
  dogPhoto?: string | null;
  facilityLogo?: string | null;
}

const templateColors: Record<string, { primary: string; secondary: string; accent: string }> = {
  blue: {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#dbeafe',
  },
  gold: {
    primary: '#92400e',
    secondary: '#f59e0b',
    accent: '#fef3c7',
  },
  purple: {
    primary: '#5b21b6',
    secondary: '#8b5cf6',
    accent: '#ede9fe',
  },
  green: {
    primary: '#166534',
    secondary: '#22c55e',
    accent: '#dcfce7',
  },
  teal: {
    primary: '#115e59',
    secondary: '#14b8a6',
    accent: '#ccfbf1',
  },
  red: {
    primary: '#991b1b',
    secondary: '#ef4444',
    accent: '#fee2e2',
  },
};

export const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  (
    {
      template,
      dogName,
      ownerName,
      facilityName,
      trainerName,
      issuedDate,
      customTitle,
      customDescription,
      skillsMastered,
      programName,
      dogPhoto,
      facilityLogo,
    },
    ref
  ) => {
    const templateInfo = certificateTemplates[template];
    const colors = templateColors[templateInfo.color];
    const title = customTitle || templateInfo.title;
    const description = customDescription || templateInfo.description;

    return (
      <div
        ref={ref}
        className="certificate-preview bg-white text-gray-900 relative overflow-hidden"
        style={{
          width: '800px',
          height: '600px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Decorative Border */}
        <div
          className="absolute inset-4 border-4 rounded-lg"
          style={{ borderColor: colors.primary }}
        />
        <div
          className="absolute inset-6 border-2 rounded-lg"
          style={{ borderColor: colors.secondary }}
        />

        {/* Corner Decorations */}
        <div
          className="absolute top-8 left-8 w-16 h-16 opacity-20"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute top-8 right-8 w-16 h-16 opacity-20"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute bottom-8 left-8 w-16 h-16 opacity-20"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute bottom-8 right-8 w-16 h-16 opacity-20"
          style={{ backgroundColor: colors.primary }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-between py-12 px-16">
          {/* Header */}
          <div className="text-center">
            {facilityLogo ? (
              <img
                src={facilityLogo}
                alt={facilityName}
                className="h-12 mx-auto mb-2 object-contain"
              />
            ) : (
              <div className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>
                {facilityName}
              </div>
            )}
            <div
              className="text-4xl font-bold mb-1 tracking-wide"
              style={{ color: colors.primary }}
            >
              {title}
            </div>
            <div className="text-xl" style={{ color: colors.secondary }}>
              {templateInfo.subtitle}
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            {/* Icon */}
            <div className="text-5xl mb-4">{templateInfo.icon}</div>

            {/* Presentation text */}
            <p className="text-lg text-gray-600 mb-2">This certifies that</p>

            {/* Dog Name */}
            <h2
              className="text-5xl font-bold mb-4"
              style={{
                color: colors.primary,
                fontFamily: 'Brush Script MT, cursive',
              }}
            >
              {dogName}
            </h2>

            {/* Owner */}
            <p className="text-gray-600 mb-4">
              owned by <span className="font-semibold text-gray-800">{ownerName}</span>
            </p>

            {/* Description */}
            <p className="text-lg text-gray-700 max-w-md mb-4">{description}</p>

            {/* Program Name */}
            {programName && (
              <p className="text-gray-600 italic">Program: {programName}</p>
            )}

            {/* Skills Mastered */}
            {skillsMastered && skillsMastered.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Skills Mastered:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {skillsMastered.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.primary,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="w-full flex justify-between items-end pt-4">
            {/* Date */}
            <div className="text-center">
              <div className="w-40 border-t border-gray-400 mb-1" />
              <p className="text-sm text-gray-600">Date Issued</p>
              <p className="font-semibold">{formatDate(issuedDate, 'MMMM d, yyyy')}</p>
            </div>

            {/* Certificate ID (decorative) */}
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: colors.accent,
                  border: `3px solid ${colors.primary}`,
                }}
              >
                <span style={{ color: colors.primary, fontSize: '32px' }}>✓</span>
              </div>
            </div>

            {/* Trainer Signature */}
            <div className="text-center">
              <div className="w-40 border-t border-gray-400 mb-1" />
              <p className="text-sm text-gray-600">Trainer</p>
              <p className="font-semibold">{trainerName}</p>
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5"
          style={{ fontSize: '200px', color: colors.primary }}
        >
          {templateInfo.icon}
        </div>
      </div>
    );
  }
);

CertificatePreview.displayName = 'CertificatePreview';
