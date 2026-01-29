'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Child {
  id: string;
  age: number;
}

interface LocationData {
  location: string;
  country: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToUSD: number;
  housing: {
    rent1BR: number;
    rent2BR: number;
    rent3BR: number;
  };
  quality: {
    safetyIndex: number;
    healthcareIndex: number;
    costOfLivingIndex: number;
    climateDescription: string;
  };
}

interface ComparisonResult {
  origin: LocationData;
  destination: LocationData;
  breakdown: {
    origin: {
      grossIncome: number;
      taxes: number;
      netIncome: number;
      housing: number;
      utilities: number;
      food: number;
      transportation: number;
      healthcare: number;
      childcare: number;
      lifestyle: number;
      totalExpenses: number;
      surplus: number;
    };
    destination: {
      grossIncome: number;
      taxes: number;
      netIncome: number;
      housing: number;
      utilities: number;
      food: number;
      transportation: number;
      healthcare: number;
      childcare: number;
      lifestyle: number;
      totalExpenses: number;
      surplus: number;
    };
  };
  comparison: {
    totalMonthlyCostOrigin: number;
    totalMonthlyCostDestination: number;
    costDifferencePercent: number;
    monthlySurplusOrigin: number;
    monthlySurplusDestination: number;
    surplusDifferenceMonthly: number;
    surplusDifferenceAnnual: number;
    salaryNeededToMatchLifestyle: number;
    purchasingPowerIndex: number;
  };
  recommendations: string[];
}

