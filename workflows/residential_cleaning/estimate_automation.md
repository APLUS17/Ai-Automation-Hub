# Residential Cleaning Services — Lead Capture & Route Optimization

## What It Does
Two-part workflow: (1) On form submission or call log entry, n8n collects details and applies pricing tables. Claude infers home type and square footage, generating a clear estimate sent via SMS and email within 3 minutes with a scheduling link. (2) Compiles daily jobs with addresses, clusters stops by area (e.g. Mason/Deerfield, West Chester/Liberty), and sequences optimized crew run sheets. Crews receive SMS sequence schedules. Same-day cancellations adjust and push updated routes.

**Market context**: Homeowners asking 3 competing cleaners commit to the first one that sends a clear price and booking link. Automated 3-minute quotes lift booking conversions by +38%. Meanwhile, inefficient routing costs fuel and reduces crew output. Optimized routing adds 2–3 extra stops/day and cuts drive times by 20–30%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for estimate parsing and run sheet text generation
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — lead pipeline, crew schedules
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — estimate SMS, crew routing SMS
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — itemized estimate emails, follow-up

## n8n Workflow Nodes

### Flow 1: Lead Capture & Instant Estimate

1. **Webhook Trigger: Inquiry Form** (`n8n-nodes-base.webhook`)
   - Receives: name, email, phone, address, bedrooms, bathrooms, notes

2. **Claude: Infer Home Type + Apply Pricing** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Look up address details to infer home type (townhome vs. single-family) and approximate square footage
   - Apply pricing formulas: base fee + ($ per room)

3. **Airtable: Create Lead Record** (`n8n-nodes-base.airtable`)
   - Table: "Leads", status = "Estimated", prices = JSON

4. **Mailgun: Email Estimate** (`n8n-nodes-base.httpRequest`)
   - Send professional quote detailing one-time vs. recurring options

5. **Twilio: SMS Estimate** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, your cleaning estimate is ready! One-time: ${{onetime}} | Recurring: ${{recurring}}/mo. Book here: {{booking_link}}"

6. **Wait: 24 Hours** (`n8n-nodes-base.wait`)

7. **IF: Booked** (`n8n-nodes-base.if`)
   - Yes → exit
   - No → send follow-up reminder

8. **Mailgun: Follow-Up Email** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, just checking in on your cleaning quote. We have 2 slots left this week..."

### Flow 2: Route Planning & Crew Scheduling

9. **Schedule Trigger: Daily AM** (`n8n-nodes-base.scheduleTrigger`)
   - Daily at 6am

10. **Airtable: Get Today's Jobs** (`n8n-nodes-base.airtable`)
    - Retrieve active jobs scheduled for today

11. **HTTP Request: Google Maps Distance Matrix** (`n8n-nodes-base.httpRequest`)
    - Pull drive times between all job locations

12. **Code: Cluster by Area + Sequence** (`n8n-nodes-base.code`)
    - JS: group stops by proximity, sequence to minimize total transit miles

13. **Airtable: Write Route Assignments** (`n8n-nodes-base.airtable`)
    - Save sequenced route list linked to crew IDs

14. **Twilio: SMS Run Sheet to Crew Lead** (`n8n-nodes-base.httpRequest`)
    - SMS: "Today's schedule: Stop 1: 100 Maple St (8:30am) -> Stop 2: 200 Elm St (11am)..."

## Claude AI Tasks
- Infer home details (townhome vs. single-family, approximate size) from address and notes
- Draft friendly estimate copies with one-time and recurring options
- Generate crew-friendly natural-language run sheets from sequenced stop data

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test inquiry for a local address with 3 bedrooms noted
2. Verify Claude infers home type and applies correct pricing tier
3. Confirm estimate email and SMS arrive within 3 minutes
4. Load 15 test jobs across the area and trigger route planning
5. Verify each crew lead receives a distinct SMS with their stop sequence
6. Simulate cancellation and verify updated crew route SMS fires
