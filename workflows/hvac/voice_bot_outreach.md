# HVAC — Voice Bot Outreach (Bland.ai → Lead List → SMS Follow-up)

## What It Does
Pulls a lead list from Google Sheets, triggers Bland.ai voice calls pitching seasonal HVAC tune-up offers, logs call outcomes, and auto-sends SMS with a booking link to interested leads via Twilio.

## Integrations Required
- `BLAND_API_KEY` (voice call agent)
- `GOOGLE_SERVICE_ACCOUNT_JSON` (lead list source)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` (SMS follow-up)
- n8n for orchestration

## n8n Workflow Nodes

1. **Schedule Trigger** (`n8n-nodes-base.scheduleTrigger`)
   - Weekdays 10am-4pm (calling hours)

2. **Google Sheets: Read Leads** (`n8n-nodes-base.googleSheets`)
   - Read leads where Status = "Not Called"
   - Limit 20 per batch (stay within calling capacity)

3. **Split In Batches** (`n8n-nodes-base.splitInBatches`)
   - batch size: 1

4. **HTTP Request: Bland.ai Call** (`n8n-nodes-base.httpRequest`)
   - POST `https://api.bland.ai/v1/calls`
   - Header: `authorization: {{BLAND_API_KEY}}`
   - Body:
     ```json
     {
       "phone_number": "={{$json.phone}}",
       "task": "You are calling on behalf of [HVAC Company]. Offer a seasonal AC tune-up special for $79 (normally $149). Ask if they're interested in scheduling. Be friendly and brief.",
       "model": "enhanced",
       "voice": "nat",
       "webhook": "https://35.238.129.106:5678/webhook/bland-callback"
     }
     ```

5. **Google Sheets: Update Status** (`n8n-nodes-base.googleSheets`)
   - Update row: Status = "Called", CallID = `{{$json.call_id}}`

--- (Separate webhook workflow for Bland.ai callback) ---

6. **Webhook Trigger** (receives Bland.ai post-call data)
   - Path: `/bland-callback`

7. **IF: Interested?** (`n8n-nodes-base.if`)
   - Check `$json.variables.interested == true` OR transcript contains "yes"/"schedule"

8. **Twilio: Send Booking SMS** (`n8n-nodes-base.twilio`)
   - To: `{{$json.to}}`
   - Message: "Hi! Thanks for your interest in our HVAC tune-up special. Book your appointment here: {{BOOKING_LINK}}"

9. **Google Sheets: Log Outcome** (`n8n-nodes-base.googleSheets`)
   - Update: Status = "Interested" or "Not Interested", Outcome = transcript summary

## Claude AI Tasks
- Post-call: summarize transcript, extract intent signal (for leads who spoke but unclear)

## Python Tools Needed
- `twilio_sms.py` — for testing SMS delivery
- `google_sheets.py` — loading/updating lead list outside n8n

## Test Plan
1. Add one test lead row to Google Sheet with your own phone number
2. Trigger n8n manually — should receive a Bland.ai call within 30 seconds
3. Say "yes I'm interested" — verify Twilio SMS arrives with booking link
4. Check Google Sheet — row should show Status = "Interested"

## Claude Code App
Not required. Optional: a simple call analytics dashboard showing call outcomes by day.