export default function CalculatorPage() {
  // Form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [salary, setSalary] = useState(100000);
  const [bedrooms, setBedrooms] = useState<'studio' | '1BR' | '2BR' | '3BR' | '4BR'>('1BR');
  const [numAdults, setNumAdults] = useState(1);
  const [children, setChildren] = useState<Child[]>([]);
  const [hasCar, setHasCar] = useState(false);
  const [diningOutFrequency, setDiningOutFrequency] = useState<'rarely' | 'sometimes' | 'often'>('sometimes');
  const [lifestyleLevel, setLifestyleLevel] = useState<'budget' | 'moderate' | 'comfortable' | 'luxury'>('moderate');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  
  const addChild = () => {
    setChildren([...children, { id: Math.random().toString(36).substr(2, 9), age: 3 }]);
  };
  
  const removeChild = (id: string) => {
    setChildren(children.filter(c => c.id !== id));
  };
  
  const updateChildAge = (id: string, age: number) => {
    setChildren(children.map(c => c.id === id ? { ...c, age } : c));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      setError('Please enter both origin and destination cities');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          salary,
          bedrooms,
          numAdults,
          children: children.map(c => ({ age: c.age })),
          hasCar,
          diningOutFrequency,
          lifestyleLevel,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate comparison');
      }
      
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatCurrency = (amount: number, symbol = '$') => {
    return `${symbol}${Math.abs(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };
  
  const formatPercent = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-zinc-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-4">
                AI-Powered Calculator
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
                Global Cost Comparison
              </h1>
              <p className="text-xl text-teal-100">
                Compare any two cities worldwide with real-time data on housing, taxes, childcare, and lifestyle costs.
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Inputs */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                    Locations
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Where do you live now?
                      </label>
                      <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="e.g., San Francisco, USA"
                        className="input-modern"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Where are you considering?
                      </label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g., Lisbon, Portugal"
                        className="input-modern"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Income */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                    Income
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Annual salary (in your current currency)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">$</span>
                      <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="input-modern pl-8"
                        min={0}
                        step={1000}
                        required
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">We'll convert to local currency automatically</p>
                  </div>
                </div>
                
                {/* Household */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                    Household
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Number of adults
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setNumAdults(Math.max(1, numAdults - 1))}
                          className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-12 text-center text-xl font-semibold">{numAdults}</span>
                        <button
                          type="button"
                          onClick={() => setNumAdults(Math.min(6, numAdults + 1))}
                          className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Children
                      </label>
                      {children.length === 0 ? (
                        <p className="text-sm text-zinc-500 mb-3">No children added</p>
                      ) : (
                        <div className="space-y-2 mb-3">
                          {children.map((child, index) => (
                            <div key={child.id} className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg">
                              <span className="text-sm text-zinc-600">Child {index + 1}</span>
                              <select
                                value={child.age}
                                onChange={(e) => updateChildAge(child.id, Number(e.target.value))}
                                className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg text-sm"
                              >
                                {[...Array(18)].map((_, i) => (
                                  <option key={i} value={i}>{i} {i === 1 ? 'year' : 'years'} old</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => removeChild(child.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={addChild}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add child
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Housing preference
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {(['studio', '1BR', '2BR', '3BR', '4BR'] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setBedrooms(option)}
                            className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                              bedrooms === option
                                ? 'bg-teal-600 text-white border-teal-600'
                                : 'bg-white text-zinc-700 border-zinc-200 hover:border-teal-300'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Lifestyle */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
                    Lifestyle
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Lifestyle level
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          { value: 'budget', label: 'Budget', emoji: '💰' },
                          { value: 'moderate', label: 'Moderate', emoji: '⚖️' },
                          { value: 'comfortable', label: 'Comfortable', emoji: '🛋️' },
                          { value: 'luxury', label: 'Luxury', emoji: '✨' },
                        ] as const).map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setLifestyleLevel(option.value)}
                            className={`py-3 px-4 text-sm font-medium rounded-lg border transition-all flex items-center gap-2 ${
                              lifestyleLevel === option.value
                                ? 'bg-teal-600 text-white border-teal-600'
                                : 'bg-white text-zinc-700 border-zinc-200 hover:border-teal-300'
                            }`}
                          >
                            <span>{option.emoji}</span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-2">
                        Dining out frequency
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { value: 'rarely', label: 'Rarely', sub: '1-2x/month' },
                          { value: 'sometimes', label: 'Sometimes', sub: '1-2x/week' },
                          { value: 'often', label: 'Often', sub: '3-4x/week' },
                        ] as const).map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setDiningOutFrequency(option.value)}
                            className={`py-3 px-3 text-sm rounded-lg border transition-all ${
                              diningOutFrequency === option.value
                                ? 'bg-teal-600 text-white border-teal-600'
                                : 'bg-white text-zinc-700 border-zinc-200 hover:border-teal-300'
                            }`}
                          >
                            <div className="font-medium">{option.label}</div>
                            <div className={`text-xs mt-0.5 ${diningOutFrequency === option.value ? 'text-teal-100' : 'text-zinc-400'}`}>
                              {option.sub}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasCar}
                          onChange={(e) => setHasCar(e.target.checked)}
                          className="w-5 h-5 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-zinc-700">I have/want a car</span>
                          <p className="text-xs text-zinc-500">Includes insurance, fuel, parking costs</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !origin || !destination}
                  className="w-full py-4 px-6 text-lg font-semibold text-white 
                           bg-gradient-to-r from-teal-500 to-teal-600
                           rounded-xl hover:from-teal-600 hover:to-teal-700
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-lg shadow-teal-500/25"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Researching locations...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Compare Cities
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  )}
                </button>
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </form>
            </div>
            
            {/* Results */}
            <div className="lg:col-span-3">
              {!result && !isLoading && (
                <div className="card p-12 text-center">
                  <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">Enter your details</h3>
                  <p className="text-zinc-500 max-w-sm mx-auto">
                    Fill out the form to see a comprehensive cost comparison between your two cities.
                  </p>
                </div>
              )}
              
              {isLoading && (
                <div className="card p-12 text-center">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-teal-500 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">Researching locations...</h3>
                  <p className="text-zinc-500 max-w-sm mx-auto">
                    Our AI is gathering real-time data on housing, taxes, childcare, and cost of living. This may take 10-20 seconds.
                  </p>
                </div>
              )}
              
              {result && (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="card p-6 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-teal-100 text-sm">Monthly surplus difference</p>
                        <p className="text-4xl font-bold">
                          {result.comparison.surplusDifferenceMonthly >= 0 ? '+' : ''}
                          {formatCurrency(result.comparison.surplusDifferenceMonthly)}
                        </p>
                        <p className="text-teal-100 text-sm mt-1">
                          {result.comparison.surplusDifferenceAnnual >= 0 ? '+' : ''}
                          {formatCurrency(result.comparison.surplusDifferenceAnnual)}/year
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        result.comparison.surplusDifferenceMonthly >= 0 
                          ? 'bg-green-400/20 text-green-100' 
                          : 'bg-red-400/20 text-red-100'
                      }`}>
                        {result.comparison.surplusDifferenceMonthly >= 0 ? '↑ Better off' : '↓ Worse off'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-teal-100 text-xs uppercase tracking-wide mb-1">Cost of Living</p>
                        <p className="text-2xl font-bold">{formatPercent(result.comparison.costDifferencePercent)}</p>
                        <p className="text-teal-100 text-sm">
                          {result.comparison.costDifferencePercent < 0 ? 'Cheaper' : 'More expensive'}
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-teal-100 text-xs uppercase tracking-wide mb-1">Purchasing Power</p>
                        <p className="text-2xl font-bold">{result.comparison.purchasingPowerIndex}</p>
                        <p className="text-teal-100 text-sm">
                          {result.comparison.purchasingPowerIndex > 100 ? 'More buying power' : 'Less buying power'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Location Cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">📍</span>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-wide">Current</p>
                          <h3 className="font-semibold text-zinc-900">{result.origin.location}</h3>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Monthly surplus</span>
                          <span className="font-semibold">{formatCurrency(result.comparison.monthlySurplusOrigin)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Monthly costs</span>
                          <span className="font-medium">{formatCurrency(result.comparison.totalMonthlyCostOrigin)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Currency</span>
                          <span className="font-medium">{result.origin.currency}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card p-6 border-teal-200 bg-teal-50/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">🎯</span>
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 uppercase tracking-wide">Destination</p>
                          <h3 className="font-semibold text-zinc-900">{result.destination.location}</h3>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Monthly surplus</span>
                          <span className="font-semibold text-teal-700">{formatCurrency(result.comparison.monthlySurplusDestination)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Monthly costs</span>
                          <span className="font-medium">{formatCurrency(result.comparison.totalMonthlyCostDestination)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Currency</span>
                          <span className="font-medium">{result.destination.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed Breakdown */}
                  <div className="card p-6">
                    <h3 className="font-semibold text-zinc-900 mb-4">Monthly Cost Breakdown (USD)</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Housing', origin: result.breakdown.origin.housing, dest: result.breakdown.destination.housing, icon: '🏠' },
                        { label: 'Utilities', origin: result.breakdown.origin.utilities, dest: result.breakdown.destination.utilities, icon: '💡' },
                        { label: 'Food', origin: result.breakdown.origin.food, dest: result.breakdown.destination.food, icon: '🍕' },
                        { label: 'Transportation', origin: result.breakdown.origin.transportation, dest: result.breakdown.destination.transportation, icon: '🚗' },
                        { label: 'Healthcare', origin: result.breakdown.origin.healthcare, dest: result.breakdown.destination.healthcare, icon: '🏥' },
                        { label: 'Childcare', origin: result.breakdown.origin.childcare, dest: result.breakdown.destination.childcare, icon: '👶' },
                        { label: 'Lifestyle', origin: result.breakdown.origin.lifestyle, dest: result.breakdown.destination.lifestyle, icon: '🎭' },
                      ].filter(item => item.origin > 0 || item.dest > 0).map((item) => (
                        <div key={item.label} className="flex items-center gap-4">
                          <span className="text-lg w-8">{item.icon}</span>
                          <span className="flex-1 text-sm text-zinc-700">{item.label}</span>
                          <span className="w-24 text-right text-sm text-zinc-500">
                            {formatCurrency(item.origin * result.origin.exchangeRateToUSD)}
                          </span>
                          <div className="w-8 flex justify-center">
                            {item.dest < item.origin ? (
                              <span className="text-green-500">↓</span>
                            ) : item.dest > item.origin ? (
                              <span className="text-red-500">↑</span>
                            ) : (
                              <span className="text-zinc-300">=</span>
                            )}
                          </div>
                          <span className={`w-24 text-right text-sm font-medium ${
                            item.dest < item.origin ? 'text-green-600' : item.dest > item.origin ? 'text-red-600' : 'text-zinc-700'
                          }`}>
                            {formatCurrency(item.dest * result.destination.exchangeRateToUSD)}
                          </span>
                        </div>
                      ))}
                      
                      <div className="border-t border-zinc-200 pt-3 mt-3">
                        <div className="flex items-center gap-4">
                          <span className="text-lg w-8">💰</span>
                          <span className="flex-1 text-sm font-semibold text-zinc-900">Total Expenses</span>
                          <span className="w-24 text-right text-sm font-semibold">
                            {formatCurrency(result.comparison.totalMonthlyCostOrigin)}
                          </span>
                          <div className="w-8"></div>
                          <span className={`w-24 text-right text-sm font-semibold ${
                            result.comparison.totalMonthlyCostDestination < result.comparison.totalMonthlyCostOrigin 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {formatCurrency(result.comparison.totalMonthlyCostDestination)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="card p-6 bg-amber-50 border-amber-200">
                      <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <span>💡</span> Key Insights
                      </h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Salary Needed */}
                  <div className="card p-6">
                    <h3 className="font-semibold text-zinc-900 mb-2">Salary to maintain lifestyle</h3>
                    <p className="text-sm text-zinc-500 mb-4">
                      To keep the same monthly surplus in {result.destination.location}, you'd need:
                    </p>
                    <div className="text-3xl font-bold text-teal-600">
                      {result.destination.currencySymbol}{result.comparison.salaryNeededToMatchLifestyle.toLocaleString()}/year
                    </div>
                    <p className="text-sm text-zinc-500 mt-2">
                      in {result.destination.currency} (local currency)
                    </p>
                  </div>
                  
                  {/* Quality of Life */}
                  <div className="card p-6">
                    <h3 className="font-semibold text-zinc-900 mb-4">Quality of Life Comparison</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { 
                          label: 'Safety', 
                          origin: result.origin.quality.safetyIndex, 
                          dest: result.destination.quality.safetyIndex,
                          higherBetter: true 
                        },
                        { 
                          label: 'Healthcare', 
                          origin: result.origin.quality.healthcareIndex, 
                          dest: result.destination.quality.healthcareIndex,
                          higherBetter: true 
                        },
                        { 
                          label: 'Cost Index', 
                          origin: result.origin.quality.costOfLivingIndex, 
                          dest: result.destination.quality.costOfLivingIndex,
                          higherBetter: false 
                        },
                      ].map((metric) => (
                        <div key={metric.label}>
                          <p className="text-sm text-zinc-500 mb-2">{metric.label}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-zinc-400 rounded-full"
                                  style={{ width: `${metric.origin}%` }}
                                />
                              </div>
                              <p className="text-xs text-zinc-400 mt-1">{metric.origin}</p>
                            </div>
                            <div className="flex-1">
                              <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-teal-500 rounded-full"
                                  style={{ width: `${metric.dest}%` }}
                                />
                              </div>
                              <p className="text-xs text-teal-600 mt-1">{metric.dest}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-zinc-100">
                      <p className="text-sm text-zinc-500 mb-1">Climate</p>
                      <p className="text-sm">
                        <span className="font-medium text-zinc-700">{result.origin.location}:</span>{' '}
                        <span className="text-zinc-600">{result.origin.quality.climateDescription}</span>
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-medium text-teal-700">{result.destination.location}:</span>{' '}
                        <span className="text-zinc-600">{result.destination.quality.climateDescription}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
