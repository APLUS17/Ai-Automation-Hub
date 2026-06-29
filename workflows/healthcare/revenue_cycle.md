# Healthcare Revenue — Revenue Cycle Automation

## What It Does
Watches for new insurance claims (email or Drive upload), extracts fields using Claude, maps to billing codes, flags common errors, submits to clearinghouse queue, and tracks denial reasons in Airtable with weekly summaries.

## Integrations Required
- Gmail OAuth2 (n8n credential) — claim email trigger
- `ANTHROPIC_API_KEY` — field extraction + error flagging
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — denial tracking
- `SLACK_BOT_TOKEN` — alerts for high-value claims or denials

## n8n Workflow Nodes

1. **Gmail Trigger** (`n8n-nodes-base.gmailTrigger`)
   - Filter: subject contains "Claim" OR "EOB" OR "Remittance"
   - Download attachments

2. **HTTP Request: Claude Field Extraction** (OpenRouter)
   - Prompt: "Extract from this insurance claim/EOB: patient_name, date_of_service, provider_npi, insurance_id, diagnosis_codes (ICD-10), procedure_codes (CPT), billed_amount, paid_amount, denial_reason (if denied). Return JSON."
   - Input: email body + attachment text

3. **Code: Map to Billing Codes** (`n8n-nodes-base.code`)
   - JS: validate CPT codes against known valid set
   - Flag common errors: missing NPI, invalid date format, mismatched diagnosis/procedure

4. **IF: Has Errors?** (`n8n-nodes-base.if`)
   - True → Slack alert: "⚠️ Claim error detected: {{error_type}} for patient {{name}}"
   - False → continue to submission

5. **HTTP Request: Submit to Clearinghouse**
   - POST to clearinghouse API (e.g., Change Healthcare, Availity)
   - Or: append to "Pending Submission" Airtable table for manual submission

6. **Airtable: Log Claim** (`n8n-nodes-base.airtable`)
   - Table: "Claims Log"
   - Fields: Patient, DOS, CPT, ICD10, Billed, Paid, Status, DenialReason, SubmissionDate

7. **IF: Was Denied?** (`n8n-nodes-base.if`)
   - True → Airtable: update table "Denials Tracker" with reason + action needed

### Flow 2: Weekly Denial Summary

8. **Schedule Trigger** — Every Monday 8am

9. **Airtable: Read Denials** — last 7 days

10. **HTTP Request: Claude Summary** (OpenRouter)
    - "Summarize these insurance denials by reason category. Identify the top 3 most common reasons and recommend fixes."

11. **Gmail: Send Summary** to billing manager

## Claude AI Tasks
- Claim field extraction from unstructured text (step 2)
- Error pattern summary (step 10)

## Python Tools Needed
- `airtable_crud.py` — local testing + data backfill
- `claude_ai.py --action extract` — test extraction accuracy before deploying

## Test Plan
1. Send test email with a sample claim (use a mock EOB document)
2. Check n8n execution — verify extracted JSON has correct fields
3. Check Airtable "Claims Log" — new record should appear
4. Simulate a denial — check Airtable "Denials Tracker" updated
5. Run Monday summary — verify email arrives with formatted denial breakdown
