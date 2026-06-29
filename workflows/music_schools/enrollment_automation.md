# Music & Arts Schools — Scheduling & Billing Automation

## What It Does
Two-part workflow: (1) Collects teacher availability and room constraints, auto-assigns lessons to rooms and time slots based on instrument type, sound bleed, and student preferences—eliminating scheduling conflicts and filling underutilized rooms. (2) Logs attendance vs. contracted lessons monthly, adjusts invoices for missed and make-up lessons, and Claude generates plain-language explanations of each change—reducing billing disputes and keeping cash flow predictable.

**Market context**: Music schools juggle teacher schedules and room allocations manually. Room utilization under manual scheduling is ~60% vs. ~85% automated. Billing disputes from missed/make-up lesson reconciliation average 4–8/month manually vs. ~1 with automated transparent invoicing. Admin saves 3–5 hours/week on scheduling alone.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for welcome messages and invoice explanations
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — teacher availability, rooms, attendance, billing
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — lesson reminders
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — family confirmations, invoices
- `GOOGLE_SERVICE_ACCOUNT_JSON` — calendar integration

## n8n Workflow Nodes

### Flow 1: Lesson Scheduling & Studio Utilization

1. **Webhook Trigger: New Enrollment** (`n8n-nodes-base.webhook`)
   - Receives: student_name, instrument, preferred_days, preferred_times, teacher_preference

2. **Airtable: Get Teacher Availability** (`n8n-nodes-base.airtable`)
   - Query teachers by instrument specialty and open slots

3. **Airtable: Get Room Constraints** (`n8n-nodes-base.airtable`)
   - Room capabilities: instruments allowed, equipment, sound isolation level

4. **Code: Match Student to Slot** (`n8n-nodes-base.code`)
   - Algorithm: match instrument → room capability, teacher → availability, student → preference
   - Prevent double-booking, maximize utilization

5. **Airtable: Book Lesson Slot** (`n8n-nodes-base.airtable`)
   - Create: lesson_slot record linking student, teacher, room, time

6. **Mailgun: Confirm to Family** (`n8n-nodes-base.httpRequest`)
   - "{{student_name}} is enrolled for {{instrument}} lessons with {{teacher}} on {{day}} at {{time}} in Room {{room}}."

7. **Mailgun: Notify Teacher** (`n8n-nodes-base.httpRequest`)
   - Teacher schedule update with new student details

### Flow 2: Tuition Billing & Attendance

8. **Webhook Trigger: Lesson Attendance** (`n8n-nodes-base.webhook`)
   - Teacher marks: student_id, attended (yes/no/makeup), date

9. **Airtable: Update Attendance Log** (`n8n-nodes-base.airtable`)
   - Running tally of attended, missed, and make-up lessons per student

10. **Schedule Trigger: Monthly Billing** (`n8n-nodes-base.scheduleTrigger`)
    - 1st of each month

11. **Airtable: Get Attendance vs Contract** (`n8n-nodes-base.airtable`)
    - Compare actual attendance against contracted lesson count

12. **Code: Calculate Invoice Adjustments** (`n8n-nodes-base.code`)
    - Apply credit for missed lessons (per policy), charge for extra make-ups

13. **Claude: Write Invoice Explanation** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - "Write a clear, friendly explanation for {{parent_name}} about their invoice. Contracted: {{contracted}} lessons. Attended: {{attended}}. Missed: {{missed}} (credited per policy). Make-ups: {{makeups}}. Total due: ${{total}}."

14. **Mailgun: Send Itemized Invoice** (`n8n-nodes-base.httpRequest`)
    - Professional invoice with line items and Claude explanation

## Claude AI Tasks
- Generate welcome messages referencing the child's instrument and assigned teacher
- Write clear, friendly invoice adjustment explanations parents can understand
- Flag accounts with consistent missed lessons as potential churn signals

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Add a new enrollment for a piano student with Tuesday/Thursday preference
2. Verify available teacher and room are matched from Airtable
3. Confirm lesson slot booked and family/teacher confirmation emails arrive
4. Test with conflicting availability to verify no double-booking occurs
5. Log attendance for a student who missed 2 sessions and had 1 make-up
6. Trigger monthly billing and verify adjustments calculated correctly
7. Confirm Claude explanation references the specific lessons and invoice email arrives
