# Law Firms — Client Intake & After-Hours Triage Automation

## What It Does
Two-part workflow: (1) New prospective clients complete a smart intake form. Claude produces a digestible case summary and identifies key legal issues. An automated conflict check runs immediately; if clear, the matter is assigned to the appropriate partner and a preliminary response email is sent—cutting intake time from hours to under 30 minutes. (2) When calls go unanswered after hours, an automatic SMS fires within 60 seconds asking for a brief description and urgency level. Claude classifies the response and forwards genuine emergencies to on-call attorneys while routing routine matters to the next-day intake queue.

**Market context**: Business litigation and corporate firms handle new matters via phone and email with staff manually capturing details—delaying responsiveness and losing clients who contact multiple firms simultaneously. Manual intake response takes 4–24 hours; automated is under 30 minutes. After-hours calls represent 20–30% of total volume. Without same-evening response, conversion is ~5%; with it, ~48%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for case summaries, urgency classification
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — matter records, morning intake queue
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — prospect acknowledgment, partner notification
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — after-hours SMS, attorney alerts
- `GOOGLE_SERVICE_ACCOUNT_JSON` — conflict check integration

## n8n Workflow Nodes

### Flow 1: Client Intake Automation

1. **Webhook Trigger: Intake Form** (`n8n-nodes-base.webhook`)
   - Receives: name, email, phone, company, matter_type, description, urgency, opposing_party

2. **Claude: Summarize Matter + Flag Issues** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Summarize in attorney-friendly language highlighting key facts, urgency signals, and relevant legal area
   - Flag potential issues or missing information

3. **HTTP Request: Run Conflict Check** (`n8n-nodes-base.httpRequest`)
   - Check opposing_party and company against firm's conflict database

4. **IF: Conflict Clear** (`n8n-nodes-base.if`)
   - Clear → create matter and assign
   - Conflict → flag for manual review, do not assign

5. **Airtable: Create Matter Record** (`n8n-nodes-base.airtable`)
   - Record: matter_name, client, type, summary, assigned_partner, status

6. **Mailgun: Acknowledge to Prospect** (`n8n-nodes-base.httpRequest`)
   - "Thank you for contacting {{firm_name}}. We've reviewed your inquiry and {{partner_name}} will be in touch shortly."

7. **Mailgun: Notify Partner** (`n8n-nodes-base.httpRequest`)
   - Internal email with Claude summary, conflict check result, and client contact

### Flow 2: After-Hours Call Capture & Triage

8. **Webhook Trigger: Missed Call** (`n8n-nodes-base.webhook`)
   - Receives: caller_phone, call_time, after_hours = true

9. **Twilio: After-Hours SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi, you've reached {{firm_name}} after hours. Please briefly describe your matter and rate urgency (URGENT/ROUTINE) and we'll get back to you. For emergencies, reply URGENT now."

10. **Webhook Trigger: SMS Reply** (`n8n-nodes-base.webhook`)
    - Receives: caller_phone, message_body

11. **Claude: Classify Urgency** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Classify: active dispute/injunction/regulatory deadline → Emergency
    - General inquiry/consultation → Routine

12. **IF: Urgent Matter** (`n8n-nodes-base.if`)
    - Urgent → alert on-call attorney immediately
    - Routine → queue for morning intake

13. **Twilio: Alert On-Call Attorney** (`n8n-nodes-base.httpRequest`)
    - "URGENT after-hours inquiry from {{phone}}. Summary: {{classification}}. Call back within 15 minutes."

14. **Airtable: Queue for Morning Intake** (`n8n-nodes-base.airtable`)
    - Store: caller_phone, message, urgency, classified_by, queued_time
    - Ready for attorney review at start of business day

## Claude AI Tasks
- Summarize matters in attorney-friendly language highlighting key facts and urgency signals
- Flag potential issues or missing information from intake form
- Classify urgency of after-hours inquiries (active dispute, injunction, regulatory deadline vs. general inquiry)
- Draft morning intake summaries so attorneys start each day prepared

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test intake form for a business dispute
2. Verify Claude summary identifies the correct practice area and key facts
3. Confirm conflict check runs and IF branch routes correctly
4. Check that prospect acknowledgment and partner notification both arrive
5. Simulate a missed call webhook from a test number
6. Verify after-hours SMS arrives within 60 seconds
7. Reply with an urgent scenario and confirm on-call attorney SMS fires
8. Reply with a routine matter and confirm it routes to morning queue in Airtable
