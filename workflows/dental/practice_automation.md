# Dental Clinics — Missed-Call Recovery & Recall Automation

## What It Does
Two-part workflow: (1) Monitors inbound calls for any that ring without answer or go to voicemail. Within seconds, sends an SMS offering to help with scheduling. Claude analyzes voicemail transcripts for urgency keywords and classifies them as emergency, urgent, or routine—routing high-urgency cases to front desk immediately. (2) Queries patients with diagnosed but unscheduled treatments, segmented by procedure type and insurance status. Claude drafts recall messages emphasizing benefits and insurance timing. Messages send via SMS and email at 30, 60, and 90-day intervals, with persistent non-responders escalating to a manual phone outreach list.

**Market context**: Dental offices miss 8–15 calls daily during busy clinic hours and after hours. ~40% of missed callers go to a competitor, but SMS recovery captures ~55% back. Meanwhile, unscheduled treatment value runs $800–$3,500 per patient—manual recall converts ~12% while automated recall hits ~28%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for urgency classification and recall message drafting
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS recovery, recall texts, on-call alerts
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — call logs, treatment tracking
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — recall emails

## n8n Workflow Nodes

### Flow 1: Missed-Call Capture & Recovery

1. **Webhook Trigger: Missed Call** (`n8n-nodes-base.webhook`)
   - Receives: caller_phone, call_time, voicemail_url, voicemail_transcript

2. **Twilio: Send Recovery SMS** (`n8n-nodes-base.httpRequest`)
   - Immediate: "Hi! We missed your call at {{clinic_name}}. How can we help? Reply BOOK to schedule, or we'll call you back shortly."

3. **IF: Voicemail Captured** (`n8n-nodes-base.if`)
   - Has voicemail transcript → send to Claude for classification
   - No voicemail → log and wait for SMS reply

4. **Claude: Classify Urgency** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Analyze voicemail transcript for urgency signals: pain keywords, emergency terminology, bleeding, swelling, broken tooth
   - Classify: Emergency (immediate), Urgent (same-day), Routine (standard scheduling)

5. **IF: Emergency** (`n8n-nodes-base.if`)
   - Emergency → SMS on-call staff immediately
   - Urgent → priority queue for front desk callback
   - Routine → standard scheduling flow

6. **Twilio: Alert On-Call Staff** (`n8n-nodes-base.httpRequest`)
   - "EMERGENCY: Patient at {{phone}} reports {{urgency_summary}}. Call back immediately."

7. **Airtable: Log Call + Outcome** (`n8n-nodes-base.airtable`)
   - Record: caller_phone, time, urgency_level, outcome, recovery_status

### Flow 2: Recall & Unscheduled Treatment Follow-Up

8. **Schedule Trigger: Weekly** (`n8n-nodes-base.scheduleTrigger`)
   - Every Monday — check for unscheduled treatments

9. **Airtable: Query Unscheduled Treatments** (`n8n-nodes-base.airtable`)
   - Filter: diagnosed_date > 30 days ago AND appointment_scheduled = false

10. **IF: Days Since Diagnosis** (`n8n-nodes-base.if`)
    - 30 days → first recall
    - 60 days → second recall with urgency
    - 90 days → final attempt + flag for phone outreach

11. **Claude: Draft Recall Message** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Draft personalized messages referencing the specific procedure, tooth number, and insurance benefit timing
    - Example: "Hi {{name}}, your crown on tooth #14 is still unscheduled. Your insurance covers this at 80% — and your benefit year resets in {{days}} days. Book now: {{link}}"

12. **Twilio: Send SMS** (`n8n-nodes-base.httpRequest`)
    - Recall text per patient

13. **Mailgun: Send Email** (`n8n-nodes-base.httpRequest`)
    - Detailed recall email with procedure explanation and booking link

14. **Wait: 30 Days** (`n8n-nodes-base.wait`)
    - Between recall intervals

15. **IF: Booked** (`n8n-nodes-base.if`)
    - YES → exit sequence, update Airtable
    - NO → continue to next interval or flag for phone

16. **Airtable: Flag for Phone Outreach** (`n8n-nodes-base.airtable`)
    - After 90 days with no response → manual outreach list for staff

## Claude AI Tasks
- Analyze voicemail transcripts for urgency signals (pain keywords, dental emergency terminology)
- Classify each missed call as emergency, urgent, or routine
- Draft personalized recall messages referencing specific procedures, tooth numbers, and insurance benefit timing
- Generate escalation summaries for staff handling phone outreach on non-responders

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Simulate a missed call webhook with a test phone number
2. Verify recovery SMS arrives within 60 seconds
3. Submit a voicemail transcript with "severe pain" keywords and confirm emergency routing fires
4. Submit routine appointment text and confirm standard queue placement
5. Load a test patient with a crown diagnosis 35 days ago into Airtable
6. Trigger the weekly schedule and confirm 30-day recall message fires
7. Verify SMS and email both arrive with procedure-specific copy
8. Simulate 90 days with no booking and confirm phone list flag is set
