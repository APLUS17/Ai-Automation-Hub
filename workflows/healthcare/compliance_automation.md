# Healthcare Revenue — Compliance Automation

## What It Does
Daily check of staff certification expiry dates with 30/14/7-day renewal reminders. A RAG-based policy Q&A bot answers HIPAA and compliance questions from uploaded docs. Every action is timestamped in an audit log Google Sheet.

## Integrations Required
- `GOOGLE_SERVICE_ACCOUNT_JSON` — certification roster Sheet + audit log Sheet
- `ANTHROPIC_API_KEY` — policy Q&A bot
- Gmail OAuth2 — renewal reminder emails

## n8n Workflow Nodes

### Flow 1: Certification Expiry Checker

1. **Schedule Trigger** — Every day at 8am

2. **Google Sheets: Read Staff Certifications** (`n8n-nodes-base.googleSheets`)
   - Columns: Staff Name, Certification, Expiry Date, Email, Status

3. **Code: Calculate Days Until Expiry** (`n8n-nodes-base.code`)
   - JS: for each row, compute daysUntilExpiry = (expiryDate - today)
   - Flag rows where daysUntilExpiry in [30, 14, 7]

4. **IF: Renewal Needed?** (`n8n-nodes-base.if`)
   - Check `$json.daysUntilExpiry <= 30`

5. **Gmail: Renewal Reminder** (`n8n-nodes-base.gmail`)
   - To: staff email + compliance manager
   - Subject: "⚠️ Certification Expiring in {{days}} Days — {{cert_name}}"
   - Body: staff name, certification, expiry date, renewal link

6. **Google Sheets: Audit Log** (`n8n-nodes-base.googleSheets`)
   - Append: [Timestamp, Action, StaffName, CertName, DaysRemaining, EmailSent]

### Flow 2: Policy Q&A Bot (Claude Code App)

Build `workflows/healthcare/compliance_bot.html`:
- Chat interface: "Ask a compliance question..."
- System prompt includes HIPAA highlights + embedded policy text (paste key sections)
- Escalation: "For questions I can't answer, email compliance@[org].com"
- Audit: every question/answer pair logged to Google Sheet via n8n webhook

### Flow 3: Action Audit Log

7. **Webhook Trigger** — any compliance action (certifications, bot queries, report access)

8. **Google Sheets: Append Audit Row**
   - [Timestamp, User, Action_Type, Details, IP_Address]

## Claude AI Tasks
- Real-time compliance Q&A via system-prompted chat
- Optional: summarize newly uploaded policy docs into plain-language FAQ

## Python Tools Needed
- `google_sheets.py` — read certification roster + write audit logs
- `claude_ai.py --action generate` — test Q&A quality

## Test Plan
1. Add a test staff row with expiry date = today + 7 days
2. Trigger daily check — verify reminder email arrives
3. Check audit log sheet — new row timestamped
4. Open compliance_bot.html — ask "What is the minimum PHI access policy?" — verify sensible answer
