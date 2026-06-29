# HR (Small Orgs) — AI Adoption Consulting

## What It Does
An AI readiness audit form collects business info and pain points. On submission, Claude generates personalized AI tool recommendations. n8n assembles and emails a PDF report to the client. A follow-up check-in goes out at 7 and 30 days.

## Integrations Required
- `ANTHROPIC_API_KEY` — recommendations generation
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Google Docs PDF generation
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — report email + follow-ups

## n8n Workflow Nodes

1. **Webhook Trigger** — audit form submission
   - Fields: company_name, size, industry, current_tools, pain_points (multi-select), ai_experience, budget_range

2. **HTTP Request: Claude Recommendations** (OpenRouter)
   - Prompt: "You are an AI adoption consultant. Based on this business profile, recommend 5 specific AI tools/workflows. For each: tool name, use case, estimated time saved per week, implementation difficulty (easy/medium/hard). Company: {{company_name}}, Pain points: {{pain_points}}, Budget: {{budget_range}}. Format as structured JSON."

3. **Google Docs: Create Report from Template** (`n8n-nodes-base.googleDocs`)
   - Copy template doc ID (pre-built with sections: Executive Summary, Recommendations, Implementation Roadmap)
   - Replace placeholders with Claude output

4. **Google Drive: Export as PDF** (`n8n-nodes-base.httpRequest`)
   - GET `https://docs.google.com/document/d/{{docId}}/export?format=pdf`

5. **Mailgun: Send Report** (`n8n-nodes-base.httpRequest`)
   - To: client email
   - Subject: "Your AI Readiness Report — {{company_name}}"
   - Attachment: PDF report
   - Body: brief intro + next steps

6. **Wait 7 Days** (`n8n-nodes-base.wait`)

7. **Mailgun: 7-Day Check-in** — "How's the AI journey going? Have you had a chance to try any of the recommendations?"

8. **Wait 23 Days** (`n8n-nodes-base.wait`)

9. **Mailgun: 30-Day Check-in** — "It's been a month — would love to hear your progress and see if there's more we can help with."

## Claude Code App
Build `workflows/hr/ai_audit_form.html`:
- Multi-step form (3 pages): company info → pain points (checkboxes) → AI experience + budget
- Progress bar
- Submit to n8n webhook
- After submit: "Your report is being generated — check your inbox in 2 minutes"
- Design: matches build guide aesthetic (dark/light theme, Satoshi font)

## Claude AI Tasks
- AI tool recommendations generation (step 2) — quality matters here; test prompt carefully

## Python Tools Needed
- `google_docs_pdf.py` — local testing of doc creation + PDF export
- `mailgun_email.py` — test email with attachment

## Test Plan
1. Open ai_audit_form.html, fill out and submit as test company
2. Check .tmp/ or Docs — report should be created
3. Verify PDF email arrives with personalized recommendations
4. Wait (or fast-forward n8n) — verify 7-day check-in sends
