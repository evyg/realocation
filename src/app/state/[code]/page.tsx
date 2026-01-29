import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import citiesByState from '@/data/cities-by-state.json';
import { formatCurrency } from '@/lib/calculations';

interface City {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  population: number;
  stateTaxRate: number;
  medianRent1BR: number;
  costIndex: number;
}

const stateData = citiesByState as Record<string, City[]>;

const STATE_INFO: Record<string, { name: string; description: string; emoji: string }> = {
  'AL': { name: 'Alabama', description: 'Southern charm with very affordable living', emoji: '🏈' },
  'AK': { name: 'Alaska', description: 'No state income tax, vast wilderness', emoji: '🏔️' },
  'AZ': { name: 'Arizona', description: 'Growing tech hub with year-round sun', emoji: '🌵' },
  'AR': { name: 'Arkansas', description: 'Natural beauty and low costs', emoji: '💎' },
  'CA': { name: 'California', description: 'Tech capital with high salaries but high costs', emoji: '🌴' },
  'CO': { name: 'Colorado', description: 'Outdoor paradise with booming economy', emoji: '⛷️' },
  'CT': { name: 'Connecticut', description: 'NYC access with suburban living', emoji: '🏛️' },
  'DE': { name: 'Delaware', description: 'No sales tax, business-friendly', emoji: '🦀' },
  'DC': { name: 'District of Columbia', description: 'Political hub with high salaries', emoji: '🏛️' },
  'FL': { name: 'Florida', description: 'No state income tax, beach lifestyle', emoji: '🏖️' },
  'GA': { name: 'Georgia', description: 'Atlanta offers big-city life at lower costs', emoji: '🍑' },
  'HI': { name: 'Hawaii', description: 'Island paradise with highest costs', emoji: '🌺' },
  'ID': { name: 'Idaho', description: 'Fast-growing with outdoor recreation', emoji: '🥔' },
  'IL': { name: 'Illinois', description: 'Chicago offers world-class city living', emoji: '🌆' },
  'IN': { name: 'Indiana', description: 'Very affordable with strong job market', emoji: '🏎️' },
  'IA': { name: 'Iowa', description: 'Low cost of living, high quality of life', emoji: '🌽' },
  'KS': { name: 'Kansas', description: 'Affordable Midwest living', emoji: '🌾' },
  'KY': { name: 'Kentucky', description: 'Low taxes and affordable housing', emoji: '🐴' },
  'LA': { name: 'Louisiana', description: 'Rich culture and affordable living', emoji: '⚜️' },
  'ME': { name: 'Maine', description: 'Natural beauty, growing remote scene', emoji: '🦞' },
  'MD': { name: 'Maryland', description: 'DC suburbs with diverse economy', emoji: '🦀' },
  'MA': { name: 'Massachusetts', description: 'Education and biotech hub', emoji: '🎓' },
  'MI': { name: 'Michigan', description: 'Affordable Great Lakes living', emoji: '🚗' },
  'MN': { name: 'Minnesota', description: 'Strong economy, high quality of life', emoji: '🏒' },
  'MS': { name: 'Mississippi', description: 'Lowest cost of living in the US', emoji: '🎸' },
  'MO': { name: 'Missouri', description: 'Two major metros, very affordable', emoji: '🏛️' },
  'MT': { name: 'Montana', description: 'Big Sky country, no sales tax', emoji: '🦌' },
  'NE': { name: 'Nebraska', description: 'Low unemployment, affordable living', emoji: '🌽' },
  'NV': { name: 'Nevada', description: 'No state income tax, Las Vegas energy', emoji: '🎰' },
  'NH': { name: 'New Hampshire', description: 'No income or sales tax', emoji: '🏔️' },
  'NJ': { name: 'New Jersey', description: 'NYC access with suburban living', emoji: '🏖️' },
  'NM': { name: 'New Mexico', description: 'Affordable with unique culture', emoji: '🌶️' },
  'NY': { name: 'New York', description: 'Global city with highest salaries', emoji: '🗽' },
  'NC': { name: 'North Carolina', description: 'Research Triangle tech hub', emoji: '🏀' },
  'ND': { name: 'North Dakota', description: 'Low cost with energy jobs', emoji: '🛢️' },
  'OH': { name: 'Ohio', description: 'Affordable cities, strong job markets', emoji: '🏈' },
  'OK': { name: 'Oklahoma', description: 'Very low cost of living', emoji: '🤠' },
  'OR': { name: 'Oregon', description: 'No sales tax, Portland culture', emoji: '🌲' },
  'PA': { name: 'Pennsylvania', description: 'Historic cities, diverse economy', emoji: '🔔' },
  'RI': { name: 'Rhode Island', description: 'Small state with coastal living', emoji: '⛵' },
  'SC': { name: 'South Carolina', description: 'Affordable with beach access', emoji: '🌴' },
  'SD': { name: 'South Dakota', description: 'No state income tax', emoji: '🦬' },
  'TN': { name: 'Tennessee', description: 'No state income tax, Nashville boom', emoji: '🎸' },
  'TX': { name: 'Texas', description: 'No state income tax, booming jobs', emoji: '🤠' },
  'UT': { name: 'Utah', description: 'Growing tech hub, outdoor access', emoji: '⛷️' },
  'VT': { name: 'Vermont', description: 'Rural charm with remote work programs', emoji: '🍁' },
  'VA': { name: 'Virginia', description: 'Northern VA tech corridor', emoji: '🏛️' },
  'WA': { name: 'Washington', description: 'No state income tax, Seattle tech', emoji: '☕' },
  'WV': { name: 'West Virginia', description: 'Very affordable, remote work incentives', emoji: '⛰️' },
  'WI': { name: 'Wisconsin', description: 'Midwest charm, affordable cities', emoji: '🧀' },
  'WY': { name: 'Wyoming', description: 'No state income tax, natural beauty', emoji: '🦬' },
};

