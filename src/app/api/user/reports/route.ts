import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('realocation_session');
  
  if (!sessionCookie?.value) return null;
  
  try {
    const session = JSON.parse(sessionCookie.value);
    if (new Date(session.expires) < new Date()) return null;
    return session.email;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  // Get email from session or query param (for backwards compat)
  let email = await getSessionEmail();
  
  if (!email) {
    // Fallback to query param for API access
    email = request.nextUrl.searchParams.get('email');
  }
  
  if (!email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }
  
  try {
    const normalizedEmail = email.toLowerCase();
    
    // Get user's reports
    const { data: reports, error: reportsError } = await supabase
      .from('deep_dive_reports')
      .select('id, city, origin_city, report_data, created_at')
      .eq('email', normalizedEmail)
      .order('created_at', { ascending: false });
    
    if (reportsError) {
      console.error('Reports fetch error:', reportsError);
    }
    
    // Get credits info
    const { data: credits } = await supabase
      .from('deep_dive_credits')
      .select('credits_total, credits_used, created_at, expires_at')
      .eq('email', normalizedEmail);
    
    const creditsRemaining = credits?.reduce((sum, c) => sum + (c.credits_total - c.credits_used), 0) || 0;
    const creditsTotal = credits?.reduce((sum, c) => sum + c.credits_total, 0) || 0;
    
    // Get user info
    const { data: user } = await supabase
      .from('users')
      .select('is_pro, pro_purchased_at')
      .eq('email', normalizedEmail)
      .single();
    
    return NextResponse.json({
      email: normalizedEmail,
      isPro: user?.is_pro || false,
      proPurchasedAt: user?.pro_purchased_at,
      creditsRemaining,
      creditsTotal,
      creditsUsed: creditsTotal - creditsRemaining,
      reports: reports || [],
    });
    
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
