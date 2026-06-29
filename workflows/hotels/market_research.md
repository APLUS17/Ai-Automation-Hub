# Hotels — Early-Stage Market Research

## What It Does
Scrapes Booking.com and Expedia listings for a target market. Pulls Google Maps and TripAdvisor reviews for those properties. Claude performs sentiment analysis to extract pain points. Results are organized by category in Airtable. Also builds a prospect list of independent hotels (no major PMS vendor) for outreach.

## Integrations Required
- `APIFY_API_TOKEN` — Booking.com, Expedia, TripAdvisor scrapers
- `FIRECRAWL_API_KEY` — hotel website enrichment
- `ANTHROPIC_API_KEY` — sentiment analysis + pain point extraction
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — research database

## n8n Workflow Nodes

### Flow 1: Scrape Market Listings

1. **Schedule Trigger** — manual (run once per market research project)

2. **Set: Define Target Market** (`n8n-nodes-base.set`)
   - location: "Miami Beach FL"
   - star_categories: [3, 4]  // boutique/independent hotels
   - max_results: 50

3. **HTTP Request: Apify Booking.com Scraper** (`n8n-nodes-base.httpRequest`)
   - Actor: `voyager~booking-scraper`
   - Body: `{"startUrls": ["https://www.booking.com/searchresults.html?ss={{location}}"], "maxItems": 50}`

4. **Code: Filter Independents** (`n8n-nodes-base.code`)
   - JS: exclude known chains (Marriott, Hilton, IHG, Hyatt, Wyndham, etc.)
   - Keep: boutique, independent, family-owned keywords in name/description

5. **Airtable: Create Hotel Records** (`n8n-nodes-base.airtable`)
   - Table: "Hotels"
   - Fields: Hotel Name, Location, Stars, Review Count, Avg Rating, Booking URL, Type=Independent/Chain

### Flow 2: Review Scraping + Sentiment

6. **Airtable: Read Hotels** — get all hotels from step 5

7. **Split In Batches** (one hotel at a time)

8. **HTTP Request: Apify TripAdvisor Reviews** (`n8n-nodes-base.httpRequest`)
   - Actor: `maxcopell~tripadvisor-reviews`
   - Pull last 50 reviews per hotel

9. **HTTP Request: Claude Sentiment** (OpenRouter)
   - System: "You are a hospitality market researcher."
   - Prompt: "Analyze these hotel reviews. Categorize pain points into: [Check-in/Check-out, Room Quality, WiFi/Technology, Staff, F&B, Cleanliness, Value, Booking/Reservation]. For each category: sentiment (positive/negative/neutral), frequency (high/medium/low), representative quote. Return JSON."

10. **Airtable: Store Pain Points** (`n8n-nodes-base.airtable`)
    - Table: "Pain Points"
    - One row per category per hotel: Hotel_ID, Category, Sentiment, Frequency, Quote

### Flow 3: Prospect Enrichment

11. **Firecrawl: Enrich Hotel Websites** (`n8n-nodes-base.httpRequest`)
    - For each independent hotel URL
    - Extract: contact email, GM name, phone, PMS mentions (look for Cloudbeds, Opera, Mews keywords)

12. **Airtable: Update Hotel Records** — add contact info, flag "No Known PMS" as top prospects

## Claude Code App
Build `workflows/hotels/research_dashboard.html`:
- Market overview: total hotels scraped, % independent, avg rating
- Pain point heatmap: grid of categories vs. hotels (color = sentiment)
- Prospect list table: independent hotels sorted by opportunity score
- Export: CSV of top 20 prospects

## Claude AI Tasks
- Sentiment analysis + pain point categorization per hotel (step 9)

## Python Tools Needed
- `apify_runner.py` — run scrapers locally for testing
- `firecrawl_scraper.py --action enrich --leads file.json` — batch hotel website enrichment
- `airtable_crud.py` — create/read tables during testing

## Test Plan
1. Run Booking.com scraper on test location (10 max results) — verify hotels returned
2. Run TripAdvisor reviews for 1 hotel — verify 20+ reviews fetched
3. Pass reviews to claude_ai.py sentiment — verify structured pain point JSON
4. Check Airtable — Pain Points table populated correctly
5. Open research_dashboard.html — verify all 3 panels load with real data
