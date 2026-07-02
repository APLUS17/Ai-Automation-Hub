# Auto Repair — AI Receptionist: Missed Call Recovery & Booking (Inbound → SMS in 2 min → Book via Tekmetric)

## What It Does
When an inbound call is missed (after hours or during busy periods), n8n fires an SMS to the customer within 2 minutes. Claude classifies the customer's reply by urgency and intent, Vapi.ai follows up with a voice call if needed, and the appointment is booked directly in Tekmetric — all before the shop opens the next morning. A secondary nightly workflow also proactively reaches past customers approaching service intervals.

**Market context**: Fairfield, OH has 10+ auto repair shops on Dixie Highway. Seven have no online booking, six have minimal digital presence. 78% of customers book with the first shop that responds. After-hours callers hit voicemail and are booked with competitors by 8 AM. This workflow makes the shop the first to respond — every time, automatically.

## Integrations Required
- Vapi.ai or Toma API key (voice call agent)
- Tekmetric or Shop-Ware API (shop management system — calendar + repair order data)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` (SMS)
- `ANTHROPIC_API_KEY` (intent classification)
- CARFAX for Shops API (optional — vehicle history and service interval data)
- `AIRTABLE_API_KEY` / HubSpot (CRM logging)

## n8n Workflow Nodes

### Workflow A: Nightly Proactive Outreach

1. **Schedule Trigger** (`n8n-nodes-base.scheduleTrigger`)
   - Every night at 8:00 PM

2. **HTTP Request: Query Tekmetric for Due Customers** (`n8n-nodes-base.httpRequest`)
   - GET repair orders; filter by last visit mileage + estimated monthly mileage
   - Service intervals: oil change 5k mi, brake inspection 30k mi, timing belt 60k mi
   - Exclude anyone contacted in last 45 days

3. **Code: Build Outreach List** (`n8n-nodes-base.code`)
   - Dedupe, limit to 20–50 contacts per run
   - Output: `[{ name, phone, vehicle_year, vehicle_make, vehicle_model, service_due, last_visit_date }]`

4. **Split In Batches** (`n8n-nodes-base.splitInBatches`)
   - Batch size: 1

5. **HTTP Request: Vapi.ai Outbound Call** (`n8n-nodes-base.httpRequest`)
   - POST `https://api.vapi.ai/call/phone`
   - Body:
     ```json
     {
       "phoneNumberId": "{{VAPI_PHONE_ID}}",
       "customer": { "number": "={{$json.phone}}", "name": "={{$json.name}}" },
       "assistantId": "={{VAPI_ASSISTANT_ID}}",
       "assistantOverrides": {
         "firstMessage": "Hi {{$json.name}}, this is Alex calling from [Shop Name] on Dixie Highway. We serviced your {{$json.vehicle_year}} {{$json.vehicle_make}} {{$json.vehicle_model}} back in {{$json.last_visit_date}}, and based on your mileage you're probably coming up on your next {{$json.service_due}} soon. Did you want to get that scheduled before it becomes an issue?"
       }
     }
     ```
   - Webhook callback: `http://35.238.129.106:5678/webhook/vapi-callback`

6. **Airtable: Log Outreach Attempt** (`n8n-nodes-base.airtable`)
   - Log: name, phone, vehicle, service_due, call_id, status = "Called", timestamp

---

### Workflow B: Vapi Callback Handler (Separate Webhook Workflow)

7. **Webhook Trigger** (`n8n-nodes-base.webhook`)
   - Path: `/vapi-callback`
   - Receives: call outcome, transcript, appointment booked (true/false), symptoms mentioned

8. **Claude: Classify Intent** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - System: "Classify this auto repair call transcript. Output JSON: { outcome: 'booked'|'interested'|'declined'|'no_answer'|'urgent', symptoms: string|null, urgency: 1-10 }"
   - Input: `{{$json.transcript}}`

