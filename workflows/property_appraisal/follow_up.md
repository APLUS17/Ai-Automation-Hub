# Property Appraisal — Follow-Up Automation

## What It Does
New appraisal leads trigger a 3-email sequence over 7 days. No response by day 5 → SMS follow-up. GHL pipeline stages auto-update on opens/clicks. Post-appraisal completion → auto-request Google review via SMS.

## Integrations Required
- `GHL_API_KEY`, `GHL_LOCATION_ID` — pipeline management
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — email sequence
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS day 5

## n8n Workflow Nodes

### Flow 1: New Lead → Email Sequence

1. **Webhook Trigger** — new lead added to Google Sheet (via lead_gen workflow) OR manual trigger

2. **HTTP Request: GHL Create Contact** — add to CRM with tag `new-appraisal-lead`

3. **Mailgun: Email Day 1** (`n8n-nodes-base.httpRequest`)
   - Subject: "Quick question about your listing at {{address}}"
   - Body: intro, appraisal services, turnaround time, soft CTA
   - Track opens + clicks

4. **Wait 2 Days** (`n8n-nodes-base.wait`)

5. **Mailgun: Email Day 3** — case study or recent appraisal stats for their area

6. **Wait 2 Days** (`n8n-nodes-base.wait`)

7. **IF: Any Opens/Clicks?** (`n8n-nodes-base.if`)
   - Check Mailgun event log via API — True: skip SMS, human follow up
   - False: SMS on day 5

8. **Twilio: Day 5 SMS** (`n8n-nodes-base.twilio`)
   - "Hi {{agent_name}}, sent you a couple of emails about appraisal services for {{address}}. Do you need a quote? Reply YES or call me at [number]"

9. **Wait 2 Days** (`n8n-nodes-base.wait`)

10. **Mailgun: Day 7 Final Email** — "Last email, I promise..." — cleaner CTA

### Flow 2: GHL Pipeline Auto-Moves

11. **Webhook Trigger** — Mailgun open/click event webhook
    - Path: `/mailgun-events`

12. **HTTP Request: GHL Move Stage** — based on event type:
    - Opened → "Prospect Engaged"
    - Clicked → "Proposal Ready"

### Flow 3: Post-Appraisal Review Request

13. **Webhook Trigger** — appraisal marked "Delivered" in system

14. **Wait 24 Hours** (`n8n-nodes-base.wait`)

15. **Twilio: Review Request SMS**
    - "Hi {{client_name}}, thanks for choosing us for your appraisal at {{address}}! If you were happy with the service, a quick Google review would mean the world: [Google Maps review link]"

## Claude AI Tasks
- Optional: personalize each email with Claude based on property type + agent context

## Python Tools Needed
- `ghl_crm.py` — test contact creation + pipeline moves
- `twilio_sms.py` — test review request SMS
- `mailgun_email.py` — test sequence emails

## Test Plan
1. Add yourself as a test lead → verify day 1 email arrives
2. Don't open it → advance n8n time → verify day 5 SMS arrives
3. Open day 3 email → verify GHL contact moved to "Prospect Engaged"
4. Fire post-appraisal webhook → verify review request SMS sent next day
