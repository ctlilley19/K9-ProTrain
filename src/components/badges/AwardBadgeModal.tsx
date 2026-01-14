'use client';

import { useState, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { BadgeCard, TierDots, type BadgeTier } from './BadgeDisplay';
import { cn } from '@/lib/utils';
import { useDogsWithPrograms } from '@/hooks';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  Dog,
  Award,
  Star,
  Target,
  Shield,
  Trophy,
  Crown,
  Zap,
  Heart,
  Loader2,
  Calendar,
  Flame,
  GraduationCap,
  Footprints,
  Users,
  Building2,
  Sparkles,
  Medal,
  Clock,
  Sun,
  Moon,
  MapPin,
  Timer,
  CheckCircle2,
  TrendingUp,
  Compass,
  Handshake,
  Home,
  Route,
  PartyPopper,
  BadgeCheck,
  Milestone,
  Camera,
  MessageCircle,
  Dumbbell,
  Mountain,
  Waves,
  TreePine,
  CloudRain,
  Snowflake,
  Gift,
  Cake,
  ThumbsUp,
  Brain,
  Eye,
  Ear,
  UserCheck,
  UsersRound,
  Briefcase,
  Lightbulb,
  HeartHandshake,
  Video,
  Bike,
  Tent,
  Sunrise,
  Map,
  Backpack,
  Wind,
  Droplets,
  Anchor,
  Rocket,
  Activity,
} from 'lucide-react';

interface AwardBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Badge icon components
const badgeIcons: Record<string, (color: string, size?: number) => React.ReactNode> = {
  star: (color, size = 32) => <Star size={size} stroke={color} />,
  target: (color, size = 32) => <Target size={size} stroke={color} />,
  shield: (color, size = 32) => <Shield size={size} stroke={color} />,
  trophy: (color, size = 32) => <Trophy size={size} stroke={color} />,
  crown: (color, size = 32) => <Crown size={size} stroke={color} />,
  zap: (color, size = 32) => <Zap size={size} stroke={color} />,
  heart: (color, size = 32) => <Heart size={size} stroke={color} />,
  dog: (color, size = 32) => <Dog size={size} stroke={color} />,
  flame: (color, size = 32) => <Flame size={size} stroke={color} />,
  graduation: (color, size = 32) => <GraduationCap size={size} stroke={color} />,
  footprints: (color, size = 32) => <Footprints size={size} stroke={color} />,
  users: (color, size = 32) => <Users size={size} stroke={color} />,
  building: (color, size = 32) => <Building2 size={size} stroke={color} />,
  sparkles: (color, size = 32) => <Sparkles size={size} stroke={color} />,
  medal: (color, size = 32) => <Medal size={size} stroke={color} />,
  clock: (color, size = 32) => <Clock size={size} stroke={color} />,
  sun: (color, size = 32) => <Sun size={size} stroke={color} />,
  moon: (color, size = 32) => <Moon size={size} stroke={color} />,
  mappin: (color, size = 32) => <MapPin size={size} stroke={color} />,
  timer: (color, size = 32) => <Timer size={size} stroke={color} />,
  check: (color, size = 32) => <CheckCircle2 size={size} stroke={color} />,
  trending: (color, size = 32) => <TrendingUp size={size} stroke={color} />,
  compass: (color, size = 32) => <Compass size={size} stroke={color} />,
  handshake: (color, size = 32) => <Handshake size={size} stroke={color} />,
  home: (color, size = 32) => <Home size={size} stroke={color} />,
  route: (color, size = 32) => <Route size={size} stroke={color} />,
  party: (color, size = 32) => <PartyPopper size={size} stroke={color} />,
  badge: (color, size = 32) => <BadgeCheck size={size} stroke={color} />,
  milestone: (color, size = 32) => <Milestone size={size} stroke={color} />,
  award: (color, size = 32) => <Award size={size} stroke={color} />,
  calendar: (color, size = 32) => <Calendar size={size} stroke={color} />,
  camera: (color, size = 32) => <Camera size={size} stroke={color} />,
  message: (color, size = 32) => <MessageCircle size={size} stroke={color} />,
  dumbbell: (color, size = 32) => <Dumbbell size={size} stroke={color} />,
  mountain: (color, size = 32) => <Mountain size={size} stroke={color} />,
  waves: (color, size = 32) => <Waves size={size} stroke={color} />,
  tree: (color, size = 32) => <TreePine size={size} stroke={color} />,
  rain: (color, size = 32) => <CloudRain size={size} stroke={color} />,
  snow: (color, size = 32) => <Snowflake size={size} stroke={color} />,
  gift: (color, size = 32) => <Gift size={size} stroke={color} />,
  cake: (color, size = 32) => <Cake size={size} stroke={color} />,
  thumbsup: (color, size = 32) => <ThumbsUp size={size} stroke={color} />,
  brain: (color, size = 32) => <Brain size={size} stroke={color} />,
  eye: (color, size = 32) => <Eye size={size} stroke={color} />,
  ear: (color, size = 32) => <Ear size={size} stroke={color} />,
  usercheck: (color, size = 32) => <UserCheck size={size} stroke={color} />,
  group: (color, size = 32) => <UsersRound size={size} stroke={color} />,
  briefcase: (color, size = 32) => <Briefcase size={size} stroke={color} />,
  lightbulb: (color, size = 32) => <Lightbulb size={size} stroke={color} />,
  helping: (color, size = 32) => <HeartHandshake size={size} stroke={color} />,
  video: (color, size = 32) => <Video size={size} stroke={color} />,
  bike: (color, size = 32) => <Bike size={size} stroke={color} />,
  tent: (color, size = 32) => <Tent size={size} stroke={color} />,
  sunrise: (color, size = 32) => <Sunrise size={size} stroke={color} />,
  map: (color, size = 32) => <Map size={size} stroke={color} />,
  backpack: (color, size = 32) => <Backpack size={size} stroke={color} />,
  wind: (color, size = 32) => <Wind size={size} stroke={color} />,
  droplets: (color, size = 32) => <Droplets size={size} stroke={color} />,
  anchor: (color, size = 32) => <Anchor size={size} stroke={color} />,
  rocket: (color, size = 32) => <Rocket size={size} stroke={color} />,
  activity: (color, size = 32) => <Activity size={size} stroke={color} />,
};

