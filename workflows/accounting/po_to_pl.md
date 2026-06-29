# Accounting / CPA Firms — PO → P&L Automation

## What It Does
Watches for incoming purchase orders (via Gmail or Google Drive), extracts structured data using Claude, pushes to QuickBooks for invoice creation, and auto-updates a P&L tracking sheet with a Slack notification.

## Integrations Required
- `N8N_API_URL` + `N8N_API_KEY` (deployment)
- Gmail OAuth2 (already in n8n as `6xfr5f40H92Sj1Eb`)
- OpenRouter / Claude (already in n8n as `HhRl2tZkR2KwXqsT`)
- `QB_CLIENT_ID`, `QB_CLIENT_SECRET`, `QB_REALM_ID`, `QB_REFRESH_TOKEN` (QuickBooks)
- `GOOGLE_SERVICE_ACCOUNT_JSON` (Google Sheets P&L)
- `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` (notifications)

## n8n Workflow Nodes

1. **Gmail Trigger** (`n8n-nodes-base.gmailTrigger`)
   - Filter: subject contains "PO" OR "Purchase Order"
   - Download attachments: true
   - Credential: Gmail OAuth2

2. **Extract Attachment Text** (`n8n-nodes-base.code`)
   - JS: read `$binary.attachment_0` and convert to text for Claude

3. **Claude Extraction** (`n8n-nodes-base.httpRequest` → OpenRouter)
   - POST to `https://openrouter.ai/api/v1/chat/completions`
   - Model: `anthropic/claude-sonnet-4-6`
   - Prompt: "Extract from this PO: vendor name, invoice number, date, line items (description, qty, unit price), total amount. Return JSON."
   - Parse response → structured fields

4. **IF: Has Required Fields** (`n8n-nodes-base.if`)
   - Check `$json.vendor` and `$json.total` are not empty
   - True → continue; False → send error alert to Slack

5. **QuickBooks: Create Invoice** (`n8n-nodes-base.httpRequest`)
   - POST to QuickBooks REST API `/v3/company/{realmId}/invoice`
   - Use extracted fields to populate vendor, line items, due date

6. **Google Sheets: Update P&L** (`n8n-nodes-base.googleSheets`)
   - Append row: [Date, Vendor, Invoice#, Amount, Category, QB Invoice ID]
   - Sheet: "P&L Tracker"

7. **Slack Notification** (`n8n-nodes-base.slack`)
   - Message: "📊 New PO processed: {{vendor}} — ${{total}} | QB Invoice #{{invoice_id}}"
   - Channel: `SLACK_CHANNEL_ID`

## Claude AI Tasks
- Field extraction from raw PO text/PDF (step 3)
- Categorization of line items (e.g., Office Supplies, Services, Equipment)

## Python Tools Needed
- None required — all steps handled in n8n
- Optional: `google_docs_pdf.py` if PDFs need pre-processing before n8n

## Test Plan
1. Send a test email with "PO Test" in subject + a simple text PO in body
2. Check n8n execution log — all 7 nodes should show green
3. Verify QuickBooks has a new draft invoice
4. Verify P&L sheet has new row
5. Check Slack for notification message

## Claude Code App
Not required for this workflow. Optional: a P&L dashboard reading from the Google Sheet.
