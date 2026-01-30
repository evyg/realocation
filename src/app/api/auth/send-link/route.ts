import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }
    
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user has any credits or reports (optional: allow anyone to request)
    const { data: credits } = await supabase
      .from('deep_dive_credits')
      .select('id')
      .eq('email', normalizedEmail)
      .limit(1);
    
    const { data: reports } = await supabase
      .from('deep_dive_reports')
      .select('id')
      .eq('email', normalizedEmail)
      .limit(1);
    
    const hasAccount = (credits && credits.length > 0) || (reports && reports.length > 0);
    
    if (!hasAccount) {
      // Still send link but they'll see empty reports - or could return error
      // For now, we'll create a token anyway (they might be new Pro users)
    }
    
    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store token (expires in 1 hour)
    const { error: insertError } = await supabase.from('magic_link_tokens').insert({
      email: normalizedEmail,
      token,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    });
    
    if (insertError) {
      console.error('Failed to create token:', insertError);
      return NextResponse.json({ error: 'Failed to create login link' }, { status: 500 });
    }
    
    // Send email with Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('Resend not configured');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }
    
    const resend = new Resend(resendKey);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://realocation.app';
    const loginUrl = `${baseUrl}/auth/verify?token=${token}`;
    
    await resend.emails.send({
      from: 'Realocation <noreply@realocation.app>',
      to: normalizedEmail,
      subject: 'Your Realocation Login Link',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 24px;">Sign in to Realocation</h1>
          
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Click the button below to sign in and access your reports and remaining credits.
          </p>
          
          <a href="${loginUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Sign In to Realocation
          </a>
          
          <p style="color: #888; font-size: 14px; margin-top: 32px;">
            This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          
          <p style="color: #888; font-size: 12px;">
            Realocation — Know before you go
          </p>
        </div>
      `,
    });
    
    return NextResponse.json({ success: true, message: 'Login link sent to your email' });
    
  } catch (error) {
    console.error('Send link error:', error);
    return NextResponse.json({ error: 'Failed to send login link' }, { status: 500 });
  }
}