// Full badge library
const badgeDefinitions = [
  // === OBEDIENCE BASICS ===
  { id: 'sit-master', name: 'Sit Master', description: 'Master the sit command with reliability', category: 'obedience', icon: 'star', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'stay-champion', name: 'Stay Champion', description: 'Master the stay command with duration', category: 'obedience', icon: 'shield', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'recall-master', name: 'Recall Master', description: 'Come when called from any distance', category: 'obedience', icon: 'target', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'down-master', name: 'Down Master', description: 'Reliable down command on cue', category: 'obedience', icon: 'star', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'leave-it-pro', name: 'Leave It Pro', description: 'Impulse control around distractions', category: 'obedience', icon: 'shield', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'drop-it-star', name: 'Drop It Star', description: 'Reliable release of items on command', category: 'obedience', icon: 'star', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === LEASH & WALKING ===
  { id: 'leash-walking', name: 'Leash Walking Pro', description: 'Walk calmly on leash without pulling', category: 'leash', icon: 'route', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'heel-master', name: 'Heel Master', description: 'Perfect heel position beside handler', category: 'leash', icon: 'footprints', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'loose-leash', name: 'Loose Leash Legend', description: 'Walk without tension on leash', category: 'leash', icon: 'route', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === SOCIAL SKILLS ===
  { id: 'social-butterfly', name: 'Social Butterfly', description: 'Positive interactions with dogs and people', category: 'social', icon: 'heart', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'dog-friendly', name: 'Dog Friendly', description: 'Calm and appropriate with other dogs', category: 'social', icon: 'dog', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'stranger-friendly', name: 'Stranger Friendly', description: 'Calm greetings with new people', category: 'social', icon: 'users', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'polite-greeter', name: 'Polite Greeter', description: 'No jumping when meeting people', category: 'social', icon: 'handshake', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === BEHAVIOR & MANNERS ===
  { id: 'zen-master', name: 'Zen Master', description: 'Extended place/stay command mastery', category: 'behavior', icon: 'shield', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'crate-comfortable', name: 'Crate Comfortable', description: 'Relaxed and calm in kennel/crate', category: 'behavior', icon: 'home', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'potty-pro', name: 'Potty Pro', description: 'House training mastery', category: 'behavior', icon: 'check', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'calm-traveler', name: 'Calm Traveler', description: 'Relaxed behavior during car rides', category: 'behavior', icon: 'compass', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'impulse-control', name: 'Impulse Control', description: 'Wait patiently for food and doors', category: 'behavior', icon: 'timer', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === CERTIFICATION ===
  { id: 'cgc-ready', name: 'CGC Ready', description: 'Canine Good Citizen test preparation', category: 'certification', icon: 'badge', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'community-canine', name: 'Community Canine', description: 'Advanced CGC in real-world settings', category: 'certification', icon: 'building', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'urban-canine', name: 'Urban Canine', description: 'City environment proficiency', category: 'certification', icon: 'building', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'therapy-ready', name: 'Therapy Dog Ready', description: 'Temperament for therapy work', category: 'certification', icon: 'heart', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === TRICKS ===
  { id: 'trick-novice', name: 'Novice Tricks', description: 'Learned 10 basic tricks', category: 'tricks', icon: 'sparkles', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'trick-intermediate', name: 'Intermediate Tricks', description: 'Mastered intermediate tricks', category: 'tricks', icon: 'sparkles', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'trick-advanced', name: 'Advanced Tricks', description: 'Expert level trick performance', category: 'tricks', icon: 'sparkles', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'trick-performer', name: 'Trick Performer', description: 'Can perform trick routines', category: 'tricks', icon: 'star', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'trick-elite', name: 'Elite Performer', description: 'Scripted performance mastery', category: 'tricks', icon: 'crown', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === COMPETITION ===
  { id: 'companion-dog', name: 'Companion Dog', description: 'Novice obedience competition ready', category: 'competition', icon: 'medal', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'companion-excellent', name: 'Companion Excellent', description: 'Open class obedience skills', category: 'competition', icon: 'medal', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'utility-dog', name: 'Utility Dog', description: 'Advanced utility obedience', category: 'competition', icon: 'trophy', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === MILESTONES ===
  { id: 'first-week', name: 'First Week Star', description: 'Complete the first week of training', category: 'milestone', icon: 'trophy', tiers: ['bronze', 'silver', 'gold'] as BadgeTier[] },
  { id: 'first-month', name: 'First Month', description: 'One month training milestone', category: 'milestone', icon: 'calendar', tiers: ['bronze', 'silver', 'gold'] as BadgeTier[] },
  { id: 'three-months', name: 'Quarter Complete', description: 'Three months of progress', category: 'milestone', icon: 'milestone', tiers: ['bronze', 'silver', 'gold', 'platinum'] as BadgeTier[] },
  { id: 'graduate', name: 'Program Graduate', description: 'Successfully complete a training program', category: 'milestone', icon: 'graduation', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === STREAKS ===
  { id: 'streak-week', name: 'Week Warrior', description: '7 consecutive training days', category: 'streak', icon: 'flame', tiers: ['bronze', 'silver', 'gold'] as BadgeTier[] },
  { id: 'streak-month', name: 'Monthly Master', description: '30 consecutive training days', category: 'streak', icon: 'flame', tiers: ['bronze', 'silver', 'gold', 'platinum'] as BadgeTier[] },
  { id: 'streak-quarter', name: 'Quarter Champion', description: '90 consecutive training days', category: 'streak', icon: 'flame', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'streak-year', name: 'Year Legend', description: '365 consecutive training days', category: 'streak', icon: 'crown', tiers: ['gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === SPECIAL ===
  { id: 'early-bird', name: 'Early Bird', description: 'Morning training sessions before 7 AM', category: 'special', icon: 'sunrise', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'night-owl', name: 'Night Owl', description: 'Evening training dedication', category: 'special', icon: 'moon', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'quick-learner', name: 'Quick Learner', description: 'Mastered skill in under 3 days', category: 'special', icon: 'zap', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'perfect-session', name: 'Perfect Session', description: 'Flawless training performance', category: 'special', icon: 'star', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'comeback-kid', name: 'Comeback Kid', description: 'Overcame a training challenge', category: 'special', icon: 'trending', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'celebration', name: 'Celebration', description: 'Special achievement unlocked', category: 'special', icon: 'party', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === FAMILY ===
  { id: 'parent-mvp', name: 'Parent MVP', description: 'Most engaged pet parent this month', category: 'family', icon: 'trophy', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'photo-pro', name: 'Photo Pro', description: 'Uploaded 50+ photos to gallery', category: 'family', icon: 'camera', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'comm-star', name: 'Communication Star', description: 'Responds quickly to updates', category: 'family', icon: 'message', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'homework-hero', name: 'Homework Hero', description: 'Consistently follows training homework', category: 'family', icon: 'check', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'referral-champ', name: 'Referral Champion', description: 'Referred new clients to training', category: 'family', icon: 'users', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'loyal-client', name: 'Loyal Client', description: '1+ year training relationship', category: 'family', icon: 'heart', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'video-star', name: 'Video Star', description: 'Shared training progress videos', category: 'family', icon: 'video', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === TRAINER ===
  { id: 'trainer-pro', name: 'Training Pro', description: 'Completed 100+ training sessions', category: 'trainer', icon: 'briefcase', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'mentor', name: 'Mentor', description: 'Trained and guided new trainers', category: 'trainer', icon: 'helping', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'graduation-guru', name: 'Graduation Guru', description: 'Graduated 10+ dogs successfully', category: 'trainer', icon: 'graduation', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'behavior-specialist', name: 'Behavior Specialist', description: 'Resolved complex behavioral cases', category: 'trainer', icon: 'brain', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'customer-champ', name: 'Customer Champion', description: 'High parent satisfaction scores', category: 'trainer', icon: 'thumbsup', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'innovator', name: 'Innovator', description: 'Created new training methods', category: 'trainer', icon: 'lightbulb', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === FITNESS ===
  { id: 'first-run', name: 'First Run', description: 'First outdoor running session', category: 'fitness', icon: 'footprints', tiers: ['bronze', 'silver', 'gold'] as BadgeTier[] },
  { id: '5k-champion', name: '5K Champion', description: 'Completed first 5K run together', category: 'fitness', icon: 'medal', tiers: ['bronze', 'silver', 'gold', 'platinum'] as BadgeTier[] },
  { id: '10k-warrior', name: '10K Warrior', description: 'Conquered the 10K distance', category: 'fitness', icon: 'medal', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'marathon-master', name: 'Marathon Master', description: 'Finished a full marathon together', category: 'fitness', icon: 'trophy', tiers: ['gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Personal best time achieved', category: 'fitness', icon: 'zap', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'trailblazer', name: 'Trailblazer', description: 'First hiking adventure completed', category: 'fitness', icon: 'map', tiers: ['bronze', 'silver', 'gold'] as BadgeTier[] },
  { id: 'summit-seeker', name: 'Summit Seeker', description: 'Reached a mountain peak', category: 'fitness', icon: 'mountain', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'forest-explorer', name: 'Forest Explorer', description: 'Completed forest trail adventures', category: 'fitness', icon: 'tree', tiers: ['bronze', 'silver', 'gold', 'platinum'] as BadgeTier[] },
  { id: 'bike-buddy', name: 'Bike Buddy', description: 'First cycling session together', category: 'fitness', icon: 'bike', tiers: ['bronze', 'silver', 'gold'] as BadgeTier[] },
  { id: 'trail-rider', name: 'Trail Rider', description: 'Off-road cycling adventure', category: 'fitness', icon: 'bike', tiers: ['bronze', 'silver', 'gold', 'platinum'] as BadgeTier[] },
  { id: 'water-pup', name: 'Water Pup', description: 'First swimming session', category: 'fitness', icon: 'droplets', tiers: ['bronze', 'silver', 'gold'] as BadgeTier[] },
  { id: 'lake-explorer', name: 'Lake Explorer', description: 'Open water swimming adventures', category: 'fitness', icon: 'waves', tiers: ['bronze', 'silver', 'gold', 'platinum'] as BadgeTier[] },
  { id: 'beach-lover', name: 'Beach Lover', description: 'Beach running and swimming', category: 'fitness', icon: 'waves', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'dock-diver', name: 'Dock Diver', description: 'Dock diving training mastery', category: 'fitness', icon: 'anchor', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'camp-companion', name: 'Camp Companion', description: 'Overnight camping trip partner', category: 'fitness', icon: 'tent', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'wilderness-explorer', name: 'Wilderness Explorer', description: 'Backcountry adventures mastered', category: 'fitness', icon: 'compass', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'pack-leader', name: 'Pack Leader', description: 'Expedition leader status achieved', category: 'fitness', icon: 'backpack', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'adventure-dog', name: 'Adventure Dog', description: 'Trail and hiking training', category: 'fitness', icon: 'mountain', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'agility-star', name: 'Agility Star', description: 'Completed agility course training', category: 'fitness', icon: 'zap', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'iron-paws', name: 'Iron Paws', description: 'Elite fitness level achieved', category: 'fitness', icon: 'dumbbell', tiers: ['silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'ultimate-athlete', name: 'Ultimate Athlete', description: 'Peak physical conditioning', category: 'fitness', icon: 'rocket', tiers: ['gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === ENVIRONMENT ===
  { id: 'weather-warrior', name: 'Weather Warrior', description: 'Trained in rain or challenging weather', category: 'environment', icon: 'rain', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'snow-trooper', name: 'Snow Trooper', description: 'Trained in snowy conditions', category: 'environment', icon: 'snow', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'distraction-destroyer', name: 'Distraction Destroyer', description: 'Focused around major distractions', category: 'environment', icon: 'eye', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'sound-steady', name: 'Sound Steady', description: 'Calm around loud noises', category: 'environment', icon: 'ear', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },

  // === FUN ===
  { id: 'birthday-pup', name: 'Birthday Pup', description: 'Celebrated training birthday', category: 'fun', icon: 'cake', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'holiday-hero', name: 'Holiday Hero', description: 'Training on holidays', category: 'fun', icon: 'gift', tiers: ['bronze', 'silver', 'gold', 'platinum'] as BadgeTier[] },
  { id: 'weekend-warrior', name: 'Weekend Warrior', description: 'Dedicated weekend sessions', category: 'fun', icon: 'sun', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'photogenic', name: 'Photogenic', description: 'Best photo of the month', category: 'fun', icon: 'camera', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'focus-master', name: 'Focus Master', description: 'Extended attention span achieved', category: 'fun', icon: 'brain', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'vet-ready', name: 'Vet Ready', description: 'Calm during vet visits', category: 'fun', icon: 'usercheck', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
  { id: 'groomer-friendly', name: 'Groomer Friendly', description: 'Cooperative during grooming', category: 'fun', icon: 'sparkles', tiers: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] as BadgeTier[] },
];

const tierColors: Record<BadgeTier, string> = {
  bronze: '#cd7f32',
  silver: '#94a3b8',
  gold: '#f59e0b',
  platinum: '#22d3ee',
  diamond: '#c084fc',
};

const STEPS = [
  { id: 1, title: 'Dog', description: 'Select the dog' },
  { id: 2, title: 'Badge', description: 'Choose a badge' },
  { id: 3, title: 'Tier', description: 'Select tier level' },
  { id: 4, title: 'Confirm', description: 'Review and award' },
];

export function AwardBadgeModal({ isOpen, onClose, onSuccess }: AwardBadgeModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDogId, setSelectedDogId] = useState<string>('');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<BadgeTier | ''>('');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: dogs, isLoading: dogsLoading } = useDogsWithPrograms();
  const totalSteps = STEPS.length;

  // Filter dogs
  const filteredDogs = useMemo(() => {
    if (!dogs) return [];
    if (!searchQuery) return dogs;
    return dogs.filter(
      (dog) =>
        dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dog.breed?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [dogs, searchQuery]);

  // Filter badges by category
  const filteredBadges = useMemo(() => {
    if (categoryFilter === 'all') return badgeDefinitions;
    return badgeDefinitions.filter((b) => b.category === categoryFilter);
  }, [categoryFilter]);

  // Get selected items
  const selectedDog = dogs?.find((d) => d.id === selectedDogId);
  const selectedBadge = badgeDefinitions.find((b) => b.id === selectedBadgeId);

  const categories = ['all', 'obedience', 'leash', 'social', 'behavior', 'certification', 'tricks', 'competition', 'milestone', 'streak', 'special', 'family', 'trainer', 'fitness', 'environment', 'fun'];

  // Navigation validation
  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!selectedDogId;
      case 2:
        return !!selectedBadgeId;
      case 3:
        return !!selectedTier;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedDogId('');
    setSelectedBadgeId('');
    setSelectedTier('');
    setNotes('');
    setSearchQuery('');
    setCategoryFilter('all');
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log('Awarding badge:', {
        dogId: selectedDogId,
        badgeId: selectedBadgeId,
        tier: selectedTier,
        notes,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to award badge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" raw closeOnOverlayClick={false}>
      {/* Header */}
      <ModalHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Award Badge</h2>
            <p className="text-sm text-surface-400">
              Step {step} of {totalSteps}: {STEPS[step - 1].description}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-surface-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s) => (
              <span
                key={s.id}
                className={cn(
                  'text-xs transition-colors',
                  step >= s.id ? 'text-amber-400 font-medium' : 'text-surface-500'
                )}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </ModalHeader>

      {/* Body */}
      <ModalBody className="min-h-[360px]">
        {/* Step 1: Select Dog */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Dog size={32} className="text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Select a Dog</h3>
              <p className="text-sm text-surface-400">Choose which dog to award the badge to</p>
            </div>

            <Input
              placeholder="Search dogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
            />

            {dogsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {filteredDogs.map((dog) => (
                  <button
                    key={dog.id}
                    type="button"
                    onClick={() => setSelectedDogId(dog.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
                      selectedDogId === dog.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-surface-700 hover:border-surface-600 bg-surface-800/50'
                    )}
                  >
                    <Avatar name={dog.name} src={dog.photo_url} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className={cn('font-medium', selectedDogId === dog.id ? 'text-white' : 'text-surface-300')}>
                        {dog.name}
                      </p>
                      <p className="text-xs text-surface-500 truncate">{dog.breed || 'Unknown breed'}</p>
                    </div>
                    {selectedDogId === dog.id && <Check size={20} className="text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Badge */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Award size={32} className="text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Select a Badge</h3>
              <p className="text-sm text-surface-400">Choose which badge to award to {selectedDog?.name}</p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors',
                    categoryFilter === cat
                      ? 'bg-amber-500 text-white'
                      : 'bg-surface-800 text-surface-400 hover:text-white'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[260px] overflow-y-auto">
              {filteredBadges.map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => {
                    setSelectedBadgeId(badge.id);
                    setSelectedTier(''); // Reset tier when badge changes
                  }}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all text-left',
                    selectedBadgeId === badge.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-surface-700 hover:border-surface-600 bg-surface-800/50'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center">
                      {badgeIcons[badge.icon]?.('#9ca3af') || <Award size={16} className="text-surface-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium truncate', selectedBadgeId === badge.id ? 'text-white' : 'text-surface-300')}>
                        {badge.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-surface-500 line-clamp-2">{badge.description}</p>
                  <div className="mt-2">
                    <TierDots availableTiers={badge.tiers} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Tier */}
        {step === 3 && selectedBadge && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Star size={32} className="text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Select Tier Level</h3>
              <p className="text-sm text-surface-400">Choose the tier for {selectedBadge.name}</p>
            </div>

            <div className="space-y-3">
              {selectedBadge.tiers.map((tier) => {
                const color = tierColors[tier];
                const tierIndex = selectedBadge.tiers.indexOf(tier);
                const tierDescription = tierIndex === 0 ? 'Entry level achievement' :
                  tierIndex === 1 ? 'Developing proficiency' :
                  tierIndex === 2 ? 'Strong mastery' :
                  tierIndex === 3 ? 'Expert level' : 'Elite mastery';

                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                      selectedTier === tier
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-surface-700 hover:border-surface-600 bg-surface-800/50'
                    )}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(145deg, ${color}33, ${color}1a)`,
                        boxShadow: `0 0 15px ${color}66`,
                      }}
                    >
                      {badgeIcons[selectedBadge.icon]?.(color) || <Award size={24} stroke={color} />}
                    </div>
                    <div className="flex-1">
                      <p className={cn('font-medium capitalize', selectedTier === tier ? 'text-white' : 'text-surface-300')}>
                        {tier}
                      </p>
                      <p className="text-xs text-surface-500">{tierDescription}</p>
                    </div>
                    {selectedTier === tier && <Check size={20} className="text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && selectedDog && selectedBadge && selectedTier && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <Check size={32} className="text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Confirm Award</h3>
              <p className="text-sm text-surface-400">Review and confirm the badge award</p>
            </div>

            {/* Preview Card */}
            <div className="rounded-xl border border-surface-700 bg-surface-800/50 overflow-hidden">
              <div className="p-4 flex items-center gap-4 border-b border-surface-700">
                <Avatar name={selectedDog.name} src={selectedDog.photo_url} size="lg" />
                <div>
                  <h4 className="text-lg font-semibold text-white">{selectedDog.name}</h4>
                  <p className="text-sm text-surface-400">{selectedDog.breed || 'Unknown breed'}</p>
                </div>
              </div>

              <div className="p-6 flex justify-center">
                <BadgeCard
                  tier={selectedTier}
                  title={selectedBadge.name}
                  description={selectedBadge.description}
                  icon={badgeIcons[selectedBadge.icon]?.(tierColors[selectedTier]) || <Award size={32} />}
                  size="lg"
                />
              </div>
            </div>

            {/* Notes */}
            <Textarea
              label="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this achievement..."
              className="mt-4"
            />
          </div>
        )}
      </ModalBody>

      {/* Footer */}
      <ModalFooter className="justify-between">
        <Button variant="ghost" onClick={step === 1 ? handleClose : prevStep} disabled={isSubmitting}>
          <ArrowLeft size={16} className="mr-2" />
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          variant="primary"
          onClick={nextStep}
          disabled={!canProceed() || isSubmitting}
          isLoading={isSubmitting}
          className="bg-amber-500 hover:bg-amber-400"
        >
          {step === totalSteps ? (
            <>
              <Award size={16} className="mr-2" />
              Award Badge
            </>
          ) : (
            <>
              Continue
              <ArrowRight size={16} className="ml-2" />
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default AwardBadgeModal;
