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

// Generate static params for top cities (rest will be ISR)
export async function generateStaticParams() {
  // Pre-generate top 1000 cities for fast loading
  return cities.slice(0, 1000).map((city) => ({
    slug: city.id,
  }));
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
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `https://realocation.app/city/${city.id}`,
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = cityMap.get(slug);
  
  if (!city) {
    notFound();
  }
  
  // Find similar cities (same state, similar population)
  const similarCities = cities
    .filter(c => c.id !== city.id && c.stateCode === city.stateCode)
    .slice(0, 5);
  
  // Find cheaper alternatives
  const cheaperCities = cities
    .filter(c => c.id !== city.id && c.costIndex < city.costIndex * 0.85)
    .slice(0, 5);
  
  // State tax info
  const stateTaxPercent = (city.stateTaxRate * 100).toFixed(1);
  const hasNoStateTax = city.stateTaxRate === 0;
  
  // Sample salary calculations
  const sampleSalaries = [75000, 100000, 150000, 200000];
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href={`/state/${city.stateCode.toLowerCase()}`} className="hover:text-white">{city.state}</Link>
              <span>/</span>
              <span>{city.name}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Cost of Living in {city.name}, {city.stateCode}
            </h1>
            
            <p className="text-blue-100 text-lg max-w-2xl">
              Calculate how far your salary goes in {city.name}. Compare taxes, rent, and cost of living 
              against other cities to make smarter relocation decisions.
            </p>
          </div>
        </section>
        
        {/* Quick Stats */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Population</p>
                <p className="text-2xl font-bold text-gray-900">{city.population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">State Tax</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hasNoStateTax ? (
                    <span className="text-green-600">None! 🎉</span>
                  ) : (
                    `${stateTaxPercent}%`
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Median Rent (1BR)</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(city.medianRent1BR)}/mo</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Cost Index</p>
                <p className="text-2xl font-bold text-gray-900">{city.costIndex}</p>
                <p className="text-xs text-gray-500">(100 = national avg)</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Calculator CTA */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                See how your salary compares
              </h2>
              <p className="text-gray-600 mb-4">
                Enter your salary to see how {city.name} stacks up against 50+ other cities.
              </p>
              <Link
                href={`/?city=${city.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white 
                         font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Calculate My Take-Home Pay
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Rent Breakdown */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Rent in {city.name}, {city.stateCode}
            </h2>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Unit Size</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Median Rent</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Annual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { label: '1 Bedroom', rent: city.medianRent1BR },
                    { label: '2 Bedroom', rent: city.medianRent2BR },
                    { label: '3 Bedroom', rent: city.medianRent3BR },
                    { label: '4 Bedroom', rent: city.medianRent4BR },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-gray-900">{row.label}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {formatCurrency(row.rent)}/mo
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {formatCurrency(row.rent * 12)}/yr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* Tax Info */}
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Taxes in {city.state}
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">State Income Tax</h3>
                {hasNoStateTax ? (
                  <div>
                    <p className="text-2xl font-bold text-green-600 mb-2">No State Income Tax!</p>
                    <p className="text-gray-600 text-sm">
                      {city.state} is one of the few states with no state income tax, 
                      meaning you keep more of your paycheck.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{stateTaxPercent}%</p>
                    <p className="text-gray-600 text-sm">
                      {city.state}&apos;s income tax rate. This is applied to your taxable income 
                      after federal deductions.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-5 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Federal Income Tax</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Federal taxes are the same nationwide and use progressive brackets (10% to 37% in 2024).
                </p>
                <Link href="/blog/state-income-tax-guide" className="text-blue-600 text-sm font-medium">
                  Learn more about tax brackets →
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Similar Cities */}
        {similarCities.length > 0 && (
          <section className="py-8">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Other Cities in {city.state}
              </h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarCities.map((c) => (
                  <Link
                    key={c.id}
                    href={`/city/${c.id}`}
                    className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 
                             hover:shadow-sm transition-all"
                  >
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <p className="text-sm text-gray-500">Pop. {c.population.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      1BR: {formatCurrency(c.medianRent1BR)}/mo
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Cheaper Alternatives */}
        {cheaperCities.length > 0 && (
          <section className="py-8 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                More Affordable Alternatives
              </h2>
              <p className="text-gray-600 mb-4">
                These cities have a lower cost of living than {city.name}:
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cheaperCities.map((c) => (
                  <Link
                    key={c.id}
                    href={`/city/${c.id}`}
                    className="p-4 bg-green-50 rounded-xl border border-green-200 hover:border-green-300 
                             hover:shadow-sm transition-all"
                  >
                    <h3 className="font-semibold text-gray-900">{c.name}, {c.stateCode}</h3>
                    <p className="text-sm text-green-700">
                      Cost Index: {c.costIndex} ({Math.round(((city.costIndex - c.costIndex) / city.costIndex) * 100)}% cheaper)
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      1BR: {formatCurrency(c.medianRent1BR)}/mo
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Final CTA */}
        <section className="py-12 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to see the full picture?
            </h2>
            <p className="text-blue-100 mb-6">
              Compare {city.name} against 50+ cities with our free calculator.
            </p>
            <Link
              href={`/?city=${city.id}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 
                       font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Calculate Now — Free
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
