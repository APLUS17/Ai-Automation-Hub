# Churches & Faith-Based Orgs — Visitor Onboarding Workflow

## What It Does
Digitizes visitor card data into Airtable, then Claude generates personalized 4–6 week welcome sequences covering relevant ministries, small groups, and service times. n8n schedules follow-up touchpoints including newcomer lunch invites, ministry connection prompts, and check-in messages—turning first-time visitors into engaged members without volunteer admin hours.

**Market context**: Churches collect visitor cards and online registrations but respond slowly, losing the window to integrate newcomers. Pastors and admin volunteers manually manage spreadsheets and send generic follow-ups weeks too late to build a real connection. Visitor retention without structured follow-up is ~15%; with a drip sequence it rises to ~45%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for personalized welcome sequence generation
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — visitor records and engagement tracking
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS touchpoints
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — email welcome sequence

## n8n Workflow Nodes

### Flow 1: Visitor Intake & Welcome

1. **Webhook Trigger: Visitor Form** (`n8n-nodes-base.webhook`)
   - Receives: name, email, phone, family_situation, interests, how_found_us, first_visit_date

2. **Airtable: Create Visitor Record** (`n8n-nodes-base.airtable`)
   - Table: "Visitors"
   - Status: "New Visitor", sequence_step: 0

3. **Claude: Generate Welcome Sequence** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Prompt: "Create a 4–6 week welcome sequence for {{name}}, who visited on {{first_visit_date}}. Family situation: {{family_situation}}. Interests: {{interests}}. Include relevant ministries, small group recommendations, service times, and newcomer events. Tone: warm, inviting, faith-appropriate. Output: array of touchpoints with timing, channel (email/SMS), and message content."

4. **Mailgun: Send Welcome Email** (`n8n-nodes-base.httpRequest`)
   - Day 1: "Thank you for visiting! Here's what to expect next Sunday..."
   - Personalized based on interests and family situation

### Flow 2: Automated Touchpoint Sequence

5. **Wait: 7 Days** (`n8n-nodes-base.wait`)
   - Pause before ministry connection prompt

6. **Twilio: Ministry Connection SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, we noticed you were interested in {{interest}}! Our {{ministry_name}} group meets {{schedule}}. Would you like to connect? Reply YES and we'll introduce you."

7. **Wait: 14 Days** (`n8n-nodes-base.wait`)
   - Pause before newcomer lunch invite

8. **Mailgun: Newcomers Lunch Invite** (`n8n-nodes-base.httpRequest`)
   - "You're invited to our Newcomers Lunch this {{date}}! It's a casual way to meet the pastoral team and other new families. RSVP here: {{link}}"

### Flow 3: Engagement Tracking

9. **Schedule Trigger** (`n8n-nodes-base.scheduleTrigger`)
   - Weekly: check for visitors who haven't engaged after 3 touchpoints

10. **Airtable: Get Unengaged Visitors** (`n8n-nodes-base.airtable`)
    - Filter: touchpoints_sent >= 3 AND responses = 0

11. **Twilio: Personal Check-in SMS** (`n8n-nodes-base.httpRequest`)
    - "Hi {{name}}, just checking in! We'd love to see you again. Is there anything we can help with? — Pastor {{pastor_name}}"

12. **Airtable: Update Engagement Status** (`n8n-nodes-base.airtable`)
    - Track: last_touchpoint_date, response_count, status (Active/Disengaged)

## Claude AI Tasks
- Generate personalized welcome sequences referencing family situation, interests flagged on visitor card, and relevant ministry programs
- Draft each touchpoint with appropriate tone for a faith-based context
- Suggest ministry and small group matches based on visitor interests and demographics

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test visitor form with name, interests (e.g., "youth ministry, volunteering"), and family info
2. Verify Airtable record created and welcome email arrives within 2 minutes
3. Simulate 7-day wait by adjusting schedule; confirm ministry connection SMS fires
4. Check that all 4–6 week touchpoints are queued correctly in n8n
5. Verify unengaged visitor check runs and personal check-in SMS is sent
