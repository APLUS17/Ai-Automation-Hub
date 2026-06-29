# Water Damage / Remodeling — Damage Detection Automation

## What It Does
Field technician sends a photo to a webhook. Claude Vision classifies the damage type, severity, and estimated affected area. n8n populates a damage report template and notifies the estimator via Slack and email with the summary and photo.

## Integrations Required
- `ANTHROPIC_API_KEY` — Vision analysis
- `GOOGLE_SERVICE_ACCOUNT_JSON` — Google Docs report template
- `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` — estimator notification
- Gmail OAuth2 — email notification

## n8n Workflow Nodes

1. **Webhook Trigger** (`n8n-nodes-base.webhook`)
   - Path: `/damage-report`
   - Accepts: multipart/form-data with photo + job metadata (address, tech_name, job_id)
   - Or: photo uploaded to shared Google Drive folder → Drive trigger

2. **HTTP Request: Claude Vision** (`n8n-nodes-base.httpRequest`)
   - POST to OpenRouter with image (base64 encoded)
   - Model: `anthropic/claude-sonnet-4-6`
   - Prompt: "Analyze this water damage photo. Return JSON: {damage_type: string, severity: 'minor'|'moderate'|'severe', estimated_sq_ft: number, affected_materials: [string], recommended_actions: [string], confidence: number}"
   - Parse response JSON

3. **Google Docs: Create Report** (`n8n-nodes-base.googleDocs`)
   - Copy damage report template
   - Replace: {{job_id}}, {{address}}, {{tech_name}}, {{date}}, {{damage_type}}, {{severity}}, {{sq_ft}}, {{materials}}, {{actions}}

4. **Google Drive: Upload Photo to Report Folder** (`n8n-nodes-base.httpRequest`)
   - Store photo alongside report doc

5. **Slack: Notify Estimator** (`n8n-nodes-base.slack`)
   - Message: "📸 New damage report — Job #{{job_id}} at {{address}} | {{severity}} {{damage_type}} (~{{sq_ft}} sq ft) | Tech: {{tech_name}}"
   - Attach: image URL

6. **Gmail: Send Summary** (`n8n-nodes-base.gmail`)
   - To: estimator email
   - Subject: "Damage Assessment Ready — Job #{{job_id}}"
   - Body: summary + link to Google Doc report

## Claude AI Tasks
- Vision-based damage classification (step 2) — this is the core AI task

## Python Tools Needed
- `claude_ai.py --action image --image photo.jpg --prompt "Analyze water damage..."` — test vision before deploying
- `google_docs_pdf.py` — create/export damage reports programmatically

## Test Plan
1. `python tools/claude_ai.py image --image test_damage.jpg --prompt "Analyze water damage type, severity, sq ft"` — verify structured response
2. POST a test photo + fake job data to the webhook
3. Check Google Docs — report doc should be created with filled-in details
4. Verify Slack message arrived with damage summary