export async function generateStaticParams() {
  return Object.keys(stateData).map((code) => ({ code: code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const stateCode = code.toUpperCase();
  const info = STATE_INFO[stateCode];
  const cities = stateData[stateCode];
  
  if (!info || !cities) return {};
  
  const title = `Cost of Living in ${info.name} | ${cities.length.toLocaleString()} Cities`;
  const description = `Compare cost of living across ${cities.length.toLocaleString()} cities in ${info.name}. See rent prices, tax rates, and find where your salary goes furthest.`;
  
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `https://realocation.app/state/${code}` },
  };
}

function getCostLevel(index: number): { color: string; bg: string } {
  if (index < 85) return { color: 'text-green-700', bg: 'bg-green-100' };
  if (index < 100) return { color: 'text-green-600', bg: 'bg-green-50' };
  if (index < 115) return { color: 'text-yellow-600', bg: 'bg-yellow-50' };
  if (index < 140) return { color: 'text-orange-600', bg: 'bg-orange-50' };
  return { color: 'text-red-600', bg: 'bg-red-50' };
}

export default async function StatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const stateCode = code.toUpperCase();
  const info = STATE_INFO[stateCode];
  const cities = stateData[stateCode];
  
  if (!info || !cities) notFound();
  
  const sortedCities = [...cities].sort((a, b) => b.population - a.population);
  const topCities = sortedCities.slice(0, 12);
  const stateTaxRate = cities[0]?.stateTaxRate || 0;
  const hasNoStateTax = stateTaxRate === 0;
  
  const avgRent = Math.round(cities.reduce((sum, c) => sum + c.medianRent1BR, 0) / cities.length);
  const avgCostIndex = Math.round(cities.reduce((sum, c) => sum + c.costIndex, 0) / cities.length);
  const totalPop = cities.reduce((sum, c) => sum + c.population, 0);
  
  // Find cheapest and most expensive
  const sortedByCost = [...cities].sort((a, b) => a.costIndex - b.costIndex);
  const cheapestCities = sortedByCost.filter(c => c.population > 10000).slice(0, 3);
  const expensiveCities = sortedByCost.filter(c => c.population > 10000).slice(-3).reverse();
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-16">
            <nav className="flex items-center gap-2 text-blue-200 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white">{info.name}</span>
            </nav>
            
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div>
                <div className="text-5xl mb-4">{info.emoji}</div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                  Cost of Living in {info.name}
                </h1>
                <p className="text-blue-100 text-lg max-w-xl">
                  {info.description}. Explore {cities.length.toLocaleString()} cities and towns.
                </p>
              </div>
              
              {/* Tax Badge */}
              {hasNoStateTax && (
                <div className="flex-shrink-0 bg-green-500/20 backdrop-blur border border-green-400/30 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <div className="text-lg font-bold text-green-300">No State Tax!</div>
                  <div className="text-sm text-green-200">Keep more of your paycheck</div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Stats Cards */}
        <section className="relative -mt-6 sm:-mt-8 z-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">Cities</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{cities.length.toLocaleString()}</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${hasNoStateTax ? 'bg-green-100' : 'bg-amber-100'} rounded-lg flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${hasNoStateTax ? 'text-green-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">State Tax</span>
                </div>
                <p className={`text-xl sm:text-2xl font-bold ${hasNoStateTax ? 'text-green-600' : 'text-gray-900'}`}>
                  {hasNoStateTax ? '0%' : `${(stateTaxRate * 100).toFixed(1)}%`}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">Avg Rent</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(avgRent)}</p>
                <p className="text-xs text-gray-500">/month (1BR)</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">Cost Index</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{avgCostIndex}</p>
                <p className="text-xs text-gray-500">(100 = US avg)</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="px-4 py-8 sm:py-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    Compare your salary across {info.name}
                  </h2>
                  <p className="text-blue-100">
                    See exactly how far your paycheck goes in any city
                  </p>
                </div>
                <Link
                  href="/"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-4 bg-white text-blue-600 
                           font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg touch-manipulation"
                >
                  Try Calculator
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Price Range */}
        {cheapestCities.length > 0 && (
          <section className="px-4 py-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Cost Range in {info.name}</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Most Affordable */}
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">💚</span> Most Affordable
                  </h3>
                  <div className="space-y-3">
                    {cheapestCities.map((c, i) => (
                      <Link
                        key={c.id}
                        href={`/city/${c.id}`}
                        className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
                            {i + 1}
                          </span>
                          <span className="font-medium text-gray-900">{c.name}</span>
                        </div>
                        <span className="text-sm text-green-700">{formatCurrency(c.medianRent1BR)}/mo</span>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Most Expensive */}
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">💰</span> Highest Cost
                  </h3>
                  <div className="space-y-3">
                    {expensiveCities.map((c, i) => (
                      <Link
                        key={c.id}
                        href={`/city/${c.id}`}
                        className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-bold text-amber-700">
                            {i + 1}
                          </span>
                          <span className="font-medium text-gray-900">{c.name}</span>
                        </div>
                        <span className="text-sm text-amber-700">{formatCurrency(c.medianRent1BR)}/mo</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Top Cities */}
        <section className="px-4 py-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Largest Cities in {info.name}
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCities.map((city, i) => (
                <Link
                  key={city.id}
                  href={`/city/${city.id}`}
                  className="group bg-gray-50 rounded-xl p-5 border border-gray-200 
                           hover:border-blue-300 hover:shadow-md hover:bg-white transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">#{i + 1}</span>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {city.name}
                      </h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCostLevel(city.costIndex).bg} ${getCostLevel(city.costIndex).color}`}>
                      {city.costIndex}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Pop. {city.population.toLocaleString()}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(city.medianRent1BR)}/mo
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* All Cities */}
        <section className="px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              All {cities.length.toLocaleString()} Places in {info.name}
            </h2>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {sortedCities.slice(0, 50).map((city) => (
                  <Link
                    key={city.id}
                    href={`/city/${city.id}`}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 
                             rounded-lg transition-colors truncate"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
              
              {cities.length > 50 && (
                <p className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 text-center">
                  + {(cities.length - 50).toLocaleString()} more cities and towns
                </p>
              )}
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="px-4 py-12 sm:py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-4">{info.emoji}</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Find your ideal city in {info.name}
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Enter your salary to see a personalized comparison of {cities.length.toLocaleString()} cities and towns.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 
                       font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl text-lg"
            >
              Calculate My Salary
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
