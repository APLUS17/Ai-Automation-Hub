# Pharmaceutical — IND/NDA Application Prep Automation

## What It Does
A Claude Code document intake tool lets regulatory teams upload study data. Claude extracts and maps structured data to CTD module sections (3.2.S, 3.2.P, etc.), drafts narrative sections with correct regulatory language, flags missing content, and routes draft sections to SMEs for approval via email.

## Integrations Required
- `ANTHROPIC_API_KEY` — field extraction + narrative drafting
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Google Docs + Drive for document management
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — section tracking + review workflow
- Gmail OAuth2 — SME routing emails

## n8n Workflow Nodes

1. **Webhook Trigger** — fired from Claude Code upload tool on document submission

2. **HTTP Request: Claude Extraction** (OpenRouter)
   - System: "You are a regulatory document analyst specializing in FDA IND/NDA submissions."
   - Prompt: "Extract from this study document: drug_substance_name, manufacturer, test_method, specifications, results. Map each piece of data to the appropriate CTD section (3.2.S.1 through 3.2.S.7 for drug substance, 3.2.P for drug product). Return JSON."

3. **Airtable: Log Extracted Data** (`n8n-nodes-base.airtable`)
   - Table: "Document Extractions"
   - Fields: Section, DataType, ExtractedValue, SourceDocument, Status=Draft

4. **HTTP Request: Claude Narrative Draft** (OpenRouter)
   - System: "You are writing regulatory narrative for an FDA IND submission. Use precise, compliant language. Avoid ambiguous claims."
   - Prompt: "Write the {{section_number}} narrative section based on this extracted data: {{extracted_data}}. Reference FDA guidance document [XXX]."

5. **Google Docs: Create Section Draft** (`n8n-nodes-base.googleDocs`)
   - New doc titled "{{drug_name}} — {{section_number}} Draft"
   - Insert Claude-generated narrative

6. **Airtable: Flag Missing Sections** (`n8n-nodes-base.airtable`)
   - Compare extracted sections against required CTD section list
   - Mark missing sections as "Needs Data"

7. **Gmail: Route to SME** (`n8n-nodes-base.gmail`)
   - To: SME assigned to this module (from Airtable routing table)
   - Subject: "Review Request: {{section_number}} for {{drug_name}}"
   - Body: link to Google Doc draft + extraction summary

8. **Webhook Trigger** (separate) — SME approves/rejects via form link in email

9. **Airtable: Update Status** — Approved / Needs Revision + reviewer comments

## Claude Code App
Build `workflows/pharmaceutical/document_intake.html`:
- File upload area (drag-drop or browse) — accepts PDF, DOCX, CSV
- Metadata form: drug name, study type, CTD section target
- Submit → uploads to Google Drive → fires n8n webhook
- Status tracker: table of submitted docs with extraction status
- Missing sections panel: list of CTD sections still needed

## Claude AI Tasks
- Structured data extraction from regulatory documents (step 2)
- Narrative section drafting with regulatory language (step 4)

## Python Tools Needed
- `claude_ai.py --action extract` — test extraction accuracy on sample study doc
- `google_docs_pdf.py` — create/manage draft docs
- `airtable_crud.py` — manage section tracking table

## Test Plan
1. Upload a sample study document (chemistry data for a fictional drug)
2. Verify Claude extraction returns correct CTD section mapping
3. Check Google Docs — narrative draft created for each extracted section
4. Verify Airtable shows which sections are complete vs. missing
5. Verify SME email sent with review link
