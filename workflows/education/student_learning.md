# Education (K-12) — Personalized Student Learning

## What It Does
A Claude Code chat interface for students to ask lesson questions; a workflow that tracks quiz struggle topics and flags them to teachers; Claude generates differentiated practice problems; and a teacher dashboard shows per-student progress.

## Integrations Required
- `ANTHROPIC_API_KEY` — student chatbot + problem generation
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Sheets data source

## n8n Workflow Nodes

### Flow: Struggle Detection & Flagging

1. **Schedule Trigger** — Every school day at 4pm

2. **Google Sheets: Read Gradebook** — all students, last 7 days

3. **Code: Identify Struggling Students** (`n8n-nodes-base.code`)
   - Flag students with: avg score < 70% OR score declining 3 weeks in a row
   - Group by weak topics

4. **Gmail: Alert Teacher** (`n8n-nodes-base.gmail`)
   - "⚠️ 3 students struggling with Fractions this week: [names]. Consider a review session."

5. **HTTP Request: Generate Practice Problems** (OpenRouter)
   - Per struggling student: "Generate 3 practice problems on {{weak_topic}} for a {{grade}} student. Difficulty: {{below_avg}}. Include answers."

6. **Gmail: Send Problems to Student/Parent** (`n8n-nodes-base.gmail`)
   - "Hi {{student_name}}, here are some extra practice problems on {{topic}} to help you prepare..."

## Claude Code App
Build `workflows/education/student_chat.html`:
- Chat interface: student types a question about any lesson topic
- System prompt: "You are a patient, encouraging tutor for {{grade}} students. Explain concepts clearly. When a student is stuck, ask guiding questions before giving the answer."
- Claude API call via fetch() to a simple n8n webhook that proxies to OpenRouter
- Keep chat history in sessionStorage

Build `workflows/education/teacher_dashboard.html`:
- Class roster with per-student: avg score, trend (↑↓), red flags
- Data source: Google Sheet read via n8n GET webhook
- Filter by week, subject, score range
- Click student → see full quiz history + AI-generated summary of struggles

## Claude AI Tasks
- Student chat responses (real-time, via webhook)
- Differentiated practice problem generation (step 5)

## Python Tools Needed
- `google_sheets.py` — read gradebook for dashboard
- `claude_ai.py --action generate` — test problem generation prompts

## Test Plan
1. Open student_chat.html in browser, ask "What is photosynthesis?" — verify Claude responds
2. Add test gradebook rows with scores < 70% — trigger struggle detection — verify teacher email
3. Open teacher_dashboard.html — verify student list loads with correct scores
