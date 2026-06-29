# AI Education & Training — Training & Assessment Automation

## What It Does
Two-part workflow: (1) Enrolls SMB employees into modular AI literacy courses built with Claude inside an LMS, automates assignment reminders and module unlocking, and auto-generates completion certificates that feed back into HR systems. (2) An intake form collects recurring tasks and existing systems from SMB staff; Claude scores each opportunity by complexity, impact, and feasibility, then drafts a prioritized automation roadmap delivered as a PDF—creating a paid discovery pipeline that generates future implementation projects.

**Market context**: 73% of small businesses need help identifying and prioritizing AI projects, yet most employees learn through trial and error. Without structured training, teams misuse tools or avoid them entirely. A paid discovery audit ($500–$1,000) typically identifies 8–15 automatable processes with ~60% conversion to implementation projects.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for course content, reminders, and opportunity scoring
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — enrollment tracking, assessment responses
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — assignment emails, report delivery
- `GOOGLE_SERVICE_ACCOUNT_JSON` — certificate generation, roadmap PDF export

## n8n Workflow Nodes

### Flow 1: AI Literacy Course Automation

1. **Webhook Trigger** (`n8n-nodes-base.webhook`)
   - Receives enrollment data: employee_name, email, company, role, industry

2. **Airtable: Create Enrollment** (`n8n-nodes-base.airtable`)
   - New record in "Enrollments" table with status "Active", module_progress = 0

3. **Schedule Trigger: Reminders** (`n8n-nodes-base.scheduleTrigger`)
   - Daily check for learners with incomplete modules and no activity in 3+ days

4. **Claude: Draft Module Intro** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Generate module content covering prompting basics, workflow design, and AI ethics tailored to the SMB's industry
   - Draft personalized reminder messages referencing the learner's role and progress

5. **Mailgun: Send Assignment** (`n8n-nodes-base.httpRequest`)
   - Deliver module content or nudge email with progress summary

6. **Google Docs: Generate Certificate** (`n8n-nodes-base.googleDocs`)
   - On course completion, populate certificate template with learner name, company, date

7. **Airtable: Mark Completed** (`n8n-nodes-base.airtable`)
   - Update enrollment status to "Completed" with completion_date

--- (Flow 2: AI Opportunity Assessment — separate n8n workflow) ---

8. **Webhook Trigger** (`n8n-nodes-base.webhook`)
   - Receives audit form data: business_info, team_size, top_recurring_tasks, current_tools

9. **Airtable: Store Responses** (`n8n-nodes-base.airtable`)
   - Log all form data in "Assessments" table

10. **Claude: Score & Prioritize** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Analyze submitted tasks for automation feasibility, estimated time savings, and implementation complexity
    - Draft a ranked roadmap with plain-language explanations for non-technical business owners

11. **Google Docs: Build Roadmap** (`n8n-nodes-base.googleDocs`)
    - Create formatted roadmap document from Claude output

12. **Mailgun: Deliver Report** (`n8n-nodes-base.httpRequest`)
    - Email PDF roadmap to the client with next-steps CTA

## Claude AI Tasks
- Generate modular AI training content (prompting basics, workflow design, AI ethics) tailored to each learner's industry
- Draft personalized reminder messages referencing learner role and progress
- Analyze submitted tasks for automation feasibility, time savings, and complexity
- Draft a ranked automation roadmap with plain-language explanations

## Python Tools Needed
- `google_docs_pdf.py` — export completion certificates and roadmap reports as PDFs from Google Docs templates

## Claude Code App
Build `workflows/ai_education/course_portal.html`:
- Simple learner dashboard showing module progress, next steps, and certificate download
- Fetches data from n8n webhook

Build `workflows/ai_education/audit_form.html`:
- Polished multi-step audit form collecting business info, team size, top recurring tasks, and current tools
- Submits to n8n webhook on completion

## Test Plan
1. Submit a test enrollment webhook with employee name and company
2. Verify Airtable record created and welcome email sent
3. Trigger a reminder after simulated 3-day gap — verify nudge email arrives
4. Mark module complete and confirm certificate PDF is generated and emailed
5. Submit test audit form with 5 dummy tasks
6. Verify Airtable receives the data and Claude produces a scored list with at least 3 ranked items
7. Check that a PDF roadmap is generated and the delivery email arrives
