'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore, useAdmin, usePendingMfa } from '@/stores/adminStore';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export default function MfaVerifyPage() {
  const router = useRouter();
  const admin = useAdmin();
  const pendingMfa = usePendingMfa();
  const { loginComplete, setError, setLoading, isLoading, error } = useAdminStore();

  const [code, setCode] = useState('');

  // Redirect if not in MFA flow
  useEffect(() => {
    if (!pendingMfa || !admin) {
      router.replace('/admin/login');
    }
  }, [pendingMfa, admin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: admin.id,
          code,
          isSetup: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Verification failed');
        setCode('');
        setLoading(false);
        return;
      }

      // MFA verified
      loginComplete(data.admin, data.sessionToken);

      if (data.requiresPasswordChange) {
        router.push('/admin/change-password');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      console.error('MFA verification error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Two-Factor Authentication</h1>
          <p className="text-surface-400 mt-2">Enter the code from your authenticator app</p>
        </div>

        {/* Verification Form */}
        <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Logged in as */}
            <div className="text-center text-sm text-surface-400 mb-4">
              Logging in as <span className="text-white">{admin.email}</span>
            </div>

            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-surface-400 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-lg text-white text-center text-2xl font-mono tracking-widest placeholder-surface-600 focus:border-red-500 focus:outline-none"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-red-500 hover:bg-red-600"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>

            {/* Back to login */}
            <button
              type="button"
              onClick={() => {
                const { logout } = useAdminStore.getState();
                logout();
                router.push('/admin/login');
              }}
              className="w-full text-sm text-surface-500 hover:text-white transition-colors mt-4"
            >
              Use a different account
            </button>
          </form>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-surface-600 mt-6">
          Lost access to your authenticator? Use a backup code or contact the super admin.
        </p>
      </div>
    </div>
  );
}
