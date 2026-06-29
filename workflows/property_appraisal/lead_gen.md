# Property Appraisal — Lead Gen (Zillow Scrape → Enrich → Dashboard)

## What It Does
Scrapes Zillow and Realtor.com for new listings that need appraisals, filters by property type and price range, enriches with agent contact info via Firecrawl, and pushes to a Claude Code lead review dashboard.

## Integrations Required
- `APIFY_API_TOKEN` — Zillow + Realtor.com scraper
- `FIRECRAWL_API_KEY` — agent contact enrichment
- `GOOGLE_SERVICE_ACCOUNT_JSON` — lead tracking Sheet

## n8n Workflow Nodes

1. **Schedule Trigger** — Every morning 7am Monday–Friday

2. **Set: Define Target Markets** (`n8n-nodes-base.set`)
   - targets: [
       {"location": "Austin TX", "min_price": 300000, "max_price": 1500000, "type": "residential"},
       {"location": "Dallas TX", "min_price": 200000, "max_price": 1000000, "type": "condo"}
     ]

3. **Split In Batches** — one per target market

4. **HTTP Request: Apify Zillow** (`n8n-nodes-base.httpRequest`)
   - Actor: `BetrV6SJsXcdzGGZf`
   - Body: `{"searchUrls": ["https://www.zillow.com/homes/{{location}}"], "maxItems": 30}`

5. **Code: Filter by Criteria** (`n8n-nodes-base.code`)
   - JS: keep only listings where price in [min, max], listed < 7 days ago, not already in sheet

6. **HTTP Request: Firecrawl Enrich** (`n8n-nodes-base.httpRequest`)
   - For each listing with a Zillow agent page URL
   - Extract: agent name, email, phone, brokerage

7. **Google Sheets: Append Leads** (`n8n-nodes-base.googleSheets`)
   - Columns: Address, Price, Type, Agent Name, Agent Email, Agent Phone, Brokerage, Listed Date, Zillow URL, Status=New

## Claude Code App
Build `workflows/property_appraisal/lead_dashboard.html`:
- Table: all leads from Google Sheet
- Filters: location, price range, property type, status (New / Contacted / In Pipeline / Won)
- "Mark Contacted" button → updates sheet row via n8n PATCH webhook
- Export: filtered CSV download
- Stats row: total leads, contacted, win rate

## Python Tools Needed
- `apify_runner.py --action zillow --query "Austin TX" --max 20` — test scrape
- `firecrawl_scraper.py --action contacts --url <agent_page>` — test enrichment
- `google_sheets.py` — local data push for testing

## Test Plan
1. Run apify_runner locally with test location — verify 10+ leads returned
2. Test firecrawl on one Zillow agent profile URL — verify email/phone extracted
3. Trigger n8n workflow — verify new rows in Google Sheet
4. Open lead_dashboard.html — verify data loads, filters work, "Mark Contacted" updates sheet
