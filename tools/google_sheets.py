"""Google Sheets — read ranges, append rows, batch write via service account."""
import argparse, json, os
from dotenv import load_dotenv

load_dotenv()

SA_JSON = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "./credentials.json")

def _service():
    from google.oauth2.service_account import Credentials
    from googleapiclient.discovery import build
    creds = Credentials.from_service_account_file(
        SA_JSON, scopes=["https://www.googleapis.com/auth/spreadsheets"])
    return build("sheets", "v4", credentials=creds).spreadsheets()

def read_range(spreadsheet_id: str, range_notation: str) -> list:
    result = _service().values().get(
        spreadsheetId=spreadsheet_id, range=range_notation).execute()
    return result.get("values", [])

def append_rows(spreadsheet_id: str, range_notation: str, rows: list) -> dict:
    body = {"values": rows}
    result = _service().values().append(
        spreadsheetId=spreadsheet_id, range=range_notation,
        valueInputOption="USER_ENTERED", body=body).execute()
    return result

def write_range(spreadsheet_id: str, range_notation: str, rows: list) -> dict:
    body = {"values": rows}
    result = _service().values().update(
        spreadsheetId=spreadsheet_id, range=range_notation,
        valueInputOption="USER_ENTERED", body=body).execute()
    return result

def batch_write(spreadsheet_id: str, updates: list) -> dict:
    """updates: [{"range": "Sheet1!A1", "values": [[...], ...]}, ...]"""
    body = {"valueInputOption": "USER_ENTERED", "data": updates}
    result = _service().values().batchUpdate(
        spreadsheetId=spreadsheet_id, body=body).execute()
    return result

def clear_range(spreadsheet_id: str, range_notation: str) -> dict:
    result = _service().values().clear(
        spreadsheetId=spreadsheet_id, range=range_notation).execute()
    return result

def leads_to_sheet(spreadsheet_id: str, sheet_name: str, leads: list) -> dict:
    """Write a list of dicts as rows, using keys as header row."""
    if not leads:
        return {}
    headers = list(leads[0].keys())
    rows = [headers] + [[str(l.get(h, "")) for h in headers] for l in leads]
    return write_range(spreadsheet_id, f"{sheet_name}!A1", rows)

def test_connection() -> dict:
    try:
        _service()
        return {"ok": True, "sa_json": SA_JSON}
    except Exception as e:
        return {"ok": False, "error": str(e)}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Google Sheets tool")
    parser.add_argument("action", choices=["test","read","append","write","clear","leads"])
    parser.add_argument("--sheet-id", help="Spreadsheet ID")
    parser.add_argument("--range", help="Range notation e.g. Sheet1!A1:Z100")
    parser.add_argument("--data", help="JSON array of rows [[...],[...]] or path to JSON file")
    parser.add_argument("--leads-file", help="Path to JSON file with leads list")
    parser.add_argument("--sheet-name", default="Sheet1")
    args = parser.parse_args()

    if args.action == "test":
        print(json.dumps(test_connection(), indent=2))
    elif args.action == "read":
        print(json.dumps(read_range(args.sheet_id, args.range), indent=2))
    elif args.action == "clear":
        print(json.dumps(clear_range(args.sheet_id, args.range), indent=2))
    elif args.action in ("append", "write"):
        data = args.data
        if data and os.path.isfile(data):
            with open(data) as f:
                rows = json.load(f)
        else:
            rows = json.loads(data)
        if args.action == "append":
            print(json.dumps(append_rows(args.sheet_id, args.range, rows), indent=2))
        else:
            print(json.dumps(write_range(args.sheet_id, args.range, rows), indent=2))
    elif args.action == "leads":
        with open(args.leads_file) as f:
            leads = json.load(f)
        print(json.dumps(leads_to_sheet(args.sheet_id, args.sheet_name, leads), indent=2))
