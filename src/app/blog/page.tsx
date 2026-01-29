import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Blog | Realocation',
  description: 'Insights on cost of living, relocation tips, and city comparisons to help you make smarter moving decisions.',
};

const posts = [
  {
    slug: 'cost-of-living-calculator-guide',
    title: 'The Complete Guide to Using a Cost of Living Calculator',
    excerpt: 'Learn how to properly use cost of living calculators to make informed relocation decisions. We cover what factors matter most and common mistakes to avoid.',
    date: '2026-01-15',
    readTime: '8 min read',
    category: 'Guides',
  },
  {
    slug: 'best-cities-remote-workers-2026',
    title: 'Best Cities for Remote Workers in 2026',
    excerpt: 'Discover the top cities offering the best combination of affordable living, quality of life, and infrastructure for remote workers.',
    date: '2026-01-10',
    readTime: '12 min read',
    category: 'Rankings',
  },
  {
    slug: 'state-income-tax-guide',
    title: 'State Income Tax: The Hidden Factor in Relocation',
    excerpt: 'Moving from California to Texas could save you thousands. But which states have no income tax, and what are the trade-offs?',
    date: '2026-01-05',
    readTime: '6 min read',
    category: 'Taxes',
  },
  {
    slug: 'cost-of-living-vs-salary',
    title: 'Cost of Living vs Salary: Which Matters More?',
    excerpt: 'A $150K salary in San Francisco vs $100K in Austin—which leaves you with more? We break down the math.',
    date: '2025-12-28',
    readTime: '7 min read',
    category: 'Analysis',
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Relocation Insights
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Data-driven guides to help you make smarter decisions about where to live.
            </p>
          </div>
        </section>
        
        {/* Posts Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-white rounded-xl border border-gray-200 p-6 sm:p-8
                           hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-blue-600 font-medium text-sm flex items-center gap-1">
                      Read more
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter CTA */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Get new articles in your inbox
            </h2>
            <p className="text-blue-100 mb-6">
              We publish new city guides and analysis every week.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 
                       font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Subscribe in Footer ↓
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
