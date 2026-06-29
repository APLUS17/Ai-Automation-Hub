# Medical Clinics — Patient Intake & No-Show Reduction Automation

## What It Does
Two-part workflow: (1) Replaces paper intake with secure mobile links sent at booking. Claude parses complaints, assigns urgency scores, flags high-urgency cases to nursing staff via SMS, and generates clinical summaries for clinicians—saving 2–3 minutes per patient. (2) Reviews upcoming appointments daily, flags high no-show-risk patients, sends confirmation SMS, and fills cancellations from a live waitlist—maximizing clinician utilization.

**Market context**: Overloaded front desks miss red flags and slow triage. Manual intake causes a ~12% high-risk flag miss rate. Average clinic no-show rate is 18–25%; SMS confirmation drops it to ~8%. Waitlist auto-fill achieves ~70% slot recovery rate.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for complaint triage and clinical summaries
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS alerts and confirmations
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — triage data, appointment tracking, waitlist
- `SLACK_BOT_TOKEN` — triage channel notifications

## n8n Workflow Nodes

### Flow 1: New Patient Intake & Triage

1. **Webhook Trigger: Intake Form** (`n8n-nodes-base.webhook`)
   - Receives: patient_name, dob, chief_complaint, duration, severity, medications, allergies

2. **Claude: Parse Complaint + Assign Urgency** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Score 1–10 based on symptom severity, duration, acuity
   - Structure: urgency_score, primary_concern, differential_flags, recommended_action

3. **IF: High Urgency** (`n8n-nodes-base.if`)
   - Score 8–10 → immediate nursing alert
   - Score 1–7 → standard triage queue

4. **Twilio: Alert Nursing Staff SMS** (`n8n-nodes-base.httpRequest`)
   - "HIGH PRIORITY: {{patient_name}} reporting {{chief_complaint}} (severity {{score}}). Review immediately."

5. **Slack: Notify Triage Channel** (`n8n-nodes-base.slack`)
   - Post to #triage with full complaint summary

6. **Airtable: Store Triage Data** (`n8n-nodes-base.airtable`)
   - Record with all fields + urgency score

7. **Claude: Generate Clinical Summary** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - One-page summary for physician review before encounter

### Flow 2: No-Show Reduction & Waitlist Fill

8. **Schedule Trigger: Daily** (`n8n-nodes-base.scheduleTrigger`)
   - 8am — check next-day appointments

9. **Airtable: Get Upcoming Appointments** (`n8n-nodes-base.airtable`)
   - All appointments for tomorrow

10. **IF: High No-Show Risk** (`n8n-nodes-base.if`)
    - Flag based on visit type (behavioral health, follow-up) and past no-show history

11. **Twilio: Confirmation SMS** (`n8n-nodes-base.httpRequest`)
    - "Reminder: You have an appointment tomorrow at {{time}} with Dr. {{provider}}. Reply CONFIRM to keep your slot or CANCEL."

12. **Wait: 24 Hours** (`n8n-nodes-base.wait`)

13. **IF: Confirmed** (`n8n-nodes-base.if`)
    - Confirmed → no action
    - No response/cancelled → fill from waitlist

14. **Airtable: Query Waitlist** (`n8n-nodes-base.airtable`)
    - Find patients wanting this time slot or provider

15. **Twilio: Offer Slot to Waitlist** (`n8n-nodes-base.httpRequest`)
    - "An appointment just opened with Dr. {{provider}} tomorrow at {{time}}. Reply YES to book!"

## Claude AI Tasks
- Parse patient complaints and assign urgency scores
- Generate structured one-page clinical summaries for physician review
- Classify appointment types and patient history patterns most associated with no-shows

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test intake form with "chest tightness for 2 days" as chief complaint
2. Verify Claude assigns high urgency and nursing SMS fires within 60 seconds
3. Submit a routine complaint and verify clinical summary is generated
4. Load test appointments including one behavioral health follow-up (high risk)
5. Trigger daily schedule and verify confirmation SMS fires for high-risk slot
6. Simulate no confirmation and verify waitlist patient receives offer
