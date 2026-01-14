// Automated Report Generation Service
// Generates daily reports from activity data with AI-powered summaries

import { skillLevels } from './supabase/skills';

interface Activity {
  id: string;
  type: 'training' | 'feeding' | 'potty' | 'play' | 'rest' | 'kennel';
  start_time: string;
  end_time?: string;
  duration: number;
  notes?: string;
  skills_worked?: string[];
}

interface SkillAssessment {
  skill_id: string;
  skill_name: string;
  level: number;
  previous_level?: number;
}

interface DogContext {
  name: string;
  breed: string;
  programName: string;
  programDay: number;
  totalProgramDays: number;
}

interface GeneratedReport {
  summary: string;
  mood: 'excellent' | 'good' | 'fair' | 'poor';
  energy_level: 'low' | 'normal' | 'high';
  appetite: 'excellent' | 'good' | 'fair' | 'poor';
  potty: 'normal' | 'soft' | 'diarrhea' | 'accident';
  highlights: string[];
  areas_to_improve: string[];
  tomorrow_focus: string;
  training_summary: string;
  skills_practiced: string[];
  total_training_minutes: number;
}

// Activity type labels for natural language
const activityLabels: Record<string, string> = {
  training: 'training session',
  feeding: 'meal time',
  potty: 'potty break',
  play: 'play session',
  rest: 'rest period',
  kennel: 'kennel time',
};

// Mood inference based on activities
function inferMood(activities: Activity[]): 'excellent' | 'good' | 'fair' | 'poor' {
  const trainingActivities = activities.filter((a) => a.type === 'training');
  const playActivities = activities.filter((a) => a.type === 'play');

  // Check for positive indicators in notes
  const positiveKeywords = ['great', 'excellent', 'happy', 'excited', 'focused', 'engaged', 'responsive'];
  const negativeKeywords = ['stressed', 'anxious', 'distracted', 'reluctant', 'tired', 'frustrated'];

  let positiveScore = 0;
  let negativeScore = 0;

  activities.forEach((activity) => {
    if (activity.notes) {
      const notesLower = activity.notes.toLowerCase();
      positiveKeywords.forEach((word) => {
        if (notesLower.includes(word)) positiveScore++;
      });
      negativeKeywords.forEach((word) => {
        if (notesLower.includes(word)) negativeScore++;
      });
    }
  });

  // Factor in activity variety and duration
  const hasGoodTraining = trainingActivities.length > 0 &&
    trainingActivities.reduce((sum, a) => sum + a.duration, 0) >= 30;
  const hasPlay = playActivities.length > 0;

  if (positiveScore > negativeScore + 2 && hasGoodTraining) return 'excellent';
  if (positiveScore >= negativeScore && hasGoodTraining && hasPlay) return 'good';
  if (negativeScore > positiveScore + 1) return 'fair';
  if (negativeScore > positiveScore + 3) return 'poor';

  return 'good';
}

// Energy level inference
function inferEnergyLevel(activities: Activity[]): 'low' | 'normal' | 'high' {
  const playMinutes = activities
    .filter((a) => a.type === 'play')
    .reduce((sum, a) => sum + a.duration, 0);
  const restMinutes = activities
    .filter((a) => a.type === 'rest')
    .reduce((sum, a) => sum + a.duration, 0);

  // Check notes for energy indicators
  const allNotes = activities.map((a) => a.notes || '').join(' ').toLowerCase();

  if (allNotes.includes('high energy') || allNotes.includes('very active') || playMinutes > 90) {
    return 'high';
  }
  if (allNotes.includes('low energy') || allNotes.includes('tired') || restMinutes > 180) {
    return 'low';
  }

  return 'normal';
}

// Appetite inference from feeding activities
function inferAppetite(activities: Activity[]): 'excellent' | 'good' | 'fair' | 'poor' {
  const feedingActivities = activities.filter((a) => a.type === 'feeding');

  if (feedingActivities.length === 0) return 'good';

  const allNotes = feedingActivities.map((a) => a.notes || '').join(' ').toLowerCase();

  if (allNotes.includes('ate all') || allNotes.includes('finished') || allNotes.includes('cleaned bowl')) {
    return 'excellent';
  }
  if (allNotes.includes('ate most') || allNotes.includes('good appetite')) {
    return 'good';
  }
  if (allNotes.includes('ate some') || allNotes.includes('picky') || allNotes.includes('half')) {
    return 'fair';
  }
  if (allNotes.includes('didn\'t eat') || allNotes.includes('refused') || allNotes.includes('no appetite')) {
    return 'poor';
  }

  return 'good';
}

// Potty status inference
function inferPottyStatus(activities: Activity[]): 'normal' | 'soft' | 'diarrhea' | 'accident' {
  const pottyActivities = activities.filter((a) => a.type === 'potty');
  const allNotes = pottyActivities.map((a) => a.notes || '').join(' ').toLowerCase();

  if (allNotes.includes('diarrhea') || allNotes.includes('loose')) {
    return 'diarrhea';
  }
  if (allNotes.includes('soft')) {
    return 'soft';
  }
  if (allNotes.includes('accident') || allNotes.includes('inside')) {
    return 'accident';
  }

  return 'normal';
}

