# Driving Schools — Course Progress & Test Readiness Notification

## What It Does
Logs each lesson and evaluation score into Airtable. When readiness thresholds are met across all required skills, n8n automatically notifies the family with recommended test dates and BMV booking instructions—eliminating uncertainty about when the teen is ready and reducing failed first-attempt rates.

**Market context**: Driving schools make test readiness decisions manually, leaving parents guessing. Teens go to the BMV before they're ready and fail—blaming the school—while ready students wait too long, wasting sessions and eroding family trust. Unstructured programs have a ~52% first-attempt pass rate vs. ~74% with scored readiness tracking. Parent satisfaction is driven primarily by transparency.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for readiness summaries and parent notifications
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — student scores and lesson tracking
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS notifications
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — parent email updates

## n8n Workflow Nodes

1. **Webhook Trigger: Lesson Logged** (`n8n-nodes-base.webhook`)
   - Receives: student_id, instructor, lesson_date, skills_assessed[], scores[], notes

2. **Airtable: Update Student Scores** (`n8n-nodes-base.airtable`)
   - Update "Students" table with latest skill scores and lesson count

3. **Code: Check Readiness Thresholds** (`n8n-nodes-base.code`)
   - JS: compare all required skill scores against passing thresholds
   - Required skills: parking, lane changes, highway driving, night driving, defensive driving, etc.
   - Return: {ready: boolean, skills_remaining: []}

4. **IF: All Skills Passed** (`n8n-nodes-base.if`)
   - YES → generate readiness notification
   - NO → generate progress update for parent

5. **Claude: Draft Readiness Notification** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - If ready: "Create a test readiness notification for {{student_name}}. Summarize their strengths, recommend BMV test dates for {{area}}, and include booking instructions."
   - If not ready: "Generate a progress update for {{student_name}}'s parents. Skills passed: {{passed}}. Still developing: {{remaining}}. Include encouragement and expected timeline."

6. **Mailgun: Email Parent + Student** (`n8n-nodes-base.httpRequest`)
   - Readiness: celebratory email with test date recommendations
   - Progress: encouraging update with next steps

7. **Twilio: SMS Notification** (`n8n-nodes-base.httpRequest`)
   - "Great news! {{student_name}} has met all skill thresholds and is ready for the road test. Check your email for BMV booking details!"

## Claude AI Tasks
- Draft personalized readiness notifications summarizing strengths and recommended next steps for the BMV test
- Generate post-lesson parent summaries with skills observed and areas still developing

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Load a test student with all skills at passing threshold
2. Submit a lesson completion webhook and verify readiness check triggers
3. Confirm parent email and SMS arrive with test date recommendation
4. Log a student with one failing skill and verify progress update (not readiness notification) is sent
