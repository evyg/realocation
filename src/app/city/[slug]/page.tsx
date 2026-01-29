import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import citiesData from '@/data/cities-full.json';
import { formatCurrency } from '@/lib/calculations';

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

const cities = citiesData as City[];
const cityMap = new Map(cities.map(c => [c.id, c]));

export async function generateStaticParams() {
  return cities.slice(0, 1000).map((city) => ({ slug: city.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = cityMap.get(slug);
  if (!city) return {};
  
  const title = `Cost of Living in ${city.name}, ${city.stateCode} | Salary Calculator`;
  const description = `Calculate how far your salary goes in ${city.name}, ${city.state}. Compare taxes, rent (${formatCurrency(city.medianRent1BR)}/mo for 1BR), and cost of living vs other cities.`;
  
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `https://realocation.app/city/${city.id}` },
  };
}

// Cost index color and label
function getCostLevel(index: number): { color: string; bg: string; label: string; emoji: string } {
  if (index < 85) return { color: 'text-green-700', bg: 'bg-green-100', label: 'Very Affordable', emoji: '💚' };
  if (index < 100) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Below Average', emoji: '✅' };
  if (index < 115) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Average', emoji: '⚖️' };
  if (index < 140) return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Above Average', emoji: '📈' };
  return { color: 'text-red-600', bg: 'bg-red-50', label: 'Expensive', emoji: '💰' };
}

// Population tier
function getPopTier(pop: number): string {
  if (pop > 1000000) return 'Major Metro';
  if (pop > 500000) return 'Large City';
  if (pop > 100000) return 'Mid-Size City';
  if (pop > 50000) return 'Small City';
  if (pop > 10000) return 'Town';
  return 'Small Town';
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = cityMap.get(slug);
  
  if (!city) notFound();
  
  const similarCities = cities
    .filter(c => c.id !== city.id && c.stateCode === city.stateCode)
    .sort((a, b) => b.population - a.population)
    .slice(0, 6);
  
  const cheaperCities = cities
    .filter(c => c.id !== city.id && c.costIndex < city.costIndex * 0.8 && c.population > 20000)
    .sort((a, b) => a.costIndex - b.costIndex)
    .slice(0, 6);
  
  const stateTaxPercent = (city.stateTaxRate * 100).toFixed(1);
  const hasNoStateTax = city.stateTaxRate === 0;
  const costLevel = getCostLevel(city.costIndex);
  const popTier = getPopTier(city.population);
  
  // National comparison
  const nationalAvgRent = 1400;
  const rentDiff = city.medianRent1BR - nationalAvgRent;
  const rentDiffPercent = Math.round((rentDiff / nationalAvgRent) * 100);
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero with gradient */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-blue-200 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href={`/state/${city.stateCode.toLowerCase()}`} className="hover:text-white transition-colors">
                {city.state}
              </Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white">{city.name}</span>
            </nav>
            
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div>
                {/* City badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {popTier} • {city.population.toLocaleString()} people
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                  {city.name}, {city.stateCode}
                </h1>
                
                <p className="text-blue-100 text-lg max-w-xl">
                  Discover how far your salary goes in {city.name}. Compare taxes, rent, and living costs.
                </p>
              </div>
              
              {/* Cost Index Badge */}
              <div className="flex-shrink-0 bg-white/10 backdrop-blur rounded-2xl p-5 text-center min-w-[140px]">
                <div className="text-sm text-blue-200 mb-1">Cost Index</div>
                <div className="text-4xl font-bold mb-1">{city.costIndex}</div>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${costLevel.bg} ${costLevel.color}`}>
                  {costLevel.emoji} {costLevel.label}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Quick Stats Cards */}
        <section className="relative -mt-6 sm:-mt-8 z-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Population */}
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">Population</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{city.population.toLocaleString()}</p>
              </div>
              
              {/* State Tax */}
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${hasNoStateTax ? 'bg-green-100' : 'bg-amber-100'} rounded-lg flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${hasNoStateTax ? 'text-green-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">State Tax</span>
                </div>
                {hasNoStateTax ? (
                  <p className="text-xl sm:text-2xl font-bold text-green-600">None! 🎉</p>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stateTaxPercent}%</p>
                )}
              </div>
              
              {/* Median Rent */}
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">1BR Rent</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(city.medianRent1BR)}</p>
                <p className="text-xs text-gray-500">/month</p>
              </div>
              
              {/* vs National */}
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${rentDiff <= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${rentDiff <= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">vs National</span>
                </div>
                <p className={`text-xl sm:text-2xl font-bold ${rentDiff <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {rentDiff <= 0 ? '' : '+'}{rentDiffPercent}%
                </p>
                <p className="text-xs text-gray-500">{rentDiff <= 0 ? 'below' : 'above'} avg</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Card */}
        <section className="px-4 py-8 sm:py-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    How far would your salary go in {city.name}?
                  </h2>
                  <p className="text-blue-100">
                    Enter your income to get a personalized breakdown vs 50+ cities
                  </p>
                </div>
                <Link
                  href={`/?city=${city.id}`}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-4 bg-white text-blue-600 
                           font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg
                           touch-manipulation whitespace-nowrap"
                >
                  Calculate Now
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Rent Breakdown - Visual */}
        <section className="px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Rent Prices in {city.name}
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Studio', rent: Math.round(city.medianRent1BR * 0.8), icon: '🏠' },
                { label: '1 Bedroom', rent: city.medianRent1BR, icon: '🛏️', popular: true },
                { label: '2 Bedroom', rent: city.medianRent2BR, icon: '🏡' },
                { label: '3 Bedroom', rent: city.medianRent3BR, icon: '🏘️' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`relative bg-white rounded-xl p-5 border-2 transition-all ${
                    item.popular 
                      ? 'border-blue-500 shadow-lg shadow-blue-100' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {item.popular && (
                    <span className="absolute -top-3 left-4 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">
                      Most Common
                    </span>
                  )}
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(item.rent)}</p>
                  <p className="text-sm text-gray-500">/month</p>
                  <p className="text-xs text-gray-400 mt-2">{formatCurrency(item.rent * 12)}/year</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Tax Section */}
        <section className="px-4 py-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </span>
              Taxes in {city.state}
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {/* State Tax */}
              <div className={`rounded-2xl p-6 ${hasNoStateTax ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200' : 'bg-gray-50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">State Income Tax</h3>
                    <p className="text-sm text-gray-500">{city.state}</p>
                  </div>
                  <div className={`text-3xl font-bold ${hasNoStateTax ? 'text-green-600' : 'text-gray-900'}`}>
                    {hasNoStateTax ? '0%' : `${stateTaxPercent}%`}
                  </div>
                </div>
                
                {hasNoStateTax ? (
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="font-medium text-green-700">No State Income Tax!</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {city.state} doesn&apos;t tax wages—keep more of every paycheck.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(city.stateTaxRate * 100 * 8, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      For a $100k salary, that&apos;s ~{formatCurrency(100000 * city.stateTaxRate)}/year in state taxes.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Federal */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Federal Income Tax</h3>
                    <p className="text-sm text-gray-500">Same nationwide</p>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">10-37%</div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Federal taxes use progressive brackets. The more you earn, the higher your marginal rate.
                </p>
                
                <Link 
                  href="/blog/state-income-tax-guide"
                  className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline"
                >
                  Learn how tax brackets work
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Similar Cities */}
        {similarCities.length > 0 && (
          <section className="px-4 py-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </span>
                Other Cities in {city.state}
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {similarCities.map((c) => (
                  <Link
                    key={c.id}
                    href={`/city/${c.id}`}
                    className="group bg-white rounded-xl p-4 sm:p-5 border border-gray-200 
                             hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">Pop. {c.population.toLocaleString()}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(c.medianRent1BR)}/mo</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCostLevel(c.costIndex).bg} ${getCostLevel(c.costIndex).color}`}>
                        {c.costIndex}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Link 
                  href={`/state/${city.stateCode.toLowerCase()}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View all cities in {city.state} →
                </Link>
              </div>
            </div>
          </section>
        )}
        
        {/* Cheaper Alternatives */}
        {cheaperCities.length > 0 && (
          <section className="px-4 py-8 bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <span className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                More Affordable Alternatives
              </h2>
              <p className="text-gray-600 mb-6">
                Cities with lower cost of living where your money goes further:
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {cheaperCities.map((c) => {
                  const savings = Math.round(((city.costIndex - c.costIndex) / city.costIndex) * 100);
                  return (
                    <Link
                      key={c.id}
                      href={`/city/${c.id}`}
                      className="group bg-white rounded-xl p-4 sm:p-5 border-2 border-green-200 
                               hover:border-green-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                          {c.name}, {c.stateCode}
                        </h3>
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          -{savings}%
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mb-2">Cost Index: {c.costIndex}</p>
                      <p className="text-sm text-gray-600">
                        1BR: {formatCurrency(c.medianRent1BR)}/mo
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        
        {/* Final CTA */}
        <section className="px-4 py-12 sm:py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              See the complete picture for {city.name}
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Our free calculator shows your exact take-home pay, tax breakdown, and how {city.name} compares to 50+ other cities.
            </p>
            <Link
              href={`/?city=${city.id}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 
                       font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl
                       touch-manipulation text-lg"
            >
              Calculate My Salary
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="mt-4 text-blue-200 text-sm">Free • No signup • 10 seconds</p>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
