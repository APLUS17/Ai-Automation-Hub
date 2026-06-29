# Legal, IP & Legaltech — IP Database & Alert Workspace

## What It Does
Periodically queries USPTO and trademark registries for terms linked to client portfolios. Claude flags potential conflicts, infringement opportunities, and renewal deadlines. Generates client-ready update summaries and Airtable dashboards, keeping IP attorneys and in-house teams informed without manual registry monitoring.

**Market context**: IP firms tracking patents and trademarks rely on siloed spreadsheets and infrequent manual registry checks. Missed opposition windows and renewal deadlines cost clients thousands in lost rights and litigation exposure. Manual monitoring costs $200–500/month and still misses ~8% of portfolio deadlines.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for conflict analysis and client summary generation
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — IP portfolio tracking
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — client update emails

## n8n Workflow Nodes

1. **Schedule Trigger: Weekly** (`n8n-nodes-base.scheduleTrigger`)
   - Every Monday at 8am

2. **HTTP Request: USPTO API Query** (`n8n-nodes-base.httpRequest`)
   - Query TESS/TSDR for new filings matching client watch terms
   - Query patent databases for citations and new publications in client technology areas

3. **Code: Parse Registry Results** (`n8n-nodes-base.code`)
   - Normalize results: filing_date, applicant, mark_text, goods_services, status
   - Match against client portfolio terms in Airtable

4. **Claude: Flag Conflicts & Opportunities** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Analyze results for: (1) potential conflicts with client marks/patents, (2) renewal deadlines approaching, (3) opposition windows opening, (4) expansion opportunities
   - Output: structured alerts by severity (Critical/Advisory/Informational)

5. **Airtable: Update IP Portfolio** (`n8n-nodes-base.airtable`)
   - Log alerts, update status fields, add new filings to watch list

6. **Mailgun: Client Update Email** (`n8n-nodes-base.httpRequest`)
   - Per-client weekly IP status summary with actionable alerts

## Claude AI Tasks
- Analyze USPTO results for potential conflicts with existing client marks or patents
- Identify renewal deadlines, opposition windows, and expansion opportunities in plain language for client reports

## Python Tools Needed
- None required — all steps handled in n8n

## Test Plan
1. Configure 3 test client terms in Airtable
2. Trigger the weekly schedule and verify USPTO API query fires
3. Confirm Claude returns conflict flags and deadline alerts
4. Check that client update email arrives with correct IP status summary
