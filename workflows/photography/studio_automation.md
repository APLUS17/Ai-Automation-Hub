# Photography & Video Studios — Lead Pipeline & Shoot Delivery Automation

## What It Does
Incoming inquiries from email, DMs, and referrals feed into n8n. Claude identifies event type, date, location, and budget signals, suggesting 1–2 packages with an auto-reply and booking link. When gallery publishing completes post-shoot, n8n emails the gallery link. A few days later, Claude drafts a personalized review request referencing the event location and type.

**Market context**: Studios receive inquiries across multiple platforms but respond hours or days later. Gallery delivery is rarely followed up for reviews, leaving word-of-mouth revenue on the table. Inquiries responded to within an hour convert at +40%. Automated prompts generate 4× more reviews.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for inquiry classification and review request drafting
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — lead pipeline and booking logs
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — proposal replies and gallery delivery emails
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — review request SMS

## n8n Workflow Nodes

1. **Gmail Trigger** (`n8n-nodes-base.gmailTrigger`)
   - Watch for email inquiries containing wedding, portrait, or shoot keywords

2. **Claude: Classify Inquiry + Suggest Package** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Identify: event type, date, location, budget signals
   - Recommend matching packages (e.g. Bronze/Silver/Gold)

3. **Airtable: Log Lead** (`n8n-nodes-base.airtable`)
   - Log customer details, date preference, package options, and status = "Inquiry"

4. **Mailgun: Send Proposal Reply** (`n8n-nodes-base.httpRequest`)
   - Warm email proposing consult times and highlighting recommended packages

5. **Webhook Trigger: Gallery Published** (`n8n-nodes-base.webhook`)
   - Fired by gallery software (e.g., Pixieset, Pic-Time) when photos are ready

6. **Mailgun: Gallery Delivery Email** (`n8n-nodes-base.httpRequest`)
   - Send gallery link and download instructions to client

7. **Wait: 4 Days** (`n8n-nodes-base.wait`)
   - Let client enjoy their photos first

8. **Claude: Draft Review Request** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Draft location-specific review request copy: "Hi {{name}}, we loved shooting your wedding at {{venue}}..."

9. **Twilio: Review Request SMS** (`n8n-nodes-base.httpRequest`)
   - Send review link to patient's/client's phone

## Claude AI Tasks
- Identify event type, date preference, location, and budget signals from raw inquiries
- Suggest appropriate packages based on extracted criteria
- Draft warm, location-specific review requests referencing shoot details

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Send a test inquiry email for a Mason wedding in June
2. Verify Claude suggests 1–2 packages with correct pricing
3. Trigger gallery published webhook and confirm delivery email arrives
4. Simulate 4-day wait and confirm review request SMS fires
