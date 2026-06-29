# Automation Reliability — Workflow Reliability Audit

## What It Does
Collects log outputs from n8n, Zapier, Make, and custom scripts, normalizes fields in a central Airtable table, and sends them to Claude weekly for error-cluster analysis. Claude produces a prioritized "Reliability Report" highlighting silent failures, rising runtimes, and repeated retries—delivered to MSP teams before business users complain.

**Market context**: MSPs and SMBs deploying AI workflows have no unified view of what's breaking. Jobs time out, integrations silently fail, and retries pile up—discovered only when a frustrated end user calls in, by which point data is already lost or delayed. Silent failure rates run 15–20%, with average detection lag of 2–5 days.

## Integrations Required
- `ANTHROPIC_API_KEY` — Claude for error-cluster analysis and report drafting
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID` — centralized log storage
- `SLACK_BOT_TOKEN` — MSP team notifications
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` — report email delivery

## n8n Workflow Nodes

1. **Schedule Trigger: Weekly** (`n8n-nodes-base.scheduleTrigger`)
   - Mode: every Monday at 7am
   - Kicks off the weekly reliability audit cycle

2. **HTTP Request: Pull Logs** (`n8n-nodes-base.httpRequest`)
   - GET n8n execution logs via API (`/api/v1/executions?status=error&limit=200`)
   - For Zapier/Make: pull via their respective APIs or webhook-forwarded log events

3. **Code: Normalize Log Fields** (`n8n-nodes-base.code`)
   - Standardize fields across platforms: `source_platform`, `workflow_name`, `status`, `error_message`, `runtime_ms`, `retry_count`, `timestamp`
   - Strip PII and sensitive data before storage

4. **Airtable: Store Log Entries** (`n8n-nodes-base.airtable`)
   - Append normalized records to "Execution Logs" table
   - Tag: platform, severity, workflow_id

5. **Claude: Analyze & Draft Report** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)
   - Prompt: "Analyze these workflow execution logs from the past 7 days. Identify: (1) Error clusters by root cause, (2) Workflows with rising runtimes, (3) Repeated retry patterns. For each issue, assign a severity (Critical/Warning/Info) and recommend a fix. Output as a structured Reliability Report."
   - Input: all log entries from past 7 days

6. **Mailgun: Email Report** (`n8n-nodes-base.httpRequest`)
   - Send formatted Reliability Report to MSP team lead
   - Include: executive summary, top 5 risks, full detail appendix

7. **Slack: Notify MSP Team** (`n8n-nodes-base.slack`)
   - Post summary to #ops-alerts channel
   - Tag critical issues with @here mention

## Claude AI Tasks
- Identify error clusters, rising execution runtimes, and repeated retry patterns across all connected platforms
- Draft a plain-English Reliability Report with prioritized fix recommendations and risk levels

## Python Tools Needed
- None required — log ingestion handled via HTTP requests in n8n

## Claude Code App
Not required. Optional: a simple Airtable interface view surfacing the top 5 reliability risks per week.

## Test Plan
1. Feed sample log data with 2 deliberate error clusters into Airtable
2. Trigger schedule manually
3. Confirm Claude flags both clusters with correct severity levels
4. Verify report arrives via email with executive summary and detailed breakdown
5. Confirm Slack notification fires in #ops-alerts channel
