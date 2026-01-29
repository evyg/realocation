-- Realocation Database Schema
-- Run this migration in your Supabase SQL editor

-- ===================
-- Users Table
-- ===================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  stripe_customer_id TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  pro_purchased_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ===================
-- Newsletter Subscribers
-- ===================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from API
CREATE POLICY "Allow anonymous inserts" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- ===================
-- Calculations (for analytics)
-- ===================
CREATE TABLE IF NOT EXISTS calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  salary INTEGER NOT NULL,
  current_city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Optional: store results for comparison
  top_cities JSONB
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON calculations(created_at);
CREATE INDEX IF NOT EXISTS idx_calculations_city ON calculations(current_city);

-- Enable RLS
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for analytics)
CREATE POLICY "Allow anonymous calculation inserts" ON calculations
  FOR INSERT WITH CHECK (true);

-- ===================
-- Purchases
-- ===================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  stripe_payment_id TEXT,
  stripe_session_id TEXT,
  amount INTEGER, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookup
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_id ON purchases(stripe_payment_id);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- ===================
-- Email Results Log (optional - for tracking sent emails)
-- ===================
CREATE TABLE IF NOT EXISTS email_results_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  salary INTEGER NOT NULL,
  current_city TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  resend_id TEXT
);

-- Enable RLS
ALTER TABLE email_results_log ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from API
CREATE POLICY "Allow anonymous email log inserts" ON email_results_log
  FOR INSERT WITH CHECK (true);

-- ===================
-- Functions
-- ===================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===================
-- Aggregate Views (for analytics dashboard)
-- ===================

-- Daily calculation counts
CREATE OR REPLACE VIEW daily_calculation_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_calculations,
  COUNT(DISTINCT current_city) as unique_cities,
  AVG(salary) as avg_salary
FROM calculations
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Popular cities
CREATE OR REPLACE VIEW popular_cities AS
SELECT 
  current_city,
  COUNT(*) as calculation_count
FROM calculations
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY current_city
ORDER BY calculation_count DESC
LIMIT 20;
