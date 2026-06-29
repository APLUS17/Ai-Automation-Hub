# Theater Groups — General Process Automation

## What It Does
Audition form submissions are organized by role in Airtable. Rehearsal reminder SMS/emails send from the schedule sheet. Press releases are auto-drafted from a show info template.

## Integrations Required
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — audition submissions
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — rehearsal SMS
- Gmail OAuth2 — rehearsal emails + press release routing
- `ANTHROPIC_API_KEY` — press release drafting

## n8n Workflow Nodes

### Flow 1: Audition Form → Airtable by Role

1. **Webhook Trigger** — audition form submission
   - Fields: actor_name, email, phone, role_auditioning_for, headshot_url, video_url, notes

2. **Airtable: Create Record** (`n8n-nodes-base.airtable`)
   - Table: "Auditions {{show_name}}"
   - Fields: Name, Email, Phone, Role, Headshot, Video, Notes, Status=Pending

3. **Gmail: Confirmation to Auditionee**
   - "Thank you for auditioning for {{role}} in {{show_title}}. We'll be in touch by {{decision_date}}."

### Flow 2: Rehearsal Reminders

4. **Schedule Trigger** — every evening at 6pm

5. **Google Sheets: Read Rehearsal Schedule** (`n8n-nodes-base.googleSheets`)
   - Find rehearsals occurring tomorrow
   - Get cast members scheduled for that rehearsal

6. **Gmail: Rehearsal Reminder** to each cast member
   - "🎭 Reminder: Rehearsal tomorrow at {{time}}, {{location}}. Scenes: {{scenes}}. Please arrive 10 min early."

7. **Twilio: SMS Reminder** for anyone who prefers SMS
   - "Rehearsal tmrw {{time}} @ {{location}} — {{scenes}}"

### Flow 3: Press Release Generator

8. **Webhook Trigger** — "Generate Press Release" button click from production tool

9. **HTTP Request: Claude Press Release** (OpenRouter)
   - Prompt: "Write a professional 400-word press release for this theater production. Show: {{title}}, Director: {{director}}, Dates: {{dates}}, Venue: {{venue}}, Ticket price: {{price}}, Synopsis: {{synopsis}}, Notable cast: {{cast}}. Include a quote from the director. Standard AP style."

10. **Google Docs: Create Press Release Doc** (`n8n-nodes-base.googleDocs`)

11. **Gmail: Send to Press List** — paste press contacts from Sheet

## Claude AI Tasks
- Press release drafting (step 9)
- Optional: generate social media posts from press release

## Python Tools Needed
- `airtable_crud.py` — list/filter audition records
- `twilio_sms.py` — test SMS reminders
- `google_docs_pdf.py` — create press release doc

## Test Plan
1. Submit test audition form — verify Airtable record created in correct "Role" view
2. Add tomorrow's rehearsal to schedule sheet — trigger nightly check — verify SMS + email
3. Fire press release webhook with test show data — verify Google Doc created with formatted PR
