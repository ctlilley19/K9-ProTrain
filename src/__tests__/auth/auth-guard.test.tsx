/**
 * Auth Guard Component Tests
 *
 * Tests for the AuthGuard component that protects routes.
 * Note: AuthGuard has complex internal state management with PIN auth.
 * These tests verify the basic rendering and mocking behavior.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuthStore } from '@/stores/authStore';
import * as pinAuth from '@/services/supabase/pin-auth';

// Mock the pin auth service
jest.mock('@/services/supabase/pin-auth', () => ({
  getPinAuthState: jest.fn(),
  recordFullLogin: jest.fn(),
}));

// Mock the router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for pin auth - no PIN required
    (pinAuth.getPinAuthState as jest.Mock).mockResolvedValue({
      hasPin: false,
      lastFullLogin: new Date(),
      lastPinVerify: null,
      daysSinceFullLogin: 0,
      daysSincePinVerify: null,
      requiredAuthLevel: 'none',
    });
  });

  describe('Loading State', () => {
    it('should show loading when auth store is initializing', () => {
      useAuthStore.setState({
        isLoading: true,
        isAuthenticated: false,
        user: null,
        isDemoModeActive: false,
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      // Should show loading text
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Unauthenticated User', () => {
    it('should redirect to login when not authenticated', async () => {
      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        isDemoModeActive: false,
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('Demo Mode', () => {
    it('should bypass PIN auth and show content in demo mode', async () => {
      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: true,
        isDemoModeActive: true,
        user: {
          id: 'demo-user',
          auth_id: 'demo-auth',
          facility_id: 'demo-facility',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'trainer',
          avatar_url: null,
          phone: null,
          status: 'active',
          pin_hash: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      // PIN auth should not be called in demo mode
      expect(pinAuth.getPinAuthState).not.toHaveBeenCalled();
    });
  });

  describe('Authenticated User', () => {
    it('should render children when user is authenticated and no PIN required', async () => {
      useAuthStore.setState({
        isLoading: false,
        isAuthenticated: true,
        isDemoModeActive: false,
        user: {
          id: 'user-1',
          auth_id: 'auth-1',
          facility_id: 'facility-1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'trainer',
          avatar_url: null,
          phone: null,
          status: 'active',
          pin_hash: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });
  });
});
