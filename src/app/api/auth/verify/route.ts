import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import crypto from 'crypto';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
  }
  
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
  
  try {
    // Find and validate token
    const { data: tokenData, error } = await supabase
      .from('magic_link_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();
    
    if (error || !tokenData) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }
    
    // Check expiration
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/login?error=expired_token', request.url));
    }
    
    // Mark token as used
    await supabase
      .from('magic_link_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);
    
    // Create session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    // Store session in a new sessions table or just use a signed cookie
    // For simplicity, we'll store email in a secure cookie
    const cookieStore = await cookies();
    
    // Set session cookie with email (in production, use encrypted/signed cookies)
    cookieStore.set('realocation_session', JSON.stringify({
      email: tokenData.email,
      token: sessionToken,
      expires: sessionExpires.toISOString(),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: sessionExpires,
      path: '/',
    });
    
    // Also set a client-readable cookie for the email (for UI purposes)
    cookieStore.set('realocation_email', tokenData.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: sessionExpires,
      path: '/',
    });
    
    // Redirect to dashboard/reports
    return NextResponse.redirect(new URL('/dashboard', request.url));
    
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
