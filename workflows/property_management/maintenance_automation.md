# Property Management — Maintenance & Vacancy Automation

## What It Does
Two-part workflow: (1) All tenant maintenance messages funnel into one queue. Claude extracts unit, issue type, and urgency level. High-urgency cases alert managers via SMS instantly. Lower-urgency tasks route to the appropriate vendor list. (2) When a move-out is scheduled, listings are automatically published to Zillow and Apartments.com. Inquiries flow into a single Airtable applicant pipeline, and Claude generates applicant summaries covering income signals, pet status, and risk factors.

**Market context**: Small-to-mid-size property managers handle maintenance and vacancy tracking manually, slowing response times and leaving units empty. Automated dispatch cuts maintenance response times from 1–3 days to under 2 hours, boosting tenant retention. consoles consolidating vacancy inquiries reduce vacancy periods from 21–35 days to 10–15 days, saving $40–$120/day in lost rent.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for maintenance triage and applicant summary generation
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — work orders, tenant logs, applicant pipeline
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — emergency SMS alerts, tenant updates
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — vendor assignments, tenant notifications

## n8n Workflow Nodes

### Flow 1: Maintenance Request Intake & Dispatch

1. **Gmail Trigger** (`n8n-nodes-base.gmailTrigger`)
   - Watch for tenant emails (subject keywords: "repair", "leak", "broken", "maintenance")

2. **Claude: Extract Issue + Assign Urgency** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Parse email for: unit number, issue description, safety/property damage flags
   - Assign urgency: Emergency (active water leak, no heat in winter) or Routine (minor drywall repair, lightbulb)

3. **IF: Emergency** (`n8n-nodes-base.if`)
   - Emergency → page manager
   - Routine → assign vendor and schedule

4. **Twilio: Emergency Alert to Manager** (`n8n-nodes-base.httpRequest`)
   - SMS page: "EMERGENCY: Unit {{unit}} reports {{issue}}. Dispatching immediately."

5. **Airtable: Create Work Order** (`n8n-nodes-base.airtable`)
   - Log work order with details, urgency, and assigned vendor

6. **Mailgun: Assign to Vendor** (`n8n-nodes-base.httpRequest`)
   - Send work order details and tenant contact info to plumber/electrician

7. **Twilio: Tenant Acknowledgment SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi, we logged your request for {{issue}}. Vendor {{vendor}} will contact you shortly."

8. **Webhook Trigger: Job Complete** (`n8n-nodes-base.webhook`)
   - Fired by vendor when job is completed

9. **Twilio: Tenant Completion SMS** (`n8n-nodes-base.httpRequest`)
   - Confirm completion and ask for feedback

### Flow 2: Vacancy Marketing & Applicant Tracking

10. **Webhook Trigger: Move-Out Scheduled** (`n8n-nodes-base.webhook`)
    - Move-out logged in PMS

11. **HTTP Request: Publish to Zillow** (`n8n-nodes-base.httpRequest`)
    - POST rental listing info to Zillow Syndicate API

12. **HTTP Request: Publish to Apartments.com** (`n8n-nodes-base.httpRequest`)
    - POST listing info to Apartments.com API

13. **Webhook Trigger: New Inquiry** (`n8n-nodes-base.webhook`)
    - Tenant inquires on Zillow/Apartments.com

14. **Airtable: Create Applicant Record** (`n8n-nodes-base.airtable`)
    - Create record with applicant contact and source

15. **Claude: Generate Applicant Summary** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Parse inquiry text for: income signals, pet status, household size, move-in timing, risk factors

16. **Mailgun: Inquiry Acknowledgment** (`n8n-nodes-base.httpRequest`)
    - Auto-reply with landlord application link

## Claude AI Tasks
- Extract unit number, issue type, urgency, and safety flags from tenant messages
- Draft tenant acknowledgments and vendor work orders
- Summarize tenant applicant inquiries for income, household size, and pet status

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Send test maintenance email with "no hot water in unit 204"
2. Verify Claude extracts unit and issue, sending vendor alert
3. Trigger job complete webhook and confirm tenant completion SMS
4. Trigger move-out and verify vacancy listing published to Zillow
5. Submit test inquiry, verify applicant record created, and check Claude summary
