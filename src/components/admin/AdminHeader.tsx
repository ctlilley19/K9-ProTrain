'use client';

import { useState } from 'react';
import { useAdmin, useAdminRole, type AdminRole } from '@/stores/adminStore';
import { cn } from '@/lib/utils';
import {
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  support: 'Support Agent',
  moderator: 'Moderator',
  analytics: 'Analytics',
  billing: 'Billing Admin',
};

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const admin = useAdmin();
  const role = useAdminRole();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    const { logout } = require('@/stores/adminStore').useAdminStore.getState();
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-900/95 backdrop-blur-sm border-b border-surface-800">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-surface-800 rounded-lg border border-surface-700">
            <Search size={16} className="text-surface-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-surface-500 w-48 lg:w-64"
            />
            <span className="text-xs text-surface-600 border border-surface-700 rounded px-1.5 py-0.5">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
            >
              <Bell size={20} />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-surface-800 border border-surface-700 rounded-xl shadow-xl z-20">
                  <div className="p-4 border-b border-surface-700">
                    <h3 className="font-medium text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 text-sm text-surface-400">
                      No new notifications
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <ShieldCheck size={16} className="text-red-400" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{admin?.name}</p>
                <p className="text-xs text-surface-500">{role ? roleLabels[role] : ''}</p>
              </div>
              <ChevronDown size={16} className="hidden md:block" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-surface-800 border border-surface-700 rounded-xl shadow-xl z-20 py-2">
                  {/* User Info (Mobile) */}
                  <div className="md:hidden px-4 py-2 border-b border-surface-700 mb-2">
                    <p className="font-medium text-white">{admin?.name}</p>
                    <p className="text-sm text-surface-500">{admin?.email}</p>
                    {role && (
                      <span className="inline-block mt-1 text-xs text-red-400">
                        {roleLabels[role]}
                      </span>
                    )}
                  </div>

                  <a
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-2 text-surface-300 hover:bg-surface-700 hover:text-white transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-surface-300 hover:bg-surface-700 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
