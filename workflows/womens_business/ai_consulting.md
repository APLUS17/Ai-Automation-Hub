# Women-Owned Businesses — AI Leverage Consulting

## What It Does
A polished AI audit form collects business info and pain points. On submit, Claude generates a custom AI recommendations report. n8n assembles a PDF and emails it to the client. Check-in emails follow at 7 and 30 days.

## Integrations Required
- `ANTHROPIC_API_KEY` — AI recommendations generation
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Google Docs PDF
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — report + follow-up emails

## n8n Workflow Nodes

1. **Webhook Trigger** — audit form submission
   - Fields: owner_name, business_name, industry, team_size, biggest_time_sinks (multi), current_tools, ai_familiarity (1-5), goals, email

2. **HTTP Request: Claude Report** (OpenRouter)
   - System: "You are an AI consultant helping women entrepreneurs save time and grow their businesses through smart automation."
   - Prompt: "Create a personalized AI adoption roadmap for this business owner. Include: 3 Quick Wins (implementable this week, free or <$50/mo), 2 Medium Projects (1-3 months, moderate investment), and 1 Strategic AI Play (long-term). For each recommendation: specific tool, use case, time saved estimate, how to get started in one sentence. Owner: {{owner_name}}, Business: {{business_name}}, Industry: {{industry}}, Pain points: {{biggest_time_sinks}}, Team: {{team_size}} people. Format: clean JSON."

3. **Google Docs: Create Report from Template** (`n8n-nodes-base.googleDocs`)
   - Template: pre-built branded report doc with sections for Quick Wins, Medium Projects, Strategic Play
   - Replace {{placeholders}} with Claude output + owner name, business name, date

4. **HTTP Request: Export PDF** (`n8n-nodes-base.httpRequest`)
   - GET `https://docs.google.com/document/d/{{docId}}/export?format=pdf`

5. **Mailgun: Send Report** with PDF attachment
   - Subject: "Your AI Business Roadmap is ready, {{owner_name}} 🚀"
   - Body: brief summary of top recommendation + "Your full roadmap is attached"

6. **Airtable: Log Client** (`n8n-nodes-base.airtable`)
   - Track: name, business, email, date, report_doc_id, status=Report Sent

7. **Wait 7 Days** (`n8n-nodes-base.wait`)

8. **Mailgun: 7-Day Check-in**
   - "Hi {{owner_name}}, it's been a week since you got your AI roadmap! Have you tried any of the quick wins? I'd love to hear how it's going."

9. **Wait 23 Days** → **Mailgun: 30-Day Check-in**
   - "One month in — how's the AI journey? Book a free 20-min check-in call to review your progress: {{BOOKING_LINK}}"

## Claude Code App
Build `workflows/womens_business/audit_form.html`:
- 3-step form with progress indicator:
  - Step 1: Business basics (name, industry, team size)
  - Step 2: Pain point checkboxes (15 options: email overload, manual invoicing, social media, etc.)
  - Step 3: AI experience + goals + email
- Design: warm, empowering aesthetic (still using Satoshi font + CSS variables)
- On submit: show "Generating your personalized report..." spinner
- After: "Check your inbox — your AI roadmap will arrive in 2-3 minutes"

## Claude AI Tasks
- Full report generation (step 2) — this is the core deliverable; prompt quality matters most here

## Python Tools Needed
- `google_docs_pdf.py` — test report creation + export
- `mailgun_email.py --action send` — test email with PDF attachment

## Test Plan
1. Fill out audit_form.html as a test business (hair salon, 2 employees, biggest pain: booking + social media)
2. Verify Claude recommendations are specific (not generic) — check that it recommends Calendly + Buffer
3. Verify PDF arrives by email with branded layout
4. Check Airtable — client row logged
5. Advance n8n — verify 7-day check-in sends
