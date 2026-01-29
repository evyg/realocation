'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import EmailResultsModal from '@/components/EmailResultsModal';
import { compareCities, formatCurrency, getCityById } from '@/lib/calculations';
import { createCheckoutSession, isPro } from '@/lib/checkout';

function ResultsContent() {
  const searchParams = useSearchParams();
  const salary = parseInt(searchParams.get('salary') || '0', 10);
  const cityId = searchParams.get('city') || '';
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [isProUser, setIsProUser] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Check pro status on mount
  useEffect(() => {
    setIsProUser(isPro());
  }, []);
  
  // Handle checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const checkoutUrl = await createCheckoutSession();
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      alert('Unable to start checkout. Please try again.');
      setIsCheckingOut(false);
    }
  };
  
  const results = useMemo(() => {
    if (!salary || !cityId) return null;
    
    try {
      return compareCities(salary, cityId);
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [salary, cityId]);
  
  const currentCity = getCityById(cityId);
  
  if (!salary || !cityId || !results || !currentCity) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Missing Information
          </h1>
          <p className="text-gray-600 mb-6">
            Please enter your salary and city to see results.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-4 bg-blue-600 text-white 
                       font-medium rounded-xl hover:bg-blue-700 transition-colors
                       touch-manipulation active:bg-blue-800"
          >
            ← Start Over
          </Link>
        </div>
      </main>
    );
  }
  
  const betterCities = results.rankedCities.filter(r => r.differenceFromCurrent > 0);
  const FREE_LIMIT = isProUser ? 999 : 5; // Pro users see all cities
  
  // Prepare data for email
  const emailResults = betterCities.map(r => ({
    name: r.city.name,
    state: r.city.state,
    monthlySurplus: r.monthlySurplus,
    difference: r.differenceFromCurrent,
  }));
  
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `I could have $${Math.round(betterCities[0]?.differenceFromCurrent || 0).toLocaleString()} more per month by moving from ${currentCity.name} to ${betterCities[0]?.city.name}! Check your own: `;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Realocation Results',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy link
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header - sticky, mobile-optimized */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-inset">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600 py-2 touch-manipulation">
            Realocation
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 
                       py-2 px-3 -mr-3 touch-manipulation active:bg-gray-100 rounded-lg"
          >
            ← New search
          </Link>
        </div>
      </header>
      
      {/* Floating Action Bar - Mobile-first */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 
                      safe-area-inset-bottom sm:relative sm:border-0 sm:bg-transparent sm:p-0">
        <div className="max-w-2xl mx-auto flex gap-3 sm:hidden">
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex-1 py-4 px-4 bg-blue-600 text-white font-semibold rounded-xl
                       flex items-center justify-center gap-2 touch-manipulation active:bg-blue-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Save Results
          </button>
          <button
            onClick={handleShare}
            className="py-4 px-5 bg-gray-100 text-gray-700 font-semibold rounded-xl
                       flex items-center justify-center gap-2 touch-manipulation active:bg-gray-200"
          >
            {shareStatus === 'copied' ? (
              <>
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Results - with bottom padding for floating bar on mobile */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-28 sm:pb-8">
        {/* Summary */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
            🎯 {betterCities.length} cities where you&apos;d have MORE
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Results for {formatCurrency(salary)}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Currently in {currentCity.name}, {currentCity.state}
          </p>
        </div>
        
        {/* Desktop action buttons */}
        <div className="hidden sm:flex gap-3 mb-6 justify-center">
          <button
            onClick={() => setShowEmailModal(true)}
            className="py-3 px-5 bg-blue-600 text-white font-medium rounded-xl
                       flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Results
          </button>
          <button
            onClick={handleShare}
            className="py-3 px-5 bg-gray-100 text-gray-700 font-medium rounded-xl
                       flex items-center gap-2 hover:bg-gray-200 transition-colors"
          >
            {shareStatus === 'copied' ? (
              <>
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </>
            )}
          </button>
        </div>
        
        {/* Current City Card */}
        <div className="mb-6">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Your Current Situation
          </h2>
          <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {currentCity.name}, {currentCity.state}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Rent: {formatCurrency(results.currentCity.monthlyRent)}/mo
                </p>
              </div>
              <div className="text-right">
                <div className="text-base sm:text-lg font-bold text-gray-900">
                  {formatCurrency(results.currentCity.monthlySurplus)}/mo
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Monthly surplus
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-500 block">Net Income</span>
                <span className="font-medium text-gray-900">{formatCurrency(results.currentCity.netIncome)}/yr</span>
              </div>
              <div>
                <span className="text-gray-500 block">Federal Tax</span>
                <span className="font-medium text-gray-900">{formatCurrency(results.currentCity.federalTax)}</span>
              </div>
              <div>
                <span className="text-gray-500 block">State Tax</span>
                <span className="font-medium text-gray-900">{formatCurrency(results.currentCity.stateTax)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Better Cities */}
        <div className="mb-6">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Better Options ({betterCities.length} cities)
          </h2>
          <div className="space-y-3">
            {betterCities.slice(0, FREE_LIMIT).map((result, index) => (
              <CityCard
                key={result.city.id}
                result={result}
                rank={index + 1}
              />
            ))}
            
            {/* Locked cards */}
            {betterCities.length > FREE_LIMIT && (
              <>
                {[...Array(Math.min(3, betterCities.length - FREE_LIMIT))].map((_, index) => (
                  <CityCard
                    key={`locked-${index}`}
                    result={betterCities[FREE_LIMIT + index]}
                    rank={FREE_LIMIT + index + 1}
                    isLocked
                  />
                ))}
              </>
            )}
          </div>
        </div>
        
        {/* Upgrade CTA */}
        {betterCities.length > FREE_LIMIT && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 sm:p-6 text-white text-center shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              💡 Want the full picture?
            </h3>
            <p className="text-blue-100 mb-4 text-sm sm:text-base">
              You&apos;re only seeing {FREE_LIMIT} of {betterCities.length} cities where you&apos;d be better off.
            </p>
            <ul className="text-left text-sm mb-5 space-y-2 max-w-xs mx-auto">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>See all {betterCities.length}+ cities ranked</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Compare 5 cities side-by-side</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Adjust for housing, family size</span>
              </li>
            </ul>
            <button
              className="w-full py-4 px-6 bg-white text-blue-600 font-semibold rounded-xl 
                         hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-lg
                         touch-manipulation disabled:opacity-50"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Unlock Full Calculator — $39'
              )}
            </button>
            <p className="text-xs text-blue-200 mt-3">
              One-time payment. Use forever.
            </p>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-500">
          <p>
            Calculations based on 2024 federal and state tax rates.
          </p>
          <p className="mt-1">
            Cost of living data updated monthly.
          </p>
        </div>
      </div>
      
      {/* Email Modal */}
      <EmailResultsModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        salary={salary}
        currentCity={{
          name: currentCity.name,
          state: currentCity.state,
          monthlySurplus: results.currentCity.monthlySurplus,
        }}
        results={emailResults}
      />
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
