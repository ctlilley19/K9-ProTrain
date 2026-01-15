'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { useUser, useDemoFamilyTier } from '@/stores/authStore';
import {
  User,
  Users,
  Bell,
  QrCode,
  CreditCard,
  Shield,
  Mail,
  Phone,
  Camera,
  Plus,
  Trash2,
  Crown,
  Check,
} from 'lucide-react';

// Mock care team data
const careTeam = [
  {
    id: '1',
    name: 'Mike Johnson',
    email: 'mike@email.com',
    role: 'Family Member',
    status: 'active',
  },
  {
    id: '2',
    name: 'Happy Paws Walking',
    email: 'info@happypaws.com',
    role: 'Dog Walker',
    status: 'active',
  },
];

// Settings sections
const sections = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'care-team', label: 'Care Team', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'tags', label: 'Tags & QR', icon: QrCode },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
];

export default function ParentSettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const user = useUser();
  const demoTier = useDemoFamilyTier();

  // Use demo tier from store
  const subscription = {
    tier: demoTier,
    status: 'active',
  };

  const isPro = subscription.tier === 'pro';
  const isPremiumOrPro = subscription.tier === 'premium' || subscription.tier === 'pro';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-surface-400">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-56 flex-shrink-0">
          <Card className="sticky top-24">
            <CardContent className="p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const isLocked = section.id === 'tags' && !isPro;

                return (
                  <button
                    key={section.id}
                    onClick={() => !isLocked && setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-500/10 text-brand-400'
                        : isLocked
                        ? 'text-surface-600 cursor-not-allowed'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800'
                    )}
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-left">{section.label}</span>
                    {isLocked && (
                      <Crown size={14} className="text-amber-500" />
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Account Section */}
          {activeSection === 'account' && (
            <Card>
              <CardHeader title="Account Information" />
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar name={user?.name || 'User'} size="lg" />
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-400 transition-colors">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-white">{user?.name || 'Pet Parent'}</p>
                    <p className="text-sm text-surface-500">{user?.email || 'email@example.com'}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    defaultValue={user?.name?.split(' ')[0] || ''}
                    leftIcon={<User size={16} />}
                  />
                  <Input
                    label="Last Name"
                    defaultValue={user?.name?.split(' ')[1] || ''}
                    leftIcon={<User size={16} />}
                  />
                  <Input
                    label="Email"
                    type="email"
                    defaultValue={user?.email || ''}
                    leftIcon={<Mail size={16} />}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    defaultValue=""
                    leftIcon={<Phone size={16} />}
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="primary">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Care Team Section */}
          {activeSection === 'care-team' && (
            <Card>
              <CardHeader
                title="Care Team"
                action={
                  <Button variant="outline" size="sm" leftIcon={<Plus size={16} />}>
                    Add Member
                  </Button>
                }
              />
              <CardContent>
                <p className="text-sm text-surface-400 mb-4">
                  Manage family members and caregivers who have access to your pets.
                </p>
                <div className="space-y-3">
                  {careTeam.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50"
                    >
                      <Avatar name={member.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-sm text-surface-500">{member.email}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs bg-surface-700 text-surface-300">
                        {member.role}
                      </span>
                      <button className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-surface-800/30 border border-dashed border-surface-700">
                  <p className="text-sm text-surface-400 mb-3">
                    Invite a new family member or caregiver
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="Enter email address" className="flex-1" />
                    <Button variant="primary">Send Invite</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader title="Notification Preferences" />
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Daily Reports', description: 'Get daily summaries of your pet\'s activities', enabled: true },
                    { label: 'Photo Uploads', description: 'When new photos are added', enabled: true },
                    { label: 'Training Updates', description: 'When badges or milestones are earned', enabled: true },
                    { label: 'Messages', description: 'When you receive a new message', enabled: true },
                    { label: 'Walk Completed', description: 'When a walk is finished', enabled: false },
                    { label: 'Visit Reminders', description: 'Reminders for scheduled visits', enabled: true },
                  ].map((pref) => (
                    <div
                      key={pref.label}
                      className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50"
                    >
                      <div>
                        <p className="font-medium text-white">{pref.label}</p>
                        <p className="text-sm text-surface-500">{pref.description}</p>
                      </div>
                      <button
                        className={cn(
                          'relative w-12 h-7 rounded-full transition-colors',
                          pref.enabled ? 'bg-brand-500' : 'bg-surface-700'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                            pref.enabled ? 'left-6' : 'left-1'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags Section (Pro Only) */}
          {activeSection === 'tags' && (
            <Card>
              <CardHeader
                title="Tags & QR Codes"
                action={
                  <span className="flex items-center gap-1 text-xs text-amber-400">
                    <Crown size={14} />
                    Pro Feature
                  </span>
                }
              />
              <CardContent>
                {isPro ? (
                  <div className="space-y-6">
                    <p className="text-sm text-surface-400">
                      Generate QR codes for your pets or order physical NFC tags.
                    </p>

                    {/* In-App QR */}
                    <div className="p-4 rounded-xl bg-surface-800/50">
                      <h3 className="font-medium text-white mb-2">In-App QR Code</h3>
                      <p className="text-sm text-surface-500 mb-4">
                        Display or download a QR code for your pet's profile.
                      </p>
                      <Button variant="outline" leftIcon={<QrCode size={16} />}>
                        Generate QR Code
                      </Button>
                    </div>

                    {/* Order Tags */}
                    <div className="p-4 rounded-xl bg-surface-800/50">
                      <h3 className="font-medium text-white mb-2">Physical Tags</h3>
                      <p className="text-sm text-surface-500 mb-4">
                        Order durable NFC + QR collar tags for your pets.
                      </p>
                      <Button variant="primary">Order Tags</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Crown size={48} className="mx-auto text-amber-500 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Upgrade to Pro
                    </h3>
                    <p className="text-surface-400 mb-4 max-w-sm mx-auto">
                      Get in-app QR codes, a free physical tag, and pet analytics with Pro.
                    </p>
                    <Button variant="primary" className="bg-amber-500 hover:bg-amber-400">
                      Upgrade to Pro - $19/mo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Subscription Section */}
          {activeSection === 'subscription' && (
            <Card>
              <CardHeader title="Subscription" />
              <CardContent>
                {/* Current Plan */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5 border border-brand-500/20 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white capitalize">
                      {subscription.tier} Plan
                    </h3>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-surface-400">
                    {subscription.tier === 'free' && 'Basic features for 1 pet'}
                    {subscription.tier === 'premium' && 'Up to 5 pets, GPS tracking, unlimited photos'}
                    {subscription.tier === 'pro' && 'Everything in Premium plus analytics and free tag'}
                  </p>
                </div>

                {/* Upgrade Options */}
                {subscription.tier !== 'pro' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">
                      Upgrade Options
                    </h3>

                    {subscription.tier === 'free' && (
                      <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">Premium</h4>
                          <span className="text-brand-400 font-semibold">$10/mo</span>
                        </div>
                        <ul className="text-sm text-surface-400 space-y-1 mb-4">
                          <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> Up to 5 pets</li>
                          <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> GPS route tracking</li>
                          <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> Unlimited photos</li>
                          <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> Medical records</li>
                        </ul>
                        <Button variant="outline" className="w-full">Upgrade to Premium</Button>
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">Pro</h4>
                          <Crown size={16} className="text-amber-400" />
                        </div>
                        <span className="text-amber-400 font-semibold">$19/mo</span>
                      </div>
                      <ul className="text-sm text-surface-400 space-y-1 mb-4">
                        <li className="flex items-center gap-2"><Check size={14} className="text-green-400" /> Everything in Premium</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> Pet Analytics</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> In-app QR code</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> 1 free physical tag</li>
                      </ul>
                      <Button variant="primary" className="w-full bg-amber-500 hover:bg-amber-400">
                        Upgrade to Pro
                      </Button>
                    </div>
                  </div>
                )}

                {/* Billing */}
                <div className="mt-6 pt-6 border-t border-surface-800">
                  <Button variant="ghost" className="text-surface-400">
                    Manage Billing
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
