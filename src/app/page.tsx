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
        <section className="relative overflow-hidden hero-gradient">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-teal-100/20 to-transparent rounded-full" />
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Copy */}
              <div className="text-center lg:text-left animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-8 border border-teal-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  50,000+ calculations this month
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 mb-6 leading-[1.1] tracking-tight">
                  Where would your money go{' '}
                  <span className="gradient-text">further</span>?
                </h1>
                
                <p className="text-lg sm:text-xl text-zinc-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Compare your real take-home pay across 50+ cities worldwide. 
                  Factor in taxes, rent, childcare, and cost of living—powered by AI.
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
                <div className="hidden lg:flex items-center gap-8 text-sm text-zinc-500">
                  {[
                    { icon: '✓', text: 'Free to use' },
                    { icon: '✓', text: 'No sign-up required' },
                    { icon: '✓', text: 'Real-time data' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {item.icon}
                      </span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right: Calculator (desktop) */}
              <div className="hidden lg:block animate-fade-in delay-200">
                <div className="relative">
                  {/* Gradient border effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-amber-400 to-teal-500 rounded-3xl opacity-20 blur-sm" />
                  <div className="relative bg-white rounded-2xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 p-8">
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
          </div>
          
          {/* Trusted by section */}
          <div className="relative border-t border-zinc-200/50 bg-white/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <p className="text-center text-sm text-zinc-400 mb-6">Trusted by remote workers and digital nomads from</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 grayscale">
                {['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'].map((company) => (
                  <span key={company} className="text-zinc-400 font-semibold text-lg">{company}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Bar */}
        <Stats />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Features Section */}
        <section className="py-20 sm:py-24 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <span className="badge badge-primary mb-4">Features</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
                More than a simple calculator
              </h2>
              <p className="text-zinc-600 max-w-2xl mx-auto text-lg">
                Comprehensive cost analysis powered by real-time AI research.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '🌍',
                  title: 'Global Coverage',
                  description: 'Compare any city in the world—not just US metros. From Tokyo to Lisbon to Dubai.',
                  color: 'teal',
                },
                {
                  icon: '🤖',
                  title: 'AI-Powered Research',
                  description: 'Real-time data from Perplexity AI. Always up-to-date, never stale.',
                  color: 'indigo',
                },
                {
                  icon: '👨‍👩‍👧‍👦',
                  title: 'Family Calculations',
                  description: 'Factor in childcare costs, school tuition, and family size adjustments.',
                  color: 'amber',
                },
                {
                  icon: '🏛️',
                  title: 'Real Tax Brackets',
                  description: 'Actual income tax calculations with country-specific brackets and rates.',
                  color: 'teal',
                },
                {
                  icon: '🍽️',
                  title: 'Lifestyle Costs',
                  description: 'From groceries to restaurants to gym memberships—every expense covered.',
                  color: 'indigo',
                },
                {
                  icon: '💱',
                  title: 'Multi-Currency',
                  description: 'All costs converted to your currency. Compare apples to apples.',
                  color: 'amber',
                },
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="card p-6 hover:border-teal-200 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center text-2xl mb-4 
                                  group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-zinc-900 mb-2 text-lg">{feature.title}</h3>
                  <p className="text-zinc-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* CTA Section */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 pattern-dots" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block px-4 py-2 bg-white/10 text-teal-100 rounded-full text-sm font-medium mb-6">
              Ready to explore?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Find where your money goes further
            </h2>
            <p className="text-teal-100 mb-10 max-w-2xl mx-auto text-lg">
              Join 50,000+ people who&apos;ve used Realocation to make smarter decisions about where to live, work, and thrive.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-teal-700 font-semibold 
                         rounded-xl hover:bg-teal-50 transition-all shadow-2xl shadow-black/20
                         hover:scale-105 touch-manipulation group"
            >
              Try the Global Calculator
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center mb-2">
        <h3 className="text-lg font-semibold text-zinc-900">Calculate Your Savings</h3>
        <p className="text-sm text-zinc-500">Enter your details below</p>
      </div>
      
      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-zinc-700 mb-2">
          Your annual salary
        </label>
        <SalaryInput value={salary} onChange={setSalary} />
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-zinc-700 mb-2">
          Your current city
        </label>
        <CitySelect value={cityId} onChange={setCityId} />
      </div>
      
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full py-4 px-6 text-lg font-semibold text-white 
                   bg-gradient-to-r from-teal-500 to-teal-600
                   rounded-xl hover:from-teal-600 hover:to-teal-700
                   focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 
                   transition-all disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30
                   touch-manipulation active:scale-[0.98]"
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
          <span className="flex items-center justify-center gap-2">
            Show Me Where
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        )}
      </button>
      
      <div className="flex items-center justify-center gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure
        </span>
        <span>•</span>
        <span>Free forever</span>
        <span>•</span>
        <span>No sign-up</span>
      </div>
    </form>
  );
}
