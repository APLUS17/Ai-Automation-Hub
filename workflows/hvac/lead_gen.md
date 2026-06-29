# HVAC — Lead Gen (Google Maps Scrape → Enrichment → Sheet + Dashboard)

## What It Does
Scrapes Google Maps for HVAC businesses in target zip codes using Apify, enriches results with contact data via Firecrawl, deduplicates, and pushes a clean lead list to Google Sheets. A simple Claude Code dashboard lets you review and filter leads.

## Integrations Required
- `APIFY_API_TOKEN` (Google Maps scraper)
- `FIRECRAWL_API_KEY` (website contact enrichment)
- `GOOGLE_SERVICE_ACCOUNT_JSON` (Google Sheets output)
- n8n for orchestration trigger

## n8n Workflow Nodes

1. **Schedule Trigger** (`n8n-nodes-base.scheduleTrigger`)
   - Mode: manual (or weekly on Monday 8am)

2. **Set: Define Target Queries** (`n8n-nodes-base.set`)
   - queries: ["HVAC company 90210", "HVAC contractor 10001", "heating cooling 77001"]
   - (Edit this list with target markets)

3. **Split In Batches** (`n8n-nodes-base.splitInBatches`)
   - batch size: 1 (process one zip/query at a time)

4. **HTTP Request: Apify Google Maps** (`n8n-nodes-base.httpRequest`)
   - POST `https://api.apify.com/v2/acts/nwua9Gu5YkAVxpyIB/runs?token={{APIFY_API_TOKEN}}`
   - Body: `{"searchStringsArray": ["={{$json.query}}"], "maxCrawledPlacesPerSearch": 50}`

5. **Wait for Actor** (`n8n-nodes-base.wait`)
   - Resume: `timeInterval`, 60 seconds
   - (Poll Apify status until SUCCEEDED)

6. **HTTP Request: Fetch Apify Results** (`n8n-nodes-base.httpRequest`)
   - GET `https://api.apify.com/v2/datasets/{{datasetId}}/items?token={{APIFY_API_TOKEN}}`
   - Returns array of business records

7. **Code: Deduplicate by Phone/Name** (`n8n-nodes-base.code`)
   - JS: filter out items already in the sheet (compare against existing records)

8. **HTTP Request: Firecrawl Enrich** (`n8n-nodes-base.httpRequest`)
   - For each item with a website URL, POST to Firecrawl extract endpoint
   - Extract: email, contact name, phone from website

9. **Google Sheets: Append Leads** (`n8n-nodes-base.googleSheets`)
   - Append columns: [Business Name, Phone, Email, Address, Website, Google Rating, Review Count, Source Query, Date Scraped]

## Claude AI Tasks
- Optional: score each lead by rating count + recency of reviews

## Python Tools Needed
- `apify_runner.py` — for local testing / one-off scrapes
- `firecrawl_scraper.py` — batch enrichment outside n8n
- `google_sheets.py` — push results directly if n8n flow is skipped

## Test Plan
1. Run `python tools/apify_runner.py google-maps --query "HVAC company 90210" --max 5`
2. Verify 5 records returned with name, phone, address, website
3. Run `python tools/firecrawl_scraper.py contacts --url <one_website>`
4. Verify email/phone extracted
5. Trigger n8n workflow — check Google Sheet for new rows after run

## Claude Code App
Build `workflows/hvac/lead_review_dashboard.html`:
- Table of leads from Google Sheet (via n8n webhook that reads sheet)
- Filter by rating, city, date scraped
- "Mark contacted" button that updates sheet row status
- Export CSV button
