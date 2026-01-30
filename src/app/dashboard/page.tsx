'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Report {
  id: string;
  city: string;
  origin_city: string | null;
  report_data: {
    city: {
      name: string;
      state: string;
    };
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
  };
  created_at: string;
}

interface UserData {
  email: string;
  isPro: boolean;
  proPurchasedAt: string | null;
  creditsRemaining: number;
  creditsTotal: number;
  creditsUsed: number;
  reports: Report[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    fetchUserData();
  }, []);
  
  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/reports');
      
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Unable to load your data</h2>
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Try signing in again
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Realocation
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{userData.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Credits Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Your Credits</h2>
              <p className="text-slate-600 mt-1">
                {userData.creditsRemaining} of {userData.creditsTotal} deep dive credits remaining
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{userData.creditsRemaining}</div>
                <div className="text-sm text-slate-500">credits left</div>
              </div>
              {userData.creditsRemaining === 0 && (
                <Link
                  href="/pricing"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Buy More
                </Link>
              )}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${(userData.creditsRemaining / Math.max(userData.creditsTotal, 1)) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Reports */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Your Reports</h2>
            <p className="text-slate-600 mt-1">
              {userData.reports.length === 0
                ? "You haven't generated any deep dive reports yet."
                : `${userData.reports.length} report${userData.reports.length === 1 ? '' : 's'} generated`}
            </p>
          </div>
          
          {userData.reports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No reports yet</h3>
              <p className="text-slate-600 mb-6">
                Use the calculator to compare cities and generate deep dive reports.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Start Comparing
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {userData.reports.map((report) => (
                <div key={report.id} className="p-6">
                  <button
                    onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {report.report_data.city.name}, {report.report_data.city.state}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Generated {formatDate(report.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-slate-900">
                            {formatCurrency(report.report_data.breakdown.total)}/mo
                          </div>
                          <div className="text-sm text-slate-500">total expenses</div>
                        </div>
                        <svg
                          className={`w-5 h-5 text-slate-400 transition-transform ${expandedReport === report.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {expandedReport === report.id && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Breakdown */}
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">Monthly Breakdown</h4>
                          <div className="space-y-2">
                            {Object.entries(report.report_data.breakdown)
                              .filter(([key]) => key !== 'total')
                              .map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                  <span className="text-slate-600 capitalize">{key}</span>
                                  <span className="text-slate-900 font-medium">{formatCurrency(value)}</span>
                                </div>
                              ))}
                            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-200">
                              <span className="text-slate-900">Total</span>
                              <span className="text-blue-600">{formatCurrency(report.report_data.breakdown.total)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quality & Insights */}
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">Quality of Life</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Safety</span>
                                <span className="text-slate-900">{report.report_data.quality.safetyIndex}/100</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${report.report_data.quality.safetyIndex}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Healthcare</span>
                                <span className="text-slate-900">{report.report_data.quality.healthcareIndex}/100</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500"
                                  style={{ width: `${report.report_data.quality.healthcareIndex}%` }}
                                />
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mt-2">
                              {report.report_data.quality.climateDescription}
                            </p>
                          </div>
                          
                          {report.report_data.insights.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium text-slate-900 mb-2">Insights</h4>
                              <ul className="space-y-1">
                                {report.report_data.insights.map((insight, i) => (
                                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Compare More Cities
          </Link>
        </div>
      </main>
    </div>
  );
}
