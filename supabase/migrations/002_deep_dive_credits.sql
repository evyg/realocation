-- Deep Dive Credits Schema
-- Tracks how many deep-dive reports a user has remaining

-- ===================
-- Deep Dive Credits
-- ===================
CREATE TABLE IF NOT EXISTS deep_dive_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  credits_total INTEGER NOT NULL DEFAULT 3,
  credits_used INTEGER NOT NULL DEFAULT 0,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year')
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_deep_dive_email ON deep_dive_credits(email);
CREATE INDEX IF NOT EXISTS idx_deep_dive_user ON deep_dive_credits(user_id);

-- Enable RLS
ALTER TABLE deep_dive_credits ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Allow service role access" ON deep_dive_credits
  FOR ALL USING (true);

-- ===================
-- Deep Dive Reports (track which cities were researched)
-- ===================
CREATE TABLE IF NOT EXISTS deep_dive_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  credit_id UUID REFERENCES deep_dive_credits(id) ON DELETE SET NULL,
  city TEXT NOT NULL,
  origin_city TEXT,
  report_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookup
CREATE INDEX IF NOT EXISTS idx_reports_email ON deep_dive_reports(email);
CREATE INDEX IF NOT EXISTS idx_reports_city ON deep_dive_reports(city);

-- Enable RLS
ALTER TABLE deep_dive_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Allow service role report access" ON deep_dive_reports
  FOR ALL USING (true);

-- ===================
-- Magic Link Tokens (simple auth)
-- ===================
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Index for token lookup
CREATE INDEX IF NOT EXISTS idx_magic_token ON magic_link_tokens(token);

-- Enable RLS
ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Allow service role magic access" ON magic_link_tokens
  FOR ALL USING (true);

-- ===================
-- Function: Get available credits for email
-- ===================
CREATE OR REPLACE FUNCTION get_available_credits(user_email TEXT)
RETURNS INTEGER AS $$
DECLARE
  total_available INTEGER;
BEGIN
  SELECT COALESCE(SUM(credits_total - credits_used), 0)
  INTO total_available
  FROM deep_dive_credits
  WHERE email = user_email
    AND credits_used < credits_total
    AND (expires_at IS NULL OR expires_at > NOW());
  
  RETURN total_available;
END;
$$ LANGUAGE plpgsql;

-- ===================
-- Function: Use a credit
-- ===================
CREATE OR REPLACE FUNCTION use_deep_dive_credit(user_email TEXT)
RETURNS UUID AS $$
DECLARE
  credit_record UUID;
BEGIN
  -- Find a credit record with available credits
  SELECT id INTO credit_record
  FROM deep_dive_credits
  WHERE email = user_email
    AND credits_used < credits_total
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE;
  
  IF credit_record IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Increment used count
  UPDATE deep_dive_credits
  SET credits_used = credits_used + 1
  WHERE id = credit_record;
  
  RETURN credit_record;
END;
$$ LANGUAGE plpgsql;
