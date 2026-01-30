import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import citiesData from '@/data/cities-full.json';

interface City {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  population: number;
  costIndex: number;
  medianRent1BR: number;
  medianRent2BR: number;
  medianRent3BR: number;
  medianRent4BR: number;
  stateTaxRate: number;
  localTaxRate: number;
}

const cities = citiesData as City[];
const cityMap = new Map(cities.map(c => [c.id, c]));

function parseSlug(slug: string): { city1Id: string; city2Id: string } | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return null;
  return { city1Id: parts[0], city2Id: parts[1] };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function getCostLevel(index: number): { color: string; bg: string; label: string } {
  if (index < 85) return { color: 'text-green-700', bg: 'bg-green-100', label: 'Very Affordable' };
  if (index < 100) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Below Average' };
  if (index < 115) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Average' };
  if (index < 130) return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Above Average' };
  return { color: 'text-red-600', bg: 'bg-red-50', label: 'Expensive' };
}

// Generate static params for popular city comparisons
export async function generateStaticParams() {
  const popularCities = [
    'new-york-ny', 'los-angeles-ca', 'chicago-il', 'houston-tx', 'phoenix-az',
    'san-antonio-tx', 'san-diego-ca', 'dallas-tx', 'austin-tx', 'denver-co',
    'seattle-wa', 'boston-ma', 'nashville-tn', 'portland-or', 'miami-fl',
    'atlanta-ga', 'san-francisco-ca', 'charlotte-nc', 'raleigh-nc', 'tampa-fl'
  ];
  
  const params: { slug: string }[] = [];
  
  // Generate combinations of popular cities
  for (let i = 0; i < popularCities.length; i++) {
    for (let j = i + 1; j < popularCities.length; j++) {
      params.push({ slug: `${popularCities[i]}-vs-${popularCities[j]}` });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  
  const city1 = cityMap.get(parsed.city1Id);
  const city2 = cityMap.get(parsed.city2Id);
  if (!city1 || !city2) return {};
  
  const title = `${city1.name}, ${city1.stateCode} vs ${city2.name}, ${city2.stateCode} | Cost of Living Comparison`;
  const description = `Compare cost of living between ${city1.name} and ${city2.name}. See differences in rent, taxes, and expenses. ${city1.costIndex < city2.costIndex ? city1.name : city2.name} is ${Math.abs(city1.costIndex - city2.costIndex).toFixed(0)}% ${city1.costIndex < city2.costIndex ? 'cheaper' : 'more expensive'}.`;
  
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `https://realocation.app/compare/${slug}` },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  
  const city1 = cityMap.get(parsed.city1Id);
  const city2 = cityMap.get(parsed.city2Id);
  if (!city1 || !city2) notFound();
  
  const costDiff = city1.costIndex - city2.costIndex;
  const rentDiff1BR = city1.medianRent1BR - city2.medianRent1BR;
  const taxDiff = (city1.stateTaxRate - city2.stateTaxRate) * 100;
  
  const cheaper = costDiff < 0 ? city1 : city2;
  const moreExpensive = costDiff < 0 ? city2 : city1;
  
  const cost1 = getCostLevel(city1.costIndex);
  const cost2 = getCostLevel(city2.costIndex);
  
  // Calculate salary equivalent
  const sampleSalary = 100000;
  const equivalentSalary = Math.round(sampleSalary * (city2.costIndex / city1.costIndex));
  
  // JSON-LD for comparison
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${city1.name} vs ${city2.name} Cost of Living Comparison`,
    description: `Detailed cost of living comparison between ${city1.name}, ${city1.state} and ${city2.name}, ${city2.state}`,
    author: { '@type': 'Organization', name: 'Realocation' },
    publisher: { '@type': 'Organization', name: 'Realocation' },
  };
  
  // FAQ Schema
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${city1.name} or ${city2.name} cheaper to live in?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${cheaper.name} is ${Math.abs(costDiff).toFixed(0)}% cheaper to live in than ${moreExpensive.name}. The cost of living index in ${cheaper.name} is ${cheaper.costIndex}, compared to ${moreExpensive.costIndex} in ${moreExpensive.name}.`
        }
      },
      {
        '@type': 'Question',
        name: `What is the rent difference between ${city1.name} and ${city2.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A 1-bedroom apartment in ${city1.name} costs ${formatCurrency(city1.medianRent1BR)}/month on average, while in ${city2.name} it costs ${formatCurrency(city2.medianRent1BR)}/month. That's a difference of ${formatCurrency(Math.abs(rentDiff1BR))}/month.`
        }
      },
      {
        '@type': 'Question',
        name: `What salary do I need in ${city2.name} to match ${formatCurrency(sampleSalary)} in ${city1.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `To maintain the same standard of living, you would need to earn ${formatCurrency(equivalentSalary)} in ${city2.name} to match a ${formatCurrency(sampleSalary)} salary in ${city1.name}.`
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="text-blue-200 text-sm mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">→</span>
              <span className="text-white">Compare Cities</span>
            </nav>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {city1.name} vs {city2.name}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Cost of Living Comparison
            </p>
            
            {/* Quick verdict */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 inline-block">
              <p className="text-lg">
                <span className="font-bold text-yellow-300">{cheaper.name}</span> is{' '}
                <span className="font-bold text-green-300">{Math.abs(costDiff).toFixed(0)}% cheaper</span>{' '}
                than {moreExpensive.name}
              </p>
            </div>
          </div>
        </section>
        
        {/* Comparison Cards */}
        <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            {/* City 1 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{city1.name}, {city1.stateCode}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${cost1.bg} ${cost1.color}`}>
                  {cost1.label}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Cost Index</span>
                  <span className="font-bold text-xl">{city1.costIndex}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">1BR Rent</span>
                  <span className="font-bold">{formatCurrency(city1.medianRent1BR)}/mo</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">2BR Rent</span>
                  <span className="font-bold">{formatCurrency(city1.medianRent2BR)}/mo</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">State Tax Rate</span>
                  <span className="font-bold">{city1.stateTaxRate === 0 ? 'None! 🎉' : `${(city1.stateTaxRate * 100).toFixed(1)}%`}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Population</span>
                  <span className="font-bold">{formatNumber(city1.population)}</span>
                </div>
              </div>
              
              <Link 
                href={`/city/${city1.id}`}
                className="block mt-6 text-center py-3 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition"
              >
                View Full Details →
              </Link>
            </div>
            
            {/* City 2 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-indigo-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{city2.name}, {city2.stateCode}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${cost2.bg} ${cost2.color}`}>
                  {cost2.label}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Cost Index</span>
                  <span className="font-bold text-xl">{city2.costIndex}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">1BR Rent</span>
                  <span className="font-bold">{formatCurrency(city2.medianRent1BR)}/mo</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">2BR Rent</span>
                  <span className="font-bold">{formatCurrency(city2.medianRent2BR)}/mo</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">State Tax Rate</span>
                  <span className="font-bold">{city2.stateTaxRate === 0 ? 'None! 🎉' : `${(city2.stateTaxRate * 100).toFixed(1)}%`}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Population</span>
                  <span className="font-bold">{formatNumber(city2.population)}</span>
                </div>
              </div>
              
              <Link 
                href={`/city/${city2.id}`}
                className="block mt-6 text-center py-3 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition"
              >
                View Full Details →
              </Link>
            </div>
          </div>
        </section>
        
        {/* Detailed Comparison */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Detailed Comparison</h2>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Category</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-600">{city1.name}</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-600">{city2.name}</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-600">Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-4 px-6 font-medium">Cost of Living Index</td>
                  <td className="text-center py-4 px-6">{city1.costIndex}</td>
                  <td className="text-center py-4 px-6">{city2.costIndex}</td>
                  <td className={`text-center py-4 px-6 font-bold ${costDiff < 0 ? 'text-green-600' : costDiff > 0 ? 'text-red-600' : ''}`}>
                    {costDiff > 0 ? '+' : ''}{costDiff.toFixed(0)}%
                  </td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="py-4 px-6 font-medium">1BR Rent (Monthly)</td>
                  <td className="text-center py-4 px-6">{formatCurrency(city1.medianRent1BR)}</td>
                  <td className="text-center py-4 px-6">{formatCurrency(city2.medianRent1BR)}</td>
                  <td className={`text-center py-4 px-6 font-bold ${rentDiff1BR < 0 ? 'text-green-600' : rentDiff1BR > 0 ? 'text-red-600' : ''}`}>
                    {rentDiff1BR > 0 ? '+' : ''}{formatCurrency(rentDiff1BR)}
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="py-4 px-6 font-medium">State Income Tax</td>
                  <td className="text-center py-4 px-6">{city1.stateTaxRate === 0 ? 'None' : `${(city1.stateTaxRate * 100).toFixed(1)}%`}</td>
                  <td className="text-center py-4 px-6">{city2.stateTaxRate === 0 ? 'None' : `${(city2.stateTaxRate * 100).toFixed(1)}%`}</td>
                  <td className={`text-center py-4 px-6 font-bold ${taxDiff < 0 ? 'text-green-600' : taxDiff > 0 ? 'text-red-600' : ''}`}>
                    {taxDiff > 0 ? '+' : ''}{taxDiff.toFixed(1)}%
                  </td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="py-4 px-6 font-medium">Population</td>
                  <td className="text-center py-4 px-6">{formatNumber(city1.population)}</td>
                  <td className="text-center py-4 px-6">{formatNumber(city2.population)}</td>
                  <td className="text-center py-4 px-6 text-gray-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Salary Equivalent */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">💰 Salary Equivalent Calculator</h2>
            <p className="text-blue-100 mb-6">
              How much would you need to earn to maintain the same lifestyle?
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <p className="text-blue-200 text-sm mb-2">{formatCurrency(sampleSalary)} in</p>
                <p className="text-2xl font-bold">{city1.name}</p>
              </div>
              
              <div className="text-center text-4xl">=</div>
              
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <p className="text-blue-200 text-sm mb-2">Equivalent to</p>
                <p className="text-2xl font-bold">{formatCurrency(equivalentSalary)} in {city2.name}</p>
              </div>
            </div>
            
            <p className="text-blue-200 text-sm mt-6 text-center">
              Based on cost of living index comparison. Use our <Link href="/calculator" className="underline hover:text-white">full calculator</Link> for personalized results.
            </p>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <details className="bg-white rounded-xl shadow-md p-6 group">
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                Is {city1.name} or {city2.name} cheaper to live in?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                {cheaper.name} is {Math.abs(costDiff).toFixed(0)}% cheaper to live in than {moreExpensive.name}. 
                The cost of living index in {cheaper.name} is {cheaper.costIndex}, compared to {moreExpensive.costIndex} in {moreExpensive.name}.
                This means everyday expenses like groceries, transportation, and utilities cost less in {cheaper.name}.
              </p>
            </details>
            
            <details className="bg-white rounded-xl shadow-md p-6 group">
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                What is the rent difference between {city1.name} and {city2.name}?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                A 1-bedroom apartment in {city1.name} costs {formatCurrency(city1.medianRent1BR)}/month on average, 
                while in {city2.name} it costs {formatCurrency(city2.medianRent1BR)}/month. 
                That&apos;s a difference of {formatCurrency(Math.abs(rentDiff1BR))}/month, or {formatCurrency(Math.abs(rentDiff1BR) * 12)}/year.
              </p>
            </details>
            
            <details className="bg-white rounded-xl shadow-md p-6 group">
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                Which city has lower taxes?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                {city1.stateTaxRate < city2.stateTaxRate ? city1.name : city2.name} has lower state income taxes.
                {city1.name} has a {city1.stateTaxRate === 0 ? 'zero' : `${(city1.stateTaxRate * 100).toFixed(1)}%`} state income tax rate, 
                while {city2.name} has a {city2.stateTaxRate === 0 ? 'zero' : `${(city2.stateTaxRate * 100).toFixed(1)}%`} rate.
                {(city1.stateTaxRate === 0 || city2.stateTaxRate === 0) && ' States with no income tax can save you thousands per year!'}
              </p>
            </details>
            
            <details className="bg-white rounded-xl shadow-md p-6 group">
              <summary className="font-medium text-lg cursor-pointer list-none flex justify-between items-center">
                What salary do I need in {city2.name} to match my lifestyle in {city1.name}?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600">
                To maintain the same standard of living, you would need to earn approximately {formatCurrency(equivalentSalary)} in {city2.name} 
                to match a {formatCurrency(sampleSalary)} salary in {city1.name}. Use our <Link href="/calculator" className="text-blue-600 hover:underline">full calculator</Link> to 
                get a personalized estimate based on your actual salary and lifestyle preferences.
              </p>
            </details>
          </div>
        </section>
        
        {/* CTA */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for a Personalized Comparison?</h2>
            <p className="text-gray-600 mb-8">
              Get detailed cost breakdowns based on your salary, household size, and lifestyle preferences.
            </p>
            <Link 
              href="/calculator"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
            >
              Try the Full Calculator →
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
