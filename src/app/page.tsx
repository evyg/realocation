'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Stats from '@/components/Stats';
import FAQ from '@/components/FAQ';
import SalaryInput from '@/components/SalaryInput';
import CitySelect from '@/components/CitySelect';

export default function Home() {
  const router = useRouter();
  const [salary, setSalary] = useState(150000);
  const [cityId, setCityId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salary || !cityId) return;
    setIsLoading(true);
    router.push(`/results?salary=${salary}&city=${cityId}`);
  };
  
  const isValid = salary > 0 && cityId !== '';
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl" />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  50,000+ calculations performed
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Where would your money go{' '}
                  <span className="text-blue-600">further</span>?
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                  Compare your real take-home pay across 50+ US cities. 
                  Factor in taxes, rent, and cost of living in seconds.
                </p>
                
                {/* Mobile: Show form here */}
                <div className="lg:hidden">
                  <CalculatorForm
                    salary={salary}
                    setSalary={setSalary}
                    cityId={cityId}
                    setCityId={setCityId}
                    isLoading={isLoading}
                    isValid={isValid}
                    onSubmit={handleSubmit}
                  />
                </div>
                
                {/* Desktop: Trust signals */}
                <div className="hidden lg:flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free to use</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No sign-up required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Results in 10 seconds</span>
                  </div>
                </div>
              </div>
              
              {/* Right: Calculator (desktop) */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <CalculatorForm
                    salary={salary}
                    setSalary={setSalary}
                    cityId={cityId}
                    setCityId={setCityId}
                    isLoading={isLoading}
                    isValid={isValid}
                    onSubmit={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Bar */}
        <Stats />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Features Section */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                More than a simple cost calculator
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We go beyond basic comparisons to give you the full financial picture.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '🏛️',
                  title: 'Real Tax Calculations',
                  description: 'Federal + state income tax using actual 2024 brackets—not estimates.',
                },
                {
                  icon: '🏠',
                  title: 'Accurate Rent Data',
                  description: 'Median rent prices updated monthly from real market data.',
                },
                {
                  icon: '📊',
                  title: 'Monthly Surplus',
                  description: 'See exactly how much you\'ll have left after taxes and rent.',
                },
                {
                  icon: '🎯',
                  title: 'Ranked Results',
                  description: 'Cities sorted by how much better off you\'d be compared to now.',
                },
                {
                  icon: '⚡',
                  title: 'Instant Results',
                  description: 'No waiting, no loading screens. Results in under 10 seconds.',
                },
                {
                  icon: '📱',
                  title: 'Mobile Friendly',
                  description: 'Works perfectly on any device. Calculate on the go.',
                },
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to find where your money goes further?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 50,000+ people who&apos;ve used Realocation to make smarter relocation decisions.
            </p>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold 
                         rounded-xl hover:bg-blue-50 transition-colors shadow-lg touch-manipulation"
            >
              Try the Free Calculator
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
        
        {/* FAQ */}
        <FAQ 
          title="Frequently Asked Questions" 
          subtitle="Everything you need to know about using Realocation"
        />
      </main>
      
      <Footer />
    </>
  );
}

// Calculator Form Component
function CalculatorForm({
  salary,
  setSalary,
  cityId,
  setCityId,
  isLoading,
  isValid,
  onSubmit,
}: {
  salary: number;
  setSalary: (v: number) => void;
  cityId: string;
  setCityId: (v: string) => void;
  isLoading: boolean;
  isValid: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
          Your annual salary
        </label>
        <SalaryInput value={salary} onChange={setSalary} />
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          Your current city
        </label>
        <CitySelect value={cityId} onChange={setCityId} />
      </div>
      
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full py-4 px-6 text-lg font-semibold text-white bg-blue-600 
                   rounded-xl hover:bg-blue-700 active:bg-blue-800
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   transition-all disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                   touch-manipulation"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Calculating...
          </span>
        ) : (
          'Show Me Where →'
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        Free • No sign-up • Results in 10 seconds
      </p>
    </form>
  );
}
