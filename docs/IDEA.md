# Realocation 📍

**Tagline:** "Know before you go"

## The Problem

Relocating is one of the biggest decisions people make, but the research process sucks:
- Googling "cost of living [city]" gives you garbage listicles
- Data is scattered across 20 different sites
- No way to compare YOUR priorities (schools vs nightlife vs taxes)
- You don't know what you don't know (hidden costs, gotchas)

People spend months researching, open 50 tabs, make spreadsheets, and still miss important stuff.

## The Solution

One app that aggregates everything you need to evaluate a potential new home:

### Core Data Points
- **Cost of living** — Housing, groceries, utilities, healthcare, taxes
- **Job market** — Salaries for your field, unemployment rate, major employers
- **Housing** — Rent vs buy, price trends, inventory, neighborhoods
- **Schools** — Ratings, test scores, public vs private options
- **Safety** — Crime rates by type, trends, neighborhood-level data
- **Weather** — Climate, seasonal patterns, natural disaster risk
- **Lifestyle** — Restaurants, outdoor activities, nightlife, culture
- **Healthcare** — Hospital quality, insurance costs, specialist availability
- **Commute** — Traffic, public transit, walkability
- **Taxes** — Income tax, property tax, sales tax, overall burden
- **Demographics** — Age distribution, diversity, political leaning (optional)

### Key Features

1. **Side-by-side comparison** — Compare 2-4 cities on factors you care about
2. **Personalized weighting** — "I care about schools 10/10, nightlife 2/10"
3. **Your salary adjusted** — "Your $150K in SF = $X in Austin"
4. **Neighborhood drill-down** — City-level is too broad; show neighborhoods
5. **Hidden costs calculator** — Moving costs, deposits, setup expenses
6. **Timeline planner** — When to visit, apply for jobs, give notice, move
7. **Local insights** — Reddit/forum sentiment, "what locals wish they knew"

## Differentiators

vs Niche ("cost of living calculator"):
- More comprehensive (not just COL)
- Personalized to YOUR priorities
- Actionable (not just data dump)

vs Zillow/Redfin:
- Not just housing
- Comparison-focused
- Decision support, not just listings

vs City guides/listicles:
- Data-driven, not opinion
- Personalized ranking
- Constantly updated

## Revenue Models

1. **Freemium** — Basic comparison free, detailed reports paid
2. **Affiliate** — Real estate, moving companies, job boards
3. **B2B** — Companies helping employees relocate
4. **Premium subscription** — Unlimited comparisons, saved searches, alerts

## Target Users

1. **Remote workers** — Can live anywhere, optimizing for lifestyle
2. **Job changers** — Got an offer in a new city, evaluating
3. **Retirees** — Looking for retirement destination
4. **Families** — Schools are make-or-break decision factor
5. **Digital nomads** — Comparing multiple destinations

## Data Sources

| Data Type | Potential Sources |
|-----------|-------------------|
| Cost of living | BLS, Numbeo API, local government data |
| Housing | Zillow API, Redfin, Census |
| Schools | GreatSchools API, state education data |
| Crime | FBI UCR, local police data |
| Weather | NOAA, Weather API |
| Jobs | BLS, LinkedIn, Indeed |
| Taxes | Tax Foundation, state DOR |
| Demographics | Census Bureau |
| Walkability | Walk Score API |
| Traffic | Google Maps API, INRIX |

## MVP Scope

**Phase 1 (4-6 weeks):**
- 50 largest US metros
- Core data: COL, housing, schools, crime, weather, taxes
- Side-by-side comparison (2 cities)
- Basic personalization (weight factors)
- Web app (responsive)

**Phase 2:**
- Neighborhood-level data
- Salary adjustment calculator
- More cities
- Mobile apps

**Phase 3:**
- AI recommendations ("based on your preferences, consider...")
- Community features (ask locals)
- Moving timeline/checklist
- Partner integrations

## Competitive Landscape

| Competitor | Focus | Gap |
|------------|-------|-----|
| Numbeo | Cost of living | Just COL, no personalization |
| Niche | City rankings | Generic rankings, not personalized |
| BestPlaces | City data | Dated UI, no comparison tools |
| Zillow | Housing | Only housing, not holistic |
| Nomad List | Digital nomads | International focus, not US depth |

## Tech Stack (Suggested)

- **Frontend:** Next.js (web), React Native (mobile later)
- **Backend:** Supabase or simple API layer
- **Data:** Aggregate from APIs + scraping + manual curation
- **Maps:** Mapbox or Google Maps

## Business Model Viability

**Pros:**
- Clear pain point (everyone hates relocation research)
- Multiple revenue streams
- SEO potential ("cost of living Austin vs Denver")
- Recurring need (people relocate multiple times)

**Cons:**
- Data aggregation is work
- Some data costs money (APIs)
- Competing with free (but scattered) info
- Monetization might be slow

## Quick Validation Ideas

1. **SEO test:** Write comparison articles, see traffic
2. **Landing page:** Collect emails for "coming soon"
3. **Reddit/Twitter:** Post about the pain point, gauge response
4. **Interview:** Talk to 5 people who recently relocated

## Naming

"Realocation" — clever misspelling of "relocation" + "real" (as in real estate / real data)

**Domain Check (Jan 29, 2026):**
- realocation.com — SERVFAIL (possibly registered but not configured, check registrar)
- realocation.app — NXDOMAIN (likely available! ✓)
- realocate.app — NXDOMAIN (likely available! ✓)

**Recommendation:** Grab realocation.app quickly if you want to pursue this.

---

## Questions to Answer

1. Start with web or mobile?
2. US only or include international?
3. Freemium or paid from day 1?
4. Build data pipeline or use existing APIs?
5. Solo project or need a team?

---

*Captured: January 29, 2026*
*Status: Idea stage*
