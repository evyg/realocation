'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import citiesData from '@/data/cities-full.json';

interface City {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  population: number;
  stateTaxRate: number;
  localTaxRate: number;
  medianRent1BR: number;
  medianRent2BR: number;
  medianRent3BR: number;
  medianRent4BR: number;
  costIndex: number;
}

interface RankedCity extends City {
  score: number;
  monthlySavings: number;
  annualSavings: number;
  rentForBedrooms: number;
}

interface DeepDiveData {
  city: City;
  breakdown: {
    housing: number;
    utilities: number;
    food: number;
    transportation: number;
    healthcare: number;
    childcare: number;
    lifestyle: number;
    taxes: number;
    total: number;
  };
  quality: {
    safetyIndex: number;
    healthcareIndex: number;
    climateDescription: string;
  };
  insights: string[];
}

const cities = citiesData as City[];

// Helper functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(amount);
}

function getRentForBedrooms(city: City, bedrooms: string): number {
  switch (bedrooms) {
    case 'studio': return city.medianRent1BR * 0.8;
    case '1BR': return city.medianRent1BR;
    case '2BR': return city.medianRent2BR;
    case '3BR': return city.medianRent3BR;
    case '4BR': return city.medianRent4BR;
    default: return city.medianRent1BR;
  }
}

function calculateMonthlyCost(city: City, salary: number, bedrooms: string, hasCar: boolean, numAdults: number, numChildren: number): number {
  const rent = getRentForBedrooms(city, bedrooms);
  const utilities = 150 + (numAdults * 30);
  const food = numAdults * 400 + numChildren * 250;
  const transport = hasCar ? 600 : 150;
  const healthcare = numAdults * 200 + numChildren * 100;
  const childcare = numChildren * 800;
  const lifestyle = salary > 100000 ? 500 : salary > 60000 ? 300 : 150;
  
  // Adjust by cost index
  const indexMultiplier = city.costIndex / 100;
  const baseCost = rent + ((utilities + food + transport + healthcare + lifestyle) * indexMultiplier) + childcare;
  
  return baseCost;
}

function calculateMonthlyTax(salary: number, stateTaxRate: number): number {
  // Simplified: Federal + State
  const federalRate = salary > 200000 ? 0.32 : salary > 100000 ? 0.24 : salary > 50000 ? 0.22 : 0.12;
  const monthlyGross = salary / 12;
  return monthlyGross * (federalRate + stateTaxRate);
}

