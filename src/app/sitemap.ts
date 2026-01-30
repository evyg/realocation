import { MetadataRoute } from 'next';
import citiesData from '@/data/cities-full.json';
import citiesByState from '@/data/cities-by-state.json';

type ChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'always' | 'hourly' | 'yearly' | 'never';

interface City {
  id: string;
  population: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://realocation.app';
  const cities = citiesData as City[];
  const states = Object.keys(citiesByState);
  
  // Static pages
  const staticPages: Array<{ path: string; freq: ChangeFrequency; priority: number }> = [
    { path: '', freq: 'daily', priority: 1 },
    { path: '/pricing', freq: 'weekly', priority: 0.8 },
    { path: '/about', freq: 'monthly', priority: 0.7 },
    { path: '/blog', freq: 'weekly', priority: 0.8 },
    { path: '/privacy', freq: 'monthly', priority: 0.3 },
    { path: '/terms', freq: 'monthly', priority: 0.3 },
  ];
  
  // Blog posts
  const blogPosts = [
    'cost-of-living-calculator-guide',
    'best-cities-remote-workers-2026',
    'state-income-tax-guide',
    'cost-of-living-vs-salary',
  ];
  
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.freq,
    priority: page.priority,
  }));
  
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }));
  
  // State pages
  const stateEntries: MetadataRoute.Sitemap = states.map((code) => ({
    url: `${baseUrl}/state/${code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.7,
  }));
  
  // City pages - prioritize by population
  const cityEntries: MetadataRoute.Sitemap = cities.map((city) => {
    let priority = 0.4;
    if (city.population > 500000) priority = 0.7;
    else if (city.population > 100000) priority = 0.6;
    else if (city.population > 50000) priority = 0.5;
    
    return {
      url: `${baseUrl}/city/${city.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority,
    };
  });
  
  // Popular city comparison pages
  const popularCities = [
    'new-york-ny', 'los-angeles-ca', 'chicago-il', 'houston-tx', 'phoenix-az',
    'san-antonio-tx', 'san-diego-ca', 'dallas-tx', 'austin-tx', 'denver-co',
    'seattle-wa', 'boston-ma', 'nashville-tn', 'portland-or', 'miami-fl',
    'atlanta-ga', 'san-francisco-ca', 'charlotte-nc', 'raleigh-nc', 'tampa-fl'
  ];
  
  const comparisonEntries: MetadataRoute.Sitemap = [];
  for (let i = 0; i < popularCities.length; i++) {
    for (let j = i + 1; j < popularCities.length; j++) {
      comparisonEntries.push({
        url: `${baseUrl}/compare/${popularCities[i]}-vs-${popularCities[j]}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.8,
      });
    }
  }
  
  return [...staticEntries, ...blogEntries, ...stateEntries, ...cityEntries, ...comparisonEntries];
}
