# Tool Registry

All tools accept `--test` to verify API connectivity. Load credentials from `.env` via python-dotenv.

| Script | Purpose | `--test` checks |
|---|---|---|
| `n8n_api.py` | List / create / update / activate n8n workflows via REST | n8n instance reachable |
| `apify_runner.py` | Run Apify actors: Google Maps, Zillow, TripAdvisor, etc. | Apify account valid |
| `firecrawl_scraper.py` | Scrape URLs, extract structured contact data | Firecrawl API key valid |
| `twilio_sms.py` | Send SMS, check message status, bulk SMS | Twilio account status |
| `mailgun_email.py` | Send email, create/list templates | Mailgun domain verified |
| `ghl_crm.py` | GHL contacts, pipeline stages, tags, inactive lookup | GHL location accessible |
| `airtable_crud.py` | Airtable records: list, create, update, delete, upsert | Base metadata accessible |
| `google_sheets.py` | Sheets: read range, append rows, write range, batch update | Service account credentials |
| `google_docs_pdf.py` | Create Docs from templates, export PDF, share | Service account credentials |
| `claude_ai.py` | Extract fields, generate text, analyze images, sentiment | Claude API ping |

## Quick test all

```bash
cd /Users/ayo_o/automation-hub
python tools/n8n_api.py test
python tools/apify_runner.py test
python tools/firecrawl_scraper.py test
python tools/twilio_sms.py test
python tools/mailgun_email.py test
python tools/ghl_crm.py test
python tools/airtable_crud.py test
python tools/google_sheets.py test
python tools/google_docs_pdf.py test
python tools/claude_ai.py test
```

## Dependencies

```bash
pip install requests python-dotenv anthropic \
            twilio google-api-python-client google-auth
```
