'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SalaryInput from '@/components/SalaryInput';
import CitySelect from '@/components/CitySelect';

export default function Home() {
  const router = useRouter();
  const [salary, setSalary] = useState(150000);
  const [cityId, setCityId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!salary || !cityId) {
      return;
    }
    
    setIsLoading(true);
    router.push(`/results?salary=${salary}&city=${cityId}`);
  };
  
  const isValid = salary > 0 && cityId !== '';
  
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="w-full max-w-md">
          {/* Logo/Title */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Where would your money go{' '}
              <span className="text-blue-600">further</span>?
            </h1>
            <p className="text-lg text-gray-600">
              Find out in 10 seconds.
            </p>
          </div>
          
          {/* Calculator Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                         rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-offset-2 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
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
          </form>
          
          {/* Trust Signals */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>50 US cities</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>2024 tax rates</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-md mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Realocation. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
