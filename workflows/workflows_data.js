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
    "problem_subheader": "HVAC contractors struggle to maintain a full project pipeline",
    "problem_description": "Scraping commercial directories and checking if local businesses need service contracts is a manual chore that most field technicians and busy owners ignore, letting leads grow cold.",
    "reddit_title": "HVAC Hacks - Best way to build a commercial lead list?",
    "reddit_comments": "21 comments",
    "metrics": [
      {
        "label": "HVAC Contractors",
        "value": "115K"
      },
      {
        "label": "Scrape Target Size",
        "value": "500/city"
      },
      {
        "label": "GTM Lead Lift",
        "value": "+35%"
      }
    ],
    "gtm": [
      {
        "channel": "Local Contractor Meetups",
        "desc": "Present lead generation strategies to local business networking groups and chambers."
      },
      {
        "channel": "HVAC Contractor Forums",
        "desc": "Post step-by-step guides showing how to scrape and enrich business data on sites like HVAC-Talk."
      },
      {
        "channel": "GLS Optimization Audits",
        "desc": "Offer free localized maps audit reports to HVAC firms to sell the enrichment services."
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
    "problem_subheader": "Field-busy HVAC owners miss phone calls and lose clients",
    "problem_description": "When homeowners need urgent repairs, they call the first HVAC firm on Google. If the owner is out on a roof repairing a compressor, the call goes to voicemail and the lead is lost to a competitor.",
    "reddit_title": "HVAC Hacks - Answer rate and dispatch solutions?",
    "reddit_comments": "67 comments",
    "metrics": [
      {
        "label": "Missed Call Loss",
        "value": "$400/ea"
      },
      {
        "label": "Outreach Call Speed",
        "value": "<2 mins"
      },
      {
        "label": "SMS Conversion Lift",
        "value": "+25%"
      }
    ],
    "gtm": [
      {
        "channel": "Bland.ai/Synthflow Showcase",
        "desc": "Build demo voice bots for specific contractors and email them a recording of their voice assistant."
      },
      {
        "channel": "Contractor Marketing Agencies",
        "desc": "Partner with agencies doing SEO/PPC for trade companies to offer voice automation integrations."
      },
      {
        "channel": "Local HVAC Associations",
        "desc": "Host virtual webinars showing how voice AI handles booking and dispatching after-hours."
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
  }
];
const CONFIGURED_KEYS = [
  "N8N_API_URL",
  "N8N_API_KEY",
  "FIRECRAWL_API_KEY",
  "GOOGLE_SERVICE_ACCOUNT_JSON",
  "BOOKING_LINK"
];