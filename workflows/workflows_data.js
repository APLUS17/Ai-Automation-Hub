const WORKFLOWS_DATA = [
  {
    "industry": "Accounting / CPA Firms",
    "name": "PO \u2192 P&L Automation",
    "description": "Watches for incoming purchase orders (via Gmail or Google Drive), extracts structured data using Claude, pushes to QuickBooks for invoice creation, and auto-updates a P&L tracking sheet with a Slack notification.",
    "integrations": [
      "N8N_API_URL",
      "6xfr5f40H92Sj1Eb",
      "HhRl2tZkR2KwXqsT",
      "QB_CLIENT_ID",
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "SLACK_BOT_TOKEN"
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
    "ai_tasks": "- Field extraction from raw PO text/PDF (step 3)\n- Categorization of line items (e.g., Office Supplies, Services, Equipment)",
    "python_tools": "- None required \u2014 all steps handled in n8n\n- Optional: `google_docs_pdf.py` if PDFs need pre-processing before n8n",
    "code_app": "Not required for this workflow. Optional: a P&L dashboard reading from the Google Sheet.",
    "test_plan": "1. Send a test email with \"PO Test\" in subject + a simple text PO in body\n2. Check n8n execution log \u2014 all 7 nodes should show green\n3. Verify QuickBooks has a new draft invoice\n4. Verify P&L sheet has new row\n5. Check Slack for notification message",
    "problem_subheader": "CPAs spend hours copy-pasting PO data",
    "problem_description": "Managing incoming PDFs of POs via email consumes hours of high-value CPA time. Accountants have to manually extract numbers, log into QuickBooks, update spreadsheets, and notify teammates of transaction updates.",
    "reddit_title": "r/Accounting - How do you automate incoming client invoices and POs?",
    "reddit_comments": "42 comments",
    "metrics": [
      {
        "label": "US CPA Firms",
        "value": "1.3M"
      },
      {
        "label": "Avg Entry Time",
        "value": "12 mins"
      },
      {
        "label": "Data Error Rate",
        "value": "4%"
      }
    ],
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
    ]
  },
  {
    "industry": "Women-Owned Businesses",
    "name": "AI Leverage Consulting",
    "description": "A polished AI audit form collects business info and pain points. On submit, Claude generates a custom AI recommendations report. n8n assembles a PDF and emails it to the client. Check-in emails follow at 7 and 30 days.",
    "integrations": [
      "ANTHROPIC_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "MAILGUN_API_KEY"
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
    "ai_tasks": "- Full report generation (step 2) \u2014 this is the core deliverable; prompt quality matters most here",
    "python_tools": "- `google_docs_pdf.py` \u2014 test report creation + export\n- `mailgun_email.py --action send` \u2014 test email with PDF attachment",
    "code_app": "Build `workflows/womens_business/audit_form.html`:\n- 3-step form with progress indicator:\n  - Step 1: Business basics (name, industry, team size)\n  - Step 2: Pain point checkboxes (15 options: email overload, manual invoicing, social media, etc.)\n  - Step 3: AI experience + goals + email\n- Design: warm, empowering aesthetic (still using Satoshi font + CSS variables)\n- On submit: show \"Generating your personalized report...\" spinner\n- After: \"Check your inbox \u2014 your AI roadmap will arrive in 2-3 minutes\"",
    "test_plan": "1. Fill out audit_form.html as a test business (hair salon, 2 employees, biggest pain: booking + social media)\n2. Verify Claude recommendations are specific (not generic) \u2014 check that it recommends Calendly + Buffer\n3. Verify PDF arrives by email with branded layout\n4. Check Airtable \u2014 client row logged\n5. Advance n8n \u2014 verify 7-day check-in sends",
    "problem_subheader": "Women-led small businesses face a technology adoption gap",
    "problem_description": "Small women-owned businesses want to implement AI to increase efficiency, but traditional IT consultants are prohibitively expensive. They need direct, customized, and automated AI assessments that can be generated in minutes.",
    "reddit_title": "r/WomenInBusiness - How can I run an AI audit on my boutique boutique?",
    "reddit_comments": "29 comments",
    "metrics": [
      {
        "label": "Women-Owned Firms",
        "value": "13M"
      },
      {
        "label": "Tech Adoption Gap",
        "value": "35%"
      },
      {
        "label": "Avg Revenue Lift",
        "value": "+22%"
      }
    ],
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
    ]
  },
  {
    "industry": "Theater Groups",
    "name": "Cost-Cutting Automations",
    "description": "Box office CSV data auto-flows into a Google Sheet dashboard. Pre-show promo emails go to past attendees automatically. A volunteer scheduling app matches availability form responses to open shifts.",
    "integrations": [
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "ANTHROPIC_API_KEY"
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
    "ai_tasks": "None specified.",
    "python_tools": "- `google_sheets.py` \u2014 read/write box office and volunteer sheets",
    "code_app": "`workflows/theater/volunteer_scheduler.html`:\n- Volunteer submits availability via form on this page\n- Shows upcoming shows + open roles with filled/needed counts\n- Submit \u2192 Google Sheets row added \u2192 triggers n8n scheduling",
    "test_plan": "1. Upload a test CSV via webhook \u2014 verify Sheet populated with totals\n2. Add test attendee emails to \"Audience CRM\" \u2014 trigger promo email \u2014 verify delivery\n3. Submit volunteer availability form \u2192 verify Claude assigns shift \u2192 volunteer email sent",
    "problem_subheader": "Non-profit theaters leak box office revenue on manual tracking",
    "problem_description": "Local theater groups are run by volunteers who struggle to sync ticket sales spreadsheets with promotional email campaigns, leading to empty seats and missed fundraising opportunities.",
    "reddit_title": "r/theater - Free tools for scheduling auditions and volunteer coordinating?",
    "reddit_comments": "31 comments",
    "metrics": [
      {
        "label": "Community Theaters",
        "value": "10K"
      },
      {
        "label": "Volunteer Hours/Wk",
        "value": "20h"
      },
      {
        "label": "Ticket Revenue Leakage",
        "value": "8%"
      }
    ],
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
    ]
  },
  {
    "industry": "Theater Groups",
    "name": "General Process Automation",
    "description": "Audition form submissions are organized by role in Airtable. Rehearsal reminder SMS/emails send from the schedule sheet. Press releases are auto-drafted from a show info template.",
    "integrations": [
      "AIRTABLE_API_KEY",
      "TWILIO_ACCOUNT_SID",
      "ANTHROPIC_API_KEY"
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
    "ai_tasks": "- Press release drafting (step 9)\n- Optional: generate social media posts from press release",
    "python_tools": "- `airtable_crud.py` \u2014 list/filter audition records\n- `twilio_sms.py` \u2014 test SMS reminders\n- `google_docs_pdf.py` \u2014 create press release doc",
    "code_app": "Not required.",
    "test_plan": "1. Submit test audition form \u2014 verify Airtable record created in correct \"Role\" view\n2. Add tomorrow's rehearsal to schedule sheet \u2014 trigger nightly check \u2014 verify SMS + email\n3. Fire press release webhook with test show data \u2014 verify Google Doc created with formatted PR",
    "problem_subheader": "Auditions and casting pipelines are administrative nightmares",
    "problem_description": "Managing audition registrations, talent headshots, contact information, and rehearsal reminders in disjointed spreadsheets consumes hundreds of volunteer hours per production.",
    "reddit_title": "r/acting - Why are community theater casting portals so outdated?",
    "reddit_comments": "56 comments",
    "metrics": [
      {
        "label": "Avg Auditions/Show",
        "value": "150+"
      },
      {
        "label": "Coordination Hours",
        "value": "45h"
      },
      {
        "label": "No-Show Rate",
        "value": "12%"
      }
    ],
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
    ]
  },
  {
    "industry": "Water Damage / Remodeling",
    "name": "Upsell Automation",
    "description": "When a job is marked complete, a 2-week SMS/email drip launches with personalized upsell offers (mold prevention, waterproofing, etc.). If the client clicks, they're routed to a booking page and the sales rep is notified.",
    "integrations": [
      "ANTHROPIC_API_KEY",
      "TWILIO_ACCOUNT_SID",
      "MAILGUN_API_KEY",
      "SLACK_BOT_TOKEN"
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
    "ai_tasks": "- Personalized upsell SMS + email generation at job completion (step 2)",
    "python_tools": "- `twilio_sms.py` \u2014 test SMS delivery\n- `mailgun_email.py` \u2014 test email + click tracking",
    "code_app": "Not required.",
    "test_plan": "1. POST a fake job_completed event with damage_type = \"water infiltration\"\n2. Check n8n \u2014 Claude should generate a relevant mold prevention message\n3. Verify SMS sent (to test number), email queued\n4. Simulate a Mailgun click webhook \u2014 verify Slack fires sales rep alert",
    "problem_subheader": "Restoration contractors miss out on highly profitable remodeling upsells",
    "problem_description": "Emergency water mitigation companies do the immediate cleanup work but fail to follow up with homeowners about post-mitigation rebuild and remodeling contracts, letting competitors steal the job.",
    "reddit_title": "Restoration Forum - How are you converting dry-out jobs into rebuild contracts?",
    "reddit_comments": "19 comments",
    "metrics": [
      {
        "label": "Mitigation Firms",
        "value": "21K"
      },
      {
        "label": "Avg Upsell Value",
        "value": "$15K"
      },
      {
        "label": "Lead Leakage Rate",
        "value": "45%"
      }
    ],
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
    ]
  },
  {
    "industry": "Water Damage / Remodeling",
    "name": "Damage Detection Automation",
    "description": "Field technician sends a photo to a webhook. Claude Vision classifies the damage type, severity, and estimated affected area. n8n populates a damage report template and notifies the estimator via Slack and email with the summary and photo.",
    "integrations": [
      "ANTHROPIC_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "SLACK_BOT_TOKEN"
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
    "ai_tasks": "- Vision-based damage classification (step 2) \u2014 this is the core AI task",
    "python_tools": "- `claude_ai.py --action image --image photo.jpg --prompt \"Analyze water damage...\"` \u2014 test vision before deploying\n- `google_docs_pdf.py` \u2014 create/export damage reports programmatically",
    "code_app": "Not required.",
    "test_plan": "1. `python tools/claude_ai.py image --image test_damage.jpg --prompt \"Analyze water damage type, severity, sq ft\"` \u2014 verify structured response\n2. POST a test photo + fake job data to the webhook\n3. Check Google Docs \u2014 report doc should be created with filled-in details\n4. Verify Slack message arrived with damage summary",
    "problem_subheader": "Emergency dispatch speed determines restoration project wins",
    "problem_description": "When home flooding occurs, homeowners call multiple contractors. The contractor who can classify damage from photos and provide a fast initial assessment wins the lucrative restoration contract.",
    "reddit_title": "r/Plumbing - Fast quoting for emergency water mitigation calls?",
    "reddit_comments": "38 comments",
    "metrics": [
      {
        "label": "Damage Claims/Yr",
        "value": "1.2M"
      },
      {
        "label": "Avg Restoration Bill",
        "value": "$8.5K"
      },
      {
        "label": "Response Time Window",
        "value": "<15m"
      }
    ],
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
    ]
  },
  {
    "industry": "E-Commerce",
    "name": "Product Process Automation",
    "description": "Low-stock webhook drafts a supplier reorder email. Inventory syncs bidirectionally between Shopify and Google Sheet. A Claude Code tool lets the team search the internal product catalog instantly.",
    "integrations": [
      "SHOPIFY_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON"
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
    "ai_tasks": "None specified.",
    "python_tools": "- `google_sheets.py` \u2014 manual sync or backfill",
    "code_app": "Build `workflows/ecommerce/product_catalog.html`:\n- Search box: type product name or SKU\n- Results table: title, SKU, qty, price, status (In Stock / Low / Out)\n- Data source: n8n GET webhook reads Shopify live\n- Click product \u2192 open Shopify admin URL in new tab\n- No authentication needed (internal tool)",
    "test_plan": "1. Set one Shopify test product to qty = 2 (below threshold)\n2. Trigger daily check \u2014 verify Gmail draft created\n3. Trigger sync \u2014 verify Google Sheet populated with all products\n4. Edit qty in Google Sheet \u2014 verify Shopify inventory updated via API\n5. Open product_catalog.html \u2014 search for a product \u2014 verify instant results",
    "problem_subheader": "Low-stock events cause thousands in lost revenue and supplier friction",
    "problem_description": "E-commerce stores lose customers when popular items go out of stock unexpectedly. Manually monitoring stock levels, emailing suppliers for reorders, and keeping catalogs in sync is a slow, error-prone cycle.",
    "reddit_title": "r/shopify - How do you handle automatic supplier reordering?",
    "reddit_comments": "64 comments",
    "metrics": [
      {
        "label": "Shopify Stores",
        "value": "2.5M"
      },
      {
        "label": "Stockout Revenue Loss",
        "value": "15%"
      },
      {
        "label": "Manual Sync Time/Wk",
        "value": "8h"
      }
    ],
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
    ]
  },
  {
    "industry": "E-Commerce",
    "name": "Marketing Automation",
    "description": "New Shopify products trigger Claude to write a product description and social caption, then auto-post to Instagram/Facebook. Abandoned carts get a 3-step SMS/email drip. Post-delivery review requests auto-send 3 days after fulfillment.",
    "integrations": [
      "SHOPIFY_API_KEY",
      "ANTHROPIC_API_KEY",
      "TWILIO_ACCOUNT_SID",
      "MAILGUN_API_KEY"
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
    "ai_tasks": "- Product description + social caption generation (step 2)",
    "python_tools": "- `claude_ai.py --action generate` \u2014 test description quality",
    "code_app": "Not required.",
    "test_plan": "1. Add a test product in Shopify dev store \u2014 verify Claude description attached within 1 min\n2. Create a test checkout, don't complete \u2014 wait 1h \u2192 verify abandoned cart email\n3. Create a fulfilled test order \u2014 wait 3 days (or advance n8n) \u2192 verify review request",
    "problem_subheader": "Publishing new product listings across multiple channels is exhausting",
    "problem_description": "When launching new SKUs, e-commerce managers spend hours writing SEO descriptions, generating social media captions, and posting manually across Facebook, Meta, and Instagram.",
    "reddit_title": "r/ecommerce - Best way to auto-post Shopify products to Meta/Insta?",
    "reddit_comments": "41 comments",
    "metrics": [
      {
        "label": "SKU Launches/Mo",
        "value": "50+"
      },
      {
        "label": "Time Per Listing",
        "value": "15 mins"
      },
      {
        "label": "Social Reach Increase",
        "value": "+40%"
      }
    ],
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
    ]
  },
  {
    "industry": "Hotels",
    "name": "Early-Stage Market Research",
    "description": "Scrapes Booking.com and Expedia listings for a target market. Pulls Google Maps and TripAdvisor reviews for those properties. Claude performs sentiment analysis to extract pain points. Results are organized by category in Airtable. Also builds a prospect list of independent hotels (no major PMS vendor) for outreach.",
    "integrations": [
      "APIFY_API_TOKEN",
      "FIRECRAWL_API_KEY",
      "ANTHROPIC_API_KEY",
      "AIRTABLE_API_KEY"
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
    "ai_tasks": "- Sentiment analysis + pain point categorization per hotel (step 9)",
    "python_tools": "- `apify_runner.py` \u2014 run scrapers locally for testing\n- `firecrawl_scraper.py --action enrich --leads file.json` \u2014 batch hotel website enrichment\n- `airtable_crud.py` \u2014 create/read tables during testing",
    "code_app": "Build `workflows/hotels/research_dashboard.html`:\n- Market overview: total hotels scraped, % independent, avg rating\n- Pain point heatmap: grid of categories vs. hotels (color = sentiment)\n- Prospect list table: independent hotels sorted by opportunity score\n- Export: CSV of top 20 prospects",
    "test_plan": "1. Run Booking.com scraper on test location (10 max results) \u2014 verify hotels returned\n2. Run TripAdvisor reviews for 1 hotel \u2014 verify 20+ reviews fetched\n3. Pass reviews to claude_ai.py sentiment \u2014 verify structured pain point JSON\n4. Check Airtable \u2014 Pain Points table populated correctly\n5. Open research_dashboard.html \u2014 verify all 3 panels load with real data",
    "problem_subheader": "Independent hotels lose bookings to chains with dynamic pricing",
    "problem_description": "Boutique and independent hotels cannot compete with large hotel chains that use automated competitor pricing crawlers. Managers waste hours manually checking Booking.com and Expedia rates.",
    "reddit_title": "r/HotelManagers - How to automate competitor price monitoring?",
    "reddit_comments": "27 comments",
    "metrics": [
      {
        "label": "US Hotels",
        "value": "55K"
      },
      {
        "label": "Boutique/Indie Share",
        "value": "40%"
      },
      {
        "label": "Monthly Booking Loss",
        "value": "$3K"
      }
    ],
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
    ]
  },
  {
    "industry": "Property Appraisal",
    "name": "Lead Gen (Zillow Scrape \u2192 Enrich \u2192 Dashboard)",
    "description": "Scrapes Zillow and Realtor.com for new listings that need appraisals, filters by property type and price range, enriches with agent contact info via Firecrawl, and pushes to a Claude Code lead review dashboard.",
    "integrations": [
      "APIFY_API_TOKEN",
      "FIRECRAWL_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON"
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
    "ai_tasks": "None specified.",
    "python_tools": "- `apify_runner.py --action zillow --query \"Austin TX\" --max 20` \u2014 test scrape\n- `firecrawl_scraper.py --action contacts --url <agent_page>` \u2014 test enrichment\n- `google_sheets.py` \u2014 local data push for testing",
    "code_app": "Build `workflows/property_appraisal/lead_dashboard.html`:\n- Table: all leads from Google Sheet\n- Filters: location, price range, property type, status (New / Contacted / In Pipeline / Won)\n- \"Mark Contacted\" button \u2192 updates sheet row via n8n PATCH webhook\n- Export: filtered CSV download\n- Stats row: total leads, contacted, win rate",
    "test_plan": "1. Run apify_runner locally with test location \u2014 verify 10+ leads returned\n2. Test firecrawl on one Zillow agent profile URL \u2014 verify email/phone extracted\n3. Trigger n8n workflow \u2014 verify new rows in Google Sheet\n4. Open lead_dashboard.html \u2014 verify data loads, filters work, \"Mark Contacted\" updates sheet",
    "problem_subheader": "Appraisers waste hours scraping Zillow and filtering listings",
    "problem_description": "Independent real estate appraisers spend half their week chasing leads on Zillow, cross-referencing MLS listings, and looking up property history on outdated tax databases.",
    "reddit_title": "Appraisers Forum - Automating lead lists from Zillow and MLS?",
    "reddit_comments": "34 comments",
    "metrics": [
      {
        "label": "US Appraisers",
        "value": "78K"
      },
      {
        "label": "Scraping Hours/Wk",
        "value": "12h"
      },
      {
        "label": "Lead Response Speed",
        "value": "+60%"
      }
    ],
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
    ]
  },
  {
    "industry": "Property Appraisal",
    "name": "Follow-Up Automation",
    "description": "New appraisal leads trigger a 3-email sequence over 7 days. No response by day 5 \u2192 SMS follow-up. GHL pipeline stages auto-update on opens/clicks. Post-appraisal completion \u2192 auto-request Google review via SMS.",
    "integrations": [
      "GHL_API_KEY",
      "MAILGUN_API_KEY",
      "TWILIO_ACCOUNT_SID"
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
    "ai_tasks": "- Optional: personalize each email with Claude based on property type + agent context",
    "python_tools": "- `ghl_crm.py` \u2014 test contact creation + pipeline moves\n- `twilio_sms.py` \u2014 test review request SMS\n- `mailgun_email.py` \u2014 test sequence emails",
    "code_app": "Not required.",
    "test_plan": "1. Add yourself as a test lead \u2192 verify day 1 email arrives\n2. Don't open it \u2192 advance n8n time \u2192 verify day 5 SMS arrives\n3. Open day 3 email \u2192 verify GHL contact moved to \"Prospect Engaged\"\n4. Fire post-appraisal webhook \u2192 verify review request SMS sent next day",
    "problem_subheader": "Appraisers spend 10+ hours a week chasing Realtors for updates",
    "problem_description": "Closing appraisal deals requires constant coordination and follow-up. Appraisers waste valuable billing hours texting and emailing agents to confirm property statuses, access details, and invoice payments.",
    "reddit_title": "Appraisers Forum - System to automate Realtor follow ups?",
    "reddit_comments": "23 comments",
    "metrics": [
      {
        "label": "Follow-Up Calls/Wk",
        "value": "40+"
      },
      {
        "label": "Appraisal Cycle Time",
        "value": "5 days"
      },
      {
        "label": "Invoice Aging Time",
        "value": "14 days"
      }
    ],
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
    ]
  },
  {
    "industry": "Healthcare Revenue",
    "name": "Compliance Automation",
    "description": "Daily check of staff certification expiry dates with 30/14/7-day renewal reminders. A RAG-based policy Q&A bot answers HIPAA and compliance questions from uploaded docs. Every action is timestamped in an audit log Google Sheet.",
    "integrations": [
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "ANTHROPIC_API_KEY"
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
    "ai_tasks": "- Real-time compliance Q&A via system-prompted chat\n- Optional: summarize newly uploaded policy docs into plain-language FAQ",
    "python_tools": "- `google_sheets.py` \u2014 read certification roster + write audit logs\n- `claude_ai.py --action generate` \u2014 test Q&A quality",
    "code_app": "Not required.",
    "test_plan": "1. Add a test staff row with expiry date = today + 7 days\n2. Trigger daily check \u2014 verify reminder email arrives\n3. Check audit log sheet \u2014 new row timestamped\n4. Open compliance_bot.html \u2014 ask \"What is the minimum PHI access policy?\" \u2014 verify sensible answer",
    "problem_subheader": "Expiring medical licenses and compliance certificates trigger heavy fines",
    "problem_description": "Medical practices are plagued by complex regulatory tracking. Healthcare admins manually monitor certification dates for doctors, nurses, and equipment in paper files, risking severe audit penalties.",
    "reddit_title": "r/MedicalPractice - Automated tracking for staff certifications?",
    "reddit_comments": "47 comments",
    "metrics": [
      {
        "label": "US Clinics",
        "value": "230K"
      },
      {
        "label": "Compliance Audit Fines",
        "value": "$10K+"
      },
      {
        "label": "Admin Staff Hours",
        "value": "6h/wk"
      }
    ],
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
    ]
  },
  {
    "industry": "Healthcare Revenue",
    "name": "Revenue Cycle Automation",
    "description": "Watches for new insurance claims (email or Drive upload), extracts fields using Claude, maps to billing codes, flags common errors, submits to clearinghouse queue, and tracks denial reasons in Airtable with weekly summaries.",
    "integrations": [
      "ANTHROPIC_API_KEY",
      "AIRTABLE_API_KEY",
      "SLACK_BOT_TOKEN"
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
    "ai_tasks": "- Claim field extraction from unstructured text (step 2)\n- Error pattern summary (step 10)",
    "python_tools": "- `airtable_crud.py` \u2014 local testing + data backfill\n- `claude_ai.py --action extract` \u2014 test extraction accuracy before deploying",
    "code_app": "Not required.",
    "test_plan": "1. Send test email with a sample claim (use a mock EOB document)\n2. Check n8n execution \u2014 verify extracted JSON has correct fields\n3. Check Airtable \"Claims Log\" \u2014 new record should appear\n4. Simulate a denial \u2014 check Airtable \"Denials Tracker\" updated\n5. Run Monday summary \u2014 verify email arrives with formatted denial breakdown",
    "problem_subheader": "Practices lose 10% of gross revenue to simple claim coding errors",
    "problem_description": "Medical claim denials are a massive cash drain. Practices fail to map billing codes correctly, and appeals are ignored because admins lack the time to draft customized correction appeals.",
    "reddit_title": "r/MedicalBilling - Appeal letter automation for denied claims?",
    "reddit_comments": "51 comments",
    "metrics": [
      {
        "label": "Avg Claim Denial Rate",
        "value": "15%"
      },
      {
        "label": "Appeals Process Time",
        "value": "20 mins"
      },
      {
        "label": "Revenue Leakage",
        "value": "10%"
      }
    ],
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
    ]
  },
  {
    "industry": "Education (K-12)",
    "name": "Teacher Task Automation",
    "description": "Google Form quiz submissions are auto-graded for MCQs; results logged to a sheet; weekly parent update emails are auto-sent; and Google Docs progress reports are generated from grade data.",
    "integrations": [
      "6xfr5f40H92Sj1Eb",
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "ANTHROPIC_API_KEY"
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
    "ai_tasks": "- Parent update narrative generation (step 7)\n- Progress report draft (step 11)\n- Optional: quiz question generation from lesson objectives",
    "python_tools": "- `google_docs_pdf.py` \u2014 create/export progress reports as PDFs\n- `google_sheets.py` \u2014 read/update gradebook during testing",
    "code_app": "Not required.",
    "test_plan": "1. Submit a Google Form quiz response manually\n2. Check \"Gradebook\" sheet \u2014 new graded row should appear within 1 minute\n3. Trigger parent email workflow manually \u2014 verify email arrives with personalized narrative\n4. Run progress report workflow \u2014 verify Google Doc created with student name in filename",
    "problem_subheader": "Teachers spend 15+ hours a week on grading and administration",
    "problem_description": "Grading quizzes, formatting progress sheets, and writing personalized emails to parents consumes teachers' evenings and weekends, causing severe burnout.",
    "reddit_title": "r/teachers - Admin work is killing my love for teaching. Automation tips?",
    "reddit_comments": "89 comments",
    "metrics": [
      {
        "label": "US K-12 Teachers",
        "value": "3.8M"
      },
      {
        "label": "Teacher Burnout",
        "value": "44%"
      },
      {
        "label": "Avg Grading Hours/Wk",
        "value": "15h"
      }
    ],
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
    ]
  },
  {
    "industry": "Education (K-12)",
    "name": "Personalized Student Learning",
    "description": "A Claude Code chat interface for students to ask lesson questions; a workflow that tracks quiz struggle topics and flags them to teachers; Claude generates differentiated practice problems; and a teacher dashboard shows per-student progress.",
    "integrations": [
      "ANTHROPIC_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON"
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
    "ai_tasks": "- Student chat responses (real-time, via webhook)\n- Differentiated practice problem generation (step 5)",
    "python_tools": "- `google_sheets.py` \u2014 read gradebook for dashboard\n- `claude_ai.py --action generate` \u2014 test problem generation prompts",
    "code_app": "Build `workflows/education/student_chat.html`:\n- Chat interface: student types a question about any lesson topic\n- System prompt: \"You are a patient, encouraging tutor for {{grade}} students. Explain concepts clearly. When a student is stuck, ask guiding questions before giving the answer.\"\n- Claude API call via fetch() to a simple n8n webhook that proxies to OpenRouter\n- Keep chat history in sessionStorage\n\nBuild `workflows/education/teacher_dashboard.html`:\n- Class roster with per-student: avg score, trend (\u2191\u2193), red flags\n- Data source: Google Sheet read via n8n GET webhook\n- Filter by week, subject, score range\n- Click student \u2192 see full quiz history + AI-generated summary of struggles",
    "test_plan": "1. Open student_chat.html in browser, ask \"What is photosynthesis?\" \u2014 verify Claude responds\n2. Add test gradebook rows with scores < 70% \u2014 trigger struggle detection \u2014 verify teacher email\n3. Open teacher_dashboard.html \u2014 verify student list loads with correct scores",
    "problem_subheader": "One teacher cannot offer personalized practice to 30 unique students",
    "problem_description": "Students struggle with different concepts. Detecting who is falling behind, pinpointing their exact weaknesses, and generating customized practice sheets takes more time than teachers have.",
    "reddit_title": "r/teachers - Generating differentiated practice problems easily?",
    "reddit_comments": "44 comments",
    "metrics": [
      {
        "label": "Avg Class Size",
        "value": "25-30"
      },
      {
        "label": "Weak Topic Groups",
        "value": "4-6"
      },
      {
        "label": "Student Improvement",
        "value": "+18%"
      }
    ],
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
    ]
  },
  {
    "industry": "HVAC",
    "name": "Lead Gen (Google Maps Scrape \u2192 Enrichment \u2192 Sheet + Dashboard)",
    "description": "Scrapes Google Maps for HVAC businesses in target zip codes using Apify, enriches results with contact data via Firecrawl, deduplicates, and pushes a clean lead list to Google Sheets. A simple Claude Code dashboard lets you review and filter leads.",
    "integrations": [
      "APIFY_API_TOKEN",
      "FIRECRAWL_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON"
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
    "ai_tasks": "- Optional: score each lead by rating count + recency of reviews",
    "python_tools": "- `apify_runner.py` \u2014 for local testing / one-off scrapes\n- `firecrawl_scraper.py` \u2014 batch enrichment outside n8n\n- `google_sheets.py` \u2014 push results directly if n8n flow is skipped",
    "code_app": "Build `workflows/hvac/lead_review_dashboard.html`:\n- Table of leads from Google Sheet (via n8n webhook that reads sheet)\n- Filter by rating, city, date scraped\n- \"Mark contacted\" button that updates sheet row status\n- Export CSV button",
    "test_plan": "1. Run `python tools/apify_runner.py google-maps --query \"HVAC company 90210\" --max 5`\n2. Verify 5 records returned with name, phone, address, website\n3. Run `python tools/firecrawl_scraper.py contacts --url <one_website>`\n4. Verify email/phone extracted\n5. Trigger n8n workflow \u2014 check Google Sheet for new rows after run",
    "problem_subheader": "Homeowners submit to 5–8 HVAC companies at once — first to respond wins the job",
    "problem_description": "When homeowners need HVAC work, they Google and submit to multiple companies simultaneously. The first to respond AND triage urgency wins the $6,000–$12,000 job. Most HVAC owners don't see new leads until 8 AM the next day — 14 hours too late. This workflow scrapes, enriches, and surfaces the highest-value prospects before competitors even see them.",
    "reddit_title": "HVAC Hacks - Best way to build a commercial lead list?",
    "reddit_comments": "21 comments",
    "metrics": [
      {
        "label": "HVAC Contractors (US)",
        "value": "115K"
      },
      {
        "label": "Avg Job Value",
        "value": "$6K–$12K"
      },
      {
        "label": "Lead Response Window",
        "value": "<1 hour"
      }
    ],
    "lead_sources": [
      "Allied Construction Industries (ACI) — 500 member HVAC companies",
      "West Chester-Liberty Chamber Alliance",
      "Mason Deerfield Chamber",
      "Cincinnati Home Builders Association",
      "Angi/HomeAdvisor HVAC contractor network"
    ],
    "warm_partners": [
      "Web agencies with HVAC clients (Skynet Technologies, Helium SEO, Magnet Co)",
      "IT firms serving HVAC (IT GOAT, Ingage Partners, LayerCake Technologies)",
      "Property management companies",
      "Real estate agents in target metro"
    ],
    "positioning": "Our AI Sorts Your Leads in 60 Seconds: Emergencies Get a Tech Dispatched Immediately, Estimates Get Qualified and Scheduled, No Lead Falls Through the Cracks.",
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
    ]
  },
  {
    "industry": "HVAC",
    "name": "Voice Bot Outreach (Bland.ai \u2192 Lead List \u2192 SMS Follow-up)",
    "description": "Pulls a lead list from Google Sheets, triggers Bland.ai voice calls pitching seasonal HVAC tune-up offers, logs call outcomes, and auto-sends SMS with a booking link to interested leads via Twilio.",
    "integrations": [
      "BLAND_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "TWILIO_ACCOUNT_SID"
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
    "ai_tasks": "- Post-call: summarize transcript, extract intent signal (for leads who spoke but unclear)",
    "python_tools": "- `twilio_sms.py` \u2014 for testing SMS delivery\n- `google_sheets.py` \u2014 loading/updating lead list outside n8n",
    "code_app": "Not required. Optional: a simple call analytics dashboard showing call outcomes by day.",
    "test_plan": "1. Add one test lead row to Google Sheet with your own phone number\n2. Trigger n8n manually \u2014 should receive a Bland.ai call within 30 seconds\n3. Say \"yes I'm interested\" \u2014 verify Twilio SMS arrives with booking link\n4. Check Google Sheet \u2014 row should show Status = \"Interested\"",
    "problem_subheader": "An 8-truck operation gets 80+ calls in 48 hours during a heat wave — half go to voicemail",
    "problem_description": "HVAC companies lose 40–60% of potential revenue during seasonal demand spikes. A database of 2,400 past customers who'd book preventive maintenance sits untouched — because no one has time to call them. This workflow monitors weather forecasts, auto-triggers proactive outreach before the spike hits, and books directly into ServiceTitan without any manual dialing.",
    "reddit_title": "HVAC Hacks - Answer rate and dispatch solutions?",
    "reddit_comments": "67 comments",
    "metrics": [
      {
        "label": "Revenue Lost Per Spike",
        "value": "40–60%"
      },
      {
        "label": "Calls During Heat Wave",
        "value": "80+/48hrs"
      },
      {
        "label": "Past Customer DB (avg)",
        "value": "2,400 leads"
      }
    ],
    "lead_sources": [
      "Past customer CRM (systems 10+ years old, serviced in last 2 seasons)",
      "OpenWeather API — Cincinnati ZIPs (45069, 45040, 45246) temp triggers",
      "Google Local Services Ads inbound leads",
      "Community Facebook groups (West Chester Community Board, Mason Moms, Fairfield Neighbors)"
    ],
    "warm_partners": [
      "Property management companies (Springdale apts, downtown Cincinnati condos)",
      "Home inspection companies serving Butler/Warren/Hamilton Counties",
      "Plumbing companies (non-competing cross-referral)",
      "Local insurance agents (State Farm, Allstate in Mason/West Chester)"
    ],
    "positioning": "Never Miss Another Emergency Call: Our AI Voice Bot answers every call in 30 seconds, qualifies the job, and books your technicians automatically — even at 11 PM.",
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
    ]
  },
  {
    "industry": "Online Coaching",
    "name": "Dead Lead Reactivation",
    "description": "Pulls closed-lost or unresponsive contacts from GHL, generates Claude-personalized re-engagement messages based on their history, and sends a 7-day email + SMS drip. If a lead engages (opens/clicks), triggers a human handoff alert.",
    "integrations": [
      "GHL_API_KEY",
      "ANTHROPIC_API_KEY",
      "MAILGUN_API_KEY",
      "TWILIO_ACCOUNT_SID",
      "SLACK_BOT_TOKEN"
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
    "ai_tasks": "- Personalized message generation (step 4) using contact name, program interest, last touchpoint",
    "python_tools": "- `ghl_crm.py --action inactive --days 30` \u2014 pull inactive contacts for testing\n- `mailgun_email.py --action send` \u2014 test email delivery\n- `twilio_sms.py --action send` \u2014 test SMS",
    "code_app": "Not required.",
    "test_plan": "1. `python tools/ghl_crm.py test` \u2192 verify GHL connection\n2. Add yourself as a test contact tagged \"closed-lost\" in GHL\n3. Trigger workflow manually \u2014 verify email arrives with personalized copy\n4. Open the email \u2014 verify Slack fires \"follow up now\" alert\n5. Verify GHL contact stage updated to \"Re-engaged\"",
    "problem_subheader": "Coaches sit on databases of 1,000+ cold leads without time to follow up",
    "problem_description": "Acquiring fitness or business coaching leads is expensive. When leads go cold, manually emailing or texting hundreds of contacts to revive them is an exhausting and rarely completed chore.",
    "reddit_title": "r/coaching - Best campaign to reactivate dead email lists?",
    "reddit_comments": "39 comments",
    "metrics": [
      {
        "label": "Avg Cold Lead List",
        "value": "1,200+"
      },
      {
        "label": "Lead Cost (Meta)",
        "value": "$45/ea"
      },
      {
        "label": "Reactivation Conversions",
        "value": "8-12%"
      }
    ],
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
    ]
  },
  {
    "industry": "Online Coaching",
    "name": "Sales Stack Automation",
    "description": "Intake form submission creates a CRM contact, triggers a 7-day GHL nurture sequence, confirms Cal.com bookings with AI-generated prep notes, and sends a post-call follow-up email from the call transcript.",
    "integrations": [
      "GHL_API_KEY",
      "CALCOM_API_KEY",
      "ANTHROPIC_API_KEY",
      "MAILGUN_API_KEY"
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
    "ai_tasks": "- Prep notes generation before call (step 6)\n- Follow-up email from transcript (step 9)",
    "python_tools": "- `ghl_crm.py` \u2014 test contact creation + pipeline moves\n- `claude_ai.py --action generate` \u2014 test prompt quality before deploying",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test intake form to the webhook URL\n2. Verify GHL contact created + nurture sequence started\n3. Book a test Cal.com appointment \u2014 verify prep notes email arrives\n4. POST a fake transcript to the follow-up webhook \u2014 verify email sent + GHL stage updated",
    "problem_subheader": "Coaching intake forms and booking flows are disjointed",
    "problem_description": "Coaches leak clients when there are dead zones between submitting an intake form, creating a CRM record, booking a consultation calendar slot, and sending pre-call reminder texts.",
    "reddit_title": "r/sales - Best automated coaching onboarding setup?",
    "reddit_comments": "42 comments",
    "metrics": [
      {
        "label": "Coaching Market Size",
        "value": "$15B"
      },
      {
        "label": "Lead-to-Call Dropoff",
        "value": "30%"
      },
      {
        "label": "Show-Up Rate Lift",
        "value": "+20%"
      }
    ],
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
    ]
  },
  {
    "industry": "Pharmaceutical",
    "name": "IND/NDA Application Prep Automation",
    "description": "A Claude Code document intake tool lets regulatory teams upload study data. Claude extracts and maps structured data to CTD module sections (3.2.S, 3.2.P, etc.), drafts narrative sections with correct regulatory language, flags missing content, and routes draft sections to SMEs for approval via email.",
    "integrations": [
      "ANTHROPIC_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "AIRTABLE_API_KEY"
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
    "ai_tasks": "- Structured data extraction from regulatory documents (step 2)\n- Narrative section drafting with regulatory language (step 4)",
    "python_tools": "- `claude_ai.py --action extract` \u2014 test extraction accuracy on sample study doc\n- `google_docs_pdf.py` \u2014 create/manage draft docs\n- `airtable_crud.py` \u2014 manage section tracking table",
    "code_app": "Build `workflows/pharmaceutical/document_intake.html`:\n- File upload area (drag-drop or browse) \u2014 accepts PDF, DOCX, CSV\n- Metadata form: drug name, study type, CTD section target\n- Submit \u2192 uploads to Google Drive \u2192 fires n8n webhook\n- Status tracker: table of submitted docs with extraction status\n- Missing sections panel: list of CTD sections still needed",
    "test_plan": "1. Upload a sample study document (chemistry data for a fictional drug)\n2. Verify Claude extraction returns correct CTD section mapping\n3. Check Google Docs \u2014 narrative draft created for each extracted section\n4. Verify Airtable shows which sections are complete vs. missing\n5. Verify SME email sent with review link",
    "problem_subheader": "Regulatory teams spend months manually compiling clinical narrative summaries",
    "problem_description": "FDA submissions require compliance mapping. Clinical teams waste hundreds of hours extracting trial data from laboratory sheets and formatting it into strict IND/NDA module layouts.",
    "reddit_title": "r/regulatoryaffairs - AI tools for drafting clinical narratives?",
    "reddit_comments": "18 comments",
    "metrics": [
      {
        "label": "Biotech Startups",
        "value": "8K"
      },
      {
        "label": "FDA Approval Delay Cost",
        "value": "$1M/day"
      },
      {
        "label": "Dossier Prep Time",
        "value": "6 months"
      }
    ],
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
    ]
  },
  {
    "industry": "HR (Small Orgs)",
    "name": "AI Adoption Consulting",
    "description": "An AI readiness audit form collects business info and pain points. On submission, Claude generates personalized AI tool recommendations. n8n assembles and emails a PDF report to the client. A follow-up check-in goes out at 7 and 30 days.",
    "integrations": [
      "ANTHROPIC_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "MAILGUN_API_KEY"
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
    "ai_tasks": "- AI tool recommendations generation (step 2) \u2014 quality matters here; test prompt carefully",
    "python_tools": "- `google_docs_pdf.py` \u2014 local testing of doc creation + PDF export\n- `mailgun_email.py` \u2014 test email with attachment",
    "code_app": "Build `workflows/hr/ai_audit_form.html`:\n- Multi-step form (3 pages): company info \u2192 pain points (checkboxes) \u2192 AI experience + budget\n- Progress bar\n- Submit to n8n webhook\n- After submit: \"Your report is being generated \u2014 check your inbox in 2 minutes\"\n- Design: matches build guide aesthetic (dark/light theme, Satoshi font)",
    "test_plan": "1. Open ai_audit_form.html, fill out and submit as test company\n2. Check .tmp/ or Docs \u2014 report should be created\n3. Verify PDF email arrives with personalized recommendations\n4. Wait (or fast-forward n8n) \u2014 verify 7-day check-in sends",
    "problem_subheader": "Small consulting firms struggle to deliver comprehensive AI audit documents",
    "problem_description": "Consultants spend days interviewing staff, compiling recommendations, formatting tables, and styling PDF report files. They cannot scale their auditing services without automation.",
    "reddit_title": "r/consulting - Automating discovery reports and recommendations?",
    "reddit_comments": "31 comments",
    "metrics": [
      {
        "label": "Small Consultancies",
        "value": "45K"
      },
      {
        "label": "Audit Prep Time",
        "value": "16 hours"
      },
      {
        "label": "Client Close Rate",
        "value": "+35%"
      }
    ],
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
    ]
  },
  {
    "industry": "HR (Small Orgs)",
    "name": "Admin Workflow Automation",
    "description": "New hire form triggers account creation + welcome kit; PTO requests are auto-approved or flagged to manager; an internal FAQ bot answers HR policy questions; and automated review cycle reminder emails go out on schedule.",
    "integrations": [
      "ANTHROPIC_API_KEY",
      "GOOGLE_SERVICE_ACCOUNT_JSON",
      "SLACK_BOT_TOKEN"
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
    "ai_tasks": "None specified.",
    "python_tools": "None specified.",
    "code_app": "Build `workflows/hr/faq_bot.html`:\n- Simple chat interface: employee types an HR question\n- System: \"You are an HR assistant for [Company]. Answer based on the policy handbook. Escalate anything you can't find to hr@company.com.\"\n- Handbook content embedded as context (paste policy text into system prompt)\n- Claude API via n8n proxy webhook",
    "test_plan": "No test plan specified.",
    "problem_subheader": "HR onboarding in growing firms is a manual, chaotic process",
    "problem_description": "Without automated triggers, HR managers waste hours emailing new hires for payroll info, checking background statuses, adding users to Slack, and setting up training tasks.",
    "reddit_title": "r/humanresources - Standard onboarding workflow for a team of 40?",
    "reddit_comments": "72 comments",
    "metrics": [
      {
        "label": "US Mid-Size Orgs",
        "value": "180K"
      },
      {
        "label": "Employee Onboarding Time",
        "value": "8h"
      },
      {
        "label": "Employee Turnover Reduction",
        "value": "30%"
      }
    ],
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
    ]
  },
  {
    "industry": "Chiropractic",
    "name": "General Practice Automation",
    "description": "Intake form creates a new patient record and sends a confirm SMS/email. 24h before each appointment, a reminder SMS fires with directions. Post-visit: a review request + care plan follow-up email sends automatically. Patients inactive 60 days get a reactivation SMS.",
    "integrations": [
      "GHL_API_KEY",
      "TWILIO_ACCOUNT_SID"
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
    "ai_tasks": "None specified.",
    "python_tools": "- `ghl_crm.py --action inactive --days 60` \u2014 pull inactive patients\n- `twilio_sms.py` \u2014 test all SMS templates",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test intake form \u2014 verify GHL contact created + confirmation SMS received\n2. Add a test appointment for tomorrow in GHL \u2014 run reminder flow \u2014 verify SMS received\n3. Mark appointment \"Completed\" in GHL \u2014 wait 2h \u2014 verify follow-up email with review link\n4. Set test contact last_visit to 61 days ago \u2014 run reactivation \u2014 verify SMS received",
    "problem_subheader": "40% of new chiropractic patients fail to book a follow-up appointment",
    "problem_description": "Patient retention is the core profit driver for chiropractic clinics. Without immediate post-visit feedback requests, automated reminders, and 60-day reactivation texts, patients drop out of care programs.",
    "reddit_title": "Chiropractic Success - Patient retention and automated SMS?",
    "reddit_comments": "49 comments",
    "metrics": [
      {
        "label": "US Chiro Clinics",
        "value": "70K"
      },
      {
        "label": "Patient Drop-Out Rate",
        "value": "40%"
      },
      {
        "label": "Review Generation Lift",
        "value": "+50%"
      }
    ],
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
    ]
  },
  {
    "industry": "Adult Education & Nonprofit Training",
    "name": "Membership Management Automation",
    "description": "Centralizes member records and renewal dates in Airtable, automatically sends tiered renewal reminders and grace-period notices with Claude-written benefit summaries, and flags high-value lapsed members for personal outreach before they fully churn.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Schedule Trigger", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Expiring Members", "type": "n8n-nodes-base.airtable"},
      {"name": "IF: Days Until Expiry", "type": "n8n-nodes-base.if"},
      {"name": "Claude: Draft Renewal Email", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Reminder", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Update Status", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Write personalized renewal emails referencing each member's engagement history and program benefits\n- Classify lapsed members by value tier to suggest manual vs. automated outreach",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Add a test member with expiry date 7 days out\n2. Trigger the schedule manually and verify email is sent\n3. Check Airtable record shows updated status\n4. Verify lapsed high-value members appear in a separate queue",
    "problem_subheader": "Member renewals fall through the cracks without reminders",
    "problem_description": "Adult education nonprofits track memberships manually in spreadsheets, sending generic reminders too late. High-value members lapse simply because no one followed up with a relevant, timely message—shrinking program revenue and engagement.",
    "reddit_title": "r/nonprofit - How do you automate membership renewals without a paid CRM?",
    "reddit_comments": "38 comments",
    "metrics": [
      {"label": "Lapse Rate (Manual)", "value": "~25%"},
      {"label": "Reminder Lead Time", "value": "30 days"},
      {"label": "Staff Hours Saved/Mo", "value": "6–10 hrs"}
    ],
    "gtm": [
      {"channel": "Nonprofit Tech Forums", "desc": "Share the membership renewal template on NTEN and TechSoup communities where adult-ed admins look for free tools."},
      {"channel": "Grant Writer Partnerships", "desc": "Partner with grant writers who see admin pain firsthand and can introduce the automation as a value-add."},
      {"channel": "Local Chamber Directories", "desc": "Identify nonprofit training orgs through NKY Chamber and Cincinnati Chamber member lists for direct outreach."}
    ]
  },
  {
    "industry": "AI Education & Training",
    "name": "AI Literacy Training Automation",
    "description": "Enrolls SMB employees into modular AI literacy courses (built with Claude) inside a LMS, automates assignment reminders and module unlocking, and auto-generates completion certificates that feed back into HR systems—turning one-off workshops into a scalable recurring revenue stream.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "GOOGLE_SERVICE_ACCOUNT_JSON"],
    "nodes": [
      {"name": "Webhook Trigger", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Create Enrollment", "type": "n8n-nodes-base.airtable"},
      {"name": "Schedule Trigger: Reminders", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Claude: Draft Module Intro", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Assignment", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Google Docs: Generate Certificate", "type": "n8n-nodes-base.googleDocs"},
      {"name": "Airtable: Mark Completed", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Generate module content covering prompting basics, workflow design, and AI ethics tailored to the SMB's industry\n- Draft personalized reminder messages referencing the learner's role and progress",
    "python_tools": "- `google_docs_pdf.py` to export completion certificates as PDFs from Google Docs templates",
    "code_app": "Build `workflows/ai_education/course_portal.html`: a simple learner dashboard showing module progress, next steps, and certificate download—fetches data from n8n webhook.",
    "test_plan": "1. Submit a test enrollment webhook with employee name and company\n2. Verify Airtable record created and welcome email sent\n3. Trigger a reminder after simulated 3-day gap\n4. Mark module complete and confirm certificate PDF is generated and emailed",
    "problem_subheader": "SMB teams dabble in AI but lack structured training",
    "problem_description": "73% of small businesses need help identifying and prioritizing AI projects, yet most employees learn through trial and error. Without structured training, teams misuse tools or avoid them entirely—leaving competitive advantage on the table.",
    "reddit_title": "r/smallbusiness - What's the best way to actually train your team to use AI tools?",
    "reddit_comments": "61 comments",
    "metrics": [
      {"label": "SMBs Needing AI Help", "value": "73%"},
      {"label": "Avg Training Setup Time", "value": "Manual: 4h"},
      {"label": "Discovery Engagement Value", "value": "$500–1,000"}
    ],
    "gtm": [
      {"channel": "Cincinnati Chamber Events", "desc": "Present AI literacy as a member benefit at MADE, West Chester-Liberty, and African American Chamber meetings."},
      {"channel": "HR & PEO Partnerships", "desc": "Partner with HR firms (HR Elements, GMS) to bundle AI training as an employee development benefit."},
      {"channel": "BNI Chapters", "desc": "Join BNI chapters in Southwest Ohio and pitch AI literacy workshops to business owners seeking competitive edges."}
    ]
  },
  {
    "industry": "AI Education & Training",
    "name": "AI Opportunity Assessment Workflow",
    "description": "An intake form collects recurring tasks and existing systems from SMB staff. Claude scores each opportunity by complexity, impact, and feasibility, then drafts a prioritized automation roadmap. n8n assembles a PDF report and emails it—creating a paid discovery pipeline that generates future implementation projects.",
    "integrations": ["ANTHROPIC_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Store Responses", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Score & Prioritize", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Google Docs: Build Roadmap", "type": "n8n-nodes-base.googleDocs"},
      {"name": "Mailgun: Deliver Report", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Analyze submitted tasks for automation feasibility, estimated time savings, and implementation complexity\n- Draft a ranked roadmap with plain-language explanations for non-technical business owners",
    "python_tools": "- `google_docs_pdf.py` to export the roadmap as a PDF before email delivery",
    "code_app": "Build `workflows/ai_education/audit_form.html`: a polished multi-step audit form collecting business info, team size, top recurring tasks, and current tools. Submits to n8n webhook on completion.",
    "test_plan": "1. Submit test form with 5 dummy tasks\n2. Verify Airtable receives the data\n3. Confirm Claude produces a scored list with at least 3 ranked items\n4. Check that a PDF is generated and the delivery email arrives",
    "problem_subheader": "Businesses don't know where to start with automation",
    "problem_description": "Owners and executives want AI wins but have no structured way to inventory their opportunities or estimate savings. Without a roadmap, they either do nothing or invest in the wrong tools first—wasting budget and momentum.",
    "reddit_title": "r/entrepreneur - How do you figure out which processes in your business to automate first?",
    "reddit_comments": "84 comments",
    "metrics": [
      {"label": "Avg Paid Discovery Fee", "value": "$500–1,000"},
      {"label": "Automations Identified/Audit", "value": "8–15"},
      {"label": "Conversion to Impl. Project", "value": "~60%"}
    ],
    "gtm": [
      {"channel": "Accountant & HR Referrals", "desc": "Position yourself as an AI specialist that accountants and HR consultants bring into existing client relationships."},
      {"channel": "Chamber Speaking Slots", "desc": "Offer a free 20-minute 'AI Opportunity Audit' talk at chamber lunches and convert attendees to paid assessments."},
      {"channel": "LinkedIn Outreach", "desc": "Target C-suite and business owners in regional BNI chapters and Cincinnati-area LinkedIn groups with the audit offer."}
    ]
  },
  {
    "industry": "Automation Reliability",
    "name": "Workflow Reliability Audit",
    "description": "Collects log outputs from n8n, Zapier, Make, and custom scripts, normalizes fields in a central table, and sends them to Claude weekly for error-cluster analysis. Claude produces a prioritized 'Reliability Report' highlighting silent failures, rising runtimes, and repeated retries—delivered to MSP teams before business users complain.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "SLACK_BOT_TOKEN", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Schedule Trigger: Weekly", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "HTTP Request: Pull Logs", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Code: Normalize Log Fields", "type": "n8n-nodes-base.code"},
      {"name": "Airtable: Store Log Entries", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Analyze & Draft Report", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Email Report", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Slack: Notify MSP Team", "type": "n8n-nodes-base.slack"}
    ],
    "ai_tasks": "- Identify error clusters, rising execution runtimes, and repeated retry patterns across all connected platforms\n- Draft a plain-English Reliability Report with prioritized fix recommendations and risk levels",
    "python_tools": "- None required; log ingestion handled via HTTP requests in n8n",
    "code_app": "Not required. Optional: a simple Airtable interface view surfacing the top 5 reliability risks per week.",
    "test_plan": "1. Feed sample log data with 2 deliberate error clusters\n2. Trigger schedule manually\n3. Confirm Claude flags both clusters with correct severity\n4. Verify report arrives via email and Slack notification fires",
    "problem_subheader": "Silent automation failures go unnoticed until clients complain",
    "problem_description": "MSPs and SMBs deploying AI workflows have no unified view of what's breaking. Jobs time out, integrations silently fail, and retries pile up—discovered only when a frustrated end user calls in, by which point data is already lost or delayed.",
    "reddit_title": "r/msp - How do you monitor n8n/Zapier workflows for silent failures across clients?",
    "reddit_comments": "29 comments",
    "metrics": [
      {"label": "Silent Failure Rate", "value": "~15–20%"},
      {"label": "Avg Detection Lag", "value": "2–5 days"},
      {"label": "MSP Clients Served/Firm", "value": "20–80"}
    ],
    "gtm": [
      {"channel": "MSP Networking Events", "desc": "Present reliability dashboards at Cincinnati Chamber tech meetups where IT GOAT, Ingage Partners, and Intrust IT network."},
      {"channel": "Clutch & DesignRush Listings", "desc": "Target IT consultancies listed on Clutch serving Cincinnati SMBs with a free 'automation health check' offer."},
      {"channel": "Cybersecurity Partner Channel", "desc": "Partner with Cincinnati cybersecurity consultants who manage policies and can bundle credential monitoring."}
    ]
  },
  {
    "industry": "Childcare & Daycare Centers",
    "name": "Waitlist & Enrollment Flow",
    "description": "All new applications enter a central Airtable intake form. When a slot opens, n8n filters for age-matched children and uses Claude to rank by priority rules (siblings enrolled, time on waitlist, special needs). SMS/email offers go to the top family with a 24-hour claim window; if no reply, the spot automatically advances to the next family and the enrollment packet is triggered on acceptance.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: New Application", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Create Waitlist Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Webhook Trigger: Slot Opened", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Query Matching Families", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Rank by Priority", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Send SMS Offer", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 24 Hours", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Reply Received", "type": "n8n-nodes-base.if"},
      {"name": "Mailgun: Send Enrollment Packet", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Update Waitlist Status", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Rank waiting families by configured priority rules factoring in enrollment duration, age match, siblings, and special needs flags\n- Draft personalized SMS offer text referencing the specific program and start date",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test application form and verify Airtable record\n2. Trigger a 'slot opened' webhook and confirm top family receives SMS within 2 minutes\n3. Simulate no-reply; verify next family is contacted after 24 hours\n4. Reply YES and confirm enrollment packet email arrives",
    "problem_subheader": "Daycare spots sit unfilled while directors dial families one by one",
    "problem_description": "Centers manage long waitlists in spreadsheets. When a spot opens, directors spend hours making individual calls to find an age match—delaying enrollment, frustrating families, and leaving tuition revenue uncollected for days or weeks.",
    "reddit_title": "r/ECEProfessionals - How are you managing waitlists without a $400/mo software subscription?",
    "reddit_comments": "53 comments",
    "metrics": [
      {"label": "KinderCare Centers (Area)", "value": "10+"},
      {"label": "Avg Spot-Fill Time (Manual)", "value": "3–5 days"},
      {"label": "Spot-Fill Time (Automated)", "value": "<24 hrs"}
    ],
    "gtm": [
      {"channel": "Childcare Director Groups", "desc": "Engage directors in Ohio childcare Facebook groups and NAEYC regional chapters with the 24-hour enrollment story."},
      {"channel": "Chamber Introductions", "desc": "Use Mason Deerfield, West Chester-Liberty, and Colerain Chamber directories to identify daycare owners for outreach."},
      {"channel": "Preschool Consultants", "desc": "Partner with licensing and curriculum consultants who already advise centers and can introduce the automation."}
    ]
  },
  {
    "industry": "Childcare & Daycare Centers",
    "name": "Parent Communication & Alerts",
    "description": "Teachers upload photos and quick notes throughout the day; at close, Claude generates a short personalized daily summary per family covering meals, naps, key activities, and one highlight. Urgent alerts (illness clusters, weather closings) trigger immediate SMS to all affected parents when staff flip an alert flag.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    "nodes": [
      {"name": "Webhook Trigger: Photo/Note Upload", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Store Daily Notes", "type": "n8n-nodes-base.airtable"},
      {"name": "Schedule Trigger: End of Day", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Day's Notes per Child", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Generate Family Summary", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Daily Recap", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Urgent Alert Flag", "type": "n8n-nodes-base.webhook"},
      {"name": "Twilio: Blast SMS Alert", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Transform raw teacher notes into warm, parent-friendly daily summaries per child\n- Draft urgent alert SMS copy appropriate for the situation type (illness, weather, incident)",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Upload 3 test notes for a child and trigger end-of-day schedule\n2. Verify Claude produces a summary and email is sent to test parent address\n3. POST an urgent alert webhook and confirm SMS fires within 60 seconds\n4. Check Airtable archive for compliance log entries",
    "problem_subheader": "Parents get inconsistent updates and miss urgent alerts",
    "problem_description": "Teachers and directors send daily updates through a patchwork of apps and paper notes, making parent communication inconsistent. When emergencies happen—illness outbreaks or weather closings—manual notification chains are slow and miss families.",
    "reddit_title": "r/Parenting - What app does your daycare use to send daily updates? Ours is terrible.",
    "reddit_comments": "47 comments",
    "metrics": [
      {"label": "Parent Satisfaction Driver", "value": "#1: Communication"},
      {"label": "Alert Delivery (Manual)", "value": "15–30 min"},
      {"label": "Alert Delivery (Automated)", "value": "<60 sec"}
    ],
    "gtm": [
      {"channel": "Parent-Teacher Advisory Boards", "desc": "Present the communication system at parent advisory meetings for KinderCare and Goddard School centers."},
      {"channel": "Childcare Association Events", "desc": "Demo at Ohio Child Care Association regional meetings where directors discuss operational tools."},
      {"channel": "Direct Center Outreach", "desc": "Reach out to Youthland Academy, Wilde Kingdom, and Sharon Hill Daycare directly via chamber directories."}
    ]
  },
  {
    "industry": "Churches & Faith-Based Orgs",
    "name": "Visitor Onboarding Workflow",
    "description": "Digitizes visitor card data into Airtable, then Claude generates personalized 4–6 week welcome sequences covering relevant ministries, small groups, and service times. n8n schedules follow-up touchpoints including newcomer lunch invites, ministry connection prompts, and check-in messages—turning first-time visitors into engaged members without volunteer admin hours.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Visitor Form", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Create Visitor Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Generate Welcome Sequence", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Welcome Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 7 Days", "type": "n8n-nodes-base.wait"},
      {"name": "Twilio: Ministry Connection SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 14 Days", "type": "n8n-nodes-base.wait"},
      {"name": "Mailgun: Newcomers Lunch Invite", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Generate personalized welcome sequences referencing family situation, interests flagged on visitor card, and relevant ministry programs\n- Draft each touchpoint with appropriate tone for a faith-based context",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test visitor form with name, interests, and family info\n2. Verify Airtable record created and welcome email arrives\n3. Simulate 7-day wait by adjusting schedule; confirm SMS fires\n4. Check that all 4–6 week touchpoints are queued correctly",
    "problem_subheader": "First-time visitors leave and never come back—nobody followed up",
    "problem_description": "Churches collect visitor cards and online registrations but respond slowly, losing the window to integrate newcomers. Pastors and admin volunteers manually manage spreadsheets and send generic follow-ups weeks too late to build a real connection.",
    "reddit_title": "r/Christianity - How does your church follow up with first-time visitors effectively?",
    "reddit_comments": "44 comments",
    "metrics": [
      {"label": "Visitor Retention (No Follow-Up)", "value": "~15%"},
      {"label": "Retention with Structured Drip", "value": "~45%"},
      {"label": "Admin Hours Saved/Week", "value": "3–5 hrs"}
    ],
    "gtm": [
      {"channel": "Church Tech Networks", "desc": "Share the visitor automation template in church management Facebook groups and Church IT Network forums."},
      {"channel": "Christian Web Designers", "desc": "Partner with local IT volunteers and Christian web designers who already help churches and can recommend the workflow."},
      {"channel": "Multi-Site Ministry Outreach", "desc": "Target larger multi-site churches in Mason, West Chester, and Fairfield via chamber community directories."}
    ]
  },
  {
    "industry": "Commercial Laundries",
    "name": "Pickup & Delivery Route Automation",
    "description": "Compiles daily pickup and delivery stops from restaurants, clinics, and hotels by address and time window, clusters them geographically using Google Maps API, and sequences optimized routes per truck. Crews receive their run sheets automatically, and the system tracks on-time performance per account for SLA reporting.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"],
    "nodes": [
      {"name": "Schedule Trigger: Daily", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Today's Stops", "type": "n8n-nodes-base.airtable"},
      {"name": "HTTP Request: Google Maps Distance Matrix", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Code: Cluster & Sequence Stops", "type": "n8n-nodes-base.code"},
      {"name": "Claude: Assign Optimized Routes", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: SMS Run Sheet to Driver", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Log Route Plan", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Assign optimized stop sequences per truck honoring time windows and priority flags\n- Summarize route plans into driver-friendly SMS run sheets",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load 10 test stops with addresses and time windows into Airtable\n2. Trigger schedule manually and verify Google Maps API call succeeds\n3. Confirm Claude produces distinct routes per truck with no time-window conflicts\n4. Verify driver SMS arrives with correct stop sequence",
    "problem_subheader": "Trucks crisscross the city burning miles on manual routes",
    "problem_description": "Commercial laundries planning routes manually to restaurants, clinics, and hotels waste truck miles and miss delivery windows—creating inconsistent service that damages long-term contracts. Route planning takes hours each morning instead of minutes.",
    "reddit_title": "r/Laundry - Anyone using software to optimize linen delivery routes? Doing it manually is killing us.",
    "reddit_comments": "18 comments",
    "metrics": [
      {"label": "Manual Route Plan Time", "value": "1–2 hrs/day"},
      {"label": "Miles Saved (Optimized)", "value": "15–25%"},
      {"label": "On-Time Rate Improvement", "value": "+12%"}
    ],
    "gtm": [
      {"channel": "Hospitality Association Events", "desc": "Present the route optimization tool at Cincinnati Hospitality Association meetings where laundry vendors and hotels intersect."},
      {"channel": "Direct Plant Outreach", "desc": "Identify commercial laundry plants via local business directories and offer a free route-efficiency analysis."},
      {"channel": "Restaurant Group Referrals", "desc": "Contact restaurant groups and clinic purchasing managers who can pressure their laundry vendors to modernize operations."}
    ]
  },
  {
    "industry": "Construction Contractors",
    "name": "Bid Intake & Comparison",
    "description": "Ingests new bid invitations from email and procurement portals, uses Claude to summarize scope, value indicators, and submission requirements, then ranks bids by strategic fit and team capacity for leadership review. Tracks win/loss history by project type to sharpen future bid decisions.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "GOOGLE_SERVICE_ACCOUNT_JSON"],
    "nodes": [
      {"name": "Gmail Trigger", "type": "n8n-nodes-base.gmailTrigger"},
      {"name": "Code: Extract Attachment Text", "type": "n8n-nodes-base.code"},
      {"name": "Claude: Summarize & Score Bid", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Airtable: Create Bid Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Google Sheets: Update Bid Pipeline", "type": "n8n-nodes-base.googleSheets"},
      {"name": "Mailgun: Notify Leadership", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Extract project scope, submission deadline, estimated value, and special requirements from raw bid documents\n- Score each bid against configured capacity and strategic fit criteria and produce a comparison summary",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Send a test bid invitation email with a PDF attachment\n2. Verify Claude extracts key fields correctly\n3. Check Airtable record created with score and summary\n4. Confirm Google Sheets pipeline row added and leadership notification email arrives",
    "problem_subheader": "PMs miss or misprioritize bid opportunities buried in email",
    "problem_description": "Construction contractors receive bid invitations via email and procurement portals daily. Project managers manually skim specs and deadlines—risking missed submissions on high-fit projects and wasted estimating hours on poor-fit work.",
    "reddit_title": "r/construction - How do you manage tracking and responding to multiple bid invitations at once?",
    "reddit_comments": "56 comments",
    "metrics": [
      {"label": "Bids Received/Month", "value": "15–40"},
      {"label": "Estimator Hours/Bid", "value": "4–12 hrs"},
      {"label": "Win Rate (Targeted Bids)", "value": "+18%"}
    ],
    "gtm": [
      {"channel": "Allied Construction Industries", "desc": "Present the bid management system at ACI events serving 500+ member companies across Southwest Ohio."},
      {"channel": "Construction Attorneys", "desc": "Partner with construction attorneys and bonding agents who work with these firms and appreciate clean bid documentation."},
      {"channel": "Colerain Chamber Outreach", "desc": "Use Colerain Chamber's contractor directory to identify firms for direct outreach and demo offers."}
    ]
  },
  {
    "industry": "Construction Contractors",
    "name": "Field Report & Daily Log Automation",
    "description": "Replaces free-form field texts with guided mobile forms; n8n collects supervisor inputs and Claude converts them into standardized daily log categories covering labor, equipment, weather, and safety issues. Logs are stored searchably in Airtable for future claims support, trend identification, and compliance documentation.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Mobile Form", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Standardize Log Entry", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "IF: Safety Issue Flagged", "type": "n8n-nodes-base.if"},
      {"name": "Mailgun: Alert Safety Manager", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Store Daily Log", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Convert unstructured foreman notes into standardized log categories (labor count, equipment used, issues encountered, weather)\n- Flag safety deviations and summarize patterns across multiple job sites weekly",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test mobile form with unstructured text\n2. Verify Claude produces a structured log with all required categories\n3. Include a safety keyword and confirm alert email fires\n4. Search Airtable for the record and verify all fields populated",
    "problem_subheader": "Paper daily logs are inconsistent and unsearchable when claims arise",
    "problem_description": "Foremen on job sites submit hand-written or loosely formatted daily logs that office staff can't easily search or analyze. When a dispute or insurance claim arises months later, the paper trail is incomplete—creating costly documentation gaps.",
    "reddit_title": "r/projectmanagement - What's your system for daily field reports on construction sites?",
    "reddit_comments": "41 comments",
    "metrics": [
      {"label": "Log Completion Rate (Paper)", "value": "~60%"},
      {"label": "Log Completion Rate (Mobile)", "value": "~92%"},
      {"label": "Claims Resolved w/ Good Docs", "value": "3× faster"}
    ],
    "gtm": [
      {"channel": "Safety Consultants", "desc": "Partner with safety and insurance consultants supporting construction clients who benefit directly from better log compliance."},
      {"channel": "ACI Member Events", "desc": "Demo the mobile form + standardized log system at Allied Construction Industries meetings in Southwest Ohio."},
      {"channel": "Bonding & Surety Agents", "desc": "Approach bonding agents who care about contractors' documentation quality as part of risk assessment."}
    ]
  },
  {
    "industry": "Construction & Plumbing Services",
    "name": "Contractor Content Engine",
    "description": "After each project, techs upload 3–5 photos and a brief description. n8n sends the context to Claude, which generates a case study, a 300-word local SEO page, and 3 social posts emphasizing neighborhood, problem, and outcome. Content auto-publishes to the site's Projects section and feeds into the social calendar. Monthly portfolio growth reports show owners how many jobs have become marketing assets.",
    "integrations": ["ANTHROPIC_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    "nodes": [
      {"name": "Webhook Trigger: Job Complete", "type": "n8n-nodes-base.webhook"},
      {"name": "Code: Collect Photos + Description", "type": "n8n-nodes-base.code"},
      {"name": "Claude: Generate Case Study + Posts", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "HTTP Request: Publish to CMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Log Content Asset", "type": "n8n-nodes-base.airtable"},
      {"name": "HTTP Request: Push to Social Scheduler", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Generate case study copy, local SEO page text, and 3 social posts from job photos and description\n- Tailor content by city, job type, and outcome for hyperlocal search relevance",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test webhook with job description and photo URLs\n2. Verify Claude returns case study, SEO page, and 3 posts\n3. Confirm CMS publish HTTP request receives 200 status\n4. Check Airtable log has the new content asset entry",
    "problem_subheader": "Completed jobs sit in photos folders instead of selling the next job",
    "problem_description": "Small contractors do excellent work but never document it. Owners spend evenings trying to write case studies and social posts manually—or never do it at all—leaving websites sparse and undermining trust compared to better-marketed competitors.",
    "reddit_title": "r/Contractor - How do you turn job photos into content without hiring a marketer?",
    "reddit_comments": "67 comments",
    "metrics": [
      {"label": "Contractors in BBB (Area)", "value": "300+"},
      {"label": "Avg Content Created/Job (Manual)", "value": "0"},
      {"label": "Organic Leads from SEO Pages", "value": "+35%"}
    ],
    "gtm": [
      {"channel": "ACI Member Events", "desc": "Present the content engine at Allied Construction Industries events serving 500+ member companies across Southwest Ohio."},
      {"channel": "Local Web Agency Partnerships", "desc": "Partner with Genesis Web Studio, Skynet Technologies, and BigOrange Marketing to bundle the content engine into new site builds."},
      {"channel": "Colerain Chamber Directory", "desc": "Use Colerain Chamber's 31+ construction company directory for direct outreach to contractors lacking online presence."}
    ]
  },
  {
    "industry": "Construction & Plumbing Services",
    "name": "Renovation Lead Follow-Up",
    "description": "When a homeowner submits a quote form, n8n logs the lead and immediately sends a confirmation SMS or email. Claude drafts a discovery email with 5–7 targeted questions about photos, budget, and timeline. Once answers arrive, n8n assigns the lead to the right estimator and offers scheduling options—ensuring every inbound lead gets a response before the competitor does.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Quote Form", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Create Lead", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: Instant Confirmation SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Claude: Draft Discovery Questions", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Discovery Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 48 Hours", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Response Received", "type": "n8n-nodes-base.if"},
      {"name": "Mailgun: Assign to Estimator", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Draft a personalized discovery email with project-specific questions based on the job type and suburb mentioned in the form\n- Generate a brief lead summary for the estimator including key details and project fit signals",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit test quote form for a bathroom remodel\n2. Verify confirmation SMS arrives within 60 seconds\n3. Check discovery email is sent and personalized to the project type\n4. Simulate homeowner response and confirm estimator assignment email fires",
    "problem_subheader": "Homeowners move on to whoever responds first",
    "problem_description": "Contractors receive quote requests via website forms but follow-up is inconsistent. Busy crews forget to send confirmations, and homeowners in competitive suburban markets contact 3–4 contractors simultaneously—choosing the first one that responds with a clear next step.",
    "reddit_title": "r/Homebuilding - How fast do contractors usually respond to quote requests? Mine took 2 weeks.",
    "reddit_comments": "89 comments",
    "metrics": [
      {"label": "Lead Response Time (Manual)", "value": "24–72 hrs"},
      {"label": "Lead Response Time (Automated)", "value": "<60 sec"},
      {"label": "Conversion Rate Improvement", "value": "+28%"}
    ],
    "gtm": [
      {"channel": "Real Estate Agent Referrals", "desc": "Partner with real estate agents and property managers who constantly refer contractors and need reliable response partners."},
      {"channel": "BBB Contractor Directory", "desc": "Target contractors with 4+ star BBB ratings in Mason, West Chester, and Fairfield who have volume but inconsistent lead follow-up."},
      {"channel": "Colerain Chamber Network", "desc": "Connect with contractors listed in Colerain Chamber directories at member networking events."}
    ]
  },
  {
    "industry": "Coworking & Flex Spaces",
    "name": "Tour Requests & Membership Conversion",
    "description": "Logs tour inquiries with use case, team size, and suburb context. After each tour, Claude writes a tailored recap and membership recommendation matching the prospect's stated needs to specific plans. Automated follow-ups track conversion through sign-up, and members who go cold trigger a re-engagement message before they disappear.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Tour Request", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Log Prospect", "type": "n8n-nodes-base.airtable"},
      {"name": "Webhook Trigger: Tour Complete", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Draft Personalized Follow-Up", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Tour Recap + Recommendation", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 3 Days", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Signed Up", "type": "n8n-nodes-base.if"},
      {"name": "Twilio: Re-Engagement SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Write personalized post-tour email referencing the prospect's stated use case, team size, and budget\n- Recommend 1–2 specific membership plans with rationale based on the tour conversation notes",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test tour request with prospect details\n2. Mark tour complete and verify Claude follow-up email arrives with correct plan recommendation\n3. Simulate 3-day no response and confirm re-engagement SMS fires\n4. Mark as signed up and verify workflow exits correctly",
    "problem_subheader": "Tour prospects go cold and the membership conversion never happens",
    "problem_description": "Coworking spaces invest in giving tours but many prospects go cold afterward because follow-up is manual and generic. By the time a community manager remembers to check in, the prospect has signed a lease at a competitor or returned to working from home.",
    "reddit_title": "r/coworking - What's your process for converting tour visitors into paying members?",
    "reddit_comments": "22 comments",
    "metrics": [
      {"label": "Tour-to-Membership (No Follow-Up)", "value": "~20%"},
      {"label": "Tour-to-Membership (Automated)", "value": "~38%"},
      {"label": "Follow-Up Response Time", "value": "<2 hrs"}
    ],
    "gtm": [
      {"channel": "Coworking Operator Networks", "desc": "Share the tour conversion workflow in Coworking Alliance and GCUC community channels."},
      {"channel": "Local Chamber Introductions", "desc": "Meet coworking operators at Mason Deerfield and West Chester-Liberty Chamber events where COhatch and ORCA participate."},
      {"channel": "Remote Work Communities", "desc": "Target local remote work Slack groups and LinkedIn communities used by members of suburban coworking spaces."}
    ]
  },
  {
    "industry": "Dental Clinics",
    "name": "Missed-Call Capture & Recovery",
    "description": "Monitors inbound calls for any that ring without answer or go to voicemail. Within seconds, sends an SMS offering to help with scheduling or triage. Claude analyzes voicemail transcripts for urgency keywords and classifies them as emergency, urgent, or routine. High-urgency cases route to front desk immediately; routine consults auto-book once the patient confirms.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    "nodes": [
      {"name": "Webhook Trigger: Missed Call", "type": "n8n-nodes-base.webhook"},
      {"name": "Twilio: Send Recovery SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "IF: Voicemail Captured", "type": "n8n-nodes-base.if"},
      {"name": "Claude: Classify Urgency", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "IF: Emergency", "type": "n8n-nodes-base.if"},
      {"name": "Twilio: Alert On-Call Staff", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Log Call + Outcome", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Analyze voicemail transcripts for urgency signals (pain keywords, dental emergency terminology)\n- Classify each missed call as emergency, urgent, or routine and draft appropriate response copy",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Simulate a missed call webhook with a test phone number\n2. Verify recovery SMS arrives within 60 seconds\n3. Submit a voicemail transcript with 'severe pain' keywords and confirm emergency routing fires\n4. Submit routine appointment text and confirm standard queue placement",
    "problem_subheader": "Missed calls walk out the door straight to the next dentist",
    "problem_description": "Dental offices miss calls during busy clinic hours and after hours—losing new-patient opportunities and urgent cases. Most callers won't leave a voicemail and simply call the next practice. Each missed call represents a lost patient relationship worth hundreds to thousands of dollars per year.",
    "reddit_title": "r/DentalOffice - How do you handle missed calls when the front desk is slammed with patients?",
    "reddit_comments": "71 comments",
    "metrics": [
      {"label": "Calls Missed Daily (Avg Clinic)", "value": "8–15"},
      {"label": "Patients Lost to Competitors", "value": "~40%"},
      {"label": "Recovery Rate with SMS", "value": "~55%"}
    ],
    "gtm": [
      {"channel": "Dental IT Providers", "desc": "Partner with dental IT and phone vendors serving regional practices who can introduce missed-call automation as an add-on."},
      {"channel": "Dental Marketing Agencies", "desc": "Collaborate with dental marketing consultants who already work with Afinia Dental and independents across Mason and West Chester."},
      {"channel": "Practice Owner LinkedIn Outreach", "desc": "Target dental practice owners on LinkedIn in Cincinnati suburbs with a '15 missed calls you lost last week' cold message."}
    ]
  },
  {
    "industry": "Dental Clinics",
    "name": "Recall & Unscheduled Treatment Follow-Up",
    "description": "Queries patients with diagnosed but unscheduled treatments, segmented by procedure type and insurance status. Claude drafts recall messages emphasizing benefits and insurance timing—for example noting when year-end coverage applies. Messages send via SMS and email at 30, 60, and 90-day intervals. Persistent non-responders escalate to a manual phone outreach list.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    "nodes": [
      {"name": "Schedule Trigger: Weekly", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Query Unscheduled Treatments", "type": "n8n-nodes-base.airtable"},
      {"name": "IF: Days Since Diagnosis", "type": "n8n-nodes-base.if"},
      {"name": "Claude: Draft Recall Message", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Send SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Send Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 30 Days", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Booked", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Flag for Phone Outreach", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Draft personalized recall messages referencing the specific procedure, tooth number, and insurance benefit timing\n- Generate escalation summaries for staff handling phone outreach on the most stubborn non-responders",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load a test patient with a crown diagnosis 35 days ago into Airtable\n2. Trigger the weekly schedule and confirm 30-day message fires\n3. Verify SMS and email both arrive with procedure-specific copy\n4. Simulate 90 days with no booking and confirm phone list flag is set",
    "problem_subheader": "Diagnosed treatments walk out the door and never get scheduled",
    "problem_description": "Patients leave after appointments with diagnoses for crowns, scaling, or implants but no follow-up appointment. Practices lose thousands in revenue per uncompleted treatment, and patients' dental health worsens—while the practice has no systematic way to bring them back.",
    "reddit_title": "r/DentalHygiene - How does your office handle patients who were treatment planned but never scheduled?",
    "reddit_comments": "48 comments",
    "metrics": [
      {"label": "Unscheduled Treatment Value", "value": "$800–3,500/pt"},
      {"label": "Recall Conversion (Manual)", "value": "~12%"},
      {"label": "Recall Conversion (Automated)", "value": "~28%"}
    ],
    "gtm": [
      {"channel": "Dental Consulting Firms", "desc": "Partner with dental practice consultants who measure case acceptance rates and can quantify the ROI of recall automation."},
      {"channel": "Dental Billing Companies", "desc": "Work with RCM and billing companies who track unscheduled treatment as a revenue opportunity for their practice clients."},
      {"channel": "Pediatric & Specialty Clinic Outreach", "desc": "Target pediatric and specialty clinics in Mason and West Chester where treatment completion tracking is especially complex."}
    ]
  },
  {
    "industry": "Driving Schools",
    "name": "Course Progress & Test Readiness Notification",
    "description": "Logs each lesson and evaluation score into Airtable. When readiness thresholds are met across all required skills, n8n automatically notifies the family with recommended test dates and BMV booking instructions—eliminating uncertainty about when the teen is ready and reducing failed first-attempt rates.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Lesson Logged", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Update Student Scores", "type": "n8n-nodes-base.airtable"},
      {"name": "Code: Check Readiness Thresholds", "type": "n8n-nodes-base.code"},
      {"name": "IF: All Skills Passed", "type": "n8n-nodes-base.if"},
      {"name": "Claude: Draft Readiness Notification", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Email Parent + Student", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Twilio: SMS Notification", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Draft personalized readiness notification summarizing strengths and recommended next steps for the BMV test\n- Generate post-lesson parent summaries with skills observed and areas still developing",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load a test student with all skills at passing threshold\n2. Submit a lesson completion webhook and verify readiness check triggers\n3. Confirm parent email and SMS arrive with test date recommendation\n4. Log a student with one failing skill and verify no notification is sent",
    "problem_subheader": "Parents don't know when their teen is ready to take the road test",
    "problem_description": "Driving schools make test readiness decisions manually, leaving parents guessing. Teens go to the BMV before they're ready and fail—blaming the school—while ready students wait too long after crossing the threshold, wasting sessions and eroding family trust.",
    "reddit_title": "r/teendriving - How do you know when you're actually ready to take the road test?",
    "reddit_comments": "34 comments",
    "metrics": [
      {"label": "First-Attempt Pass Rate (Unstructured)", "value": "~52%"},
      {"label": "First-Attempt Pass Rate (Scored)", "value": "~74%"},
      {"label": "Parent Satisfaction Driver", "value": "Transparency"}
    ],
    "gtm": [
      {"channel": "High School Guidance Counselors", "desc": "Build relationships with guidance counselors in Fairfield, Mason, and West Chester schools who recommend driving programs."},
      {"channel": "Driving School Associations", "desc": "Present the progress tracking system at Ohio Driving School Association meetings."},
      {"channel": "Parent Facebook Groups", "desc": "Share the readiness notification feature in suburban parent Facebook groups where teen driving is frequently discussed."}
    ]
  },
  {
    "industry": "Event & Wedding Venues",
    "name": "Inquiry Intake & Date Qualification",
    "description": "Funnels all email and form inquiries into n8n where Claude extracts names, preferred dates, guest counts, budget hints, and special requests. n8n checks venue calendars for availability and within minutes sends a personalized reply confirming the date or proposing alternatives with 2 tour time options—while logging all inquiries and conversion status in Airtable.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "GOOGLE_SERVICE_ACCOUNT_JSON"],
    "nodes": [
      {"name": "Gmail Trigger", "type": "n8n-nodes-base.gmailTrigger"},
      {"name": "Claude: Extract Inquiry Details", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "HTTP Request: Check Calendar Availability", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Log Inquiry", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Draft Availability Reply", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Personalized Reply", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Extract event type, preferred date, guest count, and budget signals from raw inquiry emails\n- Draft a warm, personalized availability reply proposing tour times and reflecting the couple's event details",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Send a test inquiry email with a wedding date request\n2. Verify Claude extracts date, guest count, and event type correctly\n3. Check Airtable for a new inquiry record\n4. Confirm personalized reply email arrives within 5 minutes",
    "problem_subheader": "Venues lose bookings because they reply too slowly",
    "problem_description": "Venues receive many email and phone inquiries but staff manually check availability calendars, leading to slow responses. Couples contact 4–6 venues simultaneously and commit to whichever replies first with a clear date-confirmed path—venues that respond in hours lose to ones that respond in minutes.",
    "reddit_title": "r/weddingplanning - We emailed 8 venues about our date. Only 2 responded within 24 hours. Booked one of them.",
    "reddit_comments": "112 comments",
    "metrics": [
      {"label": "Avg Venue Response Time", "value": "12–48 hrs"},
      {"label": "Booking Rate (Fast Response)", "value": "~35%"},
      {"label": "Booking Rate (Slow Response)", "value": "~8%"}
    ],
    "gtm": [
      {"channel": "Wedding Planner Partnerships", "desc": "Partner with local planners and coordinators who work across multiple venues and need faster availability checks."},
      {"channel": "Venue-Focused Web Designers", "desc": "Connect with web designers who build venue sites and can integrate the inquiry automation as a premium feature."},
      {"channel": "Bridal Show Presence", "desc": "Exhibit at Cincinnati and NKY bridal shows alongside venues to demonstrate the speed advantage."}
    ]
  },
  {
    "industry": "Event & Wedding Venues",
    "name": "Proposal & Contract Workflow",
    "description": "When an inquiry is qualified, n8n combines venue capacity, bar options, catering rules, and selected add-ons into a context bundle. Claude drafts a complete line-item proposal. If the client accepts, n8n generates a contract from the venue's template and sends it via e-signature—getting couples signed within the same business day.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "GOOGLE_SERVICE_ACCOUNT_JSON"],
    "nodes": [
      {"name": "Webhook Trigger: Inquiry Qualified", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Get Package Options", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Draft Proposal", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Proposal Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Client Accepts", "type": "n8n-nodes-base.webhook"},
      {"name": "Google Docs: Generate Contract", "type": "n8n-nodes-base.googleDocs"},
      {"name": "HTTP Request: Send E-Signature Link", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Update Event Record", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Draft a complete proposal with line-item pricing, inclusions, BYO conditions, and add-on options from venue data\n- Summarize contract terms in plain language for the client cover email",
    "python_tools": "- `google_docs_pdf.py` to export proposals as PDF attachments before emailing",
    "code_app": "Not required.",
    "test_plan": "1. Trigger a qualified inquiry webhook with event details and add-on selections\n2. Verify Claude produces a complete proposal with correct line-item pricing\n3. Confirm proposal email arrives with PDF attachment\n4. Simulate client acceptance and verify contract and e-signature link are generated",
    "problem_subheader": "Venue managers spend hours manually assembling each proposal",
    "problem_description": "Venue managers retype packages, pricing, add-ons, and policies into Word docs for each prospect. This slows the booking process, creates inconsistencies, and makes the venue look less professional than competitors who deliver polished proposals within the hour.",
    "reddit_title": "r/eventplanning - How long should it take a venue to send a contract after you say yes?",
    "reddit_comments": "78 comments",
    "metrics": [
      {"label": "Manual Proposal Time", "value": "1–3 hrs"},
      {"label": "Automated Proposal Time", "value": "<15 min"},
      {"label": "Same-Day Contract Rate", "value": "~85%"}
    ],
    "gtm": [
      {"channel": "Venue Web Designers", "desc": "Bundle the proposal engine with new venue website builds as a booking conversion upgrade."},
      {"channel": "Caterer & Photographer Referrals", "desc": "Partner with vendors who work across multiple venues and benefit from faster signed contracts."},
      {"channel": "NKY & Cincinnati Wedding Groups", "desc": "Share before/after proposal timelines in local wedding planning Facebook communities."}
    ]
  },
  {
    "industry": "Funeral Homes",
    "name": "First-Call Intake & Case Creation",
    "description": "Intake staff collect structured information via a guided form during the first call. n8n saves a complete case record to Airtable immediately, and Claude creates a concise summary with key decisions and next steps for the director—ensuring no details are lost during high-stress first conversations and eliminating repeated questions to grieving families.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Intake Form Submit", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Create Case Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Generate Director Summary", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Notify Director on Call", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Generate Task Checklist", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Convert raw intake form responses into a structured case summary highlighting service type, family preferences, and immediate next steps for the director\n- Flag incomplete fields or unusual circumstances requiring immediate attention",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test intake form with decedent information and service preferences\n2. Verify Airtable case record created with all fields populated\n3. Check that director notification email arrives with Claude-generated summary\n4. Confirm task checklist is generated based on service type",
    "problem_subheader": "First-call details get lost when families have to repeat themselves",
    "problem_description": "Funeral homes manage first calls manually, making families repeat information as it passes between intake staff and directors. During high-stress moments, critical details get missed—creating errors in a process where precision and compassion are both non-negotiable.",
    "reddit_title": "r/funeraldirector - What intake system do you use that actually captures everything on the first call?",
    "reddit_comments": "26 comments",
    "metrics": [
      {"label": "Avg First-Call Duration", "value": "20–35 min"},
      {"label": "Data Errors (Manual Intake)", "value": "~18%"},
      {"label": "Director Prep Time Saved", "value": "25 min/case"}
    ],
    "gtm": [
      {"channel": "Ohio Funeral Directors Association", "desc": "Present at OFDA events where technology adoption for operations is a growing topic among member homes."},
      {"channel": "Hospice & Hospital Liaisons", "desc": "Build relationships with hospice social workers who refer families and recommend technology-forward funeral homes."},
      {"channel": "FTC Compliance Consultants", "desc": "Partner with consultants who advise on funeral home compliance and can position intake automation as a risk reducer."}
    ]
  },
  {
    "industry": "Independent Pharmacies",
    "name": "Refill Synchronization & Adherence",
    "description": "Identifies patients with multiple chronic medications and proposes single-day pickup schedules aligning all refills into one monthly visit. Automated SMS reminders go out before the sync date. Staff call volume drops as patients stop calling about individual refills, and adherence improves because all medications arrive together on a predictable day.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    "nodes": [
      {"name": "Schedule Trigger: Daily Check", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "HTTP Request: Query Pharmacy System", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Code: Calculate Sync Date", "type": "n8n-nodes-base.code"},
      {"name": "Claude: Draft Sync Notification", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Send Sync SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Log Sync Schedule", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Generate patient-friendly notifications explaining the benefit of single-day pickup and the proposed new schedule\n- Flag patients with complex regimens where clinical pharmacist review is needed before syncing",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load 3 test patients with multiple refills on different dates\n2. Trigger the daily schedule and verify sync dates are calculated correctly\n3. Confirm SMS notifications sent with the proposed sync date and benefit explanation\n4. Verify high-risk combination patients are flagged for review",
    "problem_subheader": "Chronic patients pick up meds on 5 different days and still miss doses",
    "problem_description": "Independent pharmacies manually coordinate multiple refills per patient across different fill dates. Patients call repeatedly, staff spend hours on phone tag with insurers, and adherence suffers because medications arrive at different times—a problem med sync solves completely when automated.",
    "reddit_title": "r/pharmacy - Has anyone implemented med sync at an independent? What system do you use?",
    "reddit_comments": "43 comments",
    "metrics": [
      {"label": "Staff Call Reduction (Med Sync)", "value": "~40%"},
      {"label": "Adherence Improvement", "value": "+22%"},
      {"label": "Chronic Patient Retention", "value": "+15%"}
    ],
    "gtm": [
      {"channel": "Ohio Pharmacists Association", "desc": "Present at OPA and NCPA chapter meetings where med sync is recognized as a key independent pharmacy revenue driver."},
      {"channel": "FQHC & Clinic Partnerships", "desc": "Build relationships with local federally qualified health centers that co-manage chronic care patients with community pharmacies."},
      {"channel": "Pharmacy Software Vendors", "desc": "Partner with PMS vendors (PioneerRx, QS/1) to offer sync automation as an add-on for independent pharmacy clients."}
    ]
  },
  {
    "industry": "Independent Pharmacies",
    "name": "Prior Authorization & Paperwork Flow",
    "description": "Logs each prior authorization case with payer, drug, and key dates in Airtable. n8n tracks request and response stages, sends automated status updates to prescribers and patients, and flags any authorization that has gone silent past expected response times—eliminating the manual fax-queue tracking that delays specialty medication access.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: New PA Case", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Create PA Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Schedule Trigger: Daily Status Check", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Query Open PA Cases", "type": "n8n-nodes-base.airtable"},
      {"name": "IF: Past Expected Response Window", "type": "n8n-nodes-base.if"},
      {"name": "Claude: Draft Status Summary", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Notify Prescriber", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Twilio: Patient Status SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Draft plain-language status updates for prescribers and patients at each PA stage\n- Summarize overdue PA cases with payer name, days outstanding, and recommended escalation steps",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test PA case webhook with payer, drug, and prescriber details\n2. Verify Airtable record created with all required fields\n3. Trigger daily check and confirm overdue case is flagged after simulated delay\n4. Verify prescriber email and patient SMS arrive with correct status",
    "problem_subheader": "Prior auth requests disappear into the fax queue for weeks",
    "problem_description": "Specialty medication prior authorizations are handled via manual fax and email exchanges with no tracking system. Patients wait, prescribers don't know the status, and pharmacies have no way to proactively escalate stalled cases—resulting in delayed care and frustrated relationships across the board.",
    "reddit_title": "r/pharmacy - How do you track prior auth status across 30+ open cases without losing your mind?",
    "reddit_comments": "51 comments",
    "metrics": [
      {"label": "Avg PA Turnaround (Manual)", "value": "7–14 days"},
      {"label": "PA Delay Reduction (Tracked)", "value": "~35%"},
      {"label": "Prescriber Satisfaction Lift", "value": "+40%"}
    ],
    "gtm": [
      {"channel": "Specialty Clinic Partnerships", "desc": "Target specialty clinics generating many PAs and present the tracking system as a tool that improves their patient outcomes."},
      {"channel": "Pharmacy Benefits Consultants", "desc": "Work with PBM consultants who recommend operational tools to independent pharmacies."},
      {"channel": "State Pharmacy Association", "desc": "Present the PA tracking workflow at OPA conferences as a patient care and prescriber relationship tool."}
    ]
  },
  {
    "industry": "Law Firms",
    "name": "Client Intake Automation",
    "description": "New prospective clients complete a smart intake form. Claude produces a digestible case summary and identifies key legal issues for the attorney. An automated conflict check runs immediately; if clear, the matter is assigned to the appropriate partner and a preliminary response email is sent to the prospect—cutting intake time from hours to under 30 minutes.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "GOOGLE_SERVICE_ACCOUNT_JSON"],
    "nodes": [
      {"name": "Webhook Trigger: Intake Form", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Summarize Matter + Flag Issues", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "HTTP Request: Run Conflict Check", "type": "n8n-nodes-base.httpRequest"},
      {"name": "IF: Conflict Clear", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Create Matter Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Acknowledge to Prospect", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Notify Partner", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Summarize the matter in attorney-friendly language highlighting key facts, urgency signals, and relevant legal area\n- Flag potential issues or missing information the intake attorney should clarify",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test intake form for a business dispute\n2. Verify Claude summary identifies the correct practice area and key facts\n3. Confirm conflict check runs and IF branch routes correctly\n4. Check that prospect acknowledgment and partner notification both arrive",
    "problem_subheader": "Slow intake loses clients to the next firm on the list",
    "problem_description": "Business litigation and corporate firms handle new matters via phone and email with staff manually capturing details and running conflict checks—delaying responsiveness and losing clients who contact multiple firms simultaneously. The first firm to send a clear acknowledgment typically wins the engagement.",
    "reddit_title": "r/lawyers - What's your intake process for new business inquiries? How fast do you respond?",
    "reddit_comments": "58 comments",
    "metrics": [
      {"label": "Business Litigation Firms (Cincinnati)", "value": "250+"},
      {"label": "Intake Response Time (Manual)", "value": "4–24 hrs"},
      {"label": "Intake Response Time (Automated)", "value": "<30 min"}
    ],
    "gtm": [
      {"channel": "Legal Marketing Agencies", "desc": "Partner with legal marketing firms and CRM vendors serving Cincinnati/NKY firms who can bundle intake automation."},
      {"channel": "Cincinnati Bar Association CLEs", "desc": "Present at Bar Association practice management CLEs where efficiency tools are directly relevant."},
      {"channel": "Super Lawyers Directory Outreach", "desc": "Target business litigation and corporate firms on Super Lawyers and Best Lawyers directories for LinkedIn outreach."}
    ]
  },
  {
    "industry": "Law Firms",
    "name": "After-Hours Call Capture & Triage",
    "description": "When calls go unanswered after hours, an automatic SMS fires within 60 seconds asking for a brief description and urgency level. Claude classifies the response and immediately forwards genuine emergencies to on-call attorneys. Routine matters route to the next-day intake queue with a complete context summary—no cold starts in the morning.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Missed Call", "type": "n8n-nodes-base.webhook"},
      {"name": "Twilio: After-Hours SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: SMS Reply", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Classify Urgency", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "IF: Urgent Matter", "type": "n8n-nodes-base.if"},
      {"name": "Twilio: Alert On-Call Attorney", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Queue for Morning Intake", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Classify urgency of after-hours inquiries based on described situation (active dispute, injunction, regulatory deadline vs. general inquiry)\n- Draft a morning intake summary for each queued caller so attorneys start each day prepared",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Simulate a missed call webhook from a test number\n2. Verify after-hours SMS arrives within 60 seconds\n3. Reply with an urgent scenario and confirm on-call attorney SMS fires\n4. Reply with a routine matter and confirm it routes to morning queue in Airtable",
    "problem_subheader": "Business emergencies go to voicemail and the next firm answers",
    "problem_description": "Calls after 5pm go to voicemail. Clients facing active business disputes, injunctions, or regulatory deadlines don't wait—they call the next firm on the list. Law firms lose high-value emergency engagements simply because no one responded the same evening.",
    "reddit_title": "r/legaladvice - Called 4 law firms about a cease-and-desist. The one that called back at 8pm got my business.",
    "reddit_comments": "93 comments",
    "metrics": [
      {"label": "After-Hours Call Share", "value": "20–30%"},
      {"label": "Conversion (No Same-Night Response)", "value": "~5%"},
      {"label": "Conversion (Same-Evening Response)", "value": "~48%"}
    ],
    "gtm": [
      {"channel": "Legal Phone System Vendors", "desc": "Partner with legal phone system and answering service providers who can offer SMS triage as an upgrade."},
      {"channel": "Cincinnati Bar Association", "desc": "Present the after-hours capture system at Bar Association practice management events."},
      {"channel": "Legal Ops Consultants", "desc": "Work with legal ops consultants serving mid-size firms in Blue Ash, Mason, and Northern Kentucky."}
    ]
  },
  {
    "industry": "Legal, IP & Legaltech",
    "name": "IP Database & Alert Workspace",
    "description": "Periodically queries USPTO and trademark registries for terms linked to client portfolios. Claude flags potential conflicts, infringement opportunities, and renewal deadlines. Generates client-ready update summaries and Airtable dashboards, keeping IP attorneys and in-house teams informed without manual registry monitoring.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Schedule Trigger: Weekly", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "HTTP Request: USPTO API Query", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Code: Parse Registry Results", "type": "n8n-nodes-base.code"},
      {"name": "Claude: Flag Conflicts & Opportunities", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Airtable: Update IP Portfolio", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Client Update Email", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Analyze USPTO results for potential conflicts with existing client marks or patents\n- Identify renewal deadlines, opposition windows, and expansion opportunities in plain language for client reports",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Configure 3 test client terms in Airtable\n2. Trigger the weekly schedule and verify USPTO API query fires\n3. Confirm Claude returns conflict flags and deadline alerts\n4. Check that client update email arrives with correct IP status summary",
    "problem_subheader": "IP deadlines and conflicts get missed in manual registry monitoring",
    "problem_description": "IP firms tracking patents and trademarks rely on siloed spreadsheets and infrequent manual registry checks. Missed opposition windows and renewal deadlines cost clients thousands in lost rights and litigation exposure—entirely preventable with systematic weekly monitoring.",
    "reddit_title": "r/IPlaw - What tools do you use to monitor trademark registries for client conflicts?",
    "reddit_comments": "31 comments",
    "metrics": [
      {"label": "IP Firms in Cincinnati Area", "value": "50+"},
      {"label": "Avg Monitoring Cost (Manual)", "value": "$200–500/mo"},
      {"label": "Missed Deadlines (Manual)", "value": "~8% of portfolios"}
    ],
    "gtm": [
      {"channel": "Corporate Law Firm Partners", "desc": "Partner with Cincinnati corporate law firms that have IP practices and need a monitoring layer for client portfolios."},
      {"channel": "Manufacturing & Pharma In-House Legal", "desc": "Target in-house legal teams at Southwest Ohio manufacturers with large trademark/patent portfolios."},
      {"channel": "IP Bar Section Events", "desc": "Present at Cincinnati Bar IP section events as a practice efficiency and client service tool."}
    ]
  },
  {
    "industry": "Manufacturing Job Shops",
    "name": "RFQ Intake & Estimation Prep",
    "description": "Centralizes incoming RFQs from email and procurement portals. Claude extracts quantities, tolerances, materials, and delivery expectations from text and annotated PDFs, then feeds that data into machine-time and material calculators to produce draft quotes. Estimators receive pre-populated drafts for final review—cutting response time from days to hours.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Gmail Trigger", "type": "n8n-nodes-base.gmailTrigger"},
      {"name": "Code: Extract Attachment Text", "type": "n8n-nodes-base.code"},
      {"name": "Claude: Parse RFQ Specs", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Code: Apply Estimating Rules", "type": "n8n-nodes-base.code"},
      {"name": "Airtable: Create Quote Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Notify Estimator", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Extract quantities, materials, tolerances, finish requirements, and delivery expectations from RFQ text and PDF annotations\n- Identify ambiguous specs requiring clarification before accurate estimation can proceed",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Send a test RFQ email with a PDF describing a machined part\n2. Verify Claude extracts material, quantity, tolerance, and deadline correctly\n3. Check Airtable for new quote record with populated fields\n4. Confirm estimator notification email arrives with extracted specs",
    "problem_subheader": "Slow RFQ responses lose work to faster competitors",
    "problem_description": "Job shops receive RFQs with CAD drawings and specs via email daily. Estimators manually skim documents, extract specs, and approximate machining times before they can even begin pricing—a process taking 4–12 hours per quote that costs work to shops responding the same day.",
    "reddit_title": "r/Manufacturing - How do you speed up RFQ response time without hiring another estimator?",
    "reddit_comments": "62 comments",
    "metrics": [
      {"label": "RFQs Received/Month", "value": "20–60"},
      {"label": "Quote Response Time (Manual)", "value": "2–5 days"},
      {"label": "Quote Response Time (Automated)", "value": "<4 hrs"}
    ],
    "gtm": [
      {"channel": "MADE Chamber Events", "desc": "Present the RFQ automation at MADE Chamber and West Chester-Liberty events serving manufacturing employers."},
      {"channel": "ERP Vendor Partnerships", "desc": "Partner with ERP vendors serving Southwest Ohio job shops who can integrate the estimation prep tool."},
      {"channel": "Economic Development Agencies", "desc": "Work with local agencies that support manufacturing job shops and host technology peer-sharing events."}
    ]
  },
  {
    "industry": "Manufacturing Job Shops",
    "name": "Job Traveler & Status Updates",
    "description": "Generates a digital traveler record when each PO is released, including routing steps and due dates per work center. Operators update status via tablets. n8n aggregates progress and sends proactive customer status updates when delay risk is detected—eliminating reactive 'where's my order?' calls and building the on-time delivery reputation that wins long-term contracts.",
    "integrations": ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: PO Released", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Create Traveler Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Webhook Trigger: Work Center Update", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Update Job Status", "type": "n8n-nodes-base.airtable"},
      {"name": "IF: Delay Risk Detected", "type": "n8n-nodes-base.if"},
      {"name": "Mailgun: Proactive Customer Update", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Optional: Claude generates customer-facing delay explanations in professional language when delay flags trigger",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test PO webhook and verify traveler record created in Airtable with routing steps\n2. Update status at two work centers and confirm Airtable reflects changes\n3. Create a delay condition and verify customer notification email fires\n4. Confirm all routing steps update sequentially",
    "problem_subheader": "Customers call constantly because they have no order visibility",
    "problem_description": "Tracking work orders through cutting, machining, finishing, and inspection via paper travelers makes real-time status impossible. Customers call repeatedly; shop managers spend hours on status calls instead of floor management—and delays are discovered too late to communicate proactively.",
    "reddit_title": "r/Manufacturing - How do you give customers order status updates without manually checking the floor?",
    "reddit_comments": "37 comments",
    "metrics": [
      {"label": "Customer Status Calls/Week", "value": "10–25"},
      {"label": "On-Time Delivery (Paper System)", "value": "~72%"},
      {"label": "On-Time Delivery (Digital Traveler)", "value": "~88%"}
    ],
    "gtm": [
      {"channel": "CNC & Fabrication Shop Owners", "desc": "Target shops in Fairfield and Colerain industrial parks through direct outreach and shop floor demos."},
      {"channel": "OEM Procurement Teams", "desc": "Work through OEM procurement contacts who demand supplier visibility and can create pull for the system."},
      {"channel": "ACI Manufacturing Events", "desc": "Demo the status tracking system at Allied Construction Industries and Southwest Ohio manufacturing association events."}
    ]
  },
  {
    "industry": "Medical Clinics",
    "name": "New Patient Intake & Triage Automation",
    "description": "Replaces paper intake with secure mobile links sent at booking or via QR at walk-in check-in. Claude parses complaints and assigns urgency scores with structured fields. High-urgency cases are flagged to nursing staff via SMS immediately. For lower-urgency visits, a one-page clinical summary is generated and attached to the schedule line—saving clinicians 2–3 minutes per patient.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "SLACK_BOT_TOKEN"],
    "nodes": [
      {"name": "Webhook Trigger: Intake Form", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Parse Complaint + Assign Urgency", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "IF: High Urgency", "type": "n8n-nodes-base.if"},
      {"name": "Twilio: Alert Nursing Staff SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Slack: Notify Triage Slack Channel", "type": "n8n-nodes-base.slack"},
      {"name": "Airtable: Store Triage Data", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Generate Clinical Summary", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Attach Summary to Schedule", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Parse patient chief complaints and assign urgency scores based on symptom severity, duration, and described acuity\n- Generate structured one-page clinical summaries for physician review before each patient encounter",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test intake form with 'chest tightness for 2 days' as chief complaint\n2. Verify Claude assigns high urgency and nursing SMS fires within 60 seconds\n3. Submit a routine complaint and verify clinical summary is generated\n4. Check Airtable for properly stored triage record",
    "problem_subheader": "Front desks process intake paperwork moments before patients are roomed",
    "problem_description": "Overloaded front desks collect intake forms and summarize concerns minutes before clinicians see patients—missing red flags, slowing triage, and burning clinical staff time on pre-work that should be automated. In urgent care environments, this delay directly affects care quality and throughput.",
    "reddit_title": "r/medicine - How do you triage walk-in patients efficiently when the front desk is overwhelmed?",
    "reddit_comments": "76 comments",
    "metrics": [
      {"label": "Urgent Care Clinics (Area)", "value": "25+"},
      {"label": "Clinician Time Saved/Patient", "value": "2–3 min"},
      {"label": "High-Risk Flag Miss Rate (Manual)", "value": "~12%"}
    ],
    "gtm": [
      {"channel": "Healthcare IT Consultants", "desc": "Partner with Cincinnati IT firms (IT GOAT, Ingage Partners, LayerCake) that have healthcare clinic clients needing triage tools."},
      {"channel": "EHR Implementation Firms", "desc": "Work with local EHR implementation and billing companies who have trusted relationships with clinic administrators."},
      {"channel": "Urgent Care Network Outreach", "desc": "Target urgent care chains on Solv Health and UrgentCareMap in West Chester, Mason, and Fairfield with a 'triage time savings' pitch."}
    ]
  },
  {
    "industry": "Medical Clinics",
    "name": "No-Show Reduction & Waitlist Fill",
    "description": "Each day n8n reviews upcoming appointments and flags high-risk ones based on visit type and history. Patients receive 'confirm to keep your slot' SMS requiring a simple reply. A live waitlist of patients preferring specific times gets offers the moment a cancellation opens—maximizing clinician utilization and reducing wasted appointment slots.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    "nodes": [
      {"name": "Schedule Trigger: Daily", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Upcoming Appointments", "type": "n8n-nodes-base.airtable"},
      {"name": "IF: High No-Show Risk", "type": "n8n-nodes-base.if"},
      {"name": "Twilio: Confirmation SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 24 Hours", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Confirmed", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Query Waitlist", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: Offer Slot to Waitlist", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Classify appointment types and patient history patterns most associated with no-shows to improve risk targeting\n- Draft waitlist offer messages with appropriate urgency and clinic-specific details",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load test appointments including one behavioral health follow-up (high risk) into Airtable\n2. Trigger daily schedule and verify confirmation SMS fires for high-risk slot\n3. Simulate no confirmation after 24 hours and verify waitlist patient receives offer\n4. Track that confirmed appointments update correctly",
    "problem_subheader": "No-shows waste clinician time and delay care for waiting patients",
    "problem_description": "High no-show rates for follow-up visits waste clinician time and delay care for patients on waitlists. Manual confirmation calls are inconsistent and expensive—while the waitlist sits idle, unable to fill slots that were abandoned hours ago without automated notification.",
    "reddit_title": "r/medicine - What's your clinic's no-show rate and how do you manage it?",
    "reddit_comments": "64 comments",
    "metrics": [
      {"label": "Avg No-Show Rate (Clinics)", "value": "18–25%"},
      {"label": "No-Show Rate (With SMS Confirm)", "value": "~8%"},
      {"label": "Slot Fill Rate (Waitlist)", "value": "~70%"}
    ],
    "gtm": [
      {"channel": "Scheduling Software Vendors", "desc": "Partner with practice scheduling software vendors who can embed the AI waitlist engine as an add-on feature."},
      {"channel": "Behavioral Health Clinics", "desc": "Target behavioral health clinics with the highest no-show rates where this automation has the most measurable impact."},
      {"channel": "Urgent Care Directors", "desc": "Present the slot fill ROI to urgent care medical directors in Mason, West Chester, and Fairfield."}
    ]
  },
  {
    "industry": "Moving & Storage Companies",
    "name": "Estimate Requests & Job Scoping",
    "description": "Prospects submit inventory details or answer structured questions about square footage, bedrooms, stairs, and special items. Claude infers the required truck size, crew count, and approximate duration. n8n generates a tiered estimate and sends it via email and SMS, logging the lead in Airtable for follow-up—delivering a professional quote in 10 minutes without a single phone call.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Estimate Form", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Scope Job + Generate Estimate", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Airtable: Create Lead Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Email Estimate", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Twilio: Estimate SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 24 Hours", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Booked", "type": "n8n-nodes-base.if"},
      {"name": "Mailgun: Follow-Up Email", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Infer truck size, crew count, and job duration from inventory details and home characteristics\n- Draft tiered estimate copy (standard, premium) with clear inclusions and call to action",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test estimate form for a 3-bedroom house with stairs and a piano\n2. Verify Claude produces crew and truck size estimates\n3. Confirm estimate email and SMS arrive within 2 minutes\n4. Check Airtable lead record created with follow-up trigger queued",
    "problem_subheader": "Movers lose jobs to competitors who quote faster",
    "problem_description": "Moving companies manually estimate truck sizes and crews from unstructured phone calls, leading to over- or under-resourcing and slow responses. Homeowners comparison-shopping commit to the first company that sends a clear, professional estimate—making speed the primary competitive lever.",
    "reddit_title": "r/moving - Got quotes from 5 moving companies. One responded the same hour and had a detailed breakdown. I booked them.",
    "reddit_comments": "88 comments",
    "metrics": [
      {"label": "Moving Companies (Cincinnati Area)", "value": "50+"},
      {"label": "Quote Response Time (Manual)", "value": "1–3 days"},
      {"label": "Conversion Rate (Same-Hour Quote)", "value": "+35%"}
    ],
    "gtm": [
      {"channel": "Real Estate Agent Referrals", "desc": "Partner with real estate agents in Mason, West Chester, and Fairfield who constantly refer movers to relocating clients."},
      {"channel": "Apartment Complex Partnerships", "desc": "Connect with property managers at large apartment complexes who coordinate move-ins and move-outs year-round."},
      {"channel": "BBB Moving Directory Outreach", "desc": "Target movers with 4+ star BBB ratings in West Chester and Fairfield who have volume but slow estimate workflows."}
    ]
  },
  {
    "industry": "Moving & Storage Companies",
    "name": "Post-Move Follow-Up & Review Automation",
    "description": "When a move is marked complete, a feedback SMS goes out asking for a quick rating and comments. Positive responses receive a Google or BBB review link with Claude-written copy. Damage reports are summarized and routed to claims staff with photos attached. Satisfaction is tracked by city and crew—building the review volume that drives bookings in a word-of-mouth market.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Move Complete", "type": "n8n-nodes-base.webhook"},
      {"name": "Twilio: Feedback SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Rating Reply", "type": "n8n-nodes-base.webhook"},
      {"name": "IF: Rating 4-5 Stars", "type": "n8n-nodes-base.if"},
      {"name": "Claude: Draft Review Request", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Send Review Link", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Route Claim to Staff", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Log Outcome", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Draft warm, location-specific review request copy referencing the move details and suburb\n- Summarize damage reports in structured format for claims staff with key details extracted",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Trigger a move complete webhook with test customer details\n2. Verify feedback SMS arrives within 5 minutes\n3. Reply with a 5-star rating and confirm review link message is sent\n4. Reply with damage report and verify claims routing email fires with structured summary",
    "problem_subheader": "Movers rely on word-of-mouth but never systematically collect reviews",
    "problem_description": "Moving companies depend on Google and BBB reviews for new bookings, but technicians rarely ask and office teams don't follow up. Only frustrated customers with damage claims leave feedback unprompted—while satisfied customers move on without leaving a trace that helps the next family find the business.",
    "reddit_title": "r/moving - Just had an amazing move but I forgot to leave a review. The company never followed up.",
    "reddit_comments": "39 comments",
    "metrics": [
      {"label": "Reviews Left Without Prompt", "value": "~8%"},
      {"label": "Reviews Left With SMS Prompt", "value": "~32%"},
      {"label": "Damage Claim Resolution Time", "value": "2× faster"}
    ],
    "gtm": [
      {"channel": "Local SEO Agencies", "desc": "Partner with web and SEO agencies managing mover Google profiles who can resell review automation."},
      {"channel": "Moving Company Owner Forums", "desc": "Share the review funnel ROI in Moving Company Pro and Move for Hunger community groups."},
      {"channel": "BBB Directory Outreach", "desc": "Target movers in West Chester and Fairfield BBB listings who have inconsistent review counts despite good service."}
    ]
  },
  {
    "industry": "Music & Arts Schools",
    "name": "Lesson Scheduling & Studio Utilization",
    "description": "Collects teacher availability and room constraints (instrument type, sound bleed, equipment needs) from a central database. Auto-assigns lessons to rooms and time slots based on those constraints and student preferences—eliminating scheduling conflicts, filling underutilized rooms, and freeing admin staff from juggling spreadsheets.",
    "integrations": ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "GOOGLE_SERVICE_ACCOUNT_JSON"],
    "nodes": [
      {"name": "Webhook Trigger: New Enrollment", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Get Teacher Availability", "type": "n8n-nodes-base.airtable"},
      {"name": "Airtable: Get Room Constraints", "type": "n8n-nodes-base.airtable"},
      {"name": "Code: Match Student to Slot", "type": "n8n-nodes-base.code"},
      {"name": "Airtable: Book Lesson Slot", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Confirm to Family", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Notify Teacher", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Optional: Claude generates a welcome message to families referencing their child's instrument and assigned teacher",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Add a new enrollment webhook for a piano student with Tuesday/Thursday preference\n2. Verify available teacher and room are matched from Airtable\n3. Confirm lesson slot is booked and family/teacher confirmation emails arrive\n4. Test with conflicting availability to verify no double-booking occurs",
    "problem_subheader": "Empty rooms and overscheduled teachers happen at the same time",
    "problem_description": "Music and arts schools juggle teacher schedules and room allocations manually, creating a double problem: some rooms sit empty while others have conflicts, and some teachers are overbooked while available instructors have gaps. The result is frustrated families, underutilized space, and revenue left on the floor.",
    "reddit_title": "r/musicteachers - How do you schedule 20+ students across 8 teachers and 6 rooms without going insane?",
    "reddit_comments": "28 comments",
    "metrics": [
      {"label": "Room Utilization (Manual)", "value": "~60%"},
      {"label": "Room Utilization (Automated)", "value": "~85%"},
      {"label": "Scheduling Admin Time Saved", "value": "3–5 hrs/wk"}
    ],
    "gtm": [
      {"channel": "School Band Director Referrals", "desc": "Build relationships with school band and choir directors who refer students to private instruction and can recommend efficient schools."},
      {"channel": "Music Teacher Associations", "desc": "Present the scheduling tool at Ohio Music Education Association chapter meetings."},
      {"channel": "Chamber Directory Outreach", "desc": "Target music and arts schools in Mason Deerfield and West Chester-Liberty Chamber member directories."}
    ]
  },
  {
    "industry": "Music & Arts Schools",
    "name": "Tuition Billing & Attendance Management",
    "description": "Logs attendance versus contracted lessons for each student each month. Automatically adjusts invoices for missed and make-up lessons, and Claude generates a plain-language explanation of each change for the parent. Invoices send on a fixed schedule with clear breakdowns—reducing disputes and keeping cash flow predictable for school owners.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Lesson Attendance", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Update Attendance Log", "type": "n8n-nodes-base.airtable"},
      {"name": "Schedule Trigger: Monthly Billing", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Attendance vs Contract", "type": "n8n-nodes-base.airtable"},
      {"name": "Code: Calculate Invoice Adjustments", "type": "n8n-nodes-base.code"},
      {"name": "Claude: Write Invoice Explanation", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Itemized Invoice", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Write clear, friendly explanations of invoice adjustments that parents can understand without needing to call the school\n- Flag accounts with consistent missed lessons for the director's attention as potential churn signals",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Log attendance for a student who missed 2 sessions and had 1 make-up in a test month\n2. Trigger monthly billing and verify adjustments are calculated correctly\n3. Confirm Claude explanation references the specific missed and make-up lessons\n4. Check that invoice email arrives with itemized breakdown",
    "problem_subheader": "Billing disputes with parents about missed lessons eat admin time every month",
    "problem_description": "Music school billing that mixes contracted lessons, missed sessions, and make-ups is reconciled manually each month. Errors lead to parent disputes that consume admin time, damage relationships, and make cash flow unpredictable for owners who need clean monthly revenue.",
    "reddit_title": "r/musicteachers - How do you handle billing when students miss lessons and want credits?",
    "reddit_comments": "41 comments",
    "metrics": [
      {"label": "Billing Disputes/Month (Manual)", "value": "4–8"},
      {"label": "Billing Disputes (Automated)", "value": "~1"},
      {"label": "Admin Time Saved/Billing Cycle", "value": "2–4 hrs"}
    ],
    "gtm": [
      {"channel": "Music School Owner Communities", "desc": "Share the billing automation in music school owner Facebook groups and Music Teachers National Association forums."},
      {"channel": "Local CPA Referrals", "desc": "Partner with CPAs and bookkeepers who manage music school finances and recommend operational tools."},
      {"channel": "Studio Software Vendors", "desc": "Connect with lesson management software vendors who can integrate the billing automation into their platform."}
    ]
  },
  {
    "industry": "Nonprofit Membership Organizations",
    "name": "Membership Renewal & Dues Collection",
    "description": "Identifies members whose terms end soon, segmented by engagement level. Claude writes tailored renewal emails referencing each member's participation history—events attended, committees joined, benefits used. Reminders send at 60, 30, and 7 days out with easy payment links. Lapses trigger a final re-engagement message before the member is archived.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Schedule Trigger: Weekly", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Expiring Members", "type": "n8n-nodes-base.airtable"},
      {"name": "IF: Days Until Expiry", "type": "n8n-nodes-base.if"},
      {"name": "Claude: Draft Personalized Renewal", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Renewal Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Update Renewal Status", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Final Re-Engagement Email", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Write personalized renewal emails referencing specific member engagement history (events attended, committees, benefits used)\n- Generate lapse re-engagement messages with a compelling reason to return based on upcoming events or changes",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load a test member expiring in 30 days with 3 events attended into Airtable\n2. Trigger schedule and verify Claude email references the attended events\n3. Simulate 60-day reminder and confirm different message fires\n4. Mark as lapsed and confirm re-engagement email is sent",
    "problem_subheader": "Members churn simply because nobody reminded them in a personal way",
    "problem_description": "Business associations and nonprofits send generic renewal reminders that members ignore. High-value members who feel unrecognized for their participation don't renew—not because they've lost interest, but because the organization never acknowledged what they contributed.",
    "reddit_title": "r/nonprofit - How do you personalize membership renewal outreach without a dedicated staff person?",
    "reddit_comments": "47 comments",
    "metrics": [
      {"label": "Renewal Rate (Generic Reminder)", "value": "~55%"},
      {"label": "Renewal Rate (Personalized)", "value": "~75%"},
      {"label": "Staff Hours Saved/Renewal Cycle", "value": "8–12 hrs"}
    ],
    "gtm": [
      {"channel": "Chamber Executive Directors", "desc": "Target chamber executive directors at Cincinnati, Mason Deerfield, West Chester-Liberty, and Colerain chambers with a renewal rate ROI case."},
      {"channel": "Association Management Consultants", "desc": "Partner with association management companies serving regional nonprofits and chambers."},
      {"channel": "BNI Chapter Directors", "desc": "Connect with local BNI directors who run referral chapters and understand recurring-membership pain."}
    ]
  },
  {
    "industry": "Nonprofit Membership Organizations",
    "name": "Event Registration & Attendance Tracking",
    "description": "Centralizes registrations and payments for luncheons, expos, and classes into one Airtable table. Auto-generates check-in lists and name badges, sends reminders to registrants, and distributes materials and surveys post-event. Attendance is logged per member for engagement scoring that feeds back into renewal and sponsor reports.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "GOOGLE_SERVICE_ACCOUNT_JSON"],
    "nodes": [
      {"name": "Webhook Trigger: Registration", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Add to Event Roster", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Registration Confirmation", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Schedule Trigger: Day-Before Reminder", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Mailgun: Reminder + Logistics Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Check-In Scan", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Log Attendance", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Post-Event Materials + Survey", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Generate post-event survey follow-up copy tailored to the specific event type and sponsor acknowledgments\n- Summarize event attendance and engagement patterns for board reporting",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test registration webhook for a chamber luncheon\n2. Verify Airtable roster updated and confirmation email sent\n3. Trigger day-before reminder and confirm email arrives\n4. Simulate check-in scan and verify attendance logged\n5. Trigger post-event flow and confirm survey email arrives",
    "problem_subheader": "Chamber events run on scattered spreadsheets with no post-event follow-up",
    "problem_description": "Registration for member luncheons, expos, and workshops is handled in scattered systems. Check-in is manual, post-event follow-up is inconsistent, and leadership has no clear view of which members actually show up—making it impossible to prove event value to the board or improve future programs.",
    "reddit_title": "r/nonprofit - How do you track actual event attendance vs. registrations for your board reports?",
    "reddit_comments": "33 comments",
    "metrics": [
      {"label": "Events per Chamber/Year", "value": "20–40"},
      {"label": "Post-Event Survey Response (Manual)", "value": "~12%"},
      {"label": "Post-Event Survey Response (Automated)", "value": "~34%"}
    ],
    "gtm": [
      {"channel": "Event Venue Partnerships", "desc": "Partner with event venues and caterers tied to chambers who see recurring operational pain at every event."},
      {"channel": "Association Software Vendors", "desc": "Work with member management software vendors who serve regional nonprofits and chambers."},
      {"channel": "Chamber Staff Direct Outreach", "desc": "Target administrative staff at Cincinnati-area chambers through LinkedIn with a 'what's your check-in process' opener."}
    ]
  },
  {
    "industry": "Outpatient Therapy Clinics",
    "name": "Referral Intake & Benefits Check",
    "description": "Captures all referrals from fax, email, and HL7 channels. Claude extracts patient details, diagnosis, therapy type, and referring provider. n8n runs eligibility checks and logs co-pay and deductible info. A combined message goes to the patient: 'We received your referral and here is what your coverage looks like'—plus a scheduling link, reducing the time from referral to first appointment.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Gmail Trigger", "type": "n8n-nodes-base.gmailTrigger"},
      {"name": "Claude: Extract Referral Details", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "HTTP Request: Insurance Eligibility Check", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Code: Parse Coverage Response", "type": "n8n-nodes-base.code"},
      {"name": "Airtable: Create Referral Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Patient Welcome + Coverage", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Twilio: Patient Scheduling SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Extract patient name, diagnosis, therapy type, urgency, and referring provider from unstructured fax/email referral text\n- Translate raw insurance eligibility response into plain-language coverage summary for patient communication",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Send a test referral email with patient name, diagnosis, and insurance ID\n2. Verify Claude extracts all fields correctly\n3. Confirm eligibility check runs and coverage is parsed\n4. Check that patient email and SMS both arrive with coverage details and scheduling link",
    "problem_subheader": "Patients wait days after a referral before anyone contacts them",
    "problem_description": "PT, OT, and counseling clinics receive referrals via fax and email and manually check insurance eligibility before scheduling—a process that takes days and leaves patients confused about their coverage and next steps. The delay erodes referral relationships and frustrates patients who need care now.",
    "reddit_title": "r/physicaltherapy - My doctor sent a referral 2 weeks ago. The PT clinic still hasn't called me.",
    "reddit_comments": "95 comments",
    "metrics": [
      {"label": "Referral-to-Contact Time (Manual)", "value": "3–7 days"},
      {"label": "Referral-to-Contact Time (Automated)", "value": "<24 hrs"},
      {"label": "Patient No-Show (Slow Contact)", "value": "~35%"}
    ],
    "gtm": [
      {"channel": "Hospital Physician Liaison Teams", "desc": "Work with TriHealth and Mercy physician liaisons who want better referral closure metrics from community therapy partners."},
      {"channel": "PT Clinic Administrator Outreach", "desc": "Target outpatient PT and OT clinic administrators in Mason, West Chester, and Fairfield via LinkedIn with the referral delay ROI."},
      {"channel": "Employer Case Manager Networks", "desc": "Partner with employer case managers coordinating care for injured workers who need fast therapy access."}
    ]
  },
  {
    "industry": "Outpatient Therapy Clinics",
    "name": "Progress Note & Outcome Summaries",
    "description": "After each therapy session, clinicians answer 3–5 guided prompts. n8n stores the raw inputs and Claude assembles periodic summaries every 4–6 visits into concise progress notes and outcome reports for physicians and payers. Reports are delivered automatically at care milestones—cutting documentation time in half and improving the quality of payer-facing materials.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "GOOGLE_SERVICE_ACCOUNT_JSON"],
    "nodes": [
      {"name": "Webhook Trigger: Post-Session Prompts", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Store Session Notes", "type": "n8n-nodes-base.airtable"},
      {"name": "Code: Check Milestone Visit Count", "type": "n8n-nodes-base.code"},
      {"name": "IF: Milestone Reached", "type": "n8n-nodes-base.if"},
      {"name": "Claude: Assemble Progress Summary", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Google Docs: Generate Report", "type": "n8n-nodes-base.googleDocs"},
      {"name": "Mailgun: Send to Physician + Payer", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Convert 3–5 clinician prompt responses per session into structured progress notes in standard therapy documentation format\n- Assemble milestone summary reports with functional outcome measures formatted for physician and payer review",
    "python_tools": "- `google_docs_pdf.py` to export progress reports as PDFs before secure delivery to physicians",
    "code_app": "Not required.",
    "test_plan": "1. Submit post-session prompts for 6 visits for a test patient\n2. Verify milestone check triggers at visit 4 and 6\n3. Confirm Claude generates a complete progress summary from the session data\n4. Check that physician email arrives with PDF report attached",
    "problem_subheader": "Therapists spend more time documenting than treating",
    "problem_description": "Therapists write progress notes manually and compile outcome summaries for physicians and insurers by hand—consuming 30–45 minutes per documentation cycle that should go to patient care. In high-volume clinics, documentation backlog is the number one cause of clinician burnout.",
    "reddit_title": "r/physicaltherapy - How much time do you spend on documentation vs. treating? It's getting out of control.",
    "reddit_comments": "103 comments",
    "metrics": [
      {"label": "Documentation Time/Clinician/Day", "value": "1.5–2 hrs"},
      {"label": "Time Saved (AI-Assisted Notes)", "value": "~50%"},
      {"label": "Payer Report Turnaround (Manual)", "value": "5–10 days"}
    ],
    "gtm": [
      {"channel": "Utilization Review Firms", "desc": "Partner with utilization review and case management firms who need standardized therapy documentation from partner clinics."},
      {"channel": "PT/OT Continuing Education Events", "desc": "Demo the documentation tool at Ohio PT/OT association CE events where clinical efficiency is a top-of-mind concern."},
      {"channel": "EHR Consultants", "desc": "Work with EHR consultants serving outpatient therapy clinics in the Cincinnati metro area."}
    ]
  },
  {
    "industry": "Pest Control",
    "name": "Route & Service Coordination",
    "description": "Pulls all scheduled jobs for the next day from CRM, uses Google Maps to compute travel times, then asks Claude to assign optimized stop sequences per technician honoring time windows and priority flags. Crews receive morning SMS run sheets with live map links. As cancellations and new calls arrive during the day, n8n recalculates and pushes updated routes automatically.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"],
    "nodes": [
      {"name": "Schedule Trigger: Daily AM", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Tomorrow's Jobs", "type": "n8n-nodes-base.airtable"},
      {"name": "HTTP Request: Google Maps Distance Matrix", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Claude: Assign Optimized Routes", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Airtable: Write Route Plans", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: SMS Run Sheet to Each Tech", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Same-Day Change", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Rebalance Affected Routes", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Push Updated Schedule", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Assign optimized stop sequences per technician respecting time windows, priority customers, and service type duration flags\n- Generate driver-friendly SMS run sheets with concise stop descriptions and map links",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load 12 test stops with addresses and time windows into Airtable\n2. Trigger the AM schedule and verify Google Maps API call succeeds\n3. Confirm Claude produces distinct routes per tech with no time-window violations\n4. Simulate a cancellation webhook and verify the affected tech receives an updated SMS route",
    "problem_subheader": "Pest techs crisscross the city burning fuel on manual routes",
    "problem_description": "Pest control operators plan routes manually from a notebook or calendar rather than optimizing by geography and time windows. Inefficient routing turns into higher fuel costs, fewer stops per day, and missed same-day service promises—eating margin in a competitive local market where 1,200+ providers operate.",
    "reddit_title": "r/pestcontrol - How do you schedule 8 techs across 60+ jobs per day without route chaos?",
    "reddit_comments": "54 comments",
    "metrics": [
      {"label": "Pest Providers in Area", "value": "1,200+"},
      {"label": "Extra Stops/Day (Optimized)", "value": "2–3"},
      {"label": "Fuel Cost Reduction", "value": "15–25%"}
    ],
    "gtm": [
      {"channel": "Colerain Chamber Events", "desc": "Present route optimization at Colerain Chamber services-directory member lunches where pest operators network with contractors."},
      {"channel": "Property Manager Partnerships", "desc": "Connect with L & B Management and HOA property managers who coordinate pest vendors for communities and want reliable partners."},
      {"channel": "BBB Pest Directory Outreach", "desc": "Target regional pest firms with 10+ technicians in the BBB West Chester and Hamilton County directories."}
    ]
  },
  {
    "industry": "Pest Control",
    "name": "Follow-Up Reactivation & Review Automation",
    "description": "Weekly, n8n queries all customers whose last treatment was 90, 180, or 365 days ago. Claude generates brief messages customized by area and pest type. SMS goes out with a booking link; email includes an educational snippet. When jobs close, a same-day feedback SMS captures ratings—satisfied customers get a Google review link, and low ratings route to a manager immediately for recovery.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Schedule Trigger: Weekly", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Query Lapsed Customers", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Draft Reactivation Message", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Reactivation SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Educational Follow-Up Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Job Closed", "type": "n8n-nodes-base.webhook"},
      {"name": "Twilio: Feedback SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "IF: Rating 4-5 Stars", "type": "n8n-nodes-base.if"},
      {"name": "Claude: Draft Review Request", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Send Review Link", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Route Low Rating to Manager", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Draft localized reactivation messages referencing suburb, pest type, and seasonal context for each lapsed customer\n- Write city-specific review request copy that feels personal rather than automated",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load test customers with last treatment 95 and 185 days ago\n2. Trigger weekly schedule and verify correct message tier fires for each\n3. Simulate job close webhook and confirm feedback SMS arrives within 5 minutes\n4. Reply with 5-star rating and confirm review link is sent\n5. Reply with 2-star rating and verify manager routing email fires",
    "problem_subheader": "Recurring pest clients lapse quietly with no one noticing",
    "problem_description": "Quarterly or annual pest treatments are sold as ongoing service, but customers quietly lapse when nobody reaches out at the right time. Office teams lack capacity to run anniversary lists and send targeted reminders—leaking recurring revenue while competitors with better follow-up win back the same households.",
    "reddit_title": "r/pestcontrol - How do you keep recurring customers coming back without calling everyone individually?",
    "reddit_comments": "46 comments",
    "metrics": [
      {"label": "Lapsed Customer Recovery Rate", "value": "+22%"},
      {"label": "Google Reviews Left (With Prompt)", "value": "~32%"},
      {"label": "Google Reviews Left (Without Prompt)", "value": "~8%"}
    ],
    "gtm": [
      {"channel": "Residential Cleaning Cross-Referral", "desc": "Partner with MaidPro Mason and More Hands Cleaning who serve the same households and can cross-refer pest service."},
      {"channel": "Local SEO Agencies", "desc": "Work with agencies managing Google profiles for pest companies (Magnet Co, Helium SEO) who can resell review automation."},
      {"channel": "Franchise Pest Brand Outreach", "desc": "Target Orkin, Moxie, and Merlin franchise owners who have volume but inconsistent follow-up processes."}
    ]
  },
  {
    "industry": "Photography & Video Studios",
    "name": "Lead Pipeline & Shoot Delivery Automation",
    "description": "Incoming inquiries from email, DMs, and referrals feed into n8n. Claude identifies event type, date, location, and budget signals, then suggests 1–2 packages with an auto-reply and consult booking link. When gallery publishing completes post-shoot, n8n emails the gallery link. A few days later, Claude drafts a personalized review request referencing the event location and type.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Gmail Trigger", "type": "n8n-nodes-base.gmailTrigger"},
      {"name": "Claude: Classify Inquiry + Suggest Package", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Airtable: Log Lead", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Send Proposal Reply", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Gallery Published", "type": "n8n-nodes-base.webhook"},
      {"name": "Mailgun: Gallery Delivery Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 4 Days", "type": "n8n-nodes-base.wait"},
      {"name": "Claude: Draft Review Request", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Review Request SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Identify event type, date preference, location, and budget signals from raw inquiry text and suggest matching packages\n- Draft warm, location-specific review request copy referencing the specific event details",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Send a test inquiry email for a Mason wedding in June\n2. Verify Claude suggests 1–2 appropriate packages with pricing\n3. Trigger gallery published webhook and confirm delivery email arrives\n4. Simulate 4-day wait and confirm review request SMS fires",
    "problem_subheader": "Photography studios convert leads manually and forget to ask for reviews",
    "problem_description": "Studios receive inquiries via email, DMs, and referrals but match prospects to packages manually and respond hours or days later. After shoots, galleries are delivered with no systematic follow-up for testimonials—leaving word-of-mouth and referral revenue on the table in a business that runs almost entirely on trust.",
    "reddit_title": "r/weddingphotography - How do you handle the volume of inquiries during engagement season without missing any?",
    "reddit_comments": "57 comments",
    "metrics": [
      {"label": "Inquiry Response Time (Manual)", "value": "12–48 hrs"},
      {"label": "Conversion Rate (Same-Hour Reply)", "value": "+40%"},
      {"label": "Reviews Generated (With Prompt)", "value": "4× more"}
    ],
    "gtm": [
      {"channel": "Wedding Venue Partnerships", "desc": "Connect with Vinoklet Winery, Mulhauser Barn, and Madison Event Center who regularly refer photographers to booked couples."},
      {"channel": "Wedding Planner Referrals", "desc": "Build relationships with local wedding planners who manage vendor recommendations and appreciate well-organized photographers."},
      {"channel": "Photography Association Events", "desc": "Share the lead-to-delivery automation at Professional Photographers of Ohio chapter meetings."}
    ]
  },
  {
    "industry": "Residential Property Management",
    "name": "Maintenance Request Intake & Dispatch",
    "description": "All tenant maintenance messages from email, phone, and portal funnel into one queue. Claude extracts unit, issue type, and urgency level, then assigns tasks to in-house staff or the appropriate vendor list with expected timelines. Tenants receive automated status updates and completion confirmations—eliminating manual dispatch and reducing the frustrated follow-up calls that drain property manager time.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Gmail Trigger", "type": "n8n-nodes-base.gmailTrigger"},
      {"name": "Claude: Extract Issue + Assign Urgency", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "IF: Emergency", "type": "n8n-nodes-base.if"},
      {"name": "Twilio: Emergency Alert to Manager", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Create Work Order", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Assign to Vendor", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Twilio: Tenant Acknowledgment SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Job Complete", "type": "n8n-nodes-base.webhook"},
      {"name": "Twilio: Tenant Completion SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Extract unit number, issue type, urgency, and any safety flags from unstructured tenant maintenance messages\n- Draft tenant acknowledgment and vendor assignment messages in appropriate tone",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Send a test maintenance email with 'no hot water in unit 204'\n2. Verify Claude extracts unit and issue type correctly\n3. Confirm plumber vendor assignment email and tenant acknowledgment SMS both fire\n4. Trigger job complete webhook and verify tenant completion SMS is sent",
    "problem_subheader": "Tenants submit requests and never hear back for days",
    "problem_description": "Small-to-mid-size property managers receive maintenance requests via email, phone, and portal simultaneously. Triage is manual, urgent issues get lost in inboxes, and tenants call repeatedly to check status—eroding satisfaction scores, increasing churn, and consuming manager time that should go to proactive management.",
    "reddit_title": "r/PropertyManagement - What's your system for triaging maintenance requests when you manage 200+ units?",
    "reddit_comments": "74 comments",
    "metrics": [
      {"label": "Tenant Satisfaction Driver", "value": "#1: Maintenance Speed"},
      {"label": "Response Time (Manual)", "value": "1–3 days"},
      {"label": "Response Time (Automated)", "value": "<2 hrs"}
    ],
    "gtm": [
      {"channel": "Contractor Vendor Network", "desc": "Partner with electricians, plumbers, and roofers from Colerain Chamber directories who benefit from organized work orders."},
      {"channel": "iPropertyManagement Directory", "desc": "Target Southwest Ohio property management firms listed in iPropertyManagement rankings for direct outreach."},
      {"channel": "HOA Management Associations", "desc": "Present the dispatch system at Community Associations Institute Ohio chapter events."}
    ]
  },
  {
    "industry": "Residential Property Management",
    "name": "Vacancy Marketing & Applicant Tracking",
    "description": "When a move-out is scheduled, automatically publishes updated listings across Zillow and Apartments.com. Inquiries from all platforms flow into a single Airtable applicant pipeline. Claude generates quick applicant summaries covering income signals, pet status, and risk factors. Each applicant moves through stages from inquiry to screening to lease signing—with no manual copy-pasting between platforms.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Move-Out Scheduled", "type": "n8n-nodes-base.webhook"},
      {"name": "HTTP Request: Publish to Zillow", "type": "n8n-nodes-base.httpRequest"},
      {"name": "HTTP Request: Publish to Apartments.com", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: New Inquiry", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Create Applicant Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Generate Applicant Summary", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Inquiry Acknowledgment", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Track Stage Progress", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Generate concise applicant summaries from inquiry text covering income signals, household composition, pet status, and preliminary risk indicators\n- Draft vacancy listing copy optimized for Zillow and Apartments.com based on unit details",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Trigger a move-out webhook for a 2BR unit and verify listings are published to both platforms\n2. Submit a test inquiry and verify Airtable applicant record is created\n3. Confirm Claude summary is generated and attached to the record\n4. Verify acknowledgment email arrives for the test inquiry",
    "problem_subheader": "Vacancies sit unfilled while inquiries pile up across 4 platforms",
    "problem_description": "Property managers advertise vacant units inconsistently across platforms and track inquiries in spreadsheets. Applicants from Zillow, Apartments.com, phone, and email are hard to consolidate—and without a clear pipeline view, promising applicants fall through the cracks while units generate no rent.",
    "reddit_title": "r/PropertyManagement - How do you track applicants from multiple platforms without constantly switching tabs?",
    "reddit_comments": "59 comments",
    "metrics": [
      {"label": "Avg Days Vacant (Manual)", "value": "21–35 days"},
      {"label": "Avg Days Vacant (Automated)", "value": "10–15 days"},
      {"label": "Revenue Per Vacancy Day", "value": "$40–120"}
    ],
    "gtm": [
      {"channel": "Real Estate Attorney Referrals", "desc": "Partner with real estate attorneys in Cincinnati and West Chester who advise on lease language and recommend operational tools."},
      {"channel": "Property Investor Networks", "desc": "Present the vacancy system at Cincinnati REIA and local investment clubs where owners outsource management."},
      {"channel": "L & B Management Network", "desc": "Connect with L & B Management's network of HOA communities and single-family rental owners in target suburbs."}
    ]
  },
  {
    "industry": "Real Estate Agencies",
    "name": "Lead Capture & Enrichment",
    "description": "Connects to Zillow, Realtor.com, Facebook Ads, and phone systems. Every new contact is captured instantly and enriched with property history, estimated equity, and basic financial indicators. Claude produces a short buyer or seller profile and auto-triggers an intro SMS or email tailored to that profile—turning shallow name-and-phone leads into context-rich prospects before the agent makes a single call.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: New Lead", "type": "n8n-nodes-base.webhook"},
      {"name": "HTTP Request: Enrich via Property API", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Claude: Generate Lead Profile", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Airtable: Save Enriched Lead", "type": "n8n-nodes-base.airtable"},
      {"name": "IF: Seller Signal", "type": "n8n-nodes-base.if"},
      {"name": "Twilio: Seller Intro SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Buyer Intro Email", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Generate a concise lead profile identifying buyer vs. seller signals, likely motivation, and recommended initial outreach approach\n- Draft personalized intro messages that reflect the lead's likely situation rather than generic 'can I help you buy or sell' copy",
    "python_tools": "- `apify_runner.py` to scrape Zillow and Realtor.com property data for lead enrichment when API access is limited",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test lead webhook from Zillow with a Mason, OH address\n2. Verify property API enrichment call completes\n3. Confirm Claude generates a profile with buyer/seller signal classification\n4. Check that appropriate intro SMS or email fires based on the IF branch",
    "problem_subheader": "Agents manually copy shallow leads from 4 platforms into spreadsheets",
    "problem_description": "Agents copy leads from Zillow, Realtor.com, Facebook, and voicemails into spreadsheets with no context beyond a name and phone number. Time spent profiling each lead before outreach is time not spent selling—while hot leads go cold because enrichment and personalization happen too slowly.",
    "reddit_title": "r/realestate - What's your workflow for handling leads from Zillow, Realtor.com, and Facebook at the same time?",
    "reddit_comments": "86 comments",
    "metrics": [
      {"label": "Mason Population Growth (Since 2020)", "value": "+22%"},
      {"label": "Lead Enrichment Time (Manual)", "value": "15–30 min"},
      {"label": "Lead Response Speed Lift", "value": "10× faster"}
    ],
    "gtm": [
      {"channel": "Mortgage Broker Partnerships", "desc": "Partner with mortgage brokers and title companies who want better-qualified leads and can sponsor automation for preferred agents."},
      {"channel": "CRM Vendor Co-Marketing", "desc": "Work with FollowUpBoss and HubSpot partners serving Cincinnati-area real estate teams to offer the enrichment layer."},
      {"channel": "Brokerage Team Leader Outreach", "desc": "Target team-based brokerages in Mason, West Chester, and Fairfield on LinkedIn with a 'how many leads died waiting' opener."}
    ]
  },
  {
    "industry": "Real Estate Agencies",
    "name": "Dead Lead Re-Engagement",
    "description": "Identifies leads with no contact in 6–12 months. Uses MLS data to detect relevant market changes—price drops in preferred neighborhoods, new school ratings, development approvals. Claude writes short, data-driven re-engagement messages referencing the specific change. Engaged leads automatically re-enter active pipelines; non-responders get a final message before archiving.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Schedule Trigger: Weekly", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Query Inactive Leads", "type": "n8n-nodes-base.airtable"},
      {"name": "HTTP Request: MLS Market Data", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Claude: Draft Re-Engagement Message", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Re-Engagement Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 5 Days", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Response Received", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Reactivate to Pipeline", "type": "n8n-nodes-base.airtable"},
      {"name": "Airtable: Archive Non-Responder", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Draft market-data-driven re-engagement messages that reference specific neighborhood price changes or development news relevant to each lead's prior preferences\n- Score lead responses to flag those showing renewed buying intent for agent follow-up",
    "python_tools": "- `apify_runner.py` to scrape Zillow and Realtor.com for price change data in leads' preferred neighborhoods",
    "code_app": "Not required.",
    "test_plan": "1. Load 5 test leads inactive for 8 months with preferred suburb noted\n2. Trigger weekly schedule and verify MLS data is fetched for those suburbs\n3. Confirm Claude generates market-data-referenced messages for each lead\n4. Simulate a reply and verify lead is reactivated to pipeline in Airtable",
    "problem_subheader": "Stale databases full of leads who are NOW ready but nobody noticed",
    "problem_description": "Old leads from renters, prior buyers, and 'just looking' prospects sit idle in CRM databases. Many are now ready due to changed circumstances—new jobs, growing families, market shifts—but no trigger exists to reach out at the right moment, leaving thousands of potential commissions dormant.",
    "reddit_title": "r/realestate - How do you re-engage old leads that went cold 12 months ago? Or do you just give up?",
    "reddit_comments": "72 comments",
    "metrics": [
      {"label": "Dead Leads in Avg Team CRM", "value": "500–2,000"},
      {"label": "Re-Engagement Rate (Generic)", "value": "~3%"},
      {"label": "Re-Engagement Rate (Market Data)", "value": "~12%"}
    ],
    "gtm": [
      {"channel": "Real Estate Coaches", "desc": "Partner with local real estate coaches and CRM consultants who already advise agents and want a database reactivation tool."},
      {"channel": "Team Leader LinkedIn Outreach", "desc": "Target team leaders at large suburban brokerages who have the biggest stale databases and the most to gain."},
      {"channel": "KW & RE/MAX Mastermind Groups", "desc": "Present the re-engagement system in Cincinnati KW and RE/MAX team mastermind groups."}
    ]
  },
  {
    "industry": "Residential Cleaning Services",
    "name": "Lead Capture & Instant Estimate",
    "description": "On form submission or call log entry, n8n collects available details and applies standard pricing tables to generate one-time and recurring options. A clear, friendly estimate arrives via SMS and email within 3 minutes—with an online scheduling link. Leads that don't book within 24 hours receive a single follow-up before being archived.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Inquiry Form", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Infer Home Type + Apply Pricing", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Airtable: Create Lead Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Email Estimate", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Twilio: SMS Estimate", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 24 Hours", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Booked", "type": "n8n-nodes-base.if"},
      {"name": "Mailgun: Follow-Up Email", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Infer missing home details (townhome vs. single-family, approx square footage) from address and form notes to complete pricing\n- Draft friendly estimate copy with one-time and recurring options that feel personalized rather than template-generated",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test inquiry for a Mason, OH address with 3 bedrooms noted\n2. Verify Claude infers home type and applies correct pricing tier\n3. Confirm estimate email and SMS arrive within 3 minutes\n4. Simulate 24-hour no-booking and verify follow-up email fires",
    "problem_subheader": "Cleaning inquiries go cold while owners are out on jobs",
    "problem_description": "Residential cleaning services in Mason, West Chester, and Fairfield get inquiries via web forms, phone, and Facebook—but owners manually estimate pricing and respond hours or days later. Homeowners asking 3 competing cleaners commit to the first one with a clear price and easy booking link.",
    "reddit_title": "r/HomeImprovement - Got quotes from 4 cleaning companies. Only one responded the same day. Booked them.",
    "reddit_comments": "69 comments",
    "metrics": [
      {"label": "Cleaners in Local Area", "value": "200+"},
      {"label": "Lead Response Time (Manual)", "value": "4–24 hrs"},
      {"label": "Booking Conversion (3-Min Quote)", "value": "+38%"}
    ],
    "gtm": [
      {"channel": "Realtor & Property Manager Referrals", "desc": "Partner with realtors and L & B Management who need make-ready cleans and refer cleaning services to new homeowners."},
      {"channel": "Cleaning Franchise Networks", "desc": "Approach MaidPro and MaidThis franchise owners who have volume but inconsistent lead response processes."},
      {"channel": "BNI Chapter Membership", "desc": "Join local BNI chapters where cleaners, organizers, and home-service pros cross-refer clients."}
    ]
  },
  {
    "industry": "Residential Cleaning Services",
    "name": "Route Planning & Crew Scheduling",
    "description": "Compiles daily jobs with addresses and time windows, clusters stops by area (Mason/Deerfield, West Chester/Liberty, Fairfield/Hamilton), and generates optimized crew run sheets each morning. Crews receive SMS with their stop sequence. As clients reschedule or cancel, routes are adjusted and updated SMS messages are pushed—fitting 2–3 more homes into every day without adding headcount.",
    "integrations": ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"],
    "nodes": [
      {"name": "Schedule Trigger: Daily AM", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Today's Jobs", "type": "n8n-nodes-base.airtable"},
      {"name": "HTTP Request: Google Maps Distance Matrix", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Code: Cluster by Area + Sequence", "type": "n8n-nodes-base.code"},
      {"name": "Airtable: Write Route Assignments", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: SMS Run Sheet to Crew Lead", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- None required for core routing; Claude can optionally generate crew-friendly natural-language run sheets from stop data",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load 15 test jobs across Mason, West Chester, and Fairfield into Airtable\n2. Trigger AM schedule and verify Google Maps clustering runs\n3. Confirm each crew lead receives a distinct SMS with their stop sequence\n4. Simulate a cancellation and verify affected crew gets updated SMS",
    "problem_subheader": "Cleaning crews zig-zag across the city burning drive time between jobs",
    "problem_description": "Cleaning business owners manually build daily crew routes, often sending teams from Mason to Fairfield to West Chester and back. Long drive times between stops reduce the number of homes serviced per day—directly cutting revenue without any corresponding reduction in labor cost.",
    "reddit_title": "r/cleaningbusiness - How do you build daily routes for 3 crews without it taking an hour every morning?",
    "reddit_comments": "43 comments",
    "metrics": [
      {"label": "Extra Homes/Day (Optimized Routes)", "value": "2–3"},
      {"label": "Drive Time Reduction", "value": "20–30%"},
      {"label": "Fuel Cost Savings/Month", "value": "$150–400"}
    ],
    "gtm": [
      {"channel": "Cleaning Business Facebook Groups", "desc": "Share the route optimization case study in Cleaning Business Owners and House Cleaning Business Tips Facebook communities."},
      {"channel": "Pressure Washing Cross-Referral", "desc": "Partner with Renewing Power Wash (West Chester, Mason, Fairfield) and similar exterior cleaning firms with identical routing needs."},
      {"channel": "Maid Franchise Owner Events", "desc": "Present the routing tool at MaidPro and Molly Maid franchise owner regional meetings."}
    ]
  },
  {
    "industry": "Restaurants & Food Service",
    "name": "Reservation Handling & Table Optimization",
    "description": "Pulls all reservations from Google Maps, Yelp, OpenTable, and phone into one queue. Claude suggests optimal table assignments by time, factoring party size and preferences. Confirmations and 2-hour reminders with parking details go out automatically. Walk-in wait estimates adjust dynamically based on current occupancy—turning a fragmented host stand into a coordinated front-of-house operation.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: New Reservation", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Add to Reservation Queue", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Suggest Table Assignment", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Confirmation SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Schedule Trigger: 2-Hour Reminder", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Twilio: Reminder SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Party Seated", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Update Occupancy", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Suggest optimal table assignments based on party size, stated preferences, and current floor plan layout\n- Generate dynamic wait time estimates for the host stand based on current reservation and occupancy data",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test reservation webhook from a simulated Yelp source with party of 6\n2. Verify Claude suggests an appropriate table assignment\n3. Confirm SMS confirmation arrives within 2 minutes\n4. Trigger 2-hour reminder schedule and verify reminder SMS fires with parking info",
    "problem_subheader": "Host stands juggle 4 reservation platforms and still double-book tables",
    "problem_description": "Restaurants receive reservations from Google Maps, Yelp, OpenTable, and phone calls—managed manually on the host stand. The result is overbooking, frustrated guests, and empty tables during peak hours because walk-in management isn't coordinated with the reservation pipeline.",
    "reddit_title": "r/KitchenConfidential - How do you handle reservations from 4 different platforms without constantly double-booking?",
    "reddit_comments": "81 comments",
    "metrics": [
      {"label": "Reservation Sources per Restaurant", "value": "3–5"},
      {"label": "No-Show Rate (No Reminder)", "value": "~22%"},
      {"label": "No-Show Rate (SMS Reminder)", "value": "~8%"}
    ],
    "gtm": [
      {"channel": "Restaurant POS Resellers", "desc": "Partner with POS resellers serving independents in Mason, West Chester, and Fairfield who can bundle reservation management."},
      {"channel": "Restaurant Web Design Firms", "desc": "Connect with web agencies that build restaurant sites and can integrate the reservation flow as a premium feature."},
      {"channel": "Local Restaurant Association", "desc": "Present at Ohio Restaurant Association regional chapter events focused on operational efficiency for independents."}
    ]
  },
  {
    "industry": "Restaurants & Food Service",
    "name": "Delivery Platform POS Integration",
    "description": "Configures webhooks for each delivery platform (DoorDash, Uber Eats, direct ordering). n8n captures orders in real-time and Claude normalizes item names to match POS PLUs. Orders push directly into the kitchen queue, inventory decrements automatically, and supplier alerts trigger when stock falls below threshold—eliminating manual re-entry and the errors and mis-fires it causes.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"],
    "nodes": [
      {"name": "Webhook Trigger: DoorDash Order", "type": "n8n-nodes-base.webhook"},
      {"name": "Webhook Trigger: Uber Eats Order", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Normalize to POS PLUs", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "HTTP Request: Push to POS Kitchen Queue", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Decrement Inventory", "type": "n8n-nodes-base.airtable"},
      {"name": "IF: Low Stock Alert", "type": "n8n-nodes-base.if"},
      {"name": "Twilio: Alert Manager Low Stock", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Map delivery platform item names to correct POS PLU codes, handling naming variations across platforms\n- Generate plain-language supplier alert messages when stock falls below configured thresholds",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Send a simulated DoorDash webhook with 3 menu items\n2. Verify Claude maps item names to correct POS PLUs\n3. Confirm HTTP request to POS returns 200 and kitchen queue is updated\n4. Set inventory below threshold for one item and verify manager SMS fires",
    "problem_subheader": "Delivery orders require manual re-entry into the POS every time",
    "problem_description": "Orders from DoorDash, Uber Eats, and direct channels require manual re-entry into the POS kitchen system—creating errors, mis-fires, and delayed kitchen operations during peak hours. Staffing shortages make it impossible to have someone dedicated to re-keying orders that should flow automatically.",
    "reddit_title": "r/KitchenConfidential - DoorDash tablet to POS re-entry is killing us on Friday nights. Any solutions?",
    "reddit_comments": "97 comments",
    "metrics": [
      {"label": "Order Entry Errors (Manual)", "value": "~6%"},
      {"label": "Order Entry Errors (Automated)", "value": "~0.5%"},
      {"label": "Kitchen Speed Improvement", "value": "3–5 min/order"}
    ],
    "gtm": [
      {"channel": "POS Integrator Partnerships", "desc": "Partner with local POS integrators and delivery-app onboarding consultants who work with restaurant tech stacks."},
      {"channel": "Ghost Kitchen Operators", "desc": "Target ghost kitchen and multi-concept operators in Fairfield and Mason who run the highest delivery volumes."},
      {"channel": "Beverage Distributor Introductions", "desc": "Connect with beverage distributors who already have trusted relationships with restaurant owners and can introduce technology tools."}
    ]
  },
  {
    "industry": "Roofing Contractors",
    "name": "Storm-Triggered Outreach Campaign",
    "description": "Monitors weather feeds for hail or high winds exceeding thresholds in specific ZIP codes. When a storm event triggers, n8n queries the CRM for homeowners in impacted neighborhoods. Claude drafts localized emails referencing the specific subdivision and damage indicators. The campaign fires within 24 hours with an online inspection scheduling link and crew routes optimized for the affected area.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"],
    "nodes": [
      {"name": "Schedule Trigger: Weather Check", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "HTTP Request: Weather API", "type": "n8n-nodes-base.httpRequest"},
      {"name": "IF: Storm Threshold Exceeded", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Get Homeowners in Affected ZIPs", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Draft Storm Campaign Email", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Mailgun: Send Campaign", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Twilio: Storm Alert SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Draft localized storm outreach emails referencing the specific subdivision, storm event date, and common damage indicators for the area\n- Adjust tone and urgency based on storm severity (hail size, wind speed) for more impactful outreach",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Inject a test weather API response with hail over 0.75 inches in a Mason ZIP\n2. Verify IF branch triggers and Airtable query returns homeowners in that ZIP\n3. Confirm Claude email references the subdivision name and storm details\n4. Check that email and SMS campaigns fire within 10 minutes of the test trigger",
    "problem_subheader": "Roofing companies wait for calls after storms while competitors book all the inspections",
    "problem_description": "Roofing companies reactively wait for homeowners to call after hail or wind storms. Competitors who proactively reach affected neighborhoods within 24 hours capture inspection schedules first—leaving late responders with the homeowners who got 3 competing estimates before calling them.",
    "reddit_title": "r/Roofing - We had a major hail event last week. How do you get to homeowners before other roofers?",
    "reddit_comments": "74 comments",
    "metrics": [
      {"label": "Storm Events/Year (Cincinnati)", "value": "15–25"},
      {"label": "Inspections Won (24hr Outreach)", "value": "+45%"},
      {"label": "Avg Storm Job Value", "value": "$8,000–18,000"}
    ],
    "gtm": [
      {"channel": "Insurance Agent Partnerships", "desc": "Partner with insurance agents who want rapid inspections for claims and can recommend your storm-response system to policyholders."},
      {"channel": "BBB & Angi Roofing Listings", "desc": "Target roofing contractors in BBB and Angi listings for Greater Cincinnati who lack storm outreach processes."},
      {"channel": "Local Web Agency Bundles", "desc": "Work with Skynet Technologies, Genesis Web Studio, and BigOrange Marketing to bundle storm campaigns into roofing website packages."}
    ]
  },
  {
    "industry": "Roofing Contractors",
    "name": "Canvass Lead Follow-Up Engine",
    "description": "Imports canvassing lists with names, addresses, and field notes after neighborhood door-knocking. Sends SMS to each contact referencing the conversation and offering a specific inspection time. Confirmed visits trigger automated crew route assignments. Reminders fire 2 hours before each appointment to reduce no-shows on the inspection day.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    "nodes": [
      {"name": "Webhook Trigger: Canvass List Import", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Store Canvass Leads", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Draft Personalized Follow-Up SMS", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: Send Follow-Up SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Reply Received", "type": "n8n-nodes-base.webhook"},
      {"name": "IF: Inspection Confirmed", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Log Confirmed Inspection", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: Day-Of Reminder SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Draft personalized follow-up SMS copy referencing the specific subdivision, canvass conversation notes, and proposed inspection time window\n- Generate appointment confirmation messages in a professional tone that builds credibility",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Import a test canvass list with 5 contacts and field notes\n2. Verify Claude drafts distinct SMS messages for each based on their notes\n3. Simulate a 'YES' reply and confirm inspection is logged and confirmation SMS fires\n4. Trigger day-of reminder for the confirmed inspection",
    "problem_subheader": "Canvass lists sit on clipboards with no systematic follow-up",
    "problem_description": "After storms or neighborhood canvassing, roofers collect dozens of addresses and phone numbers but don't consistently follow up via SMS to convert interest into booked inspections. Manual dialing is slow, inconsistent, and stops when crews get busy—letting warm canvass leads go cold within 48 hours.",
    "reddit_title": "r/Roofing - What's your follow-up process after neighborhood canvassing? We're losing leads we already knocked.",
    "reddit_comments": "48 comments",
    "metrics": [
      {"label": "Canvass Lead Conversion (Manual)", "value": "~8%"},
      {"label": "Canvass Lead Conversion (SMS Followup)", "value": "~22%"},
      {"label": "Avg Inspection-to-Close Rate", "value": "~55%"}
    ],
    "gtm": [
      {"channel": "Public Adjuster Partnerships", "desc": "Partner with public adjusters and restoration companies who want reliable roofing partners with organized inspection pipelines."},
      {"channel": "Roofing Sales Trainer Networks", "desc": "Present the canvass follow-up system in roofing sales training communities where contractors pay for lead conversion tactics."},
      {"channel": "Storm Restoration Associations", "desc": "Connect with National Roofing Contractors Association Ohio chapter members after major weather events."}
    ]
  },
  {
    "industry": "Salons & Spas",
    "name": "Booking & Schedule Orchestration",
    "description": "Standardizes booking inputs from all channels—phone, text, social DMs, and online forms—into one n8n queue. Claude suggests optimal staff and room assignments based on service duration and skill requirements. n8n checks calendars, selects slots, sends SMS confirmations, and maintains a live schedule view for owners—eliminating double-bookings and idle gaps between appointments.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Gmail Trigger", "type": "n8n-nodes-base.gmailTrigger"},
      {"name": "Webhook Trigger: DM/Form Booking", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Match to Stylist + Slot", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Airtable: Check Calendar Availability", "type": "n8n-nodes-base.airtable"},
      {"name": "Airtable: Book Appointment", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: Confirmation SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Schedule Trigger: 24hr Reminder", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Twilio: Reminder SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Match service requests to the correct stylist or treatment room based on service type, duration, and skill requirements\n- Draft personalized confirmation and reminder messages that feel like they came from a real person",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test booking request via email for a balayage with a specific stylist\n2. Verify Claude identifies correct stylist and checks calendar availability\n3. Confirm Airtable shows the booking and client receives confirmation SMS\n4. Trigger 24-hour reminder and confirm it arrives",
    "problem_subheader": "Front-desk staff juggle 4 channels and still create double-bookings",
    "problem_description": "Salons receive bookings through phone, text, social DMs, and online forms simultaneously. Staff manually match clients to stylists and rooms—creating double-bookings during peak periods and idle gaps in the schedule that burn stylist income and owner revenue.",
    "reddit_title": "r/FulfillmentCenter - How does your salon handle booking requests that come in through Instagram DMs vs. phone vs. website?",
    "reddit_comments": "36 comments",
    "metrics": [
      {"label": "Booking Sources per Salon", "value": "3–5"},
      {"label": "Double-Booking Incidents/Month", "value": "2–5"},
      {"label": "Chair Utilization (With Orchestration)", "value": "+18%"}
    ],
    "gtm": [
      {"channel": "Instagram Beauty Marketing", "desc": "Partner with local Instagram/TikTok beauty marketers who work with salons and can advocate for better booking infrastructure."},
      {"channel": "Salon Suite Landlords", "desc": "Connect with salon suite landlords who can offer the booking tool as a value-add to independent stylists renting chairs."},
      {"channel": "Mitchell's & Pure Concept Outreach", "desc": "Target multi-location salons like Mitchell's Salon and Pure Concept Salon via LinkedIn with a chair utilization pitch."}
    ]
  },
  {
    "industry": "Salons & Spas",
    "name": "No-Show Reduction & Waitlist Fill",
    "description": "Identifies appointments with higher no-show risk and sends 'please confirm' texts requiring a reply. A live waitlist of clients who previously requested prime times or specific stylists gets the offer the moment a slot cancels—auto-filling the chair before the stylist even notices the opening. Fill rates by city and time of day are tracked to optimize reminder timing.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    "nodes": [
      {"name": "Schedule Trigger: 48hrs Before Appt", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get High-Risk Appointments", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: Confirmation Request SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 12 Hours", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Confirmed", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Query Waitlist for Time", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: Waitlist Slot Offer SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 2 Hours", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Waitlist Accepted", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Update Booking", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Classify appointment risk level based on client history, service type, and time of day for targeted confirmation outreach\n- Draft waitlist offer SMS that conveys urgency without feeling pushy",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load a test high-risk appointment 50 hours out\n2. Trigger reminder and verify confirmation SMS fires\n3. Simulate no confirmation after 12 hours and verify waitlist query runs\n4. Confirm waitlist client receives slot offer and booking updates on acceptance",
    "problem_subheader": "No-shows and late cancellations burn stylist income every week",
    "problem_description": "Salon no-shows and last-minute cancellations eat into stylist income and salon revenue. Most rely on simple reminder texts without dynamic waitlists—so when a prime-time Saturday slot cancels at noon, the chair stays empty because nobody systematically offers it to the 10 clients who would have taken it.",
    "reddit_title": "r/HaircutAdvice - Anyone else book a Saturday appointment and just not show up? Your stylist loses money when you do that.",
    "reddit_comments": "63 comments",
    "metrics": [
      {"label": "Salon No-Show Rate", "value": "~15–20%"},
      {"label": "Waitlist Fill Rate (Automated)", "value": "~65%"},
      {"label": "Revenue Recovered per Filled Slot", "value": "$80–200"}
    ],
    "gtm": [
      {"channel": "Beauty Supply Reps", "desc": "Partner with local beauty supply representatives who already have trusted relationships with independent stylists and salon owners."},
      {"channel": "Salon Owner Facebook Groups", "desc": "Share the waitlist fill rate ROI in Salon & Spa Professional and Behind the Chair community groups."},
      {"channel": "Mason & West Chester Chamber Outreach", "desc": "Target salon owners listed in Mason Deerfield and West Chester-Liberty Chamber directories for demo offers."}
    ]
  },
  {
    "industry": "Security & Alarm Companies",
    "name": "Lead Qualification & Site Survey Prep",
    "description": "On new inquiries, collects home size, entry points, prior incidents, and neighborhood details. Claude scores urgency and opportunity, suggests gear types (basic package vs. cameras vs. smart locks), and schedules high-scoring leads for fast in-person surveys. Pre-survey briefs are automatically attached to each appointment—so reps arrive ready to close rather than starting with discovery questions.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Inquiry Form", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Score Lead + Suggest Package", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "IF: High-Score Lead", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Schedule Priority Survey", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Survey Confirmation to Customer", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Pre-Survey Brief to Rep", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Queue Low-Score for Phone", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Score each inquiry by urgency, opportunity size, and likely package fit based on home characteristics and stated concerns\n- Generate a pre-survey brief for the sales rep covering recommended products, key questions to ask, and neighborhood crime context",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test inquiry with prior break-in noted, 4-bedroom home, and Fairfield location\n2. Verify Claude scores the lead as high priority and suggests appropriate gear\n3. Confirm survey confirmation email fires to customer and pre-survey brief to rep\n4. Submit a low-score inquiry and verify it routes to phone queue in Airtable",
    "problem_subheader": "Sales reps waste limited survey time on leads that aren't ready to buy",
    "problem_description": "Security and alarm firms receive many inquiries but manually triage which sites deserve fast surveys and what gear to propose. Limited survey resources get sent to low-urgency prospects while high-value security-conscious homeowners wait—costing installations to competitors who respond faster with relevant recommendations.",
    "reddit_title": "r/homesecurity - I filled out 4 alarm company forms. One called me in 10 minutes with specific recommendations. I booked them.",
    "reddit_comments": "52 comments",
    "metrics": [
      {"label": "Survey-to-Install Conversion", "value": "~40%"},
      {"label": "Conversion Lift (Prep'd Rep)", "value": "+22%"},
      {"label": "Response Time (Manual Triage)", "value": "4–24 hrs"}
    ],
    "gtm": [
      {"channel": "Real Estate Agent Partnerships", "desc": "Partner with agents and property managers who recommend security providers to new homeowners and tenants in Mason and West Chester."},
      {"channel": "SafeHome.org Listings", "desc": "Target alarm installers listed on SafeHome.org for Fairfield and surrounding suburbs with direct outreach."},
      {"channel": "Electrician & Low-Voltage Contractor Referrals", "desc": "Connect with electricians in Colerain and West Chester who install cabling and can cross-refer alarm jobs."}
    ]
  },
  {
    "industry": "Security & Alarm Companies",
    "name": "Service Ticket & Annual Inspection Tracking",
    "description": "Registers every installed system with its install date and required test frequency. n8n generates monthly inspection lists and sends reminders to homeowners and technicians. Completions are tracked and monthly compliance reports are produced by neighborhood—ensuring recurring service revenue is captured and operators are never exposed to liability from missed annual tests.",
    "integrations": ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: System Installed", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Register System Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Schedule Trigger: Monthly Check", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Due Inspections", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: Customer Reminder SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Technician Assignment Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Inspection Complete", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Log Completion", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- None required for core tracking; optional Claude summarizes monthly compliance report for management review",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Register a test system with install date and annual test frequency\n2. Trigger monthly check and verify due inspection appears in the list\n3. Confirm customer SMS and technician email both fire\n4. Submit completion webhook and verify Airtable updates correctly",
    "problem_subheader": "Annual inspections get missed and systems go untested for years",
    "problem_description": "Service plans depend on systematic annual testing and battery changes, but alarm companies track cycles in spreadsheets. Missed inspection cycles create liability exposure, failed systems, and eroded recurring revenue from service plan renewals—while homeowners assume everything is working fine.",
    "reddit_title": "r/homesecurity - My alarm company never reminded me my system was due for an annual test. Found out when the battery died.",
    "reddit_comments": "29 comments",
    "metrics": [
      {"label": "Systems Without Annual Test (Industry)", "value": "~30%"},
      {"label": "Service Plan Revenue at Risk", "value": "$150–300/system/yr"},
      {"label": "Compliance Report Generation Time", "value": "Manual: 3 hrs → Auto: 5 min"}
    ],
    "gtm": [
      {"channel": "Homeowners Insurance Agents", "desc": "Partner with insurance agents who sell homeowners policies and want clients maintaining well-tested alarm systems for claim rate reduction."},
      {"channel": "Alarm Dealer Associations", "desc": "Present the inspection tracking system at ESA and NBFAA Ohio chapter events for regional alarm dealers."},
      {"channel": "ADT & Ring Installer Outreach", "desc": "Target ADT and Ring authorized dealers in Mason, West Chester, and Fairfield who manage large installed bases."}
    ]
  },
  {
    "industry": "Self-Storage Facilities",
    "name": "Reservation to Move-In Automation",
    "description": "On reservation confirmation, automatically generates a lease agreement and unique gate code, then delivers both via SMS and email with move-in instructions and facility hours. Logs move-in dates in a central tracking table. The entire process happens without staff involvement—matching the contactless experience that national brands offer without the franchise overhead.",
    "integrations": ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "GOOGLE_SERVICE_ACCOUNT_JSON"],
    "nodes": [
      {"name": "Webhook Trigger: Reservation Confirmed", "type": "n8n-nodes-base.webhook"},
      {"name": "Code: Generate Gate Code", "type": "n8n-nodes-base.code"},
      {"name": "Google Docs: Generate Lease", "type": "n8n-nodes-base.googleDocs"},
      {"name": "Airtable: Create Tenant Record", "type": "n8n-nodes-base.airtable"},
      {"name": "HTTP Request: Send E-Signature Link", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Mailgun: Move-In Instructions Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Twilio: Gate Code SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- None required; lease and instructions generated from templates",
    "python_tools": "- `google_docs_pdf.py` to export the lease agreement as a PDF for e-signature delivery",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test reservation webhook with unit size and tenant contact info\n2. Verify gate code is generated uniquely\n3. Confirm lease PDF is generated and e-signature link is sent\n4. Check that move-in instructions email and gate code SMS both arrive within 5 minutes",
    "problem_subheader": "Storage reservations require manual staff follow-up before move-in",
    "problem_description": "Storage operators manually handle web and phone reservations, gate code setup, and move-in paperwork—creating slow conversions and inconsistent experiences. Customers who reserved online expect contactless move-in the same day; manual processes that require a callback lose rentals to automated national competitors.",
    "reddit_title": "r/selfStorage - Operator experience: how do you handle same-day move-ins when you're not onsite?",
    "reddit_comments": "23 comments",
    "metrics": [
      {"label": "Same-Day Move-In Rate (Manual)", "value": "~20%"},
      {"label": "Same-Day Move-In Rate (Automated)", "value": "~75%"},
      {"label": "Staff Time Saved/Rental", "value": "45 min"}
    ],
    "gtm": [
      {"channel": "Property Manager Referrals", "desc": "Connect with realtors and property managers who refer moving clients to storage facilities and want reliable automated partners."},
      {"channel": "Self-Storage Association Events", "desc": "Present at Ohio Self Storage Association events where independent operators compete with CubeSmart and Public Storage."},
      {"channel": "BBB Storage Directory Outreach", "desc": "Target independent storage operators in Mason, West Chester, and Colerain BBB directories with an automation pitch."}
    ]
  },
  {
    "industry": "Specialty Retail Shops",
    "name": "Special-Order Tracking & Loyalty Nurture",
    "description": "When a special order is placed, n8n logs the item, vendor, ETA, and customer contact in Airtable. On inventory arrival, an SMS notifies the customer immediately. In parallel, the top 10–20% of customers by spend receive Claude-written VIP messages about new drops and early access events—turning special orders into loyalty moments and high-value customers into brand advocates.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Webhook Trigger: Special Order Placed", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Create Order Record", "type": "n8n-nodes-base.airtable"},
      {"name": "Webhook Trigger: Inventory Received", "type": "n8n-nodes-base.webhook"},
      {"name": "Airtable: Match Arrival to Order", "type": "n8n-nodes-base.airtable"},
      {"name": "Twilio: 'Your Order Arrived' SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Schedule Trigger: Weekly VIP Check", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "Airtable: Get Top Spenders", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Draft VIP Message", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: VIP SMS", "type": "n8n-nodes-base.httpRequest"}
    ],
    "ai_tasks": "- Draft personalized VIP messages about new drops, private events, or early-access sales tailored to each top spender's purchase history\n- Write warm 'your item arrived' SMS copy that reflects the product type and builds anticipation",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test special order webhook for a specific item\n2. Trigger inventory received webhook and verify SMS notifies the correct customer\n3. Add a test top-spender to Airtable and run weekly VIP check\n4. Confirm Claude generates a personalized VIP message and SMS is sent",
    "problem_subheader": "Special orders get lost and VIP customers feel like regular customers",
    "problem_description": "Specialty shops log special orders on paper or basic POS notes, losing track of arrivals and forgetting to notify customers who waited weeks. Meanwhile, top spenders receive no recognition or priority access—making them vulnerable to any competitor who notices them and treats them better.",
    "reddit_title": "r/retail - I placed a special order 6 weeks ago. The shop never called when it came in. I found out when I stopped by.",
    "reddit_comments": "44 comments",
    "metrics": [
      {"label": "Special Order Notification Rate (Manual)", "value": "~60%"},
      {"label": "Special Order Notification Rate (Automated)", "value": "~99%"},
      {"label": "VIP Revenue Lift (Personalized Outreach)", "value": "+28%"}
    ],
    "gtm": [
      {"channel": "Shopping Center Leasing Managers", "desc": "Partner with mall and strip center leasing managers who want tenants with exceptional customer service and can introduce the tool."},
      {"channel": "Retail Marketing Agencies", "desc": "Work with local retail marketing agencies specializing in boutique shops and hobby stores in Mason and West Chester."},
      {"channel": "Chamber Retail Member Directories", "desc": "Target specialty retailers in Mason Deerfield and West Chester-Liberty Chamber directories for direct outreach."}
    ]
  },
  {
    "industry": "Tech & Software GTM",
    "name": "Lead Qualification & Support Triage",
    "description": "When signups or demo requests arrive, enriches company data via APIs and Claude assesses ICP fit—routing high-value enterprise prospects to senior reps and self-serve candidates to automated nurture flows. In parallel, incoming support tickets are aggregated and Claude tags each by product area, severity, and customer tier, suggests KB article responses for simple issues, and routes complex problems to engineers with full context attached.",
    "integrations": ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN", "SLACK_BOT_TOKEN"],
    "nodes": [
      {"name": "Webhook Trigger: New Signup", "type": "n8n-nodes-base.webhook"},
      {"name": "HTTP Request: Clearbit Enrich", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Claude: Assess ICP Fit", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "IF: High ICP Score", "type": "n8n-nodes-base.if"},
      {"name": "Airtable: Route to Senior Rep", "type": "n8n-nodes-base.airtable"},
      {"name": "Mailgun: Self-Serve Nurture Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: New Support Ticket", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Tag Ticket + Draft Response", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "IF: Simple Issue", "type": "n8n-nodes-base.if"},
      {"name": "Mailgun: Auto-Answer", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Slack: Route Complex to Engineering", "type": "n8n-nodes-base.slack"}
    ],
    "ai_tasks": "- Evaluate ICP fit based on enriched company data (industry, size, location, tech stack signals) and classify as enterprise, SMB, or self-serve\n- Tag support tickets by product area and severity; draft initial responses using knowledge base content for simple issues",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Submit a test signup from a 200-employee manufacturing company in West Chester\n2. Verify Clearbit enrich runs and Claude scores the lead as high ICP\n3. Confirm routing to senior rep Airtable record\n4. Submit a test support ticket with a common password reset issue and verify auto-answer fires\n5. Submit a complex API error ticket and confirm Slack routing fires with context attached",
    "problem_subheader": "Enterprise-grade leads get lost in a queue with self-serve signups",
    "problem_description": "B2B SaaS and IT firms treat all signups and demo requests uniformly—failing to prioritize high-value enterprise prospects who need fast, personalized outreach. Meanwhile, support queues are manually triaged, mixing critical client issues with simple questions that could be answered automatically.",
    "reddit_title": "r/SaaS - How do you qualify inbound leads from product signups without overwhelming your sales team?",
    "reddit_comments": "68 comments",
    "metrics": [
      {"label": "Enterprise Leads Lost to Slow Response", "value": "~35%"},
      {"label": "Support Tickets Auto-Resolved", "value": "~40%"},
      {"label": "Sales Cycle Time Reduction", "value": "~25%"}
    ],
    "gtm": [
      {"channel": "Clutch & DesignRush Listings", "desc": "Target tech and IT firms listed on Clutch serving Cincinnati SMBs with a lead qualification efficiency pitch."},
      {"channel": "Local VC & Accelerator Networks", "desc": "Present to Cincinnati-area VC-backed startups and accelerator cohorts who need scalable GTM without large sales teams."},
      {"channel": "Helpdesk Software Resellers", "desc": "Partner with Zendesk and Freshdesk resellers who can introduce the AI triage layer to their existing customers."}
    ]
  },
  {
    "industry": "Veterinary Clinics",
    "name": "Missed-Call Capture & Triage",
    "description": "Detects any call not answered within a configurable number of rings or sent to voicemail. Within 60 seconds an SMS fires: 'Sorry we missed your call—reply with your pet's name and what's going on.' Claude analyzes replies for emergency keywords and flags urgent cases for immediate staff callback. Routine requests batch into the next call queue with context attached.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    "nodes": [
      {"name": "Webhook Trigger: Missed Call", "type": "n8n-nodes-base.webhook"},
      {"name": "Twilio: Recovery SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Webhook Trigger: Pet Owner Reply", "type": "n8n-nodes-base.webhook"},
      {"name": "Claude: Triage Reply + Flag Urgency", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "IF: Emergency Keywords", "type": "n8n-nodes-base.if"},
      {"name": "Twilio: Alert On-Call Staff", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Log Call + Outcome", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Analyze pet owner reply text for emergency indicators (vomiting, seizure, labored breathing, toxin ingestion) vs. routine requests\n- Generate a concise triage note for staff including the pet's name, concern, and recommended urgency level",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Simulate a missed call webhook from a test number\n2. Verify recovery SMS arrives within 60 seconds\n3. Reply with 'my dog ate rat poison' and confirm on-call staff SMS fires immediately\n4. Reply with 'need to schedule annual vaccines' and confirm routine queue placement",
    "problem_subheader": "Pet owners in emergencies go to voicemail and call the next clinic",
    "problem_description": "Veterinary clinics miss calls during peak hours when exam rooms are full. Pet owners with sick animals don't leave voicemails—they call the next practice. Each missed call is a lost patient relationship worth hundreds per year in wellness visits, preventive care, and emergency fees.",
    "reddit_title": "r/AskVet - My dog was sick and I called 3 vets. Only one texted me back when I called. That's my vet now.",
    "reddit_comments": "84 comments",
    "metrics": [
      {"label": "Calls Missed Daily (Avg Clinic)", "value": "10–20"},
      {"label": "Pets Lost to Competitors", "value": "~45%"},
      {"label": "Recovery Rate with SMS Triage", "value": "~58%"}
    ],
    "gtm": [
      {"channel": "Veterinary Practice Manager Events", "desc": "Present the missed-call recovery system at AVMA and VetPartners practice management events."},
      {"channel": "Apartment Community Partnerships", "desc": "Connect with property managers at suburban apartment complexes who can recommend nearby vet clinics to new pet-owning residents."},
      {"channel": "Pet Insurance Partner Referrals", "desc": "Partner with pet insurance brokers who want policyholders to have fast access to care and can recommend tech-forward clinics."}
    ]
  },
  {
    "industry": "Veterinary Clinics",
    "name": "Preventive Care Recall Program",
    "description": "Nightly, n8n builds lists of pets due for vaccines, wellness exams, or dental cleans in the next 30–60 days. Claude writes short, personalized explanations of why each specific treatment matters for that breed and age group. Multi-touch reminders fire via SMS and email; non-responders escalate to a phone outreach list—recovering preventive care revenue that would otherwise go unscheduled.",
    "integrations": ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID", "MAILGUN_API_KEY", "MAILGUN_DOMAIN"],
    "nodes": [
      {"name": "Schedule Trigger: Nightly", "type": "n8n-nodes-base.scheduleTrigger"},
      {"name": "HTTP Request: Query EHR for Due Dates", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Update Due Recall List", "type": "n8n-nodes-base.airtable"},
      {"name": "Claude: Draft Personalized Recall", "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi"},
      {"name": "Twilio: First Recall SMS", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Wait: 10 Days", "type": "n8n-nodes-base.wait"},
      {"name": "IF: Appointment Booked", "type": "n8n-nodes-base.if"},
      {"name": "Mailgun: Second Recall Email", "type": "n8n-nodes-base.httpRequest"},
      {"name": "Airtable: Flag for Phone Outreach", "type": "n8n-nodes-base.airtable"}
    ],
    "ai_tasks": "- Write personalized recall messages explaining why a specific treatment matters for the pet's breed, age, and health history in plain language\n- Adapt urgency and tone based on whether the reminder is the first, second, or escalation touchpoint",
    "python_tools": "- None required",
    "code_app": "Not required.",
    "test_plan": "1. Load a test patient (senior labrador, annual wellness exam due in 20 days) into Airtable\n2. Trigger nightly schedule and verify recall message is generated with breed-specific copy\n3. Confirm SMS arrives with correct pet name and treatment description\n4. Simulate 10 days without booking and verify email follow-up fires\n5. After second non-response, confirm phone outreach flag is set",
    "problem_subheader": "Pets fall behind on vaccines because clinics rely on postcard mailings",
    "problem_description": "Many pets fall behind on vaccines, wellness exams, or dental cleans because clinics lack a systematic recall program beyond generic postcard mailings that owners ignore. Unscheduled preventive care represents thousands of dollars per month in lost revenue per practice—and worse outcomes for the animals.",
    "reddit_title": "r/AskVet - How do you remind pet owners to keep up with annual wellness visits? Postcards aren't working.",
    "reddit_comments": "57 comments",
    "metrics": [
      {"label": "Pets Overdue for Wellness (Avg Practice)", "value": "25–35%"},
      {"label": "Recall Booking Rate (Postcard)", "value": "~8%"},
      {"label": "Recall Booking Rate (SMS/Email)", "value": "~26%"}
    ],
    "gtm": [
      {"channel": "AVMA & AAHA Practice Events", "desc": "Present the recall program ROI at AVMA and AAHA-accredited practice management sessions in the Cincinnati metro."},
      {"channel": "Pet Insurance Broker Referrals", "desc": "Partner with pet insurance brokers and local rescues who want better preventive compliance for their animal communities."},
      {"channel": "Veterinary Software Vendors", "desc": "Work with practice management software vendors (Impromed, AVImark) to integrate recall automation for their clinic clients."}
    ]
  }
];
const CONFIGURED_KEYS = [
  "N8N_API_URL",
  "N8N_API_KEY",
  "FIRECRAWL_API_KEY",
  "GOOGLE_SERVICE_ACCOUNT_JSON",
  "BOOKING_LINK"
];