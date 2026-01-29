# Realocation Market Analysis

## Executive Summary

**Should you build this?** Maybe — but the path to revenue is tricky.

The market is real (26M Americans move annually), but monetization is challenging. The closest comparable success is Nomad List ($3-5M/year), which works because of community + niche focus. The closest failure is Teleport.org (raised $2.5M from a16z, acquired/shut down).

**Bottom line:** This could work as a side project or SEO content play, but I wouldn't bet the farm on it as a primary business.

---

## Market Size

### People Moving
- **26 million Americans** relocate each year (2024 data)
- That's 7.8% of the US population annually
- Relatively stable year-over-year

### Why They Move
- Job/career: 14-18%
- Housing (bought a home): 14.5%
- Family reasons: 20%+
- Cost of living: Growing factor
- Remote work enabled: Significant post-COVID

### Where They're Going
- Texas: #1 destination (added 563K people in 2024)
- Florida, North Carolina, Tennessee: Popular
- California, New York, New Jersey: Net outbound

---

## Competitive Landscape

### Direct Competitors

| Competitor | Focus | Business Model | Notes |
|------------|-------|----------------|-------|
| **Numbeo** | Cost of living globally | Ads + API licensing | Crowdsourced data, founded 2009, solo founder |
| **BestPlaces.net** | US city comparison | Advertising | Been around 20+ years, Sperling's data |
| **Dwellics** | Personalized city ranking | Unknown (likely freemium) | Newer, 60K+ US locations |
| **NerdWallet/Forbes/Bankrate** | Cost of living calculators | Affiliate/ads | Media companies, not core product |
| **Nomad List** | Digital nomad cities | Membership ($149 lifetime) | $3-5M/year, Pieter Levels, community-driven |

### What Happened to Teleport.org

This is the cautionary tale.

**Teleport:**
- Raised $2.5M seed from Andreessen Horowitz (2014)
- Built exactly what you're describing: city comparison for mobile workers
- Had beautiful UI, good data
- **Acquired by MOVE Guides (B2B corporate relocation) in 2017**
- Consumer product eventually shut down
- Domain is now dead

**Lesson:** The consumer relocation research tool didn't sustain as standalone. The value was in the data/tech, which was acquired by a B2B player.

### Why Nomad List Works (and Others Don't)

Nomad List is the success story in this space. Why?

1. **Niche focus:** Digital nomads, not everyone moving
2. **Community:** Slack, forums, meetups — people pay for access to other nomads
3. **Recurring value:** Not one-time relocation, but ongoing lifestyle
4. **Solo founder:** Pieter Levels, no investors, infinite runway
5. **Multiple products:** Nomad List + Remote OK (job board) + others

**Key insight:** People don't pay for data. They pay for community, connection, ongoing value.

---

## Monetization Analysis

### Model 1: Advertising
**How it works:** Free tool, display ads

**Pros:**
- Easy to implement
- No sales needed

**Cons:**
- Need massive traffic (millions of visits)
- CPMs for utility tools are low ($1-5)
- Ad blockers
- Feels cheap

**Revenue potential:** $1-5 per 1,000 visits. Need 1M+ monthly visits for meaningful revenue.

**Verdict:** Viable only as part of larger SEO content strategy. Not a standalone business.

---

### Model 2: Freemium / Subscription
**How it works:** Basic comparison free, premium features paid

**Premium features could be:**
- Unlimited comparisons
- Detailed neighborhood data
- Personalized reports (PDF)
- Saved searches / alerts
- "Best match" AI recommendations

**Pricing:** $10-30/month or $50-100/year

**Pros:**
- Direct revenue
- Aligned incentives

**Cons:**
- Hard to convert free → paid
- People only relocate occasionally (not recurring need)
- What's the ongoing value after they move?

**Conversion estimates:**
- 1-3% free to paid (typical for utilities)
- 100K monthly users → 1-3K paying → $120-360K/year at $10/month

**Verdict:** Possible but challenging. Retention is the killer — people churn after they move.

---

### Model 3: Affiliate / Lead Gen
**How it works:** Refer users to related services, earn commission

**Affiliate opportunities:**
- Moving companies (Allied, PODS, etc.)
- Real estate agents (referral fee)
- Mortgage brokers
- Home insurance
- Apartment listings (Zillow, Apartments.com)
- Job boards (Indeed, LinkedIn)

**Pros:**
- High intent users (actively planning to move)
- Good commission rates (moving companies: $50-200/lead)
- Natural fit with product

**Cons:**
- Need significant volume
- Quality control issues
- Can feel spammy if not done well

**Revenue potential:** $50-200 per qualified lead. 1,000 leads/month = $50-200K/year.

**Verdict:** Best monetization path for this type of product. But need traffic first.

---

### Model 4: B2B / Enterprise
**How it works:** Sell data or tools to companies doing employee relocation

**Customers:**
- Corporate relocation companies (MOVE Guides, Cartus)
- HR departments
- Real estate firms
- Recruiting companies

**Pros:**
- Higher contract values ($10K-100K/year)
- Recurring revenue
- Less dependent on consumer traffic

