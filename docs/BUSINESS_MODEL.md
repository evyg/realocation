# Realocation Business Model Deep Dive

## Pricing Model: One-Time vs Subscription

### The Core Question
Relocation is a **one-time event** for most people. Does subscription make sense?

### Option A: One-Time Purchase ✅ RECOMMENDED

| Tier | Price | What You Get |
|------|-------|--------------|
| **Free** | $0 | 3 questions, basic comparison |
| **Report** | $29-49 | Full analysis, PDF export, 24hr access |
| **Premium** | $79-99 | Report + 30-day access + checklist + follow-ups |

**Why one-time works:**
- Matches the user's mental model ("I need help with THIS move")
- No subscription fatigue
- Higher conversion (people will pay $49 once vs $10/month)
- Simpler to sell

**The math:**
- 1,000 purchases/month × $40 average = $40K/month
- Very achievable if acquisition works

### Option B: Subscription

| Tier | Price | What You Get |
|------|-------|--------------|
| Monthly | $19/month | Unlimited questions, ongoing access |
| Annual | $99/year | Same, discounted |

**Why subscription is tricky:**
- People cancel after they move (2-3 months max)
- LTV is only $40-60 anyway
- Adds complexity (billing, churn management)
- Feels misaligned with one-time need

**When subscription COULD work:**
- Frequent movers (military, travel nurses, digital nomads)
- Real estate agents / relocation consultants (B2B)
- HR departments evaluating employee relocations

### Recommendation: **Tiered One-Time + Optional B2B Subscription**

```
CONSUMER: One-time
- Free trial (3 questions)
- $39 standard report
- $79 premium (30-day access + checklist)

B2B (later): Subscription
- $99/month for relocation consultants
- $299/month for HR teams
- Unlimited reports, white-label options
```

---

## Customer Acquisition Strategy

### Channel Analysis

| Channel | Fit | Cost | Speed | Scale |
|---------|-----|------|-------|-------|
| **SEO/Content** | ⭐⭐⭐⭐⭐ | Low | Slow (6-12mo) | High |
| **Google Ads** | ⭐⭐⭐⭐ | Medium | Fast | Medium |
| **Social (organic)** | ⭐⭐⭐ | Low | Medium | Medium |
| **Social (paid)** | ⭐⭐ | High | Fast | Medium |
| **Referral** | ⭐⭐⭐⭐ | Low | Slow | Medium |
| **Partnerships** | ⭐⭐⭐⭐ | Low | Slow | High |

### Primary: SEO + Content

**Why SEO is perfect for this:**
- High-intent searches ("cost of living Austin vs Denver", "moving to Portugal from US")
- Long-tail keywords = lower competition
- Content can be generated with AI assistance
- Compounds over time

**SEO Strategy:**
1. Create comparison pages: "[City A] vs [City B]"
2. Create destination guides: "Moving to [Country] from US"
3. Create calculator pages: "Cost of living [City]"
4. Each page → free tool → paid conversion

**Content volume needed:**
- 50-100 pages to start seeing traction
- Target: 10K organic visits/month in 6-12 months
- 2-3% conversion = 200-300 paying customers/month

### Secondary: Google Ads

**Why Google Ads:**
- Immediate traffic while SEO builds
- Test which keywords convert
- High intent ("relocation consultant", "should I move to Austin")

**Budget:**
- Start: $500-1,000/month
- Target CPC: $1-3 for long-tail keywords
- Target CAC: $15-25 (need 60-80% margin on $39 product)

**Sample campaigns:**
- "cost of living calculator" → Free tool → Upsell
- "moving to portugal" → Destination guide → Report
- "austin vs denver" → Comparison → Report

### Tertiary: Social Media

**Best platforms:**
1. **Reddit** — r/expats, r/digitalnomad, r/moving, r/personalfinance
   - Organic participation, helpful answers
   - Don't spam; be genuinely useful
   
2. **TikTok/Reels** — "I asked AI where I should move"
   - Viral potential
   - Show the product in action
   - Educational content (hidden costs of moving to X)

3. **Twitter/X** — Tech/remote work audience
   - Share insights, relocation data
   - Engage with digital nomad community

4. **YouTube** — Long-form destination guides
   - "Complete guide to moving to Portugal"
   - SEO + brand building

**Social is support, not primary.** Hard to convert directly, but builds awareness.

### Partnerships (Later)

- **Relocation companies** — White-label or referral
- **Real estate platforms** — Zillow, Redfin integration
- **Remote job boards** — We Work Remotely, Remote OK
- **Expat communities** — InterNations, Expat.com
- **Financial advisors** — Cross-referral for tax planning

---

## Platform: What to Build

### Options

