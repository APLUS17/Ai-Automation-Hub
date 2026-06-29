# Funeral Homes — First-Call Intake & Case Creation

## What It Does
Intake staff collect structured information via a guided form during the first call. n8n saves a complete case record to Airtable immediately, and Claude creates a concise summary with key decisions and next steps for the director—ensuring no details are lost during high-stress first conversations and eliminating repeated questions to grieving families.

**Market context**: Funeral homes manage first calls manually, making families repeat information as it passes between intake staff and directors. During high-stress moments, critical details get missed—creating errors in a process where precision and compassion are both non-negotiable. Data errors under manual intake run ~18%. A structured digital intake saves the director ~25 minutes of prep time per case.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for case summary generation
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — case records and task checklists
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — director notifications

## n8n Workflow Nodes

1. **Webhook Trigger: Intake Form Submit** (`n8n-nodes-base.webhook`)
   - Receives: decedent_name, dob, dod, next_of_kin, relationship, contact_phone, contact_email, service_type (burial/cremation/celebration_of_life), special_requests, clergy_preference, location_of_death

2. **Airtable: Create Case Record** (`n8n-nodes-base.airtable`)
   - Table: "Cases"
   - All intake fields + status = "New Case", created_at = now

3. **Claude: Generate Director Summary** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Prompt: "Create a concise case summary for funeral director review. Decedent: {{decedent_name}}, DOD: {{dod}}. Service type: {{service_type}}. Family contact: {{next_of_kin}} ({{relationship}}). Special requests: {{special_requests}}. Highlight: (1) key decisions needed, (2) immediate next steps, (3) any incomplete fields requiring follow-up. Tone: professional, respectful."
   - Flag incomplete fields or unusual circumstances

4. **Mailgun: Notify Director on Call** (`n8n-nodes-base.httpRequest`)
   - Subject: "New Case — {{decedent_name}}"
   - Body: Claude summary + link to full Airtable record

5. **Airtable: Generate Task Checklist** (`n8n-nodes-base.airtable`)
   - Based on service_type, create linked tasks: death certificate, permits, embalming/cremation authorization, obituary draft, flowers, music, reception venue, clergy coordination

## Claude AI Tasks
- Convert raw intake form responses into a structured case summary highlighting service type, family preferences, and immediate next steps for the director
- Flag incomplete fields or unusual circumstances requiring immediate attention

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test intake form with decedent information and service preferences
2. Verify Airtable case record created with all fields populated
3. Check that director notification email arrives with Claude-generated summary
4. Confirm task checklist is generated based on service type (burial vs. cremation should produce different checklists)
