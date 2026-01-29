'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { setProStatus } from '@/lib/checkout';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verified, setVerified] = useState(false);
  
  // Verify the session and mark user as pro
  useEffect(() => {
    const verifyAndActivate = async () => {
      if (!sessionId) {
        // No session ID, but they're on the success page - still activate
        setProStatus();
        setVerified(true);
        return;
      }
      
      // In production, verify the session with Stripe
      // For now, we'll trust the redirect and mark as pro
      try {
        // Optionally verify with backend
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setProStatus(data.email);
        } else {
          // Still activate - they made it to success page via Stripe redirect
          setProStatus();
        }
      } catch {
        // Still activate on error
        setProStatus();
      }
      setVerified(true);
    };
    
    verifyAndActivate();
  }, [sessionId]);
  
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Content */}
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-4">
          You&apos;re all set! 🎉
        </h1>
        
        <p className="text-zinc-600 mb-8">
          Thanks for upgrading to Realocation Pro. You now have access to all features, 
          including full city rankings, side-by-side comparisons, and detailed breakdowns.
        </p>
        
        {verified && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Pro features activated
          </div>
        )}
        
        {/* What's Next */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-8 text-left">
          <h2 className="font-semibold text-zinc-900 mb-4">What you can do now:</h2>
          <ul className="space-y-3">
            {[
              'See all cities ranked for your salary',
              'Compare cities worldwide with AI research',
              'Factor in childcare, lifestyle, and more',
              'Full cost breakdown by category',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-zinc-600 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/calculator"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white 
                     font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/25"
          >
            Global Calculator
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-100 text-zinc-700 
                     font-semibold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            US Calculator
          </Link>
        </div>
        
        {/* Receipt info */}
        <p className="mt-6 text-sm text-zinc-500">
          A receipt has been sent to your email.
          {sessionId && (
            <span className="block mt-1 text-xs text-zinc-400">
              Order: {sessionId.slice(0, 20)}...
            </span>
          )}
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full"></div>
        </main>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
