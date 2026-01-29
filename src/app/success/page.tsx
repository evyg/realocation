'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Content */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          You&apos;re all set! 🎉
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thanks for upgrading to Realocation Pro. You now have access to all features, 
          including full city rankings, side-by-side comparisons, and detailed breakdowns.
        </p>
        
        {/* What's Next */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-4">What you can do now:</h2>
          <ul className="space-y-3">
            {[
              'See all 50+ cities ranked for your salary',
              'Compare up to 5 cities side-by-side',
              'Adjust for different housing sizes',
              'Export your results to PDF',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white 
                   font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Start Calculating
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        
        {/* Receipt info */}
        <p className="mt-6 text-sm text-gray-500">
          A receipt has been sent to your email.
          {sessionId && (
            <span className="block mt-1 text-xs text-gray-400">
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
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </main>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
