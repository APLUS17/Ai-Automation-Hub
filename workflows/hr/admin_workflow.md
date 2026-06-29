# HR (Small Orgs) — Admin Workflow Automation

## What It Does
New hire form triggers account creation + welcome kit; PTO requests are auto-approved or flagged to manager; an internal FAQ bot answers HR policy questions; and automated review cycle reminder emails go out on schedule.

## Integrations Required
- Gmail OAuth2 (n8n credential) — welcome emails, reminders
- `ANTHROPIC_API_KEY` — FAQ bot
- `GOOGLE_SERVICE_ACCOUNT_JSON` — employee roster Sheet, calendar
- `SLACK_BOT_TOKEN` — PTO notifications to manager

## n8n Workflow Nodes

### Flow 1: New Hire Onboarding

1. **Webhook Trigger** — new hire form submitted (Typeform, Tally, or Google Form)
   - Fields: name, email, role, start_date, manager_email

2. **Gmail: Send Welcome Kit** (`n8n-nodes-base.gmail`)
   - To: new hire email
   - Subject: "Welcome to the team, {{name}}! Here's everything you need"
   - Body: links to handbook, tools, first-week schedule

3. **Gmail: Alert Manager** (`n8n-nodes-base.gmail`)
   - "{{name}} has completed onboarding setup. Start date: {{start_date}}"

4. **Google Sheets: Add to Roster** (`n8n-nodes-base.googleSheets`)
   - Append: Name, Role, Email, Start Date, Manager

### Flow 2: PTO Request Automation

5. **Webhook Trigger** — PTO form submission
   - Fields: employee_name, dates, reason, manager_email

6. **Code: Check Calendar Conflicts** (`n8n-nodes-base.code`)
   - Read "Team Calendar" sheet, check for conflicts on requested dates
   - Rule: auto-approve if < 3 people out on same day

7. **IF: Auto-approve?** (`n8n-nodes-base.if`)
   - True: Gmail to employee "Your PTO for {{dates}} is approved ✓"
   - False: Slack to manager "🗓️ PTO request from {{name}} for {{dates}} — needs your approval"

### Flow 3: Performance Review Reminders

8. **Schedule Trigger** — 30 days, 14 days, 7 days before review date
   - Read review dates from "Review Cycle" sheet

9. **Gmail: Reminder Email** to manager + employee
   - "Performance review for {{name}} is in {{days}} days. Please complete the self-assessment: [link]"

## Claude Code App
Build `workflows/hr/faq_bot.html`:
- Simple chat interface: employee types an HR question
- System: "You are an HR assistant for [Company]. Answer based on the policy handbook. Escalate anything you can't find to hr@company.com."
- Handbook content embedded as context (paste policy text into system prompt)
- Claude API via n8n proxy webhook
