import { supabase } from '@/lib/supabase';

// Skill categories and definitions
export const skillCategories = {
  obedience: {
    name: 'Obedience',
    description: 'Basic and advanced obedience commands',
    skills: [
      { id: 'sit', name: 'Sit', description: 'Sits on command and holds position' },
      { id: 'down', name: 'Down', description: 'Lies down on command and holds position' },
      { id: 'stay', name: 'Stay', description: 'Remains in position until released' },
      { id: 'come', name: 'Come/Recall', description: 'Returns to handler on command' },
      { id: 'heel', name: 'Heel', description: 'Walks calmly at handler\'s side' },
      { id: 'place', name: 'Place', description: 'Goes to designated spot and stays' },
      { id: 'wait', name: 'Wait', description: 'Pauses until given release command' },
      { id: 'leave_it', name: 'Leave It', description: 'Ignores distractions on command' },
      { id: 'drop_it', name: 'Drop It', description: 'Releases items from mouth on command' },
      { id: 'off', name: 'Off', description: 'Gets down from furniture/people' },
    ],
  },
  leash: {
    name: 'Leash Skills',
    description: 'Walking and leash manners',
    skills: [
      { id: 'loose_leash', name: 'Loose Leash Walk', description: 'Walks without pulling on leash' },
      { id: 'auto_sit', name: 'Auto Sit', description: 'Sits automatically when handler stops' },
      { id: 'direction_change', name: 'Direction Changes', description: 'Follows handler through turns' },
      { id: 'pace_change', name: 'Pace Changes', description: 'Adjusts speed with handler' },
      { id: 'distraction_walk', name: 'Distraction Walking', description: 'Maintains focus while walking past distractions' },
    ],
  },
  socialization: {
    name: 'Socialization',
    description: 'Social skills with people and dogs',
    skills: [
      { id: 'greet_people', name: 'Greeting People', description: 'Politely greets people without jumping' },
      { id: 'greet_dogs', name: 'Greeting Dogs', description: 'Appropriate greeting behavior with other dogs' },
      { id: 'calm_presence', name: 'Calm Around Dogs', description: 'Remains calm in presence of other dogs' },
      { id: 'handling', name: 'Handling Tolerance', description: 'Allows handling of paws, ears, mouth' },
      { id: 'vet_behavior', name: 'Vet Behavior', description: 'Calm behavior during vet-like examinations' },
    ],
  },
  impulse: {
    name: 'Impulse Control',
    description: 'Self-control and patience',
    skills: [
      { id: 'door_manners', name: 'Door Manners', description: 'Waits at doors until released' },
      { id: 'food_manners', name: 'Food Manners', description: 'Waits politely for food' },
      { id: 'crate_calm', name: 'Crate Calmness', description: 'Settles quietly in crate' },
      { id: 'impulse_general', name: 'General Impulse', description: 'Controls excitement in stimulating situations' },
      { id: 'settle', name: 'Settle', description: 'Relaxes on cue in various environments' },
    ],
  },
  advanced: {
    name: 'Advanced',
    description: 'Advanced skills and tricks',
    skills: [
      { id: 'distance_commands', name: 'Distance Commands', description: 'Responds to commands at distance' },
      { id: 'off_leash', name: 'Off-Leash Reliability', description: 'Maintains commands without leash' },
      { id: 'emergency_recall', name: 'Emergency Recall', description: 'Immediate recall in any situation' },
      { id: 'extended_stay', name: 'Extended Stay', description: 'Holds position for extended periods' },
      { id: 'public_access', name: 'Public Access', description: 'Well-behaved in public settings' },
    ],
  },
};

// Skill levels
export const skillLevels = [
  { value: 0, label: 'Not Started', color: 'surface' },
  { value: 1, label: 'Introduced', color: 'red' },
  { value: 2, label: 'Learning', color: 'orange' },
  { value: 3, label: 'Developing', color: 'yellow' },
  { value: 4, label: 'Proficient', color: 'blue' },
  { value: 5, label: 'Mastered', color: 'green' },
];

