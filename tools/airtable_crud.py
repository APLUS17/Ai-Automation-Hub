"""Airtable CRUD — list, create, update, delete records in any base/table."""
import argparse, json, os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY  = os.getenv("AIRTABLE_API_KEY", "")
BASE_ID  = os.getenv("AIRTABLE_BASE_ID", "")
BASE_URL = "https://api.airtable.com/v0"

def _headers():
    return {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

def list_records(table: str, base_id: str = None, filter_formula: str = None,
                 max_records: int = 100) -> list:
    bid = base_id or BASE_ID
    params = {"maxRecords": max_records}
    if filter_formula:
        params["filterByFormula"] = filter_formula
    r = requests.get(f"{BASE_URL}/{bid}/{table}", headers=_headers(), params=params)
    r.raise_for_status()
    return r.json().get("records", [])

def create_record(table: str, fields: dict, base_id: str = None) -> dict:
    bid = base_id or BASE_ID
    r = requests.post(f"{BASE_URL}/{bid}/{table}", headers=_headers(),
                      json={"fields": fields})
    r.raise_for_status()
    return r.json()

def create_records(table: str, records: list, base_id: str = None) -> dict:
    """Batch create up to 10 records at once."""
    bid = base_id or BASE_ID
    payload = {"records": [{"fields": r} for r in records]}
    r = requests.post(f"{BASE_URL}/{bid}/{table}", headers=_headers(), json=payload)
    r.raise_for_status()
    return r.json()

def update_record(table: str, record_id: str, fields: dict, base_id: str = None) -> dict:
    bid = base_id or BASE_ID
    r = requests.patch(f"{BASE_URL}/{bid}/{table}/{record_id}",
                       headers=_headers(), json={"fields": fields})
    r.raise_for_status()
    return r.json()

def delete_record(table: str, record_id: str, base_id: str = None) -> dict:
    bid = base_id or BASE_ID
    r = requests.delete(f"{BASE_URL}/{bid}/{table}/{record_id}", headers=_headers())
    r.raise_for_status()
    return r.json()

def upsert_record(table: str, key_field: str, key_value: str, fields: dict,
                  base_id: str = None) -> dict:
    """Update if exists (matching key_field=key_value), otherwise create."""
    existing = list_records(table, base_id,
                            filter_formula=f"{{{key_field}}} = '{key_value}'")
    if existing:
        return update_record(table, existing[0]["id"], fields, base_id)
    return create_record(table, {key_field: key_value, **fields}, base_id)

def test_connection() -> dict:
    r = requests.get(f"https://api.airtable.com/v0/meta/bases/{BASE_ID}/tables",
                     headers=_headers())
    return {"ok": r.status_code == 200, "base_id": BASE_ID, "status": r.status_code}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Airtable CRUD tool")
    parser.add_argument("action", choices=["test","list","create","update","delete","upsert"])
    parser.add_argument("--table", help="Table name")
    parser.add_argument("--id", help="Record ID")
    parser.add_argument("--fields", help="JSON string of field values")
    parser.add_argument("--filter", help="Airtable filter formula")
    parser.add_argument("--key-field", help="Key field name for upsert")
    parser.add_argument("--key-value", help="Key field value for upsert")
    args = parser.parse_args()

    if args.action == "test":
        print(json.dumps(test_connection(), indent=2))
    elif args.action == "list":
        print(json.dumps(list_records(args.table, filter_formula=args.filter), indent=2))
    elif args.action == "create":
        print(json.dumps(create_record(args.table, json.loads(args.fields)), indent=2))
    elif args.action == "update":
        print(json.dumps(update_record(args.table, args.id, json.loads(args.fields)), indent=2))
    elif args.action == "delete":
        print(json.dumps(delete_record(args.table, args.id), indent=2))
    elif args.action == "upsert":
        print(json.dumps(upsert_record(args.table, args.key_field,
                                       args.key_value, json.loads(args.fields)), indent=2))
