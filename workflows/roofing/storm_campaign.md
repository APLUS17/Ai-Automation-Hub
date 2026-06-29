# Roofing Contractors — Storm Campaign & Canvass Follow-Up

## What It Does
Two-part workflow: (1) Monitors weather feeds for hail/high winds. When thresholds are exceeded in a ZIP code, n8n queries CRM for homeowners in impacted areas. Claude drafts storm-alert emails. Campaigns fire within 24 hours with an inspection link. (2) Imports canvassing lists. Sends personalized SMS referencing the door-knocking conversation and offering an inspection slot, sending day-of reminders to prevent no-shows.

**Market context**: Roofing companies reactively wait for calls after storms. Competitors who reach out within 24 hours book inspection slots first. Storm inspections won increase by +45% via automated 24h outreach. In neighborhood door-knocking, canvass lead conversion rises from ~8% to ~22% with automated SMS follow-ups.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for storm campaigns and canvass SMS personalization
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — customer database, canvass leads
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — storm campaign emails, inspection schedules
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — storm SMS alerts, canvass SMS, reminders

## n8n Workflow Nodes

### Flow 1: Storm-Triggered Outreach Campaign

1. **Schedule Trigger: Weather Check** (`n8n-nodes-base.scheduleTrigger`)
   - Checks every 3 hours during storm season

2. **HTTP Request: Weather API** (`n8n-nodes-base.httpRequest`)
   - Fetch severe weather alerts, hail reports, or wind speed by ZIP code

3. **IF: Storm Threshold Exceeded** (`n8n-nodes-base.if`)
   - Wind > 50 mph or Hail > 0.75 inches → trigger campaign
   - Below threshold → exit

4. **Airtable: Get Homeowners in Affected ZIPs** (`n8n-nodes-base.airtable`)
   - Query homeowners in the database residing in the flagged ZIP codes

5. **Claude: Draft Storm Campaign Email** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Draft personalized storm outreach email referencing storm date, local subdivision name, and common damage indicators: "A severe hail storm hit {{neighborhood}} on {{date}}..."

6. **Mailgun: Send Campaign** (`n8n-nodes-base.httpRequest`)
   - Send campaign to all matching homeowners with scheduling link

7. **Twilio: Storm Alert SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, we detected severe weather in your area yesterday. Click here to schedule a free roof inspection: {{link}}"

### Flow 2: Canvass Lead Follow-Up Engine

8. **Webhook Trigger: Canvass List Import** (`n8n-nodes-base.webhook`)
   - Import canvassing logs from door-knocking app

9. **Airtable: Store Canvass Leads** (`n8n-nodes-base.airtable`)
   - Save contacts, address, notes, and status = "Knocked"

10. **Claude: Draft Personalized Follow-Up SMS** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - "Write a personalized follow-up SMS for {{name}}. Reference door-knocking notes: {{notes}}. Propose a roof inspection slot on {{day}}."

11. **Twilio: Send Follow-Up SMS** (`n8n-nodes-base.httpRequest`)
    - Send personalized invitation text

12. **Webhook Trigger: Reply Received** (`n8n-nodes-base.webhook`)
    - Customer replies to SMS

13. **IF: Inspection Confirmed** (`n8n-nodes-base.if`)
    - Confirmed → log inspection slot
    - Not confirmed → route to manual follow-up list

14. **Airtable: Log Confirmed Inspection** (`n8n-nodes-base.airtable`)
    - Status = "Inspection Scheduled"

15. **Twilio: Day-Of Reminder SMS** (`n8n-nodes-base.httpRequest`)
    - Send reminder 2 hours before the inspector arrives

## Claude AI Tasks
- Draft storm outreach emails referencing specific subdivision, storm dates, and damage indicators
- Adjust campaign tone and urgency based on storm severity
- Draft personalized follow-up SMS messages referencing canvassing conversation notes
- Generate professional appointment confirmation and reminder messages

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Inject test weather response with hail over 0.75 inches in a target ZIP
2. Verify IF branch triggers, retrieving homeowners in that ZIP
3. Confirm Claude email references storm details and neighborhood
4. Import test canvass list with notes
5. Verify Claude drafts distinct SMS messages for each contact based on notes
6. Simulate "YES" reply, confirming booking and day-of reminder fires
