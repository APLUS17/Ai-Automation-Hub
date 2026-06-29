# Moving & Storage Companies — Estimate & Post-Move Automation

## What It Does
Two-part workflow: (1) Prospects submit inventory details or answer structured questions about square footage, bedrooms, stairs, and special items. Claude infers truck size, crew count, and approximate duration, generating a tiered estimate sent via email and SMS—delivering a professional quote in 10 minutes without a phone call. (2) After move completion, a feedback SMS goes out asking for a rating. Positive responses receive a Google/BBB review link. Damage reports are summarized and routed to claims staff.

**Market context**: Homeowners comparison-shopping commit to the first company that sends a clear, professional estimate. Manual quoting takes 1–3 days; same-hour quotes improve conversion by +35%. Only ~8% of customers leave reviews unprompted; SMS prompts increase this to ~32%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for job scoping and review request drafting
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — lead tracking, outcome logging
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS estimates, review requests
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — detailed estimate emails, follow-up

## n8n Workflow Nodes

### Flow 1: Estimate Requests & Job Scoping

1. **Webhook Trigger: Estimate Form** (`n8n-nodes-base.webhook`)
   - Receives: name, email, phone, bedrooms, sq_ft, floors, stairs, special_items, move_date, origin_zip, destination_zip

2. **Claude: Scope Job + Generate Estimate** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Infer: truck_size, crew_count, estimated_hours, distance_factor
   - Generate: standard tier and premium tier pricing with inclusions

3. **Airtable: Create Lead Record** (`n8n-nodes-base.airtable`)
   - Record: customer, move_details, estimate, status = "Quoted"

4. **Mailgun: Email Estimate** (`n8n-nodes-base.httpRequest`)
   - Professional estimate with line-item breakdown

5. **Twilio: Estimate SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, your moving estimate is ready! Standard: ${{standard}} | Premium: ${{premium}}. Check your email for details or reply BOOK to reserve."

6. **Wait: 24 Hours** (`n8n-nodes-base.wait`)

7. **IF: Booked** (`n8n-nodes-base.if`)
   - YES → confirmation sequence
   - NO → follow-up email

8. **Mailgun: Follow-Up Email** (`n8n-nodes-base.httpRequest`)
   - "Still planning your move? We're holding your date..."

### Flow 2: Post-Move Follow-Up & Review

9. **Webhook Trigger: Move Complete** (`n8n-nodes-base.webhook`)
   - Fired when crew marks job done

10. **Twilio: Feedback SMS** (`n8n-nodes-base.httpRequest`)
    - "Hi {{name}}, how was your move? Rate 1–5 stars by replying with a number."

11. **Webhook Trigger: Rating Reply** (`n8n-nodes-base.webhook`)
    - Parse star rating from SMS reply

12. **IF: Rating 4–5 Stars** (`n8n-nodes-base.if`)
    - Positive → review request
    - Negative → route to claims/resolution

13. **Claude: Draft Review Request** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Location-specific review copy referencing the move details

14. **Twilio: Send Review Link** (`n8n-nodes-base.httpRequest`)
    - "Thank you! Would you take 30 seconds to share your experience? {{google_review_link}}"

15. **Mailgun: Route Claim to Staff** (`n8n-nodes-base.httpRequest`)
    - Structured damage summary for claims team

16. **Airtable: Log Outcome** (`n8n-nodes-base.airtable`)
    - Track: rating, review_submitted, claim_filed, crew_id, city

## Claude AI Tasks
- Infer truck size, crew count, and job duration from inventory details and home characteristics
- Draft tiered estimate copy (standard, premium) with clear inclusions
- Draft warm, location-specific review request copy
- Summarize damage reports in structured format for claims staff

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test estimate form for a 3-bedroom house with stairs and a piano
2. Verify Claude produces crew and truck size estimates
3. Confirm estimate email and SMS arrive within 2 minutes
4. Trigger a move complete webhook with test customer details
5. Verify feedback SMS arrives, reply with 5 stars, confirm review link sent
6. Reply with damage report and verify claims routing email fires
