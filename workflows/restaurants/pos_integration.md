# Restaurants & Food Service — Reservation & POS Integration

## What It Does
Two-part workflow: (1) Pulls reservations from Google Maps, Yelp, OpenTable, and phone logs. Claude suggests table assignments based on party size and constraints. n8n sends SMS confirmations and 2-hour reminders. Walk-in wait times adjust dynamically. (2) DoorDash, Uber Eats, and direct orders feed in real-time. Claude maps order items to POS PLU codes, pushing them into the kitchen queue while decrementing inventory.

**Market context**: Host stands juggle multiple reservation platforms, leading to overbooking and empty tables during peak hours. Reservation SMS reminders drop no-show rates from ~22% to ~8%. For delivery, manual order entry into POS causes ~6% error rates and slows kitchens. Normalizing and pushing orders automatically drops error rates to ~0.5% and improves kitchen speed by 3–5 minutes/order.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for table suggestions and PLU mapping
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — occupancy database, POS PLU catalog, inventory
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — confirmation SMS, low stock alerts
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — reservation confirmation emails

## n8n Workflow Nodes

### Flow 1: Reservation Handling & Table Optimization

1. **Webhook Trigger: New Reservation** (`n8n-nodes-base.webhook`)
   - Receives: customer, party_size, reservation_time, platform, requests

2. **Airtable: Add to Reservation Queue** (`n8n-nodes-base.airtable`)
   - Record reservation details with status = "Pending"

3. **Claude: Suggest Table Assignment** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Analyze party size, preferences (booth vs. patio), and current table layout to suggest assignments
   - Generate wait time updates

4. **Twilio: Confirmation SMS** (`n8n-nodes-base.httpRequest`)
   - "Hi {{name}}, your table for {{party_size}} is confirmed for {{time}} at {{restaurant}}. See you soon!"

5. **Schedule Trigger: 2-Hour Reminder** (`n8n-nodes-base.scheduleTrigger`)
   - Runs continuously, checking bookings 2 hours away

6. **Twilio: Reminder SMS** (`n8n-nodes-base.httpRequest`)
   - Send reminder with parking info and "reply CANCEL if your plans changed"

7. **Webhook Trigger: Party Seated** (`n8n-nodes-base.webhook`)
   - Host clicks seat party

8. **Airtable: Update Occupancy** (`n8n-nodes-base.airtable`)
   - Mark table occupied, decrement available seats

### Flow 2: Delivery Platform POS Integration

9. **Webhook Trigger: DoorDash Order** (`n8n-nodes-base.webhook`)
   - DoorDash order payload

10. **Webhook Trigger: Uber Eats Order** (`n8n-nodes-base.webhook`)
    - Uber Eats order payload

11. **Claude: Normalize to POS PLUs** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
    - Prompt: "Map delivery items: {{items}} to correct POS PLUs from this list: {{plu_list}}. Handle naming variations."
    - Output: clean list of PLUs and quantities

12. **HTTP Request: Push to POS Kitchen Queue** (`n8n-nodes-base.httpRequest`)
    - Inject normalized orders directly to POS printer/kitchen display API

13. **Airtable: Decrement Inventory** (`n8n-nodes-base.airtable`)
    - Deduct ingredients used for ordered PLUs

14. **IF: Low Stock Alert** (`n8n-nodes-base.if`)
    - If inventory is below threshold, trigger alert

15. **Twilio: Alert Manager Low Stock** (`n8n-nodes-base.httpRequest`)
    - SMS manager to reorder ingredients

## Claude AI Tasks
- Suggest optimal table assignments based on party size, preferences, and current floor plan layout
- Map delivery platform item names to correct POS PLU codes, handling naming variations
- Generate plain-language supplier alert messages when stock falls below thresholds

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Submit a test reservation webhook with a party of 6
2. Verify Claude suggests an appropriate table assignment
3. Trigger 2-hour reminder and verify SMS fires with parking info
4. Send a simulated DoorDash webhook with 3 menu items
5. Verify Claude maps items to correct POS PLU codes andPOS API updates
6. Set inventory below threshold and verify manager SMS fires