// Generate highlights from activities
function generateHighlights(
  activities: Activity[],
  skillAssessments: SkillAssessment[],
  dog: DogContext
): string[] {
  const highlights: string[] = [];

  // Check for skill improvements
  const improvedSkills = skillAssessments.filter(
    (s) => s.previous_level !== undefined && s.level > s.previous_level
  );

  if (improvedSkills.length > 0) {
    const skillNames = improvedSkills.map((s) => s.skill_name).slice(0, 3);
    highlights.push(
      `Showed improvement in ${skillNames.join(', ')}${improvedSkills.length > 3 ? ` and ${improvedSkills.length - 3} more skills` : ''}`
    );
  }

  // Check for mastered skills
  const masteredSkills = skillAssessments.filter((s) => s.level === 5);
  if (masteredSkills.length > 0) {
    highlights.push(
      `Mastered ${masteredSkills.map((s) => s.skill_name).join(', ')}!`
    );
  }

  // Check activity notes for positive highlights
  activities.forEach((activity) => {
    if (activity.notes) {
      const notes = activity.notes.toLowerCase();
      if (
        notes.includes('great') ||
        notes.includes('excellent') ||
        notes.includes('breakthrough') ||
        notes.includes('first time')
      ) {
        highlights.push(activity.notes);
      }
    }
  });

  // Training duration highlight
  const trainingMinutes = activities
    .filter((a) => a.type === 'training')
    .reduce((sum, a) => sum + a.duration, 0);

  if (trainingMinutes >= 60) {
    highlights.push(`Completed ${trainingMinutes} minutes of focused training today`);
  }

  // Default highlight if none found
  if (highlights.length === 0) {
    highlights.push(`${dog.name} had a productive day with good focus during training`);
  }

  return highlights.slice(0, 5);
}

// Generate areas to improve
function generateAreasToImprove(
  activities: Activity[],
  skillAssessments: SkillAssessment[]
): string[] {
  const areas: string[] = [];

  // Find skills that need work (level 1-3)
  const developingSkills = skillAssessments.filter((s) => s.level >= 1 && s.level <= 3);

  if (developingSkills.length > 0) {
    const skillNames = developingSkills.slice(0, 2).map((s) => s.skill_name);
    areas.push(`Continue working on ${skillNames.join(' and ')}`);
  }

  // Check activity notes for challenges
  activities.forEach((activity) => {
    if (activity.notes) {
      const notes = activity.notes.toLowerCase();
      if (
        notes.includes('struggled') ||
        notes.includes('needs work') ||
        notes.includes('distracted') ||
        notes.includes('reactive')
      ) {
        areas.push(activity.notes);
      }
    }
  });

  // Default area if none found
  if (areas.length === 0) {
    areas.push('Continue reinforcing learned behaviors in new environments');
  }

  return areas.slice(0, 3);
}

// Generate tomorrow's focus
function generateTomorrowFocus(
  skillAssessments: SkillAssessment[],
  dog: DogContext
): string {
  // Find skills close to leveling up
  const nearLevelUp = skillAssessments.filter(
    (s) => s.level >= 3 && s.level < 5
  );

  if (nearLevelUp.length > 0) {
    const skill = nearLevelUp[0];
    return `Focus on advancing ${skill.skill_name} - ${dog.name} is close to mastering this skill`;
  }

  // Find lowest level skills being worked on
  const needsWork = skillAssessments
    .filter((s) => s.level >= 1 && s.level <= 2)
    .sort((a, b) => a.level - b.level);

  if (needsWork.length > 0) {
    return `Continue building foundation for ${needsWork[0].skill_name}`;
  }

  // Program milestone based
  const progressPercent = Math.round((dog.programDay / dog.totalProgramDays) * 100);

  if (progressPercent >= 75) {
    return `Final polish on all commands - preparing for graduation`;
  }
  if (progressPercent >= 50) {
    return `Increase distractions during training to proof behaviors`;
  }

  return `Continue building on today's progress with consistent practice`;
}

