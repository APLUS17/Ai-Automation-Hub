# Coworking & Flex Spaces — Tour Requests & Membership Conversion

## What It Does
Logs tour inquiries with use case, team size, and suburb context. After each tour, Claude writes a tailored recap and membership recommendation matching the prospect's stated needs to specific plans. Automated follow-ups track conversion through sign-up, and prospects who go cold trigger a re-engagement message before they disappear.

**Market context**: Coworking spaces invest in giving tours but many prospects go cold afterward because follow-up is manual and generic. By the time a community manager remembers to check in, the prospect has signed a lease at a competitor or returned to working from home. Tour-to-membership conversion without follow-up is ~20%; with automated personalized sequences it rises to ~38%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for personalized follow-up and plan recommendations
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — prospect records and conversion tracking
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — re-engagement SMS
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — post-tour recap emails

## n8n Workflow Nodes

### Flow 1: Tour Request Intake

1. **Webhook Trigger: Tour Request** (`n8n-nodes-base.webhook`)
   - Receives: name, email, phone, company, team_size, use_case, preferred_date, suburb

2. **Airtable: Log Prospect** (`n8n-nodes-base.airtable`)
   - Table: "Prospects", status = "Tour Requested"

### Flow 2: Post-Tour Follow-Up

3. **Webhook Trigger: Tour Complete** (`n8n-nodes-base.webhook`)
   - Fired by staff after tour: prospect_id, tour_notes, plans_shown, budget_mentioned

4. **Claude: Draft Personalized Follow-Up** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Prompt: "Write a post-tour follow-up email for {{name}} from {{company}} (team of {{team_size}}). Use case: {{use_case}}. Tour notes: {{tour_notes}}. Recommend 1–2 specific membership plans with rationale. Tone: professional but warm."

5. **Mailgun: Send Tour Recap + Recommendation** (`n8n-nodes-base.httpRequest`)
   - Personalized email with plan comparison and scheduling CTA

6. **Wait: 3 Days** (`n8n-nodes-base.wait`)
   - Allow time for prospect decision

7. **IF: Signed Up** (`n8n-nodes-base.if`)
   - YES → welcome sequence
   - NO → re-engagement

8. **Twilio: Re-Engagement SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, we'd love to welcome your team to {{space_name}}! Reply here to discuss your options or schedule another visit."

9. **Airtable: Update Conversion Status** (`n8n-nodes-base.airtable`)
   - Track: last_touchpoint, response_status, conversion_outcome

## Claude AI Tasks
- Write personalized post-tour email referencing the prospect's stated use case, team size, and budget
- Recommend 1–2 specific membership plans with rationale based on tour conversation notes

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test tour request with prospect details (team of 5, use case: "hybrid office")
2. Mark tour complete and verify Claude follow-up email arrives with correct plan recommendation
3. Simulate 3-day no response and confirm re-engagement SMS fires
4. Mark as signed up and verify workflow exits correctly with Airtable status updated
