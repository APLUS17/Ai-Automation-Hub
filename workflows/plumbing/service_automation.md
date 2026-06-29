# Construction & Plumbing Services — Content Engine & Lead Follow-Up

## What It Does
Two-part workflow: (1) After each project, techs upload 3–5 photos and a brief description. Claude generates a case study, a 300-word local SEO page, and 3 social posts emphasizing neighborhood, problem, and outcome. Content auto-publishes to the site's Projects section and feeds into the social calendar. (2) When a homeowner submits a quote form, n8n logs the lead and immediately sends a confirmation SMS. Claude drafts discovery questions tailored to the project type. Once answers arrive, n8n assigns the lead to the right estimator—ensuring every inbound lead gets a response before competitors.

**Market context**: Small contractors do excellent work but never document it—leaving websites sparse and undermining trust. Zero content is created per job under manual processes; automated content engines drive +35% organic leads from SEO pages. Meanwhile, manual lead response takes 24–72 hours vs. under 60 seconds with automation, improving conversion rates by +28%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for content generation and discovery questions
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — content assets log, lead tracking
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Google Docs/Drive for content storage
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — instant lead confirmation SMS
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — discovery email, estimator assignment

## n8n Workflow Nodes

### Flow 1: Contractor Content Engine

1. **Webhook Trigger: Job Complete** (`n8n-nodes-base.webhook`)
   - Receives: job_type, description, neighborhood, city, photos[], outcome_summary

2. **Code: Collect Photos + Description** (`n8n-nodes-base.code`)
   - Normalize photo URLs and combine with job context

3. **Claude: Generate Case Study + Posts** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Generate: (a) case study with before/after narrative, (b) 300-word local SEO page targeting "{{job_type}} in {{neighborhood}}", (c) 3 social posts with hooks
   - Tailor content by city, job type, and outcome for hyperlocal search relevance

4. **HTTP Request: Publish to CMS** (`n8n-nodes-base.httpRequest`)
   - POST case study and SEO page to website CMS API

5. **Airtable: Log Content Asset** (`n8n-nodes-base.airtable`)
   - Record: content_type, publish_date, job_reference, url

6. **HTTP Request: Push to Social Scheduler** (`n8n-nodes-base.httpRequest`)
   - Queue posts in Buffer/Hootsuite via API

### Flow 2: Renovation Lead Follow-Up

7. **Webhook Trigger: Quote Form** (`n8n-nodes-base.webhook`)
   - Receives: name, email, phone, project_type, description, suburb

8. **Airtable: Create Lead** (`n8n-nodes-base.airtable`)
   - Log lead with timestamp, source, status = "New"

9. **Twilio: Instant Confirmation SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, thanks for reaching out! We received your {{project_type}} request and will follow up shortly."

10. **Claude: Draft Discovery Questions** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Draft 5–7 targeted questions about photos, budget, timeline based on the job type and suburb context

11. **Mailgun: Send Discovery Email** (`n8n-nodes-base.httpRequest`)
    - Professional email with Claude-generated questions and scheduling CTA

12. **Wait: 48 Hours** (`n8n-nodes-base.wait`)
    - Allow time for homeowner response

13. **IF: Response Received** (`n8n-nodes-base.if`)
    - YES → assign to estimator
    - NO → send reminder SMS

14. **Mailgun: Assign to Estimator** (`n8n-nodes-base.httpRequest`)
    - Internal email with lead summary and project fit signals

## Claude AI Tasks
- Generate case study copy, local SEO page text, and 3 social posts from job photos and description
- Tailor content by city, job type, and outcome for hyperlocal search relevance
- Draft personalized discovery emails with project-specific questions
- Generate lead summaries for estimators including key details and project fit signals

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test webhook with job description and photo URLs
2. Verify Claude returns case study, SEO page, and 3 social posts
3. Confirm CMS publish HTTP request receives 200 status
4. Check Airtable log has the new content asset entry
5. Submit test quote form for a bathroom remodel
6. Verify confirmation SMS arrives within 60 seconds
7. Check discovery email is sent and personalized to the project type
8. Simulate homeowner response and confirm estimator assignment email fires
