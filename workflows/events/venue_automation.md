# Event & Wedding Venues — Inquiry Intake & Proposal Automation

## What It Does
Two-part workflow: (1) Funnels all email and form inquiries into n8n where Claude extracts names, preferred dates, guest counts, budget hints, and special requests. n8n checks venue calendars for availability and within minutes sends a personalized reply confirming the date or proposing alternatives with tour time options. (2) When an inquiry is qualified, Claude drafts a complete line-item proposal combining venue capacity, bar options, catering rules, and add-ons. If accepted, n8n generates a contract from template and sends it via e-signature—getting couples signed within the same business day.

**Market context**: Venues lose bookings because of slow replies. Couples contact 4–6 venues simultaneously and commit to whichever replies first with a clear date-confirmed path. Average venue response time is 12–48 hours. Fast-response venues book at ~35% vs. ~8% for slow responders. Manual proposal assembly takes 1–3 hours; automated proposals go out in under 15 minutes with ~85% same-day contract rate.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for inquiry extraction and proposal drafting
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — inquiry logging, event records, package options
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — personalized replies, proposal delivery
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS follow-up
- `GOOGLE_SERVICE_ACCOUNT_JSON` — calendar checks, contract generation

## n8n Workflow Nodes

### Flow 1: Inquiry Intake & Date Qualification

1. **Gmail Trigger** (`n8n-nodes-base.gmailTrigger`)
   - Watch for emails with wedding/event inquiry keywords

2. **Claude: Extract Inquiry Details** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Extract: event_type, preferred_date, guest_count, budget_hint, special_requests, contact_info

3. **HTTP Request: Check Calendar Availability** (`n8n-nodes-base.httpRequest`)
   - Query Google Calendar or venue booking API for preferred date

4. **Airtable: Log Inquiry** (`n8n-nodes-base.airtable`)
   - Record: contact, date, guest_count, status = "New Inquiry"

5. **Claude: Draft Availability Reply** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - If available: confirm date + propose 2 tour times
   - If unavailable: suggest 2–3 alternative dates nearby

6. **Mailgun: Send Personalized Reply** (`n8n-nodes-base.httpRequest`)
   - Warm, personalized email within minutes of inquiry

### Flow 2: Proposal & Contract

7. **Webhook Trigger: Inquiry Qualified** (`n8n-nodes-base.webhook`)
   - Fired by staff after tour or phone call confirms interest

8. **Airtable: Get Package Options** (`n8n-nodes-base.airtable`)
   - Retrieve pricing, inclusions, BYO rules, add-on catalog

9. **Claude: Draft Proposal** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Generate complete line-item proposal with pricing, inclusions, conditions, and add-ons
   - Summarize contract terms in plain language for cover email

10. **Mailgun: Send Proposal Email** (`n8n-nodes-base.httpRequest`)
    - PDF proposal attachment + cover email

11. **Webhook Trigger: Client Accepts** (`n8n-nodes-base.webhook`)
    - Client clicks "accept" on proposal

12. **Google Docs: Generate Contract** (`n8n-nodes-base.googleDocs`)
    - Populate contract template with event details, pricing, and terms

13. **HTTP Request: Send E-Signature Link** (`n8n-nodes-base.httpRequest`)
    - DocuSign or equivalent e-signature request

14. **Airtable: Update Event Record** (`n8n-nodes-base.airtable`)
    - Status → "Contract Sent" or "Booked"

## Claude AI Tasks
- Extract event type, preferred date, guest count, and budget signals from raw inquiry emails
- Draft warm, personalized availability replies proposing tour times
- Draft complete proposals with line-item pricing, inclusions, and add-on options from venue data
- Summarize contract terms in plain language for client cover emails

## Python Tools Needed
- `google_docs_pdf.py` — export proposals as PDF attachments before emailing

## Test Plan
1. Send a test inquiry email with a wedding date request
2. Verify Claude extracts date, guest count, and event type correctly
3. Check Airtable for a new inquiry record
4. Confirm personalized reply email arrives within 5 minutes
5. Trigger a qualified inquiry webhook with event details and add-on selections
6. Verify Claude produces a complete proposal with correct line-item pricing
7. Confirm proposal email arrives with PDF attachment
8. Simulate client acceptance and verify contract and e-signature link are generated
