import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Stripe webhook handler
// Processes payment events and updates user access

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!stripeKey || !webhookSecret) {
      console.log('Stripe webhook: not configured');
      return NextResponse.json({ received: true });
    }
    
    // Dynamic import
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);
    
    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get customer email
        const customerEmail = session.customer_details?.email || session.customer_email;
        
        if (customerEmail) {
          const supabase = getSupabase();
          
          if (supabase) {
            // Record the purchase
            await supabase.from('purchases').insert({
              email: customerEmail,
              product: session.metadata?.product || 'realocation_pro',
              stripe_payment_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
              stripe_session_id: session.id,
              amount: session.amount_total,
              status: 'completed',
            });
            
            // Create or update user as pro
            await supabase.from('users').upsert({
              email: customerEmail,
              is_pro: true,
              pro_purchased_at: new Date().toISOString(),
              stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
            }, {
              onConflict: 'email',
            });
          }
          
          console.log(`Pro purchase completed for: ${customerEmail}`);
        }
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
