/**
 * Auth Store Tests
 *
 * Tests for the authentication state management via Zustand store.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      facility: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      demoPersona: null,
      isDemoModeActive: false,
    });
  });

  describe('Initial State', () => {
    it('should start with no user authenticated', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.facility).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should not be in demo mode initially after reset', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.isDemoModeActive).toBe(false);
    });
  });

  describe('User Management', () => {
    it('should update user via setUser', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: 'user-1',
        auth_id: 'auth-1',
        facility_id: 'facility-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'trainer' as const,
        avatar_url: null,
        phone: null,
        status: 'active' as const,
        pin_hash: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should clear user and set isAuthenticated to false', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set a user first
      act(() => {
        result.current.setUser({
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
        });
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Clear user
      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Facility Management', () => {
    it('should update facility via setFacility', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockFacility = {
        id: 'facility-1',
        name: 'Test Facility',
        logo_url: null,
        address: '123 Test St',
        city: 'Test City',
        state: 'MD',
        zip: '12345',
        phone: '555-1234',
        email: 'test@facility.com',
        website: 'https://test.com',
        timezone: 'America/New_York',
        subscription_tier: 'professional' as const,
        stripe_customer_id: null,
        free_tags_allowance: 10,
        free_tags_used: 0,
        settings: {
          kennel_max_minutes: 240,
          potty_interval_minutes: 120,
          daily_report_time: '18:00',
          enable_realtime_updates: true,
          enable_photo_sharing: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      act(() => {
        result.current.setFacility(mockFacility);
      });

      expect(result.current.facility).toEqual(mockFacility);
    });
  });

  describe('Loading and Error States', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should update error state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setError('Test error message');
      });

      expect(result.current.error).toBe('Test error message');

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Demo Mode', () => {
    it('should enable demo mode', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.enableDemoMode();
      });

      expect(result.current.isDemoModeActive).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).not.toBeNull();
    });

    it('should set demo persona', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setDemoPersona('trainer');
      });

      expect(result.current.demoPersona).toBe('trainer');
    });

    it('should set demo family tier', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setDemoFamilyTier('pro');
      });

      expect(result.current.demoFamilyTier).toBe('pro');
    });

    it('should set demo business tier', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setDemoBusinessTier('enterprise');
      });

      expect(result.current.demoBusinessTier).toBe('enterprise');
    });
  });
});
