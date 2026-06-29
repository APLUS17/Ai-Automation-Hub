# Adult Education & Nonprofit Training — Membership Management Automation

## What It Does
Centralizes member records and renewal dates in Airtable, automatically sends tiered renewal reminders and grace-period notices with Claude-written benefit summaries, and flags high-value lapsed members for personal outreach before they fully churn.

**Market context**: Adult education nonprofits track memberships manually in spreadsheets, sending generic reminders too late. High-value members lapse simply because no one followed up with a relevant, timely message—shrinking program revenue and engagement. Lapse rates under manual management hover around 25%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for personalized renewal emails
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — member records and status tracking
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — email delivery

## n8n Workflow Nodes

### Flow 1: Daily Renewal Check

1. **Schedule Trigger** (`n8n-nodes-base.scheduleTrigger`)
   - Mode: daily at 8am
   - Checks for members expiring in 30, 14, and 7 days

2. **Airtable: Get Expiring Members** (`n8n-nodes-base.airtable`)
   - Filter: `days_until_expiry <= 30 AND status = "Active"`
   - Returns member name, email, program, engagement history, tier

3. **IF: Days Until Expiry** (`n8n-nodes-base.if`)
   - Branch 1: 30 days → gentle "coming up" reminder
   - Branch 2: 14 days → urgency + benefit summary
   - Branch 3: 7 days → final warning with lapse consequences

4. **Claude: Draft Renewal Email** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Prompt: "Write a personalized renewal email for {{member_name}} in the {{program}} program. Reference their engagement: {{engagement_history}}. Tier: {{tier}}. Days remaining: {{days_until_expiry}}. Tone: warm, nonprofit-appropriate."
   - Output: subject line + email body

5. **Mailgun: Send Reminder** (`n8n-nodes-base.httpRequest`)
   - POST to Mailgun API with Claude-generated content
   - Track opens/clicks for engagement scoring

6. **Airtable: Update Status** (`n8n-nodes-base.airtable`)
   - Log: reminder_sent_date, reminder_type, engagement_score

### Flow 2: Lapsed Member Flagging

7. **Schedule Trigger** (`n8n-nodes-base.scheduleTrigger`)
   - Mode: weekly on Monday
   - Identifies members past grace period

8. **Airtable: Get Lapsed Members** (`n8n-nodes-base.airtable`)
   - Filter: `status = "Grace Period" AND days_since_expiry > 14`

9. **Claude: Classify by Value Tier** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Analyze: total tenure, programs attended, donation history
   - Output: priority tier (High/Medium/Low) + recommended action

10. **Airtable: Flag for Personal Outreach** (`n8n-nodes-base.airtable`)
    - High-value → tag "Manual Outreach Required"
    - Medium → one more automated attempt
    - Low → archive with re-engagement drip

## Claude AI Tasks
- Write personalized renewal emails referencing each member's engagement history and program benefits
- Classify lapsed members by value tier to suggest manual vs. automated outreach

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Add a test member with expiry date 7 days out
2. Trigger the schedule manually and verify email is sent via Mailgun
3. Check Airtable record shows updated status and reminder timestamp
4. Verify lapsed high-value members appear in a separate queue tagged "Manual Outreach Required"
