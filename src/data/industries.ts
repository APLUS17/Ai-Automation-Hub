import { Industry } from "../types";

export const INDUSTRIES: Industry[] = [
  {
    "id": "auto-repair",
    "name": "Auto Repair Shops",
    "segment": "Industrial, Trades & Field Ops",
    "keywords": [
      "auto repair",
      "mechanic",
      "oil change",
      "tekmetric",
      "voice bot",
      "automotive",
      "shop management",
      "fairfield"
    ],
    "partners": [
      "Auto parts distributors — NAPA, O'Reilly, AutoZone (relationships with every independent shop)",
      "Local web design agencies serving Butler County (build sites but don't offer automation)",
      "Butler County insurance agents (refer customers to shops after claims)",
      "Fairfield City Economic Development Office (connects you with shop owners directly)",
      "Auto auction and fleet operators near I-75 (need shops with tight scheduling)"
    ],
    "builds": [
      {
        "label": "AI Receptionist — Missed Call Recovery & Booking",
        "steps": [
          { "t": "Webhook: Missed Inbound Call" },
          { "t": "Twilio: SMS Recovery (< 2 min)" },
          { "t": "Claude: Classify Customer Intent" },
          { "t": "IF: Urgent vs. Routine" },
          { "t": "HTTP Request: Check Tekmetric Calendar" },
          { "t": "Vapi.ai: Follow-Up Voice Call" },
          { "t": "IF: Appointment Confirmed" },
          { "t": "HTTP Request: Book in Tekmetric" },
          { "t": "Twilio: Booking Confirmation SMS" },
          { "t": "Airtable: Log Call Outcome" }
        ],
        "nodes": [
          { "name": "Webhook: Missed Inbound Call", "type": "n8n-nodes-base.webhook" },
          { "name": "Twilio: SMS Recovery (< 2 min)", "type": "n8n-nodes-base.httpRequest" },
          { "name": "Claude: Classify Customer Intent", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi" },
          { "name": "IF: Urgent vs. Routine", "type": "n8n-nodes-base.if" },
          { "name": "HTTP Request: Check Tekmetric Calendar", "type": "n8n-nodes-base.httpRequest" },
          { "name": "Vapi.ai: Follow-Up Voice Call", "type": "n8n-nodes-base.httpRequest" },
          { "name": "IF: Appointment Confirmed", "type": "n8n-nodes-base.if" },
          { "name": "HTTP Request: Book in Tekmetric", "type": "n8n-nodes-base.httpRequest" },
          { "name": "Twilio: Booking Confirmation SMS", "type": "n8n-nodes-base.httpRequest" },
          { "name": "Airtable: Log Call Outcome", "type": "n8n-nodes-base.airtable" }
        ],
        "aiTasks": "- Classify the customer's SMS reply: urgency (broken down / won't start = urgent, routine service = standard), intent (book now, get quote, ask question)\n- Draft a natural, conversational follow-up response that matches the customer's issue and offers the next available slot",
        "testPlan": "1. Simulate a missed call webhook from a test number after hours\n2. Verify recovery SMS arrives within 2 minutes with shop name and reply prompt\n3. Reply 'my brakes are grinding' — confirm Claude classifies as URGENT and follow-up offers next-morning slot\n4. Reply 'need an oil change sometime this week' — confirm ROUTINE classification and 2 time slot options\n5. Confirm appointment on reply → verify Tekmetric booking created and confirmation SMS received\n6. Let a missed call go unreplied for 8h → verify morning staff flag fires in Airtable",
        "gtm": [
          {
            "channel": "After-Hours Demo on Dixie Highway",
            "desc": "Call one of the 7 shops with no online booking at 6:30 PM and let it go to voicemail. Show them the recording side-by-side with what the AI receptionist would have done instead. Danco Transmission, Jeff's Automobile Repair, Mike's Auto Specialist, Relative Auto, Pleasant Run Service Center, Xpress Pro Tire, Fairfield Automotive."
          },
          {
            "channel": "Fairfield Chamber of Commerce",
            "desc": "Present at monthly member breakfasts at 701 Wessel Dr: 'How Fairfield Auto Shops Are Answering Every Call in Under 30 Seconds — Without Hiring Anyone.' Butler County SBDC can also connect you with vetted local shop owners."
          },
          {
            "channel": "Auto Parts Distributor Referrals",
            "desc": "Partner with NAPA, O'Reilly, and AutoZone Fairfield — they have relationships with every independent shop on Dixie Hwy and can refer you in exchange for co-marketing or a rev-share."
          }
        ],
        "problemSubheader": "Every after-hours call that hits voicemail is a booking lost to a competitor",
        "problemDescription": "When a customer's check engine light comes on at 6 PM, a typical independent shop has already closed — the call goes to voicemail, and by 8 AM the customer has booked with a competitor. 78% of customers go with the first shop that responds. The AI receptionist texts back within 2 minutes, qualifies the issue, pulls the real Tekmetric calendar, and books the appointment — so the shop wakes up to confirmed jobs, not missed calls.",
        "redditTitle": "r/MechanicAdvice - Called 3 shops after hours last night. Only one texted me back within minutes. Guess who I booked with.",
        "redditComments": "61 comments",
        "integrations": [
          "VAPI_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      },
      {
        "label": "Post-Repair Review & Reactivation",
        "steps": [
          { "t": "Webhook: Repair Order Closed" },
          { "t": "Twilio: Thank-You SMS (Same Day)" },
          { "t": "Wait: 24 Hours" },
          { "t": "Twilio: Google Review Request" },
          { "t": "Wait: 90 Days" },
          { "t": "Claude: Personalized Check-In" },
          { "t": "Twilio: Send Check-In SMS" },
          { "t": "Airtable: Update Customer Record" }
        ],
        "nodes": [
          { "name": "Webhook: Repair Order Closed", "type": "n8n-nodes-base.webhook" },
          { "name": "Twilio: Thank-You SMS", "type": "n8n-nodes-base.httpRequest" },
          { "name": "Wait: 24 Hours", "type": "n8n-nodes-base.wait" },
          { "name": "Twilio: Google Review Request", "type": "n8n-nodes-base.httpRequest" },
          { "name": "Wait: 90 Days", "type": "n8n-nodes-base.wait" },
          { "name": "Claude: Personalized Check-In", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi" },
          { "name": "Twilio: Send Check-In SMS", "type": "n8n-nodes-base.httpRequest" },
          { "name": "Airtable: Update Customer Record", "type": "n8n-nodes-base.airtable" }
        ],
        "aiTasks": "- Generate a personalized 2-sentence maintenance check-in SMS referencing the specific services performed and the vehicle's make/model — avoiding generic copy that reads like a mass blast",
        "testPlan": "1. POST a test repair-complete webhook with sample vehicle + service data\n2. Verify thank-you SMS received same day with technician name\n3. Advance wait node to confirm 24h review request SMS fires with correct Google review link\n4. Confirm Airtable record updated with sent_review_request = true\n5. Trigger 90-day check-in manually — verify Claude output is personalized and SMS sends",
        "gtm": [
          {
            "channel": "Shops with High Ratings but Few Reviews",
            "desc": "Relative Auto (4.9★, 31 reviews) and Mike's Auto Specialist (4.9★, 16 reviews) are leaving massive SEO value on the table. Lead with: 'You have the best shop on Dixie Hwy — but Google can't see you yet.'"
          },
          {
            "channel": "Post-Pilot Upsell",
            "desc": "Start prospects with just this workflow (no new software, no hardware, plugs into Tekmetric). After they see the review uptick and rebookings in month 1, upsell to the full voice bot outreach system."
          },
          {
            "channel": "CARFAX Service Network",
            "desc": "Shops enrolled in CARFAX's program are already digitally aware. Approach them with the review + reactivation workflow as the next step in their digital growth."
          }
        ],
        "problemSubheader": "Great shops are invisible on Google because no one asks for reviews",
        "problemDescription": "Shops with excellent service — like Relative Auto (4.9★) and Mike's Auto Specialist (4.9★) — have fewer than 35 Google reviews combined, making them invisible to new customers searching online. There's no systematic process to collect reviews or re-engage past customers after a visit, so repeat revenue and referral value go untapped.",
        "redditTitle": "r/AutoMechanic - My shop has 4.9 stars but only 18 reviews. Competitors with worse service rank above me. What am I missing?",
        "redditComments": "44 comments",
        "integrations": [
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      }
    ]
  },
  {
    "id": "accounting",
    "name": "Accounting / CPA Firms",
    "segment": "Professional Services",
    "keywords": [
      "cpa",
      "accounting",
      "quickbooks",
      "invoicing",
      "p&l",
      "bookkeeping",
      "finance"
    ],
    "partners": [
      "Business attorneys and law firms with shared SMB clients",
      "Payroll processing companies (ADP, Gusto resellers)",
      "CFO-as-a-service consultancies",
      "QuickBooks ProAdvisor networks"
    ],
    "builds": [
      {
        "label": "PO → P&L Automation",
        "steps": [
          {
            "t": "Gmail Trigger"
          },
          {
            "t": "Extract Attachment Text"
          },
          {
            "t": "Claude Extraction"
          },
          {
            "t": "IF: Has Required Fields"
          },
          {
            "t": "QuickBooks: Create Invoice"
          },
          {
            "t": "Google Sheets: Update P&L"
          },
          {
            "t": "Slack Notification"
          }
        ],
        "nodes": [
          {
            "name": "Gmail Trigger",
            "type": "n8n-nodes-base.gmailTrigger"
          },
          {
            "name": "Extract Attachment Text",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Claude Extraction",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "IF: Has Required Fields",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "QuickBooks: Create Invoice",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Google Sheets: Update P&L",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Slack Notification",
            "type": "n8n-nodes-base.slack"
          }
        ],
        "aiTasks": "- Field extraction from raw PO text/PDF (step 3)\n- Categorization of line items (e.g., Office Supplies, Services, Equipment)",
        "testPlan": "1. Send a test email with \"PO Test\" in subject + a simple text PO in body\n2. Check n8n execution log — all 7 nodes should show green\n3. Verify QuickBooks has a new draft invoice\n4. Verify P&L sheet has new row\n5. Check Slack for notification message",
        "gtm": [
          {
            "channel": "LinkedIn Direct Outreach",
            "desc": "Target solo CPA firm owners and practice managers experiencing manual data entry bottlenecks."
          },
          {
            "channel": "QuickBooks Community",
            "desc": "Provide guides and walkthroughs on QuickBooks forums showing how to automate incoming orders."
          },
          {
            "channel": "r/Accounting",
            "desc": "Engage in discussions about scaling small firm operations without hiring extra administrative help."
          }
        ],
        "problemSubheader": "CPAs spend hours copy-pasting PO data",
        "problemDescription": "Managing incoming PDFs of POs via email consumes hours of high-value CPA time. Accountants have to manually extract numbers, log into QuickBooks, update spreadsheets, and notify teammates of transaction updates.",
        "redditTitle": "r/Accounting - How do you automate incoming client invoices and POs?",
        "redditComments": "42 comments",
        "integrations": [
          "N8N_API_URL",
          "6xfr5f40H92Sj1Eb",
          "HhRl2tZkR2KwXqsT",
          "QB_CLIENT_ID",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "SLACK_BOT_TOKEN"
        ]
      }
    ]
  },
  {
    "id": "women-owned",
    "name": "Women-Owned Businesses",
    "segment": "Cross-Industry Infrastructure",
    "keywords": [
      "women-owned",
      "consulting",
      "ai audit",
      "small business",
      "entrepreneurship",
      "wbenc"
    ],
    "partners": [
      "Women's Business Enterprise National Council (WBENC) affiliates",
      "Local chambers of commerce women's divisions",
      "Female founder accelerator programs",
      "SBA Women-Owned Small Business resource centers"
    ],
    "builds": [
      {
        "label": "AI Leverage Consulting",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: Claude Report"
          },
          {
            "t": "Google Docs: Create Report from Template"
          },
          {
            "t": "HTTP Request: Export PDF"
          },
          {
            "t": "Mailgun: Send Report"
          },
          {
            "t": "Airtable: Log Client"
          },
          {
            "t": "Wait 7 Days"
          },
          {
            "t": "Mailgun: 7-Day Check-in"
          },
          {
            "t": "Wait 23 Days"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Report",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Docs: Create Report from Template",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "HTTP Request: Export PDF",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Send Report",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Airtable: Log Client",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Wait 7 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Mailgun: 7-Day Check-in",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 23 Days",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Full report generation (step 2) — this is the core deliverable; prompt quality matters most here",
        "testPlan": "1. Fill out audit_form.html as a test business (hair salon, 2 employees, biggest pain: booking + social media)\n2. Verify Claude recommendations are specific (not generic) — check that it recommends Calendly + Buffer\n3. Verify PDF arrives by email with branded layout\n4. Check Airtable — client row logged\n5. Advance n8n — verify 7-day check-in sends",
        "gtm": [
          {
            "channel": "Women's Business Councils",
            "desc": "Partner with organizations like WBENC to offer AI audits as a value-added member benefit."
          },
          {
            "channel": "Local Chambers",
            "desc": "Hold workshops on simple AI tools for small local business owners to generate local warm leads."
          },
          {
            "channel": "Female Founder Groups",
            "desc": "Engage on Slack and Facebook networks with free high-value AI consultation lead magnets."
          }
        ],
        "problemSubheader": "Women-led small businesses face a technology adoption gap",
        "problemDescription": "Small women-owned businesses want to implement AI to increase efficiency, but traditional IT consultants are prohibitively expensive. They need direct, customized, and automated AI assessments that can be generated in minutes.",
        "redditTitle": "r/WomenInBusiness - How can I run an AI audit on my boutique boutique?",
        "redditComments": "29 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "MAILGUN_API_KEY"
        ]
      }
    ]
  },
  {
    "id": "theater",
    "name": "Theater Groups",
    "segment": "Community, Nonprofit & Faith",
    "keywords": [
      "theater",
      "performing arts",
      "auditions",
      "box office",
      "volunteers",
      "nonprofit arts"
    ],
    "partners": [
      "Local arts councils and regional arts foundations",
      "Acting schools and performance training studios",
      "Event ticketing platforms (Eventbrite reps, PatronManager)",
      "Corporate sponsors of local arts organizations"
    ],
    "builds": [
      {
        "label": "Cost-Cutting Automations",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Code: Parse CSV"
          },
          {
            "t": "Google Sheets: Write Dashboard"
          },
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Google Sheets: Read Past Attendee List"
          },
          {
            "t": "Code: Filter Relevant Audiences"
          },
          {
            "t": "Gmail: Send Promo"
          },
          {
            "t": "Google Sheets Trigger"
          },
          {
            "t": "HTTP Request: Claude Schedule"
          },
          {
            "t": "Gmail: Send Schedule to Volunteers"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Code: Parse CSV",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Google Sheets: Write Dashboard",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Sheets: Read Past Attendee List",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Code: Filter Relevant Audiences",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Gmail: Send Promo",
            "type": "n8n-nodes-base.gmail"
          },
          {
            "name": "Google Sheets Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Schedule",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Gmail: Send Schedule to Volunteers",
            "type": "n8n-nodes-base.gmail"
          }
        ],
        "aiTasks": "None specified.",
        "testPlan": "1. Upload a test CSV via webhook — verify Sheet populated with totals\n2. Add test attendee emails to \"Audience CRM\" — trigger promo email — verify delivery\n3. Submit volunteer availability form → verify Claude assigns shift → volunteer email sent",
        "gtm": [
          {
            "channel": "Theater Associations",
            "desc": "Promote cost-cutting templates through regional theater networks and non-profit arts leagues."
          },
          {
            "channel": "Arts Council Newsletters",
            "desc": "Secure placements in local arts newsletters offering free ticket audit spreadsheets."
          },
          {
            "channel": "Direct Outreach",
            "desc": "Audit community theater websites and pitch the automated sync dashboard directly to directors."
          }
        ],
        "problemSubheader": "Non-profit theaters leak box office revenue on manual tracking",
        "problemDescription": "Local theater groups are run by volunteers who struggle to sync ticket sales spreadsheets with promotional email campaigns, leading to empty seats and missed fundraising opportunities.",
        "redditTitle": "r/theater - Free tools for scheduling auditions and volunteer coordinating?",
        "redditComments": "31 comments",
        "integrations": [
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "ANTHROPIC_API_KEY"
        ]
      },
      {
        "label": "General Process Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Airtable: Create Record"
          },
          {
            "t": "Gmail: Confirmation to Auditionee"
          },
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Google Sheets: Read Rehearsal Schedule"
          },
          {
            "t": "Gmail: Rehearsal Reminder"
          },
          {
            "t": "Twilio: SMS Reminder"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: Claude Press Release"
          },
          {
            "t": "Google Docs: Create Press Release Doc"
          },
          {
            "t": "Gmail: Send to Press List"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Airtable: Create Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Gmail: Confirmation to Auditionee",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Sheets: Read Rehearsal Schedule",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Gmail: Rehearsal Reminder",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Twilio: SMS Reminder",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Press Release",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Docs: Create Press Release Doc",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "Gmail: Send to Press List",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Press release drafting (step 9)\n- Optional: generate social media posts from press release",
        "testPlan": "1. Submit test audition form — verify Airtable record created in correct \"Role\" view\n2. Add tomorrow's rehearsal to schedule sheet — trigger nightly check — verify SMS + email\n3. Fire press release webhook with test show data — verify Google Doc created with formatted PR",
        "gtm": [
          {
            "channel": "Theater Director Forums",
            "desc": "Share casting automation templates on Facebook Groups and community theater subreddits."
          },
          {
            "channel": "Local Art Schools",
            "desc": "Partner with acting schools to provide a modern, automated audition signup portal for their students."
          },
          {
            "channel": "Case Studies",
            "desc": "Showcase how one theater saved 40 hours of admin work on their latest musical using Airtable + n8n."
          }
        ],
        "problemSubheader": "Auditions and casting pipelines are administrative nightmares",
        "problemDescription": "Managing audition registrations, talent headshots, contact information, and rehearsal reminders in disjointed spreadsheets consumes hundreds of volunteer hours per production.",
        "redditTitle": "r/acting - Why are community theater casting portals so outdated?",
        "redditComments": "56 comments",
        "integrations": [
          "AIRTABLE_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "ANTHROPIC_API_KEY"
        ]
      }
    ]
  },
  {
    "id": "water-damage",
    "name": "Water Damage / Remodeling",
    "segment": "Home Services",
    "keywords": [
      "water damage",
      "restoration",
      "remediation",
      "remodeling",
      "emergency",
      "flooding",
      "mold"
    ],
    "partners": [
      "Local plumbing companies (non-competing cross-referral)",
      "Home insurance agents and adjusters (State Farm, Allstate)",
      "General contractors and remodelers",
      "Home inspection companies"
    ],
    "builds": [
      {
        "label": "Upsell Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: Claude Upsell Message"
          },
          {
            "t": "Wait 3 Days"
          },
          {
            "t": "Twilio: Day 3 SMS"
          },
          {
            "t": "Wait 4 Days"
          },
          {
            "t": "Mailgun: Day 7 Email"
          },
          {
            "t": "Wait 7 Days"
          },
          {
            "t": "Twilio: Day 14 Final SMS"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Slack: Sales Rep Alert"
          },
          {
            "t": "Gmail: Send Booking Confirmation"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Upsell Message",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 3 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Twilio: Day 3 SMS",
            "type": "n8n-nodes-base.twilio"
          },
          {
            "name": "Wait 4 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Mailgun: Day 7 Email",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 7 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Twilio: Day 14 Final SMS",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Slack: Sales Rep Alert",
            "type": "n8n-nodes-base.slack"
          },
          {
            "name": "Gmail: Send Booking Confirmation",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Personalized upsell SMS + email generation at job completion (step 2)",
        "testPlan": "1. POST a fake job_completed event with damage_type = \"water infiltration\"\n2. Check n8n — Claude should generate a relevant mold prevention message\n3. Verify SMS sent (to test number), email queued\n4. Simulate a Mailgun click webhook — verify Slack fires sales rep alert",
        "gtm": [
          {
            "channel": "Plumbing Contractor Networks",
            "desc": "Establish referral programs with local plumbers who refer emergency mitigation jobs."
          },
          {
            "channel": "Restoration Associations",
            "desc": "Publish articles in trade magazines demonstrating the ROI of automated follow-up sequences."
          },
          {
            "channel": "GHL Communities",
            "desc": "Promote GHL pipeline templates tailored specifically for water damage rebuild sales."
          }
        ],
        "problemSubheader": "Restoration contractors miss out on highly profitable remodeling upsells",
        "problemDescription": "Emergency water mitigation companies do the immediate cleanup work but fail to follow up with homeowners about post-mitigation rebuild and remodeling contracts, letting competitors steal the job.",
        "redditTitle": "Restoration Forum - How are you converting dry-out jobs into rebuild contracts?",
        "redditComments": "19 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "MAILGUN_API_KEY",
          "SLACK_BOT_TOKEN"
        ]
      },
      {
        "label": "Damage Detection Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: Claude Vision"
          },
          {
            "t": "Google Docs: Create Report"
          },
          {
            "t": "Google Drive: Upload Photo to Report Folder"
          },
          {
            "t": "Slack: Notify Estimator"
          },
          {
            "t": "Gmail: Send Summary"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "HTTP Request: Claude Vision",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Google Docs: Create Report",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "Google Drive: Upload Photo to Report Folder",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Slack: Notify Estimator",
            "type": "n8n-nodes-base.slack"
          },
          {
            "name": "Gmail: Send Summary",
            "type": "n8n-nodes-base.gmail"
          }
        ],
        "aiTasks": "- Vision-based damage classification (step 2) — this is the core AI task",
        "testPlan": "1. `python tools/claude_ai.py image --image test_damage.jpg --prompt \"Analyze water damage type, severity, sq ft\"` — verify structured response\n2. POST a test photo + fake job data to the webhook\n3. Check Google Docs — report doc should be created with filled-in details\n4. Verify Slack message arrived with damage summary",
        "gtm": [
          {
            "channel": "Google Local Service Ads",
            "desc": "Run hyper-targeted local ads bidding on emergency restoration keywords with fast assessment CTAs."
          },
          {
            "channel": "Home Insurance Agents",
            "desc": "Form relationships with insurance adjusters who recommend fast-responding restoration firms."
          },
          {
            "channel": "SEO for Emergency Queries",
            "desc": "Create local landing pages optimized for 'flooded basement help' queries with photo upload widgets."
          }
        ],
        "problemSubheader": "Emergency dispatch speed determines restoration project wins",
        "problemDescription": "When home flooding occurs, homeowners call multiple contractors. The contractor who can classify damage from photos and provide a fast initial assessment wins the lucrative restoration contract.",
        "redditTitle": "r/Plumbing - Fast quoting for emergency water mitigation calls?",
        "redditComments": "38 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "SLACK_BOT_TOKEN"
        ]
      }
    ]
  },
  {
    "id": "ecommerce",
    "name": "E-Commerce",
    "segment": "Retail & Consumer Services",
    "keywords": [
      "shopify",
      "ecommerce",
      "inventory",
      "abandoned cart",
      "marketing",
      "social media",
      "product listings"
    ],
    "partners": [
      "Shopify partner agencies and web design firms",
      "Meta/Instagram ad agencies serving DTC brands",
      "3PL fulfillment providers (ShipBob, ShipMonk partners)",
      "E-commerce accountants and bookkeeping services"
    ],
    "builds": [
      {
        "label": "Product Process Automation",
        "steps": [
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "HTTP Request: Shopify Inventory"
          },
          {
            "t": "IF: Low Stock Items?"
          },
          {
            "t": "Gmail: Draft Supplier Reorder"
          },
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "HTTP Request: Shopify Products"
          },
          {
            "t": "Google Sheets: Write Inventory"
          },
          {
            "t": "Google Sheets Trigger"
          },
          {
            "t": "HTTP Request: Shopify Update Inventory"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Shopify Inventory",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "IF: Low Stock Items?",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Gmail: Draft Supplier Reorder",
            "type": "n8n-nodes-base.gmail"
          },
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Shopify Products",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Sheets: Write Inventory",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Google Sheets Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Shopify Update Inventory",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "None specified.",
        "testPlan": "1. Set one Shopify test product to qty = 2 (below threshold)\n2. Trigger daily check — verify Gmail draft created\n3. Trigger sync — verify Google Sheet populated with all products\n4. Edit qty in Google Sheet — verify Shopify inventory updated via API\n5. Open product_catalog.html — search for a product — verify instant results",
        "gtm": [
          {
            "channel": "Shopify App Communities",
            "desc": "Promote workflow integration guides in Shopify Community forums and Facebook circles."
          },
          {
            "channel": "E-commerce Podcasts",
            "desc": "Sponsor e-commerce operations podcasts demonstrating inventory automation tactics."
          },
          {
            "channel": "Direct Cold Outreach",
            "desc": "Target high-growth Shopify stores showing signs of stockouts and pitch them automated restocking."
          }
        ],
        "problemSubheader": "Low-stock events cause thousands in lost revenue and supplier friction",
        "problemDescription": "E-commerce stores lose customers when popular items go out of stock unexpectedly. Manually monitoring stock levels, emailing suppliers for reorders, and keeping catalogs in sync is a slow, error-prone cycle.",
        "redditTitle": "r/shopify - How do you handle automatic supplier reordering?",
        "redditComments": "64 comments",
        "integrations": [
          "SHOPIFY_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      },
      {
        "label": "Marketing Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: Claude Product Description"
          },
          {
            "t": "HTTP Request: Shopify Update Description"
          },
          {
            "t": "HTTP Request: Post to Instagram"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Wait 1 Hour"
          },
          {
            "t": "HTTP Request: Check if Order Placed"
          },
          {
            "t": "IF: Order Placed?"
          },
          {
            "t": "Mailgun: Email Day 1"
          },
          {
            "t": "Wait 1 Day"
          },
          {
            "t": "Wait 1 Day"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Wait 3 Days"
          },
          {
            "t": "Gmail: Review Request"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Product Description",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Shopify Update Description",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Post to Instagram",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 1 Hour",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "HTTP Request: Check if Order Placed",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "IF: Order Placed?",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Mailgun: Email Day 1",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 1 Day",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 1 Day",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 3 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Gmail: Review Request",
            "type": "n8n-nodes-base.gmail"
          }
        ],
        "aiTasks": "- Product description + social caption generation (step 2)",
        "testPlan": "1. Add a test product in Shopify dev store — verify Claude description attached within 1 min\n2. Create a test checkout, don't complete — wait 1h → verify abandoned cart email\n3. Create a fulfilled test order — wait 3 days (or advance n8n) → verify review request",
        "gtm": [
          {
            "channel": "Shopify Partner Agencies",
            "desc": "White-label the marketing sync workflow to Shopify web design agencies to upsell to clients."
          },
          {
            "channel": "Meta Ads Forums",
            "desc": "Share case studies of stores driving organic traffic using AI-generated cross-platform postings."
          },
          {
            "channel": "E-commerce Newsletters",
            "desc": "Sponsor newsletters targeting independent store founders with free caption-generation playbooks."
          }
        ],
        "problemSubheader": "Publishing new product listings across multiple channels is exhausting",
        "problemDescription": "When launching new SKUs, e-commerce managers spend hours writing SEO descriptions, generating social media captions, and posting manually across Facebook, Meta, and Instagram.",
        "redditTitle": "r/ecommerce - Best way to auto-post Shopify products to Meta/Insta?",
        "redditComments": "41 comments",
        "integrations": [
          "SHOPIFY_API_KEY",
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "MAILGUN_API_KEY"
        ]
      }
    ]
  },
  {
    "id": "hotels",
    "name": "Hotels",
    "segment": "Hospitality, Food & Venue",
    "keywords": [
      "hotels",
      "automation",
      "workflow",
      "hospitality, food & venue"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Early-Stage Market Research",
        "steps": [
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Set: Define Target Market"
          },
          {
            "t": "HTTP Request: Apify Booking.com Scraper"
          },
          {
            "t": "Code: Filter Independents"
          },
          {
            "t": "Airtable: Create Hotel Records"
          },
          {
            "t": "Airtable: Read Hotels"
          },
          {
            "t": "Split In Batches"
          },
          {
            "t": "HTTP Request: Apify TripAdvisor Reviews"
          },
          {
            "t": "HTTP Request: Claude Sentiment"
          },
          {
            "t": "Airtable: Store Pain Points"
          },
          {
            "t": "Firecrawl: Enrich Hotel Websites"
          },
          {
            "t": "Airtable: Update Hotel Records"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Set: Define Target Market",
            "type": "n8n-nodes-base.set"
          },
          {
            "name": "HTTP Request: Apify Booking.com Scraper",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Code: Filter Independents",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Airtable: Create Hotel Records",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Airtable: Read Hotels",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Split In Batches",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Apify TripAdvisor Reviews",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "HTTP Request: Claude Sentiment",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Airtable: Store Pain Points",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Firecrawl: Enrich Hotel Websites",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Update Hotel Records",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Sentiment analysis + pain point categorization per hotel (step 9)",
        "testPlan": "1. Run Booking.com scraper on test location (10 max results) — verify hotels returned\n2. Run TripAdvisor reviews for 1 hotel — verify 20+ reviews fetched\n3. Pass reviews to claude_ai.py sentiment — verify structured pain point JSON\n4. Check Airtable — Pain Points table populated correctly\n5. Open research_dashboard.html — verify all 3 panels load with real data",
        "gtm": [
          {
            "channel": "Independent Lodging Associations",
            "desc": "Pitch price intelligence workflows at independent lodging conferences and webinars."
          },
          {
            "channel": "Hospitality Tech Directories",
            "desc": "List the automated market research tool on hospitality software databases and review sites."
          },
          {
            "channel": "Direct General Manager Pitch",
            "desc": "Send general managers a free localized competitor pricing report to show immediate value."
          }
        ],
        "problemSubheader": "Independent hotels lose bookings to chains with dynamic pricing",
        "problemDescription": "Boutique and independent hotels cannot compete with large hotel chains that use automated competitor pricing crawlers. Managers waste hours manually checking Booking.com and Expedia rates.",
        "redditTitle": "r/HotelManagers - How to automate competitor price monitoring?",
        "redditComments": "27 comments",
        "integrations": [
          "APIFY_API_TOKEN",
          "FIRECRAWL_API_KEY",
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY"
        ]
      }
    ]
  },
  {
    "id": "appraisal",
    "name": "Property Appraisal",
    "segment": "Property, Facilities & Real Estate",
    "keywords": [
      "appraisal",
      "zillow",
      "real estate",
      "mls",
      "property",
      "appraiser",
      "realtor",
      "ghl"
    ],
    "partners": [
      "Real estate agents and brokers (referral partners)",
      "Mortgage lenders and loan officers",
      "Title companies and real estate attorneys",
      "Home inspection companies"
    ],
    "builds": [
      {
        "label": "Lead Gen (Zillow Scrape → Enrich → Dashboard)",
        "steps": [
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Set: Define Target Markets"
          },
          {
            "t": "Split In Batches"
          },
          {
            "t": "HTTP Request: Apify Zillow"
          },
          {
            "t": "Code: Filter by Criteria"
          },
          {
            "t": "HTTP Request: Firecrawl Enrich"
          },
          {
            "t": "Google Sheets: Append Leads"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Set: Define Target Markets",
            "type": "n8n-nodes-base.set"
          },
          {
            "name": "Split In Batches",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Apify Zillow",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Code: Filter by Criteria",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "HTTP Request: Firecrawl Enrich",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Google Sheets: Append Leads",
            "type": "n8n-nodes-base.googleSheets"
          }
        ],
        "aiTasks": "None specified.",
        "testPlan": "1. Run apify_runner locally with test location — verify 10+ leads returned\n2. Test firecrawl on one Zillow agent profile URL — verify email/phone extracted\n3. Trigger n8n workflow — verify new rows in Google Sheet\n4. Open lead_dashboard.html — verify data loads, filters work, \"Mark Contacted\" updates sheet",
        "gtm": [
          {
            "channel": "Appraisal Facebook Groups",
            "desc": "Share tutorials on how to build localized lead engines using Zillow APIs and n8n."
          },
          {
            "channel": "Local Real Estate Boards",
            "desc": "Provide appraisal valuation reports to local MLS boards as value-add resources for members."
          },
          {
            "channel": "LinkedIn Outreach",
            "desc": "Target solo appraisers and small appraisal groups struggling to maintain a full project pipeline."
          }
        ],
        "problemSubheader": "Appraisers waste hours scraping Zillow and filtering listings",
        "problemDescription": "Independent real estate appraisers spend half their week chasing leads on Zillow, cross-referencing MLS listings, and looking up property history on outdated tax databases.",
        "redditTitle": "Appraisers Forum - Automating lead lists from Zillow and MLS?",
        "redditComments": "34 comments",
        "integrations": [
          "APIFY_API_TOKEN",
          "FIRECRAWL_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      },
      {
        "label": "Follow-Up Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: GHL Create Contact"
          },
          {
            "t": "Mailgun: Email Day 1"
          },
          {
            "t": "Wait 2 Days"
          },
          {
            "t": "Mailgun: Email Day 3"
          },
          {
            "t": "Wait 2 Days"
          },
          {
            "t": "IF: Any Opens/Clicks?"
          },
          {
            "t": "Twilio: Day 5 SMS"
          },
          {
            "t": "Wait 2 Days"
          },
          {
            "t": "Mailgun: Day 7 Final Email"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: GHL Move Stage"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Wait 24 Hours"
          },
          {
            "t": "Twilio: Review Request SMS"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: GHL Create Contact",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Mailgun: Email Day 1",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait 2 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Mailgun: Email Day 3",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 2 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Any Opens/Clicks?",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Day 5 SMS",
            "type": "n8n-nodes-base.twilio"
          },
          {
            "name": "Wait 2 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Mailgun: Day 7 Final Email",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: GHL Move Stage",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 24 Hours",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Twilio: Review Request SMS",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Optional: personalize each email with Claude based on property type + agent context",
        "testPlan": "1. Add yourself as a test lead → verify day 1 email arrives\n2. Don't open it → advance n8n time → verify day 5 SMS arrives\n3. Open day 3 email → verify GHL contact moved to \"Prospect Engaged\"\n4. Fire post-appraisal webhook → verify review request SMS sent next day",
        "gtm": [
          {
            "channel": "Real Estate Agent Networks",
            "desc": "Position the appraisal follow-up system as a friction-reducer for agents looking to close deals faster."
          },
          {
            "channel": "Appraisal Coaching Groups",
            "desc": "Partner with appraisal coaches and trainers to feature the workflow in their operational courses."
          },
          {
            "channel": "Direct CRM Integrations",
            "desc": "Provide GHL snapshots pre-configured for appraisers to download and deploy instantly."
          }
        ],
        "problemSubheader": "Appraisers spend 10+ hours a week chasing Realtors for updates",
        "problemDescription": "Closing appraisal deals requires constant coordination and follow-up. Appraisers waste valuable billing hours texting and emailing agents to confirm property statuses, access details, and invoice payments.",
        "redditTitle": "Appraisers Forum - System to automate Realtor follow ups?",
        "redditComments": "23 comments",
        "integrations": [
          "GHL_API_KEY",
          "MAILGUN_API_KEY",
          "TWILIO_ACCOUNT_SID"
        ]
      }
    ]
  },
  {
    "id": "healthcare-rev",
    "name": "Healthcare Revenue",
    "segment": "Healthcare & Care",
    "keywords": [
      "healthcare",
      "medical billing",
      "hipaa",
      "claims",
      "revenue cycle",
      "compliance",
      "ehr",
      "denial"
    ],
    "partners": [
      "Medical billing services and RCM consultancies",
      "Healthcare IT firms (EHR integrators)",
      "Practice management software vendors",
      "HIPAA compliance attorneys and consultants"
    ],
    "builds": [
      {
        "label": "Compliance Automation",
        "steps": [
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Google Sheets: Read Staff Certifications"
          },
          {
            "t": "Code: Calculate Days Until Expiry"
          },
          {
            "t": "IF: Renewal Needed?"
          },
          {
            "t": "Gmail: Renewal Reminder"
          },
          {
            "t": "Google Sheets: Audit Log"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Google Sheets: Append Audit Row"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Sheets: Read Staff Certifications",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Code: Calculate Days Until Expiry",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "IF: Renewal Needed?",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Gmail: Renewal Reminder",
            "type": "n8n-nodes-base.gmail"
          },
          {
            "name": "Google Sheets: Audit Log",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Sheets: Append Audit Row",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Real-time compliance Q&A via system-prompted chat\n- Optional: summarize newly uploaded policy docs into plain-language FAQ",
        "testPlan": "1. Add a test staff row with expiry date = today + 7 days\n2. Trigger daily check — verify reminder email arrives\n3. Check audit log sheet — new row timestamped\n4. Open compliance_bot.html — ask \"What is the minimum PHI access policy?\" — verify sensible answer",
        "gtm": [
          {
            "channel": "Healthcare Admin Forums",
            "desc": "Share compliance-check templates in MGMA (Medical Group Management Association) circles."
          },
          {
            "channel": "Medical CRM Directories",
            "desc": "Advertise the integration on medical EHR marketplaces and practice management hubs."
          },
          {
            "channel": "Direct Clinic Outreach",
            "desc": "Target operations managers at mid-sized clinical practices with audit-readiness checklists."
          }
        ],
        "problemSubheader": "Expiring medical licenses and compliance certificates trigger heavy fines",
        "problemDescription": "Medical practices are plagued by complex regulatory tracking. Healthcare admins manually monitor certification dates for doctors, nurses, and equipment in paper files, risking severe audit penalties.",
        "redditTitle": "r/MedicalPractice - Automated tracking for staff certifications?",
        "redditComments": "47 comments",
        "integrations": [
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "ANTHROPIC_API_KEY"
        ]
      },
      {
        "label": "Revenue Cycle Automation",
        "steps": [
          {
            "t": "Gmail Trigger"
          },
          {
            "t": "HTTP Request: Claude Field Extraction"
          },
          {
            "t": "Code: Map to Billing Codes"
          },
          {
            "t": "IF: Has Errors?"
          },
          {
            "t": "HTTP Request: Submit to Clearinghouse"
          },
          {
            "t": "Airtable: Log Claim"
          },
          {
            "t": "IF: Was Denied?"
          },
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Airtable: Read Denials"
          },
          {
            "t": "HTTP Request: Claude Summary"
          },
          {
            "t": "Gmail: Send Summary"
          }
        ],
        "nodes": [
          {
            "name": "Gmail Trigger",
            "type": "n8n-nodes-base.gmailTrigger"
          },
          {
            "name": "HTTP Request: Claude Field Extraction",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Code: Map to Billing Codes",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "IF: Has Errors?",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "HTTP Request: Submit to Clearinghouse",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Airtable: Log Claim",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "IF: Was Denied?",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Airtable: Read Denials",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Summary",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Gmail: Send Summary",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Claim field extraction from unstructured text (step 2)\n- Error pattern summary (step 10)",
        "testPlan": "1. Send test email with a sample claim (use a mock EOB document)\n2. Check n8n execution — verify extracted JSON has correct fields\n3. Check Airtable \"Claims Log\" — new record should appear\n4. Simulate a denial — check Airtable \"Denials Tracker\" updated\n5. Run Monday summary — verify email arrives with formatted denial breakdown",
        "gtm": [
          {
            "channel": "Billing Consultancy Partnering",
            "desc": "Offer code automation toolkits to medical billing services to double their appeals processing capacity."
          },
          {
            "channel": "Healthcare LinkedIn Outreach",
            "desc": "Target Practice Managers and Billing Directors at multi-practitioner clinics."
          },
          {
            "channel": "HIPAA Compliance Networks",
            "desc": "Pitch the secure RAG denial tracking engine in healthcare tech newsletters."
          }
        ],
        "problemSubheader": "Practices lose 10% of gross revenue to simple claim coding errors",
        "problemDescription": "Medical claim denials are a massive cash drain. Practices fail to map billing codes correctly, and appeals are ignored because admins lack the time to draft customized correction appeals.",
        "redditTitle": "r/MedicalBilling - Appeal letter automation for denied claims?",
        "redditComments": "51 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "SLACK_BOT_TOKEN"
        ]
      }
    ]
  },
  {
    "id": "k12",
    "name": "Education (K-12)",
    "segment": "Education & Training",
    "keywords": [
      "k-12",
      "teachers",
      "grading",
      "students",
      "parents",
      "google classroom",
      "education",
      "school"
    ],
    "partners": [
      "EdTech companies with teacher professional development programs",
      "Tutoring franchise networks (Kumon, Sylvan Learning)",
      "School district IT departments",
      "Teachers Pay Teachers content creator networks"
    ],
    "builds": [
      {
        "label": "Teacher Task Automation",
        "steps": [
          {
            "t": "Google Sheets Trigger"
          },
          {
            "t": "Code: Grade MCQs"
          },
          {
            "t": "Google Sheets: Log Score"
          },
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Google Sheets: Read Gradebook"
          },
          {
            "t": "Code: Group by Student"
          },
          {
            "t": "HTTP Request: Claude Narrative"
          },
          {
            "t": "Gmail: Send Parent Email"
          },
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Google Sheets: Read Full Gradebook"
          },
          {
            "t": "HTTP Request: Claude Report Draft"
          },
          {
            "t": "Google Docs: Create Report"
          }
        ],
        "nodes": [
          {
            "name": "Google Sheets Trigger",
            "type": "n8n-nodes-base.googleSheetsTrigger"
          },
          {
            "name": "Code: Grade MCQs",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Google Sheets: Log Score",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Sheets: Read Gradebook",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Code: Group by Student",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "HTTP Request: Claude Narrative",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Gmail: Send Parent Email",
            "type": "n8n-nodes-base.gmail"
          },
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Sheets: Read Full Gradebook",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Report Draft",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Docs: Create Report",
            "type": "n8n-nodes-base.googleDocs"
          }
        ],
        "aiTasks": "- Parent update narrative generation (step 7)\n- Progress report draft (step 11)\n- Optional: quiz question generation from lesson objectives",
        "testPlan": "1. Submit a Google Form quiz response manually\n2. Check \"Gradebook\" sheet — new graded row should appear within 1 minute\n3. Trigger parent email workflow manually — verify email arrives with personalized narrative\n4. Run progress report workflow — verify Google Doc created with student name in filename",
        "gtm": [
          {
            "channel": "EdTech Teacher Networks",
            "desc": "Share free Google Forms grading workflow templates on Pinterest and Teacher Twitter/X."
          },
          {
            "channel": "School District IT Sales",
            "desc": "Pitch administration time-savers to school district technical directors and principals."
          },
          {
            "channel": "Teacher Pay Teachers",
            "desc": "List n8n/Sheets templates on lesson directories as premium operations buildkits."
          }
        ],
        "problemSubheader": "Teachers spend 15+ hours a week on grading and administration",
        "problemDescription": "Grading quizzes, formatting progress sheets, and writing personalized emails to parents consumes teachers' evenings and weekends, causing severe burnout.",
        "redditTitle": "r/teachers - Admin work is killing my love for teaching. Automation tips?",
        "redditComments": "89 comments",
        "integrations": [
          "6xfr5f40H92Sj1Eb",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "ANTHROPIC_API_KEY"
        ]
      },
      {
        "label": "Personalized Student Learning",
        "steps": [
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Google Sheets: Read Gradebook"
          },
          {
            "t": "Code: Identify Struggling Students"
          },
          {
            "t": "Gmail: Alert Teacher"
          },
          {
            "t": "HTTP Request: Generate Practice Problems"
          },
          {
            "t": "Gmail: Send Problems to Student/Parent"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Sheets: Read Gradebook",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Code: Identify Struggling Students",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Gmail: Alert Teacher",
            "type": "n8n-nodes-base.gmail"
          },
          {
            "name": "HTTP Request: Generate Practice Problems",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Gmail: Send Problems to Student/Parent",
            "type": "n8n-nodes-base.gmail"
          }
        ],
        "aiTasks": "- Student chat responses (real-time, via webhook)\n- Differentiated practice problem generation (step 5)",
        "testPlan": "1. Open student_chat.html in browser, ask \"What is photosynthesis?\" — verify Claude responds\n2. Add test gradebook rows with scores < 70% — trigger struggle detection — verify teacher email\n3. Open teacher_dashboard.html — verify student list loads with correct scores",
        "gtm": [
          {
            "channel": "Tutoring Franchises",
            "desc": "Pitch the student chat interface and automated problem generator to local tutoring franchises."
          },
          {
            "channel": "Homeschool Groups",
            "desc": "Promote the tutor chatbot as an affordable alternative to premium personal tutors."
          },
          {
            "channel": "Teacher Blog Outreach",
            "desc": "Partner with educational influencers to write guides on classroom differentiation with AI."
          }
        ],
        "problemSubheader": "One teacher cannot offer personalized practice to 30 unique students",
        "problemDescription": "Students struggle with different concepts. Detecting who is falling behind, pinpointing their exact weaknesses, and generating customized practice sheets takes more time than teachers have.",
        "redditTitle": "r/teachers - Generating differentiated practice problems easily?",
        "redditComments": "44 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      }
    ]
  },
  {
    "id": "hvac",
    "name": "HVAC",
    "segment": "Industrial, Trades & Field Ops",
    "keywords": [
      "hvac",
      "heating",
      "cooling",
      "air conditioning",
      "contractor",
      "field service",
      "bland.ai",
      "voice bot",
      "leads"
    ],
    "partners": [
      "Web agencies with HVAC clients (Skynet Technologies, Helium SEO, Magnet Co)",
      "IT firms serving HVAC (IT GOAT, Ingage Partners, LayerCake Technologies)",
      "Property management companies and real estate agents",
      "Home inspection companies serving Butler/Warren/Hamilton Counties"
    ],
    "builds": [
      {
        "label": "Lead Gen (Google Maps Scrape → Enrichment → Sheet + Dashboard)",
        "steps": [
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Set: Define Target Queries"
          },
          {
            "t": "Split In Batches"
          },
          {
            "t": "HTTP Request: Apify Google Maps"
          },
          {
            "t": "Wait for Actor"
          },
          {
            "t": "HTTP Request: Fetch Apify Results"
          },
          {
            "t": "Code: Deduplicate by Phone/Name"
          },
          {
            "t": "HTTP Request: Firecrawl Enrich"
          },
          {
            "t": "Google Sheets: Append Leads"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Set: Define Target Queries",
            "type": "n8n-nodes-base.set"
          },
          {
            "name": "Split In Batches",
            "type": "n8n-nodes-base.splitInBatches"
          },
          {
            "name": "HTTP Request: Apify Google Maps",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait for Actor",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "HTTP Request: Fetch Apify Results",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Code: Deduplicate by Phone/Name",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "HTTP Request: Firecrawl Enrich",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Google Sheets: Append Leads",
            "type": "n8n-nodes-base.googleSheets"
          }
        ],
        "aiTasks": "- Optional: score each lead by rating count + recency of reviews",
        "testPlan": "1. Run `python tools/apify_runner.py google-maps --query \"HVAC company 90210\" --max 5`\n2. Verify 5 records returned with name, phone, address, website\n3. Run `python tools/firecrawl_scraper.py contacts --url <one_website>`\n4. Verify email/phone extracted\n5. Trigger n8n workflow — check Google Sheet for new rows after run",
        "gtm": [
          {
            "channel": "Google LSA + Facebook Lead Ads",
            "desc": "This system makes those ad dollars convert — pitch it to contractors already running paid ads who are losing leads to slow follow-up."
          },
          {
            "channel": "HVAC Contractor Forums (HVAC-Talk)",
            "desc": "Post case studies showing lead response time improvements. Link to a free audit offer."
          },
          {
            "channel": "Real Estate Agent Referrals",
            "desc": "Partner with agents in Mason/West Chester/Blue Ash who refer homeowners needing pre-sale HVAC inspections."
          }
        ],
        "problemSubheader": "Homeowners submit to 5–8 HVAC companies at once — first to respond wins the job",
        "problemDescription": "When homeowners need HVAC work, they Google and submit to multiple companies simultaneously. The first to respond AND triage urgency wins the $6,000–$12,000 job. Most HVAC owners don't see new leads until 8 AM the next day — 14 hours too late. This workflow scrapes, enriches, and surfaces the highest-value prospects before competitors even see them.",
        "redditTitle": "HVAC Hacks - Best way to build a commercial lead list?",
        "redditComments": "21 comments",
        "integrations": [
          "APIFY_API_TOKEN",
          "FIRECRAWL_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      },
      {
        "label": "Voice Bot Outreach (Bland.ai → Lead List → SMS Follow-up)",
        "steps": [
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Google Sheets: Read Leads"
          },
          {
            "t": "Split In Batches"
          },
          {
            "t": "HTTP Request: Bland.ai Call"
          },
          {
            "t": "Google Sheets: Update Status"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "IF: Interested?"
          },
          {
            "t": "Twilio: Send Booking SMS"
          },
          {
            "t": "Google Sheets: Log Outcome"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Google Sheets: Read Leads",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Split In Batches",
            "type": "n8n-nodes-base.splitInBatches"
          },
          {
            "name": "HTTP Request: Bland.ai Call",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Google Sheets: Update Status",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "IF: Interested?",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Send Booking SMS",
            "type": "n8n-nodes-base.twilio"
          },
          {
            "name": "Google Sheets: Log Outcome",
            "type": "n8n-nodes-base.googleSheets"
          }
        ],
        "aiTasks": "- Post-call: summarize transcript, extract intent signal (for leads who spoke but unclear)",
        "testPlan": "1. Add one test lead row to Google Sheet with your own phone number\n2. Trigger n8n manually — should receive a Bland.ai call within 30 seconds\n3. Say \"yes I'm interested\" — verify Twilio SMS arrives with booking link\n4. Check Google Sheet — row should show Status = \"Interested\"",
        "gtm": [
          {
            "channel": "Demo Voice Bot Cold Email",
            "desc": "Record a live demo call for a specific contractor's business and email it to them — hearing their own company name from the bot closes deals fast."
          },
          {
            "channel": "Local HVAC Associations (ACI, Cincinnati HBA)",
            "desc": "Host webinars showing how weather-triggered outreach fills the calendar before peak season hits."
          },
          {
            "channel": "Contractor Marketing Agencies",
            "desc": "Partner with SEO/PPC agencies already serving trade companies — offer voice AI as an add-on to their existing packages."
          }
        ],
        "problemSubheader": "An 8-truck operation gets 80+ calls in 48 hours during a heat wave — half go to voicemail",
        "problemDescription": "HVAC companies lose 40–60% of potential revenue during seasonal demand spikes. A database of 2,400 past customers who'd book preventive maintenance sits untouched — because no one has time to call them. This workflow monitors weather forecasts, auto-triggers proactive outreach before the spike hits, and books directly into ServiceTitan without any manual dialing.",
        "redditTitle": "HVAC Hacks - Answer rate and dispatch solutions?",
        "redditComments": "67 comments",
        "integrations": [
          "BLAND_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "TWILIO_ACCOUNT_SID"
        ]
      }
    ]
  },
  {
    "id": "coaching",
    "name": "Online Coaching",
    "segment": "Professional Services",
    "keywords": [
      "coaching",
      "ghl",
      "cal.com",
      "lead reactivation",
      "sales funnel",
      "drip",
      "crm",
      "high-ticket"
    ],
    "partners": [
      "GoHighLevel certified agencies and resellers",
      "Podcast production agencies serving coaching brands",
      "Cal.com integration partners and scheduling consultants",
      "High-ticket sales trainers and closer networks"
    ],
    "builds": [
      {
        "label": "Dead Lead Reactivation",
        "steps": [
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "HTTP Request: GHL Contacts"
          },
          {
            "t": "Split In Batches"
          },
          {
            "t": "HTTP Request: Claude Personalize"
          },
          {
            "t": "Mailgun: Send Email Day 1"
          },
          {
            "t": "GHL: Tag as \"Reactivation Sequence\""
          },
          {
            "t": "Wait 2 Days"
          },
          {
            "t": "Mailgun: Email Day 3"
          },
          {
            "t": "Wait 2 Days"
          },
          {
            "t": "Twilio: SMS Day 5"
          },
          {
            "t": "Webhook: Mailgun Open/Click Callback"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "HTTP Request: GHL Contacts",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Split In Batches",
            "type": "n8n-nodes-base.splitInBatches"
          },
          {
            "name": "HTTP Request: Claude Personalize",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Mailgun: Send Email Day 1",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "GHL: Tag as \"Reactivation Sequence\"",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait 2 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Mailgun: Email Day 3",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 2 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Twilio: SMS Day 5",
            "type": "n8n-nodes-base.twilio"
          },
          {
            "name": "Webhook: Mailgun Open/Click Callback",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Personalized message generation (step 4) using contact name, program interest, last touchpoint",
        "testPlan": "1. `python tools/ghl_crm.py test` → verify GHL connection\n2. Add yourself as a test contact tagged \"closed-lost\" in GHL\n3. Trigger workflow manually — verify email arrives with personalized copy\n4. Open the email — verify Slack fires \"follow up now\" alert\n5. Verify GHL contact stage updated to \"Re-engaged\"",
        "gtm": [
          {
            "channel": "High-Ticket Coaching Circles",
            "desc": "Promote reactivation results in elite mastermind groups and coaching consulting hubs."
          },
          {
            "channel": "GoHighLevel Ecosystem",
            "desc": "List the reactivation workflow snapshot on GHL resource sites and affiliate circles."
          },
          {
            "channel": "Case Studies on X/Twitter",
            "desc": "Write long-form threads showing how a coach generated $15K from cold leads in 4 days."
          }
        ],
        "problemSubheader": "Coaches sit on databases of 1,000+ cold leads without time to follow up",
        "problemDescription": "Acquiring fitness or business coaching leads is expensive. When leads go cold, manually emailing or texting hundreds of contacts to revive them is an exhausting and rarely completed chore.",
        "redditTitle": "r/coaching - Best campaign to reactivate dead email lists?",
        "redditComments": "39 comments",
        "integrations": [
          "GHL_API_KEY",
          "ANTHROPIC_API_KEY",
          "MAILGUN_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "SLACK_BOT_TOKEN"
        ]
      },
      {
        "label": "Sales Stack Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: GHL Create Contact"
          },
          {
            "t": "GHL: Add to Nurture Sequence"
          },
          {
            "t": "Gmail: Send Intake Confirmation"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: Claude Prep Notes"
          },
          {
            "t": "Gmail: Send Prep Notes"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: Claude Follow-Up"
          },
          {
            "t": "Gmail: Send Follow-Up"
          },
          {
            "t": "GHL: Move to \"Follow-Up Sent\""
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: GHL Create Contact",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "GHL: Add to Nurture Sequence",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Gmail: Send Intake Confirmation",
            "type": "n8n-nodes-base.gmail"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Prep Notes",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Gmail: Send Prep Notes",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Follow-Up",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Gmail: Send Follow-Up",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "GHL: Move to \"Follow-Up Sent\"",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Prep notes generation before call (step 6)\n- Follow-up email from transcript (step 9)",
        "testPlan": "1. Submit a test intake form to the webhook URL\n2. Verify GHL contact created + nurture sequence started\n3. Book a test Cal.com appointment — verify prep notes email arrives\n4. POST a fake transcript to the follow-up webhook — verify email sent + GHL stage updated",
        "gtm": [
          {
            "channel": "Cal.com Integration Directory",
            "desc": "List the full intake-CRM-calendar snapshot in calendar app appstores."
          },
          {
            "channel": "Coaching Masterminds",
            "desc": "Conduct operational audits for coaches and swap out their fragmented software with this workflow."
          },
          {
            "channel": "Instagram/FB DM Ads",
            "desc": "Target coaches with ads highlighting 'one-click automated client intake setups'."
          }
        ],
        "problemSubheader": "Coaching intake forms and booking flows are disjointed",
        "problemDescription": "Coaches leak clients when there are dead zones between submitting an intake form, creating a CRM record, booking a consultation calendar slot, and sending pre-call reminder texts.",
        "redditTitle": "r/sales - Best automated coaching onboarding setup?",
        "redditComments": "42 comments",
        "integrations": [
          "GHL_API_KEY",
          "CALCOM_API_KEY",
          "ANTHROPIC_API_KEY",
          "MAILGUN_API_KEY"
        ]
      }
    ]
  },
  {
    "id": "pharmaceutical",
    "name": "Pharmaceutical",
    "segment": "Professional Services",
    "keywords": [
      "pharmaceutical",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "IND/NDA Application Prep Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: Claude Extraction"
          },
          {
            "t": "Airtable: Log Extracted Data"
          },
          {
            "t": "HTTP Request: Claude Narrative Draft"
          },
          {
            "t": "Google Docs: Create Section Draft"
          },
          {
            "t": "Airtable: Flag Missing Sections"
          },
          {
            "t": "Gmail: Route to SME"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Airtable: Update Status"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Extraction",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Airtable: Log Extracted Data",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "HTTP Request: Claude Narrative Draft",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Docs: Create Section Draft",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "Airtable: Flag Missing Sections",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Gmail: Route to SME",
            "type": "n8n-nodes-base.gmail"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Airtable: Update Status",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- Structured data extraction from regulatory documents (step 2)\n- Narrative section drafting with regulatory language (step 4)",
        "testPlan": "1. Upload a sample study document (chemistry data for a fictional drug)\n2. Verify Claude extraction returns correct CTD section mapping\n3. Check Google Docs — narrative draft created for each extracted section\n4. Verify Airtable shows which sections are complete vs. missing\n5. Verify SME email sent with review link",
        "gtm": [
          {
            "channel": "Biotech Incubator Networks",
            "desc": "Introduce the NDA drafting wizard to startup founders at incubator hubs (e.g. YC, LabCentral)."
          },
          {
            "channel": "Regulatory Affairs Conferences",
            "desc": "Demonstrate the document mapper at RAPS (Regulatory Affairs Professionals Society) meetups."
          },
          {
            "channel": "LinkedIn Outreach",
            "desc": "Connect with Directors of Regulatory Operations at clinical-stage biotech firms."
          }
        ],
        "problemSubheader": "Regulatory teams spend months manually compiling clinical narrative summaries",
        "problemDescription": "FDA submissions require compliance mapping. Clinical teams waste hundreds of hours extracting trial data from laboratory sheets and formatting it into strict IND/NDA module layouts.",
        "redditTitle": "r/regulatoryaffairs - AI tools for drafting clinical narratives?",
        "redditComments": "18 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "AIRTABLE_API_KEY"
        ]
      }
    ]
  },
  {
    "id": "hr",
    "name": "HR (Small Orgs)",
    "segment": "Professional Services",
    "keywords": [
      "hr",
      "human resources",
      "onboarding",
      "pto",
      "hiring",
      "consulting",
      "ai audit",
      "small business"
    ],
    "partners": [
      "PEO providers (TriNet, Justworks, Rippling resellers)",
      "Business coaches and operations consultants",
      "Recruiting agencies serving SMBs",
      "Employment law attorneys and HR compliance consultants"
    ],
    "builds": [
      {
        "label": "AI Adoption Consulting",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: Claude Recommendations"
          },
          {
            "t": "Google Docs: Create Report from Template"
          },
          {
            "t": "Google Drive: Export as PDF"
          },
          {
            "t": "Mailgun: Send Report"
          },
          {
            "t": "Wait 7 Days"
          },
          {
            "t": "Mailgun: 7-Day Check-in"
          },
          {
            "t": "Wait 23 Days"
          },
          {
            "t": "Mailgun: 30-Day Check-in"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: Claude Recommendations",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Google Docs: Create Report from Template",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "Google Drive: Export as PDF",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Send Report",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait 7 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Mailgun: 7-Day Check-in",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 23 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Mailgun: 30-Day Check-in",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "- AI tool recommendations generation (step 2) — quality matters here; test prompt carefully",
        "testPlan": "1. Open ai_audit_form.html, fill out and submit as test company\n2. Check .tmp/ or Docs — report should be created\n3. Verify PDF email arrives with personalized recommendations\n4. Wait (or fast-forward n8n) — verify 7-day check-in sends",
        "gtm": [
          {
            "channel": "Consulting Communities",
            "desc": "Write blog posts and forum guides on scaling boutique consultancies using AI report builders."
          },
          {
            "channel": "Upwork/Fiverr Audits",
            "desc": "Offer rapid AI audit services on freelancing sites as high-converting discovery offers."
          },
          {
            "channel": "LinkedIn Professional Network",
            "desc": "Target independent business consultants and operations strategists with automation templates."
          }
        ],
        "problemSubheader": "Small consulting firms struggle to deliver comprehensive AI audit documents",
        "problemDescription": "Consultants spend days interviewing staff, compiling recommendations, formatting tables, and styling PDF report files. They cannot scale their auditing services without automation.",
        "redditTitle": "r/consulting - Automating discovery reports and recommendations?",
        "redditComments": "31 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "MAILGUN_API_KEY"
        ]
      },
      {
        "label": "Admin Workflow Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Gmail: Send Welcome Kit"
          },
          {
            "t": "Gmail: Alert Manager"
          },
          {
            "t": "Google Sheets: Add to Roster"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Code: Check Calendar Conflicts"
          },
          {
            "t": "IF: Auto-approve?"
          },
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Gmail: Reminder Email"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Gmail: Send Welcome Kit",
            "type": "n8n-nodes-base.gmail"
          },
          {
            "name": "Gmail: Alert Manager",
            "type": "n8n-nodes-base.gmail"
          },
          {
            "name": "Google Sheets: Add to Roster",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Code: Check Calendar Conflicts",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "IF: Auto-approve?",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Gmail: Reminder Email",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "None specified.",
        "testPlan": "No test plan specified.",
        "gtm": [
          {
            "channel": "HR Tech Forums",
            "desc": "Share onboarding workflow recipes on sites like HR Open Source and SHRM communities."
          },
          {
            "channel": "Slack App Ecosystem",
            "desc": "Promote the Slack auto-invite and setup integration on Slack community channels."
          },
          {
            "channel": "LinkedIn Target",
            "desc": "Directly message newly promoted HR Managers offering automated employee onboarding snapshots."
          }
        ],
        "problemSubheader": "HR onboarding in growing firms is a manual, chaotic process",
        "problemDescription": "Without automated triggers, HR managers waste hours emailing new hires for payroll info, checking background statuses, adding users to Slack, and setting up training tasks.",
        "redditTitle": "r/humanresources - Standard onboarding workflow for a team of 40?",
        "redditComments": "72 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "SLACK_BOT_TOKEN"
        ]
      }
    ]
  },
  {
    "id": "chiro",
    "name": "Chiropractic",
    "segment": "Healthcare & Care",
    "keywords": [
      "chiropractic",
      "chiropractor",
      "patient retention",
      "sms",
      "appointments",
      "ghl",
      "review generation"
    ],
    "partners": [
      "Physical therapy clinics (complementary referral relationship)",
      "Personal injury attorneys who refer accident patients",
      "Fitness studios and gyms with shared clientele",
      "Health insurance agents familiar with chiro benefits"
    ],
    "builds": [
      {
        "label": "General Practice Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "HTTP Request: GHL Create Contact"
          },
          {
            "t": "GHL: Assign to Pipeline"
          },
          {
            "t": "Twilio: Confirmation SMS"
          },
          {
            "t": "Gmail: Welcome Email"
          },
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "HTTP Request: GHL Get Tomorrow's Appointments"
          },
          {
            "t": "Split In Batches"
          },
          {
            "t": "Twilio: Reminder SMS"
          },
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Wait 2 Hours"
          },
          {
            "t": "Gmail: Review Request + Care Plan Email"
          },
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Python Tool / HTTP Request: GHL Inactive Patients"
          },
          {
            "t": "Twilio: Reactivation SMS"
          },
          {
            "t": "GHL: Tag \"Reactivation Sent\""
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: GHL Create Contact",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "GHL: Assign to Pipeline",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Twilio: Confirmation SMS",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Gmail: Welcome Email",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "HTTP Request: GHL Get Tomorrow's Appointments",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Split In Batches",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Twilio: Reminder SMS",
            "type": "n8n-nodes-base.twilio"
          },
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Wait 2 Hours",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Gmail: Review Request + Care Plan Email",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Python Tool / HTTP Request: GHL Inactive Patients",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "Twilio: Reactivation SMS",
            "type": "n8n-nodes-base.custom"
          },
          {
            "name": "GHL: Tag \"Reactivation Sent\"",
            "type": "n8n-nodes-base.custom"
          }
        ],
        "aiTasks": "None specified.",
        "testPlan": "1. Submit a test intake form — verify GHL contact created + confirmation SMS received\n2. Add a test appointment for tomorrow in GHL — run reminder flow — verify SMS received\n3. Mark appointment \"Completed\" in GHL — wait 2h — verify follow-up email with review link\n4. Set test contact last_visit to 61 days ago — run reactivation — verify SMS received",
        "gtm": [
          {
            "channel": "Chiropractic Coaching Circles",
            "desc": "Partner with chiro business coaches to distribute the intake-to-reactivation workflow."
          },
          {
            "channel": "Chiro Facebook Groups",
            "desc": "Post case studies demonstrating Google Review increases from automated post-visit reminders."
          },
          {
            "channel": "Local Clinic SEO Audit",
            "desc": "Offer local chiropractors a free clinic review audit to demonstrate the need for automated reviews."
          }
        ],
        "problemSubheader": "40% of new chiropractic patients fail to book a follow-up appointment",
        "problemDescription": "Patient retention is the core profit driver for chiropractic clinics. Without immediate post-visit feedback requests, automated reminders, and 60-day reactivation texts, patients drop out of care programs.",
        "redditTitle": "Chiropractic Success - Patient retention and automated SMS?",
        "redditComments": "49 comments",
        "integrations": [
          "GHL_API_KEY",
          "TWILIO_ACCOUNT_SID"
        ]
      }
    ]
  },
  {
    "id": "adult-education-nonprofit-training",
    "name": "Adult Education & Nonprofit Training",
    "segment": "Education & Training",
    "keywords": [
      "adult-education-nonprofit-training",
      "automation",
      "workflow",
      "education & training"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Membership Management Automation",
        "steps": [
          {
            "t": "Schedule Trigger"
          },
          {
            "t": "Airtable: Get Expiring Members"
          },
          {
            "t": "IF: Days Until Expiry"
          },
          {
            "t": "Claude: Draft Renewal Email"
          },
          {
            "t": "Mailgun: Send Reminder"
          },
          {
            "t": "Airtable: Update Status"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Expiring Members",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "IF: Days Until Expiry",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Claude: Draft Renewal Email",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Reminder",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Update Status",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Write personalized renewal emails referencing each member's engagement history and program benefits\n- Classify lapsed members by value tier to suggest manual vs. automated outreach",
        "testPlan": "1. Add a test member with expiry date 7 days out\n2. Trigger the schedule manually and verify email is sent\n3. Check Airtable record shows updated status\n4. Verify lapsed high-value members appear in a separate queue",
        "gtm": [
          {
            "channel": "Nonprofit Tech Forums",
            "desc": "Share the membership renewal template on NTEN and TechSoup communities where adult-ed admins look for free tools."
          },
          {
            "channel": "Grant Writer Partnerships",
            "desc": "Partner with grant writers who see admin pain firsthand and can introduce the automation as a value-add."
          },
          {
            "channel": "Local Chamber Directories",
            "desc": "Identify nonprofit training orgs through NKY Chamber and Cincinnati Chamber member lists for direct outreach."
          }
        ],
        "problemSubheader": "Member renewals fall through the cracks without reminders",
        "problemDescription": "Adult education nonprofits track memberships manually in spreadsheets, sending generic reminders too late. High-value members lapse simply because no one followed up with a relevant, timely message—shrinking program revenue and engagement.",
        "redditTitle": "r/nonprofit - How do you automate membership renewals without a paid CRM?",
        "redditComments": "38 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "ai-education-training",
    "name": "AI Education & Training",
    "segment": "Education & Training",
    "keywords": [
      "ai-education-training",
      "automation",
      "workflow",
      "education & training"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "AI Literacy Training Automation",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Airtable: Create Enrollment"
          },
          {
            "t": "Schedule Trigger: Reminders"
          },
          {
            "t": "Claude: Draft Module Intro"
          },
          {
            "t": "Mailgun: Send Assignment"
          },
          {
            "t": "Google Docs: Generate Certificate"
          },
          {
            "t": "Airtable: Mark Completed"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Create Enrollment",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Schedule Trigger: Reminders",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Claude: Draft Module Intro",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Assignment",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Google Docs: Generate Certificate",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "Airtable: Mark Completed",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Generate module content covering prompting basics, workflow design, and AI ethics tailored to the SMB's industry\n- Draft personalized reminder messages referencing the learner's role and progress",
        "testPlan": "1. Submit a test enrollment webhook with employee name and company\n2. Verify Airtable record created and welcome email sent\n3. Trigger a reminder after simulated 3-day gap\n4. Mark module complete and confirm certificate PDF is generated and emailed",
        "gtm": [
          {
            "channel": "Cincinnati Chamber Events",
            "desc": "Present AI literacy as a member benefit at MADE, West Chester-Liberty, and African American Chamber meetings."
          },
          {
            "channel": "HR & PEO Partnerships",
            "desc": "Partner with HR firms (HR Elements, GMS) to bundle AI training as an employee development benefit."
          },
          {
            "channel": "BNI Chapters",
            "desc": "Join BNI chapters in Southwest Ohio and pitch AI literacy workshops to business owners seeking competitive edges."
          }
        ],
        "problemSubheader": "SMB teams dabble in AI but lack structured training",
        "problemDescription": "73% of small businesses need help identifying and prioritizing AI projects, yet most employees learn through trial and error. Without structured training, teams misuse tools or avoid them entirely—leaving competitive advantage on the table.",
        "redditTitle": "r/smallbusiness - What's the best way to actually train your team to use AI tools?",
        "redditComments": "61 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      },
      {
        "label": "AI Opportunity Assessment Workflow",
        "steps": [
          {
            "t": "Webhook Trigger"
          },
          {
            "t": "Airtable: Store Responses"
          },
          {
            "t": "Claude: Score & Prioritize"
          },
          {
            "t": "Google Docs: Build Roadmap"
          },
          {
            "t": "Mailgun: Deliver Report"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Store Responses",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Score & Prioritize",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Google Docs: Build Roadmap",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "Mailgun: Deliver Report",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Analyze submitted tasks for automation feasibility, estimated time savings, and implementation complexity\n- Draft a ranked roadmap with plain-language explanations for non-technical business owners",
        "testPlan": "1. Submit test form with 5 dummy tasks\n2. Verify Airtable receives the data\n3. Confirm Claude produces a scored list with at least 3 ranked items\n4. Check that a PDF is generated and the delivery email arrives",
        "gtm": [
          {
            "channel": "Accountant & HR Referrals",
            "desc": "Position yourself as an AI specialist that accountants and HR consultants bring into existing client relationships."
          },
          {
            "channel": "Chamber Speaking Slots",
            "desc": "Offer a free 20-minute 'AI Opportunity Audit' talk at chamber lunches and convert attendees to paid assessments."
          },
          {
            "channel": "LinkedIn Outreach",
            "desc": "Target C-suite and business owners in regional BNI chapters and Cincinnati-area LinkedIn groups with the audit offer."
          }
        ],
        "problemSubheader": "Businesses don't know where to start with automation",
        "problemDescription": "Owners and executives want AI wins but have no structured way to inventory their opportunities or estimate savings. Without a roadmap, they either do nothing or invest in the wrong tools first—wasting budget and momentum.",
        "redditTitle": "r/entrepreneur - How do you figure out which processes in your business to automate first?",
        "redditComments": "84 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "automation-reliability",
    "name": "Automation Reliability",
    "segment": "Professional Services",
    "keywords": [
      "automation-reliability",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Workflow Reliability Audit",
        "steps": [
          {
            "t": "Schedule Trigger: Weekly"
          },
          {
            "t": "HTTP Request: Pull Logs"
          },
          {
            "t": "Code: Normalize Log Fields"
          },
          {
            "t": "Airtable: Store Log Entries"
          },
          {
            "t": "Claude: Analyze & Draft Report"
          },
          {
            "t": "Mailgun: Email Report"
          },
          {
            "t": "Slack: Notify MSP Team"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Weekly",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "HTTP Request: Pull Logs",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Code: Normalize Log Fields",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Airtable: Store Log Entries",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Analyze & Draft Report",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Email Report",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Slack: Notify MSP Team",
            "type": "n8n-nodes-base.slack"
          }
        ],
        "aiTasks": "- Identify error clusters, rising execution runtimes, and repeated retry patterns across all connected platforms\n- Draft a plain-English Reliability Report with prioritized fix recommendations and risk levels",
        "testPlan": "1. Feed sample log data with 2 deliberate error clusters\n2. Trigger schedule manually\n3. Confirm Claude flags both clusters with correct severity\n4. Verify report arrives via email and Slack notification fires",
        "gtm": [
          {
            "channel": "MSP Networking Events",
            "desc": "Present reliability dashboards at Cincinnati Chamber tech meetups where IT GOAT, Ingage Partners, and Intrust IT network."
          },
          {
            "channel": "Clutch & DesignRush Listings",
            "desc": "Target IT consultancies listed on Clutch serving Cincinnati SMBs with a free 'automation health check' offer."
          },
          {
            "channel": "Cybersecurity Partner Channel",
            "desc": "Partner with Cincinnati cybersecurity consultants who manage policies and can bundle credential monitoring."
          }
        ],
        "problemSubheader": "Silent automation failures go unnoticed until clients complain",
        "problemDescription": "MSPs and SMBs deploying AI workflows have no unified view of what's breaking. Jobs time out, integrations silently fail, and retries pile up—discovered only when a frustrated end user calls in, by which point data is already lost or delayed.",
        "redditTitle": "r/msp - How do you monitor n8n/Zapier workflows for silent failures across clients?",
        "redditComments": "29 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "SLACK_BOT_TOKEN",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "childcare-daycare-centers",
    "name": "Childcare & Daycare Centers",
    "segment": "Professional Services",
    "keywords": [
      "childcare-daycare-centers",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Waitlist & Enrollment Flow",
        "steps": [
          {
            "t": "Webhook Trigger: New Application"
          },
          {
            "t": "Airtable: Create Waitlist Record"
          },
          {
            "t": "Webhook Trigger: Slot Opened"
          },
          {
            "t": "Airtable: Query Matching Families"
          },
          {
            "t": "Claude: Rank by Priority"
          },
          {
            "t": "Twilio: Send SMS Offer"
          },
          {
            "t": "Wait: 24 Hours"
          },
          {
            "t": "IF: Reply Received"
          },
          {
            "t": "Mailgun: Send Enrollment Packet"
          },
          {
            "t": "Airtable: Update Waitlist Status"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: New Application",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Create Waitlist Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Webhook Trigger: Slot Opened",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Query Matching Families",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Rank by Priority",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Send SMS Offer",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 24 Hours",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Reply Received",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Mailgun: Send Enrollment Packet",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Update Waitlist Status",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Rank waiting families by configured priority rules factoring in enrollment duration, age match, siblings, and special needs flags\n- Draft personalized SMS offer text referencing the specific program and start date",
        "testPlan": "1. Submit a test application form and verify Airtable record\n2. Trigger a 'slot opened' webhook and confirm top family receives SMS within 2 minutes\n3. Simulate no-reply; verify next family is contacted after 24 hours\n4. Reply YES and confirm enrollment packet email arrives",
        "gtm": [
          {
            "channel": "Childcare Director Groups",
            "desc": "Engage directors in Ohio childcare Facebook groups and NAEYC regional chapters with the 24-hour enrollment story."
          },
          {
            "channel": "Chamber Introductions",
            "desc": "Use Mason Deerfield, West Chester-Liberty, and Colerain Chamber directories to identify daycare owners for outreach."
          },
          {
            "channel": "Preschool Consultants",
            "desc": "Partner with licensing and curriculum consultants who already advise centers and can introduce the automation."
          }
        ],
        "problemSubheader": "Daycare spots sit unfilled while directors dial families one by one",
        "problemDescription": "Centers manage long waitlists in spreadsheets. When a spot opens, directors spend hours making individual calls to find an age match—delaying enrollment, frustrating families, and leaving tuition revenue uncollected for days or weeks.",
        "redditTitle": "r/ECEProfessionals - How are you managing waitlists without a $400/mo software subscription?",
        "redditComments": "53 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Parent Communication & Alerts",
        "steps": [
          {
            "t": "Webhook Trigger: Photo/Note Upload"
          },
          {
            "t": "Airtable: Store Daily Notes"
          },
          {
            "t": "Schedule Trigger: End of Day"
          },
          {
            "t": "Airtable: Get Day's Notes per Child"
          },
          {
            "t": "Claude: Generate Family Summary"
          },
          {
            "t": "Mailgun: Send Daily Recap"
          },
          {
            "t": "Webhook Trigger: Urgent Alert Flag"
          },
          {
            "t": "Twilio: Blast SMS Alert"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Photo/Note Upload",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Store Daily Notes",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Schedule Trigger: End of Day",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Day's Notes per Child",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Generate Family Summary",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Daily Recap",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Urgent Alert Flag",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Twilio: Blast SMS Alert",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Transform raw teacher notes into warm, parent-friendly daily summaries per child\n- Draft urgent alert SMS copy appropriate for the situation type (illness, weather, incident)",
        "testPlan": "1. Upload 3 test notes for a child and trigger end-of-day schedule\n2. Verify Claude produces a summary and email is sent to test parent address\n3. POST an urgent alert webhook and confirm SMS fires within 60 seconds\n4. Check Airtable archive for compliance log entries",
        "gtm": [
          {
            "channel": "Parent-Teacher Advisory Boards",
            "desc": "Present the communication system at parent advisory meetings for KinderCare and Goddard School centers."
          },
          {
            "channel": "Childcare Association Events",
            "desc": "Demo at Ohio Child Care Association regional meetings where directors discuss operational tools."
          },
          {
            "channel": "Direct Center Outreach",
            "desc": "Reach out to Youthland Academy, Wilde Kingdom, and Sharon Hill Daycare directly via chamber directories."
          }
        ],
        "problemSubheader": "Parents get inconsistent updates and miss urgent alerts",
        "problemDescription": "Teachers and directors send daily updates through a patchwork of apps and paper notes, making parent communication inconsistent. When emergencies happen—illness outbreaks or weather closings—manual notification chains are slow and miss families.",
        "redditTitle": "r/Parenting - What app does your daycare use to send daily updates? Ours is terrible.",
        "redditComments": "47 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      }
    ]
  },
  {
    "id": "churches-faith-based-orgs",
    "name": "Churches & Faith-Based Orgs",
    "segment": "Community, Nonprofit & Faith",
    "keywords": [
      "churches-faith-based-orgs",
      "automation",
      "workflow",
      "community, nonprofit & faith"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Visitor Onboarding Workflow",
        "steps": [
          {
            "t": "Webhook Trigger: Visitor Form"
          },
          {
            "t": "Airtable: Create Visitor Record"
          },
          {
            "t": "Claude: Generate Welcome Sequence"
          },
          {
            "t": "Mailgun: Send Welcome Email"
          },
          {
            "t": "Wait: 7 Days"
          },
          {
            "t": "Twilio: Ministry Connection SMS"
          },
          {
            "t": "Wait: 14 Days"
          },
          {
            "t": "Mailgun: Newcomers Lunch Invite"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Visitor Form",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Create Visitor Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Generate Welcome Sequence",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Welcome Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 7 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Twilio: Ministry Connection SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 14 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Mailgun: Newcomers Lunch Invite",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Generate personalized welcome sequences referencing family situation, interests flagged on visitor card, and relevant ministry programs\n- Draft each touchpoint with appropriate tone for a faith-based context",
        "testPlan": "1. Submit a test visitor form with name, interests, and family info\n2. Verify Airtable record created and welcome email arrives\n3. Simulate 7-day wait by adjusting schedule; confirm SMS fires\n4. Check that all 4–6 week touchpoints are queued correctly",
        "gtm": [
          {
            "channel": "Church Tech Networks",
            "desc": "Share the visitor automation template in church management Facebook groups and Church IT Network forums."
          },
          {
            "channel": "Christian Web Designers",
            "desc": "Partner with local IT volunteers and Christian web designers who already help churches and can recommend the workflow."
          },
          {
            "channel": "Multi-Site Ministry Outreach",
            "desc": "Target larger multi-site churches in Mason, West Chester, and Fairfield via chamber community directories."
          }
        ],
        "problemSubheader": "First-time visitors leave and never come back—nobody followed up",
        "problemDescription": "Churches collect visitor cards and online registrations but respond slowly, losing the window to integrate newcomers. Pastors and admin volunteers manually manage spreadsheets and send generic follow-ups weeks too late to build a real connection.",
        "redditTitle": "r/Christianity - How does your church follow up with first-time visitors effectively?",
        "redditComments": "44 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "commercial-laundries",
    "name": "Commercial Laundries",
    "segment": "Home Services",
    "keywords": [
      "commercial-laundries",
      "automation",
      "workflow",
      "home services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Pickup & Delivery Route Automation",
        "steps": [
          {
            "t": "Schedule Trigger: Daily"
          },
          {
            "t": "Airtable: Get Today's Stops"
          },
          {
            "t": "HTTP Request: Google Maps Distance Matrix"
          },
          {
            "t": "Code: Cluster & Sequence Stops"
          },
          {
            "t": "Claude: Assign Optimized Routes"
          },
          {
            "t": "Twilio: SMS Run Sheet to Driver"
          },
          {
            "t": "Airtable: Log Route Plan"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Daily",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Today's Stops",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "HTTP Request: Google Maps Distance Matrix",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Code: Cluster & Sequence Stops",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Claude: Assign Optimized Routes",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: SMS Run Sheet to Driver",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Log Route Plan",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Assign optimized stop sequences per truck honoring time windows and priority flags\n- Summarize route plans into driver-friendly SMS run sheets",
        "testPlan": "1. Load 10 test stops with addresses and time windows into Airtable\n2. Trigger schedule manually and verify Google Maps API call succeeds\n3. Confirm Claude produces distinct routes per truck with no time-window conflicts\n4. Verify driver SMS arrives with correct stop sequence",
        "gtm": [
          {
            "channel": "Hospitality Association Events",
            "desc": "Present the route optimization tool at Cincinnati Hospitality Association meetings where laundry vendors and hotels intersect."
          },
          {
            "channel": "Direct Plant Outreach",
            "desc": "Identify commercial laundry plants via local business directories and offer a free route-efficiency analysis."
          },
          {
            "channel": "Restaurant Group Referrals",
            "desc": "Contact restaurant groups and clinic purchasing managers who can pressure their laundry vendors to modernize operations."
          }
        ],
        "problemSubheader": "Trucks crisscross the city burning miles on manual routes",
        "problemDescription": "Commercial laundries planning routes manually to restaurants, clinics, and hotels waste truck miles and miss delivery windows—creating inconsistent service that damages long-term contracts. Route planning takes hours each morning instead of minutes.",
        "redditTitle": "r/Laundry - Anyone using software to optimize linen delivery routes? Doing it manually is killing us.",
        "redditComments": "18 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER"
        ]
      }
    ]
  },
  {
    "id": "construction-contractors",
    "name": "Construction Contractors",
    "segment": "Industrial, Trades & Field Ops",
    "keywords": [
      "construction-contractors",
      "automation",
      "workflow",
      "industrial, trades & field ops"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Bid Intake & Comparison",
        "steps": [
          {
            "t": "Gmail Trigger"
          },
          {
            "t": "Code: Extract Attachment Text"
          },
          {
            "t": "Claude: Summarize & Score Bid"
          },
          {
            "t": "Airtable: Create Bid Record"
          },
          {
            "t": "Google Sheets: Update Bid Pipeline"
          },
          {
            "t": "Mailgun: Notify Leadership"
          }
        ],
        "nodes": [
          {
            "name": "Gmail Trigger",
            "type": "n8n-nodes-base.gmailTrigger"
          },
          {
            "name": "Code: Extract Attachment Text",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Claude: Summarize & Score Bid",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Airtable: Create Bid Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Google Sheets: Update Bid Pipeline",
            "type": "n8n-nodes-base.googleSheets"
          },
          {
            "name": "Mailgun: Notify Leadership",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Extract project scope, submission deadline, estimated value, and special requirements from raw bid documents\n- Score each bid against configured capacity and strategic fit criteria and produce a comparison summary",
        "testPlan": "1. Send a test bid invitation email with a PDF attachment\n2. Verify Claude extracts key fields correctly\n3. Check Airtable record created with score and summary\n4. Confirm Google Sheets pipeline row added and leadership notification email arrives",
        "gtm": [
          {
            "channel": "Allied Construction Industries",
            "desc": "Present the bid management system at ACI events serving 500+ member companies across Southwest Ohio."
          },
          {
            "channel": "Construction Attorneys",
            "desc": "Partner with construction attorneys and bonding agents who work with these firms and appreciate clean bid documentation."
          },
          {
            "channel": "Colerain Chamber Outreach",
            "desc": "Use Colerain Chamber's contractor directory to identify firms for direct outreach and demo offers."
          }
        ],
        "problemSubheader": "PMs miss or misprioritize bid opportunities buried in email",
        "problemDescription": "Construction contractors receive bid invitations via email and procurement portals daily. Project managers manually skim specs and deadlines—risking missed submissions on high-fit projects and wasted estimating hours on poor-fit work.",
        "redditTitle": "r/construction - How do you manage tracking and responding to multiple bid invitations at once?",
        "redditComments": "56 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      },
      {
        "label": "Field Report & Daily Log Automation",
        "steps": [
          {
            "t": "Webhook Trigger: Mobile Form"
          },
          {
            "t": "Claude: Standardize Log Entry"
          },
          {
            "t": "IF: Safety Issue Flagged"
          },
          {
            "t": "Mailgun: Alert Safety Manager"
          },
          {
            "t": "Airtable: Store Daily Log"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Mobile Form",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Standardize Log Entry",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "IF: Safety Issue Flagged",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Mailgun: Alert Safety Manager",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Store Daily Log",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Convert unstructured foreman notes into standardized log categories (labor count, equipment used, issues encountered, weather)\n- Flag safety deviations and summarize patterns across multiple job sites weekly",
        "testPlan": "1. Submit a test mobile form with unstructured text\n2. Verify Claude produces a structured log with all required categories\n3. Include a safety keyword and confirm alert email fires\n4. Search Airtable for the record and verify all fields populated",
        "gtm": [
          {
            "channel": "Safety Consultants",
            "desc": "Partner with safety and insurance consultants supporting construction clients who benefit directly from better log compliance."
          },
          {
            "channel": "ACI Member Events",
            "desc": "Demo the mobile form + standardized log system at Allied Construction Industries meetings in Southwest Ohio."
          },
          {
            "channel": "Bonding & Surety Agents",
            "desc": "Approach bonding agents who care about contractors' documentation quality as part of risk assessment."
          }
        ],
        "problemSubheader": "Paper daily logs are inconsistent and unsearchable when claims arise",
        "problemDescription": "Foremen on job sites submit hand-written or loosely formatted daily logs that office staff can't easily search or analyze. When a dispute or insurance claim arises months later, the paper trail is incomplete—creating costly documentation gaps.",
        "redditTitle": "r/projectmanagement - What's your system for daily field reports on construction sites?",
        "redditComments": "41 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "construction-plumbing-services",
    "name": "Construction & Plumbing Services",
    "segment": "Home Services",
    "keywords": [
      "construction-plumbing-services",
      "automation",
      "workflow",
      "home services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Contractor Content Engine",
        "steps": [
          {
            "t": "Webhook Trigger: Job Complete"
          },
          {
            "t": "Code: Collect Photos + Description"
          },
          {
            "t": "Claude: Generate Case Study + Posts"
          },
          {
            "t": "HTTP Request: Publish to CMS"
          },
          {
            "t": "Airtable: Log Content Asset"
          },
          {
            "t": "HTTP Request: Push to Social Scheduler"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Job Complete",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Code: Collect Photos + Description",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Claude: Generate Case Study + Posts",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "HTTP Request: Publish to CMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Log Content Asset",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "HTTP Request: Push to Social Scheduler",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Generate case study copy, local SEO page text, and 3 social posts from job photos and description\n- Tailor content by city, job type, and outcome for hyperlocal search relevance",
        "testPlan": "1. Submit a test webhook with job description and photo URLs\n2. Verify Claude returns case study, SEO page, and 3 posts\n3. Confirm CMS publish HTTP request receives 200 status\n4. Check Airtable log has the new content asset entry",
        "gtm": [
          {
            "channel": "ACI Member Events",
            "desc": "Present the content engine at Allied Construction Industries events serving 500+ member companies across Southwest Ohio."
          },
          {
            "channel": "Local Web Agency Partnerships",
            "desc": "Partner with Genesis Web Studio, Skynet Technologies, and BigOrange Marketing to bundle the content engine into new site builds."
          },
          {
            "channel": "Colerain Chamber Directory",
            "desc": "Use Colerain Chamber's 31+ construction company directory for direct outreach to contractors lacking online presence."
          }
        ],
        "problemSubheader": "Completed jobs sit in photos folders instead of selling the next job",
        "problemDescription": "Small contractors do excellent work but never document it. Owners spend evenings trying to write case studies and social posts manually—or never do it at all—leaving websites sparse and undermining trust compared to better-marketed competitors.",
        "redditTitle": "r/Contractor - How do you turn job photos into content without hiring a marketer?",
        "redditComments": "67 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "GOOGLE_SERVICE_ACCOUNT_JSON",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      },
      {
        "label": "Renovation Lead Follow-Up",
        "steps": [
          {
            "t": "Webhook Trigger: Quote Form"
          },
          {
            "t": "Airtable: Create Lead"
          },
          {
            "t": "Twilio: Instant Confirmation SMS"
          },
          {
            "t": "Claude: Draft Discovery Questions"
          },
          {
            "t": "Mailgun: Send Discovery Email"
          },
          {
            "t": "Wait: 48 Hours"
          },
          {
            "t": "IF: Response Received"
          },
          {
            "t": "Mailgun: Assign to Estimator"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Quote Form",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Create Lead",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: Instant Confirmation SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Claude: Draft Discovery Questions",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Discovery Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 48 Hours",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Response Received",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Mailgun: Assign to Estimator",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Draft a personalized discovery email with project-specific questions based on the job type and suburb mentioned in the form\n- Generate a brief lead summary for the estimator including key details and project fit signals",
        "testPlan": "1. Submit test quote form for a bathroom remodel\n2. Verify confirmation SMS arrives within 60 seconds\n3. Check discovery email is sent and personalized to the project type\n4. Simulate homeowner response and confirm estimator assignment email fires",
        "gtm": [
          {
            "channel": "Real Estate Agent Referrals",
            "desc": "Partner with real estate agents and property managers who constantly refer contractors and need reliable response partners."
          },
          {
            "channel": "BBB Contractor Directory",
            "desc": "Target contractors with 4+ star BBB ratings in Mason, West Chester, and Fairfield who have volume but inconsistent lead follow-up."
          },
          {
            "channel": "Colerain Chamber Network",
            "desc": "Connect with contractors listed in Colerain Chamber directories at member networking events."
          }
        ],
        "problemSubheader": "Homeowners move on to whoever responds first",
        "problemDescription": "Contractors receive quote requests via website forms but follow-up is inconsistent. Busy crews forget to send confirmations, and homeowners in competitive suburban markets contact 3–4 contractors simultaneously—choosing the first one that responds with a clear next step.",
        "redditTitle": "r/Homebuilding - How fast do contractors usually respond to quote requests? Mine took 2 weeks.",
        "redditComments": "89 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "coworking-flex-spaces",
    "name": "Coworking & Flex Spaces",
    "segment": "Property, Facilities & Real Estate",
    "keywords": [
      "coworking-flex-spaces",
      "automation",
      "workflow",
      "property, facilities & real estate"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Tour Requests & Membership Conversion",
        "steps": [
          {
            "t": "Webhook Trigger: Tour Request"
          },
          {
            "t": "Airtable: Log Prospect"
          },
          {
            "t": "Webhook Trigger: Tour Complete"
          },
          {
            "t": "Claude: Draft Personalized Follow-Up"
          },
          {
            "t": "Mailgun: Send Tour Recap + Recommendation"
          },
          {
            "t": "Wait: 3 Days"
          },
          {
            "t": "IF: Signed Up"
          },
          {
            "t": "Twilio: Re-Engagement SMS"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Tour Request",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Log Prospect",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Webhook Trigger: Tour Complete",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Draft Personalized Follow-Up",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Tour Recap + Recommendation",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 3 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Signed Up",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Re-Engagement SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Write personalized post-tour email referencing the prospect's stated use case, team size, and budget\n- Recommend 1–2 specific membership plans with rationale based on the tour conversation notes",
        "testPlan": "1. Submit a test tour request with prospect details\n2. Mark tour complete and verify Claude follow-up email arrives with correct plan recommendation\n3. Simulate 3-day no response and confirm re-engagement SMS fires\n4. Mark as signed up and verify workflow exits correctly",
        "gtm": [
          {
            "channel": "Coworking Operator Networks",
            "desc": "Share the tour conversion workflow in Coworking Alliance and GCUC community channels."
          },
          {
            "channel": "Local Chamber Introductions",
            "desc": "Meet coworking operators at Mason Deerfield and West Chester-Liberty Chamber events where COhatch and ORCA participate."
          },
          {
            "channel": "Remote Work Communities",
            "desc": "Target local remote work Slack groups and LinkedIn communities used by members of suburban coworking spaces."
          }
        ],
        "problemSubheader": "Tour prospects go cold and the membership conversion never happens",
        "problemDescription": "Coworking spaces invest in giving tours but many prospects go cold afterward because follow-up is manual and generic. By the time a community manager remembers to check in, the prospect has signed a lease at a competitor or returned to working from home.",
        "redditTitle": "r/coworking - What's your process for converting tour visitors into paying members?",
        "redditComments": "22 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "dental-clinics",
    "name": "Dental Clinics",
    "segment": "Healthcare & Care",
    "keywords": [
      "dental-clinics",
      "automation",
      "workflow",
      "healthcare & care"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Missed-Call Capture & Recovery",
        "steps": [
          {
            "t": "Webhook Trigger: Missed Call"
          },
          {
            "t": "Twilio: Send Recovery SMS"
          },
          {
            "t": "IF: Voicemail Captured"
          },
          {
            "t": "Claude: Classify Urgency"
          },
          {
            "t": "IF: Emergency"
          },
          {
            "t": "Twilio: Alert On-Call Staff"
          },
          {
            "t": "Airtable: Log Call + Outcome"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Missed Call",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Twilio: Send Recovery SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "IF: Voicemail Captured",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Claude: Classify Urgency",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "IF: Emergency",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Alert On-Call Staff",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Log Call + Outcome",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Analyze voicemail transcripts for urgency signals (pain keywords, dental emergency terminology)\n- Classify each missed call as emergency, urgent, or routine and draft appropriate response copy",
        "testPlan": "1. Simulate a missed call webhook with a test phone number\n2. Verify recovery SMS arrives within 60 seconds\n3. Submit a voicemail transcript with 'severe pain' keywords and confirm emergency routing fires\n4. Submit routine appointment text and confirm standard queue placement",
        "gtm": [
          {
            "channel": "Dental IT Providers",
            "desc": "Partner with dental IT and phone vendors serving regional practices who can introduce missed-call automation as an add-on."
          },
          {
            "channel": "Dental Marketing Agencies",
            "desc": "Collaborate with dental marketing consultants who already work with Afinia Dental and independents across Mason and West Chester."
          },
          {
            "channel": "Practice Owner LinkedIn Outreach",
            "desc": "Target dental practice owners on LinkedIn in Cincinnati suburbs with a '15 missed calls you lost last week' cold message."
          }
        ],
        "problemSubheader": "Missed calls walk out the door straight to the next dentist",
        "problemDescription": "Dental offices miss calls during busy clinic hours and after hours—losing new-patient opportunities and urgent cases. Most callers won't leave a voicemail and simply call the next practice. Each missed call represents a lost patient relationship worth hundreds to thousands of dollars per year.",
        "redditTitle": "r/DentalOffice - How do you handle missed calls when the front desk is slammed with patients?",
        "redditComments": "71 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      },
      {
        "label": "Recall & Unscheduled Treatment Follow-Up",
        "steps": [
          {
            "t": "Schedule Trigger: Weekly"
          },
          {
            "t": "Airtable: Query Unscheduled Treatments"
          },
          {
            "t": "IF: Days Since Diagnosis"
          },
          {
            "t": "Claude: Draft Recall Message"
          },
          {
            "t": "Twilio: Send SMS"
          },
          {
            "t": "Mailgun: Send Email"
          },
          {
            "t": "Wait: 30 Days"
          },
          {
            "t": "IF: Booked"
          },
          {
            "t": "Airtable: Flag for Phone Outreach"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Weekly",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Query Unscheduled Treatments",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "IF: Days Since Diagnosis",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Claude: Draft Recall Message",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Send SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Send Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 30 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Booked",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Flag for Phone Outreach",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Draft personalized recall messages referencing the specific procedure, tooth number, and insurance benefit timing\n- Generate escalation summaries for staff handling phone outreach on the most stubborn non-responders",
        "testPlan": "1. Load a test patient with a crown diagnosis 35 days ago into Airtable\n2. Trigger the weekly schedule and confirm 30-day message fires\n3. Verify SMS and email both arrive with procedure-specific copy\n4. Simulate 90 days with no booking and confirm phone list flag is set",
        "gtm": [
          {
            "channel": "Dental Consulting Firms",
            "desc": "Partner with dental practice consultants who measure case acceptance rates and can quantify the ROI of recall automation."
          },
          {
            "channel": "Dental Billing Companies",
            "desc": "Work with RCM and billing companies who track unscheduled treatment as a revenue opportunity for their practice clients."
          },
          {
            "channel": "Pediatric & Specialty Clinic Outreach",
            "desc": "Target pediatric and specialty clinics in Mason and West Chester where treatment completion tracking is especially complex."
          }
        ],
        "problemSubheader": "Diagnosed treatments walk out the door and never get scheduled",
        "problemDescription": "Patients leave after appointments with diagnoses for crowns, scaling, or implants but no follow-up appointment. Practices lose thousands in revenue per uncompleted treatment, and patients' dental health worsens—while the practice has no systematic way to bring them back.",
        "redditTitle": "r/DentalHygiene - How does your office handle patients who were treatment planned but never scheduled?",
        "redditComments": "48 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      }
    ]
  },
  {
    "id": "driving-schools",
    "name": "Driving Schools",
    "segment": "Education & Training",
    "keywords": [
      "driving-schools",
      "automation",
      "workflow",
      "education & training"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Course Progress & Test Readiness Notification",
        "steps": [
          {
            "t": "Webhook Trigger: Lesson Logged"
          },
          {
            "t": "Airtable: Update Student Scores"
          },
          {
            "t": "Code: Check Readiness Thresholds"
          },
          {
            "t": "IF: All Skills Passed"
          },
          {
            "t": "Claude: Draft Readiness Notification"
          },
          {
            "t": "Mailgun: Email Parent + Student"
          },
          {
            "t": "Twilio: SMS Notification"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Lesson Logged",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Update Student Scores",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Code: Check Readiness Thresholds",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "IF: All Skills Passed",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Claude: Draft Readiness Notification",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Email Parent + Student",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Twilio: SMS Notification",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Draft personalized readiness notification summarizing strengths and recommended next steps for the BMV test\n- Generate post-lesson parent summaries with skills observed and areas still developing",
        "testPlan": "1. Load a test student with all skills at passing threshold\n2. Submit a lesson completion webhook and verify readiness check triggers\n3. Confirm parent email and SMS arrive with test date recommendation\n4. Log a student with one failing skill and verify no notification is sent",
        "gtm": [
          {
            "channel": "High School Guidance Counselors",
            "desc": "Build relationships with guidance counselors in Fairfield, Mason, and West Chester schools who recommend driving programs."
          },
          {
            "channel": "Driving School Associations",
            "desc": "Present the progress tracking system at Ohio Driving School Association meetings."
          },
          {
            "channel": "Parent Facebook Groups",
            "desc": "Share the readiness notification feature in suburban parent Facebook groups where teen driving is frequently discussed."
          }
        ],
        "problemSubheader": "Parents don't know when their teen is ready to take the road test",
        "problemDescription": "Driving schools make test readiness decisions manually, leaving parents guessing. Teens go to the BMV before they're ready and fail—blaming the school—while ready students wait too long after crossing the threshold, wasting sessions and eroding family trust.",
        "redditTitle": "r/teendriving - How do you know when you're actually ready to take the road test?",
        "redditComments": "34 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "event-wedding-venues",
    "name": "Event & Wedding Venues",
    "segment": "Hospitality, Food & Venue",
    "keywords": [
      "event-wedding-venues",
      "automation",
      "workflow",
      "hospitality, food & venue"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Inquiry Intake & Date Qualification",
        "steps": [
          {
            "t": "Gmail Trigger"
          },
          {
            "t": "Claude: Extract Inquiry Details"
          },
          {
            "t": "HTTP Request: Check Calendar Availability"
          },
          {
            "t": "Airtable: Log Inquiry"
          },
          {
            "t": "Claude: Draft Availability Reply"
          },
          {
            "t": "Mailgun: Send Personalized Reply"
          }
        ],
        "nodes": [
          {
            "name": "Gmail Trigger",
            "type": "n8n-nodes-base.gmailTrigger"
          },
          {
            "name": "Claude: Extract Inquiry Details",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "HTTP Request: Check Calendar Availability",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Log Inquiry",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Draft Availability Reply",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Personalized Reply",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Extract event type, preferred date, guest count, and budget signals from raw inquiry emails\n- Draft a warm, personalized availability reply proposing tour times and reflecting the couple's event details",
        "testPlan": "1. Send a test inquiry email with a wedding date request\n2. Verify Claude extracts date, guest count, and event type correctly\n3. Check Airtable for a new inquiry record\n4. Confirm personalized reply email arrives within 5 minutes",
        "gtm": [
          {
            "channel": "Wedding Planner Partnerships",
            "desc": "Partner with local planners and coordinators who work across multiple venues and need faster availability checks."
          },
          {
            "channel": "Venue-Focused Web Designers",
            "desc": "Connect with web designers who build venue sites and can integrate the inquiry automation as a premium feature."
          },
          {
            "channel": "Bridal Show Presence",
            "desc": "Exhibit at Cincinnati and NKY bridal shows alongside venues to demonstrate the speed advantage."
          }
        ],
        "problemSubheader": "Venues lose bookings because they reply too slowly",
        "problemDescription": "Venues receive many email and phone inquiries but staff manually check availability calendars, leading to slow responses. Couples contact 4–6 venues simultaneously and commit to whichever replies first with a clear date-confirmed path—venues that respond in hours lose to ones that respond in minutes.",
        "redditTitle": "r/weddingplanning - We emailed 8 venues about our date. Only 2 responded within 24 hours. Booked one of them.",
        "redditComments": "112 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      },
      {
        "label": "Proposal & Contract Workflow",
        "steps": [
          {
            "t": "Webhook Trigger: Inquiry Qualified"
          },
          {
            "t": "Airtable: Get Package Options"
          },
          {
            "t": "Claude: Draft Proposal"
          },
          {
            "t": "Mailgun: Send Proposal Email"
          },
          {
            "t": "Webhook Trigger: Client Accepts"
          },
          {
            "t": "Google Docs: Generate Contract"
          },
          {
            "t": "HTTP Request: Send E-Signature Link"
          },
          {
            "t": "Airtable: Update Event Record"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Inquiry Qualified",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Get Package Options",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Draft Proposal",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Proposal Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Client Accepts",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Google Docs: Generate Contract",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "HTTP Request: Send E-Signature Link",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Update Event Record",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Draft a complete proposal with line-item pricing, inclusions, BYO conditions, and add-on options from venue data\n- Summarize contract terms in plain language for the client cover email",
        "testPlan": "1. Trigger a qualified inquiry webhook with event details and add-on selections\n2. Verify Claude produces a complete proposal with correct line-item pricing\n3. Confirm proposal email arrives with PDF attachment\n4. Simulate client acceptance and verify contract and e-signature link are generated",
        "gtm": [
          {
            "channel": "Venue Web Designers",
            "desc": "Bundle the proposal engine with new venue website builds as a booking conversion upgrade."
          },
          {
            "channel": "Caterer & Photographer Referrals",
            "desc": "Partner with vendors who work across multiple venues and benefit from faster signed contracts."
          },
          {
            "channel": "NKY & Cincinnati Wedding Groups",
            "desc": "Share before/after proposal timelines in local wedding planning Facebook communities."
          }
        ],
        "problemSubheader": "Venue managers spend hours manually assembling each proposal",
        "problemDescription": "Venue managers retype packages, pricing, add-ons, and policies into Word docs for each prospect. This slows the booking process, creates inconsistencies, and makes the venue look less professional than competitors who deliver polished proposals within the hour.",
        "redditTitle": "r/eventplanning - How long should it take a venue to send a contract after you say yes?",
        "redditComments": "78 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      }
    ]
  },
  {
    "id": "funeral-homes",
    "name": "Funeral Homes",
    "segment": "Professional Services",
    "keywords": [
      "funeral-homes",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "First-Call Intake & Case Creation",
        "steps": [
          {
            "t": "Webhook Trigger: Intake Form Submit"
          },
          {
            "t": "Airtable: Create Case Record"
          },
          {
            "t": "Claude: Generate Director Summary"
          },
          {
            "t": "Mailgun: Notify Director on Call"
          },
          {
            "t": "Airtable: Generate Task Checklist"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Intake Form Submit",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Create Case Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Generate Director Summary",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Notify Director on Call",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Generate Task Checklist",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Convert raw intake form responses into a structured case summary highlighting service type, family preferences, and immediate next steps for the director\n- Flag incomplete fields or unusual circumstances requiring immediate attention",
        "testPlan": "1. Submit a test intake form with decedent information and service preferences\n2. Verify Airtable case record created with all fields populated\n3. Check that director notification email arrives with Claude-generated summary\n4. Confirm task checklist is generated based on service type",
        "gtm": [
          {
            "channel": "Ohio Funeral Directors Association",
            "desc": "Present at OFDA events where technology adoption for operations is a growing topic among member homes."
          },
          {
            "channel": "Hospice & Hospital Liaisons",
            "desc": "Build relationships with hospice social workers who refer families and recommend technology-forward funeral homes."
          },
          {
            "channel": "FTC Compliance Consultants",
            "desc": "Partner with consultants who advise on funeral home compliance and can position intake automation as a risk reducer."
          }
        ],
        "problemSubheader": "First-call details get lost when families have to repeat themselves",
        "problemDescription": "Funeral homes manage first calls manually, making families repeat information as it passes between intake staff and directors. During high-stress moments, critical details get missed—creating errors in a process where precision and compassion are both non-negotiable.",
        "redditTitle": "r/funeraldirector - What intake system do you use that actually captures everything on the first call?",
        "redditComments": "26 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "independent-pharmacies",
    "name": "Independent Pharmacies",
    "segment": "Professional Services",
    "keywords": [
      "independent-pharmacies",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Refill Synchronization & Adherence",
        "steps": [
          {
            "t": "Schedule Trigger: Daily Check"
          },
          {
            "t": "HTTP Request: Query Pharmacy System"
          },
          {
            "t": "Code: Calculate Sync Date"
          },
          {
            "t": "Claude: Draft Sync Notification"
          },
          {
            "t": "Twilio: Send Sync SMS"
          },
          {
            "t": "Airtable: Log Sync Schedule"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Daily Check",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "HTTP Request: Query Pharmacy System",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Code: Calculate Sync Date",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Claude: Draft Sync Notification",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Send Sync SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Log Sync Schedule",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Generate patient-friendly notifications explaining the benefit of single-day pickup and the proposed new schedule\n- Flag patients with complex regimens where clinical pharmacist review is needed before syncing",
        "testPlan": "1. Load 3 test patients with multiple refills on different dates\n2. Trigger the daily schedule and verify sync dates are calculated correctly\n3. Confirm SMS notifications sent with the proposed sync date and benefit explanation\n4. Verify high-risk combination patients are flagged for review",
        "gtm": [
          {
            "channel": "Ohio Pharmacists Association",
            "desc": "Present at OPA and NCPA chapter meetings where med sync is recognized as a key independent pharmacy revenue driver."
          },
          {
            "channel": "FQHC & Clinic Partnerships",
            "desc": "Build relationships with local federally qualified health centers that co-manage chronic care patients with community pharmacies."
          },
          {
            "channel": "Pharmacy Software Vendors",
            "desc": "Partner with PMS vendors (PioneerRx, QS/1) to offer sync automation as an add-on for independent pharmacy clients."
          }
        ],
        "problemSubheader": "Chronic patients pick up meds on 5 different days and still miss doses",
        "problemDescription": "Independent pharmacies manually coordinate multiple refills per patient across different fill dates. Patients call repeatedly, staff spend hours on phone tag with insurers, and adherence suffers because medications arrive at different times—a problem med sync solves completely when automated.",
        "redditTitle": "r/pharmacy - Has anyone implemented med sync at an independent? What system do you use?",
        "redditComments": "43 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      },
      {
        "label": "Prior Authorization & Paperwork Flow",
        "steps": [
          {
            "t": "Webhook Trigger: New PA Case"
          },
          {
            "t": "Airtable: Create PA Record"
          },
          {
            "t": "Schedule Trigger: Daily Status Check"
          },
          {
            "t": "Airtable: Query Open PA Cases"
          },
          {
            "t": "IF: Past Expected Response Window"
          },
          {
            "t": "Claude: Draft Status Summary"
          },
          {
            "t": "Mailgun: Notify Prescriber"
          },
          {
            "t": "Twilio: Patient Status SMS"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: New PA Case",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Create PA Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Schedule Trigger: Daily Status Check",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Query Open PA Cases",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "IF: Past Expected Response Window",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Claude: Draft Status Summary",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Notify Prescriber",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Twilio: Patient Status SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Draft plain-language status updates for prescribers and patients at each PA stage\n- Summarize overdue PA cases with payer name, days outstanding, and recommended escalation steps",
        "testPlan": "1. Submit a test PA case webhook with payer, drug, and prescriber details\n2. Verify Airtable record created with all required fields\n3. Trigger daily check and confirm overdue case is flagged after simulated delay\n4. Verify prescriber email and patient SMS arrive with correct status",
        "gtm": [
          {
            "channel": "Specialty Clinic Partnerships",
            "desc": "Target specialty clinics generating many PAs and present the tracking system as a tool that improves their patient outcomes."
          },
          {
            "channel": "Pharmacy Benefits Consultants",
            "desc": "Work with PBM consultants who recommend operational tools to independent pharmacies."
          },
          {
            "channel": "State Pharmacy Association",
            "desc": "Present the PA tracking workflow at OPA conferences as a patient care and prescriber relationship tool."
          }
        ],
        "problemSubheader": "Prior auth requests disappear into the fax queue for weeks",
        "problemDescription": "Specialty medication prior authorizations are handled via manual fax and email exchanges with no tracking system. Patients wait, prescribers don't know the status, and pharmacies have no way to proactively escalate stalled cases—resulting in delayed care and frustrated relationships across the board.",
        "redditTitle": "r/pharmacy - How do you track prior auth status across 30+ open cases without losing your mind?",
        "redditComments": "51 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "law-firms",
    "name": "Law Firms",
    "segment": "Professional Services",
    "keywords": [
      "law-firms",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Client Intake Automation",
        "steps": [
          {
            "t": "Webhook Trigger: Intake Form"
          },
          {
            "t": "Claude: Summarize Matter + Flag Issues"
          },
          {
            "t": "HTTP Request: Run Conflict Check"
          },
          {
            "t": "IF: Conflict Clear"
          },
          {
            "t": "Airtable: Create Matter Record"
          },
          {
            "t": "Mailgun: Acknowledge to Prospect"
          },
          {
            "t": "Mailgun: Notify Partner"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Intake Form",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Summarize Matter + Flag Issues",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "HTTP Request: Run Conflict Check",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "IF: Conflict Clear",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Create Matter Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Acknowledge to Prospect",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Notify Partner",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Summarize the matter in attorney-friendly language highlighting key facts, urgency signals, and relevant legal area\n- Flag potential issues or missing information the intake attorney should clarify",
        "testPlan": "1. Submit a test intake form for a business dispute\n2. Verify Claude summary identifies the correct practice area and key facts\n3. Confirm conflict check runs and IF branch routes correctly\n4. Check that prospect acknowledgment and partner notification both arrive",
        "gtm": [
          {
            "channel": "Legal Marketing Agencies",
            "desc": "Partner with legal marketing firms and CRM vendors serving Cincinnati/NKY firms who can bundle intake automation."
          },
          {
            "channel": "Cincinnati Bar Association CLEs",
            "desc": "Present at Bar Association practice management CLEs where efficiency tools are directly relevant."
          },
          {
            "channel": "Super Lawyers Directory Outreach",
            "desc": "Target business litigation and corporate firms on Super Lawyers and Best Lawyers directories for LinkedIn outreach."
          }
        ],
        "problemSubheader": "Slow intake loses clients to the next firm on the list",
        "problemDescription": "Business litigation and corporate firms handle new matters via phone and email with staff manually capturing details and running conflict checks—delaying responsiveness and losing clients who contact multiple firms simultaneously. The first firm to send a clear acknowledgment typically wins the engagement.",
        "redditTitle": "r/lawyers - What's your intake process for new business inquiries? How fast do you respond?",
        "redditComments": "58 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      },
      {
        "label": "After-Hours Call Capture & Triage",
        "steps": [
          {
            "t": "Webhook Trigger: Missed Call"
          },
          {
            "t": "Twilio: After-Hours SMS"
          },
          {
            "t": "Webhook Trigger: SMS Reply"
          },
          {
            "t": "Claude: Classify Urgency"
          },
          {
            "t": "IF: Urgent Matter"
          },
          {
            "t": "Twilio: Alert On-Call Attorney"
          },
          {
            "t": "Airtable: Queue for Morning Intake"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Missed Call",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Twilio: After-Hours SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: SMS Reply",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Classify Urgency",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "IF: Urgent Matter",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Alert On-Call Attorney",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Queue for Morning Intake",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Classify urgency of after-hours inquiries based on described situation (active dispute, injunction, regulatory deadline vs. general inquiry)\n- Draft a morning intake summary for each queued caller so attorneys start each day prepared",
        "testPlan": "1. Simulate a missed call webhook from a test number\n2. Verify after-hours SMS arrives within 60 seconds\n3. Reply with an urgent scenario and confirm on-call attorney SMS fires\n4. Reply with a routine matter and confirm it routes to morning queue in Airtable",
        "gtm": [
          {
            "channel": "Legal Phone System Vendors",
            "desc": "Partner with legal phone system and answering service providers who can offer SMS triage as an upgrade."
          },
          {
            "channel": "Cincinnati Bar Association",
            "desc": "Present the after-hours capture system at Bar Association practice management events."
          },
          {
            "channel": "Legal Ops Consultants",
            "desc": "Work with legal ops consultants serving mid-size firms in Blue Ash, Mason, and Northern Kentucky."
          }
        ],
        "problemSubheader": "Business emergencies go to voicemail and the next firm answers",
        "problemDescription": "Calls after 5pm go to voicemail. Clients facing active business disputes, injunctions, or regulatory deadlines don't wait—they call the next firm on the list. Law firms lose high-value emergency engagements simply because no one responded the same evening.",
        "redditTitle": "r/legaladvice - Called 4 law firms about a cease-and-desist. The one that called back at 8pm got my business.",
        "redditComments": "93 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "legal-ip-legaltech",
    "name": "Legal, IP & Legaltech",
    "segment": "Professional Services",
    "keywords": [
      "legal-ip-legaltech",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "IP Database & Alert Workspace",
        "steps": [
          {
            "t": "Schedule Trigger: Weekly"
          },
          {
            "t": "HTTP Request: USPTO API Query"
          },
          {
            "t": "Code: Parse Registry Results"
          },
          {
            "t": "Claude: Flag Conflicts & Opportunities"
          },
          {
            "t": "Airtable: Update IP Portfolio"
          },
          {
            "t": "Mailgun: Client Update Email"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Weekly",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "HTTP Request: USPTO API Query",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Code: Parse Registry Results",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Claude: Flag Conflicts & Opportunities",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Airtable: Update IP Portfolio",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Client Update Email",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Analyze USPTO results for potential conflicts with existing client marks or patents\n- Identify renewal deadlines, opposition windows, and expansion opportunities in plain language for client reports",
        "testPlan": "1. Configure 3 test client terms in Airtable\n2. Trigger the weekly schedule and verify USPTO API query fires\n3. Confirm Claude returns conflict flags and deadline alerts\n4. Check that client update email arrives with correct IP status summary",
        "gtm": [
          {
            "channel": "Corporate Law Firm Partners",
            "desc": "Partner with Cincinnati corporate law firms that have IP practices and need a monitoring layer for client portfolios."
          },
          {
            "channel": "Manufacturing & Pharma In-House Legal",
            "desc": "Target in-house legal teams at Southwest Ohio manufacturers with large trademark/patent portfolios."
          },
          {
            "channel": "IP Bar Section Events",
            "desc": "Present at Cincinnati Bar IP section events as a practice efficiency and client service tool."
          }
        ],
        "problemSubheader": "IP deadlines and conflicts get missed in manual registry monitoring",
        "problemDescription": "IP firms tracking patents and trademarks rely on siloed spreadsheets and infrequent manual registry checks. Missed opposition windows and renewal deadlines cost clients thousands in lost rights and litigation exposure—entirely preventable with systematic weekly monitoring.",
        "redditTitle": "r/IPlaw - What tools do you use to monitor trademark registries for client conflicts?",
        "redditComments": "31 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "manufacturing-job-shops",
    "name": "Manufacturing Job Shops",
    "segment": "Industrial, Trades & Field Ops",
    "keywords": [
      "manufacturing-job-shops",
      "automation",
      "workflow",
      "industrial, trades & field ops"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "RFQ Intake & Estimation Prep",
        "steps": [
          {
            "t": "Gmail Trigger"
          },
          {
            "t": "Code: Extract Attachment Text"
          },
          {
            "t": "Claude: Parse RFQ Specs"
          },
          {
            "t": "Code: Apply Estimating Rules"
          },
          {
            "t": "Airtable: Create Quote Record"
          },
          {
            "t": "Mailgun: Notify Estimator"
          }
        ],
        "nodes": [
          {
            "name": "Gmail Trigger",
            "type": "n8n-nodes-base.gmailTrigger"
          },
          {
            "name": "Code: Extract Attachment Text",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Claude: Parse RFQ Specs",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Code: Apply Estimating Rules",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Airtable: Create Quote Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Notify Estimator",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Extract quantities, materials, tolerances, finish requirements, and delivery expectations from RFQ text and PDF annotations\n- Identify ambiguous specs requiring clarification before accurate estimation can proceed",
        "testPlan": "1. Send a test RFQ email with a PDF describing a machined part\n2. Verify Claude extracts material, quantity, tolerance, and deadline correctly\n3. Check Airtable for new quote record with populated fields\n4. Confirm estimator notification email arrives with extracted specs",
        "gtm": [
          {
            "channel": "MADE Chamber Events",
            "desc": "Present the RFQ automation at MADE Chamber and West Chester-Liberty events serving manufacturing employers."
          },
          {
            "channel": "ERP Vendor Partnerships",
            "desc": "Partner with ERP vendors serving Southwest Ohio job shops who can integrate the estimation prep tool."
          },
          {
            "channel": "Economic Development Agencies",
            "desc": "Work with local agencies that support manufacturing job shops and host technology peer-sharing events."
          }
        ],
        "problemSubheader": "Slow RFQ responses lose work to faster competitors",
        "problemDescription": "Job shops receive RFQs with CAD drawings and specs via email daily. Estimators manually skim documents, extract specs, and approximate machining times before they can even begin pricing—a process taking 4–12 hours per quote that costs work to shops responding the same day.",
        "redditTitle": "r/Manufacturing - How do you speed up RFQ response time without hiring another estimator?",
        "redditComments": "62 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Job Traveler & Status Updates",
        "steps": [
          {
            "t": "Webhook Trigger: PO Released"
          },
          {
            "t": "Airtable: Create Traveler Record"
          },
          {
            "t": "Webhook Trigger: Work Center Update"
          },
          {
            "t": "Airtable: Update Job Status"
          },
          {
            "t": "IF: Delay Risk Detected"
          },
          {
            "t": "Mailgun: Proactive Customer Update"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: PO Released",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Create Traveler Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Webhook Trigger: Work Center Update",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Update Job Status",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "IF: Delay Risk Detected",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Mailgun: Proactive Customer Update",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Optional: Claude generates customer-facing delay explanations in professional language when delay flags trigger",
        "testPlan": "1. Submit a test PO webhook and verify traveler record created in Airtable with routing steps\n2. Update status at two work centers and confirm Airtable reflects changes\n3. Create a delay condition and verify customer notification email fires\n4. Confirm all routing steps update sequentially",
        "gtm": [
          {
            "channel": "CNC & Fabrication Shop Owners",
            "desc": "Target shops in Fairfield and Colerain industrial parks through direct outreach and shop floor demos."
          },
          {
            "channel": "OEM Procurement Teams",
            "desc": "Work through OEM procurement contacts who demand supplier visibility and can create pull for the system."
          },
          {
            "channel": "ACI Manufacturing Events",
            "desc": "Demo the status tracking system at Allied Construction Industries and Southwest Ohio manufacturing association events."
          }
        ],
        "problemSubheader": "Customers call constantly because they have no order visibility",
        "problemDescription": "Tracking work orders through cutting, machining, finishing, and inspection via paper travelers makes real-time status impossible. Customers call repeatedly; shop managers spend hours on status calls instead of floor management—and delays are discovered too late to communicate proactively.",
        "redditTitle": "r/Manufacturing - How do you give customers order status updates without manually checking the floor?",
        "redditComments": "37 comments",
        "integrations": [
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "medical-clinics",
    "name": "Medical Clinics",
    "segment": "Healthcare & Care",
    "keywords": [
      "medical-clinics",
      "automation",
      "workflow",
      "healthcare & care"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "New Patient Intake & Triage Automation",
        "steps": [
          {
            "t": "Webhook Trigger: Intake Form"
          },
          {
            "t": "Claude: Parse Complaint + Assign Urgency"
          },
          {
            "t": "IF: High Urgency"
          },
          {
            "t": "Twilio: Alert Nursing Staff SMS"
          },
          {
            "t": "Slack: Notify Triage Slack Channel"
          },
          {
            "t": "Airtable: Store Triage Data"
          },
          {
            "t": "Claude: Generate Clinical Summary"
          },
          {
            "t": "Mailgun: Attach Summary to Schedule"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Intake Form",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Parse Complaint + Assign Urgency",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "IF: High Urgency",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Alert Nursing Staff SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Slack: Notify Triage Slack Channel",
            "type": "n8n-nodes-base.slack"
          },
          {
            "name": "Airtable: Store Triage Data",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Generate Clinical Summary",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Attach Summary to Schedule",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Parse patient chief complaints and assign urgency scores based on symptom severity, duration, and described acuity\n- Generate structured one-page clinical summaries for physician review before each patient encounter",
        "testPlan": "1. Submit a test intake form with 'chest tightness for 2 days' as chief complaint\n2. Verify Claude assigns high urgency and nursing SMS fires within 60 seconds\n3. Submit a routine complaint and verify clinical summary is generated\n4. Check Airtable for properly stored triage record",
        "gtm": [
          {
            "channel": "Healthcare IT Consultants",
            "desc": "Partner with Cincinnati IT firms (IT GOAT, Ingage Partners, LayerCake) that have healthcare clinic clients needing triage tools."
          },
          {
            "channel": "EHR Implementation Firms",
            "desc": "Work with local EHR implementation and billing companies who have trusted relationships with clinic administrators."
          },
          {
            "channel": "Urgent Care Network Outreach",
            "desc": "Target urgent care chains on Solv Health and UrgentCareMap in West Chester, Mason, and Fairfield with a 'triage time savings' pitch."
          }
        ],
        "problemSubheader": "Front desks process intake paperwork moments before patients are roomed",
        "problemDescription": "Overloaded front desks collect intake forms and summarize concerns minutes before clinicians see patients—missing red flags, slowing triage, and burning clinical staff time on pre-work that should be automated. In urgent care environments, this delay directly affects care quality and throughput.",
        "redditTitle": "r/medicine - How do you triage walk-in patients efficiently when the front desk is overwhelmed?",
        "redditComments": "76 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "SLACK_BOT_TOKEN"
        ]
      },
      {
        "label": "No-Show Reduction & Waitlist Fill",
        "steps": [
          {
            "t": "Schedule Trigger: Daily"
          },
          {
            "t": "Airtable: Get Upcoming Appointments"
          },
          {
            "t": "IF: High No-Show Risk"
          },
          {
            "t": "Twilio: Confirmation SMS"
          },
          {
            "t": "Wait: 24 Hours"
          },
          {
            "t": "IF: Confirmed"
          },
          {
            "t": "Airtable: Query Waitlist"
          },
          {
            "t": "Twilio: Offer Slot to Waitlist"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Daily",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Upcoming Appointments",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "IF: High No-Show Risk",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Confirmation SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 24 Hours",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Confirmed",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Query Waitlist",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: Offer Slot to Waitlist",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Classify appointment types and patient history patterns most associated with no-shows to improve risk targeting\n- Draft waitlist offer messages with appropriate urgency and clinic-specific details",
        "testPlan": "1. Load test appointments including one behavioral health follow-up (high risk) into Airtable\n2. Trigger daily schedule and verify confirmation SMS fires for high-risk slot\n3. Simulate no confirmation after 24 hours and verify waitlist patient receives offer\n4. Track that confirmed appointments update correctly",
        "gtm": [
          {
            "channel": "Scheduling Software Vendors",
            "desc": "Partner with practice scheduling software vendors who can embed the AI waitlist engine as an add-on feature."
          },
          {
            "channel": "Behavioral Health Clinics",
            "desc": "Target behavioral health clinics with the highest no-show rates where this automation has the most measurable impact."
          },
          {
            "channel": "Urgent Care Directors",
            "desc": "Present the slot fill ROI to urgent care medical directors in Mason, West Chester, and Fairfield."
          }
        ],
        "problemSubheader": "No-shows waste clinician time and delay care for waiting patients",
        "problemDescription": "High no-show rates for follow-up visits waste clinician time and delay care for patients on waitlists. Manual confirmation calls are inconsistent and expensive—while the waitlist sits idle, unable to fill slots that were abandoned hours ago without automated notification.",
        "redditTitle": "r/medicine - What's your clinic's no-show rate and how do you manage it?",
        "redditComments": "64 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      }
    ]
  },
  {
    "id": "moving-storage-companies",
    "name": "Moving & Storage Companies",
    "segment": "Professional Services",
    "keywords": [
      "moving-storage-companies",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Estimate Requests & Job Scoping",
        "steps": [
          {
            "t": "Webhook Trigger: Estimate Form"
          },
          {
            "t": "Claude: Scope Job + Generate Estimate"
          },
          {
            "t": "Airtable: Create Lead Record"
          },
          {
            "t": "Mailgun: Email Estimate"
          },
          {
            "t": "Twilio: Estimate SMS"
          },
          {
            "t": "Wait: 24 Hours"
          },
          {
            "t": "IF: Booked"
          },
          {
            "t": "Mailgun: Follow-Up Email"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Estimate Form",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Scope Job + Generate Estimate",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Airtable: Create Lead Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Email Estimate",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Twilio: Estimate SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 24 Hours",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Booked",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Mailgun: Follow-Up Email",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Infer truck size, crew count, and job duration from inventory details and home characteristics\n- Draft tiered estimate copy (standard, premium) with clear inclusions and call to action",
        "testPlan": "1. Submit a test estimate form for a 3-bedroom house with stairs and a piano\n2. Verify Claude produces crew and truck size estimates\n3. Confirm estimate email and SMS arrive within 2 minutes\n4. Check Airtable lead record created with follow-up trigger queued",
        "gtm": [
          {
            "channel": "Real Estate Agent Referrals",
            "desc": "Partner with real estate agents in Mason, West Chester, and Fairfield who constantly refer movers to relocating clients."
          },
          {
            "channel": "Apartment Complex Partnerships",
            "desc": "Connect with property managers at large apartment complexes who coordinate move-ins and move-outs year-round."
          },
          {
            "channel": "BBB Moving Directory Outreach",
            "desc": "Target movers with 4+ star BBB ratings in West Chester and Fairfield who have volume but slow estimate workflows."
          }
        ],
        "problemSubheader": "Movers lose jobs to competitors who quote faster",
        "problemDescription": "Moving companies manually estimate truck sizes and crews from unstructured phone calls, leading to over- or under-resourcing and slow responses. Homeowners comparison-shopping commit to the first company that sends a clear, professional estimate—making speed the primary competitive lever.",
        "redditTitle": "r/moving - Got quotes from 5 moving companies. One responded the same hour and had a detailed breakdown. I booked them.",
        "redditComments": "88 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Post-Move Follow-Up & Review Automation",
        "steps": [
          {
            "t": "Webhook Trigger: Move Complete"
          },
          {
            "t": "Twilio: Feedback SMS"
          },
          {
            "t": "Webhook Trigger: Rating Reply"
          },
          {
            "t": "IF: Rating 4-5 Stars"
          },
          {
            "t": "Claude: Draft Review Request"
          },
          {
            "t": "Twilio: Send Review Link"
          },
          {
            "t": "Mailgun: Route Claim to Staff"
          },
          {
            "t": "Airtable: Log Outcome"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Move Complete",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Twilio: Feedback SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Rating Reply",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "IF: Rating 4-5 Stars",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Claude: Draft Review Request",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Send Review Link",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Route Claim to Staff",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Log Outcome",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Draft warm, location-specific review request copy referencing the move details and suburb\n- Summarize damage reports in structured format for claims staff with key details extracted",
        "testPlan": "1. Trigger a move complete webhook with test customer details\n2. Verify feedback SMS arrives within 5 minutes\n3. Reply with a 5-star rating and confirm review link message is sent\n4. Reply with damage report and verify claims routing email fires with structured summary",
        "gtm": [
          {
            "channel": "Local SEO Agencies",
            "desc": "Partner with web and SEO agencies managing mover Google profiles who can resell review automation."
          },
          {
            "channel": "Moving Company Owner Forums",
            "desc": "Share the review funnel ROI in Moving Company Pro and Move for Hunger community groups."
          },
          {
            "channel": "BBB Directory Outreach",
            "desc": "Target movers in West Chester and Fairfield BBB listings who have inconsistent review counts despite good service."
          }
        ],
        "problemSubheader": "Movers rely on word-of-mouth but never systematically collect reviews",
        "problemDescription": "Moving companies depend on Google and BBB reviews for new bookings, but technicians rarely ask and office teams don't follow up. Only frustrated customers with damage claims leave feedback unprompted—while satisfied customers move on without leaving a trace that helps the next family find the business.",
        "redditTitle": "r/moving - Just had an amazing move but I forgot to leave a review. The company never followed up.",
        "redditComments": "39 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "music-arts-schools",
    "name": "Music & Arts Schools",
    "segment": "Education & Training",
    "keywords": [
      "music-arts-schools",
      "automation",
      "workflow",
      "education & training"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Lesson Scheduling & Studio Utilization",
        "steps": [
          {
            "t": "Webhook Trigger: New Enrollment"
          },
          {
            "t": "Airtable: Get Teacher Availability"
          },
          {
            "t": "Airtable: Get Room Constraints"
          },
          {
            "t": "Code: Match Student to Slot"
          },
          {
            "t": "Airtable: Book Lesson Slot"
          },
          {
            "t": "Mailgun: Confirm to Family"
          },
          {
            "t": "Mailgun: Notify Teacher"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: New Enrollment",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Get Teacher Availability",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Airtable: Get Room Constraints",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Code: Match Student to Slot",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Airtable: Book Lesson Slot",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Confirm to Family",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Notify Teacher",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Optional: Claude generates a welcome message to families referencing their child's instrument and assigned teacher",
        "testPlan": "1. Add a new enrollment webhook for a piano student with Tuesday/Thursday preference\n2. Verify available teacher and room are matched from Airtable\n3. Confirm lesson slot is booked and family/teacher confirmation emails arrive\n4. Test with conflicting availability to verify no double-booking occurs",
        "gtm": [
          {
            "channel": "School Band Director Referrals",
            "desc": "Build relationships with school band and choir directors who refer students to private instruction and can recommend efficient schools."
          },
          {
            "channel": "Music Teacher Associations",
            "desc": "Present the scheduling tool at Ohio Music Education Association chapter meetings."
          },
          {
            "channel": "Chamber Directory Outreach",
            "desc": "Target music and arts schools in Mason Deerfield and West Chester-Liberty Chamber member directories."
          }
        ],
        "problemSubheader": "Empty rooms and overscheduled teachers happen at the same time",
        "problemDescription": "Music and arts schools juggle teacher schedules and room allocations manually, creating a double problem: some rooms sit empty while others have conflicts, and some teachers are overbooked while available instructors have gaps. The result is frustrated families, underutilized space, and revenue left on the floor.",
        "redditTitle": "r/musicteachers - How do you schedule 20+ students across 8 teachers and 6 rooms without going insane?",
        "redditComments": "28 comments",
        "integrations": [
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      },
      {
        "label": "Tuition Billing & Attendance Management",
        "steps": [
          {
            "t": "Webhook Trigger: Lesson Attendance"
          },
          {
            "t": "Airtable: Update Attendance Log"
          },
          {
            "t": "Schedule Trigger: Monthly Billing"
          },
          {
            "t": "Airtable: Get Attendance vs Contract"
          },
          {
            "t": "Code: Calculate Invoice Adjustments"
          },
          {
            "t": "Claude: Write Invoice Explanation"
          },
          {
            "t": "Mailgun: Send Itemized Invoice"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Lesson Attendance",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Update Attendance Log",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Schedule Trigger: Monthly Billing",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Attendance vs Contract",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Code: Calculate Invoice Adjustments",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Claude: Write Invoice Explanation",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Itemized Invoice",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Write clear, friendly explanations of invoice adjustments that parents can understand without needing to call the school\n- Flag accounts with consistent missed lessons for the director's attention as potential churn signals",
        "testPlan": "1. Log attendance for a student who missed 2 sessions and had 1 make-up in a test month\n2. Trigger monthly billing and verify adjustments are calculated correctly\n3. Confirm Claude explanation references the specific missed and make-up lessons\n4. Check that invoice email arrives with itemized breakdown",
        "gtm": [
          {
            "channel": "Music School Owner Communities",
            "desc": "Share the billing automation in music school owner Facebook groups and Music Teachers National Association forums."
          },
          {
            "channel": "Local CPA Referrals",
            "desc": "Partner with CPAs and bookkeepers who manage music school finances and recommend operational tools."
          },
          {
            "channel": "Studio Software Vendors",
            "desc": "Connect with lesson management software vendors who can integrate the billing automation into their platform."
          }
        ],
        "problemSubheader": "Billing disputes with parents about missed lessons eat admin time every month",
        "problemDescription": "Music school billing that mixes contracted lessons, missed sessions, and make-ups is reconciled manually each month. Errors lead to parent disputes that consume admin time, damage relationships, and make cash flow unpredictable for owners who need clean monthly revenue.",
        "redditTitle": "r/musicteachers - How do you handle billing when students miss lessons and want credits?",
        "redditComments": "41 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "nonprofit-membership-organizations",
    "name": "Nonprofit Membership Organizations",
    "segment": "Professional Services",
    "keywords": [
      "nonprofit-membership-organizations",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Membership Renewal & Dues Collection",
        "steps": [
          {
            "t": "Schedule Trigger: Weekly"
          },
          {
            "t": "Airtable: Get Expiring Members"
          },
          {
            "t": "IF: Days Until Expiry"
          },
          {
            "t": "Claude: Draft Personalized Renewal"
          },
          {
            "t": "Mailgun: Send Renewal Email"
          },
          {
            "t": "Airtable: Update Renewal Status"
          },
          {
            "t": "Mailgun: Final Re-Engagement Email"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Weekly",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Expiring Members",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "IF: Days Until Expiry",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Claude: Draft Personalized Renewal",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Renewal Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Update Renewal Status",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Final Re-Engagement Email",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Write personalized renewal emails referencing specific member engagement history (events attended, committees, benefits used)\n- Generate lapse re-engagement messages with a compelling reason to return based on upcoming events or changes",
        "testPlan": "1. Load a test member expiring in 30 days with 3 events attended into Airtable\n2. Trigger schedule and verify Claude email references the attended events\n3. Simulate 60-day reminder and confirm different message fires\n4. Mark as lapsed and confirm re-engagement email is sent",
        "gtm": [
          {
            "channel": "Chamber Executive Directors",
            "desc": "Target chamber executive directors at Cincinnati, Mason Deerfield, West Chester-Liberty, and Colerain chambers with a renewal rate ROI case."
          },
          {
            "channel": "Association Management Consultants",
            "desc": "Partner with association management companies serving regional nonprofits and chambers."
          },
          {
            "channel": "BNI Chapter Directors",
            "desc": "Connect with local BNI directors who run referral chapters and understand recurring-membership pain."
          }
        ],
        "problemSubheader": "Members churn simply because nobody reminded them in a personal way",
        "problemDescription": "Business associations and nonprofits send generic renewal reminders that members ignore. High-value members who feel unrecognized for their participation don't renew—not because they've lost interest, but because the organization never acknowledged what they contributed.",
        "redditTitle": "r/nonprofit - How do you personalize membership renewal outreach without a dedicated staff person?",
        "redditComments": "47 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Event Registration & Attendance Tracking",
        "steps": [
          {
            "t": "Webhook Trigger: Registration"
          },
          {
            "t": "Airtable: Add to Event Roster"
          },
          {
            "t": "Mailgun: Registration Confirmation"
          },
          {
            "t": "Schedule Trigger: Day-Before Reminder"
          },
          {
            "t": "Mailgun: Reminder + Logistics Email"
          },
          {
            "t": "Webhook Trigger: Check-In Scan"
          },
          {
            "t": "Airtable: Log Attendance"
          },
          {
            "t": "Mailgun: Post-Event Materials + Survey"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Registration",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Add to Event Roster",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Registration Confirmation",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Schedule Trigger: Day-Before Reminder",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Mailgun: Reminder + Logistics Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Check-In Scan",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Log Attendance",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Post-Event Materials + Survey",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Generate post-event survey follow-up copy tailored to the specific event type and sponsor acknowledgments\n- Summarize event attendance and engagement patterns for board reporting",
        "testPlan": "1. Submit a test registration webhook for a chamber luncheon\n2. Verify Airtable roster updated and confirmation email sent\n3. Trigger day-before reminder and confirm email arrives\n4. Simulate check-in scan and verify attendance logged\n5. Trigger post-event flow and confirm survey email arrives",
        "gtm": [
          {
            "channel": "Event Venue Partnerships",
            "desc": "Partner with event venues and caterers tied to chambers who see recurring operational pain at every event."
          },
          {
            "channel": "Association Software Vendors",
            "desc": "Work with member management software vendors who serve regional nonprofits and chambers."
          },
          {
            "channel": "Chamber Staff Direct Outreach",
            "desc": "Target administrative staff at Cincinnati-area chambers through LinkedIn with a 'what's your check-in process' opener."
          }
        ],
        "problemSubheader": "Chamber events run on scattered spreadsheets with no post-event follow-up",
        "problemDescription": "Registration for member luncheons, expos, and workshops is handled in scattered systems. Check-in is manual, post-event follow-up is inconsistent, and leadership has no clear view of which members actually show up—making it impossible to prove event value to the board or improve future programs.",
        "redditTitle": "r/nonprofit - How do you track actual event attendance vs. registrations for your board reports?",
        "redditComments": "33 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      }
    ]
  },
  {
    "id": "outpatient-therapy-clinics",
    "name": "Outpatient Therapy Clinics",
    "segment": "Healthcare & Care",
    "keywords": [
      "outpatient-therapy-clinics",
      "automation",
      "workflow",
      "healthcare & care"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Referral Intake & Benefits Check",
        "steps": [
          {
            "t": "Gmail Trigger"
          },
          {
            "t": "Claude: Extract Referral Details"
          },
          {
            "t": "HTTP Request: Insurance Eligibility Check"
          },
          {
            "t": "Code: Parse Coverage Response"
          },
          {
            "t": "Airtable: Create Referral Record"
          },
          {
            "t": "Mailgun: Patient Welcome + Coverage"
          },
          {
            "t": "Twilio: Patient Scheduling SMS"
          }
        ],
        "nodes": [
          {
            "name": "Gmail Trigger",
            "type": "n8n-nodes-base.gmailTrigger"
          },
          {
            "name": "Claude: Extract Referral Details",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "HTTP Request: Insurance Eligibility Check",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Code: Parse Coverage Response",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Airtable: Create Referral Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Patient Welcome + Coverage",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Twilio: Patient Scheduling SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Extract patient name, diagnosis, therapy type, urgency, and referring provider from unstructured fax/email referral text\n- Translate raw insurance eligibility response into plain-language coverage summary for patient communication",
        "testPlan": "1. Send a test referral email with patient name, diagnosis, and insurance ID\n2. Verify Claude extracts all fields correctly\n3. Confirm eligibility check runs and coverage is parsed\n4. Check that patient email and SMS both arrive with coverage details and scheduling link",
        "gtm": [
          {
            "channel": "Hospital Physician Liaison Teams",
            "desc": "Work with TriHealth and Mercy physician liaisons who want better referral closure metrics from community therapy partners."
          },
          {
            "channel": "PT Clinic Administrator Outreach",
            "desc": "Target outpatient PT and OT clinic administrators in Mason, West Chester, and Fairfield via LinkedIn with the referral delay ROI."
          },
          {
            "channel": "Employer Case Manager Networks",
            "desc": "Partner with employer case managers coordinating care for injured workers who need fast therapy access."
          }
        ],
        "problemSubheader": "Patients wait days after a referral before anyone contacts them",
        "problemDescription": "PT, OT, and counseling clinics receive referrals via fax and email and manually check insurance eligibility before scheduling—a process that takes days and leaves patients confused about their coverage and next steps. The delay erodes referral relationships and frustrates patients who need care now.",
        "redditTitle": "r/physicaltherapy - My doctor sent a referral 2 weeks ago. The PT clinic still hasn't called me.",
        "redditComments": "95 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Progress Note & Outcome Summaries",
        "steps": [
          {
            "t": "Webhook Trigger: Post-Session Prompts"
          },
          {
            "t": "Airtable: Store Session Notes"
          },
          {
            "t": "Code: Check Milestone Visit Count"
          },
          {
            "t": "IF: Milestone Reached"
          },
          {
            "t": "Claude: Assemble Progress Summary"
          },
          {
            "t": "Google Docs: Generate Report"
          },
          {
            "t": "Mailgun: Send to Physician + Payer"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Post-Session Prompts",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Store Session Notes",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Code: Check Milestone Visit Count",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "IF: Milestone Reached",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Claude: Assemble Progress Summary",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Google Docs: Generate Report",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "Mailgun: Send to Physician + Payer",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Convert 3–5 clinician prompt responses per session into structured progress notes in standard therapy documentation format\n- Assemble milestone summary reports with functional outcome measures formatted for physician and payer review",
        "testPlan": "1. Submit post-session prompts for 6 visits for a test patient\n2. Verify milestone check triggers at visit 4 and 6\n3. Confirm Claude generates a complete progress summary from the session data\n4. Check that physician email arrives with PDF report attached",
        "gtm": [
          {
            "channel": "Utilization Review Firms",
            "desc": "Partner with utilization review and case management firms who need standardized therapy documentation from partner clinics."
          },
          {
            "channel": "PT/OT Continuing Education Events",
            "desc": "Demo the documentation tool at Ohio PT/OT association CE events where clinical efficiency is a top-of-mind concern."
          },
          {
            "channel": "EHR Consultants",
            "desc": "Work with EHR consultants serving outpatient therapy clinics in the Cincinnati metro area."
          }
        ],
        "problemSubheader": "Therapists spend more time documenting than treating",
        "problemDescription": "Therapists write progress notes manually and compile outcome summaries for physicians and insurers by hand—consuming 30–45 minutes per documentation cycle that should go to patient care. In high-volume clinics, documentation backlog is the number one cause of clinician burnout.",
        "redditTitle": "r/physicaltherapy - How much time do you spend on documentation vs. treating? It's getting out of control.",
        "redditComments": "103 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      }
    ]
  },
  {
    "id": "pest-control",
    "name": "Pest Control",
    "segment": "Home Services",
    "keywords": [
      "pest-control",
      "automation",
      "workflow",
      "home services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Route & Service Coordination",
        "steps": [
          {
            "t": "Schedule Trigger: Daily AM"
          },
          {
            "t": "Airtable: Get Tomorrow's Jobs"
          },
          {
            "t": "HTTP Request: Google Maps Distance Matrix"
          },
          {
            "t": "Claude: Assign Optimized Routes"
          },
          {
            "t": "Airtable: Write Route Plans"
          },
          {
            "t": "Twilio: SMS Run Sheet to Each Tech"
          },
          {
            "t": "Webhook Trigger: Same-Day Change"
          },
          {
            "t": "Claude: Rebalance Affected Routes"
          },
          {
            "t": "Twilio: Push Updated Schedule"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Daily AM",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Tomorrow's Jobs",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "HTTP Request: Google Maps Distance Matrix",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Claude: Assign Optimized Routes",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Airtable: Write Route Plans",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: SMS Run Sheet to Each Tech",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Same-Day Change",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Rebalance Affected Routes",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Push Updated Schedule",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Assign optimized stop sequences per technician respecting time windows, priority customers, and service type duration flags\n- Generate driver-friendly SMS run sheets with concise stop descriptions and map links",
        "testPlan": "1. Load 12 test stops with addresses and time windows into Airtable\n2. Trigger the AM schedule and verify Google Maps API call succeeds\n3. Confirm Claude produces distinct routes per tech with no time-window violations\n4. Simulate a cancellation webhook and verify the affected tech receives an updated SMS route",
        "gtm": [
          {
            "channel": "Colerain Chamber Events",
            "desc": "Present route optimization at Colerain Chamber services-directory member lunches where pest operators network with contractors."
          },
          {
            "channel": "Property Manager Partnerships",
            "desc": "Connect with L & B Management and HOA property managers who coordinate pest vendors for communities and want reliable partners."
          },
          {
            "channel": "BBB Pest Directory Outreach",
            "desc": "Target regional pest firms with 10+ technicians in the BBB West Chester and Hamilton County directories."
          }
        ],
        "problemSubheader": "Pest techs crisscross the city burning fuel on manual routes",
        "problemDescription": "Pest control operators plan routes manually from a notebook or calendar rather than optimizing by geography and time windows. Inefficient routing turns into higher fuel costs, fewer stops per day, and missed same-day service promises—eating margin in a competitive local market where 1,200+ providers operate.",
        "redditTitle": "r/pestcontrol - How do you schedule 8 techs across 60+ jobs per day without route chaos?",
        "redditComments": "54 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER"
        ]
      },
      {
        "label": "Follow-Up Reactivation & Review Automation",
        "steps": [
          {
            "t": "Schedule Trigger: Weekly"
          },
          {
            "t": "Airtable: Query Lapsed Customers"
          },
          {
            "t": "Claude: Draft Reactivation Message"
          },
          {
            "t": "Twilio: Reactivation SMS"
          },
          {
            "t": "Mailgun: Educational Follow-Up Email"
          },
          {
            "t": "Webhook Trigger: Job Closed"
          },
          {
            "t": "Twilio: Feedback SMS"
          },
          {
            "t": "IF: Rating 4-5 Stars"
          },
          {
            "t": "Claude: Draft Review Request"
          },
          {
            "t": "Twilio: Send Review Link"
          },
          {
            "t": "Mailgun: Route Low Rating to Manager"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Weekly",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Query Lapsed Customers",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Draft Reactivation Message",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Reactivation SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Educational Follow-Up Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Job Closed",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Twilio: Feedback SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "IF: Rating 4-5 Stars",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Claude: Draft Review Request",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Send Review Link",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Route Low Rating to Manager",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Draft localized reactivation messages referencing suburb, pest type, and seasonal context for each lapsed customer\n- Write city-specific review request copy that feels personal rather than automated",
        "testPlan": "1. Load test customers with last treatment 95 and 185 days ago\n2. Trigger weekly schedule and verify correct message tier fires for each\n3. Simulate job close webhook and confirm feedback SMS arrives within 5 minutes\n4. Reply with 5-star rating and confirm review link is sent\n5. Reply with 2-star rating and verify manager routing email fires",
        "gtm": [
          {
            "channel": "Residential Cleaning Cross-Referral",
            "desc": "Partner with MaidPro Mason and More Hands Cleaning who serve the same households and can cross-refer pest service."
          },
          {
            "channel": "Local SEO Agencies",
            "desc": "Work with agencies managing Google profiles for pest companies (Magnet Co, Helium SEO) who can resell review automation."
          },
          {
            "channel": "Franchise Pest Brand Outreach",
            "desc": "Target Orkin, Moxie, and Merlin franchise owners who have volume but inconsistent follow-up processes."
          }
        ],
        "problemSubheader": "Recurring pest clients lapse quietly with no one noticing",
        "problemDescription": "Quarterly or annual pest treatments are sold as ongoing service, but customers quietly lapse when nobody reaches out at the right time. Office teams lack capacity to run anniversary lists and send targeted reminders—leaking recurring revenue while competitors with better follow-up win back the same households.",
        "redditTitle": "r/pestcontrol - How do you keep recurring customers coming back without calling everyone individually?",
        "redditComments": "46 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "photography-video-studios",
    "name": "Photography & Video Studios",
    "segment": "Retail & Consumer Services",
    "keywords": [
      "photography-video-studios",
      "automation",
      "workflow",
      "retail & consumer services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Lead Pipeline & Shoot Delivery Automation",
        "steps": [
          {
            "t": "Gmail Trigger"
          },
          {
            "t": "Claude: Classify Inquiry + Suggest Package"
          },
          {
            "t": "Airtable: Log Lead"
          },
          {
            "t": "Mailgun: Send Proposal Reply"
          },
          {
            "t": "Webhook Trigger: Gallery Published"
          },
          {
            "t": "Mailgun: Gallery Delivery Email"
          },
          {
            "t": "Wait: 4 Days"
          },
          {
            "t": "Claude: Draft Review Request"
          },
          {
            "t": "Twilio: Review Request SMS"
          }
        ],
        "nodes": [
          {
            "name": "Gmail Trigger",
            "type": "n8n-nodes-base.gmailTrigger"
          },
          {
            "name": "Claude: Classify Inquiry + Suggest Package",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Airtable: Log Lead",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Send Proposal Reply",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Gallery Published",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Mailgun: Gallery Delivery Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 4 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "Claude: Draft Review Request",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Review Request SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Identify event type, date preference, location, and budget signals from raw inquiry text and suggest matching packages\n- Draft warm, location-specific review request copy referencing the specific event details",
        "testPlan": "1. Send a test inquiry email for a Mason wedding in June\n2. Verify Claude suggests 1–2 appropriate packages with pricing\n3. Trigger gallery published webhook and confirm delivery email arrives\n4. Simulate 4-day wait and confirm review request SMS fires",
        "gtm": [
          {
            "channel": "Wedding Venue Partnerships",
            "desc": "Connect with Vinoklet Winery, Mulhauser Barn, and Madison Event Center who regularly refer photographers to booked couples."
          },
          {
            "channel": "Wedding Planner Referrals",
            "desc": "Build relationships with local wedding planners who manage vendor recommendations and appreciate well-organized photographers."
          },
          {
            "channel": "Photography Association Events",
            "desc": "Share the lead-to-delivery automation at Professional Photographers of Ohio chapter meetings."
          }
        ],
        "problemSubheader": "Photography studios convert leads manually and forget to ask for reviews",
        "problemDescription": "Studios receive inquiries via email, DMs, and referrals but match prospects to packages manually and respond hours or days later. After shoots, galleries are delivered with no systematic follow-up for testimonials—leaving word-of-mouth and referral revenue on the table in a business that runs almost entirely on trust.",
        "redditTitle": "r/weddingphotography - How do you handle the volume of inquiries during engagement season without missing any?",
        "redditComments": "57 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "residential-property-management",
    "name": "Residential Property Management",
    "segment": "Property, Facilities & Real Estate",
    "keywords": [
      "residential-property-management",
      "automation",
      "workflow",
      "property, facilities & real estate"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Maintenance Request Intake & Dispatch",
        "steps": [
          {
            "t": "Gmail Trigger"
          },
          {
            "t": "Claude: Extract Issue + Assign Urgency"
          },
          {
            "t": "IF: Emergency"
          },
          {
            "t": "Twilio: Emergency Alert to Manager"
          },
          {
            "t": "Airtable: Create Work Order"
          },
          {
            "t": "Mailgun: Assign to Vendor"
          },
          {
            "t": "Twilio: Tenant Acknowledgment SMS"
          },
          {
            "t": "Webhook Trigger: Job Complete"
          },
          {
            "t": "Twilio: Tenant Completion SMS"
          }
        ],
        "nodes": [
          {
            "name": "Gmail Trigger",
            "type": "n8n-nodes-base.gmailTrigger"
          },
          {
            "name": "Claude: Extract Issue + Assign Urgency",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "IF: Emergency",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Emergency Alert to Manager",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Create Work Order",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Assign to Vendor",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Twilio: Tenant Acknowledgment SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Job Complete",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Twilio: Tenant Completion SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Extract unit number, issue type, urgency, and any safety flags from unstructured tenant maintenance messages\n- Draft tenant acknowledgment and vendor assignment messages in appropriate tone",
        "testPlan": "1. Send a test maintenance email with 'no hot water in unit 204'\n2. Verify Claude extracts unit and issue type correctly\n3. Confirm plumber vendor assignment email and tenant acknowledgment SMS both fire\n4. Trigger job complete webhook and verify tenant completion SMS is sent",
        "gtm": [
          {
            "channel": "Contractor Vendor Network",
            "desc": "Partner with electricians, plumbers, and roofers from Colerain Chamber directories who benefit from organized work orders."
          },
          {
            "channel": "iPropertyManagement Directory",
            "desc": "Target Southwest Ohio property management firms listed in iPropertyManagement rankings for direct outreach."
          },
          {
            "channel": "HOA Management Associations",
            "desc": "Present the dispatch system at Community Associations Institute Ohio chapter events."
          }
        ],
        "problemSubheader": "Tenants submit requests and never hear back for days",
        "problemDescription": "Small-to-mid-size property managers receive maintenance requests via email, phone, and portal simultaneously. Triage is manual, urgent issues get lost in inboxes, and tenants call repeatedly to check status—eroding satisfaction scores, increasing churn, and consuming manager time that should go to proactive management.",
        "redditTitle": "r/PropertyManagement - What's your system for triaging maintenance requests when you manage 200+ units?",
        "redditComments": "74 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Vacancy Marketing & Applicant Tracking",
        "steps": [
          {
            "t": "Webhook Trigger: Move-Out Scheduled"
          },
          {
            "t": "HTTP Request: Publish to Zillow"
          },
          {
            "t": "HTTP Request: Publish to Apartments.com"
          },
          {
            "t": "Webhook Trigger: New Inquiry"
          },
          {
            "t": "Airtable: Create Applicant Record"
          },
          {
            "t": "Claude: Generate Applicant Summary"
          },
          {
            "t": "Mailgun: Inquiry Acknowledgment"
          },
          {
            "t": "Airtable: Track Stage Progress"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Move-Out Scheduled",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "HTTP Request: Publish to Zillow",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "HTTP Request: Publish to Apartments.com",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: New Inquiry",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Create Applicant Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Generate Applicant Summary",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Inquiry Acknowledgment",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Track Stage Progress",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Generate concise applicant summaries from inquiry text covering income signals, household composition, pet status, and preliminary risk indicators\n- Draft vacancy listing copy optimized for Zillow and Apartments.com based on unit details",
        "testPlan": "1. Trigger a move-out webhook for a 2BR unit and verify listings are published to both platforms\n2. Submit a test inquiry and verify Airtable applicant record is created\n3. Confirm Claude summary is generated and attached to the record\n4. Verify acknowledgment email arrives for the test inquiry",
        "gtm": [
          {
            "channel": "Real Estate Attorney Referrals",
            "desc": "Partner with real estate attorneys in Cincinnati and West Chester who advise on lease language and recommend operational tools."
          },
          {
            "channel": "Property Investor Networks",
            "desc": "Present the vacancy system at Cincinnati REIA and local investment clubs where owners outsource management."
          },
          {
            "channel": "L & B Management Network",
            "desc": "Connect with L & B Management's network of HOA communities and single-family rental owners in target suburbs."
          }
        ],
        "problemSubheader": "Vacancies sit unfilled while inquiries pile up across 4 platforms",
        "problemDescription": "Property managers advertise vacant units inconsistently across platforms and track inquiries in spreadsheets. Applicants from Zillow, Apartments.com, phone, and email are hard to consolidate—and without a clear pipeline view, promising applicants fall through the cracks while units generate no rent.",
        "redditTitle": "r/PropertyManagement - How do you track applicants from multiple platforms without constantly switching tabs?",
        "redditComments": "59 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "real-estate-agencies",
    "name": "Real Estate Agencies",
    "segment": "Property, Facilities & Real Estate",
    "keywords": [
      "real-estate-agencies",
      "automation",
      "workflow",
      "property, facilities & real estate"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Lead Capture & Enrichment",
        "steps": [
          {
            "t": "Webhook Trigger: New Lead"
          },
          {
            "t": "HTTP Request: Enrich via Property API"
          },
          {
            "t": "Claude: Generate Lead Profile"
          },
          {
            "t": "Airtable: Save Enriched Lead"
          },
          {
            "t": "IF: Seller Signal"
          },
          {
            "t": "Twilio: Seller Intro SMS"
          },
          {
            "t": "Mailgun: Buyer Intro Email"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: New Lead",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "HTTP Request: Enrich via Property API",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Claude: Generate Lead Profile",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Airtable: Save Enriched Lead",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "IF: Seller Signal",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Seller Intro SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Buyer Intro Email",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Generate a concise lead profile identifying buyer vs. seller signals, likely motivation, and recommended initial outreach approach\n- Draft personalized intro messages that reflect the lead's likely situation rather than generic 'can I help you buy or sell' copy",
        "testPlan": "1. Submit a test lead webhook from Zillow with a Mason, OH address\n2. Verify property API enrichment call completes\n3. Confirm Claude generates a profile with buyer/seller signal classification\n4. Check that appropriate intro SMS or email fires based on the IF branch",
        "gtm": [
          {
            "channel": "Mortgage Broker Partnerships",
            "desc": "Partner with mortgage brokers and title companies who want better-qualified leads and can sponsor automation for preferred agents."
          },
          {
            "channel": "CRM Vendor Co-Marketing",
            "desc": "Work with FollowUpBoss and HubSpot partners serving Cincinnati-area real estate teams to offer the enrichment layer."
          },
          {
            "channel": "Brokerage Team Leader Outreach",
            "desc": "Target team-based brokerages in Mason, West Chester, and Fairfield on LinkedIn with a 'how many leads died waiting' opener."
          }
        ],
        "problemSubheader": "Agents manually copy shallow leads from 4 platforms into spreadsheets",
        "problemDescription": "Agents copy leads from Zillow, Realtor.com, Facebook, and voicemails into spreadsheets with no context beyond a name and phone number. Time spent profiling each lead before outreach is time not spent selling—while hot leads go cold because enrichment and personalization happen too slowly.",
        "redditTitle": "r/realestate - What's your workflow for handling leads from Zillow, Realtor.com, and Facebook at the same time?",
        "redditComments": "86 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Dead Lead Re-Engagement",
        "steps": [
          {
            "t": "Schedule Trigger: Weekly"
          },
          {
            "t": "Airtable: Query Inactive Leads"
          },
          {
            "t": "HTTP Request: MLS Market Data"
          },
          {
            "t": "Claude: Draft Re-Engagement Message"
          },
          {
            "t": "Mailgun: Send Re-Engagement Email"
          },
          {
            "t": "Wait: 5 Days"
          },
          {
            "t": "IF: Response Received"
          },
          {
            "t": "Airtable: Reactivate to Pipeline"
          },
          {
            "t": "Airtable: Archive Non-Responder"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Weekly",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Query Inactive Leads",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "HTTP Request: MLS Market Data",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Claude: Draft Re-Engagement Message",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Re-Engagement Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 5 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Response Received",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Reactivate to Pipeline",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Airtable: Archive Non-Responder",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Draft market-data-driven re-engagement messages that reference specific neighborhood price changes or development news relevant to each lead's prior preferences\n- Score lead responses to flag those showing renewed buying intent for agent follow-up",
        "testPlan": "1. Load 5 test leads inactive for 8 months with preferred suburb noted\n2. Trigger weekly schedule and verify MLS data is fetched for those suburbs\n3. Confirm Claude generates market-data-referenced messages for each lead\n4. Simulate a reply and verify lead is reactivated to pipeline in Airtable",
        "gtm": [
          {
            "channel": "Real Estate Coaches",
            "desc": "Partner with local real estate coaches and CRM consultants who already advise agents and want a database reactivation tool."
          },
          {
            "channel": "Team Leader LinkedIn Outreach",
            "desc": "Target team leaders at large suburban brokerages who have the biggest stale databases and the most to gain."
          },
          {
            "channel": "KW & RE/MAX Mastermind Groups",
            "desc": "Present the re-engagement system in Cincinnati KW and RE/MAX team mastermind groups."
          }
        ],
        "problemSubheader": "Stale databases full of leads who are NOW ready but nobody noticed",
        "problemDescription": "Old leads from renters, prior buyers, and 'just looking' prospects sit idle in CRM databases. Many are now ready due to changed circumstances—new jobs, growing families, market shifts—but no trigger exists to reach out at the right moment, leaving thousands of potential commissions dormant.",
        "redditTitle": "r/realestate - How do you re-engage old leads that went cold 12 months ago? Or do you just give up?",
        "redditComments": "72 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "residential-cleaning-services",
    "name": "Residential Cleaning Services",
    "segment": "Home Services",
    "keywords": [
      "residential-cleaning-services",
      "automation",
      "workflow",
      "home services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Lead Capture & Instant Estimate",
        "steps": [
          {
            "t": "Webhook Trigger: Inquiry Form"
          },
          {
            "t": "Claude: Infer Home Type + Apply Pricing"
          },
          {
            "t": "Airtable: Create Lead Record"
          },
          {
            "t": "Mailgun: Email Estimate"
          },
          {
            "t": "Twilio: SMS Estimate"
          },
          {
            "t": "Wait: 24 Hours"
          },
          {
            "t": "IF: Booked"
          },
          {
            "t": "Mailgun: Follow-Up Email"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Inquiry Form",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Infer Home Type + Apply Pricing",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Airtable: Create Lead Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Email Estimate",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Twilio: SMS Estimate",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 24 Hours",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Booked",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Mailgun: Follow-Up Email",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Infer missing home details (townhome vs. single-family, approx square footage) from address and form notes to complete pricing\n- Draft friendly estimate copy with one-time and recurring options that feel personalized rather than template-generated",
        "testPlan": "1. Submit a test inquiry for a Mason, OH address with 3 bedrooms noted\n2. Verify Claude infers home type and applies correct pricing tier\n3. Confirm estimate email and SMS arrive within 3 minutes\n4. Simulate 24-hour no-booking and verify follow-up email fires",
        "gtm": [
          {
            "channel": "Realtor & Property Manager Referrals",
            "desc": "Partner with realtors and L & B Management who need make-ready cleans and refer cleaning services to new homeowners."
          },
          {
            "channel": "Cleaning Franchise Networks",
            "desc": "Approach MaidPro and MaidThis franchise owners who have volume but inconsistent lead response processes."
          },
          {
            "channel": "BNI Chapter Membership",
            "desc": "Join local BNI chapters where cleaners, organizers, and home-service pros cross-refer clients."
          }
        ],
        "problemSubheader": "Cleaning inquiries go cold while owners are out on jobs",
        "problemDescription": "Residential cleaning services in Mason, West Chester, and Fairfield get inquiries via web forms, phone, and Facebook—but owners manually estimate pricing and respond hours or days later. Homeowners asking 3 competing cleaners commit to the first one with a clear price and easy booking link.",
        "redditTitle": "r/HomeImprovement - Got quotes from 4 cleaning companies. Only one responded the same day. Booked them.",
        "redditComments": "69 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Route Planning & Crew Scheduling",
        "steps": [
          {
            "t": "Schedule Trigger: Daily AM"
          },
          {
            "t": "Airtable: Get Today's Jobs"
          },
          {
            "t": "HTTP Request: Google Maps Distance Matrix"
          },
          {
            "t": "Code: Cluster by Area + Sequence"
          },
          {
            "t": "Airtable: Write Route Assignments"
          },
          {
            "t": "Twilio: SMS Run Sheet to Crew Lead"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Daily AM",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Today's Jobs",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "HTTP Request: Google Maps Distance Matrix",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Code: Cluster by Area + Sequence",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Airtable: Write Route Assignments",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: SMS Run Sheet to Crew Lead",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- None required for core routing; Claude can optionally generate crew-friendly natural-language run sheets from stop data",
        "testPlan": "1. Load 15 test jobs across Mason, West Chester, and Fairfield into Airtable\n2. Trigger AM schedule and verify Google Maps clustering runs\n3. Confirm each crew lead receives a distinct SMS with their stop sequence\n4. Simulate a cancellation and verify affected crew gets updated SMS",
        "gtm": [
          {
            "channel": "Cleaning Business Facebook Groups",
            "desc": "Share the route optimization case study in Cleaning Business Owners and House Cleaning Business Tips Facebook communities."
          },
          {
            "channel": "Pressure Washing Cross-Referral",
            "desc": "Partner with Renewing Power Wash (West Chester, Mason, Fairfield) and similar exterior cleaning firms with identical routing needs."
          },
          {
            "channel": "Maid Franchise Owner Events",
            "desc": "Present the routing tool at MaidPro and Molly Maid franchise owner regional meetings."
          }
        ],
        "problemSubheader": "Cleaning crews zig-zag across the city burning drive time between jobs",
        "problemDescription": "Cleaning business owners manually build daily crew routes, often sending teams from Mason to Fairfield to West Chester and back. Long drive times between stops reduce the number of homes serviced per day—directly cutting revenue without any corresponding reduction in labor cost.",
        "redditTitle": "r/cleaningbusiness - How do you build daily routes for 3 crews without it taking an hour every morning?",
        "redditComments": "43 comments",
        "integrations": [
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER"
        ]
      }
    ]
  },
  {
    "id": "restaurants-food-service",
    "name": "Restaurants & Food Service",
    "segment": "Hospitality, Food & Venue",
    "keywords": [
      "restaurants-food-service",
      "automation",
      "workflow",
      "hospitality, food & venue"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Reservation Handling & Table Optimization",
        "steps": [
          {
            "t": "Webhook Trigger: New Reservation"
          },
          {
            "t": "Airtable: Add to Reservation Queue"
          },
          {
            "t": "Claude: Suggest Table Assignment"
          },
          {
            "t": "Twilio: Confirmation SMS"
          },
          {
            "t": "Schedule Trigger: 2-Hour Reminder"
          },
          {
            "t": "Twilio: Reminder SMS"
          },
          {
            "t": "Webhook Trigger: Party Seated"
          },
          {
            "t": "Airtable: Update Occupancy"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: New Reservation",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Add to Reservation Queue",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Suggest Table Assignment",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Confirmation SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Schedule Trigger: 2-Hour Reminder",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Twilio: Reminder SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Party Seated",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Update Occupancy",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Suggest optimal table assignments based on party size, stated preferences, and current floor plan layout\n- Generate dynamic wait time estimates for the host stand based on current reservation and occupancy data",
        "testPlan": "1. Submit a test reservation webhook from a simulated Yelp source with party of 6\n2. Verify Claude suggests an appropriate table assignment\n3. Confirm SMS confirmation arrives within 2 minutes\n4. Trigger 2-hour reminder schedule and verify reminder SMS fires with parking info",
        "gtm": [
          {
            "channel": "Restaurant POS Resellers",
            "desc": "Partner with POS resellers serving independents in Mason, West Chester, and Fairfield who can bundle reservation management."
          },
          {
            "channel": "Restaurant Web Design Firms",
            "desc": "Connect with web agencies that build restaurant sites and can integrate the reservation flow as a premium feature."
          },
          {
            "channel": "Local Restaurant Association",
            "desc": "Present at Ohio Restaurant Association regional chapter events focused on operational efficiency for independents."
          }
        ],
        "problemSubheader": "Host stands juggle 4 reservation platforms and still double-book tables",
        "problemDescription": "Restaurants receive reservations from Google Maps, Yelp, OpenTable, and phone calls—managed manually on the host stand. The result is overbooking, frustrated guests, and empty tables during peak hours because walk-in management isn't coordinated with the reservation pipeline.",
        "redditTitle": "r/KitchenConfidential - How do you handle reservations from 4 different platforms without constantly double-booking?",
        "redditComments": "81 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Delivery Platform POS Integration",
        "steps": [
          {
            "t": "Webhook Trigger: DoorDash Order"
          },
          {
            "t": "Webhook Trigger: Uber Eats Order"
          },
          {
            "t": "Claude: Normalize to POS PLUs"
          },
          {
            "t": "HTTP Request: Push to POS Kitchen Queue"
          },
          {
            "t": "Airtable: Decrement Inventory"
          },
          {
            "t": "IF: Low Stock Alert"
          },
          {
            "t": "Twilio: Alert Manager Low Stock"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: DoorDash Order",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Webhook Trigger: Uber Eats Order",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Normalize to POS PLUs",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "HTTP Request: Push to POS Kitchen Queue",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Decrement Inventory",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "IF: Low Stock Alert",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Alert Manager Low Stock",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Map delivery platform item names to correct POS PLU codes, handling naming variations across platforms\n- Generate plain-language supplier alert messages when stock falls below configured thresholds",
        "testPlan": "1. Send a simulated DoorDash webhook with 3 menu items\n2. Verify Claude maps item names to correct POS PLUs\n3. Confirm HTTP request to POS returns 200 and kitchen queue is updated\n4. Set inventory below threshold for one item and verify manager SMS fires",
        "gtm": [
          {
            "channel": "POS Integrator Partnerships",
            "desc": "Partner with local POS integrators and delivery-app onboarding consultants who work with restaurant tech stacks."
          },
          {
            "channel": "Ghost Kitchen Operators",
            "desc": "Target ghost kitchen and multi-concept operators in Fairfield and Mason who run the highest delivery volumes."
          },
          {
            "channel": "Beverage Distributor Introductions",
            "desc": "Connect with beverage distributors who already have trusted relationships with restaurant owners and can introduce technology tools."
          }
        ],
        "problemSubheader": "Delivery orders require manual re-entry into the POS every time",
        "problemDescription": "Orders from DoorDash, Uber Eats, and direct channels require manual re-entry into the POS kitchen system—creating errors, mis-fires, and delayed kitchen operations during peak hours. Staffing shortages make it impossible to have someone dedicated to re-keying orders that should flow automatically.",
        "redditTitle": "r/KitchenConfidential - DoorDash tablet to POS re-entry is killing us on Friday nights. Any solutions?",
        "redditComments": "97 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER"
        ]
      }
    ]
  },
  {
    "id": "roofing-contractors",
    "name": "Roofing Contractors",
    "segment": "Home Services",
    "keywords": [
      "roofing-contractors",
      "automation",
      "workflow",
      "home services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Storm-Triggered Outreach Campaign",
        "steps": [
          {
            "t": "Schedule Trigger: Weather Check"
          },
          {
            "t": "HTTP Request: Weather API"
          },
          {
            "t": "IF: Storm Threshold Exceeded"
          },
          {
            "t": "Airtable: Get Homeowners in Affected ZIPs"
          },
          {
            "t": "Claude: Draft Storm Campaign Email"
          },
          {
            "t": "Mailgun: Send Campaign"
          },
          {
            "t": "Twilio: Storm Alert SMS"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Weather Check",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "HTTP Request: Weather API",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "IF: Storm Threshold Exceeded",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Get Homeowners in Affected ZIPs",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Draft Storm Campaign Email",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Mailgun: Send Campaign",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Twilio: Storm Alert SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Draft localized storm outreach emails referencing the specific subdivision, storm event date, and common damage indicators for the area\n- Adjust tone and urgency based on storm severity (hail size, wind speed) for more impactful outreach",
        "testPlan": "1. Inject a test weather API response with hail over 0.75 inches in a Mason ZIP\n2. Verify IF branch triggers and Airtable query returns homeowners in that ZIP\n3. Confirm Claude email references the subdivision name and storm details\n4. Check that email and SMS campaigns fire within 10 minutes of the test trigger",
        "gtm": [
          {
            "channel": "Insurance Agent Partnerships",
            "desc": "Partner with insurance agents who want rapid inspections for claims and can recommend your storm-response system to policyholders."
          },
          {
            "channel": "BBB & Angi Roofing Listings",
            "desc": "Target roofing contractors in BBB and Angi listings for Greater Cincinnati who lack storm outreach processes."
          },
          {
            "channel": "Local Web Agency Bundles",
            "desc": "Work with Skynet Technologies, Genesis Web Studio, and BigOrange Marketing to bundle storm campaigns into roofing website packages."
          }
        ],
        "problemSubheader": "Roofing companies wait for calls after storms while competitors book all the inspections",
        "problemDescription": "Roofing companies reactively wait for homeowners to call after hail or wind storms. Competitors who proactively reach affected neighborhoods within 24 hours capture inspection schedules first—leaving late responders with the homeowners who got 3 competing estimates before calling them.",
        "redditTitle": "r/Roofing - We had a major hail event last week. How do you get to homeowners before other roofers?",
        "redditComments": "74 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER"
        ]
      },
      {
        "label": "Canvass Lead Follow-Up Engine",
        "steps": [
          {
            "t": "Webhook Trigger: Canvass List Import"
          },
          {
            "t": "Airtable: Store Canvass Leads"
          },
          {
            "t": "Claude: Draft Personalized Follow-Up SMS"
          },
          {
            "t": "Twilio: Send Follow-Up SMS"
          },
          {
            "t": "Webhook Trigger: Reply Received"
          },
          {
            "t": "IF: Inspection Confirmed"
          },
          {
            "t": "Airtable: Log Confirmed Inspection"
          },
          {
            "t": "Twilio: Day-Of Reminder SMS"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Canvass List Import",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Store Canvass Leads",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Draft Personalized Follow-Up SMS",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: Send Follow-Up SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Reply Received",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "IF: Inspection Confirmed",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Log Confirmed Inspection",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: Day-Of Reminder SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Draft personalized follow-up SMS copy referencing the specific subdivision, canvass conversation notes, and proposed inspection time window\n- Generate appointment confirmation messages in a professional tone that builds credibility",
        "testPlan": "1. Import a test canvass list with 5 contacts and field notes\n2. Verify Claude drafts distinct SMS messages for each based on their notes\n3. Simulate a 'YES' reply and confirm inspection is logged and confirmation SMS fires\n4. Trigger day-of reminder for the confirmed inspection",
        "gtm": [
          {
            "channel": "Public Adjuster Partnerships",
            "desc": "Partner with public adjusters and restoration companies who want reliable roofing partners with organized inspection pipelines."
          },
          {
            "channel": "Roofing Sales Trainer Networks",
            "desc": "Present the canvass follow-up system in roofing sales training communities where contractors pay for lead conversion tactics."
          },
          {
            "channel": "Storm Restoration Associations",
            "desc": "Connect with National Roofing Contractors Association Ohio chapter members after major weather events."
          }
        ],
        "problemSubheader": "Canvass lists sit on clipboards with no systematic follow-up",
        "problemDescription": "After storms or neighborhood canvassing, roofers collect dozens of addresses and phone numbers but don't consistently follow up via SMS to convert interest into booked inspections. Manual dialing is slow, inconsistent, and stops when crews get busy—letting warm canvass leads go cold within 48 hours.",
        "redditTitle": "r/Roofing - What's your follow-up process after neighborhood canvassing? We're losing leads we already knocked.",
        "redditComments": "48 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      }
    ]
  },
  {
    "id": "salons-spas",
    "name": "Salons & Spas",
    "segment": "Retail & Consumer Services",
    "keywords": [
      "salons-spas",
      "automation",
      "workflow",
      "retail & consumer services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Booking & Schedule Orchestration",
        "steps": [
          {
            "t": "Gmail Trigger"
          },
          {
            "t": "Webhook Trigger: DM/Form Booking"
          },
          {
            "t": "Claude: Match to Stylist + Slot"
          },
          {
            "t": "Airtable: Check Calendar Availability"
          },
          {
            "t": "Airtable: Book Appointment"
          },
          {
            "t": "Twilio: Confirmation SMS"
          },
          {
            "t": "Schedule Trigger: 24hr Reminder"
          },
          {
            "t": "Twilio: Reminder SMS"
          }
        ],
        "nodes": [
          {
            "name": "Gmail Trigger",
            "type": "n8n-nodes-base.gmailTrigger"
          },
          {
            "name": "Webhook Trigger: DM/Form Booking",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Match to Stylist + Slot",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Airtable: Check Calendar Availability",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Airtable: Book Appointment",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: Confirmation SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Schedule Trigger: 24hr Reminder",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Twilio: Reminder SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Match service requests to the correct stylist or treatment room based on service type, duration, and skill requirements\n- Draft personalized confirmation and reminder messages that feel like they came from a real person",
        "testPlan": "1. Submit a test booking request via email for a balayage with a specific stylist\n2. Verify Claude identifies correct stylist and checks calendar availability\n3. Confirm Airtable shows the booking and client receives confirmation SMS\n4. Trigger 24-hour reminder and confirm it arrives",
        "gtm": [
          {
            "channel": "Instagram Beauty Marketing",
            "desc": "Partner with local Instagram/TikTok beauty marketers who work with salons and can advocate for better booking infrastructure."
          },
          {
            "channel": "Salon Suite Landlords",
            "desc": "Connect with salon suite landlords who can offer the booking tool as a value-add to independent stylists renting chairs."
          },
          {
            "channel": "Mitchell's & Pure Concept Outreach",
            "desc": "Target multi-location salons like Mitchell's Salon and Pure Concept Salon via LinkedIn with a chair utilization pitch."
          }
        ],
        "problemSubheader": "Front-desk staff juggle 4 channels and still create double-bookings",
        "problemDescription": "Salons receive bookings through phone, text, social DMs, and online forms simultaneously. Staff manually match clients to stylists and rooms—creating double-bookings during peak periods and idle gaps in the schedule that burn stylist income and owner revenue.",
        "redditTitle": "r/FulfillmentCenter - How does your salon handle booking requests that come in through Instagram DMs vs. phone vs. website?",
        "redditComments": "36 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "No-Show Reduction & Waitlist Fill",
        "steps": [
          {
            "t": "Schedule Trigger: 48hrs Before Appt"
          },
          {
            "t": "Airtable: Get High-Risk Appointments"
          },
          {
            "t": "Twilio: Confirmation Request SMS"
          },
          {
            "t": "Wait: 12 Hours"
          },
          {
            "t": "IF: Confirmed"
          },
          {
            "t": "Airtable: Query Waitlist for Time"
          },
          {
            "t": "Twilio: Waitlist Slot Offer SMS"
          },
          {
            "t": "Wait: 2 Hours"
          },
          {
            "t": "IF: Waitlist Accepted"
          },
          {
            "t": "Airtable: Update Booking"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: 48hrs Before Appt",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get High-Risk Appointments",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: Confirmation Request SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 12 Hours",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Confirmed",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Query Waitlist for Time",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: Waitlist Slot Offer SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 2 Hours",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Waitlist Accepted",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Update Booking",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Classify appointment risk level based on client history, service type, and time of day for targeted confirmation outreach\n- Draft waitlist offer SMS that conveys urgency without feeling pushy",
        "testPlan": "1. Load a test high-risk appointment 50 hours out\n2. Trigger reminder and verify confirmation SMS fires\n3. Simulate no confirmation after 12 hours and verify waitlist query runs\n4. Confirm waitlist client receives slot offer and booking updates on acceptance",
        "gtm": [
          {
            "channel": "Beauty Supply Reps",
            "desc": "Partner with local beauty supply representatives who already have trusted relationships with independent stylists and salon owners."
          },
          {
            "channel": "Salon Owner Facebook Groups",
            "desc": "Share the waitlist fill rate ROI in Salon & Spa Professional and Behind the Chair community groups."
          },
          {
            "channel": "Mason & West Chester Chamber Outreach",
            "desc": "Target salon owners listed in Mason Deerfield and West Chester-Liberty Chamber directories for demo offers."
          }
        ],
        "problemSubheader": "No-shows and late cancellations burn stylist income every week",
        "problemDescription": "Salon no-shows and last-minute cancellations eat into stylist income and salon revenue. Most rely on simple reminder texts without dynamic waitlists—so when a prime-time Saturday slot cancels at noon, the chair stays empty because nobody systematically offers it to the 10 clients who would have taken it.",
        "redditTitle": "r/HaircutAdvice - Anyone else book a Saturday appointment and just not show up? Your stylist loses money when you do that.",
        "redditComments": "63 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      }
    ]
  },
  {
    "id": "security-alarm-companies",
    "name": "Security & Alarm Companies",
    "segment": "Professional Services",
    "keywords": [
      "security-alarm-companies",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Lead Qualification & Site Survey Prep",
        "steps": [
          {
            "t": "Webhook Trigger: Inquiry Form"
          },
          {
            "t": "Claude: Score Lead + Suggest Package"
          },
          {
            "t": "IF: High-Score Lead"
          },
          {
            "t": "Airtable: Schedule Priority Survey"
          },
          {
            "t": "Mailgun: Survey Confirmation to Customer"
          },
          {
            "t": "Mailgun: Pre-Survey Brief to Rep"
          },
          {
            "t": "Airtable: Queue Low-Score for Phone"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Inquiry Form",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Score Lead + Suggest Package",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "IF: High-Score Lead",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Schedule Priority Survey",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Survey Confirmation to Customer",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Pre-Survey Brief to Rep",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Queue Low-Score for Phone",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Score each inquiry by urgency, opportunity size, and likely package fit based on home characteristics and stated concerns\n- Generate a pre-survey brief for the sales rep covering recommended products, key questions to ask, and neighborhood crime context",
        "testPlan": "1. Submit a test inquiry with prior break-in noted, 4-bedroom home, and Fairfield location\n2. Verify Claude scores the lead as high priority and suggests appropriate gear\n3. Confirm survey confirmation email fires to customer and pre-survey brief to rep\n4. Submit a low-score inquiry and verify it routes to phone queue in Airtable",
        "gtm": [
          {
            "channel": "Real Estate Agent Partnerships",
            "desc": "Partner with agents and property managers who recommend security providers to new homeowners and tenants in Mason and West Chester."
          },
          {
            "channel": "SafeHome.org Listings",
            "desc": "Target alarm installers listed on SafeHome.org for Fairfield and surrounding suburbs with direct outreach."
          },
          {
            "channel": "Electrician & Low-Voltage Contractor Referrals",
            "desc": "Connect with electricians in Colerain and West Chester who install cabling and can cross-refer alarm jobs."
          }
        ],
        "problemSubheader": "Sales reps waste limited survey time on leads that aren't ready to buy",
        "problemDescription": "Security and alarm firms receive many inquiries but manually triage which sites deserve fast surveys and what gear to propose. Limited survey resources get sent to low-urgency prospects while high-value security-conscious homeowners wait—costing installations to competitors who respond faster with relevant recommendations.",
        "redditTitle": "r/homesecurity - I filled out 4 alarm company forms. One called me in 10 minutes with specific recommendations. I booked them.",
        "redditComments": "52 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      },
      {
        "label": "Service Ticket & Annual Inspection Tracking",
        "steps": [
          {
            "t": "Webhook Trigger: System Installed"
          },
          {
            "t": "Airtable: Register System Record"
          },
          {
            "t": "Schedule Trigger: Monthly Check"
          },
          {
            "t": "Airtable: Get Due Inspections"
          },
          {
            "t": "Twilio: Customer Reminder SMS"
          },
          {
            "t": "Mailgun: Technician Assignment Email"
          },
          {
            "t": "Webhook Trigger: Inspection Complete"
          },
          {
            "t": "Airtable: Log Completion"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: System Installed",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Register System Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Schedule Trigger: Monthly Check",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Due Inspections",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: Customer Reminder SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Technician Assignment Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Inspection Complete",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Log Completion",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- None required for core tracking; optional Claude summarizes monthly compliance report for management review",
        "testPlan": "1. Register a test system with install date and annual test frequency\n2. Trigger monthly check and verify due inspection appears in the list\n3. Confirm customer SMS and technician email both fire\n4. Submit completion webhook and verify Airtable updates correctly",
        "gtm": [
          {
            "channel": "Homeowners Insurance Agents",
            "desc": "Partner with insurance agents who sell homeowners policies and want clients maintaining well-tested alarm systems for claim rate reduction."
          },
          {
            "channel": "Alarm Dealer Associations",
            "desc": "Present the inspection tracking system at ESA and NBFAA Ohio chapter events for regional alarm dealers."
          },
          {
            "channel": "ADT & Ring Installer Outreach",
            "desc": "Target ADT and Ring authorized dealers in Mason, West Chester, and Fairfield who manage large installed bases."
          }
        ],
        "problemSubheader": "Annual inspections get missed and systems go untested for years",
        "problemDescription": "Service plans depend on systematic annual testing and battery changes, but alarm companies track cycles in spreadsheets. Missed inspection cycles create liability exposure, failed systems, and eroded recurring revenue from service plan renewals—while homeowners assume everything is working fine.",
        "redditTitle": "r/homesecurity - My alarm company never reminded me my system was due for an annual test. Found out when the battery died.",
        "redditComments": "29 comments",
        "integrations": [
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "self-storage-facilities",
    "name": "Self-Storage Facilities",
    "segment": "Property, Facilities & Real Estate",
    "keywords": [
      "self-storage-facilities",
      "automation",
      "workflow",
      "property, facilities & real estate"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Reservation to Move-In Automation",
        "steps": [
          {
            "t": "Webhook Trigger: Reservation Confirmed"
          },
          {
            "t": "Code: Generate Gate Code"
          },
          {
            "t": "Google Docs: Generate Lease"
          },
          {
            "t": "Airtable: Create Tenant Record"
          },
          {
            "t": "HTTP Request: Send E-Signature Link"
          },
          {
            "t": "Mailgun: Move-In Instructions Email"
          },
          {
            "t": "Twilio: Gate Code SMS"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Reservation Confirmed",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Code: Generate Gate Code",
            "type": "n8n-nodes-base.code"
          },
          {
            "name": "Google Docs: Generate Lease",
            "type": "n8n-nodes-base.googleDocs"
          },
          {
            "name": "Airtable: Create Tenant Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "HTTP Request: Send E-Signature Link",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Mailgun: Move-In Instructions Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Twilio: Gate Code SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- None required; lease and instructions generated from templates",
        "testPlan": "1. Submit a test reservation webhook with unit size and tenant contact info\n2. Verify gate code is generated uniquely\n3. Confirm lease PDF is generated and e-signature link is sent\n4. Check that move-in instructions email and gate code SMS both arrive within 5 minutes",
        "gtm": [
          {
            "channel": "Property Manager Referrals",
            "desc": "Connect with realtors and property managers who refer moving clients to storage facilities and want reliable automated partners."
          },
          {
            "channel": "Self-Storage Association Events",
            "desc": "Present at Ohio Self Storage Association events where independent operators compete with CubeSmart and Public Storage."
          },
          {
            "channel": "BBB Storage Directory Outreach",
            "desc": "Target independent storage operators in Mason, West Chester, and Colerain BBB directories with an automation pitch."
          }
        ],
        "problemSubheader": "Storage reservations require manual staff follow-up before move-in",
        "problemDescription": "Storage operators manually handle web and phone reservations, gate code setup, and move-in paperwork—creating slow conversions and inconsistent experiences. Customers who reserved online expect contactless move-in the same day; manual processes that require a callback lose rentals to automated national competitors.",
        "redditTitle": "r/selfStorage - Operator experience: how do you handle same-day move-ins when you're not onsite?",
        "redditComments": "23 comments",
        "integrations": [
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "GOOGLE_SERVICE_ACCOUNT_JSON"
        ]
      }
    ]
  },
  {
    "id": "specialty-retail-shops",
    "name": "Specialty Retail Shops",
    "segment": "Retail & Consumer Services",
    "keywords": [
      "specialty-retail-shops",
      "automation",
      "workflow",
      "retail & consumer services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Special-Order Tracking & Loyalty Nurture",
        "steps": [
          {
            "t": "Webhook Trigger: Special Order Placed"
          },
          {
            "t": "Airtable: Create Order Record"
          },
          {
            "t": "Webhook Trigger: Inventory Received"
          },
          {
            "t": "Airtable: Match Arrival to Order"
          },
          {
            "t": "Twilio: 'Your Order Arrived' SMS"
          },
          {
            "t": "Schedule Trigger: Weekly VIP Check"
          },
          {
            "t": "Airtable: Get Top Spenders"
          },
          {
            "t": "Claude: Draft VIP Message"
          },
          {
            "t": "Twilio: VIP SMS"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Special Order Placed",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Create Order Record",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Webhook Trigger: Inventory Received",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Airtable: Match Arrival to Order",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Twilio: 'Your Order Arrived' SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Schedule Trigger: Weekly VIP Check",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "Airtable: Get Top Spenders",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Draft VIP Message",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: VIP SMS",
            "type": "n8n-nodes-base.httpRequest"
          }
        ],
        "aiTasks": "- Draft personalized VIP messages about new drops, private events, or early-access sales tailored to each top spender's purchase history\n- Write warm 'your item arrived' SMS copy that reflects the product type and builds anticipation",
        "testPlan": "1. Submit a test special order webhook for a specific item\n2. Trigger inventory received webhook and verify SMS notifies the correct customer\n3. Add a test top-spender to Airtable and run weekly VIP check\n4. Confirm Claude generates a personalized VIP message and SMS is sent",
        "gtm": [
          {
            "channel": "Shopping Center Leasing Managers",
            "desc": "Partner with mall and strip center leasing managers who want tenants with exceptional customer service and can introduce the tool."
          },
          {
            "channel": "Retail Marketing Agencies",
            "desc": "Work with local retail marketing agencies specializing in boutique shops and hobby stores in Mason and West Chester."
          },
          {
            "channel": "Chamber Retail Member Directories",
            "desc": "Target specialty retailers in Mason Deerfield and West Chester-Liberty Chamber directories for direct outreach."
          }
        ],
        "problemSubheader": "Special orders get lost and VIP customers feel like regular customers",
        "problemDescription": "Specialty shops log special orders on paper or basic POS notes, losing track of arrivals and forgetting to notify customers who waited weeks. Meanwhile, top spenders receive no recognition or priority access—making them vulnerable to any competitor who notices them and treats them better.",
        "redditTitle": "r/retail - I placed a special order 6 weeks ago. The shop never called when it came in. I found out when I stopped by.",
        "redditComments": "44 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  },
  {
    "id": "tech-software-gtm",
    "name": "Tech & Software GTM",
    "segment": "Professional Services",
    "keywords": [
      "tech-software-gtm",
      "automation",
      "workflow",
      "professional services"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Lead Qualification & Support Triage",
        "steps": [
          {
            "t": "Webhook Trigger: New Signup"
          },
          {
            "t": "HTTP Request: Clearbit Enrich"
          },
          {
            "t": "Claude: Assess ICP Fit"
          },
          {
            "t": "IF: High ICP Score"
          },
          {
            "t": "Airtable: Route to Senior Rep"
          },
          {
            "t": "Mailgun: Self-Serve Nurture Email"
          },
          {
            "t": "Webhook Trigger: New Support Ticket"
          },
          {
            "t": "Claude: Tag Ticket + Draft Response"
          },
          {
            "t": "IF: Simple Issue"
          },
          {
            "t": "Mailgun: Auto-Answer"
          },
          {
            "t": "Slack: Route Complex to Engineering"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: New Signup",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "HTTP Request: Clearbit Enrich",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Claude: Assess ICP Fit",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "IF: High ICP Score",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Airtable: Route to Senior Rep",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Mailgun: Self-Serve Nurture Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: New Support Ticket",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Tag Ticket + Draft Response",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "IF: Simple Issue",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Mailgun: Auto-Answer",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Slack: Route Complex to Engineering",
            "type": "n8n-nodes-base.slack"
          }
        ],
        "aiTasks": "- Evaluate ICP fit based on enriched company data (industry, size, location, tech stack signals) and classify as enterprise, SMB, or self-serve\n- Tag support tickets by product area and severity; draft initial responses using knowledge base content for simple issues",
        "testPlan": "1. Submit a test signup from a 200-employee manufacturing company in West Chester\n2. Verify Clearbit enrich runs and Claude scores the lead as high ICP\n3. Confirm routing to senior rep Airtable record\n4. Submit a test support ticket with a common password reset issue and verify auto-answer fires\n5. Submit a complex API error ticket and confirm Slack routing fires with context attached",
        "gtm": [
          {
            "channel": "Clutch & DesignRush Listings",
            "desc": "Target tech and IT firms listed on Clutch serving Cincinnati SMBs with a lead qualification efficiency pitch."
          },
          {
            "channel": "Local VC & Accelerator Networks",
            "desc": "Present to Cincinnati-area VC-backed startups and accelerator cohorts who need scalable GTM without large sales teams."
          },
          {
            "channel": "Helpdesk Software Resellers",
            "desc": "Partner with Zendesk and Freshdesk resellers who can introduce the AI triage layer to their existing customers."
          }
        ],
        "problemSubheader": "Enterprise-grade leads get lost in a queue with self-serve signups",
        "problemDescription": "B2B SaaS and IT firms treat all signups and demo requests uniformly—failing to prioritize high-value enterprise prospects who need fast, personalized outreach. Meanwhile, support queues are manually triaged, mixing critical client issues with simple questions that could be answered automatically.",
        "redditTitle": "r/SaaS - How do you qualify inbound leads from product signups without overwhelming your sales team?",
        "redditComments": "68 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN",
          "SLACK_BOT_TOKEN"
        ]
      }
    ]
  },
  {
    "id": "veterinary-clinics",
    "name": "Veterinary Clinics",
    "segment": "Healthcare & Care",
    "keywords": [
      "veterinary-clinics",
      "automation",
      "workflow",
      "healthcare & care"
    ],
    "partners": [
      "Local business networks",
      "Industry consultants"
    ],
    "builds": [
      {
        "label": "Missed-Call Capture & Triage",
        "steps": [
          {
            "t": "Webhook Trigger: Missed Call"
          },
          {
            "t": "Twilio: Recovery SMS"
          },
          {
            "t": "Webhook Trigger: Pet Owner Reply"
          },
          {
            "t": "Claude: Triage Reply + Flag Urgency"
          },
          {
            "t": "IF: Emergency Keywords"
          },
          {
            "t": "Twilio: Alert On-Call Staff"
          },
          {
            "t": "Airtable: Log Call + Outcome"
          }
        ],
        "nodes": [
          {
            "name": "Webhook Trigger: Missed Call",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Twilio: Recovery SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Webhook Trigger: Pet Owner Reply",
            "type": "n8n-nodes-base.webhook"
          },
          {
            "name": "Claude: Triage Reply + Flag Urgency",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "IF: Emergency Keywords",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Twilio: Alert On-Call Staff",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Log Call + Outcome",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Analyze pet owner reply text for emergency indicators (vomiting, seizure, labored breathing, toxin ingestion) vs. routine requests\n- Generate a concise triage note for staff including the pet's name, concern, and recommended urgency level",
        "testPlan": "1. Simulate a missed call webhook from a test number\n2. Verify recovery SMS arrives within 60 seconds\n3. Reply with 'my dog ate rat poison' and confirm on-call staff SMS fires immediately\n4. Reply with 'need to schedule annual vaccines' and confirm routine queue placement",
        "gtm": [
          {
            "channel": "Veterinary Practice Manager Events",
            "desc": "Present the missed-call recovery system at AVMA and VetPartners practice management events."
          },
          {
            "channel": "Apartment Community Partnerships",
            "desc": "Connect with property managers at suburban apartment complexes who can recommend nearby vet clinics to new pet-owning residents."
          },
          {
            "channel": "Pet Insurance Partner Referrals",
            "desc": "Partner with pet insurance brokers who want policyholders to have fast access to care and can recommend tech-forward clinics."
          }
        ],
        "problemSubheader": "Pet owners in emergencies go to voicemail and call the next clinic",
        "problemDescription": "Veterinary clinics miss calls during peak hours when exam rooms are full. Pet owners with sick animals don't leave voicemails—they call the next practice. Each missed call is a lost patient relationship worth hundreds per year in wellness visits, preventive care, and emergency fees.",
        "redditTitle": "r/AskVet - My dog was sick and I called 3 vets. Only one texted me back when I called. That's my vet now.",
        "redditComments": "84 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID"
        ]
      },
      {
        "label": "Preventive Care Recall Program",
        "steps": [
          {
            "t": "Schedule Trigger: Nightly"
          },
          {
            "t": "HTTP Request: Query EHR for Due Dates"
          },
          {
            "t": "Airtable: Update Due Recall List"
          },
          {
            "t": "Claude: Draft Personalized Recall"
          },
          {
            "t": "Twilio: First Recall SMS"
          },
          {
            "t": "Wait: 10 Days"
          },
          {
            "t": "IF: Appointment Booked"
          },
          {
            "t": "Mailgun: Second Recall Email"
          },
          {
            "t": "Airtable: Flag for Phone Outreach"
          }
        ],
        "nodes": [
          {
            "name": "Schedule Trigger: Nightly",
            "type": "n8n-nodes-base.scheduleTrigger"
          },
          {
            "name": "HTTP Request: Query EHR for Due Dates",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Update Due Recall List",
            "type": "n8n-nodes-base.airtable"
          },
          {
            "name": "Claude: Draft Personalized Recall",
            "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"
          },
          {
            "name": "Twilio: First Recall SMS",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Wait: 10 Days",
            "type": "n8n-nodes-base.wait"
          },
          {
            "name": "IF: Appointment Booked",
            "type": "n8n-nodes-base.if"
          },
          {
            "name": "Mailgun: Second Recall Email",
            "type": "n8n-nodes-base.httpRequest"
          },
          {
            "name": "Airtable: Flag for Phone Outreach",
            "type": "n8n-nodes-base.airtable"
          }
        ],
        "aiTasks": "- Write personalized recall messages explaining why a specific treatment matters for the pet's breed, age, and health history in plain language\n- Adapt urgency and tone based on whether the reminder is the first, second, or escalation touchpoint",
        "testPlan": "1. Load a test patient (senior labrador, annual wellness exam due in 20 days) into Airtable\n2. Trigger nightly schedule and verify recall message is generated with breed-specific copy\n3. Confirm SMS arrives with correct pet name and treatment description\n4. Simulate 10 days without booking and verify email follow-up fires\n5. After second non-response, confirm phone outreach flag is set",
        "gtm": [
          {
            "channel": "AVMA & AAHA Practice Events",
            "desc": "Present the recall program ROI at AVMA and AAHA-accredited practice management sessions in the Cincinnati metro."
          },
          {
            "channel": "Pet Insurance Broker Referrals",
            "desc": "Partner with pet insurance brokers and local rescues who want better preventive compliance for their animal communities."
          },
          {
            "channel": "Veterinary Software Vendors",
            "desc": "Work with practice management software vendors (Impromed, AVImark) to integrate recall automation for their clinic clients."
          }
        ],
        "problemSubheader": "Pets fall behind on vaccines because clinics rely on postcard mailings",
        "problemDescription": "Many pets fall behind on vaccines, wellness exams, or dental cleans because clinics lack a systematic recall program beyond generic postcard mailings that owners ignore. Unscheduled preventive care represents thousands of dollars per month in lost revenue per practice—and worse outcomes for the animals.",
        "redditTitle": "r/AskVet - How do you remind pet owners to keep up with annual wellness visits? Postcards aren't working.",
        "redditComments": "57 comments",
        "integrations": [
          "ANTHROPIC_API_KEY",
          "TWILIO_ACCOUNT_SID",
          "TWILIO_AUTH_TOKEN",
          "TWILIO_FROM_NUMBER",
          "AIRTABLE_API_KEY",
          "AIRTABLE_BASE_ID",
          "MAILGUN_API_KEY",
          "MAILGUN_DOMAIN"
        ]
      }
    ]
  }
];
