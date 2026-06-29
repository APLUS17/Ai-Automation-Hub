# Online Coaching — Sales Stack Automation

## What It Does
Intake form submission creates a CRM contact, triggers a 7-day GHL nurture sequence, confirms Cal.com bookings with AI-generated prep notes, and sends a post-call follow-up email from the call transcript.

## Integrations Required
- `GHL_API_KEY`, `GHL_LOCATION_ID` (CRM + sequences)
- `CALCOM_API_KEY` (booking confirmation + call data)
- `ANTHROPIC_API_KEY` (prep notes + follow-up from transcript)
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` (follow-up email)

## n8n Workflow Nodes

### Flow 1: Intake → CRM → Nurture

1. **Webhook Trigger** — intake form submits to n8n
   - Fields: name, email, phone, business_type, main_challenge, revenue_goal

2. **HTTP Request: GHL Create Contact** (`n8n-nodes-base.httpRequest`)
   - POST `/v1/contacts/` with form fields
   - Set pipeline stage: "New Inquiry"

3. **GHL: Add to Nurture Sequence** (`n8n-nodes-base.httpRequest`)
   - POST `/v1/contacts/{{contactId}}/campaigns/start`
   - Campaign: 7-day email/SMS nurture (pre-built in GHL)

4. **Gmail: Send Intake Confirmation** (`n8n-nodes-base.gmail`)
   - Subject: "Got it, {{first_name}} — here's what happens next"
   - Body: confirmation + calendar link for discovery call

### Flow 2: Cal.com Booking → Prep Notes

5. **Webhook Trigger** — Cal.com fires on booking created
   - Path: `/calcom-booking`

6. **HTTP Request: Claude Prep Notes** (OpenRouter)
   - Prompt: "Generate 5 discovery call prep notes for a coaching prospect. Name: {{name}}, Challenge: {{challenge}}, Revenue Goal: {{goal}}. Format as bullet points."

7. **Gmail: Send Prep Notes** to coach's inbox

### Flow 3: Post-Call Follow-Up

8. **Webhook Trigger** — fired manually or via Cal.com post-call webhook
   - Receive transcript text

9. **HTTP Request: Claude Follow-Up** (OpenRouter)
   - Prompt: "Based on this call transcript, write a warm follow-up email summarizing: 3 key pain points discussed, the proposed solution, and next steps. Keep it under 200 words."

10. **Gmail: Send Follow-Up** to prospect

11. **GHL: Move to "Follow-Up Sent"** stage

## Claude AI Tasks
- Prep notes generation before call (step 6)
- Follow-up email from transcript (step 9)

## Python Tools Needed
- `ghl_crm.py` — test contact creation + pipeline moves
- `claude_ai.py --action generate` — test prompt quality before deploying

## Test Plan
1. Submit a test intake form to the webhook URL
2. Verify GHL contact created + nurture sequence started
3. Book a test Cal.com appointment — verify prep notes email arrives
4. POST a fake transcript to the follow-up webhook — verify email sent + GHL stage updated
