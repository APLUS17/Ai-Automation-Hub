# Pest Control — Route & Reactivation Automation

## What It Does
Two-part workflow: (1) Pulls scheduled jobs from CRM, uses Google Maps to compute travel times, and Claude assigns optimized stop sequences per technician. Technicians receive SMS run sheets with live map links. Same-day changes trigger automatic route rebalancing. (2) Queries customers whose last treatment was 90/180/365 days ago. Claude drafts reactivation messages customized by suburb and pest type. When jobs close, a feedback SMS triggers Google Review requests for positive ratings and manager alerts for negative ones.

**Market context**: Pest control operators planning routes manually suffer higher fuel costs and fewer stops. Optimized routing enables 2–3 extra stops/day and reduces fuel costs by 15–25%. Lapsed anniversary reminders recover +22% of customer accounts. Feedback prompts increase Google reviews from ~8% to ~32%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for route optimization, reactivation drafts, and review request writing
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — customer database, route plans
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS run sheets, feedback, and reviews
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — educational emails, low rating manager alerts

## n8n Workflow Nodes

### Flow 1: Route & Service Coordination

1. **Schedule Trigger: Daily AM** (`n8n-nodes-base.scheduleTrigger`)
   - Daily at 6:30am

2. **Airtable: Get Tomorrow's Jobs** (`n8n-nodes-base.airtable`)
   - Retrieve address, contact, and job type for scheduled stops

3. **HTTP Request: Google Maps Distance Matrix** (`n8n-nodes-base.httpRequest`)
   - Compute travel matrix between stops

4. **Claude: Assign Optimized Routes** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Sequence stops per technician to minimize drive time and honor priority time windows

5. **Airtable: Write Route Plans** (`n8n-nodes-base.airtable`)
   - Save sequences and start times

6. **Twilio: SMS Run Sheet to Each Tech** (`n8n-nodes-base.httpRequest`)
   - Send driver stop lists and map links: "Stop 1: 123 Main St (8am) -> Stop 2: 456 Oak Ave (9am)..."

7. **Webhook Trigger: Same-Day Change** (`n8n-nodes-base.webhook`)
   - Cancels or new urgent additions

8. **Claude: Rebalance Affected Routes** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Recalculate remaining stops and rebalance

9. **Twilio: Push Updated Schedule** (`n8n-nodes-base.httpRequest`)
   - SMS tech with schedule changes

### Flow 2: Follow-Up Reactivation & Reviews

10. **Schedule Trigger: Weekly** (`n8n-nodes-base.scheduleTrigger`)
    - Weekly on Wednesdays

11. **Airtable: Query Lapsed Customers** (`n8n-nodes-base.airtable`)
    - Last treatment 90, 180, or 365 days ago

12. **Claude: Draft Reactivation Message** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Write SMS/email customized by suburb, pest type, and seasonal risk: "Spring is here and ants are active in {{suburb}}..."

13. **Twilio: Reactivation SMS** (`n8n-nodes-base.httpRequest`)
    - Send reactivation message with booking link

14. **Mailgun: Educational Follow-Up Email** (`n8n-nodes-base.httpRequest`)
    - Send pest prevention tips and booking CTA

15. **Webhook Trigger: Job Closed** (`n8n-nodes-base.webhook`)
    - Technician completes job

16. **Twilio: Feedback SMS** (`n8n-nodes-base.httpRequest`)
    - Ask for a 1–5 star rating reply

17. **IF: Rating 4–5 Stars** (`n8n-nodes-base.if`)
    - Positive → request Google review
    - Negative → escalate to manager

18. **Claude: Draft Review Request** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Personal review request copy referencing technician name

19. **Twilio: Send Review Link** (`n8n-nodes-base.httpRequest`)
    - SMS review link to patient

20. **Mailgun: Route Low Rating to Manager** (`n8n-nodes-base.httpRequest`)
    - Send alert with customer details and rating feedback

## Claude AI Tasks
- Assign optimized stop sequences per technician respecting time windows and service durations
- Draft localized reactivation messages referencing suburb, pest type, and seasonal context
- Write city-specific review request copy referencing technician performance

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Load 12 test stops with addresses and time windows into Airtable
2. Trigger the AM schedule and verify Google Maps API call succeeds
3. Confirm Claude produces routes with no time-window violations
4. Simulate job close webhook, reply with 5 stars, confirm review link sent
5. Reply with 2 stars and verify manager alert email fires
