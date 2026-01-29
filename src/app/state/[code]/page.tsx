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

const STATE_INFO: Record<string, { name: string; description: string }> = {
  'AL': { name: 'Alabama', description: 'Known for its southern charm and low cost of living' },
  'AK': { name: 'Alaska', description: 'No state income tax, unique wilderness lifestyle' },
  'AZ': { name: 'Arizona', description: 'Growing tech hub with warm weather year-round' },
  'AR': { name: 'Arkansas', description: 'Very affordable with natural beauty' },
  'CA': { name: 'California', description: 'Tech capital with high salaries but high costs' },
  'CO': { name: 'Colorado', description: 'Outdoor paradise with a booming economy' },
  'CT': { name: 'Connecticut', description: 'High incomes near NYC with suburban living' },
  'DE': { name: 'Delaware', description: 'No sales tax and business-friendly' },
  'DC': { name: 'District of Columbia', description: 'Political hub with high salaries' },
  'FL': { name: 'Florida', description: 'No state income tax, beach lifestyle, growing remote work hub' },
  'GA': { name: 'Georgia', description: 'Atlanta metro offers big-city amenities at lower costs' },
  'HI': { name: 'Hawaii', description: 'Island paradise with highest cost of living' },
  'ID': { name: 'Idaho', description: 'Fast-growing state with outdoor recreation' },
  'IL': { name: 'Illinois', description: 'Chicago offers world-class city living' },
  'IN': { name: 'Indiana', description: 'Very affordable with strong job market' },
  'IA': { name: 'Iowa', description: 'Low cost of living with high quality of life' },
  'KS': { name: 'Kansas', description: 'Affordable Midwest living' },
  'KY': { name: 'Kentucky', description: 'Low taxes and affordable housing' },
  'LA': { name: 'Louisiana', description: 'Rich culture and affordable living' },
  'ME': { name: 'Maine', description: 'Natural beauty with growing remote work scene' },
  'MD': { name: 'Maryland', description: 'DC suburbs with diverse economy' },
  'MA': { name: 'Massachusetts', description: 'Education and biotech hub' },
  'MI': { name: 'Michigan', description: 'Affordable Great Lakes living' },
  'MN': { name: 'Minnesota', description: 'Strong economy with high quality of life' },
  'MS': { name: 'Mississippi', description: 'Lowest cost of living in the US' },
  'MO': { name: 'Missouri', description: 'Affordable with two major metros' },
  'MT': { name: 'Montana', description: 'Big Sky country with no sales tax' },
  'NE': { name: 'Nebraska', description: 'Low unemployment and affordable living' },
  'NV': { name: 'Nevada', description: 'No state income tax with Las Vegas energy' },
  'NH': { name: 'New Hampshire', description: 'No income or sales tax' },
  'NJ': { name: 'New Jersey', description: 'NYC access with suburban living' },
  'NM': { name: 'New Mexico', description: 'Affordable with unique culture' },
  'NY': { name: 'New York', description: 'Global city with highest salaries' },
  'NC': { name: 'North Carolina', description: 'Research Triangle tech hub' },
  'ND': { name: 'North Dakota', description: 'Low cost with energy jobs' },
  'OH': { name: 'Ohio', description: 'Affordable cities with strong job markets' },
  'OK': { name: 'Oklahoma', description: 'Very low cost of living' },
  'OR': { name: 'Oregon', description: 'No sales tax, Portland culture' },
  'PA': { name: 'Pennsylvania', description: 'Historic cities with diverse economy' },
  'RI': { name: 'Rhode Island', description: 'Small state with coastal living' },
  'SC': { name: 'South Carolina', description: 'Affordable with beach access' },
  'SD': { name: 'South Dakota', description: 'No state income tax' },
  'TN': { name: 'Tennessee', description: 'No state income tax, Nashville boom' },
  'TX': { name: 'Texas', description: 'No state income tax, booming job market' },
  'UT': { name: 'Utah', description: 'Growing tech hub with outdoor access' },
  'VT': { name: 'Vermont', description: 'Rural charm with remote work programs' },
  'VA': { name: 'Virginia', description: 'Northern VA tech corridor' },
  'WA': { name: 'Washington', description: 'No state income tax, Seattle tech' },
  'WV': { name: 'West Virginia', description: 'Very affordable with remote work incentives' },
  'WI': { name: 'Wisconsin', description: 'Midwest charm with affordable cities' },
  'WY': { name: 'Wyoming', description: 'No state income tax, natural beauty' },
};

