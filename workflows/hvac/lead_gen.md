# HVAC — Lead Gen & Inbound Triage (Scrape + Enrich → Sheet + Urgency Response)

## What It Does
Two-part workflow: (1) Scrapes Google Maps for HVAC prospects in target zip codes using Apify, enriches with contact data via Firecrawl, deduplicates, and pushes to Google Sheets. (2) When inbound leads arrive (Google LSA, Facebook, web form), Claude classifies urgency 1–10 and routes instantly — emergencies get a tech SMS'd within 60 seconds, estimates get auto-scheduled, routine inquiries enter the CRM pipeline.

**Market context**: Homeowners submit to 5–8 HVAC companies simultaneously. The first to respond wins the $6,000–$12,000 job. Most HVAC owners don't see new leads until 8 AM — 14 hours too late.

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

--- (Part 2: Inbound Lead Triage — separate n8n workflow) ---

10. **Webhook Trigger** (`n8n-nodes-base.webhook`)
    - Receives leads from Google LSA, Facebook Lead Ads, website forms (24/7)

11. **Claude: Classify Urgency** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Prompt: "Classify this HVAC request — problem type, urgency 1–10, system affected, severity. Return JSON."
    - Urgency 8–10: emergency (no heat/AC, water leak, system failure)
    - Urgency 4–7: estimate needed soon
    - Urgency 1–3: general inquiry / maintenance

12. **IF: Urgency Branch** (`n8n-nodes-base.if`)
    - 8–10 → SMS on-call tech immediately + SMS customer: "We received your request. A tech will call you within 15 minutes." Log as Emergency in ServiceTitan.
    - 4–7 → Check tech calendars, SMS customer with 2 available time slots to reply "1" or "2". Auto-book on reply.
    - 1–3 → Route to CRM sales pipeline. SMS: "A specialist will call within 24 hours." Auto-escalate if no contact in 24hrs.

13. **Post-job (48hrs later)**: Google review request SMS

## Claude AI Tasks
- Urgency classification (1–10) with problem type and severity on every inbound lead
- Optional: score outbound scraped leads by rating count + recency of reviews

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
