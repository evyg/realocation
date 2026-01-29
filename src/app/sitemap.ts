import { MetadataRoute } from 'next';

type ChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'always' | 'hourly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://realocation.app';
  
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
  
  return [...staticEntries, ...blogEntries];
}