function rankCities(
  currentCity: City | null,
  salary: number,
  bedrooms: string,
  hasCar: boolean,
  numAdults: number,
  numChildren: number,
  preferences: { lowTax: boolean; bigCity: boolean; lowCost: boolean }
): RankedCity[] {
  const currentCost = currentCity 
    ? calculateMonthlyCost(currentCity, salary, bedrooms, hasCar, numAdults, numChildren) + calculateMonthlyTax(salary, currentCity.stateTaxRate)
    : salary / 12 * 0.7; // Assume 70% of income for baseline
    
  return cities
    .filter(c => c.population > 50000) // Only cities with 50k+ population
    .map(city => {
      const monthlyCost = calculateMonthlyCost(city, salary, bedrooms, hasCar, numAdults, numChildren);
      const monthlyTax = calculateMonthlyTax(salary, city.stateTaxRate);
      const totalMonthly = monthlyCost + monthlyTax;
      const monthlySavings = currentCost - totalMonthly;
      
      // Calculate score (higher = better)
      let score = 50; // Base score
      
      // Cost savings weight (max 30 points)
      score += Math.min(30, Math.max(-30, monthlySavings / 100));
      
      // Tax preference
      if (preferences.lowTax) {
        score += city.stateTaxRate === 0 ? 15 : -city.stateTaxRate * 100;
      }
      
      // City size preference
      if (preferences.bigCity) {
        score += city.population > 500000 ? 10 : city.population > 100000 ? 5 : -5;
      }
      
      // Low cost preference
      if (preferences.lowCost) {
        score += city.costIndex < 90 ? 15 : city.costIndex < 100 ? 5 : -10;
      }
      
      return {
        ...city,
        score,
        monthlySavings,
        annualSavings: monthlySavings * 12,
        rentForBedrooms: getRentForBedrooms(city, bedrooms),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 50); // Top 50 for selection
}

// Email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CalculatorPage() {
  // Step tracking
  const [step, setStep] = useState<'criteria' | 'email' | 'results' | 'deepdive'>('criteria');
  
  // User state
  const [email, setEmail] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  
  // Form state
  const [currentCitySearch, setCurrentCitySearch] = useState('');
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [salary, setSalary] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<'studio' | '1BR' | '2BR' | '3BR' | '4BR'>('1BR');
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [hasCar, setHasCar] = useState(false);
  const [preferences, setPreferences] = useState({
    lowTax: false,
    bigCity: false,
    lowCost: true,
  });
  
  // Results state
  const [rankedCities, setRankedCities] = useState<RankedCity[]>([]);
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set());
  const [deepDiveData, setDeepDiveData] = useState<Map<string, DeepDiveData>>(new Map());
  const [loadingDeepDive, setLoadingDeepDive] = useState<string | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearchResults, setCitySearchResults] = useState<City[]>([]);
  
  // City search
  useEffect(() => {
    if (currentCitySearch.length < 2) {
      setCitySearchResults([]);
      return;
    }
    const search = currentCitySearch.toLowerCase();
    const results = cities
      .filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.state.toLowerCase().includes(search) ||
        `${c.name}, ${c.stateCode}`.toLowerCase().includes(search)
      )
      .sort((a, b) => b.population - a.population)
      .slice(0, 8);
    setCitySearchResults(results);
    setShowCityDropdown(results.length > 0);
  }, [currentCitySearch]);
  
  // Check user status on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('realocation_email');
    if (savedEmail) {
      setEmail(savedEmail);
      checkUserStatus(savedEmail);
    }
  }, []);
  
  async function checkUserStatus(userEmail: string) {
    try {
      const res = await fetch(`/api/user/status?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setIsPro(data.isPro);
        setCreditsRemaining(data.creditsRemaining || 0);
      }
    } catch (e) {
      console.error('Failed to check user status:', e);
    }
  }
  
  function handleCriteriaSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!salary || salary <= 0) {
      setError('Please enter your annual salary');
      return;
    }
    
    setError(null);
    
    // If already have email, skip to results
    if (email && isValidEmail(email)) {
      generateResults();
      setStep('results');
    } else {
      setStep('email');
    }
  }
  
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError(null);
    localStorage.setItem('realocation_email', email);
    
    // Generate results first
    const cities = generateResults();
    
    // Save email + choices to backend
    saveEmail(email, cities);
    
    setStep('results');
  }
  
  async function saveEmail(userEmail: string, cities?: RankedCity[]) {
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userEmail, 
          source: 'calculator',
          salary: Number(salary),
          currentCity: currentCity?.name ? `${currentCity.name}, ${currentCity.stateCode}` : null,
          bedrooms,
          numAdults,
          numChildren,
          hasCar,
          preferences,
          topCities: cities?.slice(0, 10).map(c => ({
            id: c.id,
            name: c.name,
            state: c.stateCode,
            score: c.score,
            monthlySavings: c.monthlySavings,
          })),
        }),
      });
      checkUserStatus(userEmail);
    } catch (e) {
      console.error('Failed to save email:', e);
    }
  }
  
  function generateResults(): RankedCity[] {
    const ranked = rankCities(
      currentCity,
      Number(salary),
      bedrooms,
      hasCar,
      numAdults,
      numChildren,
      preferences
    );
    setRankedCities(ranked);
    return ranked;
  }
  
  function toggleCitySelection(cityId: string) {
    const newSelected = new Set(selectedCities);
    if (newSelected.has(cityId)) {
      newSelected.delete(cityId);
    } else {
      if (newSelected.size >= 3 && !isPro) {
        setError('Free users can select up to 3 cities. Upgrade to Pro for unlimited!');
        return;
      }
      newSelected.add(cityId);
    }
    setSelectedCities(newSelected);
    setError(null);
  }
  
  async function handleGetDeepDive() {
    if (selectedCities.size === 0) {
      setError('Please select at least one city');
      return;
    }
    
    if (!isPro && creditsRemaining < selectedCities.size) {
      // Redirect to checkout
      handleCheckout();
      return;
    }
    
    setStep('deepdive');
    
    // Fetch deep dive for each selected city
    for (const cityId of selectedCities) {
      if (deepDiveData.has(cityId)) continue;
      
      setLoadingDeepDive(cityId);
      try {
        const res = await fetch('/api/deep-dive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            cityId,
            originCity: currentCity?.id,
            salary,
            bedrooms,
            numAdults,
            numChildren,
            hasCar,
          }),
        });
        
        if (res.ok) {
          const data = await res.json();
          setDeepDiveData(prev => new Map(prev).set(cityId, data.report));
          setCreditsRemaining(data.creditsRemaining);
        } else {
          const error = await res.json();
          throw new Error(error.error || 'Failed to get report');
        }
      } catch (e) {
        console.error('Deep dive error:', e);
        setError(e instanceof Error ? e.message : 'Failed to generate report');
      }
    }
    setLoadingDeepDive(null);
  }
  
  async function handleCheckout() {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      }
    } catch (e) {
      console.error('Checkout error:', e);
      setError('Failed to start checkout');
    }
  }
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Find Your Best City
            </h1>
            <p className="text-teal-100 text-lg">
              Get personalized recommendations based on your income and lifestyle
            </p>
            
            {/* Progress steps */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {['criteria', 'email', 'results', 'deepdive'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${step === s ? 'bg-white text-teal-700' : 
                      ['criteria', 'email', 'results', 'deepdive'].indexOf(step) > i 
                        ? 'bg-teal-400 text-white' 
                        : 'bg-teal-800 text-teal-400'}`}
                  >
                    {i + 1}
                  </div>
                  {i < 3 && <div className={`w-8 h-0.5 ${['criteria', 'email', 'results', 'deepdive'].indexOf(step) > i ? 'bg-teal-400' : 'bg-teal-800'}`} />}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}
          
          {/* Step 1: Criteria */}
          {step === 'criteria' && (
            <form onSubmit={handleCriteriaSubmit} className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Tell us about yourself</h2>
                
                {/* Current city */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Where do you live now? (optional)
                  </label>
                  <input
                    type="text"
                    value={currentCity ? `${currentCity.name}, ${currentCity.stateCode}` : currentCitySearch}
                    onChange={(e) => {
                      setCurrentCitySearch(e.target.value);
                      setCurrentCity(null);
                    }}
                    onFocus={() => currentCitySearch.length >= 2 && setShowCityDropdown(true)}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {showCityDropdown && citySearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {citySearchResults.map(city => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => {
                            setCurrentCity(city);
                            setCurrentCitySearch('');
                            setShowCityDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-teal-50 flex justify-between items-center"
                        >
                          <span className="font-medium">{city.name}, {city.stateCode}</span>
                          <span className="text-sm text-gray-500">{city.population.toLocaleString()} pop</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual household income (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value ? Number(e.target.value) : '')}
                      placeholder="100,000"
                      required
                      className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Household */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                    <select
                      value={numAdults}
                      onChange={(e) => setNumAdults(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                    >
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                    <select
                      value={numChildren}
                      onChange={(e) => setNumChildren(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                    >
                      {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Housing preference</label>
                  <div className="flex gap-2">
                    {(['studio', '1BR', '2BR', '3BR', '4BR'] as const).map(br => (
                      <button
                        key={br}
                        type="button"
                        onClick={() => setBedrooms(br)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition
                          ${bedrooms === br 
                            ? 'bg-teal-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {br}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Car */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCar}
                    onChange={(e) => setHasCar(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-teal-600"
                  />
                  <span className="text-gray-700">I have/want a car</span>
                </label>
                
                {/* Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What matters most?</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'lowTax', label: '🏦 Low taxes' },
                      { key: 'bigCity', label: '🏙️ Big city' },
                      { key: 'lowCost', label: '💰 Low cost' },
                    ].map(pref => (
                      <button
                        key={pref.key}
                        type="button"
                        onClick={() => setPreferences(p => ({ ...p, [pref.key]: !p[pref.key as keyof typeof p] }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition
                          ${preferences[pref.key as keyof typeof preferences]
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {pref.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-teal-600 hover:to-emerald-700 transition shadow-lg"
                >
                  Find My Best Cities →
                </button>
              </div>
            </form>
          )}
          
          {/* Step 2: Email gate */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2">Almost there!</h2>
                <p className="text-gray-600 mb-6">
                  Enter your email to see your personalized Top 10 cities. We&apos;ll save your results so you can access them anytime.
                </p>
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-4"
                />
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to-emerald-700 transition"
                >
                  Show My Results
                </button>
                
                <p className="text-xs text-gray-500 mt-4">
                  We respect your privacy. No spam, ever.
                </p>
              </div>
            </form>
          )}
          
          {/* Step 3: Results (Top 10) */}
          {step === 'results' && (
            <div className="space-y-6">
              {/* Summary header */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Top Cities</h2>
                    <p className="text-gray-600">
                      Based on {formatCurrency(Number(salary))}/year income • {numAdults} adult{numAdults > 1 ? 's' : ''}{numChildren > 0 ? ` • ${numChildren} child${numChildren > 1 ? 'ren' : ''}` : ''}
                    </p>
                  </div>
                  {isPro && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      <span>⭐</span> Pro • {creditsRemaining} reports left
                    </div>
                  )}
                </div>
              </div>
              
              {/* Top 10 list */}
              <div className="grid gap-4">
                {rankedCities.slice(0, 10).map((city, index) => (
                  <div
                    key={city.id}
                    className={`bg-white rounded-xl border-2 p-4 sm:p-6 transition cursor-pointer
                      ${selectedCities.has(city.id) 
                        ? 'border-teal-500 bg-teal-50' 
                        : 'border-gray-100 hover:border-teal-200'}`}
                    onClick={() => toggleCitySelection(city.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                        ${index < 3 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {index + 1}
                      </div>
                      
                      {/* City info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{city.name}, {city.stateCode}</h3>
                            <p className="text-sm text-gray-500">
                              {city.population > 1000000 ? 'Major Metro' : city.population > 500000 ? 'Large City' : city.population > 100000 ? 'Mid-Size City' : 'Small City'}
                              {' • '}{city.population.toLocaleString()} pop
                            </p>
                          </div>
                          
                          {/* Savings badge */}
                          {city.monthlySavings > 0 ? (
                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium whitespace-nowrap">
                              Save {formatCurrency(city.monthlySavings)}/mo
                            </div>
                          ) : city.monthlySavings < -200 ? (
                            <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium whitespace-nowrap">
                              +{formatCurrency(Math.abs(city.monthlySavings))}/mo
                            </div>
                          ) : null}
                        </div>
                        
                        {/* Quick stats */}
                        <div className="flex flex-wrap gap-3 mt-3">
                          <span className="text-sm text-gray-600">
                            🏠 {formatCurrency(city.rentForBedrooms)}/mo rent
                          </span>
                          <span className="text-sm text-gray-600">
                            {city.stateTaxRate === 0 ? '✨ No state tax!' : `📊 ${(city.stateTaxRate * 100).toFixed(1)}% state tax`}
                          </span>
                          <span className={`text-sm ${city.costIndex < 100 ? 'text-green-600' : 'text-gray-600'}`}>
                            💰 Cost index: {city.costIndex}
                          </span>
                        </div>
                      </div>
                      
                      {/* Selection checkbox */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${selectedCities.has(city.id) ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                        {selectedCities.has(city.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {selectedCities.size > 0 
                        ? `Get detailed reports for ${selectedCities.size} ${selectedCities.size === 1 ? 'city' : 'cities'}`
                        : 'Select cities for detailed analysis'}
                    </h3>
                    <p className="text-teal-100">
                      {isPro 
                        ? `You have ${creditsRemaining} reports remaining`
                        : 'Full breakdown: housing, taxes, lifestyle costs, schools & more'}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleGetDeepDive}
                    disabled={selectedCities.size === 0}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition whitespace-nowrap
                      ${selectedCities.size > 0
                        ? 'bg-white text-teal-700 hover:bg-teal-50'
                        : 'bg-teal-700 text-teal-400 cursor-not-allowed'}`}
                  >
                    {isPro ? 'Generate Reports →' : `Unlock for $39 →`}
                  </button>
                </div>
                
                {!isPro && (
                  <p className="text-teal-200 text-sm mt-4">
                    ✓ 3 detailed city reports • ✓ PDF export • ✓ Lifetime access
                  </p>
                )}
              </div>
              
              {/* Edit criteria */}
              <button
                onClick={() => setStep('criteria')}
                className="text-teal-600 font-medium hover:underline"
              >
                ← Edit my criteria
              </button>
            </div>
          )}
          
          {/* Step 4: Deep Dive */}
          {step === 'deepdive' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Detailed Reports</h2>
                <button
                  onClick={() => setStep('results')}
                  className="text-teal-600 font-medium hover:underline"
                >
                  ← Back to Top 10
                </button>
              </div>
              
              {/* Loading state */}
              {loadingDeepDive && (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Researching {rankedCities.find(c => c.id === loadingDeepDive)?.name}...</h3>
                  <p className="text-gray-500">Gathering real-time data on costs, schools, neighborhoods & more</p>
                </div>
              )}
              
              {/* Deep dive cards */}
              {Array.from(deepDiveData.entries()).map(([cityId, data]) => (
                <div key={cityId} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white">
                    <h3 className="text-2xl font-bold">{data.city.name}, {data.city.stateCode}</h3>
                    <p className="text-teal-100">{data.city.state} • Population: {data.city.population.toLocaleString()}</p>
                  </div>
                  
                  {/* Cost breakdown */}
                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Monthly Cost Breakdown</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Housing', value: data.breakdown.housing, icon: '🏠' },
                        { label: 'Utilities', value: data.breakdown.utilities, icon: '💡' },
                        { label: 'Food', value: data.breakdown.food, icon: '🍕' },
                        { label: 'Transportation', value: data.breakdown.transportation, icon: '🚗' },
                        { label: 'Healthcare', value: data.breakdown.healthcare, icon: '🏥' },
                        { label: 'Childcare', value: data.breakdown.childcare, icon: '👶' },
                        { label: 'Lifestyle', value: data.breakdown.lifestyle, icon: '🎭' },
                        { label: 'Taxes', value: data.breakdown.taxes, icon: '📊' },
                      ].filter(item => item.value > 0).map(item => (
                        <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span className="text-gray-700">{item.label}</span>
                          </span>
                          <span className="font-semibold">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between py-3 font-bold text-lg">
                        <span>Total Monthly</span>
                        <span className="text-teal-600">{formatCurrency(data.breakdown.total)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quality of life */}
                  <div className="p-6 bg-gray-50">
                    <h4 className="font-bold text-gray-900 mb-4">Quality of Life</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Safety Index</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-teal-500 rounded-full" style={{ width: `${data.quality.safetyIndex}%` }} />
                          </div>
                          <span className="font-medium">{data.quality.safetyIndex}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Healthcare Index</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-teal-500 rounded-full" style={{ width: `${data.quality.healthcareIndex}%` }} />
                          </div>
                          <span className="font-medium">{data.quality.healthcareIndex}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Climate</p>
                      <p className="text-gray-900">{data.quality.climateDescription}</p>
                    </div>
                  </div>
                  
                  {/* Insights */}
                  {data.insights.length > 0 && (
                    <div className="p-6">
                      <h4 className="font-bold text-gray-900 mb-3">💡 Key Insights</h4>
                      <ul className="space-y-2">
                        {data.insights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <span className="text-teal-500">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add more cities */}
              {creditsRemaining > 0 && (
                <div className="text-center">
                  <button
                    onClick={() => setStep('results')}
                    className="text-teal-600 font-medium hover:underline"
                  >
                    + Research more cities ({creditsRemaining} reports remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
