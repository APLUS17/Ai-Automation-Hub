# Automation Hub — Agent Instructions

You're working inside the **WAT framework** (Workflows, Agents, Tools). This workspace is a build kit for 14 business-niche automation systems. When asked to "build the X workflow," read the relevant SOP from `workflows/<niche>/`, then use the n8n MCP tools and/or Python tools from `tools/` to construct, deploy, and test it against the live n8n instance.

---

## The WAT Architecture

**Layer 1: Workflows (The Instructions)**
- Markdown SOPs in `workflows/<niche>/<workflow>.md`
- Each SOP defines: objective, integrations needed, n8n node sequence, Claude AI tasks, test plan
- These are your primary build instructions — read them before coding anything

**Layer 2: Agents (The Decision-Maker — that's you)**
- Read the SOP, decide whether to build an n8n workflow, a Claude Code app, or both
- Call the right tools in sequence; handle errors; ask before spending credits
- Don't try to guess node configs from memory — use templates in `workflows/templates/`

**Layer 3: Tools (The Execution)**
- Python scripts in `tools/` for things n8n can't do natively: Apify actor calls, PDF export, data enrichment
- n8n MCP tools for building and deploying workflows directly to the live instance
- Credentials live in `.env` — load with python-dotenv

---

## Live n8n Instance

- **URL**: `http://35.238.129.106:5678`
- **API key**: `N8N_API_KEY` in `.env`
- **Credentials already configured**: Gmail OAuth2, OpenRouter

When building, use the n8n MCP tools (load via ToolSearch) rather than the REST API directly unless you're writing a Python automation script.

---

## Build Decision Tree

Given a user request, decide what to build:

```
"Build the X workflow"
  ├── Primary automation (triggers, routing, API calls, email/SMS)?
  │     → n8n workflow via n8n MCP tools
  │         1. Load: ToolSearch "select:mcp__n8n__n8n_generate_workflow,mcp__n8n__n8n_create_workflow,mcp__n8n__validate_workflow,mcp__n8n__n8n_get_workflow,mcp__n8n__n8n_list_workflows"
  │         2. Read the niche SOP for node specs
  │         3. Generate → validate → deploy → test
  │
  ├── UI / dashboard / chatbot / form?
  │     → Claude Code app (single HTML file, Tailwind CDN, vanilla JS)
  │         Pattern: self-contained, no build step, dark/light theme, same design language as this guide
  │
  ├── Lead scraping / web enrichment?
  │     → Python tools: apify_runner.py + firecrawl_scraper.py
  │         Then pipe results into a Google Sheet via google_sheets.py
  │
  └── Both n8n + Claude Code?
        → Build n8n workflow first (backend), then Claude Code app (frontend that hits the webhook)
```

---

## n8n Build Protocol

1. **Load MCP tools** (one ToolSearch call):
   ```
   select:mcp__n8n__n8n_generate_workflow,mcp__n8n__n8n_create_workflow,mcp__n8n__n8n_validate_workflow,mcp__n8n__n8n_get_workflow,mcp__n8n__n8n_list_workflows,mcp__n8n__n8n_update_full_workflow,mcp__n8n__n8n_test_workflow,mcp__n8n__search_nodes,mcp__n8n__n8n_manage_credentials
   ```

2. **Check existing workflows**: `n8n_list_workflows` — avoid duplicates

3. **Generate or create**:
   - Prefer `n8n_generate_workflow` with a detailed prompt based on the SOP
   - Fall back to `n8n_create_workflow` + `n8n_update_full_workflow` for precise node-by-node control

4. **Validate**: Always run `n8n_validate_workflow` before considering it done

5. **Test**: Use `n8n_test_workflow` or trigger manually at the n8n UI

6. **Report**: Give the user the workflow ID, webhook URL (if applicable), and test instructions

---

## n8n Node Type Quick Reference

| Need | Node type |
|---|---|
| Webhook trigger | `n8n-nodes-base.webhook` |
| Gmail trigger | `n8n-nodes-base.gmailTrigger` |
| Gmail send | `n8n-nodes-base.gmail` |
| HTTP request (Apify, APIs) | `n8n-nodes-base.httpRequest` |
| Google Sheets read/write | `n8n-nodes-base.googleSheets` |
| Google Docs | `n8n-nodes-base.googleDocs` |
| Airtable | `n8n-nodes-base.airtable` |
| Twilio SMS | `n8n-nodes-base.twilio` |
| Mailgun | `n8n-nodes-base.mailgun` |
| Slack | `n8n-nodes-base.slack` |
| Schedule (cron) | `n8n-nodes-base.scheduleTrigger` |
| IF branch | `n8n-nodes-base.if` |
| Wait / delay | `n8n-nodes-base.wait` |
| Set / transform | `n8n-nodes-base.set` |
| Code (JS) | `n8n-nodes-base.code` |
| Claude / OpenRouter LLM | `@n8n/n8n-nodes-langchain.lmChatOpenAi` (OpenRouter endpoint) |
| Loop over items | `n8n-nodes-base.splitInBatches` |
| Merge branches | `n8n-nodes-base.merge` |

Reusable node JSON configs are in `workflows/templates/`. Reference them when building.

---

## Python Tool Registry

All tools live in `tools/`. Run `python tools/<name>.py --test` to verify connectivity.

| Script | What it does | Key env vars |
|---|---|---|
| `n8n_api.py` | n8n REST API: list/create/update/activate workflows | `N8N_API_URL`, `N8N_API_KEY` |
| `apify_runner.py` | Run Apify actors (Google Maps, Zillow, etc.) | `APIFY_API_TOKEN` |
| `firecrawl_scraper.py` | Scrape & enrich URLs via Firecrawl | `FIRECRAWL_API_KEY` |
| `twilio_sms.py` | Send SMS, check status | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| `mailgun_email.py` | Send emails, list/create templates | `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` |
| `ghl_crm.py` | GoHighLevel: contacts, pipeline stages, triggers | `GHL_API_KEY`, `GHL_LOCATION_ID` |
| `airtable_crud.py` | Airtable: list/create/update/delete records | `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` |
| `google_sheets.py` | Sheets: read range, append, batch write | `GOOGLE_SERVICE_ACCOUNT_JSON` |
| `google_docs_pdf.py` | Create Doc from template, export as PDF | `GOOGLE_SERVICE_ACCOUNT_JSON` |
| `claude_ai.py` | Claude API: extract, generate, vision (image analysis) | `ANTHROPIC_API_KEY` |

---

## Credential Map by Integration

Fill in `.env` before building workflows that use these:

| Integration | Env vars needed | Used in niches |
|---|---|---|
| n8n | `N8N_API_URL`, `N8N_API_KEY` | All |
| Anthropic / Claude | `ANTHROPIC_API_KEY` | All AI tasks |
| OpenRouter (alt LLM) | `OPENROUTER_API_KEY` | AI nodes in n8n |
| Apify | `APIFY_API_TOKEN` | HVAC, Property Appraisal, Hotels, Ecommerce |
| Firecrawl | `FIRECRAWL_API_KEY` | HVAC, Property Appraisal, Hotels |
| Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | HVAC, Coaching, Water Damage, Property, Chiro |
| Mailgun | `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` | Coaching, Ecommerce, HR, Property |
| GoHighLevel | `GHL_API_KEY`, `GHL_LOCATION_ID` | Coaching, Chiropractic, Property Appraisal |
| Airtable | `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` | Healthcare, Theater, Pharma, Property |
| Google Sheets | `GOOGLE_SERVICE_ACCOUNT_JSON` | Accounting, HVAC, Education, Theater |
| Google Docs/Drive | `GOOGLE_SERVICE_ACCOUNT_JSON` | Accounting, Education, Water Damage, Pharma |
| Gmail OAuth2 | Already configured in n8n | Accounting, Coaching, HR, Chiro |
| Shopify | `SHOPIFY_API_KEY`, `SHOPIFY_STORE_URL` | Ecommerce |
| QuickBooks | `QB_CLIENT_ID`, `QB_CLIENT_SECRET`, `QB_REALM_ID` | Accounting |
| Bland.ai / Synthflow | `BLAND_API_KEY` | HVAC voice bot |
| Cal.com | `CALCOM_API_KEY` | Coaching |
| Slack | `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` | Water Damage, Healthcare |

---

## Niche Catalog

All 14 niches below. For each, the SOP files are in `workflows/<niche>/`.

### 1. Accounting / CPA Firms
- `po_to_pl.md` — Gmail/Drive trigger → Claude extracts PO → QuickBooks invoice → P&L sheet update → Slack notify

### 2. HVAC
- `voice_bot_outreach.md` — Bland.ai voice agent → lead list → post-call SMS via Twilio
- `lead_gen.md` — Apify Google Maps scrape → Firecrawl enrich → dedupe → Google Sheet + dashboard

### 3. Online Coaching
- `dead_lead_reactivation.md` — Pull GHL closed-lost → Claude personalized message → 7-day email/SMS drip → human handoff on engagement
- `sales_stack.md` — Intake form → CRM contact → GHL nurture → Cal.com booking → post-call follow-up

### 4. Education (K-12)
- `teacher_task_automation.md` — Google Form → auto-grade → parent emails → Google Docs progress reports
- `student_learning.md` — Claude Code chat interface + quiz struggle detection + differentiated practice + teacher dashboard

### 5. HR (Small Orgs)
- `admin_workflow.md` — New hire onboarding → PTO automation → FAQ bot → review cycle reminders
- `ai_adoption_consulting.md` — Audit form (Claude Code) → AI recommendations → PDF report → email delivery

### 6. Healthcare Revenue
- `revenue_cycle.md` — Claims email watch → Claude extract fields → billing code mapping → clearinghouse queue → denial tracking
- `compliance_automation.md` — Cert expiry checker → renewal reminders → RAG policy Q&A bot → audit log

### 7. Water Damage / Remodeling
- `damage_detection.md` — Webhook receives photo → Claude Vision classifies damage → auto-populate report → Slack/email notify
- `upsell_automation.md` — Job complete trigger → Claude personalized upsell → 2-week SMS/email drip → booking route

### 8. E-Commerce
- `marketing_automation.md` — Shopify new product → Claude description + caption → Meta post → abandoned cart drip → review request
- `product_process.md` — Low-stock webhook → supplier reorder email → Shopify↔Sheet sync → product catalog tool

### 9. Pharmaceutical
- `ind_nda_prep.md` — Document upload tool (Claude Code) → field extraction → module section mapping → narrative draft → review routing

### 10. Theater Groups
- `cost_cutting.md` — Box office CSV → Sheet dashboard → promo email sequence → volunteer scheduling app
- `process_automation.md` — Audition form → Airtable by role → rehearsal reminders → press release generator

### 11. Property Appraisal
- `lead_gen.md` — Apify Zillow/Realtor scrape → filter by criteria → Firecrawl enrich contacts → Claude Code dashboard
- `follow_up.md` — 3-email sequence → day 5 SMS → GHL pipeline stage moves → post-appraisal Google review request

### 12. Chiropractic
- `practice_automation.md` — Intake form → new patient record → 24h reminder SMS → post-visit review request → 60-day reactivation SMS

### 13. Women-Owned Businesses
- `ai_consulting.md` — AI audit form (Claude Code) → Claude generates recommendations → n8n assembles PDF → email delivery → 7/30-day follow-up

### 14. Hotels
- `market_research.md` — Apify Booking.com/Expedia scrape → Firecrawl Google/TripAdvisor reviews → Claude sentiment analysis → Airtable pain point catalog → prospect list

---

## Claude Code App Patterns

When building a UI (dashboard, chatbot, audit form, review tool):

- **Single HTML file** — no build step, self-contained
- **Styling**: Tailwind CDN + CSS variables for dark/light theme (same design as the build guide)
- **Fonts**: Satoshi + Cabinet Grotesk via fontshare API
- **Backend calls**: fetch() to n8n webhooks or Python tool endpoints
- **State**: localStorage or URL params; no server-side sessions
- Examples already built: `ai-lead-magnet/frontend/index.html`

When a niche SOP says "Claude Code app," build a single HTML file in `workflows/<niche>/app.html`.

---

## Common Workflow Patterns (SOP Shorthand)

These patterns appear across multiple niches — reference them instead of re-specifying:

**Lead Gen Pattern**: Apify actor → filter/dedupe → Google Sheets append → optional Claude enrichment → dashboard
**Drip Campaign Pattern**: Trigger (form/webhook) → IF check → Email day 1 → Wait 2d → Email day 3 → Wait 2d → SMS day 5 → IF replied → human handoff
**Reactivation Pattern**: Schedule trigger (daily) → query CRM for inactive → Claude personalized message → Twilio SMS → log outcome
**Document Extraction Pattern**: Email/file trigger → download attachment → Claude extract fields → map to schema → write to Sheet/Airtable → notify
**Post-Service Pattern**: Job/visit complete webhook → Wait 24h → review request SMS → Wait 7d → upsell email → track opens

---

## Self-Improvement Loop

When a build fails or a node config is wrong:
1. Read the full error from n8n or the Python tool
2. Check `workflows/templates/` for correct node config
3. Fix and re-validate
4. Update the SOP's Test Plan if something was missing
5. Never delete a SOP — edit it with lessons learned