// Generate training summary paragraph
function generateTrainingSummary(
  activities: Activity[],
  skillAssessments: SkillAssessment[],
  dog: DogContext
): string {
  const trainingActivities = activities.filter((a) => a.type === 'training');
  const totalMinutes = trainingActivities.reduce((sum, a) => sum + a.duration, 0);
  const sessionCount = trainingActivities.length;

  // Collect all skills worked on
  const skillsWorked = new Set<string>();
  trainingActivities.forEach((a) => {
    a.skills_worked?.forEach((s) => skillsWorked.add(s));
  });
  skillAssessments.forEach((s) => skillsWorked.add(s.skill_name));

  const skillsList = Array.from(skillsWorked);

  // Build summary
  let summary = `${dog.name} had ${sessionCount} training session${sessionCount !== 1 ? 's' : ''} today, `;
  summary += `totaling ${totalMinutes} minutes of focused work. `;

  if (skillsList.length > 0) {
    summary += `We worked on ${skillsList.slice(0, 4).join(', ')}`;
    if (skillsList.length > 4) {
      summary += ` and ${skillsList.length - 4} other skills`;
    }
    summary += '. ';
  }

  // Add mood/engagement note
  const mood = inferMood(activities);
  if (mood === 'excellent') {
    summary += `${dog.name} was exceptionally engaged and responsive throughout the day.`;
  } else if (mood === 'good') {
    summary += `${dog.name} showed good focus and made solid progress.`;
  } else if (mood === 'fair') {
    summary += `${dog.name} had some challenges today but we worked through them.`;
  } else {
    summary += `${dog.name} had a tough day - we'll adjust our approach tomorrow.`;
  }

  return summary;
}

// Main report generation function
export function generateReport(
  activities: Activity[],
  skillAssessments: SkillAssessment[],
  dog: DogContext
): GeneratedReport {
  const trainingActivities = activities.filter((a) => a.type === 'training');
  const totalTrainingMinutes = trainingActivities.reduce((sum, a) => sum + a.duration, 0);

  // Collect skills
  const skillsSet = new Set<string>();
  trainingActivities.forEach((a) => {
    a.skills_worked?.forEach((s) => skillsSet.add(s));
  });
  skillAssessments.forEach((s) => skillsSet.add(s.skill_name));

  return {
    summary: generateTrainingSummary(activities, skillAssessments, dog),
    mood: inferMood(activities),
    energy_level: inferEnergyLevel(activities),
    appetite: inferAppetite(activities),
    potty: inferPottyStatus(activities),
    highlights: generateHighlights(activities, skillAssessments, dog),
    areas_to_improve: generateAreasToImprove(activities, skillAssessments),
    tomorrow_focus: generateTomorrowFocus(skillAssessments, dog),
    training_summary: generateTrainingSummary(activities, skillAssessments, dog),
    skills_practiced: Array.from(skillsSet),
    total_training_minutes: totalTrainingMinutes,
  };
}

// Quick report generation from minimal data
export function generateQuickReport(
  dogName: string,
  activities: Activity[]
): Partial<GeneratedReport> {
  return {
    mood: inferMood(activities),
    energy_level: inferEnergyLevel(activities),
    appetite: inferAppetite(activities),
    potty: inferPottyStatus(activities),
    total_training_minutes: activities
      .filter((a) => a.type === 'training')
      .reduce((sum, a) => sum + a.duration, 0),
  };
}

// Report templates for common scenarios
export const reportTemplates = {
  excellent_day: {
    summary: '{dogName} had an outstanding day! Showed exceptional focus and made great progress across all areas.',
    highlights: [
      'Excellent focus during training sessions',
      'Responded well to all commands',
      'Great attitude and engagement',
    ],
    areas_to_improve: ['Continue building on today\'s momentum'],
    tomorrow_focus: 'Increase difficulty and add new distractions',
  },
  good_day: {
    summary: '{dogName} had a solid training day with good progress on key skills.',
    highlights: [
      'Good focus during training',
      'Steady improvement on commands',
    ],
    areas_to_improve: ['Work on consistency in distracting environments'],
    tomorrow_focus: 'Continue building muscle memory on core commands',
  },
  challenging_day: {
    summary: '{dogName} had some challenges today, but we made adjustments and ended on a positive note.',
    highlights: ['Showed resilience when faced with challenges'],
    areas_to_improve: [
      'Building confidence in challenging situations',
      'Working on focus with distractions',
    ],
    tomorrow_focus: 'Return to basics and rebuild confidence',
  },
  first_day: {
    summary: 'Welcome {dogName}! Today was all about settling in and getting to know each other.',
    highlights: [
      'Successfully acclimated to the facility',
      'Started baseline assessments',
      'Building trust and rapport',
    ],
    areas_to_improve: ['Getting comfortable with new environment'],
    tomorrow_focus: 'Begin foundation training once fully settled',
  },
  graduation_ready: {
    summary: '{dogName} is graduation ready! All program goals have been achieved.',
    highlights: [
      'Mastered all required commands',
      'Excellent behavior in all environments',
      'Ready for real-world application',
    ],
    areas_to_improve: ['Continue practice at home to maintain skills'],
    tomorrow_focus: 'Final review and graduation preparation',
  },
};

// Apply template with dog name
export function applyTemplate(
  templateKey: keyof typeof reportTemplates,
  dogName: string
): Partial<GeneratedReport> {
  const template = reportTemplates[templateKey];

  return {
    summary: template.summary.replace('{dogName}', dogName),
    highlights: template.highlights,
    areas_to_improve: template.areas_to_improve,
    tomorrow_focus: template.tomorrow_focus,
  };
}
