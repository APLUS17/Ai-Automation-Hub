# Commercial Laundries — Pickup & Delivery Route Automation

## What It Does
Compiles daily pickup and delivery stops from restaurants, clinics, and hotels by address and time window, clusters them geographically using Google Maps API, and sequences optimized routes per truck. Crews receive their run sheets automatically via SMS, and the system tracks on-time performance per account for SLA reporting.

**Market context**: Commercial laundries planning routes manually to restaurants, clinics, and hotels waste truck miles and miss delivery windows—creating inconsistent service that damages long-term contracts. Route planning takes 1–2 hours each morning instead of minutes. Optimized routing saves 15–25% in miles and improves on-time rates by 12%.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for route optimization and run sheet generation
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — stop records and route plan logging
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` — SMS run sheets to drivers

## n8n Workflow Nodes

1. **Schedule Trigger: Daily** (`n8n-nodes-base.scheduleTrigger`)
   - Mode: daily at 5:30am (before first route)

2. **Airtable: Get Today's Stops** (`n8n-nodes-base.airtable`)
   - Query all active stops for today: account_name, address, time_window, priority, service_type

3. **HTTP Request: Google Maps Distance Matrix** (`n8n-nodes-base.httpRequest`)
   - POST to Google Maps Distance Matrix API with all stop addresses
   - Returns drive time and distance between every pair of stops

4. **Code: Cluster & Sequence Stops** (`n8n-nodes-base.code`)
   - JS: group stops by geographic cluster, assign to trucks by capacity
   - Respect time windows and priority flags

5. **Claude: Assign Optimized Routes** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Prompt: "Given these stop clusters with time windows and distances, assign optimal routes per truck. Rules: (1) Honor all time windows, (2) Minimize total drive time, (3) Priority stops first. Output: per-truck stop sequence with estimated arrival times."

6. **Twilio: SMS Run Sheet to Driver** (`n8n-nodes-base.httpRequest`)
   - Per truck: "Today's route: 1. {{stop1}} (6:30am) → 2. {{stop2}} (7:15am) → ... Total stops: {{count}}"

7. **Airtable: Log Route Plan** (`n8n-nodes-base.airtable`)
   - Store: route_date, truck_id, stops_assigned, total_miles, total_time

## Claude AI Tasks
- Assign optimized stop sequences per truck honoring time windows and priority flags
- Summarize route plans into driver-friendly SMS run sheets

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Load 10 test stops with addresses and time windows into Airtable
2. Trigger schedule manually and verify Google Maps API call succeeds
3. Confirm Claude produces distinct routes per truck with no time-window conflicts
4. Verify driver SMS arrives with correct stop sequence
