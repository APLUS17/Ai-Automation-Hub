"""Scrape and enrich URLs via Firecrawl — extract structured data from websites."""
import argparse, json, os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("FIRECRAWL_API_KEY", "")
BASE = "https://api.firecrawl.dev/v1"

def _headers():
    return {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

def scrape_url(url: str, formats: list = None) -> dict:
    """Scrape a single URL and return markdown + metadata."""
    payload = {"url": url, "formats": formats or ["markdown"]}
    r = requests.post(f"{BASE}/scrape", headers=_headers(), json=payload)
    r.raise_for_status()
    return r.json().get("data", {})

def extract_contacts(url: str) -> dict:
    """Extract contact info (email, phone, name) from a website."""
    payload = {
        "url": url,
        "formats": ["extract"],
        "extract": {
            "schema": {
                "type": "object",
                "properties": {
                    "email": {"type": "string"},
                    "phone": {"type": "string"},
                    "contact_name": {"type": "string"},
                    "company_name": {"type": "string"},
                    "address": {"type": "string"},
                }
            }
        }
    }
    r = requests.post(f"{BASE}/scrape", headers=_headers(), json=payload)
    r.raise_for_status()
    return r.json().get("data", {}).get("extract", {})

def batch_scrape(urls: list, formats: list = None) -> list:
    """Scrape multiple URLs. Returns list of results."""
    results = []
    for url in urls:
        try:
            results.append({"url": url, **scrape_url(url, formats)})
        except Exception as e:
            results.append({"url": url, "error": str(e)})
    return results

def enrich_leads(leads: list) -> list:
    """Given a list of dicts with 'website' key, enrich with contact data."""
    enriched = []
    for lead in leads:
        website = lead.get("website") or lead.get("url", "")
        if website:
            contacts = extract_contacts(website)
            lead.update(contacts)
        enriched.append(lead)
    return enriched

def test_connection() -> dict:
    r = requests.get(f"{BASE}/account", headers=_headers())
    return {"ok": r.status_code == 200, "status": r.status_code}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Firecrawl scraper")
    parser.add_argument("action", choices=["test","scrape","contacts","batch","enrich"])
    parser.add_argument("--url", help="URL to scrape")
    parser.add_argument("--urls", help="Comma-separated URLs for batch")
    parser.add_argument("--leads", help="Path to JSON file with leads (for enrich)")
    parser.add_argument("--out", help="Output file path")
    args = parser.parse_args()

    result = None
    if args.action == "test":
        result = test_connection()
    elif args.action == "scrape":
        result = scrape_url(args.url)
    elif args.action == "contacts":
        result = extract_contacts(args.url)
    elif args.action == "batch":
        result = batch_scrape(args.urls.split(","))
    elif args.action == "enrich":
        with open(args.leads) as f:
            leads = json.load(f)
        result = enrich_leads(leads)

    output = json.dumps(result, indent=2)
    if args.out:
        with open(args.out, "w") as f:
            f.write(output)
    else:
        print(output)