9. **IF: Outcome Branch** (`n8n-nodes-base.if`)
   - `booked` → confirm in Tekmetric + send confirmation SMS
   - `urgent` (urgency ≥ 8) → immediately offer next-day slot, escalate to staff SMS
   - `interested` → Twilio SMS with booking link 30 min later
   - `declined` → log, suppress for 45 days
   - `no_answer` → Twilio SMS follow-up: *"Hi [Name], we tried calling about your [vehicle]'s upcoming [service]. Reply YES to book or STOP to opt out."*

10. **HTTP Request: Book in Tekmetric** (`n8n-nodes-base.httpRequest`)
    - POST appointment to Tekmetric calendar with vehicle, service type, customer info

11. **Twilio: SMS Confirmation** (`n8n-nodes-base.httpRequest`)
    - Body: *"Confirmed! Your [service] for your [vehicle] is booked at [Shop Name], [address]. Tech: [name]. See you [date] at [time]. Reply STOP to opt out."*

12. **Airtable: Update Record** (`n8n-nodes-base.airtable`)
    - Update call record with outcome, appointment_id, symptoms

---

### Workflow C: After-Hours Inbound Recovery (Separate Webhook Workflow)

13. **Webhook Trigger** (`n8n-nodes-base.webhook`)
    - Path: `/missed-call`
    - Triggered by Twilio missed call forwarding or Vapi after-hours handler

14. **Twilio: Immediate SMS Recovery** (`n8n-nodes-base.httpRequest`)
    - Fires within 2 minutes
    - Body: *"Hi [Name], thanks for calling [Shop Name]! We're closed right now but want to make sure you're taken care of. Reply with your vehicle issue and preferred time and we'll confirm your appointment first thing in the morning."*

15. **Wait: 8 Hours** (`n8n-nodes-base.wait`)
    - If no reply by morning staff arrival

16. **IF: Reply Received?** (`n8n-nodes-base.if`)
    - Yes → trigger Vapi follow-up call or queue for staff
    - No → log as unrecovered missed call

---

### Workflow D: Post-Repair Review & Reactivation

17. **Webhook Trigger** (`n8n-nodes-base.webhook`)
    - Path: `/repair-complete`
    - Tekmetric fires on repair order close

18. **Twilio: Thank-You SMS** (`n8n-nodes-base.httpRequest`)
    - Same day: *"Thanks for trusting [Shop Name] with your [vehicle], [Name]! [Tech name] enjoyed working with you. Drive safe!"*

19. **Wait: 24 Hours** (`n8n-nodes-base.wait`)

20. **Twilio: Google Review Request** (`n8n-nodes-base.httpRequest`)
    - *"Hi [Name], we'd love your feedback! A quick Google review helps other Fairfield families find a shop they can trust: [link]. Takes 60 seconds and means a lot to our team."*

21. **Wait: 90 Days** (`n8n-nodes-base.wait`)

22. **Claude: Personalized Check-In** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Prompt: "Write a friendly 2-sentence SMS check-in for [Name] whose [year] [make] [model] had [services performed] 90 days ago. Mention something specific about the service and ask if everything is still running well."

23. **Twilio: Send Check-In SMS** (`n8n-nodes-base.httpRequest`)

## Test Plan
1. Seed Airtable/Tekmetric with a test customer record (vehicle with oil change due)
2. Trigger nightly schedule manually — verify outreach list builds correctly
3. Confirm Vapi call fires to test number with correct vehicle details in script
4. Simulate booked outcome via webhook → verify Tekmetric appointment created + confirmation SMS received
5. Simulate `no_answer` → verify follow-up SMS fires within 30 min
6. POST a test repair-complete webhook → verify thank-you SMS, then 24h review request, then 90d check-in queued
7. Test after-hours missed call → verify recovery SMS within 2 minutes

## Positioning
*"Never Miss Another Repair Call: Our AI Voice Agent answers every inbound call in under 30 seconds, books the appointment, and automatically follows up with your past customers — so your bays stay full even when you're under a car."*
