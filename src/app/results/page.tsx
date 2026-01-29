'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import CityCard from '@/components/CityCard';
import { compareCities, formatCurrency, getCityById } from '@/lib/calculations';

function ResultsContent() {
  const searchParams = useSearchParams();
  const salary = parseInt(searchParams.get('salary') || '0', 10);
  const cityId = searchParams.get('city') || '';
  
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Start Over
          </Link>
        </div>
      </main>
    );
  }
  
  const betterCities = results.rankedCities.filter(r => r.differenceFromCurrent > 0);
  const FREE_LIMIT = 5;
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Realocation
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            ← New search
          </Link>
        </div>
      </header>
      
      {/* Results */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Summary */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            🎯 {betterCities.length} cities where you&apos;d have MORE
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Results for {formatCurrency(salary)} salary
          </h1>
          <p className="text-gray-600">
            Currently in {currentCity.name}, {currentCity.state}
          </p>
        </div>
        
        {/* Current City Card */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Your Current Situation
          </h2>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentCity.name}, {currentCity.state}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Rent: {formatCurrency(results.currentCity.monthlyRent)}/mo
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(results.currentCity.monthlySurplus)}/mo
                </div>
                <div className="text-sm text-gray-600">
                  Monthly surplus
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-3 gap-4 text-sm">
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
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Better Options ({betterCities.length} cities)
          </h2>
          <div className="space-y-4">
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
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white text-center shadow-lg">
            <h3 className="text-xl font-bold mb-2">
              💡 Want the full picture?
            </h3>
            <p className="text-blue-100 mb-4">
              You&apos;re only seeing {FREE_LIMIT} of {betterCities.length} cities where you&apos;d be better off.
            </p>
            <ul className="text-left text-sm mb-6 space-y-2 max-w-xs mx-auto">
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
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Dynamic sliders to explore options</span>
              </li>
            </ul>
            <button
              className="w-full py-4 px-6 bg-white text-blue-600 font-semibold rounded-xl 
                         hover:bg-blue-50 transition-colors shadow-lg"
              onClick={() => alert('Stripe checkout coming soon! For now, enjoy the free tier.')}
            >
              Unlock Full Calculator — $39
            </button>
            <p className="text-xs text-blue-200 mt-3">
              One-time payment. Use forever.
            </p>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            Calculations based on 2024 federal and state tax rates.
          </p>
          <p className="mt-1">
            Cost of living data updated monthly.
          </p>
        </div>
      </div>
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
