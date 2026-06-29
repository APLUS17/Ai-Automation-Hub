# Water Damage / Remodeling — Upsell Automation

## What It Does
When a job is marked complete, a 2-week SMS/email drip launches with personalized upsell offers (mold prevention, waterproofing, etc.). If the client clicks, they're routed to a booking page and the sales rep is notified.

## Integrations Required
- `ANTHROPIC_API_KEY` — personalized upsell message generation
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS drip
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — email drip
- `SLACK_BOT_TOKEN` — sales rep alert on click

## n8n Workflow Nodes

1. **Webhook Trigger** — job management system fires "job_completed" event
   - Fields: job_id, customer_name, customer_email, customer_phone, damage_type, address

2. **HTTP Request: Claude Upsell Message** (OpenRouter)
   - Prompt: "Write a friendly, non-pushy upsell SMS (under 160 chars) offering mold prevention services to a homeowner who just had {{damage_type}} remediation. Mention their specific situation. Customer: {{customer_name}}, Job: {{damage_type}} at {{address}}."
   - Also generate: email subject, email body (3 short paragraphs)

3. **Wait 3 Days** (`n8n-nodes-base.wait`)

4. **Twilio: Day 3 SMS** (`n8n-nodes-base.twilio`)
   - Claude-generated SMS message

5. **Wait 4 Days** (`n8n-nodes-base.wait`)

6. **Mailgun: Day 7 Email** — "Protecting your home from future water damage"
   - Include: what mold prevention covers, before/after stats, CTA button → booking page

7. **Wait 7 Days** (`n8n-nodes-base.wait`)

8. **Twilio: Day 14 Final SMS**
   - "Last reminder — our water damage protection offer expires this week. Book here: {{BOOKING_LINK}}"

### Flow 2: Click/Booking Webhook

9. **Webhook Trigger** — Mailgun click callback OR Cal.com booking created

10. **Slack: Sales Rep Alert** (`n8n-nodes-base.slack`)
    - "🔥 {{customer_name}} clicked the upsell email! Call them now: {{phone}}"

11. **Gmail: Send Booking Confirmation** to customer

## Claude AI Tasks
- Personalized upsell SMS + email generation at job completion (step 2)

## Python Tools Needed
- `twilio_sms.py` — test SMS delivery
- `mailgun_email.py` — test email + click tracking

## Test Plan
1. POST a fake job_completed event with damage_type = "water infiltration"
2. Check n8n — Claude should generate a relevant mold prevention message
3. Verify SMS sent (to test number), email queued
4. Simulate a Mailgun click webhook — verify Slack fires sales rep alert
