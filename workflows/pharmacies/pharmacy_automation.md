# Independent Pharmacies — Refill Sync & Prior Authorization Automation

## What It Does
Two-part workflow: (1) Identifies patients with multiple chronic medications and proposes single-day pickup schedules aligning all refills into one monthly visit. Automated SMS reminders go out before the sync date. Staff call volume drops as patients stop calling about individual refills. (2) Logs each prior authorization case with payer, drug, and key dates. n8n tracks request and response stages, sends automated status updates to prescribers and patients, and flags any authorization that has gone silent past expected response times.

**Market context**: Independent pharmacies manually coordinate multiple refills per patient across different fill dates—patients call repeatedly, staff spend hours on phone tag, and adherence suffers. Med sync reduces staff calls by ~40% and improves adherence by +22%. Prior auth turnaround averages 7–14 days manually; tracked systems reduce delays by ~35% and improve prescriber satisfaction by +40%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for sync notifications and PA status drafting
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS reminders and status updates
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — sync schedules, PA case tracking
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — prescriber notifications, patient emails

## n8n Workflow Nodes

### Flow 1: Refill Synchronization & Adherence

1. **Schedule Trigger: Daily Check** (`n8n-nodes-base.scheduleTrigger`)
   - Daily at 7am — check for upcoming sync dates and new candidates

2. **HTTP Request: Query Pharmacy System** (`n8n-nodes-base.httpRequest`)
   - Pull patient medication lists with fill dates from PMS API

3. **Code: Calculate Sync Date** (`n8n-nodes-base.code`)
   - For each multi-med patient, calculate optimal single-day sync date
   - Factor in days supply, last fill date, and insurance fill windows

4. **Claude: Draft Sync Notification** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - "Write a patient-friendly message for {{patient_name}} explaining that their {{medication_count}} medications can be picked up on one day each month ({{sync_date}}). Explain the convenience benefit. Flag if complex regimen needs pharmacist review."

5. **Twilio: Send Sync SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, your prescriptions are ready for pickup on {{sync_date}}. All {{count}} medications in one trip! Questions? Call us: {{pharmacy_phone}}"

6. **Airtable: Log Sync Schedule** (`n8n-nodes-base.airtable`)
   - Record: patient_id, sync_date, medications[], status

### Flow 2: Prior Authorization & Paperwork

7. **Webhook Trigger: New PA Case** (`n8n-nodes-base.webhook`)
   - Receives: patient_id, drug_name, payer, prescriber, submission_date

8. **Airtable: Create PA Record** (`n8n-nodes-base.airtable`)
   - Table: "Prior Authorizations", status = "Submitted"

9. **Schedule Trigger: Daily Status Check** (`n8n-nodes-base.scheduleTrigger`)
   - Check for open PA cases past expected response window

10. **Airtable: Query Open PA Cases** (`n8n-nodes-base.airtable`)
    - Filter: status != "Approved" AND status != "Denied"

11. **IF: Past Expected Response Window** (`n8n-nodes-base.if`)
    - Commercial payers: 5 business days
    - Medicaid/Medicare: 7 business days

12. **Claude: Draft Status Summary** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - For prescriber: "PA for {{drug}} submitted {{date}} to {{payer}}. Status: {{status}}. {{days}} days outstanding. Recommended escalation: {{action}}."
    - For patient: "Your {{drug}} authorization is being processed by {{payer}}. We're following up to speed this along."

13. **Mailgun: Notify Prescriber** (`n8n-nodes-base.httpRequest`)
    - Status update with escalation recommendations

14. **Twilio: Patient Status SMS** (`n8n-nodes-base.httpRequest`)
    - Plain-language status update

## Claude AI Tasks
- Generate patient-friendly notifications explaining single-day pickup benefits
- Flag patients with complex regimens where clinical pharmacist review is needed
- Draft plain-language status updates for prescribers and patients at each PA stage
- Summarize overdue PA cases with payer name, days outstanding, and escalation steps

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Load 3 test patients with multiple refills on different dates
2. Trigger the daily schedule and verify sync dates are calculated correctly
3. Confirm SMS notifications sent with the proposed sync date and benefit explanation
4. Submit a test PA case webhook with payer, drug, and prescriber details
5. Verify Airtable record created with all required fields
6. Trigger daily check and confirm overdue case is flagged after simulated delay
7. Verify prescriber email and patient SMS arrive with correct status
