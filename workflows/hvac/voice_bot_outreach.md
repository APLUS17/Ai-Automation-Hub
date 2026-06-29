# HVAC — Voice Bot Outreach (Weather-Triggered → Past Customers → Book via ServiceTitan)

## What It Does
Monitors OpenWeather forecasts for target zip codes. When temps exceed 92°F or drop below 15°F for 48+ hours, automatically pulls past customers from CRM (systems 10+ years old, serviced in last 2 seasons), triggers Vapi.ai/Bland.ai outbound calls offering preventive tune-ups, books directly into ServiceTitan, and sends SMS follow-up to no-answers.

**Market context**: An 8-truck HVAC operation gets 80+ calls in 48 hours during a heat wave. A database of 2,400 past customers who'd book preventive maintenance sits untouched — because no one has time to call. This workflow captures that revenue before the spike peaks.

## Integrations Required
- `BLAND_API_KEY` or Vapi.ai key (voice call agent — Vapi preferred for ServiceTitan integration)
- `GOOGLE_SERVICE_ACCOUNT_JSON` (lead list if CRM not connected) or ServiceTitan/FieldEdge API
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` (SMS follow-up)
- OpenWeather API key (free tier sufficient)
- n8n for orchestration

## n8n Workflow Nodes

1. **Schedule Trigger** (`n8n-nodes-base.scheduleTrigger`)
   - Every hour, 6am–10pm daily

2. **HTTP Request: OpenWeather Forecast** (`n8n-nodes-base.httpRequest`)
   - GET `https://api.openweathermap.org/data/2.5/forecast?zip=45069,US&appid={{OPENWEATHER_KEY}}`
   - Check target Cincinnati ZIPs: 45069, 45040, 45246, 45011, 45005
   - Trigger condition: forecast exceeds 92°F OR drops below 15°F for 48+ consecutive hours

3. **IF: Weather Threshold Met?** (`n8n-nodes-base.if`)
   - If no threshold → stop. If yes → continue to pull call list.

4. **Google Sheets / CRM: Read Eligible Customers** (`n8n-nodes-base.googleSheets`)
   - Filter: system age 10+ years, had service in past 2 seasons, not contacted in 30 days
   - Limit: 300–600 per outreach batch

5. **Split In Batches** (`n8n-nodes-base.splitInBatches`)
   - batch size: 1

6. **HTTP Request: Bland.ai / Vapi.ai Call** (`n8n-nodes-base.httpRequest`)
   - POST `https://api.bland.ai/v1/calls`
   - Header: `authorization: {{BLAND_API_KEY}}`
   - Body:
     ```json
     {
       "phone_number": "={{$json.phone}}",
       "task": "Hi, this is Sarah from [Company], we're reaching out to check on your AC/heating system before the upcoming weather. We're offering existing customers a priority tune-up slot this week. Are you interested in scheduling?",
       "model": "enhanced",
       "voice": "nat",
       "webhook": "https://35.238.129.106:5678/webhook/bland-callback"
     }
     ```
   - On appointment confirm: bot books slot directly in ServiceTitan calendar

7. **Google Sheets: Update Status** (`n8n-nodes-base.googleSheets`)
   - Update row: Status = "Called", CallID = `{{$json.call_id}}`

--- (Separate webhook workflow for callback) ---

8. **Webhook Trigger** (receives Bland.ai/Vapi post-call data)
   - Path: `/bland-callback`

9. **IF: Outcome Branch** (`n8n-nodes-base.if`)
   - Booked → log in ServiceTitan, send confirmation SMS
   - Interested but not booked → Twilio SMS with booking link 30 min later
   - No answer → Twilio SMS: "We tried calling about your [AC/heating] before the weather forecast. Book here: {{BOOKING_LINK}}"
   - Not interested → update CRM, suppress for 30 days

10. **Twilio: SMS Follow-up** (`n8n-nodes-base.twilio`)
    - To: `{{$json.to}}`
    - Message varies by branch (see above)

11. **Google Sheets: Log Outcome** (`n8n-nodes-base.googleSheets`)
    - Update: Status, Outcome, transcript summary

## Claude AI Tasks
- Post-call: summarize transcript, extract intent signal for ambiguous responses ("maybe", "call me back", "not sure")
- Classify outcome into: Booked / Interested / No Answer / Not Interested / Wrong Number

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
