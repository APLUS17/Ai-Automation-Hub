import { Industry } from "../types";

export const INDUSTRIES: Industry[] = [
  {
    id: "accounting",
    name: "Accounting / CPA Firms",
    segment: "Professional Services",
    keywords: ["cpa", "accounting", "quickbooks", "invoicing", "p&l", "bookkeeping", "finance"],
    partners: [
      "Business attorneys and law firms with shared SMB clients",
      "Payroll processing companies (ADP, Gusto resellers)",
      "CFO-as-a-service consultancies",
      "QuickBooks ProAdvisor networks"
    ],
    builds: [
      {
        label: "PO → P&L Automation",
        steps: [
          { t: "Gmail Trigger — watch for incoming PO emails" },
          { t: "Extract Attachment Text from email body or PDF" },
          { t: "Claude Extraction — parse line items and totals" },
          { t: "IF: Has Required Fields — gate before creating invoice" },
          { t: "QuickBooks: Create Invoice from extracted data" },
          { t: "Google Sheets: Update P&L row with transaction" },
          { t: "Slack Notification — alert bookkeeper of new entry" }
        ],
        nodes: [
          { name: "Gmail Trigger", type: "n8n-nodes-base.gmailTrigger" },
          { name: "Extract Attachment Text", type: "n8n-nodes-base.code" },
          { name: "Claude Extraction", type: "n8n-nodes-base.custom" },
          { name: "IF: Has Required Fields", type: "n8n-nodes-base.if" },
          { name: "QuickBooks: Create Invoice", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Sheets: Update P&L", type: "n8n-nodes-base.googleSheets" },
          { name: "Slack Notification", type: "n8n-nodes-base.slack" }
        ],
        aiTasks: "- Field extraction from raw PO text/PDF (step 3)\n- Categorization of line items (e.g., Office Supplies, Services, Equipment)",
        testPlan: "1. Send a test email with \"PO Test\" in subject + a simple text PO in body\n2. Check n8n execution log — all 7 nodes should show green\n3. Verify QuickBooks has a new draft invoice\n4. Verify P&L sheet has new row\n5. Check Slack for notification message",
        gtm: [
          { channel: "LinkedIn Direct Outreach", desc: "Target solo CPA firm owners and practice managers experiencing manual data entry bottlenecks." },
          { channel: "QuickBooks Community", desc: "Provide guides and walkthroughs on QuickBooks forums showing how to automate incoming orders." },
          { channel: "r/Accounting", desc: "Engage in discussions about scaling small firm operations without hiring extra administrative help." }
        ],
        problemSubheader: "CPAs spend hours copy-pasting PO data",
        problemDescription: "Managing incoming PDFs of POs via email consumes hours of high-value CPA time. Accountants have to manually extract numbers, log into QuickBooks, update spreadsheets, and notify teammates of transaction updates.",
        redditTitle: "r/Accounting - How do you automate incoming client invoices and POs?",
        redditComments: "42 comments",
        integrations: ["N8N_API_URL", "6xfr5f40H92Sj1Eb", "HhRl2tZkR2KwXqsT", "QB_CLIENT_ID", "GOOGLE_SERVICE_ACCOUNT_JSON", "SLACK_BOT_TOKEN"]
      }
    ]
  },
  {
    id: "women-owned",
    name: "Women-Owned Businesses",
    segment: "Cross-Industry Infrastructure",
    keywords: ["women-owned", "consulting", "ai audit", "small business", "entrepreneurship", "wbenc"],
    partners: [
      "Women's Business Enterprise National Council (WBENC) affiliates",
      "Local chambers of commerce women's divisions",
      "Female founder accelerator programs",
      "SBA Women-Owned Small Business resource centers"
    ],
    builds: [
      {
        label: "AI Leverage Consulting",
        steps: [
          { t: "Webhook Trigger — receive audit form submission" },
          { t: "HTTP Request: Claude Report — generate personalized AI recommendations" },
          { t: "Google Docs: Create Report from Template" },
          { t: "HTTP Request: Export PDF from Google Drive" },
          { t: "Mailgun: Send Report — deliver PDF to client" },
          { t: "Airtable: Log Client record" },
          { t: "Wait 7 Days" },
          { t: "Mailgun: 7-Day Check-in email" },
          { t: "Wait 23 Days then send 30-day check-in" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: Claude Report", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Docs: Create Report from Template", type: "n8n-nodes-base.googleDocs" },
          { name: "HTTP Request: Export PDF", type: "n8n-nodes-base.httpRequest" },
          { name: "Mailgun: Send Report", type: "n8n-nodes-base.httpRequest" },
          { name: "Airtable: Log Client", type: "n8n-nodes-base.airtable" },
          { name: "Wait 7 Days", type: "n8n-nodes-base.wait" },
          { name: "Mailgun: 7-Day Check-in", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 23 Days", type: "n8n-nodes-base.wait" }
        ],
        aiTasks: "- Full report generation (step 2) — this is the core deliverable; prompt quality matters most here",
        testPlan: "1. Fill out audit_form.html as a test business (hair salon, 2 employees, biggest pain: booking + social media)\n2. Verify Claude recommendations are specific (not generic) — check that it recommends Calendly + Buffer\n3. Verify PDF arrives by email with branded layout\n4. Check Airtable — client row logged\n5. Advance n8n — verify 7-day check-in sends",
        gtm: [
          { channel: "Women's Business Councils", desc: "Partner with organizations like WBENC to offer AI audits as a value-added member benefit." },
          { channel: "Local Chambers", desc: "Hold workshops on simple AI tools for small local business owners to generate local warm leads." },
          { channel: "Female Founder Groups", desc: "Engage on Slack and Facebook networks with free high-value AI consultation lead magnets." }
        ],
        problemSubheader: "Women-led small businesses face a technology adoption gap",
        problemDescription: "Small women-owned businesses want to implement AI to increase efficiency, but traditional IT consultants are prohibitively expensive. They need direct, customized, and automated AI assessments that can be generated in minutes.",
        redditTitle: "r/WomenInBusiness - How can I run an AI audit on my boutique?",
        redditComments: "29 comments",
        integrations: ["ANTHROPIC_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON", "MAILGUN_API_KEY"]
      }
    ]
  },
  {
    id: "theater",
    name: "Theater Groups",
    segment: "Community, Nonprofit & Faith",
    keywords: ["theater", "performing arts", "auditions", "box office", "volunteers", "nonprofit arts"],
    partners: [
      "Local arts councils and regional arts foundations",
      "Acting schools and performance training studios",
      "Event ticketing platforms (Eventbrite reps, PatronManager)",
      "Corporate sponsors of local arts organizations"
    ],
    builds: [
      {
        label: "Cost-Cutting Automations",
        steps: [
          { t: "Webhook Trigger — receive box office CSV upload" },
          { t: "Code: Parse CSV — extract ticket sales data" },
          { t: "Google Sheets: Write Dashboard with totals and trends" },
          { t: "Schedule Trigger — run pre-show promo emails weekly" },
          { t: "Google Sheets: Read Past Attendee List" },
          { t: "Code: Filter Relevant Audiences by show type" },
          { t: "Gmail: Send Promo to past attendee segments" },
          { t: "Google Sheets Trigger — detect new volunteer form submission" },
          { t: "HTTP Request: Claude Schedule — assign volunteer to open shift" },
          { t: "Gmail: Send Schedule to Volunteers" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Code: Parse CSV", type: "n8n-nodes-base.code" },
          { name: "Google Sheets: Write Dashboard", type: "n8n-nodes-base.googleSheets" },
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Google Sheets: Read Past Attendee List", type: "n8n-nodes-base.googleSheets" },
          { name: "Code: Filter Relevant Audiences", type: "n8n-nodes-base.code" },
          { name: "Gmail: Send Promo", type: "n8n-nodes-base.gmail" },
          { name: "Google Sheets Trigger", type: "n8n-nodes-base.googleSheetsTrigger" },
          { name: "HTTP Request: Claude Schedule", type: "n8n-nodes-base.httpRequest" },
          { name: "Gmail: Send Schedule to Volunteers", type: "n8n-nodes-base.gmail" }
        ],
        aiTasks: "None specified.",
        testPlan: "1. Upload a test CSV via webhook — verify Sheet populated with totals\n2. Add test attendee emails to \"Audience CRM\" — trigger promo email — verify delivery\n3. Submit volunteer availability form → verify Claude assigns shift → volunteer email sent",
        gtm: [
          { channel: "Theater Associations", desc: "Promote cost-cutting templates through regional theater networks and non-profit arts leagues." },
          { channel: "Arts Council Newsletters", desc: "Secure placements in local arts newsletters offering free ticket audit spreadsheets." },
          { channel: "Direct Outreach", desc: "Audit community theater websites and pitch the automated sync dashboard directly to directors." }
        ],
        problemSubheader: "Non-profit theaters leak box office revenue on manual tracking",
        problemDescription: "Local theater groups are run by volunteers who struggle to sync ticket sales spreadsheets with promotional email campaigns, leading to empty seats and missed fundraising opportunities.",
        redditTitle: "r/theater - Free tools for scheduling auditions and volunteer coordinating?",
        redditComments: "31 comments",
        integrations: ["GOOGLE_SERVICE_ACCOUNT_JSON", "ANTHROPIC_API_KEY"]
      },
      {
        label: "General Process Automation",
        steps: [
          { t: "Webhook Trigger — receive audition form submission" },
          { t: "Airtable: Create Record — log auditionee by role" },
          { t: "Gmail: Confirmation to Auditionee" },
          { t: "Schedule Trigger — run nightly rehearsal reminder check" },
          { t: "Google Sheets: Read Rehearsal Schedule" },
          { t: "Gmail: Rehearsal Reminder email" },
          { t: "Twilio: SMS Reminder to cast member" },
          { t: "Webhook Trigger — receive show info for press release" },
          { t: "HTTP Request: Claude Press Release — draft from show data" },
          { t: "Google Docs: Create Press Release Doc" },
          { t: "Gmail: Send to Press List" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Airtable: Create Record", type: "n8n-nodes-base.airtable" },
          { name: "Gmail: Confirmation to Auditionee", type: "n8n-nodes-base.gmail" },
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Google Sheets: Read Rehearsal Schedule", type: "n8n-nodes-base.googleSheets" },
          { name: "Gmail: Rehearsal Reminder", type: "n8n-nodes-base.gmail" },
          { name: "Twilio: SMS Reminder", type: "n8n-nodes-base.twilio" },
          { name: "HTTP Request: Claude Press Release", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Docs: Create Press Release Doc", type: "n8n-nodes-base.googleDocs" },
          { name: "Gmail: Send to Press List", type: "n8n-nodes-base.gmail" }
        ],
        aiTasks: "- Press release drafting (step 9)\n- Optional: generate social media posts from press release",
        testPlan: "1. Submit test audition form — verify Airtable record created in correct \"Role\" view\n2. Add tomorrow's rehearsal to schedule sheet — trigger nightly check — verify SMS + email\n3. Fire press release webhook with test show data — verify Google Doc created with formatted PR",
        gtm: [
          { channel: "Theater Director Forums", desc: "Share casting automation templates on Facebook Groups and community theater subreddits." },
          { channel: "Local Art Schools", desc: "Partner with acting schools to provide a modern, automated audition signup portal for their students." },
          { channel: "Case Studies", desc: "Showcase how one theater saved 40 hours of admin work on their latest musical using Airtable + n8n." }
        ],
        problemSubheader: "Auditions and casting pipelines are administrative nightmares",
        problemDescription: "Managing audition registrations, talent headshots, contact information, and rehearsal reminders in disjointed spreadsheets consumes hundreds of volunteer hours per production.",
        redditTitle: "r/acting - Why are community theater casting portals so outdated?",
        redditComments: "56 comments",
        integrations: ["AIRTABLE_API_KEY", "TWILIO_ACCOUNT_SID", "ANTHROPIC_API_KEY"]
      }
    ]
  },
  {
    id: "water-damage",
    name: "Water Damage / Remodeling",
    segment: "Home Services",
    keywords: ["water damage", "restoration", "remediation", "remodeling", "emergency", "flooding", "mold"],
    partners: [
      "Local plumbing companies (non-competing cross-referral)",
      "Home insurance agents and adjusters (State Farm, Allstate)",
      "General contractors and remodelers",
      "Home inspection companies"
    ],
    builds: [
      {
        label: "Upsell Automation",
        steps: [
          { t: "Webhook Trigger — job marked complete" },
          { t: "HTTP Request: Claude Upsell Message — personalize based on damage type" },
          { t: "Wait 3 Days" },
          { t: "Twilio: Day 3 SMS with mold prevention offer" },
          { t: "Wait 4 Days" },
          { t: "Mailgun: Day 7 Email with waterproofing upsell" },
          { t: "Wait 7 Days" },
          { t: "Twilio: Day 14 Final SMS — last chance booking prompt" },
          { t: "Webhook Trigger — client clicks booking link" },
          { t: "Slack: Sales Rep Alert" },
          { t: "Gmail: Send Booking Confirmation" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: Claude Upsell Message", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 3 Days", type: "n8n-nodes-base.wait" },
          { name: "Twilio: Day 3 SMS", type: "n8n-nodes-base.twilio" },
          { name: "Wait 4 Days", type: "n8n-nodes-base.wait" },
          { name: "Mailgun: Day 7 Email", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 7 Days", type: "n8n-nodes-base.wait" },
          { name: "Twilio: Day 14 Final SMS", type: "n8n-nodes-base.twilio" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Slack: Sales Rep Alert", type: "n8n-nodes-base.slack" },
          { name: "Gmail: Send Booking Confirmation", type: "n8n-nodes-base.gmail" }
        ],
        aiTasks: "- Personalized upsell SMS + email generation at job completion (step 2)",
        testPlan: "1. POST a fake job_completed event with damage_type = \"water infiltration\"\n2. Check n8n — Claude should generate a relevant mold prevention message\n3. Verify SMS sent (to test number), email queued\n4. Simulate a Mailgun click webhook — verify Slack fires sales rep alert",
        gtm: [
          { channel: "Plumbing Contractor Networks", desc: "Establish referral programs with local plumbers who refer emergency mitigation jobs." },
          { channel: "Restoration Associations", desc: "Publish articles in trade magazines demonstrating the ROI of automated follow-up sequences." },
          { channel: "GHL Communities", desc: "Promote GHL pipeline templates tailored specifically for water damage rebuild sales." }
        ],
        problemSubheader: "Restoration contractors miss out on highly profitable remodeling upsells",
        problemDescription: "Emergency water mitigation companies do the immediate cleanup work but fail to follow up with homeowners about post-mitigation rebuild and remodeling contracts, letting competitors steal the job.",
        redditTitle: "Restoration Forum - How are you converting dry-out jobs into rebuild contracts?",
        redditComments: "19 comments",
        integrations: ["ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "MAILGUN_API_KEY", "SLACK_BOT_TOKEN"]
      },
      {
        label: "Damage Detection Automation",
        steps: [
          { t: "Webhook Trigger — field tech sends photo" },
          { t: "HTTP Request: Claude Vision — classify damage type and severity" },
          { t: "Google Docs: Create Report from damage summary" },
          { t: "Google Drive: Upload Photo to Report Folder" },
          { t: "Slack: Notify Estimator with photo + summary" },
          { t: "Gmail: Send Summary to project manager" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: Claude Vision", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Docs: Create Report", type: "n8n-nodes-base.googleDocs" },
          { name: "Google Drive: Upload Photo to Report Folder", type: "n8n-nodes-base.httpRequest" },
          { name: "Slack: Notify Estimator", type: "n8n-nodes-base.slack" },
          { name: "Gmail: Send Summary", type: "n8n-nodes-base.gmail" }
        ],
        aiTasks: "- Vision-based damage classification (step 2) — this is the core AI task",
        testPlan: "1. `python tools/claude_ai.py image --image test_damage.jpg --prompt \"Analyze water damage type, severity, sq ft\"` — verify structured response\n2. POST a test photo + fake job data to the webhook\n3. Check Google Docs — report doc should be created with filled-in details\n4. Verify Slack message arrived with damage summary",
        gtm: [
          { channel: "Google Local Service Ads", desc: "Run hyper-targeted local ads bidding on emergency restoration keywords with fast assessment CTAs." },
          { channel: "Home Insurance Agents", desc: "Form relationships with insurance adjusters who recommend fast-responding restoration firms." },
          { channel: "SEO for Emergency Queries", desc: "Create local landing pages optimized for 'flooded basement help' queries with photo upload widgets." }
        ],
        problemSubheader: "Emergency dispatch speed determines restoration project wins",
        problemDescription: "When home flooding occurs, homeowners call multiple contractors. The contractor who can classify damage from photos and provide a fast initial assessment wins the lucrative restoration contract.",
        redditTitle: "r/Plumbing - Fast quoting for emergency water mitigation calls?",
        redditComments: "38 comments",
        integrations: ["ANTHROPIC_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON", "SLACK_BOT_TOKEN"]
      }
    ]
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    segment: "Retail & Consumer Services",
    keywords: ["shopify", "ecommerce", "inventory", "abandoned cart", "marketing", "social media", "product listings"],
    partners: [
      "Shopify partner agencies and web design firms",
      "Meta/Instagram ad agencies serving DTC brands",
      "3PL fulfillment providers (ShipBob, ShipMonk partners)",
      "E-commerce accountants and bookkeeping services"
    ],
    builds: [
      {
        label: "Product Process Automation",
        steps: [
          { t: "Schedule Trigger — daily inventory check" },
          { t: "HTTP Request: Shopify Inventory — pull stock levels" },
          { t: "IF: Low Stock Items? — flag products below threshold" },
          { t: "Gmail: Draft Supplier Reorder email" },
          { t: "Schedule Trigger — sync inventory to sheets" },
          { t: "HTTP Request: Shopify Products — fetch full catalog" },
          { t: "Google Sheets: Write Inventory data" },
          { t: "Google Sheets Trigger — detect manual sheet edits" },
          { t: "HTTP Request: Shopify Update Inventory from sheet changes" }
        ],
        nodes: [
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "HTTP Request: Shopify Inventory", type: "n8n-nodes-base.httpRequest" },
          { name: "IF: Low Stock Items?", type: "n8n-nodes-base.if" },
          { name: "Gmail: Draft Supplier Reorder", type: "n8n-nodes-base.gmail" },
          { name: "HTTP Request: Shopify Products", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Sheets: Write Inventory", type: "n8n-nodes-base.googleSheets" },
          { name: "Google Sheets Trigger", type: "n8n-nodes-base.googleSheetsTrigger" },
          { name: "HTTP Request: Shopify Update Inventory", type: "n8n-nodes-base.httpRequest" }
        ],
        aiTasks: "None specified.",
        testPlan: "1. Set one Shopify test product to qty = 2 (below threshold)\n2. Trigger daily check — verify Gmail draft created\n3. Trigger sync — verify Google Sheet populated with all products\n4. Edit qty in Google Sheet — verify Shopify inventory updated via API\n5. Open product_catalog.html — search for a product — verify instant results",
        gtm: [
          { channel: "Shopify App Communities", desc: "Promote workflow integration guides in Shopify Community forums and Facebook circles." },
          { channel: "E-commerce Podcasts", desc: "Sponsor e-commerce operations podcasts demonstrating inventory automation tactics." },
          { channel: "Direct Cold Outreach", desc: "Target high-growth Shopify stores showing signs of stockouts and pitch them automated restocking." }
        ],
        problemSubheader: "Low-stock events cause thousands in lost revenue and supplier friction",
        problemDescription: "E-commerce stores lose customers when popular items go out of stock unexpectedly. Manually monitoring stock levels, emailing suppliers for reorders, and keeping catalogs in sync is a slow, error-prone cycle.",
        redditTitle: "r/shopify - How do you handle automatic supplier reordering?",
        redditComments: "64 comments",
        integrations: ["SHOPIFY_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON"]
      },
      {
        label: "Marketing Automation",
        steps: [
          { t: "Webhook Trigger — new Shopify product created" },
          { t: "HTTP Request: Claude Product Description + social caption" },
          { t: "HTTP Request: Shopify Update Description" },
          { t: "HTTP Request: Post to Instagram/Facebook" },
          { t: "Webhook Trigger — abandoned cart detected" },
          { t: "Wait 1 Hour" },
          { t: "HTTP Request: Check if Order Placed" },
          { t: "IF: Order Placed? — branch on status" },
          { t: "Mailgun: Email Day 1 cart recovery" },
          { t: "Wait then send Day 2 recovery" },
          { t: "Webhook Trigger — order fulfilled" },
          { t: "Wait 3 Days" },
          { t: "Gmail: Review Request email" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: Claude Product Description", type: "n8n-nodes-base.httpRequest" },
          { name: "HTTP Request: Shopify Update Description", type: "n8n-nodes-base.httpRequest" },
          { name: "HTTP Request: Post to Instagram", type: "n8n-nodes-base.httpRequest" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Wait 1 Hour", type: "n8n-nodes-base.wait" },
          { name: "HTTP Request: Check if Order Placed", type: "n8n-nodes-base.httpRequest" },
          { name: "IF: Order Placed?", type: "n8n-nodes-base.if" },
          { name: "Mailgun: Email Day 1", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 1 Day", type: "n8n-nodes-base.wait" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Wait 3 Days", type: "n8n-nodes-base.wait" },
          { name: "Gmail: Review Request", type: "n8n-nodes-base.gmail" }
        ],
        aiTasks: "- Product description + social caption generation (step 2)",
        testPlan: "1. Add a test product in Shopify dev store — verify Claude description attached within 1 min\n2. Create a test checkout, don't complete — wait 1h → verify abandoned cart email\n3. Create a fulfilled test order — wait 3 days (or advance n8n) → verify review request",
        gtm: [
          { channel: "Shopify Partner Agencies", desc: "White-label the marketing sync workflow to Shopify web design agencies to upsell to clients." },
          { channel: "Meta Ads Forums", desc: "Share case studies of stores driving organic traffic using AI-generated cross-platform postings." },
          { channel: "E-commerce Newsletters", desc: "Sponsor newsletters targeting independent store founders with free caption-generation playbooks." }
        ],
        problemSubheader: "Publishing new product listings across multiple channels is exhausting",
        problemDescription: "When launching new SKUs, e-commerce managers spend hours writing SEO descriptions, generating social media captions, and posting manually across Facebook, Meta, and Instagram.",
        redditTitle: "r/ecommerce - Best way to auto-post Shopify products to Meta/Insta?",
        redditComments: "41 comments",
        integrations: ["SHOPIFY_API_KEY", "ANTHROPIC_API_KEY", "TWILIO_ACCOUNT_SID", "MAILGUN_API_KEY"]
      }
    ]
  },
  {
    id: "hotels",
    name: "Boutique Hotels",
    segment: "Hospitality, Food & Venue",
    keywords: ["hotel", "hospitality", "booking", "tripadvisor", "expedia", "reviews", "boutique lodging", "competitor pricing"],
    partners: [
      "Independent lodging associations (AIHP, state hotel associations)",
      "Revenue management consultants for independent properties",
      "Local tourism boards and CVBs",
      "OTA channel managers (SiteMinder, CloudBeds reps)"
    ],
    builds: [
      {
        label: "Early-Stage Market Research",
        steps: [
          { t: "Schedule Trigger — weekly market scan" },
          { t: "Set: Define Target Market — city, star rating, price range" },
          { t: "HTTP Request: Apify Booking.com Scraper" },
          { t: "Code: Filter Independents from chain properties" },
          { t: "Airtable: Create Hotel Records" },
          { t: "Airtable: Read Hotels for review scrape batch" },
          { t: "Split In Batches — process hotels in groups" },
          { t: "HTTP Request: Apify TripAdvisor Reviews" },
          { t: "HTTP Request: Claude Sentiment analysis on reviews" },
          { t: "Airtable: Store Pain Points by category" },
          { t: "Firecrawl: Enrich Hotel Websites for contact info" },
          { t: "Airtable: Update Hotel Records with enrichment" }
        ],
        nodes: [
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Set: Define Target Market", type: "n8n-nodes-base.set" },
          { name: "HTTP Request: Apify Booking.com Scraper", type: "n8n-nodes-base.httpRequest" },
          { name: "Code: Filter Independents", type: "n8n-nodes-base.code" },
          { name: "Airtable: Create Hotel Records", type: "n8n-nodes-base.airtable" },
          { name: "Airtable: Read Hotels", type: "n8n-nodes-base.airtable" },
          { name: "Split In Batches", type: "n8n-nodes-base.splitInBatches" },
          { name: "HTTP Request: Apify TripAdvisor Reviews", type: "n8n-nodes-base.httpRequest" },
          { name: "HTTP Request: Claude Sentiment", type: "n8n-nodes-base.httpRequest" },
          { name: "Airtable: Store Pain Points", type: "n8n-nodes-base.airtable" },
          { name: "Firecrawl: Enrich Hotel Websites", type: "n8n-nodes-base.httpRequest" },
          { name: "Airtable: Update Hotel Records", type: "n8n-nodes-base.airtable" }
        ],
        aiTasks: "- Sentiment analysis + pain point categorization per hotel (step 9)",
        testPlan: "1. Run Booking.com scraper on test location (10 max results) — verify hotels returned\n2. Run TripAdvisor reviews for 1 hotel — verify 20+ reviews fetched\n3. Pass reviews to claude_ai.py sentiment — verify structured pain point JSON\n4. Check Airtable — Pain Points table populated correctly\n5. Open research_dashboard.html — verify all 3 panels load with real data",
        gtm: [
          { channel: "Independent Lodging Associations", desc: "Pitch price intelligence workflows at independent lodging conferences and webinars." },
          { channel: "Hospitality Tech Directories", desc: "List the automated market research tool on hospitality software databases and review sites." },
          { channel: "Direct General Manager Pitch", desc: "Send general managers a free localized competitor pricing report to show immediate value." }
        ],
        problemSubheader: "Independent hotels lose bookings to chains with dynamic pricing",
        problemDescription: "Boutique and independent hotels cannot compete with large hotel chains that use automated competitor pricing crawlers. Managers waste hours manually checking Booking.com and Expedia rates.",
        redditTitle: "r/HotelManagers - How to automate competitor price monitoring?",
        redditComments: "27 comments",
        integrations: ["APIFY_API_TOKEN", "FIRECRAWL_API_KEY", "ANTHROPIC_API_KEY", "AIRTABLE_API_KEY"]
      }
    ]
  },
  {
    id: "appraisal",
    name: "Property Appraisal",
    segment: "Property, Facilities & Real Estate",
    keywords: ["appraisal", "zillow", "real estate", "mls", "property", "appraiser", "realtor", "ghl"],
    partners: [
      "Real estate agents and brokers (referral partners)",
      "Mortgage lenders and loan officers",
      "Title companies and real estate attorneys",
      "Home inspection companies"
    ],
    builds: [
      {
        label: "Lead Gen (Zillow Scrape → Enrich → Dashboard)",
        steps: [
          { t: "Schedule Trigger — daily Zillow scrape" },
          { t: "Set: Define Target Markets — zip codes and property types" },
          { t: "Split In Batches — process markets in parallel" },
          { t: "HTTP Request: Apify Zillow — scrape new listings" },
          { t: "Code: Filter by Criteria — price range, property type" },
          { t: "HTTP Request: Firecrawl Enrich — extract agent contact info" },
          { t: "Google Sheets: Append Leads — push to lead sheet" }
        ],
        nodes: [
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Set: Define Target Markets", type: "n8n-nodes-base.set" },
          { name: "Split In Batches", type: "n8n-nodes-base.splitInBatches" },
          { name: "HTTP Request: Apify Zillow", type: "n8n-nodes-base.httpRequest" },
          { name: "Code: Filter by Criteria", type: "n8n-nodes-base.code" },
          { name: "HTTP Request: Firecrawl Enrich", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Sheets: Append Leads", type: "n8n-nodes-base.googleSheets" }
        ],
        aiTasks: "None specified.",
        testPlan: "1. Run apify_runner locally with test location — verify 10+ leads returned\n2. Test firecrawl on one Zillow agent profile URL — verify email/phone extracted\n3. Trigger n8n workflow — verify new rows in Google Sheet\n4. Open lead_dashboard.html — verify data loads, filters work, \"Mark Contacted\" updates sheet",
        gtm: [
          { channel: "Appraisal Facebook Groups", desc: "Share tutorials on how to build localized lead engines using Zillow APIs and n8n." },
          { channel: "Local Real Estate Boards", desc: "Provide appraisal valuation reports to local MLS boards as value-add resources for members." },
          { channel: "LinkedIn Outreach", desc: "Target solo appraisers and small appraisal groups struggling to maintain a full project pipeline." }
        ],
        problemSubheader: "Appraisers waste hours scraping Zillow and filtering listings",
        problemDescription: "Independent real estate appraisers spend half their week chasing leads on Zillow, cross-referencing MLS listings, and looking up property history on outdated tax databases.",
        redditTitle: "Appraisers Forum - Automating lead lists from Zillow and MLS?",
        redditComments: "34 comments",
        integrations: ["APIFY_API_TOKEN", "FIRECRAWL_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON"]
      },
      {
        label: "Follow-Up Automation",
        steps: [
          { t: "Webhook Trigger — new appraisal lead received" },
          { t: "HTTP Request: GHL Create Contact — add to pipeline" },
          { t: "Mailgun: Email Day 1 introduction" },
          { t: "Wait 2 Days" },
          { t: "Mailgun: Email Day 3 follow-up" },
          { t: "Wait 2 Days" },
          { t: "IF: Any Opens/Clicks? — branch on engagement" },
          { t: "Twilio: Day 5 SMS — reach cold leads" },
          { t: "Wait 2 Days" },
          { t: "Mailgun: Day 7 Final Email" },
          { t: "Webhook Trigger — email open/click event" },
          { t: "HTTP Request: GHL Move Stage — update pipeline" },
          { t: "Webhook Trigger — appraisal completed" },
          { t: "Wait 24 Hours" },
          { t: "Twilio: Review Request SMS" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: GHL Create Contact", type: "n8n-nodes-base.httpRequest" },
          { name: "Mailgun: Email Day 1", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 2 Days", type: "n8n-nodes-base.wait" },
          { name: "Mailgun: Email Day 3", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 2 Days", type: "n8n-nodes-base.wait" },
          { name: "IF: Any Opens/Clicks?", type: "n8n-nodes-base.if" },
          { name: "Twilio: Day 5 SMS", type: "n8n-nodes-base.twilio" },
          { name: "Wait 2 Days", type: "n8n-nodes-base.wait" },
          { name: "Mailgun: Day 7 Final Email", type: "n8n-nodes-base.httpRequest" },
          { name: "HTTP Request: GHL Move Stage", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 24 Hours", type: "n8n-nodes-base.wait" },
          { name: "Twilio: Review Request SMS", type: "n8n-nodes-base.twilio" }
        ],
        aiTasks: "- Optional: personalize each email with Claude based on property type + agent context",
        testPlan: "1. Add yourself as a test lead → verify day 1 email arrives\n2. Don't open it → advance n8n time → verify day 5 SMS arrives\n3. Open day 3 email → verify GHL contact moved to \"Prospect Engaged\"\n4. Fire post-appraisal webhook → verify review request SMS sent next day",
        gtm: [
          { channel: "Real Estate Agent Networks", desc: "Position the appraisal follow-up system as a friction-reducer for agents looking to close deals faster." },
          { channel: "Appraisal Coaching Groups", desc: "Partner with appraisal coaches and trainers to feature the workflow in their operational courses." },
          { channel: "Direct CRM Integrations", desc: "Provide GHL snapshots pre-configured for appraisers to download and deploy instantly." }
        ],
        problemSubheader: "Appraisers spend 10+ hours a week chasing Realtors for updates",
        problemDescription: "Closing appraisal deals requires constant coordination and follow-up. Appraisers waste valuable billing hours texting and emailing agents to confirm property statuses, access details, and invoice payments.",
        redditTitle: "Appraisers Forum - System to automate Realtor follow ups?",
        redditComments: "23 comments",
        integrations: ["GHL_API_KEY", "MAILGUN_API_KEY", "TWILIO_ACCOUNT_SID"]
      }
    ]
  },
  {
    id: "healthcare-rev",
    name: "Healthcare Revenue",
    segment: "Healthcare & Care",
    keywords: ["healthcare", "medical billing", "hipaa", "claims", "revenue cycle", "compliance", "ehr", "denial"],
    partners: [
      "Medical billing services and RCM consultancies",
      "Healthcare IT firms (EHR integrators)",
      "Practice management software vendors",
      "HIPAA compliance attorneys and consultants"
    ],
    builds: [
      {
        label: "Compliance Automation",
        steps: [
          { t: "Schedule Trigger — daily certification expiry check" },
          { t: "Google Sheets: Read Staff Certifications roster" },
          { t: "Code: Calculate Days Until Expiry for each staff member" },
          { t: "IF: Renewal Needed? — flag 30/14/7-day windows" },
          { t: "Gmail: Renewal Reminder to staff member" },
          { t: "Google Sheets: Audit Log — timestamp every action" },
          { t: "Webhook Trigger — policy Q&A bot query" },
          { t: "Google Sheets: Append Audit Row for bot queries" }
        ],
        nodes: [
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Google Sheets: Read Staff Certifications", type: "n8n-nodes-base.googleSheets" },
          { name: "Code: Calculate Days Until Expiry", type: "n8n-nodes-base.code" },
          { name: "IF: Renewal Needed?", type: "n8n-nodes-base.if" },
          { name: "Gmail: Renewal Reminder", type: "n8n-nodes-base.gmail" },
          { name: "Google Sheets: Audit Log", type: "n8n-nodes-base.googleSheets" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Google Sheets: Append Audit Row", type: "n8n-nodes-base.googleSheets" }
        ],
        aiTasks: "- Real-time compliance Q&A via system-prompted chat\n- Optional: summarize newly uploaded policy docs into plain-language FAQ",
        testPlan: "1. Add a test staff row with expiry date = today + 7 days\n2. Trigger daily check — verify reminder email arrives\n3. Check audit log sheet — new row timestamped\n4. Open compliance_bot.html — ask \"What is the minimum PHI access policy?\" — verify sensible answer",
        gtm: [
          { channel: "Healthcare Admin Forums", desc: "Share compliance-check templates in MGMA (Medical Group Management Association) circles." },
          { channel: "Medical CRM Directories", desc: "Advertise the integration on medical EHR marketplaces and practice management hubs." },
          { channel: "Direct Clinic Outreach", desc: "Target operations managers at mid-sized clinical practices with audit-readiness checklists." }
        ],
        problemSubheader: "Expiring medical licenses and compliance certificates trigger heavy fines",
        problemDescription: "Medical practices are plagued by complex regulatory tracking. Healthcare admins manually monitor certification dates for doctors, nurses, and equipment in paper files, risking severe audit penalties.",
        redditTitle: "r/MedicalPractice - Automated tracking for staff certifications?",
        redditComments: "47 comments",
        integrations: ["GOOGLE_SERVICE_ACCOUNT_JSON", "ANTHROPIC_API_KEY"]
      },
      {
        label: "Revenue Cycle Automation",
        steps: [
          { t: "Gmail Trigger — watch for new insurance claims" },
          { t: "HTTP Request: Claude Field Extraction from claim document" },
          { t: "Code: Map to Billing Codes — CPT/ICD code lookup" },
          { t: "IF: Has Errors? — flag coding issues" },
          { t: "HTTP Request: Submit to Clearinghouse queue" },
          { t: "Airtable: Log Claim with status" },
          { t: "IF: Was Denied? — route denials to tracker" },
          { t: "Schedule Trigger — weekly summary run" },
          { t: "Airtable: Read Denials for the week" },
          { t: "HTTP Request: Claude Summary — draft denial pattern report" },
          { t: "Gmail: Send Summary to billing director" }
        ],
        nodes: [
          { name: "Gmail Trigger", type: "n8n-nodes-base.gmailTrigger" },
          { name: "HTTP Request: Claude Field Extraction", type: "n8n-nodes-base.httpRequest" },
          { name: "Code: Map to Billing Codes", type: "n8n-nodes-base.code" },
          { name: "IF: Has Errors?", type: "n8n-nodes-base.if" },
          { name: "HTTP Request: Submit to Clearinghouse", type: "n8n-nodes-base.httpRequest" },
          { name: "Airtable: Log Claim", type: "n8n-nodes-base.airtable" },
          { name: "IF: Was Denied?", type: "n8n-nodes-base.if" },
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Airtable: Read Denials", type: "n8n-nodes-base.airtable" },
          { name: "HTTP Request: Claude Summary", type: "n8n-nodes-base.httpRequest" },
          { name: "Gmail: Send Summary", type: "n8n-nodes-base.gmail" }
        ],
        aiTasks: "- Claim field extraction from unstructured text (step 2)\n- Error pattern summary (step 10)",
        testPlan: "1. Send test email with a sample claim (use a mock EOB document)\n2. Check n8n execution — verify extracted JSON has correct fields\n3. Check Airtable \"Claims Log\" — new record should appear\n4. Simulate a denial — check Airtable \"Denials Tracker\" updated\n5. Run Monday summary — verify email arrives with formatted denial breakdown",
        gtm: [
          { channel: "Billing Consultancy Partnering", desc: "Offer code automation toolkits to medical billing services to double their appeals processing capacity." },
          { channel: "Healthcare LinkedIn Outreach", desc: "Target Practice Managers and Billing Directors at multi-practitioner clinics." },
          { channel: "HIPAA Compliance Networks", desc: "Pitch the secure RAG denial tracking engine in healthcare tech newsletters." }
        ],
        problemSubheader: "Practices lose 10% of gross revenue to simple claim coding errors",
        problemDescription: "Medical claim denials are a massive cash drain. Practices fail to map billing codes correctly, and appeals are ignored because admins lack the time to draft customized correction appeals.",
        redditTitle: "r/MedicalBilling - Appeal letter automation for denied claims?",
        redditComments: "51 comments",
        integrations: ["ANTHROPIC_API_KEY", "AIRTABLE_API_KEY", "SLACK_BOT_TOKEN"]
      }
    ]
  },
  {
    id: "k12",
    name: "Education (K-12)",
    segment: "Education & Training",
    keywords: ["k-12", "teachers", "grading", "students", "parents", "google classroom", "education", "school"],
    partners: [
      "EdTech companies with teacher professional development programs",
      "Tutoring franchise networks (Kumon, Sylvan Learning)",
      "School district IT departments",
      "Teachers Pay Teachers content creator networks"
    ],
    builds: [
      {
        label: "Teacher Task Automation",
        steps: [
          { t: "Google Sheets Trigger — new quiz form submission" },
          { t: "Code: Grade MCQs — auto-score multiple choice" },
          { t: "Google Sheets: Log Score to gradebook" },
          { t: "Schedule Trigger — weekly parent update run" },
          { t: "Google Sheets: Read Gradebook for the week" },
          { t: "Code: Group by Student — aggregate per student" },
          { t: "HTTP Request: Claude Narrative — write personalized parent update" },
          { t: "Gmail: Send Parent Email with narrative" },
          { t: "Schedule Trigger — monthly progress report" },
          { t: "Google Sheets: Read Full Gradebook" },
          { t: "HTTP Request: Claude Report Draft — generate progress summary" },
          { t: "Google Docs: Create Report with student name" }
        ],
        nodes: [
          { name: "Google Sheets Trigger", type: "n8n-nodes-base.googleSheetsTrigger" },
          { name: "Code: Grade MCQs", type: "n8n-nodes-base.code" },
          { name: "Google Sheets: Log Score", type: "n8n-nodes-base.googleSheets" },
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Google Sheets: Read Gradebook", type: "n8n-nodes-base.googleSheets" },
          { name: "Code: Group by Student", type: "n8n-nodes-base.code" },
          { name: "HTTP Request: Claude Narrative", type: "n8n-nodes-base.httpRequest" },
          { name: "Gmail: Send Parent Email", type: "n8n-nodes-base.gmail" },
          { name: "Google Sheets: Read Full Gradebook", type: "n8n-nodes-base.googleSheets" },
          { name: "HTTP Request: Claude Report Draft", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Docs: Create Report", type: "n8n-nodes-base.googleDocs" }
        ],
        aiTasks: "- Parent update narrative generation (step 7)\n- Progress report draft (step 11)\n- Optional: quiz question generation from lesson objectives",
        testPlan: "1. Submit a Google Form quiz response manually\n2. Check \"Gradebook\" sheet — new graded row should appear within 1 minute\n3. Trigger parent email workflow manually — verify email arrives with personalized narrative\n4. Run progress report workflow — verify Google Doc created with student name in filename",
        gtm: [
          { channel: "EdTech Teacher Networks", desc: "Share free Google Forms grading workflow templates on Pinterest and Teacher Twitter/X." },
          { channel: "School District IT Sales", desc: "Pitch administration time-savers to school district technical directors and principals." },
          { channel: "Teacher Pay Teachers", desc: "List n8n/Sheets templates on lesson directories as premium operations buildkits." }
        ],
        problemSubheader: "Teachers spend 15+ hours a week on grading and administration",
        problemDescription: "Grading quizzes, formatting progress sheets, and writing personalized emails to parents consumes teachers' evenings and weekends, causing severe burnout.",
        redditTitle: "r/teachers - Admin work is killing my love for teaching. Automation tips?",
        redditComments: "89 comments",
        integrations: ["GOOGLE_SERVICE_ACCOUNT_JSON", "ANTHROPIC_API_KEY"]
      },
      {
        label: "Personalized Student Learning",
        steps: [
          { t: "Schedule Trigger — weekly struggle detection scan" },
          { t: "Google Sheets: Read Gradebook — pull recent quiz scores" },
          { t: "Code: Identify Struggling Students — flag scores below 70%" },
          { t: "Gmail: Alert Teacher with struggling student list" },
          { t: "HTTP Request: Generate Practice Problems via Claude" },
          { t: "Gmail: Send Problems to Student/Parent" }
        ],
        nodes: [
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Google Sheets: Read Gradebook", type: "n8n-nodes-base.googleSheets" },
          { name: "Code: Identify Struggling Students", type: "n8n-nodes-base.code" },
          { name: "Gmail: Alert Teacher", type: "n8n-nodes-base.gmail" },
          { name: "HTTP Request: Generate Practice Problems", type: "n8n-nodes-base.httpRequest" },
          { name: "Gmail: Send Problems to Student/Parent", type: "n8n-nodes-base.gmail" }
        ],
        aiTasks: "- Student chat responses (real-time, via webhook)\n- Differentiated practice problem generation (step 5)",
        testPlan: "1. Open student_chat.html in browser, ask \"What is photosynthesis?\" — verify Claude responds\n2. Add test gradebook rows with scores < 70% — trigger struggle detection — verify teacher email\n3. Open teacher_dashboard.html — verify student list loads with correct scores",
        gtm: [
          { channel: "Tutoring Franchises", desc: "Pitch the student chat interface and automated problem generator to local tutoring franchises." },
          { channel: "Homeschool Groups", desc: "Promote the tutor chatbot as an affordable alternative to premium personal tutors." },
          { channel: "Teacher Blog Outreach", desc: "Partner with educational influencers to write guides on classroom differentiation with AI." }
        ],
        problemSubheader: "One teacher cannot offer personalized practice to 30 unique students",
        problemDescription: "Students struggle with different concepts. Detecting who is falling behind, pinpointing their exact weaknesses, and generating customized practice sheets takes more time than teachers have.",
        redditTitle: "r/teachers - Generating differentiated practice problems easily?",
        redditComments: "44 comments",
        integrations: ["ANTHROPIC_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON"]
      }
    ]
  },
  {
    id: "hvac",
    name: "HVAC",
    segment: "Industrial, Trades & Field Ops",
    keywords: ["hvac", "heating", "cooling", "air conditioning", "contractor", "field service", "bland.ai", "voice bot", "leads"],
    partners: [
      "Web agencies with HVAC clients (Skynet Technologies, Helium SEO, Magnet Co)",
      "IT firms serving HVAC (IT GOAT, Ingage Partners, LayerCake Technologies)",
      "Property management companies and real estate agents",
      "Home inspection companies serving Butler/Warren/Hamilton Counties"
    ],
    builds: [
      {
        label: "Lead Gen (Google Maps → Enrichment → Sheet)",
        steps: [
          { t: "Schedule Trigger — run weekly scrape" },
          { t: "Set: Define Target Queries — zip codes and search terms" },
          { t: "Split In Batches — process zip codes in groups" },
          { t: "HTTP Request: Apify Google Maps — scrape HVAC listings" },
          { t: "Wait for Actor — poll for Apify run completion" },
          { t: "HTTP Request: Fetch Apify Results" },
          { t: "Code: Deduplicate by Phone/Name" },
          { t: "HTTP Request: Firecrawl Enrich — extract contact from website" },
          { t: "Google Sheets: Append Leads — push clean records" }
        ],
        nodes: [
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Set: Define Target Queries", type: "n8n-nodes-base.set" },
          { name: "Split In Batches", type: "n8n-nodes-base.splitInBatches" },
          { name: "HTTP Request: Apify Google Maps", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait for Actor", type: "n8n-nodes-base.wait" },
          { name: "HTTP Request: Fetch Apify Results", type: "n8n-nodes-base.httpRequest" },
          { name: "Code: Deduplicate by Phone/Name", type: "n8n-nodes-base.code" },
          { name: "HTTP Request: Firecrawl Enrich", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Sheets: Append Leads", type: "n8n-nodes-base.googleSheets" }
        ],
        aiTasks: "- Optional: score each lead by rating count + recency of reviews",
        testPlan: "1. Run `python tools/apify_runner.py google-maps --query \"HVAC company 90210\" --max 5`\n2. Verify 5 records returned with name, phone, address, website\n3. Run `python tools/firecrawl_scraper.py contacts --url <one_website>`\n4. Verify email/phone extracted\n5. Trigger n8n workflow — check Google Sheet for new rows after run",
        gtm: [
          { channel: "Google LSA + Facebook Lead Ads", desc: "This system makes those ad dollars convert — pitch it to contractors already running paid ads who are losing leads to slow follow-up." },
          { channel: "HVAC Contractor Forums (HVAC-Talk)", desc: "Post case studies showing lead response time improvements. Link to a free audit offer." },
          { channel: "Real Estate Agent Referrals", desc: "Partner with agents in Mason/West Chester/Blue Ash who refer homeowners needing pre-sale HVAC inspections." }
        ],
        problemSubheader: "Homeowners submit to 5–8 HVAC companies at once — first to respond wins the job",
        problemDescription: "When homeowners need HVAC work, they Google and submit to multiple companies simultaneously. The first to respond AND triage urgency wins the $6,000–$12,000 job. Most HVAC owners don't see new leads until 8 AM the next day — 14 hours too late.",
        redditTitle: "HVAC Hacks - Best way to build a commercial lead list?",
        redditComments: "21 comments",
        integrations: ["APIFY_API_TOKEN", "FIRECRAWL_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON"]
      },
      {
        label: "Voice Bot Outreach (Bland.ai → Lead List → SMS)",
        steps: [
          { t: "Schedule Trigger — run outreach campaign" },
          { t: "Google Sheets: Read Leads — pull call queue" },
          { t: "Split In Batches — call in groups of 10" },
          { t: "HTTP Request: Bland.ai Call — trigger AI voice call" },
          { t: "Google Sheets: Update Status — mark \"Called\"" },
          { t: "Webhook Trigger — receive Bland.ai call outcome callback" },
          { t: "IF: Interested? — branch on call outcome" },
          { t: "Twilio: Send Booking SMS with scheduling link" },
          { t: "Google Sheets: Log Outcome — record result" }
        ],
        nodes: [
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Google Sheets: Read Leads", type: "n8n-nodes-base.googleSheets" },
          { name: "Split In Batches", type: "n8n-nodes-base.splitInBatches" },
          { name: "HTTP Request: Bland.ai Call", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Sheets: Update Status", type: "n8n-nodes-base.googleSheets" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "IF: Interested?", type: "n8n-nodes-base.if" },
          { name: "Twilio: Send Booking SMS", type: "n8n-nodes-base.twilio" },
          { name: "Google Sheets: Log Outcome", type: "n8n-nodes-base.googleSheets" }
        ],
        aiTasks: "- Post-call: summarize transcript, extract intent signal (for leads who spoke but unclear)",
        testPlan: "1. Add one test lead row to Google Sheet with your own phone number\n2. Trigger n8n manually — should receive a Bland.ai call within 30 seconds\n3. Say \"yes I'm interested\" — verify Twilio SMS arrives with booking link\n4. Check Google Sheet — row should show Status = \"Interested\"",
        gtm: [
          { channel: "Demo Voice Bot Cold Email", desc: "Record a live demo call for a specific contractor's business and email it to them — hearing their own company name from the bot closes deals fast." },
          { channel: "Local HVAC Associations (ACI, Cincinnati HBA)", desc: "Host webinars showing how weather-triggered outreach fills the calendar before peak season hits." },
          { channel: "Contractor Marketing Agencies", desc: "Partner with SEO/PPC agencies already serving trade companies — offer voice AI as an add-on to their existing packages." }
        ],
        problemSubheader: "An 8-truck operation gets 80+ calls in 48 hours during a heat wave — half go to voicemail",
        problemDescription: "HVAC companies lose 40–60% of potential revenue during seasonal demand spikes. A database of 2,400 past customers who'd book preventive maintenance sits untouched — because no one has time to call them.",
        redditTitle: "HVAC Hacks - Answer rate and dispatch solutions?",
        redditComments: "67 comments",
        integrations: ["BLAND_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON", "TWILIO_ACCOUNT_SID"]
      }
    ]
  },
  {
    id: "coaching",
    name: "Online Coaching",
    segment: "Professional Services",
    keywords: ["coaching", "ghl", "cal.com", "lead reactivation", "sales funnel", "drip", "crm", "high-ticket"],
    partners: [
      "GoHighLevel certified agencies and resellers",
      "Podcast production agencies serving coaching brands",
      "Cal.com integration partners and scheduling consultants",
      "High-ticket sales trainers and closer networks"
    ],
    builds: [
      {
        label: "Dead Lead Reactivation",
        steps: [
          { t: "Schedule Trigger — run daily reactivation sweep" },
          { t: "HTTP Request: GHL Contacts — pull closed-lost leads" },
          { t: "Split In Batches — process in groups of 20" },
          { t: "HTTP Request: Claude Personalize — generate re-engagement message" },
          { t: "Mailgun: Send Email Day 1 reactivation" },
          { t: "GHL: Tag as \"Reactivation Sequence\"" },
          { t: "Wait 2 Days" },
          { t: "Mailgun: Email Day 3 follow-up" },
          { t: "Wait 2 Days" },
          { t: "Twilio: SMS Day 5 last touch" },
          { t: "Webhook: Mailgun Open/Click Callback — detect engagement" }
        ],
        nodes: [
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "HTTP Request: GHL Contacts", type: "n8n-nodes-base.httpRequest" },
          { name: "Split In Batches", type: "n8n-nodes-base.splitInBatches" },
          { name: "HTTP Request: Claude Personalize", type: "n8n-nodes-base.httpRequest" },
          { name: "Mailgun: Send Email Day 1", type: "n8n-nodes-base.httpRequest" },
          { name: "GHL: Tag as Reactivation Sequence", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 2 Days", type: "n8n-nodes-base.wait" },
          { name: "Mailgun: Email Day 3", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 2 Days", type: "n8n-nodes-base.wait" },
          { name: "Twilio: SMS Day 5", type: "n8n-nodes-base.twilio" },
          { name: "Webhook: Mailgun Open/Click Callback", type: "n8n-nodes-base.webhook" }
        ],
        aiTasks: "- Personalized message generation (step 4) using contact name, program interest, last touchpoint",
        testPlan: "1. `python tools/ghl_crm.py test` → verify GHL connection\n2. Add yourself as a test contact tagged \"closed-lost\" in GHL\n3. Trigger workflow manually — verify email arrives with personalized copy\n4. Open the email — verify Slack fires \"follow up now\" alert\n5. Verify GHL contact stage updated to \"Re-engaged\"",
        gtm: [
          { channel: "High-Ticket Coaching Circles", desc: "Promote reactivation results in elite mastermind groups and coaching consulting hubs." },
          { channel: "GoHighLevel Ecosystem", desc: "List the reactivation workflow snapshot on GHL resource sites and affiliate circles." },
          { channel: "Case Studies on X/Twitter", desc: "Write long-form threads showing how a coach generated $15K from cold leads in 4 days." }
        ],
        problemSubheader: "Coaches sit on databases of 1,000+ cold leads without time to follow up",
        problemDescription: "Acquiring fitness or business coaching leads is expensive. When leads go cold, manually emailing or texting hundreds of contacts to revive them is an exhausting and rarely completed chore.",
        redditTitle: "r/coaching - Best campaign to reactivate dead email lists?",
        redditComments: "39 comments",
        integrations: ["GHL_API_KEY", "ANTHROPIC_API_KEY", "MAILGUN_API_KEY", "TWILIO_ACCOUNT_SID", "SLACK_BOT_TOKEN"]
      },
      {
        label: "Sales Stack Automation",
        steps: [
          { t: "Webhook Trigger — intake form submitted" },
          { t: "HTTP Request: GHL Create Contact — add to CRM" },
          { t: "GHL: Add to Nurture Sequence — start 7-day drip" },
          { t: "Gmail: Send Intake Confirmation to prospect" },
          { t: "Webhook Trigger — Cal.com booking confirmed" },
          { t: "HTTP Request: Claude Prep Notes — generate pre-call research" },
          { t: "Gmail: Send Prep Notes to coach" },
          { t: "Webhook Trigger — call transcript received" },
          { t: "HTTP Request: Claude Follow-Up — draft post-call email from transcript" },
          { t: "Gmail: Send Follow-Up to prospect" },
          { t: "GHL: Move to \"Follow-Up Sent\" stage" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: GHL Create Contact", type: "n8n-nodes-base.httpRequest" },
          { name: "GHL: Add to Nurture Sequence", type: "n8n-nodes-base.httpRequest" },
          { name: "Gmail: Send Intake Confirmation", type: "n8n-nodes-base.gmail" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: Claude Prep Notes", type: "n8n-nodes-base.httpRequest" },
          { name: "Gmail: Send Prep Notes", type: "n8n-nodes-base.gmail" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: Claude Follow-Up", type: "n8n-nodes-base.httpRequest" },
          { name: "Gmail: Send Follow-Up", type: "n8n-nodes-base.gmail" },
          { name: "GHL: Move to Follow-Up Sent", type: "n8n-nodes-base.httpRequest" }
        ],
        aiTasks: "- Prep notes generation before call (step 6)\n- Follow-up email from transcript (step 9)",
        testPlan: "1. Submit a test intake form to the webhook URL\n2. Verify GHL contact created + nurture sequence started\n3. Book a test Cal.com appointment — verify prep notes email arrives\n4. POST a fake transcript to the follow-up webhook — verify email sent + GHL stage updated",
        gtm: [
          { channel: "Cal.com Integration Directory", desc: "List the full intake-CRM-calendar snapshot in calendar app appstores." },
          { channel: "Coaching Masterminds", desc: "Conduct operational audits for coaches and swap out their fragmented software with this workflow." },
          { channel: "Instagram/FB DM Ads", desc: "Target coaches with ads highlighting 'one-click automated client intake setups'." }
        ],
        problemSubheader: "Coaching intake forms and booking flows are disjointed",
        problemDescription: "Coaches leak clients when there are dead zones between submitting an intake form, creating a CRM record, booking a consultation calendar slot, and sending pre-call reminder texts.",
        redditTitle: "r/sales - Best automated coaching onboarding setup?",
        redditComments: "42 comments",
        integrations: ["GHL_API_KEY", "CALCOM_API_KEY", "ANTHROPIC_API_KEY", "MAILGUN_API_KEY"]
      }
    ]
  },
  {
    id: "pharma",
    name: "Pharmaceutical / Regulatory",
    segment: "Healthcare & Care",
    keywords: ["pharmaceutical", "fda", "ind", "nda", "regulatory", "clinical", "biotech", "ctd", "compliance"],
    partners: [
      "Biotech incubator networks (YC, LabCentral, BioLabs)",
      "Regulatory affairs consultancies (PAREXEL, Regulatory Compliance Associates)",
      "Clinical research organizations (CROs)",
      "Life science law firms specializing in FDA submissions"
    ],
    builds: [
      {
        label: "IND/NDA Application Prep Automation",
        steps: [
          { t: "Webhook Trigger — document upload from intake tool" },
          { t: "HTTP Request: Claude Extraction — parse study data fields" },
          { t: "Airtable: Log Extracted Data by CTD section" },
          { t: "HTTP Request: Claude Narrative Draft — write regulatory language" },
          { t: "Google Docs: Create Section Draft per CTD module" },
          { t: "Airtable: Flag Missing Sections — identify gaps" },
          { t: "Gmail: Route to SME for section review" },
          { t: "Webhook Trigger — SME approval received" },
          { t: "Airtable: Update Status — mark section approved" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: Claude Extraction", type: "n8n-nodes-base.httpRequest" },
          { name: "Airtable: Log Extracted Data", type: "n8n-nodes-base.airtable" },
          { name: "HTTP Request: Claude Narrative Draft", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Docs: Create Section Draft", type: "n8n-nodes-base.googleDocs" },
          { name: "Airtable: Flag Missing Sections", type: "n8n-nodes-base.airtable" },
          { name: "Gmail: Route to SME", type: "n8n-nodes-base.gmail" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Airtable: Update Status", type: "n8n-nodes-base.airtable" }
        ],
        aiTasks: "- Structured data extraction from regulatory documents (step 2)\n- Narrative section drafting with regulatory language (step 4)",
        testPlan: "1. Upload a sample study document (chemistry data for a fictional drug)\n2. Verify Claude extraction returns correct CTD section mapping\n3. Check Google Docs — narrative draft created for each extracted section\n4. Verify Airtable shows which sections are complete vs. missing\n5. Verify SME email sent with review link",
        gtm: [
          { channel: "Biotech Incubator Networks", desc: "Introduce the NDA drafting wizard to startup founders at incubator hubs (e.g. YC, LabCentral)." },
          { channel: "Regulatory Affairs Conferences", desc: "Demonstrate the document mapper at RAPS (Regulatory Affairs Professionals Society) meetups." },
          { channel: "LinkedIn Outreach", desc: "Connect with Directors of Regulatory Operations at clinical-stage biotech firms." }
        ],
        problemSubheader: "Regulatory teams spend months manually compiling clinical narrative summaries",
        problemDescription: "FDA submissions require compliance mapping. Clinical teams waste hundreds of hours extracting trial data from laboratory sheets and formatting it into strict IND/NDA module layouts.",
        redditTitle: "r/regulatoryaffairs - AI tools for drafting clinical narratives?",
        redditComments: "18 comments",
        integrations: ["ANTHROPIC_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON", "AIRTABLE_API_KEY"]
      }
    ]
  },
  {
    id: "hr",
    name: "HR (Small Orgs)",
    segment: "Professional Services",
    keywords: ["hr", "human resources", "onboarding", "pto", "hiring", "consulting", "ai audit", "small business"],
    partners: [
      "PEO providers (TriNet, Justworks, Rippling resellers)",
      "Business coaches and operations consultants",
      "Recruiting agencies serving SMBs",
      "Employment law attorneys and HR compliance consultants"
    ],
    builds: [
      {
        label: "AI Adoption Consulting",
        steps: [
          { t: "Webhook Trigger — AI audit form submitted" },
          { t: "HTTP Request: Claude Recommendations — generate AI tool roadmap" },
          { t: "Google Docs: Create Report from Template" },
          { t: "Google Drive: Export as PDF" },
          { t: "Mailgun: Send Report — deliver to client inbox" },
          { t: "Wait 7 Days" },
          { t: "Mailgun: 7-Day Check-in email" },
          { t: "Wait 23 Days" },
          { t: "Mailgun: 30-Day Check-in email" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: Claude Recommendations", type: "n8n-nodes-base.httpRequest" },
          { name: "Google Docs: Create Report from Template", type: "n8n-nodes-base.googleDocs" },
          { name: "Google Drive: Export as PDF", type: "n8n-nodes-base.httpRequest" },
          { name: "Mailgun: Send Report", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 7 Days", type: "n8n-nodes-base.wait" },
          { name: "Mailgun: 7-Day Check-in", type: "n8n-nodes-base.httpRequest" },
          { name: "Wait 23 Days", type: "n8n-nodes-base.wait" },
          { name: "Mailgun: 30-Day Check-in", type: "n8n-nodes-base.httpRequest" }
        ],
        aiTasks: "- AI tool recommendations generation (step 2) — quality matters here; test prompt carefully",
        testPlan: "1. Open ai_audit_form.html, fill out and submit as test company\n2. Check Docs — report should be created\n3. Verify PDF email arrives with personalized recommendations\n4. Wait (or fast-forward n8n) — verify 7-day check-in sends",
        gtm: [
          { channel: "Consulting Communities", desc: "Write blog posts and forum guides on scaling boutique consultancies using AI report builders." },
          { channel: "Upwork/Fiverr Audits", desc: "Offer rapid AI audit services on freelancing sites as high-converting discovery offers." },
          { channel: "LinkedIn Professional Network", desc: "Target independent business consultants and operations strategists with automation templates." }
        ],
        problemSubheader: "Small consulting firms struggle to deliver comprehensive AI audit documents",
        problemDescription: "Consultants spend days interviewing staff, compiling recommendations, formatting tables, and styling PDF report files. They cannot scale their auditing services without automation.",
        redditTitle: "r/consulting - Automating discovery reports and recommendations?",
        redditComments: "31 comments",
        integrations: ["ANTHROPIC_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON", "MAILGUN_API_KEY"]
      },
      {
        label: "Admin Workflow Automation",
        steps: [
          { t: "Webhook Trigger — new hire form submitted" },
          { t: "Gmail: Send Welcome Kit to new hire" },
          { t: "Gmail: Alert Manager with onboarding checklist" },
          { t: "Google Sheets: Add to Roster" },
          { t: "Webhook Trigger — PTO request submitted" },
          { t: "Code: Check Calendar Conflicts for coverage" },
          { t: "IF: Auto-approve? — check team coverage threshold" },
          { t: "Schedule Trigger — monthly review cycle reminder" },
          { t: "Gmail: Reminder Email to managers" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Gmail: Send Welcome Kit", type: "n8n-nodes-base.gmail" },
          { name: "Gmail: Alert Manager", type: "n8n-nodes-base.gmail" },
          { name: "Google Sheets: Add to Roster", type: "n8n-nodes-base.googleSheets" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Code: Check Calendar Conflicts", type: "n8n-nodes-base.code" },
          { name: "IF: Auto-approve?", type: "n8n-nodes-base.if" },
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "Gmail: Reminder Email", type: "n8n-nodes-base.gmail" }
        ],
        aiTasks: "None specified.",
        testPlan: "1. Submit a test new hire form — verify welcome kit email sent\n2. Submit a PTO request with no team conflicts — verify auto-approval\n3. Submit PTO during a busy period — verify manager notification\n4. Trigger review cycle reminder — verify correct email goes to managers",
        gtm: [
          { channel: "HR Tech Forums", desc: "Share onboarding workflow recipes on sites like HR Open Source and SHRM communities." },
          { channel: "Slack App Ecosystem", desc: "Promote the Slack auto-invite and setup integration on Slack community channels." },
          { channel: "LinkedIn Target", desc: "Directly message newly promoted HR Managers offering automated employee onboarding snapshots." }
        ],
        problemSubheader: "HR onboarding in growing firms is a manual, chaotic process",
        problemDescription: "Without automated triggers, HR managers waste hours emailing new hires for payroll info, checking background statuses, adding users to Slack, and setting up training tasks.",
        redditTitle: "r/humanresources - Standard onboarding workflow for a team of 40?",
        redditComments: "72 comments",
        integrations: ["ANTHROPIC_API_KEY", "GOOGLE_SERVICE_ACCOUNT_JSON", "SLACK_BOT_TOKEN"]
      }
    ]
  },
  {
    id: "chiro",
    name: "Chiropractic",
    segment: "Healthcare & Care",
    keywords: ["chiropractic", "chiropractor", "patient retention", "sms", "appointments", "ghl", "review generation"],
    partners: [
      "Physical therapy clinics (complementary referral relationship)",
      "Personal injury attorneys who refer accident patients",
      "Fitness studios and gyms with shared clientele",
      "Health insurance agents familiar with chiro benefits"
    ],
    builds: [
      {
        label: "General Practice Automation",
        steps: [
          { t: "Webhook Trigger — intake form submitted" },
          { t: "HTTP Request: GHL Create Contact — new patient record" },
          { t: "GHL: Assign to Pipeline — route to New Patient stage" },
          { t: "Twilio: Confirmation SMS — welcome the patient" },
          { t: "Gmail: Welcome Email with directions and forms" },
          { t: "Schedule Trigger — nightly appointment reminder check" },
          { t: "HTTP Request: GHL Get Tomorrow's Appointments" },
          { t: "Split In Batches — send reminders per patient" },
          { t: "Twilio: Reminder SMS — 24h before appointment" },
          { t: "Webhook Trigger — visit marked complete" },
          { t: "Wait 2 Hours" },
          { t: "Gmail: Review Request + Care Plan Email" },
          { t: "Schedule Trigger — 60-day inactive patient scan" },
          { t: "HTTP Request: GHL Inactive Patients — pull lost patients" },
          { t: "Twilio: Reactivation SMS" },
          { t: "GHL: Tag Reactivation Sent — prevent duplicate outreach" }
        ],
        nodes: [
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "HTTP Request: GHL Create Contact", type: "n8n-nodes-base.httpRequest" },
          { name: "GHL: Assign to Pipeline", type: "n8n-nodes-base.httpRequest" },
          { name: "Twilio: Confirmation SMS", type: "n8n-nodes-base.twilio" },
          { name: "Gmail: Welcome Email", type: "n8n-nodes-base.gmail" },
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "HTTP Request: GHL Get Tomorrow's Appointments", type: "n8n-nodes-base.httpRequest" },
          { name: "Split In Batches", type: "n8n-nodes-base.splitInBatches" },
          { name: "Twilio: Reminder SMS", type: "n8n-nodes-base.twilio" },
          { name: "Webhook Trigger", type: "n8n-nodes-base.webhook" },
          { name: "Wait 2 Hours", type: "n8n-nodes-base.wait" },
          { name: "Gmail: Review Request + Care Plan Email", type: "n8n-nodes-base.gmail" },
          { name: "Schedule Trigger", type: "n8n-nodes-base.scheduleTrigger" },
          { name: "HTTP Request: GHL Inactive Patients", type: "n8n-nodes-base.httpRequest" },
          { name: "Twilio: Reactivation SMS", type: "n8n-nodes-base.twilio" },
          { name: "GHL: Tag Reactivation Sent", type: "n8n-nodes-base.httpRequest" }
        ],
        aiTasks: "None specified.",
        testPlan: "1. Submit a test intake form — verify GHL contact created + confirmation SMS received\n2. Add a test appointment for tomorrow in GHL — run reminder flow — verify SMS received\n3. Mark appointment \"Completed\" in GHL — wait 2h — verify follow-up email with review link\n4. Set test contact last_visit to 61 days ago — run reactivation — verify SMS received",
        gtm: [
          { channel: "Chiropractic Coaching Circles", desc: "Partner with chiro business coaches to distribute the intake-to-reactivation workflow." },
          { channel: "Chiro Facebook Groups", desc: "Post case studies demonstrating Google Review increases from automated post-visit reminders." },
          { channel: "Local Clinic SEO Audit", desc: "Offer local chiropractors a free clinic review audit to demonstrate the need for automated reviews." }
        ],
        problemSubheader: "40% of new chiropractic patients fail to book a follow-up appointment",
        problemDescription: "Patient retention is the core profit driver for chiropractic clinics. Without immediate post-visit feedback requests, automated reminders, and 60-day reactivation texts, patients drop out of care programs.",
        redditTitle: "Chiropractic Success - Patient retention and automated SMS?",
        redditComments: "49 comments",
        integrations: ["GHL_API_KEY", "TWILIO_ACCOUNT_SID"]
      }
    ]
  }
];
