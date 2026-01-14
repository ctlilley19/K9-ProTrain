'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import {
  skillCategories,
  skillLevels,
  getAllSkills,
} from '@/services/supabase/skills';
import {
  Target,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  Save,
  TrendingUp,
} from 'lucide-react';

interface Dog {
  id: string;
  name: string;
  breed?: string;
  photo_url?: string | null;
}

interface SkillAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dog: Dog;
  initialSkillId?: string;
  onAssess?: (skillId: string, level: number, notes?: string) => void;
}

const levelColors: Record<string, string> = {
  surface: 'bg-surface-700 text-surface-400',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export function SkillAssessmentModal({
  isOpen,
  onClose,
  dog,
  initialSkillId,
  onAssess,
}: SkillAssessmentModalProps) {
  const [step, setStep] = useState<'category' | 'skill' | 'assess'>(
    initialSkillId ? 'assess' : 'category'
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(initialSkillId || null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allSkills = getAllSkills();
  const skillInfo = allSkills.find((s) => s.id === selectedSkill);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('skill');
  };

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId);
    setStep('assess');
  };

  const handleBack = () => {
    if (step === 'assess') {
      if (initialSkillId) {
        onClose();
      } else {
        setStep('skill');
        setSelectedSkill(null);
        setSelectedLevel(null);
        setNotes('');
      }
    } else if (step === 'skill') {
      setStep('category');
      setSelectedCategory(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSkill || selectedLevel === null) return;

    setIsSubmitting(true);
    try {
      console.log('Assessing skill:', {
        dogId: dog.id,
        skillId: selectedSkill,
        level: selectedLevel,
        notes,
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      onAssess?.(selectedSkill, selectedLevel, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(initialSkillId ? 'assess' : 'category');
    setSelectedCategory(null);
    setSelectedSkill(initialSkillId || null);
    setSelectedLevel(null);
    setNotes('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} size="md">
      <ModalHeader>
        <div className="flex items-center gap-3">
          <Avatar name={dog.name} size="md" />
          <div>
            <h2 className="text-lg font-semibold text-white">Assess Skill</h2>
            <p className="text-sm text-surface-400">{dog.name}</p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        {/* Step 1: Select Category */}
        {step === 'category' && (
          <div className="space-y-2">
            <p className="text-sm text-surface-400 mb-4">Select a skill category</p>
            {Object.entries(skillCategories).map(([categoryId, category]) => (
              <button
                key={categoryId}
                type="button"
                onClick={() => handleCategorySelect(categoryId)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700 hover:border-brand-500/30 transition-all text-left"
              >
                <div>
                  <h3 className="font-medium text-white">{category.name}</h3>
                  <p className="text-sm text-surface-400">{category.skills.length} skills</p>
                </div>
                <ChevronRight size={20} className="text-surface-400" />
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select Skill */}
        {step === 'skill' && selectedCategory && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-surface-400 hover:text-white mb-4"
            >
              <ArrowLeft size={16} />
              Back to categories
            </button>
            <p className="text-sm text-surface-400 mb-4">
              Select a skill from{' '}
              {skillCategories[selectedCategory as keyof typeof skillCategories].name}
            </p>
            {skillCategories[selectedCategory as keyof typeof skillCategories].skills.map(
              (skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSkillSelect(skill.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-800/50 hover:bg-surface-800 border border-surface-700 hover:border-brand-500/30 transition-all text-left"
                >
                  <div>
                    <h3 className="font-medium text-white">{skill.name}</h3>
                    <p className="text-sm text-surface-400">{skill.description}</p>
                  </div>
                  <ChevronRight size={20} className="text-surface-400" />
                </button>
              )
            )}
          </div>
        )}

        {/* Step 3: Assess Level */}
        {step === 'assess' && skillInfo && (
          <div>
            {!initialSkillId && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-surface-400 hover:text-white mb-4"
              >
                <ArrowLeft size={16} />
                Back to skills
              </button>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Target size={18} className="text-brand-400" />
                <h3 className="font-medium text-white">{skillInfo.name}</h3>
              </div>
              <p className="text-sm text-surface-400">{skillInfo.description}</p>
            </div>

            <p className="text-sm text-surface-400 mb-3">Select proficiency level</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {skillLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setSelectedLevel(level.value)}
                  className={cn(
                    'p-4 rounded-xl border transition-all text-left',
                    selectedLevel === level.value
                      ? levelColors[level.color] + ' border-current'
                      : 'bg-surface-800/50 border-surface-700 hover:border-surface-600'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold',
                        selectedLevel === level.value
                          ? 'bg-white/10'
                          : levelColors[level.color]
                      )}
                    >
                      {level.value}
                    </div>
                    <div>
                      <p
                        className={cn(
                          'font-medium',
                          selectedLevel === level.value ? '' : 'text-white'
                        )}
                      >
                        {level.label}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Textarea
              label="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any observations or notes about this assessment..."
              className="min-h-[80px]"
            />
          </div>
        )}
      </ModalBody>

      {step === 'assess' && (
        <ModalFooter>
          <Button variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={selectedLevel === null}
            leftIcon={<Save size={16} />}
          >
            Save Assessment
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}

// Quick Skill Assessment Button Component
interface QuickSkillAssessButtonProps {
  dog: Dog;
  className?: string;
}

export function QuickSkillAssessButton({ dog, className }: QuickSkillAssessButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<TrendingUp size={16} />}
        onClick={() => setIsOpen(true)}
        className={className}
      >
        Assess Skill
      </Button>

      <SkillAssessmentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        dog={dog}
        onAssess={(skillId, level, notes) => {
          console.log('Skill assessed:', { skillId, level, notes });
        }}
      />
    </>
  );
}

// Skill Progress Badge Component
interface SkillProgressBadgeProps {
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillProgressBadge({
  level,
  showLabel = false,
  size = 'md',
}: SkillProgressBadgeProps) {
  const levelInfo = skillLevels[level];
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'rounded-lg flex items-center justify-center font-bold border',
          sizeClasses[size],
          levelColors[levelInfo.color]
        )}
      >
        {level}
      </div>
      {showLabel && (
        <span className="text-sm text-surface-400">{levelInfo.label}</span>
      )}
    </div>
  );
}
