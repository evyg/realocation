'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      const errorMessages: Record<string, string> = {
        missing_token: 'Login link is invalid',
        invalid_token: 'Login link is invalid or already used',
        expired_token: 'Login link has expired. Please request a new one.',
        server_error: 'Something went wrong. Please try again.',
      };
      setError(errorMessages[urlError] || 'An error occurred');
    }
  }, [searchParams]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send login link');
      }
      
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send login link');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-slate-900">Realocation</h1>
          </Link>
          <p className="text-slate-600 mt-2">Access your reports and credits</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-600 mb-6">
                We sent a login link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-slate-500">
                The link expires in 1 hour. Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="mt-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">Sign in with email</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  autoComplete="email"
                  required
                />
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send login link'}
                </button>
              </form>
              
              <p className="mt-6 text-center text-sm text-slate-500">
                We'll email you a magic link to sign in.
                <br />
                No password required.
              </p>
            </>
          )}
        </div>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-medium">
            Get Realocation Pro
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
