import { NextRequest, NextResponse } from 'next/server';

// Newsletter subscription endpoint
// Uses Resend to add subscribers (or can save to Supabase)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      source = 'website',
      // Calculator data
      salary,
      currentCity,
      bedrooms,
      numAdults,
      numChildren,
      hasCar,
      preferences,
      topCities,
    } = body;
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }
    
    // Save to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your_supabase')) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Save email to newsletter_subscribers
      const { error: subError } = await supabase
        .from('newsletter_subscribers')
        .upsert({ email, source, subscribed_at: new Date().toISOString() });
      
      if (subError) {
        console.error('Supabase subscriber error:', subError);
      }
      
      // Save calculation data if provided
      if (salary && currentCity) {
        const { error: calcError } = await supabase
          .from('calculations')
          .insert({
            salary: parseInt(salary),
            current_city: currentCity,
            top_cities: {
              bedrooms,
              numAdults,
              numChildren,
              hasCar,
              preferences,
              results: topCities?.slice(0, 10),
            },
          });
        
        if (calcError) {
          console.error('Supabase calculation error:', calcError);
        }
      }
    }
    
    // Option 2: Send welcome email via Resend (when configured)
    const resendKey = process.env.RESEND_API_KEY;
    
    if (resendKey && !resendKey.includes('your_api_key')) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      
      await resend.emails.send({
        from: 'Realocation <hello@realocation.app>',
        to: email,
        subject: 'Welcome to Realocation! 🏡',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Thanks for subscribing!</h1>
            <p>You'll receive our best insights on:</p>
            <ul>
              <li>Cost of living updates</li>
              <li>Tax changes that affect your take-home</li>
              <li>City spotlights and comparisons</li>
            </ul>
            <p>In the meantime, <a href="https://realocation.app" style="color: #2563eb;">try our free calculator</a> to see where your money goes further.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              You're receiving this because you subscribed at realocation.app.<br>
              <a href="https://realocation.app/unsubscribe?email=${encodeURIComponent(email)}" style="color: #666;">Unsubscribe</a>
            </p>
          </div>
        `,
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    );
  }
}
