# Nonprofit Membership Organizations — Renewal & Event Automation

## What It Does
Two-part workflow: (1) Identifies members whose terms end soon, segmented by engagement level. Claude writes tailored renewal emails referencing each member's participation history—events attended, committees joined, benefits used. Reminders send at 60, 30, and 7 days out. (2) Centralizes registrations and check-ins for luncheons, expos, and classes. Attendance is logged per member for engagement scoring that feeds back into renewal and sponsor reports.

**Market context**: Business associations and nonprofits send generic renewal reminders that members ignore. High-value members who feel unrecognized don't renew. Personalizing renewal emails improves renewal rates from ~55% to ~75%, saving 8–12 staff hours per cycle. For events, automated check-in and follow-ups increase survey response rates from ~12% to ~34%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for personalized renewal drafts and survey copy
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — member directory, rosters, and event logs
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — renewal emails, confirmations, surveys
- `GOOGLE_SERVICE_ACCOUNT_JSON` — event roster tracking

## n8n Workflow Nodes

### Flow 1: Membership Renewal & Dues Collection

1. **Schedule Trigger: Weekly** (`n8n-nodes-base.scheduleTrigger`)
   - Weekly on Mondays at 9am

2. **Airtable: Get Expiring Members** (`n8n-nodes-base.airtable`)
   - Query members whose membership expires in exactly 60, 30, or 7 days

3. **IF: Days Until Expiry** (`n8n-nodes-base.if`)
   - Branches to 60-day, 30-day, 7-day, or lapsed stages

4. **Claude: Draft Personalized Renewal** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Draft message referencing events attended, committees, and benefits used: "Hi {{name}}, we loved having you at the {{event1}} and {{event2}} this year. Your renewal is coming up..."

5. **Mailgun: Send Renewal Email** (`n8n-nodes-base.httpRequest`)
   - Send the personalized email draft with custom payment link

6. **Airtable: Update Renewal Status** (`n8n-nodes-base.airtable`)
   - Log touchpoint date, email sent, and active status

7. **Mailgun: Final Re-Engagement Email** (`n8n-nodes-base.httpRequest`)
   - For lapsed members: final offer before archiving

### Flow 2: Event Registration & Attendance Tracking

8. **Webhook Trigger: Registration** (`n8n-nodes-base.webhook`)
   - Receives: member_id, event_id, ticket_type, price

9. **Airtable: Add to Event Roster** (`n8n-nodes-base.airtable`)
   - Log registrant in event roster database

10. **Mailgun: Registration Confirmation** (`n8n-nodes-base.httpRequest`)
    - Send ticket confirmation and calendar invite

11. **Schedule Trigger: Day-Before Reminder** (`n8n-nodes-base.scheduleTrigger`)
    - Day before the scheduled event

12. **Mailgun: Reminder + Logistics Email** (`n8n-nodes-base.httpRequest`)
    - Logistics details, parking info, agenda

13. **Webhook Trigger: Check-In Scan** (`n8n-nodes-base.webhook`)
    - Triggered by staff scanning QR code at door

14. **Airtable: Log Attendance** (`n8n-nodes-base.airtable`)
    - Mark registration record as "Attended" and update member engagement score

15. **Mailgun: Post-Event Materials + Survey** (`n8n-nodes-base.httpRequest`)
    - Send event slides and feedback survey link

## Claude AI Tasks
- Write personalized renewal emails referencing specific member engagement history
- Generate lapse re-engagement messages with compelling reasons to return
- Generate post-event survey follow-up copy tailored to event types and sponsors

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Load a test member expiring in 30 days with 3 events attended into Airtable
2. Trigger renewal schedule and verify Claude email references the attended events
3. Submit a test registration webhook and check Airtable roster
4. Simulate check-in scan and verify attendance is logged
5. Trigger post-event survey and confirm email arrives
