# Real Estate Agencies — Lead Capture & Dead Lead Re-Engagement

## What It Does
Two-part workflow: (1) Connects to Zillow, Realtor.com, Facebook Ads, and phone systems. Every new contact is captured instantly and enriched with property history, estimated equity, and basic financial indicators. Claude produces a short buyer or seller profile and auto-triggers a tailored intro SMS or email. (2) Identifies leads with no contact in 6–12 months, queries MLS databases for local market changes (price drops, development updates), and Claude drafts personalized re-engagement messages referencing specific changes.

**Market context**: Agents copy leads manually from multiple platforms into spreadsheets with zero context beyond a name and phone number. Lead response time is 10× faster with automated enrichment. Dormant databases house 500–2,000 dead leads per team; data-driven re-engagement campaigns convert at ~12% vs. ~3% for generic mailers.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for lead profiling and market-data re-engagement drafting
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — lead pipeline and activity logs
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — intro and follow-up SMS
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — intro emails and MLS change notifications

## n8n Workflow Nodes

### Flow 1: Lead Capture & Enrichment

1. **Webhook Trigger: New Lead** (`n8n-nodes-base.webhook`)
   - Receives: source, name, email, phone, noted_property, buyer/seller_intent

2. **HTTP Request: Enrich via Property API** (`n8n-nodes-base.httpRequest`)
   - Call property registry API for tax history, estimated equity, and square footage

3. **Claude: Generate Lead Profile** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Analyze lead info + property history
   - Classify buyer/seller signal strength, likely motivation, and recommended initial outreach angle

4. **Airtable: Save Enriched Lead** (`n8n-nodes-base.airtable`)
   - Create new record with full profile, equity indicators, and status = "New"

5. **IF: Seller Signal** (`n8n-nodes-base.if`)
   - Seller → trigger SMS
   - Buyer → trigger email

6. **Twilio: Seller Intro SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, I saw you inquired about your property valuation. I just pulled the county records and would love to share details. Free to chat?"

7. **Mailgun: Buyer Intro Email** (`n8n-nodes-base.httpRequest`)
   - Tailored email showing current listings matching buyer search parameters

### Flow 2: Dead Lead Re-Engagement

8. **Schedule Trigger: Weekly** (`n8n-nodes-base.scheduleTrigger`)
   - Weekly on Thursday afternoons

9. **Airtable: Query Inactive Leads** (`n8n-nodes-base.airtable`)
   - Query leads with status = "Inactive" and last_contact > 6 months ago

10. **HTTP Request: MLS Market Data** (`n8n-nodes-base.httpRequest`)
    - Pull price changes, listings, and school rating updates in lead's preferred ZIP code

11. **Claude: Draft Re-Engagement Message** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - "Write a short, data-driven check-in message for {{name}} mentioning that average home prices in {{suburb}} dropped by {{percentage}} last month. Ask if they're still tracking the market."

12. **Mailgun: Send Re-Engagement Email** (`n8n-nodes-base.httpRequest`)
    - Data-driven re-engagement email with local market stats

13. **Wait: 5 Days** (`n8n-nodes-base.wait`)

14. **IF: Response Received** (`n8n-nodes-base.if`)
    - Yes → reactivate lead to "Active" and alert agent
    - No → archive lead

15. **Airtable: Reactivate to Pipeline** (`n8n-nodes-base.airtable`)
    - Shift status to "Re-Engaged"

16. **Airtable: Archive Non-Responder** (`n8n-nodes-base.airtable`)
    - Clean database record

## Claude AI Tasks
- Generate concise lead profiles identifying buyer vs. seller signals, motivation, and outreach approaches
- Draft personalized intro messages reflecting the lead's situation
- Draft market-data-driven re-engagement messages referencing neighborhood-specific price changes or developments
- Score lead responses to flag renewed buying intent

## Python Tools Needed
- `apify_runner.py` — scrape Zillow and Realtor.com property data for lead enrichment when direct API access is limited

## Test Plan
1. Submit a test lead webhook from Zillow with a local address
2. Verify property API enrichment call completes and returns local market history
3. Confirm Claude generates a profile with buyer/seller signal classification
4. Trigger weekly schedule and verify MLS data is fetched
5. Verify Claude drafts a market-data-referenced message
6. Simulate a reply and confirm lead is reactivated to pipeline in Airtable