export async function generateStaticParams() {
  return Object.keys(stateData).map((code) => ({
    code: code.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const stateCode = code.toUpperCase();
  const info = STATE_INFO[stateCode];
  const cities = stateData[stateCode];
  
  if (!info || !cities) return {};
  
  const title = `Cost of Living in ${info.name} | ${cities.length} Cities Compared`;
  const description = `Compare cost of living across ${cities.length} cities in ${info.name}. See rent prices, tax rates, and find where your salary goes furthest.`;
  
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `https://realocation.app/state/${code}`,
    },
  };
}

export default async function StatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const stateCode = code.toUpperCase();
  const info = STATE_INFO[stateCode];
  const cities = stateData[stateCode];
  
  if (!info || !cities) {
    notFound();
  }
  
  // Sort by population
  const sortedCities = [...cities].sort((a, b) => b.population - a.population);
  const topCities = sortedCities.slice(0, 20);
  const stateTaxRate = cities[0]?.stateTaxRate || 0;
  const hasNoStateTax = stateTaxRate === 0;
  
  // Calculate state averages
  const avgRent = Math.round(cities.reduce((sum, c) => sum + c.medianRent1BR, 0) / cities.length);
  const avgCostIndex = Math.round(cities.reduce((sum, c) => sum + c.costIndex, 0) / cities.length);
  
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
              <span>States</span>
              <span>/</span>
              <span>{info.name}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Cost of Living in {info.name}
            </h1>
            
            <p className="text-blue-100 text-lg max-w-2xl">
              {info.description}. Compare rent, taxes, and cost of living across {cities.length.toLocaleString()} cities and towns.
            </p>
          </div>
        </section>
        
        {/* Quick Stats */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cities/Towns</p>
                <p className="text-2xl font-bold text-gray-900">{cities.length.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">State Tax</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hasNoStateTax ? (
                    <span className="text-green-600">0%</span>
                  ) : (
                    `${(stateTaxRate * 100).toFixed(1)}%`
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Rent (1BR)</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgRent)}/mo</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg. Cost Index</p>
                <p className="text-2xl font-bold text-gray-900">{avgCostIndex}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tax Highlight */}
        {hasNoStateTax && (
          <section className="py-6">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <h3 className="text-lg font-bold text-green-800 mb-1">
                      No State Income Tax!
                    </h3>
                    <p className="text-green-700">
                      {info.name} is one of the few states with no state income tax on wages. 
                      This can mean thousands of dollars more in your pocket each year.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Top Cities */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Largest Cities in {info.name}
            </h2>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">City</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 hidden sm:table-cell">Population</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">1BR Rent</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 hidden sm:table-cell">Cost Index</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topCities.map((city) => (
                    <tr key={city.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/city/${city.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                          {city.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 hidden sm:table-cell">
                        {city.population.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {formatCurrency(city.medianRent1BR)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 hidden sm:table-cell">
                        {city.costIndex}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link 
                          href={`/?city=${city.id}`}
                          className="text-blue-600 text-sm font-medium hover:underline"
                        >
                          Calculate
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {cities.length > 20 && (
              <p className="mt-4 text-sm text-gray-500 text-center">
                Showing top 20 of {cities.length.toLocaleString()} cities. Use our calculator to compare any city.
              </p>
            )}
          </div>
        </section>
        
        {/* All Cities List */}
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              All Cities in {info.name}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {sortedCities.slice(0, 100).map((city) => (
                <Link
                  key={city.id}
                  href={`/city/${city.id}`}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            
            {cities.length > 100 && (
              <p className="mt-4 text-sm text-gray-500">
                + {(cities.length - 100).toLocaleString()} more cities
              </p>
            )}
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-12 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Compare your salary across {info.name}
            </h2>
            <p className="text-blue-100 mb-6">
              See how far your money goes in any of these {cities.length.toLocaleString()} cities.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 
                       font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Try Free Calculator
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
