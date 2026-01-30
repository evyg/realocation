import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }
  
  const supabase = getSupabase();
  if (!supabase) {
    // Return default state if no Supabase
    return NextResponse.json({
      isPro: false,
      creditsRemaining: 0,
      email,
    });
  }
  
  try {
    // Check if user is pro
    const { data: user } = await supabase
      .from('users')
      .select('is_pro, stripe_customer_id')
      .eq('email', email.toLowerCase())
      .single();
    
    // Get available credits
    const { data: credits } = await supabase
      .from('deep_dive_credits')
      .select('credits_total, credits_used')
      .eq('email', email.toLowerCase())
      .gt('credits_total', 0);
    
    const creditsRemaining = credits?.reduce((sum, c) => sum + (c.credits_total - c.credits_used), 0) || 0;
    
    return NextResponse.json({
      isPro: user?.is_pro || creditsRemaining > 0,
      creditsRemaining,
      email,
    });
  } catch (error) {
    console.error('Error checking user status:', error);
    return NextResponse.json({
      isPro: false,
      creditsRemaining: 0,
      email,
    });
  }
}
