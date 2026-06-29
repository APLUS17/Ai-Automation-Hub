# Education (K-12) — Teacher Task Automation

## What It Does
Google Form quiz submissions are auto-graded for MCQs; results logged to a sheet; weekly parent update emails are auto-sent; and Google Docs progress reports are generated from grade data.

## Integrations Required
- Gmail OAuth2 (n8n credential `6xfr5f40H92Sj1Eb`) — parent emails
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Sheets + Docs
- `ANTHROPIC_API_KEY` — progress report narrative generation

## n8n Workflow Nodes

### Flow 1: Auto-Grade Google Form

1. **Google Sheets Trigger** (`n8n-nodes-base.googleSheetsTrigger`)
   - Watch for new form responses in "Quiz Responses" sheet

2. **Code: Grade MCQs** (`n8n-nodes-base.code`)
   - JS: compare student answers against answer key (stored in "Answer Key" sheet)
   - Calculate score %, correct/wrong per question

3. **Google Sheets: Log Score** (`n8n-nodes-base.googleSheets`)
   - Append to "Gradebook": Student Name, Date, Quiz, Score%, Wrong Questions

### Flow 2: Weekly Parent Emails

4. **Schedule Trigger** — Every Friday 3pm

5. **Google Sheets: Read Gradebook** — last 7 days per student

6. **Code: Group by Student** (`n8n-nodes-base.code`)
   - Aggregate scores, calculate trend (improving/declining)

7. **HTTP Request: Claude Narrative** (OpenRouter)
   - Prompt: "Write a 3-sentence parent update for {{student_name}}. Average score this week: {{avg_score}}%. Topics needing work: {{weak_topics}}. Tone: warm, encouraging."

8. **Gmail: Send Parent Email** (`n8n-nodes-base.gmail`)
   - To: parent email from student roster sheet

### Flow 3: Progress Report Generation

9. **Schedule Trigger** — End of grading period (manual trigger OK)

10. **Google Sheets: Read Full Gradebook** per student

11. **HTTP Request: Claude Report Draft** (OpenRouter)
    - Prompt: "Write a progress report for {{student_name}} covering: overall performance ({{avg_score}}%), strongest subject ({{best_topic}}), areas for improvement ({{weak_topics}}). 2 paragraphs, professional tone."

12. **Google Docs: Create Report** (`n8n-nodes-base.googleDocs`)
    - Copy template doc, replace {{placeholders}} with student data

## Claude AI Tasks
- Parent update narrative generation (step 7)
- Progress report draft (step 11)
- Optional: quiz question generation from lesson objectives

## Python Tools Needed
- `google_docs_pdf.py` — create/export progress reports as PDFs
- `google_sheets.py` — read/update gradebook during testing

## Test Plan
1. Submit a Google Form quiz response manually
2. Check "Gradebook" sheet — new graded row should appear within 1 minute
3. Trigger parent email workflow manually — verify email arrives with personalized narrative
4. Run progress report workflow — verify Google Doc created with student name in filename
