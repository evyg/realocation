'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  useEffect(() => {
    // If we're on this page with a token, the API should handle it
    // But if somehow we're here without redirect working, manually redirect
    if (token) {
      window.location.href = `/api/auth/verify?token=${token}`;
    } else {
      router.push('/login?error=missing_token');
    }
  }, [token, router]);
  
  return (
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-slate-900">Signing you in...</h2>
      <p className="text-slate-600 mt-2">Please wait a moment</p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900">Loading...</h2>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
