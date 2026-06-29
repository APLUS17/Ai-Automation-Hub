# Outpatient Therapy Clinics — Referral & Documentation Automation

## What It Does
Two-part workflow: (1) Captures all referrals from fax, email, and HL7. Claude extracts patient details, diagnosis, therapy type, and referring provider. n8n runs eligibility checks and sends a combined message: "We received your referral and here is what your coverage looks like" along with a booking link, reducing contact time to under 24 hours. (2) After each session, clinicians answer guided prompts. n8n compiles these inputs and Claude assembles progress notes and outcome summaries at care milestones (every 4–6 visits) for physicians and payers.

**Market context**: PT, OT, and counseling clinics receive referrals via fax and email, manually checking insurance eligibility before scheduling—a process taking 3–7 days that results in a ~35% no-show rate for slow contact. Automated intake reduces response time to under 24 hours. Additionally, therapists spend 1.5–2 hours/day on documentation. AI-assisted notes reduce documentation time by ~50% and alleviate clinician burnout.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for referral extraction, coverage translation, and note assembly
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — referral tracking, session notes
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — patient scheduling SMS
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — patient welcome emails, progress note delivery to physicians

## n8n Workflow Nodes

### Flow 1: Referral Intake & Benefits Check

1. **Gmail Trigger** (`n8n-nodes-base.gmailTrigger`)
   - Watch for referral emails/faxes matching sender rules

2. **Claude: Extract Referral Details** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Parse unstructured fax text for: patient name, DOB, insurance provider, policy ID, diagnosis, referring physician

3. **HTTP Request: Insurance Eligibility Check** (`n8n-nodes-base.httpRequest`)
   - Send details to clearinghouse/payer eligibility API

4. **Code: Parse Coverage Response** (`n8n-nodes-base.code`)
   - Extract deductible, out-of-pocket met, and co-payment details

5. **Airtable: Create Referral Record** (`n8n-nodes-base.airtable`)
   - Log referral with eligibility info and status = "Verified"

6. **Mailgun: Patient Welcome + Coverage** (`n8n-nodes-base.httpRequest`)
   - Send welcome email explaining insurance benefits in plain language

7. **Twilio: Patient Scheduling SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, we received your referral for {{therapy_type}}! Click to choose a slot: {{link}}"

### Flow 2: Progress Note & Outcome Summaries

8. **Webhook Trigger: Post-Session Prompts** (`n8n-nodes-base.webhook`)
   - Receives clinician inputs: treatment_administered, progress_observed, patient_feedback, adjustments

9. **Airtable: Store Session Notes** (`n8n-nodes-base.airtable`)
   - Save raw notes under patient ID

10. **Code: Check Milestone Visit Count** (`n8n-nodes-base.code`)
    - Count completed sessions in current plan of care

11. **IF: Milestone Reached** (`n8n-nodes-base.if`)
    - Yes (e.g. visit 4, 8, 12) → trigger progress note drafting
    - No → log only

12. **Claude: Assemble Progress Summary** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Summarize session inputs, functional goals met, and remaining limitations in standard SOAP or therapy format

13. **Google Docs: Generate Report** (`n8n-nodes-base.googleDocs`)
    - Create formatted document from milestone summary

14. **Mailgun: Send to Physician + Payer** (`n8n-nodes-base.httpRequest`)
    - Deliver progress note PDF to referring doctor for signature

## Claude AI Tasks
- Extract patient details and diagnosis from unstructured fax/email referrals
- Translate raw eligibility JSON into patient-friendly plain language coverage summaries
- Convert session prompt responses into structured SOAP progress notes
- Assemble milestone progress summaries for physician and payer review

## Python Tools Needed
- `google_docs_pdf.py` — export progress reports as PDFs before secure delivery to physicians

## Test Plan
1. Send a test referral email with patient name, diagnosis, and insurance ID
2. Verify Claude extracts all fields correctly
3. Confirm eligibility check runs and patient email/SMS arrive with coverage details
4. Submit post-session prompts for 6 visits for a test patient
5. Verify milestone check triggers and Claude summary is generated
6. Confirm email to physician arrives with PDF report attached
