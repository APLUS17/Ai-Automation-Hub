# Online Coaching — Dead Lead Reactivation

## What It Does
Pulls closed-lost or unresponsive contacts from GHL, generates Claude-personalized re-engagement messages based on their history, and sends a 7-day email + SMS drip. If a lead engages (opens/clicks), triggers a human handoff alert.

## Integrations Required
- `GHL_API_KEY`, `GHL_LOCATION_ID` (contact source)
- `ANTHROPIC_API_KEY` (personalized message generation)
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` (email drip)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` (SMS day 5)
- `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` (human handoff alert)

## n8n Workflow Nodes

1. **Schedule Trigger** (`n8n-nodes-base.scheduleTrigger`)
   - Every Monday 9am

2. **HTTP Request: GHL Contacts** (`n8n-nodes-base.httpRequest`)
   - GET `https://rest.gohighlevel.com/v1/contacts/?locationId={{GHL_LOCATION_ID}}&tag=closed-lost`
   - Filter: last updated > 30 days ago

3. **Split In Batches** (`n8n-nodes-base.splitInBatches`)
   - batch size: 1

4. **HTTP Request: Claude Personalize** (via OpenRouter)
   - Prompt: "Write a 2-sentence re-engagement email for this coaching prospect. Don't be pushy. Reference their interest in [program]. Contact: {{name}}, last touchpoint: {{last_note}}. Return subject and body."
   - Parse: `{subject, body}`

5. **Mailgun: Send Email Day 1** (`n8n-nodes-base.httpRequest`)
   - POST to Mailgun with personalized subject + body
   - Track opens/clicks (Mailgun tracking enabled)

6. **GHL: Tag as "Reactivation Sequence"** (`n8n-nodes-base.httpRequest`)
   - PATCH contact → add tag `reactivation-day1`

7. **Wait 2 Days** (`n8n-nodes-base.wait`)

8. **Mailgun: Email Day 3** — value-add content (free resource, case study)

9. **Wait 2 Days** (`n8n-nodes-base.wait`)

10. **Twilio: SMS Day 5** (`n8n-nodes-base.twilio`)
    - "Hey {{first_name}}, just checking in! I sent you a couple of emails — would love to reconnect. Would 15 mins this week work? — [Coach Name]"

11. **Webhook: Mailgun Open/Click Callback**
    - Separate workflow triggered by Mailgun webhook
    - IF clicked → Slack alert: "🔥 {{name}} clicked the reactivation email — follow up now!"
    - GHL: update stage to "Re-engaged"

## Claude AI Tasks
- Personalized message generation (step 4) using contact name, program interest, last touchpoint

## Python Tools Needed
- `ghl_crm.py --action inactive --days 30` — pull inactive contacts for testing
- `mailgun_email.py --action send` — test email delivery
- `twilio_sms.py --action send` — test SMS

## Test Plan
1. `python tools/ghl_crm.py test` → verify GHL connection
2. Add yourself as a test contact tagged "closed-lost" in GHL
3. Trigger workflow manually — verify email arrives with personalized copy
4. Open the email — verify Slack fires "follow up now" alert
5. Verify GHL contact stage updated to "Re-engaged"