| Platform | Build Time | Cost | Reach | Experience |
|----------|------------|------|-------|------------|
| **Web app (responsive)** | 1-2 weeks | Low | Everyone | Good |
| **Native mobile apps** | 2-3 months | High | App stores | Better |
| **ChatGPT plugin** | 1 week | Low | ChatGPT users | Limited |
| **Telegram/WhatsApp bot** | 1 week | Low | Messaging users | Niche |

### Recommendation: **Web App Only (for now)** ✅

**Why web:**
1. Fastest to build and iterate
2. No app store approval delays
3. SEO benefits (content pages drive traffic)
4. Works on all devices (responsive)
5. Easy to update pricing, features
6. No app store fees (30% cut)

**Why NOT mobile app (yet):**
1. Relocation research isn't a "daily use" app
2. People research on desktop (complex decisions)
3. 3-6 month delay to launch
4. App store optimization is another skill
5. Build mobile only after web proves out

### Web App Structure

```
realocation.app/
├── Landing page (conversion-focused)
├── /compare/[city-a]-vs-[city-b]  ← SEO pages (auto-generated)
├── /moving-to/[country]           ← Destination guides
├── /calculator                    ← Free tool (lead capture)
├── /chat                          ← AI conversation (freemium)
├── /report/[id]                   ← Saved/purchased reports
└── /checklist/[id]                ← Generated checklists
```

### Tech Stack

```
Frontend: Next.js (React)
- Fast, SEO-friendly
- Easy deployment (Vercel)
- You already know it

Backend: 
- Supabase (auth, database)
- Claude API (AI conversations)
- Stripe (payments)

Data:
- Curated knowledge base (Markdown/JSON)
- External APIs (Zillow, tax calculators)
- RAG with vector store (Pinecone/Supabase pgvector)
```

### MVP Scope (2 weeks)

**Week 1:**
- Landing page
- Basic chat interface
- Claude integration with relocation prompt
- 5 popular routes hard-coded (US→Portugal, CA→TX, etc.)
- Stripe checkout

**Week 2:**
- PDF report generation
- 10 SEO comparison pages
- Basic checklist generation
- Email delivery
- Polish + launch

---

## Revenue Projections

### Conservative Scenario (6-12 months)

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Monthly visitors | 2,000 | 8,000 | 25,000 |
| Free users | 400 | 1,600 | 5,000 |
| Paid conversions | 20 | 80 | 250 |
| Conversion rate | 5% | 5% | 5% |
| Avg price | $39 | $45 | $50 |
| **Monthly revenue** | **$780** | **$3,600** | **$12,500** |

### Optimistic Scenario

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Monthly visitors | 5,000 | 20,000 | 75,000 |
| Paid conversions | 75 | 300 | 1,125 |
| Avg price | $45 | $50 | $55 |
| **Monthly revenue** | **$3,375** | **$15,000** | **$61,875** |

### Cost Structure

| Cost | Monthly |
|------|---------|
| Claude API | $0.50-2.00 × conversions |
| Vercel hosting | $0-20 |
| Supabase | $0-25 |
| Domain + email | $10 |
| Google Ads (optional) | $500-2,000 |

**Gross margin: 70-85%** (excluding ads)

---

## Go-to-Market Summary

### Phase 1: Validate (Weeks 1-4)
- Build MVP web app
- Launch with 5-10 routes
- $500 Google Ads budget
- Goal: 50 paying customers, validate pricing

### Phase 2: Content (Months 2-4)
- Publish 50+ SEO pages
- Start social presence
- Refine product based on feedback
- Goal: 500 organic visits/day

### Phase 3: Scale (Months 5-12)
- Expand to more routes/countries
- Add B2B tier
- Partnership outreach
- Goal: $10K+ MRR

---

## Final Recommendation

| Decision | Recommendation |
|----------|----------------|
| **Pricing** | One-time ($39-79), not subscription |
| **Primary acquisition** | SEO + Content |
| **Secondary acquisition** | Google Ads |
| **Platform** | Web app only (responsive) |
| **Tech stack** | Next.js + Supabase + Claude |
| **MVP timeline** | 2 weeks |
| **Validation budget** | $1,000-2,000 |

### Should You Build This?

**Pros:**
- Clear value prop (AI consultant at 1/10th the price)
- Good unit economics ($39 price, <$2 AI cost)
- SEO-friendly (comparison keywords)
- Differentiated (no one doing AI + relocation well)
- Can be built fast (2 weeks)

**Cons:**
- Competes with free tools for basic info
- One-time revenue (need constant acquisition)
- Distraction from Bloomily

**My take:**
This is a solid **side project** or **weekend build**. The validation is cheap ($1-2K), and if it works, it can run semi-passively alongside Bloomily.

Don't let it consume you, but worth a 2-week sprint to test.