**Cons:**
- Enterprise sales cycle
- Different product needs
- Competing with established players

**Verdict:** This is what Teleport pivoted to (via acquisition). Viable but different business.

---

### Model 5: Content / SEO Play
**How it works:** Build the tool to generate SEO traffic, monetize via content

**Example:** Create pages like:
- "Austin vs Denver: Which City is Better?"
- "Cost of Living in Phoenix 2026"
- "Best Cities for Remote Workers"

Each page ranks in Google, drives traffic, monetizes via ads/affiliate.

**Pros:**
- Proven model (NerdWallet, BestPlaces do this)
- Compounding returns
- Lower barrier to monetization

**Cons:**
- SEO takes 6-12+ months
- Google algorithm risk
- Content creation is ongoing work

**Verdict:** Most realistic path. But it's a content business, not a product business.

---

## Demand Signals

### Search Volume (Estimated)
| Query | Monthly Searches (US) |
|-------|----------------------|
| "cost of living calculator" | 50-100K |
| "best places to live" | 50-100K |
| "cost of living [city]" | 10-50K per major city |
| "compare cities" | 10-20K |
| "[city] vs [city]" | 5-20K per pair |

**Total addressable searches:** Probably 500K-1M/month for relocation-related queries.

### Trends
- Remote work increased search interest (2020-2022)
- Now normalized/slightly declining
- Seasonal: peaks in spring (moving season)
- Generational: Gen Z most willing to relocate (67%)

---

## Technical Feasibility

### Data Sources Available
| Data Type | Source | Cost |
|-----------|--------|------|
| Cost of living | BLS, Numbeo (scrape or license) | Free/paid |
| Housing | Zillow API, Redfin | Free tier available |
| Crime | FBI UCR, local PDs | Free |
| Schools | GreatSchools API | Free tier |
| Weather | NOAA, OpenWeather | Free |
| Jobs | BLS, LinkedIn | Free/paid |
| Taxes | Tax Foundation | Free |
| Walkability | Walk Score API | Paid |

**Effort estimate:** 2-4 weeks to build MVP aggregating these sources.

**Challenge:** Keeping data fresh and accurate. Numbeo's edge is crowdsourced updates.

---

## Honest Assessment

### Reasons TO Build

1. **Real pain point** — Relocation research sucks, people would use a better tool
2. **SEO opportunity** — High-intent searches with monetization potential
3. **Solo-founder friendly** — Can be built and run by one person
4. **Data moat possible** — Unique data (user preferences, outcome tracking) could differentiate
5. **Adjacent opportunities** — Could expand to related services (job board, housing marketplace)

### Reasons NOT TO Build

1. **Monetization is hard** — Ads need huge scale, subscriptions have churn problem
2. **Teleport failed** — Well-funded company with same idea got acqui-hired
3. **Competition is entrenched** — Numbeo, BestPlaces have 10-20 year head starts + SEO
4. **Not recurring** — People relocate once every few years, not monthly
5. **Distraction risk** — Takes focus from Bloomily which has clearer path to revenue

---

## If You Build It: Recommendations

### Approach 1: SEO Content Play (Lowest Risk)
- Build simple comparison tool
- Create 100+ city/comparison pages
- Monetize via affiliate (moving companies, real estate)
- Don't expect product revenue; treat as content business
- **Effort:** 4-8 weeks to launch, ongoing content creation
- **Revenue potential:** $50-200K/year at scale (12-18 months)

### Approach 2: Niche Focus (Medium Risk)
- Pick a specific audience (remote workers, retirees, families)
- Build community element (not just data)
- Charge for community access + premium features
- Model: Nomad List but for [specific segment]
- **Effort:** 3-6 months to meaningful traction
- **Revenue potential:** $100-500K/year if community works

### Approach 3: Full Product (Higher Risk)
- Build comprehensive relocation platform
- Raise money to compete
- Go after B2B eventually
- **Effort:** 12+ months, significant capital
- **Revenue potential:** $1M+ if it works, but high failure rate

---

## My Recommendation

**Don't make this your primary focus right now.**

Bloomily has:
- Clearer path to revenue (paying customers exist in childcare software)
- Differentiated positioning (childcare + camps)
- Active sales pipeline

Realocation has:
- Unproven monetization
- Entrenched competitors
- Long runway to revenue

**If you want to explore it:**
1. Spend a weekend building a basic MVP
2. Create 10-20 city comparison pages
3. See if they rank / get traffic
4. If traffic comes, then invest more

Don't let a shiny new idea distract from the business that's already in motion.

---

## Quick Validation Tests (Before Building)

1. **Landing page test:** Put up "Coming soon" page, see if people sign up
2. **Reddit/Twitter test:** Post about the pain point, gauge response
3. **SEO test:** Write 5 comparison articles, publish on Medium or blog, see traffic
4. **Interview test:** Talk to 5 people who recently relocated — would they pay for this?

If any of these show strong signal, then consider building.

---

*Analysis completed: January 29, 2026*
