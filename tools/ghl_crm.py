"""GoHighLevel CRM — manage contacts, pipeline stages, and triggers."""
import argparse, json, os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY     = os.getenv("GHL_API_KEY", "")
LOCATION_ID = os.getenv("GHL_LOCATION_ID", "")
BASE        = "https://rest.gohighlevel.com/v1"

def _headers():
    return {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

def search_contacts(query: str = None, email: str = None, phone: str = None) -> dict:
    params = {"locationId": LOCATION_ID}
    if query:  params["query"] = query
    if email:  params["email"] = email
    if phone:  params["phone"] = phone
    r = requests.get(f"{BASE}/contacts/search", headers=_headers(), params=params)
    r.raise_for_status()
    return r.json()

def create_contact(data: dict) -> dict:
    payload = {"locationId": LOCATION_ID, **data}
    r = requests.post(f"{BASE}/contacts/", headers=_headers(), json=payload)
    r.raise_for_status()
    return r.json()

def update_contact(contact_id: str, data: dict) -> dict:
    r = requests.put(f"{BASE}/contacts/{contact_id}", headers=_headers(), json=data)
    r.raise_for_status()
    return r.json()

def get_pipelines() -> dict:
    r = requests.get(f"{BASE}/pipelines/", headers=_headers(),
                     params={"locationId": LOCATION_ID})
    r.raise_for_status()
    return r.json()

def move_opportunity(opportunity_id: str, stage_id: str) -> dict:
    r = requests.put(f"{BASE}/pipelines/opportunities/{opportunity_id}",
                     headers=_headers(), json={"pipelineStageId": stage_id})
    r.raise_for_status()
    return r.json()

def add_tag(contact_id: str, tags: list) -> dict:
    r = requests.post(f"{BASE}/contacts/{contact_id}/tags",
                      headers=_headers(), json={"tags": tags})
    r.raise_for_status()
    return r.json()

def get_inactive_contacts(days_inactive: int = 60) -> list:
    """Return contacts with no activity in last N days (requires custom filter)."""
    params = {"locationId": LOCATION_ID, "limit": 100}
    r = requests.get(f"{BASE}/contacts/", headers=_headers(), params=params)
    r.raise_for_status()
    from datetime import datetime, timedelta
    cutoff = datetime.utcnow() - timedelta(days=days_inactive)
    contacts = r.json().get("contacts", [])
    return [c for c in contacts if c.get("dateUpdated") and
            datetime.fromisoformat(c["dateUpdated"].replace("Z","")) < cutoff]

def test_connection() -> dict:
    r = requests.get(f"{BASE}/contacts/", headers=_headers(),
                     params={"locationId": LOCATION_ID, "limit": 1})
    return {"ok": r.status_code == 200, "location_id": LOCATION_ID, "status": r.status_code}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="GoHighLevel CRM tool")
    parser.add_argument("action", choices=["test","search","create","update","pipelines","inactive","tag"])
    parser.add_argument("--query", help="Search query / email / phone")
    parser.add_argument("--id", help="Contact or opportunity ID")
    parser.add_argument("--data", help="JSON string for create/update")
    parser.add_argument("--stage", help="Pipeline stage ID")
    parser.add_argument("--tags", help="Comma-separated tags")
    parser.add_argument("--days", type=int, default=60)
    args = parser.parse_args()

    if args.action == "test":
        print(json.dumps(test_connection(), indent=2))
    elif args.action == "search":
        print(json.dumps(search_contacts(query=args.query), indent=2))
    elif args.action == "create":
        print(json.dumps(create_contact(json.loads(args.data)), indent=2))
    elif args.action == "update":
        print(json.dumps(update_contact(args.id, json.loads(args.data)), indent=2))
    elif args.action == "pipelines":
        print(json.dumps(get_pipelines(), indent=2))
    elif args.action == "inactive":
        print(json.dumps(get_inactive_contacts(args.days), indent=2))
    elif args.action == "tag":
        print(json.dumps(add_tag(args.id, args.tags.split(",")), indent=2))
