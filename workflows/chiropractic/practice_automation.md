# Chiropractic — General Practice Automation

## What It Does
Intake form creates a new patient record and sends a confirm SMS/email. 24h before each appointment, a reminder SMS fires with directions. Post-visit: a review request + care plan follow-up email sends automatically. Patients inactive 60 days get a reactivation SMS.

## Integrations Required
- `GHL_API_KEY`, `GHL_LOCATION_ID` — patient CRM + appointment data
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS flows
- Gmail OAuth2 — email confirmations + care plan emails

## n8n Workflow Nodes

### Flow 1: Intake → New Patient Record

1. **Webhook Trigger** — intake form submission
   - Fields: first_name, last_name, email, phone, dob, chief_complaint, insurance, referral_source

2. **HTTP Request: GHL Create Contact** — new patient contact in GHL

3. **GHL: Assign to Pipeline** — "New Patients" stage

4. **Twilio: Confirmation SMS**
   - "Welcome to [Clinic Name], {{first_name}}! Your intake has been received. We'll see you soon. Text STOP to opt out."

5. **Gmail: Welcome Email**
   - Subject: "Welcome to [Clinic], {{first_name}}"
   - Body: welcome message, what to bring, parking, what to expect at first visit

### Flow 2: 24h Appointment Reminder

6. **Schedule Trigger** — every day 9am

7. **HTTP Request: GHL Get Tomorrow's Appointments** — query calendar API

8. **Split In Batches** — one per appointment

9. **Twilio: Reminder SMS** (`n8n-nodes-base.twilio`)
   - "Reminder: You have a chiro appointment tomorrow at {{time}} with Dr. {{provider}}. Address: {{clinic_address}}. Reply CONFIRM or CANCEL."

### Flow 3: Post-Visit Follow-Up

10. **Webhook Trigger** — appointment marked "Completed" in GHL

11. **Wait 2 Hours** (`n8n-nodes-base.wait`)

12. **Gmail: Review Request + Care Plan Email**
    - "Hi {{first_name}}, great seeing you today! [1] Please take 60 sec to leave us a Google review: [link]. [2] Here's your care plan reminder: {{care_plan_notes}}"

### Flow 4: Reactivation (60-Day Inactive)

13. **Schedule Trigger** — Every Monday

14. **Python Tool / HTTP Request: GHL Inactive Patients** — patients with last_visit > 60 days ago

15. **Twilio: Reactivation SMS**
    - "Hi {{first_name}}, it's been a while! We'd love to check in on your progress. Book a follow-up: {{BOOKING_LINK}}"

16. **GHL: Tag "Reactivation Sent"**

## Python Tools Needed
- `ghl_crm.py --action inactive --days 60` — pull inactive patients
- `twilio_sms.py` — test all SMS templates

## Test Plan
1. Submit a test intake form — verify GHL contact created + confirmation SMS received
2. Add a test appointment for tomorrow in GHL — run reminder flow — verify SMS received
3. Mark appointment "Completed" in GHL — wait 2h — verify follow-up email with review link
4. Set test contact last_visit to 61 days ago — run reactivation — verify SMS received