// Get all skills as a flat array
export function getAllSkills() {
  const skills: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    categoryName: string;
  }> = [];

  Object.entries(skillCategories).forEach(([categoryId, category]) => {
    category.skills.forEach((skill) => {
      skills.push({
        ...skill,
        category: categoryId,
        categoryName: category.name,
      });
    });
  });

  return skills;
}

// Skills service
export const skillsService = {
  // Get all skill assessments for a dog
  async getByDog(dogId: string) {
    const { data, error } = await supabase
      .from('skill_assessments')
      .select('*')
      .eq('dog_id', dogId)
      .order('assessed_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get latest assessment for each skill for a dog
  async getLatestByDog(dogId: string) {
    const { data, error } = await supabase
      .from('skill_assessments')
      .select('*')
      .eq('dog_id', dogId)
      .order('assessed_at', { ascending: false });

    if (error) throw error;

    // Get the most recent assessment for each skill
    const latestBySkill: Record<string, typeof data[0]> = {};
    data?.forEach((assessment) => {
      if (!latestBySkill[assessment.skill_id]) {
        latestBySkill[assessment.skill_id] = assessment;
      }
    });

    return latestBySkill;
  },

  // Get skill history for a specific skill
  async getSkillHistory(dogId: string, skillId: string) {
    const { data, error } = await supabase
      .from('skill_assessments')
      .select('*, trainer:profiles(first_name, last_name)')
      .eq('dog_id', dogId)
      .eq('skill_id', skillId)
      .order('assessed_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create a new skill assessment
  async assess(assessment: {
    dog_id: string;
    skill_id: string;
    level: number;
    notes?: string;
    trainer_id: string;
    facility_id: string;
  }) {
    const { data, error } = await supabase
      .from('skill_assessments')
      .insert({
        ...assessment,
        assessed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Batch assess multiple skills
  async batchAssess(
    assessments: Array<{
      dog_id: string;
      skill_id: string;
      level: number;
      notes?: string;
      trainer_id: string;
      facility_id: string;
    }>
  ) {
    const { data, error } = await supabase
      .from('skill_assessments')
      .insert(
        assessments.map((a) => ({
          ...a,
          assessed_at: new Date().toISOString(),
        }))
      )
      .select();

    if (error) throw error;
    return data;
  },

  // Get skill progress summary for a dog
  async getProgressSummary(dogId: string) {
    const latestAssessments = await this.getLatestByDog(dogId);
    const allSkills = getAllSkills();

    const summary = {
      total: allSkills.length,
      notStarted: 0,
      introduced: 0,
      learning: 0,
      developing: 0,
      proficient: 0,
      mastered: 0,
      averageLevel: 0,
      byCategory: {} as Record<
        string,
        {
          total: number;
          assessed: number;
          averageLevel: number;
          mastered: number;
        }
      >,
    };

    // Initialize category summaries
    Object.keys(skillCategories).forEach((categoryId) => {
      const categorySkills = skillCategories[categoryId as keyof typeof skillCategories].skills;
      summary.byCategory[categoryId] = {
        total: categorySkills.length,
        assessed: 0,
        averageLevel: 0,
        mastered: 0,
      };
    });

    let totalLevel = 0;
    let assessedCount = 0;

    allSkills.forEach((skill) => {
      const assessment = latestAssessments[skill.id];
      const level = assessment?.level || 0;

      // Update counts
      switch (level) {
        case 0:
          summary.notStarted++;
          break;
        case 1:
          summary.introduced++;
          break;
        case 2:
          summary.learning++;
          break;
        case 3:
          summary.developing++;
          break;
        case 4:
          summary.proficient++;
          break;
        case 5:
          summary.mastered++;
          break;
      }

      // Update category summary
      if (level > 0) {
        summary.byCategory[skill.category].assessed++;
        summary.byCategory[skill.category].averageLevel += level;
        assessedCount++;
        totalLevel += level;
      }
      if (level === 5) {
        summary.byCategory[skill.category].mastered++;
      }
    });

    // Calculate averages
    summary.averageLevel = assessedCount > 0 ? totalLevel / assessedCount : 0;
    Object.keys(summary.byCategory).forEach((categoryId) => {
      const cat = summary.byCategory[categoryId];
      cat.averageLevel = cat.assessed > 0 ? cat.averageLevel / cat.assessed : 0;
    });

    return summary;
  },
};
