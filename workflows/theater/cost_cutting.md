# Theater Groups — Cost-Cutting Automations

## What It Does
Box office CSV data auto-flows into a Google Sheet dashboard. Pre-show promo emails go to past attendees automatically. A volunteer scheduling app matches availability form responses to open shifts.

## Integrations Required
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Box office Sheet + volunteer Sheet
- Gmail OAuth2 — promo emails to past attendees
- `ANTHROPIC_API_KEY` — volunteer scheduling optimization

## n8n Workflow Nodes

### Flow 1: Box Office Dashboard

1. **Webhook Trigger** — triggered when new CSV is exported from ticketing platform

2. **Code: Parse CSV** (`n8n-nodes-base.code`)
   - JS: parse CSV string → array of {show, date, tickets_sold, revenue, channel}

3. **Google Sheets: Write Dashboard** (`n8n-nodes-base.googleSheets`)
   - Clear "Box Office" sheet, write header + rows
   - Includes: per-show revenue, channel breakdown (online/door), sold vs. capacity

### Flow 2: Pre-Show Promo Emails

4. **Schedule Trigger** — 2 weeks before each upcoming show date

5. **Google Sheets: Read Past Attendee List** (`n8n-nodes-base.googleSheets`)
   - Sheet: "Audience CRM" — name, email, shows attended, last_attended_date

6. **Code: Filter Relevant Audiences** (`n8n-nodes-base.code`)
   - Prioritize: attended similar genre in last 18 months

7. **Gmail: Send Promo** (`n8n-nodes-base.gmail`)
   - Subject: "You might love our next show — {{show_title}}"
   - Body: show description, dates, early-bird link

### Flow 3: Volunteer Scheduling

8. **Google Sheets Trigger** — new form response in "Volunteer Availability" sheet

9. **HTTP Request: Claude Schedule** (OpenRouter)
   - Prompt: "Assign shifts for this show. Roles needed: Box Office (2), Ushers (4), Stage Crew (3). Available volunteers with availability: {{list}}. Return JSON: {role: [assigned_names]}"

10. **Gmail: Send Schedule to Volunteers** (`n8n-nodes-base.gmail`)
    - Per-volunteer email: "Your shift for {{show_title}}: {{role}}, {{date}}, {{time}}. Please confirm by replying Yes."

## Claude Code App
`workflows/theater/volunteer_scheduler.html`:
- Volunteer submits availability via form on this page
- Shows upcoming shows + open roles with filled/needed counts
- Submit → Google Sheets row added → triggers n8n scheduling

## Python Tools Needed
- `google_sheets.py` — read/write box office and volunteer sheets

## Test Plan
1. Upload a test CSV via webhook — verify Sheet populated with totals
2. Add test attendee emails to "Audience CRM" — trigger promo email — verify delivery
3. Submit volunteer availability form → verify Claude assigns shift → volunteer email sent
