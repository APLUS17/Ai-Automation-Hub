# Construction Contractors — Bid Intake & Field Report Automation

## What It Does
Two-part workflow: (1) Ingests new bid invitations from email and procurement portals, uses Claude to summarize scope, value indicators, and submission requirements, then ranks bids by strategic fit and team capacity for leadership review. Tracks win/loss history by project type to sharpen future bid decisions. (2) Replaces free-form field texts with guided mobile forms; Claude converts supervisor inputs into standardized daily log categories covering labor, equipment, weather, and safety issues, stored searchably in Airtable for claims support and compliance.

**Market context**: Construction contractors receive 15–40 bid invitations per month. PMs manually skim specs and deadlines—risking missed submissions on high-fit projects and wasted estimating hours on poor-fit work. Targeted bid selection improves win rates by ~18%. Meanwhile, paper daily logs have ~60% completion rates vs. ~92% with mobile + automation, and good documentation resolves claims 3× faster.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for bid scoring and log standardization
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — bid records, daily logs
- `GOOGLE_SERVICE_ACCOUNT_JSON` — bid pipeline tracking in Sheets
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — leadership notifications, safety alerts

## n8n Workflow Nodes

### Flow 1: Bid Intake & Comparison

1. **Gmail Trigger** (`n8n-nodes-base.gmailTrigger`)
   - Watch for emails with bid invitations (subject keywords: "RFP", "bid invitation", "project bid")

2. **Code: Extract Attachment Text** (`n8n-nodes-base.code`)
   - Parse PDF/DOCX attachments into plain text for Claude analysis

3. **Claude: Summarize & Score Bid** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Extract: project scope, submission deadline, estimated value, special requirements, bonding needs
   - Score: strategic fit (1–10), capacity match (1–10), historical win rate for this project type
   - Output: structured JSON with summary + recommendation

4. **Airtable: Create Bid Record** (`n8n-nodes-base.airtable`)
   - Store: project_name, owner, deadline, value_estimate, score, summary, status

5. **Google Sheets: Update Bid Pipeline** (`n8n-nodes-base.googleSheets`)
   - Append row to pipeline tracker for leadership visibility

6. **Mailgun: Notify Leadership** (`n8n-nodes-base.httpRequest`)
   - Email digest with top-scored bids and deadlines this week

### Flow 2: Field Report & Daily Log

7. **Webhook Trigger: Mobile Form** (`n8n-nodes-base.webhook`)
   - Receives: job_site, supervisor, date, free_text_notes, photos, safety_flags

8. **Claude: Standardize Log Entry** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Convert unstructured foreman notes into: labor_count, equipment_used, issues_encountered, weather_conditions, safety_observations
   - Flag any safety deviations for immediate alert

9. **IF: Safety Issue Flagged** (`n8n-nodes-base.if`)
   - YES → send safety manager alert
   - NO → proceed to storage

10. **Mailgun: Alert Safety Manager** (`n8n-nodes-base.httpRequest`)
    - Immediate email with flagged issue, job site, and supervisor name

11. **Airtable: Store Daily Log** (`n8n-nodes-base.airtable`)
    - Searchable record: date, site, categories, photos, safety_status

## Claude AI Tasks
- Extract project scope, submission deadline, estimated value, and special requirements from raw bid documents
- Score each bid against configured capacity and strategic fit criteria
- Convert unstructured foreman notes into standardized log categories
- Flag safety deviations and summarize patterns across multiple job sites weekly

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Send a test bid invitation email with a PDF attachment
2. Verify Claude extracts key fields correctly and score appears reasonable
3. Check Airtable record created with score and summary
4. Confirm Google Sheets pipeline row added and leadership notification email arrives
5. Submit a test mobile form with unstructured text including safety keywords
6. Verify Claude produces a structured log and safety alert email fires
7. Search Airtable for the record and verify all fields populated
