# Manufacturing Job Shops — RFQ Intake & Job Tracking Automation

## What It Does
Two-part workflow: (1) Centralizes incoming RFQs from email and procurement portals. Claude extracts quantities, tolerances, materials, and delivery expectations from text and PDFs, then feeds data into estimating calculators to produce draft quotes. Estimators receive pre-populated drafts—cutting response time from days to hours. (2) Generates digital traveler records when POs are released, tracks status via work center updates, and sends proactive customer updates when delay risk is detected.

**Market context**: Job shops receive 20–60 RFQs per month. Manual quoting takes 2–5 days; automated prep cuts it to under 4 hours. Shops that respond same-day win work over slower competitors. Paper traveler systems yield ~72% on-time delivery vs. ~88% with digital tracking, and managers spend 10–25 calls/week fielding "where's my order?" questions.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for RFQ parsing and delay explanations
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — quote records, traveler tracking
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — estimator notifications, customer updates
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — operator status SMS

## n8n Workflow Nodes

### Flow 1: RFQ Intake & Estimation Prep

1. **Gmail Trigger** (`n8n-nodes-base.gmailTrigger`)
   - Watch for RFQ emails (subject: "RFQ", "quote request", "pricing inquiry")

2. **Code: Extract Attachment Text** (`n8n-nodes-base.code`)
   - Parse PDF/DOCX attachments with CAD drawings and specs

3. **Claude: Parse RFQ Specs** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Extract: quantities, materials, tolerances, finish requirements, delivery expectations
   - Flag ambiguous specs requiring clarification

4. **Code: Apply Estimating Rules** (`n8n-nodes-base.code`)
   - Calculate machine time, material costs, setup charges from extracted specs
   - Apply shop-specific rate tables

5. **Airtable: Create Quote Record** (`n8n-nodes-base.airtable`)
   - Record: customer, specs, estimated_price, machine_hours, material_cost, status = "Draft"

6. **Mailgun: Notify Estimator** (`n8n-nodes-base.httpRequest`)
   - Email with extracted specs, draft pricing, and link to Airtable record

### Flow 2: Job Traveler & Status Updates

7. **Webhook Trigger: PO Released** (`n8n-nodes-base.webhook`)
   - Receives: PO_number, customer, parts, quantity, due_date, routing_steps

8. **Airtable: Create Traveler Record** (`n8n-nodes-base.airtable`)
   - Digital traveler with routing steps and due dates per work center

9. **Webhook Trigger: Work Center Update** (`n8n-nodes-base.webhook`)
   - Operators update via tablet: work_center, status, completion_time

10. **Airtable: Update Job Status** (`n8n-nodes-base.airtable`)
    - Update routing step status, calculate remaining steps and time

11. **IF: Delay Risk Detected** (`n8n-nodes-base.if`)
    - Behind schedule → proactive customer notification
    - On track → no action

12. **Mailgun: Proactive Customer Update** (`n8n-nodes-base.httpRequest`)
    - "Your order {{PO_number}} for {{part}} is currently at {{work_center}} and may ship {{revised_date}}. We'll keep you updated."

## Claude AI Tasks
- Extract quantities, materials, tolerances, finish requirements, and delivery expectations from RFQ documents
- Identify ambiguous specs requiring clarification before accurate estimation
- Generate customer-facing delay explanations in professional language when delay flags trigger

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Send a test RFQ email with a PDF describing a machined part
2. Verify Claude extracts material, quantity, tolerance, and deadline correctly
3. Check Airtable for new quote record with populated fields
4. Confirm estimator notification email arrives with extracted specs
5. Submit a test PO webhook and verify traveler record created with routing steps
6. Update status at two work centers and confirm Airtable reflects changes
7. Create a delay condition and verify customer notification email fires
