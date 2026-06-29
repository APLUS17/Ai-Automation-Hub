# Childcare & Daycare Centers — Enrollment & Communication Automation

## What It Does
Two-part workflow: (1) All new applications enter a central Airtable intake form. When a slot opens, n8n filters for age-matched children and uses Claude to rank by priority rules (siblings enrolled, time on waitlist, special needs). SMS/email offers go to the top family with a 24-hour claim window; if no reply, the spot automatically advances to the next family. (2) Teachers upload photos and quick notes throughout the day; at close, Claude generates a short personalized daily summary per family covering meals, naps, key activities, and one highlight. Urgent alerts (illness clusters, weather closings) trigger immediate SMS to all affected parents.

**Market context**: Centers manage long waitlists in spreadsheets. When a spot opens, directors spend hours making individual calls to find an age match—delaying enrollment, frustrating families, and leaving tuition revenue uncollected for days or weeks. Manual spot-fill time averages 3–5 days vs. under 24 hours with automation. Parent satisfaction's #1 driver is communication quality.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for waitlist ranking and daily summary generation
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — waitlist records, daily notes archive
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS offers, alerts
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — enrollment packets, daily recap emails

## n8n Workflow Nodes

### Flow 1: Waitlist & Enrollment

1. **Webhook Trigger: New Application** (`n8n-nodes-base.webhook`)
   - Receives: child_name, dob, parent_name, email, phone, siblings_enrolled, special_needs, preferred_program

2. **Airtable: Create Waitlist Record** (`n8n-nodes-base.airtable`)
   - Table: "Waitlist"
   - Status: "Waiting", application_date: now

3. **Webhook Trigger: Slot Opened** (`n8n-nodes-base.webhook`)
   - Fired when a child withdraws or ages out
   - Payload: program_name, age_group, slot_date

4. **Airtable: Query Matching Families** (`n8n-nodes-base.airtable`)
   - Filter: age_group match AND status = "Waiting"

5. **Claude: Rank by Priority** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Prompt: "Rank these waitlist families for a {{age_group}} slot in {{program_name}}. Priority factors: (1) siblings already enrolled, (2) time on waitlist, (3) special needs accommodations. Return ranked list with reasoning."

6. **Twilio: Send SMS Offer** (`n8n-nodes-base.httpRequest`)
   - To top-ranked family: "A {{program_name}} spot is available for {{child_name}} starting {{slot_date}}! Reply YES within 24 hours to claim it."

7. **Wait: 24 Hours** (`n8n-nodes-base.wait`)
   - Pause for family response

8. **IF: Reply Received** (`n8n-nodes-base.if`)
   - YES → send enrollment packet
   - No reply → advance to next family on ranked list

9. **Mailgun: Send Enrollment Packet** (`n8n-nodes-base.httpRequest`)
   - Forms, policies, tuition schedule, first-day checklist

10. **Airtable: Update Waitlist Status** (`n8n-nodes-base.airtable`)
    - Accepted → "Enrolled", Declined/No Reply → "Offered - Passed"

### Flow 2: Parent Communication & Alerts

11. **Webhook Trigger: Photo/Note Upload** (`n8n-nodes-base.webhook`)
    - Teachers submit notes throughout the day: child_id, note_text, photo_url, timestamp

12. **Airtable: Store Daily Notes** (`n8n-nodes-base.airtable`)
    - Append to "Daily Log" table per child

13. **Schedule Trigger: End of Day** (`n8n-nodes-base.scheduleTrigger`)
    - 5:30pm daily — compile summaries for all children

14. **Airtable: Get Day's Notes per Child** (`n8n-nodes-base.airtable`)
    - Read all notes for today, grouped by child_id

15. **Claude: Generate Family Summary** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Transform raw teacher notes into warm, parent-friendly daily summaries per child
    - Include: meals, naps, activities, one highlight moment

16. **Mailgun: Send Daily Recap** (`n8n-nodes-base.httpRequest`)
    - One email per family with their child's personalized summary

17. **Webhook Trigger: Urgent Alert Flag** (`n8n-nodes-base.webhook`)
    - Staff triggers: illness cluster, weather closing, safety incident

18. **Twilio: Blast SMS Alert** (`n8n-nodes-base.httpRequest`)
    - Immediate SMS to all affected parents (under 60 seconds)

## Claude AI Tasks
- Rank waiting families by configured priority rules factoring in enrollment duration, age match, siblings, and special needs flags
- Draft personalized SMS offer text referencing the specific program and start date
- Transform raw teacher notes into warm, parent-friendly daily summaries per child
- Draft urgent alert SMS copy appropriate for the situation type (illness, weather, incident)

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test application form and verify Airtable waitlist record created
2. Trigger a "slot opened" webhook and confirm top family receives SMS within 2 minutes
3. Simulate no-reply after 24 hours; verify next family is contacted automatically
4. Reply YES and confirm enrollment packet email arrives
5. Upload 3 test notes for a child and trigger end-of-day schedule
6. Verify Claude produces a summary and email is sent to test parent address
7. POST an urgent alert webhook and confirm SMS fires within 60 seconds
8. Check Airtable archive for compliance log entries
